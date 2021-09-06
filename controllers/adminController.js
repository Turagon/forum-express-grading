const db = require('../models')
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const adminService = require('../services/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },

  createRestaurant: (req, res) => {
    return Category.findAll({ raw: true, nest: true })
            .then(categories => res.render('admin/create', { categories }))
            .catch(err => console.log(err))
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      } else {
        req.flash('error_messages', `${data['message']}`)
        res.redirect('back')
      }
    })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },

  editRestaurant: (req, res) => {
    Category.findAll({ raw: true, nest: true })
              .then(categories => {
                return Restaurant.findByPk(req.params.id, {raw: true})
                        .then(restaurant => {
                          return res.render('admin/create', { restaurant, categories })
                        })
                        .catch(err => console.log(err))
              })
              .catch(err => console.log(err))
  },

  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect(`/admin/restaurants/${data['id']}`)
      } else {
        return res.redirect('back')
      }
    })
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },

  getUsers: (req, res) => {
    return User.findAll({raw: true, nest: true})
            .then(users => res.render('admin/users', { users }))
            .catch(err => console.log(err))
  },

  toggleAdmin: (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        user.update({isAdmin: !user.isAdmin})
        .then(user => {
          return res.redirect('/admin/users')
        })
        .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }
}

module.exports = adminController