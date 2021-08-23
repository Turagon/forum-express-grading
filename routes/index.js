const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers') 

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
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
  
  app.get('/restaurants', authenticated, restController.getRestaurants)

  app.get('/signup', userController.signUpPage)

  app.get('/signin', userController.signInPage)

  app.get('/logout', userController.logout)

  app.post('/signup', userController.signUp)

  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin', 
    failureFlash: true
  }), userController.signIn)

  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)

  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

  app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)

  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)
}
