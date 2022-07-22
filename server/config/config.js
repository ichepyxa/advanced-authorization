module.exports = {
	PORT: process.env.PORT || 5000,
	DB_URL: `mongodb+srv://admin:${
		process.env.password || ''
	}@cluster0.yd41umr.mongodb.net/advancedAuth?retryWrites=true&w=majority`,
	JWT_ACCESS_SECRET_KEY: 'SUPER-MEGA-ACCESS-KEY',
	JWT_REFRESH_SECRET_KEY: 'SUPER-MEGA-REFRESH-KEY',
	SMTP_HOST: 'smtp.gmail.com',
	SMTP_PORT: 587,
	SMTP_USER: process.env.smtpUser || '',
	SMTP_PASSWORD: process.env.smtpPassword || '',
	API_URL: 'http://localhost:5000',
	CLIENT_URL: 'http://localhost:3000',
}
