import { observer } from 'mobx-react-lite'
import React, { FC, useContext, useEffect, useState } from 'react'
import { Context } from '.'
import LoginForm from './components/LoginForm'
import { IUser } from './models/IUser'
import UserService from './services/userService'

const App: FC = () => {
	const { store } = useContext(Context)
	const [users, setUsers] = useState<IUser[]>([])

	useEffect(() => {
		if (localStorage.getItem('token')) {
			store.checkAuth()
		}
	}, [])

	if (store.isLoading) {
		return <div>Загрузка...</div>
	}

	if (!store.isAuth) {
		return (
			<div>
				<h1>Зарегестрируйтесь или войдите в аккаунт</h1>
				<LoginForm />
			</div>
		)
	}

	const getUsers = async () => {
		try {
			const response = await UserService.users()
			setUsers(response.data)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div>
			<h1>Здраствуйте, {store.user.email}</h1>
			<button onClick={() => store.logout()}>Выйти</button>
			<div>
				<button onClick={getUsers}>Получить пользователей</button>
				<div>
					{users && users.map(user => <div key={user.email}>{user.email}</div>)}
				</div>
			</div>
		</div>
	)
}

export default observer(App)
