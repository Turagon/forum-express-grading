const router = require('express').Router()
const routes = require('./routes')
const apis = require('./apis')

router.use('/', routes)
router.use('/api', apis)

module.exports = router