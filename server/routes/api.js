const express = require('express');
const router = express.Router();
const sequelize = require('../models/index').sequelize;
const { Company } = require('../models');
const redis = require('redis');
const client = redis.createClient();
const util = require("util");

sequelize.sync();


router.get('/gameset', async (req, res) => {
    try {
        const uuid = req.session.uuid;
        const companyCode = '005930'; // 랜덤 코드
        let companyData = await Company.findAll({
            where: {
                code: companyCode
            },
            order: [
                ['trading_date', 'ASC']
            ]
        });
        let rand = Math.floor(Math.random() * 19);
        companyData = companyData.slice(rand, rand + 80);

        let gameData = companyData.map((e, index) => {
            let data = {};
            data.price = ['', e.start_price, e.low_price, e.high_price, e.end_price, `시가 : ${e.start_price}\n고가 : ${e.high_price}\n저가 : ${e.low_price}\n 종가 : ${e.end_price}`];
            data.volume = ['', e.volume];
            return data;
        });
        client.hset(uuid, 'gameData', JSON.stringify(gameData));
        client.expire('gameData', 1000);

        res.send('set');
    } catch (err) {
        console.log(err);
    }
});

router.get('/gameget', async (req, res) => {
    const uuid = req.session.uuid;
    const gameData = await getRedisData(uuid, 'gameData');
    const jsonData = JSON.parse(gameData);

    res.json(jsonData);
});


async function getRedisData(key, field){
    const hgetPromise = util.promisify(client.hget).bind(client);
    const redisData = await hgetPromise(key, field)
        .then(data => {
            return data;
        })
        .catch(err => {
            console.log(err);
        });
    return redisData;
};


module.exports = router;