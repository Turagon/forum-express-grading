const db = require('../models')
const fs = require('fs')
const imgur = require('imgur-node-api')
const { Transaction } = require('sequelize')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const loginRecord = {}

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    const userData = req.body
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    }
    User.create({ ...userData})
    .then(user => {
      req.flash('success_messages', '成功註冊帳號！')
        return res.redirect('/signin')
    })
    .catch(err => {
      req.flash('error_messages', `${err.errors[0].message}`)
      return res.redirect('/signup')
    })
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    const loginKey = (Math.random().toString(12) + Math.random().toString(12))
    req.session.loginKey = loginKey
    loginRecord[req.session.passport.user] = loginKey
    loginRecord['expireTime'] = (new Date).getTime() + 43200000
    res.redirect('/admin')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    User.findAll({
      where: { id: req.params.id },
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: Restaurant, as: 'CommentedRestaurants' },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    })
      .then(user => {
        const userData = user[0].dataValues
        const favoriteList = userData.FavoritedRestaurants
        const favoriteCount = userData.FavoritedRestaurants.length
        const commentList = userData.CommentedRestaurants
        const commentCount = userData.CommentedRestaurants.length
        const followingsList = userData.Followings
        const followingsCount = userData.Followings.length
        const followersList = userData.Followers
        const followersCount = userData.Followers.length
        res.render('profile', { 
          userData,
          favoriteList,
          commentList,
          followingsList,
          followersList,
          favoriteCount,
          commentCount,
          followingsCount,
          followersCount
         })
      })
  },

  editUser: (req, res) => {
    User.findByPk(req.params.id, { raw: true })
      .then(user => res.render('editProfile', { user }))
      .catch(err => console.log(err))
  },

  putUser: (req, res) => {
    const userId = Number(req.params.id)
    const updateData = req.body
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        updateData.image = img.data.link
        return User.findByPk(userId)
          .then(user => {
            user.update({ ...updateData })
              .then(user => res.redirect(`/users/${userId}`))
              .catch(err => console.log(err))
          })
          .catch(err => console.log(err))
      })
    } else {
      return User.findByPk(userId)
        .then(user => {
          user.update({ ...updateData })
            .then(user => res.redirect(`/users/${userId}`))
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    }
  },

  // addFavorite: (req, res) => {
  //   return Favorite.create({
  //     UserId: req.user.id,
  //     RestaurantId: req.params.id
  //   })
  //   .then(favorite => res.redirect('back'))
  // },
  addFavorite: async(req, res) => {
    const t = await db.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
    })
    try {
      const favorite = await Favorite.findOrCreate({
        where: {
          UserId: req.user.id,
          RestaurantId: req.params.id,
        },
        transaction: t
      })
      await t.commit()
      return res.redirect('back')
    } catch (err) {
      await t.rollback()
      req.flash('error_messages', `加入失敗，請稍後再試`)
      return res.redirect('back')
    }
  },

  removeFavorite: (req, res) => {
    Favorite.findOne({ 
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.id
      }
    })
    .then(favorite => {
      favorite.destroy()
      .then(favorite => res.redirect('back'))
    })
    .catch(err => console.log(err))
  },

  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.id
    })
    .then(like => res.redirect('back'))
  },

  removeLike: (req, res) => {
    Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.id
      }
    })
    .then(like => {
      like.destroy()
      .then(like => res.redirect('back'))
    })
    .catch(err => console.log(err))
  },

  getTopUser: (req, res) => {
    const userId = req.user.id
    User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    })
    .then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users, userId })
    })
  },

  addFollowing: (req, res) => {
    Followship.create({
      followerId: req.user.id,
      followingId: req.params.id
    })
    .then(followship => {
      return res.redirect('back')
    })
    .catch(err => console.log(err))
  },

  removeFollowing: (req, res) => {
    Followship.findOne({ where: {
      followerId: req.user.id,
      followingId: req.params.id
    }})
    .then(followship => {
      followship.destroy()
      .then(followship => res.redirect('back'))
    })
    .catch(err => console.log(err))
  }
}

module.exports = { userController, loginRecord }