const UserModel = require('../modules/UserModel')
const tokenService = require('../services/tokenService')
const mailService = require('../services/mailService')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const config = require('../config/config')
const APIError = require('../exceptions/apiError')

class UserService {
	async generateResponse(id, email, activationLink) {
		const payload = {
			id: id,
			email,
			activationLink,
		}

		const tokens = tokenService.generateTokens(payload)
		await tokenService.saveRefreshToken(id, tokens.refreshToken)

		return {
			...tokens,
			user: payload,
		}
	}

	async login(email, password) {
		const user = await UserModel.findOne({ email })
		if (!user) {
			throw APIError.BadRequest(
				`Пользователь с почтовым адресом ${email} не найден.`
			)
		}

		const isPasswordEquals = await bcrypt.compare(password, user.password)
		if (!isPasswordEquals) {
			throw APIError.BadRequest('Неверный email или пароль')
		}

		const info = await this.generateResponse(
			user._id,
			email,
			user.activationLink
		)
		return info
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

		const info = await this.generateResponse(user._id, email, activationLink)
		return info
	}

	async logout(refreshToken) {
		const token = await tokenService.removeToken(refreshToken)
		return token
	}

	async verify(activationLink) {
		const user = await UserModel.findOne({ activationLink })

		if (!user) {
			throw APIError.BadRequest('Неверная ссылка активации')
		}

		user.isActivated = true
		await user.save()
	}

	async refresh(refreshToken) {
		if (!refreshToken) {
			throw APIError.UnautorizedError()
		}

		const userData = tokenService.validateRefreshToken(refreshToken)
		const tokenFromDB = await tokenService.findToken(refreshToken)

		if (!userData || !tokenFromDB) {
			throw APIError.UnautorizedError()
		}

		const user = await UserModel.findById(userData.id)
		this.generateResponse(user._id, user.email, user.activationLink)
	}

	async users() {
		const users = await UserModel.find()
		return users
	}
}

module.exports = new UserService()
