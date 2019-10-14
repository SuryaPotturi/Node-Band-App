const Sequelize = require('sequelize')
const BandModel = require('./models/band.js');
const UserModel = require('./models/user.js');

const sequelize = new Sequelize('dbname', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

const User = UserModel(sequelize, Sequelize)
const Band = BandModel(sequelize, Sequelize)

User.hasMany(Band);

sequelize.sync({ force: true })
    .then(() => {
        console.log(`Database  created!`)
    })

module.exports = {
    User,
    Band
}