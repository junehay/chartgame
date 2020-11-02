import { Sequelize } from 'sequelize-typescript';
import { Company } from './company';
import { Member } from './member';
import { Rank } from './rank';
import Config from '../config/config';
const env = process.env.NODE_ENV || 'development';

const config = env === 'production' ? Config.production : Config.development;

export const sequelize = new Sequelize({
  host: config.host,
  database: config.database,
  dialect: 'mysql',
  username: config.username,
  password: config.password
});

sequelize.addModels([Company, Member, Rank]);
// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.js')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// db.Company = require('./company')(sequelize, Sequelize);
// db.Record = require('./record')(sequelize, Sequelize);
// db.Member = require('./member')(sequelize, Sequelize);

// module.exports = db;
