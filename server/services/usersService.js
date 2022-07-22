const UserModel = require('../modules/UserModel')
const tokenService = require('../services/tokenService')
const mailService = require('../services/mailService')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const config = require('../config/config')
const APIError = require('../exceptions/apiError')

class UserService {
	async login(user) {
		return user
	}

	async registration(email, password) {
		const candidate = await UserModel.findOne({ email })
		if (candidate) {
			throw APIError.BadRequest(
				`Пользователь с почтовым адресом ${email} уже существует.`
			)
		}

		const hashPassword = await bcrypt.hash(password, 7)
		const activationLink = uuid.v4()
		const user = await UserModel.create({
			email,
			password: hashPassword,
			activationLink,
		})

		await mailService.sendActivationAccountMail(
			email,
			`${config.API_URL}/api/auth/verify/${activationLink}`
		)

		const payload = {
			id: user._id,
			email,
			activationLink,
		}

		const tokens = tokenService.generateTokens(payload)
		await tokenService.saveRefreshToken(user._id, tokens.refreshToken)

		return {
			...tokens,
			user: payload,
		}
	}

	async logout(user) {
		return user
	}

	async verify(activationLink) {
		const user = await UserModel.findOne({ activationLink })

		if (!user) {
			throw APIError.BadRequest('Неверная ссылка активации')
		}

		user.isActivated = true
		await user.save()
	}

	async refresh(req, res, next) {
		try {
		} catch (error) {
			res.status(400).json(error)
		}
	}

	async users() {
		const users = await UserModel.find()
		return users
	}
}

module.exports = new UserService()
