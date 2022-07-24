import axios from 'axios'
import { makeAutoObservable } from 'mobx'
import { API_URL } from '../http'
import { IUser } from '../models/IUser'
import { AuthResponse } from '../models/response/authResponse'
import AuthService from '../services/authService'

export default class Store {
	user = {} as IUser
	isAuth = false
	isLoading = false

	constructor() {
		makeAutoObservable(this)
	}

	setAuth(bool: boolean) {
		this.isAuth = bool
	}

	setUser(user: IUser) {
		this.user = user
	}

	setLoading(bool: boolean) {
		this.isLoading = bool
	}

	async login(email: string, password: string) {
		this.setLoading(true)
		try {
			const response = await AuthService.login(email, password)
			localStorage.setItem('token', response.data.accessToken)
			this.setUser(response.data.user)
			this.setAuth(true)
			this.setAuth(true)
		} catch (error: any) {
			console.log(error.response?.data?.message)
		} finally {
			this.setLoading(false)
		}
	}

	async registration(email: string, password: string) {
		this.setLoading(true)
		try {
			const response = await AuthService.registration(email, password)
			localStorage.setItem('token', response.data.accessToken)
			this.setUser(response.data.user)
			this.setAuth(true)
		} catch (error: any) {
			console.log(error.response?.data?.message)
		} finally {
			this.setLoading(false)
		}
	}

	async logout() {
		this.setLoading(true)
		try {
			await AuthService.logout()
			localStorage.removeItem('token')
			this.setUser({} as IUser)
			this.setAuth(false)
		} catch (error: any) {
			console.log(error.response?.data?.message)
		} finally {
			this.setLoading(false)
		}
	}

	async checkAuth() {
		try {
			const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
				withCredentials: true,
			})
			localStorage.setItem('token', response.data.accessToken)
			this.setUser(response.data.user)
			this.setAuth(true)
		} catch (error: any) {
			console.log(error.response?.data?.message)
		}
	}
}
