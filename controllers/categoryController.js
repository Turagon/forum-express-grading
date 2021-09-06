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
    adminService.deleteCategory(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/categories')
      } else {
        req.flash('error_messages', '刪除失敗')
        return res.redirect('back')
      }
    })
  }
}

module.exports = categoryController