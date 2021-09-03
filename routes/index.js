const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const { userController, loginRecord } = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers') 
const { authenticate } = require('passport')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    const userId = req.session.passport ? req.session.passport.user: ''
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
      if (helpers.getUser(req).isAdmin) {return next()}
      return res.redirect('/restaurants')
    }
    return res.redirect('/signin')
  }

  app.get('/', (req, res) => res.redirect('/restaurants'))
  
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)

  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)

  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)

  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)

  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  
  app.get('/restaurants', authenticated, restController.getRestaurants)

  app.get('/restaurants/top', authenticated, restController.getTopRestaurants)

  app.get('/restaurants/:id', authenticated, restController.getRestaurant)

  app.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)

  app.get('/signup', userController.signUpPage)

  app.get('/signin', userController.signInPage)

  app.get('/logout', userController.logout)

  app.get('/users/top', authenticated, userController.getTopUser)

  app.get('/users/:id', authenticated, userController.getUser)

  app.get('/users/:id/edit', authenticated, userController.editUser)

  app.post('/signup', userController.signUp)

  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin', 
    failureFlash: true
  }), userController.signIn)

  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)

  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)

  app.post('/comments', authenticated, commentController.postComment)

  app.post('/favorite/:id', authenticated, userController.addFavorite)

  app.post('/like/:id', authenticated, userController.addLike)

  app.post('/following/:id', authenticated, userController.addFollowing)

  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

  app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)

  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)

  app.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

  app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

  app.delete('/favorite/:id', authenticated, userController.removeFavorite)

  app.delete('/like/:id', authenticated, userController.removeLike)

  app.delete('/following/:id', authenticated, userController.removeFollowing)
}
