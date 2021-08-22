const db = require('../models')
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true, nest: true })
      .then(restaurants => {
        return res.render('admin/restaurants', { restaurants })
      })
      .catch(err => console.log(err))
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  postRestaurant: (req, res) => {
    const restaurantData = req.body
    const { file } = req
    
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({ ...restaurantData, image: img.data.link })
                .then(restaurant => {
                  req.flash('success_messages', 'restaurant was successfully created')
                  return res.redirect('/admin/restaurants')
                })
                .catch(err => {
                  const error = err.errors[0].message === 'Validation len on name failed' ? 'Name should between 1 ~ 25 characters' : 'Input datatype might not be correct'
                  req.flash('error_messages', `${error}`)
                  res.redirect('back')
                })
      })
    } else {
      return Restaurant.create({ ...restaurantData, image: null })
      .then((restaurant) => {
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
      .catch(err => {
        const error = err.errors[0].message === 'Validation len on name failed'? 'Name should between 1 ~ 25 characters': 'Input datatype might not be correct'
        req.flash('error_messages', `${error}`)
        res.redirect('back')
      })
    }
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {raw: true})
            .then(restaurant => {
              return res.render('admin/restaurant', {restaurant})
            })
            .catch(err => console.log(err))
  },

  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {raw: true})
            .then(restaurant => {
              return res.render('admin/create', { restaurant })
            })
            .catch(err => console.log(err))
  },

  putRestaurant: (req, res) => {
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
                    .then(restaurant => res.redirect(`/admin/restaurants/${restaurantId}`))
                    .catch(err => {
                      const error = err.errors[0].message === 'Validation len on name failed' ? 'Name should between 1 ~ 25 characters' : 'Input datatype might not be correct'
                      req.flash('error_messages', `${error}`)
                      res.redirect('back')
                    })
                })
        
      }) 
    } else {
      return Restaurant.findByPk(req.params.id)
              .then(restaurant => {
                restaurant.update({ ...updateData })
                  .then(restaurant => res.redirect(`/admin/restaurants/${restaurantId}`))
                  .catch(err => {
                    const error = err.errors[0].message === 'Validation len on name failed' ? 'Name should between 1 ~ 25 characters' : 'Input datatype might not be correct'
                    req.flash('error_messages', `${error}`)
                    res.redirect('back')
                  })
              })
    }
  },

  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
            .then(restaurant => {
              restaurant.destroy()
                .then(restaurant => {
                  return res.redirect('/admin/restaurants')
                })
            })
  }
}

module.exports = adminController