const db = require('../models')
const Category = db.Category
const adminService = require('../services/adminService')

const categoryController = {
  getCategories: (req, res) => {
    adminService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
  },

  postCategory: (req, res) => {
    adminService.postCategory(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/categories')
      } else {
        return res.redirect('back')
      }
    })
  },

  putCategory: (req, res) => {
    adminService.putCategory(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/categories')
      } else {
        return res.redirect('back')
      }
    })
  },

  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
            .then(category => {
              category.destroy()
              .then(category => res.redirect('/admin/categories'))
              .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
  }
}

module.exports = categoryController