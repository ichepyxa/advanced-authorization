import axios from 'axios'
import { AuthResponse } from '../models/response/authResponse'

export const API_URL = 'http://localhost:5000/api/auth'

const api = axios.create({
	withCredentials: true,
	baseURL: API_URL,
})

api.interceptors.request.use((config: any) => {
	config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
	return config
})

api.interceptors.response.use(
	(config: any) => {
		return config
	},
	async error => {
		const originalRequest = error.config
		if (
			error.response.status === 401 &&
			error.config &&
			error.config._isRetry
		) {
			try {
				originalRequest._isRetry = true
				const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
					withCredentials: true,
				})
				localStorage.setItem('token', response.data.accessToken)
				return api.request(originalRequest)
			} catch (error) {
				console.log(error)
			}
		}
		throw error
	}
)

export default api
