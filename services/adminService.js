const db = require('../models')
// const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category

const adminService = {
  getRestaurants: (req, res, cb) => {
    return Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      .then(restaurants => cb({ restaurants }))
      .catch(err => console.log(err))
  },

  getRestaurant: (req, res, cb) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] })
      .then(restaurant => {
        restaurant = restaurant.toJSON()
        return cb({ restaurant })
      })
      .catch(err => console.log(err))
  },

  getCategories: (req, res, cb) => {
    return Category.findAll({ raw: true, nest: true })
      .then(categories => {
        if (req.params.id) {
          Category.findByPk(req.params.id)
            .then(category => {
              category = category.toJSON()
              return cb({ categories, category })
            })
            .catch(err => console.log(err))
        } else {
          return cb({ categories })
        }
      })
      .catch(err => console.log(err))
  },

  deleteRestaurant: (req, res, cb) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
          .then(restaurant => {
            return cb({ status: 'success', message: '' })
          })
      })
  },

  postRestaurant: (req, res, cb) => {
    const restaurantData = req.body
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({ ...restaurantData, image: img.data.link })
          .then(restaurant => {
            return cb({ status: 'success', message: 'restaurant was successfully created' })
          })
          .catch(err => {
            const error = err.errors[0].message === 'Validation len on name failed' ? 'Name should between 1 ~ 25 characters' : 'Input datatype might not be correct'
            req.flash('error_messages', `${error}`)
            return cb({ status: 'error', message: `${error}` })
          })
      })
    } else {
      return Restaurant.create({ ...restaurantData, image: null })
        .then((restaurant) => {
          return cb({ status: 'success', message: 'restaurant was successfully created' })
        })
        .catch(err => {
          const error = err.errors[0].message === 'Validation len on name failed' ? 'Name should between 1 ~ 25 characters' : 'Input datatype might not be correct'
          req.flash('error_messages', `${error}`)
          return cb({ status: 'error', message: `${error}` })
        })
    }
  },

  putRestaurant: (req, res, cb) => {
    const updateData = req.body
    const restaurantId = req.params.id
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        updateData.image = img.data.link
        return Restaurant.findByPk(restaurantId)
          .then(restaurant => {
            restaurant.update({ ...updateData })
              .then(restaurant => cb({ status: 'success', restaurant, id: restaurantId }))
              .catch(err => {
                const error = err.errors[0].message === 'Validation len on name failed' ? 'Name should between 1 ~ 25 characters' : 'Input datatype might not be correct'
                req.flash('error_messages', `${error}`)
                return cb({ status: 'error', message: `${error}`})
              })
          })

      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then(restaurant => {
          restaurant.update({ ...updateData })
            .then(restaurant => cb({ status: 'success', restaurant, id: restaurantId }))
            .catch(err => {
              const error = err.errors[0].message === 'Validation len on name failed' ? 'Name should between 1 ~ 25 characters' : 'Input datatype might not be correct'
              req.flash('error_messages', `${error}`)
              return cb({ status: 'error', message: `${error}` })
            })
        })
    }
  },

  postCategory: (req, res, cb) => {
    const name = req.body.name
    if (!name) {
      return cb({ status: 'error', message: 'Category name can not be blank' })
    } else {
      return Category.create({ name })
        .then(category => cb({ status: 'success', category }))
        .catch(err => console.log(err))
    }
  },
}

module.exports = adminService