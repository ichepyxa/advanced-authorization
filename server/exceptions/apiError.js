module.exports = class APIError extends Error {
	status
	errors

	constructor(status, message, errors = []) {
		super(message)
		this.status = status
		this.errors = errors
	}

	static UnautorizedError() {
		return new APIError(401, 'Пользователь не авторизирован')
	}

	static BadRequest(message, errors = []) {
		return new APIError(400, message, errors)
	}
}
