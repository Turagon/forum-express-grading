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
    // const name = req.body.name
    // if (!name) {
    //   req.flash('error_messages', 'Category name can not be blank')
    //   return res.redirect('back')
    // } else {
    //   return Category.create({ name })
    //     .then(category => res.redirect('/admin/categories'))
    //     .catch(err => console.log(err))
    // }
    adminService.postCategory(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.json(data['category'])
      } else {
        return res.redirect('back')
      }
    })
  },

  putCategory: (req, res) => {
    const name = req.body.name
    if (!name) {
      req.flash('error_messages', 'Category name can not be blank')
      return res.redirect('back')
    } else {
      return Category.findByPk(req.params.id)
        .then(category => {
          category.update({ name })
            .then(category => res.redirect('/admin/categories'))
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    }
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