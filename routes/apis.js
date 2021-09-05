// const restController = require('../controllers/api/restController')
const adminController = require('../controllers/api/adminController')
// const { userController, loginRecord } = require('../controllers/api/userController')
// const categoryController = require('../controllers/api/categoryController')
// const commentController = require('../controllers/api/commentController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers')
const passport = require('../config/passport')
const router = require('express').Router()

const authenticated = (req, res, next) => {
  const userId = req.session.passport ? req.session.passport.user : ''
  let loginKey = req.session.loginKey
  if (loginRecord[userId] && loginRecord[userId] === loginKey && loginRecord.expireTime >= (new Date).getTime()) {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
  }
  return res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) { return next() }
    return res.redirect('/restaurants')
  }
  return res.redirect('/signin')
}

router.get('/', (req, res) => res.redirect('/restaurants'))

router.get('/admin', (req, res) => res.redirect('/admin/restaurants'))

router.get('/admin/restaurants', adminController.getRestaurants)

router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)

router.get('/admin/restaurants/:id', adminController.getRestaurant)

router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)

router.get('/admin/users', authenticatedAdmin, adminController.getUsers)

// router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)

// router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)

// router.get('/restaurants', authenticated, restController.getRestaurants)

// router.get('/restaurants/top', authenticated, restController.getTopRestaurants)

// router.get('/restaurants/:id', authenticated, restController.getRestaurant)

// router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)

// router.get('/signup', userController.signUpPage)

// router.get('/signin', userController.signInPage)

// router.get('/logout', userController.logout)

// router.get('/users/top', authenticated, userController.getTopUser)

// router.get('/users/:id', authenticated, userController.getUser)

// router.get('/users/:id/edit', authenticated, userController.editUser)

// router.post('/signup', userController.signUp)

// router.post('/signin', passport.authenticate('local', {
//   failureRedirect: '/signin',
//   failureFlash: true
// }), userController.signIn)

router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)

// router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)

// router.post('/comments', authenticated, commentController.postComment)

// router.post('/favorite/:id', authenticated, userController.addFavorite)

// router.post('/like/:id', authenticated, userController.addLike)

// router.post('/following/:id', authenticated, userController.addFollowing)

router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

router.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)

// router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)

// router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

// router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

// router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

// router.delete('/favorite/:id', authenticated, userController.removeFavorite)

// router.delete('/like/:id', authenticated, userController.removeLike)

// router.delete('/following/:id', authenticated, userController.removeFollowing)


module.exports = router