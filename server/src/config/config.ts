const config = {
  development: {
    username: process.env.DATABASE_USER as string,
    password: process.env.DATABASE_PWD as string,
    database: process.env.DATABASE as string,
    host: process.env.DATABASE_HOST,
    dialect: 'mysql'
  },
  production: {
    username: process.env.DATABASE_USER as string,
    password: process.env.DATABASE_PWD as string,
    database: process.env.DATABASE as string,
    host: process.env.DATABASE_HOST,
    dialect: 'mysql'
  },
  SECRET_KEY: process.env.SECRET_KEY
};

export default config;
