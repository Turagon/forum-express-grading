const db = require('../../models')
const Category = db.Category
const adminService = require('../../services/adminService')

const categoryController = {
  getCategories: (req, res) => {
    adminService.getCategories(req, res, (data) => {
      return res.json(data)
    })
  },

  postCategory: (req, res) => {
    adminService.postCategory(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.json(data['category'])
      } else {
        return res.redirect('back')
      }
    })
  },

  putCategory: (req, res) => {
    adminService.putCategory(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.json(data['category'])
      } else {
        return res.redirect('back')
      }
    })
  },

  deleteCategory: (req, res) => {
    adminService.deleteCategory(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = categoryController