const APIError = require('../exceptions/apiError')
const tokenService = require('../services/tokenService')

module.exports = function (req, res, next) {
	try {
		const authorizationHeader = req.headers.authorization
		if (!authorizationHeader) {
			return next(APIError.UnautorizedError())
		}

		const accessToken = authorizationHeader.split(' ')[1]
		if (!accessToken) {
			return next(APIError.UnautorizedError())
		}

		const userData = tokenService.validateAccessToken(accessToken)
		if (!userData) {
			return next(APIError.UnautorizedError())
		}

		req.user = userData
		next()
	} catch (error) {
		return next(APIError.UnautorizedError())
	}
}
