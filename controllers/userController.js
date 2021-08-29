const db = require('../models')
const fs = require('fs')
const imgur = require('imgur-node-api')
const user = require('../models/user')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship

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
    res.redirect('/admin')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    const userId = req.params.id
    User.findAndCountAll({where: {id: userId}, raw: true, nest: true, include: [
      Comment, 
      {model: Comment, include: [Restaurant]}
    ]})
    .then(users => {
      const commentNum = users.count
      const user = users.rows[0]
      const comment = (users.rows).map(item => {
        return item.Comments.Restaurant
      })
      const repeatCheck = new Set
      const comments = []
      for (let i = 0; i < comment.length; i++) {
        if (!repeatCheck.has(comment[i].id)) {
          comments.push(comment[i])
          repeatCheck.add(comment[i].id)
        }
      }
      res.render('profile', { user, comments, commentNum })
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

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.id
    })
    .then(favorite => res.redirect('back'))
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

module.exports = userController