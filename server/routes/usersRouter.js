const Router = require('express')
const UserController = require('../controllers/usersController')
const { body } = require('express-validator')
const authMiddleware = require('../middlewares/authMiddleware')

const router = new Router()

router.post('/login', UserController.login)
router.post(
	'/registration',
	body('email').isEmail(),
	body('password').isLength({ min: 6, max: 32 }),
	UserController.registration
)
router.get('/logout', UserController.logout)
router.get('/verify/:link', UserController.verify)
router.get('/refresh', UserController.refresh)
router.get('/users', authMiddleware, UserController.users)

module.exports = router
