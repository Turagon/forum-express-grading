const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const Comment = db.Comment
const Favorite = db.Favorite
const Sequelize = require('sequelize')
const Op = require('sequelize')
const pageLimit = 10
const favoriteCount = 10 //人氣餐廳顯示數量

const restController = {
  getRestaurants: (req, res) => {
    const whereQuery = {}
    let categoryId = ''
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }
    Restaurant.findAndCountAll({ include: Category, where: whereQuery, offset, limit: pageLimit })
      .then(restaurants => {
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(restaurants.count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 > 0? page - 1: 1
        const next = page + 1 > pages? pages: page + 1
        restaurants = restaurants.rows.map(item => ({
          ...item.dataValues,
          description: item.dataValues.description.substring(0, 50),
          categoryName: item.Category.name,
          isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(item.id),
          isLiked: req.user.LikedRestaurants.map(d => d.id).includes(item.id)
        }))
        Category.findAll({ raw: true, nest: true })
          .then(categories => {
            return res.render('restaurants', { restaurants, categories, categoryId, page, totalPage, prev, next })
          })
      })
      .catch(err => console.log(err))
  },

  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, { 
      include: [
        Category,
        { model: Comment, include: [User] },
        { model: User, as: 'FavoritedUsers'}, //透過Favorite table去撈收藏這餐廳的user名單
        { model: User, as: 'LikedUsers'} 
      ]})
      .then(restaurant => {
        restaurant.increment(['viewCounts'], {by: 1})
          .then(restaurant => {
            restaurant = restaurant.toJSON()
            restaurant['isFavorited'] = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
            restaurant['isLiked'] = restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
            return res.render('restaurant', { restaurant })
          })
      })
      .catch(err => console.log(err))
  },

  getDashboard: (req, res) => {
    const restaurantId = req.params.id
    Restaurant.findAndCountAll({ where: {id: restaurantId}, include: [
      Category,
      Comment
    ]})
    .then(restaurant => {
      const commentNum = restaurant.count
      restaurant = restaurant.rows[0].dataValues
      return res.render('dashboard', { commentNum, restaurant })
    })
    .catch(err => console.log(err))
  },

  getTopRestaurants: (req, res) => {
    Favorite.findAll({
      raw: true,
      limit: 10,
      order: [[Sequelize.literal('FavoriteCount'), "DESC"]],
      attributes: [
        [Sequelize.fn('count', Sequelize.col('UserId')), 'FavoriteCount'],
      ],
      group: ['RestaurantId'],
      include: [
        {
          model: Restaurant,
          as: 'Restaurant'
        }
      ]
    })
    .then(restaurants => {
      restaurants = restaurants.map(item => ({
        id: item['Restaurant.id'],
        name: item['Restaurant.name'],
        image: item['Restaurant.image'],
        description: item['Restaurant.description'].substring(0, 20),
        votes: item.FavoriteCount,
        voted: req.user.FavoritedRestaurants.map(d => d.id).includes(item['Restaurant.id'])
      }))
      restaurants = restaurants.sort((a, b) => b.votes - a.votes).slice(0, favoriteCount)
      return res.render('topRestaurant', { restaurants })
    })
  }
}

module.exports = restController