module.exports = {
  "development": {
    "username": process.env.DATABASE_USER,
    "password": process.env.DATABASE_PWD,
    "database": process.env.DATABASE,
    "host": process.env.DATABASE_HOST,
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.DATABASE_USER,
    "password": process.env.DATABASE_PWD,
    "database": process.env.DATABASE,
    "host": process.env.DATABASE_HOST,
    "dialect": "mysql"
  },
  "SECRET_KEY": process.env.SECRET_KEY
}