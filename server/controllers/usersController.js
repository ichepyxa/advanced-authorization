const config = require('../config/config')
const UsersService = require('../services/usersService')
const { validationResult } = require('express-validator')
const APIError = require('../exceptions/apiError')

class UserController {
	async login(req, res, next) {
		try {
		} catch (error) {
			next(error)
		}
	}

	async registration(req, res, next) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				throw APIError.BadRequest('Ошибка при регистрации', errors)
			}

			const { email, password } = req.body
			const newUserData = await UsersService.registration(email, password)

			res.cookie('refreshToken', newUserData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			res.json(newUserData)
		} catch (error) {
			next(error)
		}
	}

	async logout(req, res, next) {
		try {
		} catch (error) {
			next(error)
		}
	}

	async verify(req, res, next) {
		try {
			const activationLink = req.params.link
			await UsersService.verify(activationLink)

			return res.redirect(config.CLIENT_URL)
		} catch (error) {
			next(error)
		}
	}

	async refresh(req, res, next) {
		try {
		} catch (error) {
			next(error)
		}
	}

	async users(req, res, next) {
		try {
			const users = await UsersService.users()
			res.json(users)
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new UserController()
