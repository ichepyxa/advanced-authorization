const jwt = require('jsonwebtoken')
const config = require('../config/config')
const TokenModel = require('../modules/TokenModel')

class TokenService {
	validateAccessToken(refreshToken) {
		try {
			const userData = jwt.verify(refreshToken, config.JWT_ACCESS_SECRET_KEY)
			return userData
		} catch (error) {
			return null
		}
	}

	validateRefreshToken(refreshToken) {
		try {
			const userData = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET_KEY)
			return userData
		} catch (error) {
			return null
		}
	}

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

	async removeToken(refreshToken) {
		const tokenData = await TokenModel.deleteOne({ refreshToken })
		return tokenData
	}

	async findToken(refreshToken) {
		const tokenData = await TokenModel.findOne({ refreshToken })
		return tokenData
	}
}

module.exports = new TokenService()
