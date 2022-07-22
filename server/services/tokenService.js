const jwt = require('jsonwebtoken')
const config = require('../config/config')
const TokenModel = require('../modules/TokenModel')

class TokenService {
	generateTokens(payload) {
		const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET_KEY, {
			expiresIn: '20m',
		})
		const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET_KEY, {
			expiresIn: '20d',
		})
		return {
			accessToken,
			refreshToken,
		}
	}

	async saveRefreshToken(userId, refreshToken) {
		const tokenData = await TokenModel.findOne({ user: userId })
		if (tokenData) {
			tokenData.refreshToken = refreshToken
			return tokenData.save()
		}

		const token = await TokenModel.create({ user: userId, refreshToken })
		return token
	}
}

module.exports = new TokenService()
