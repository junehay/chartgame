const express = require('express');
const router = express.Router();
const sequelize = require('../models/index').sequelize;
const { Company } = require('../models');
const redis = require('redis');
const client = redis.createClient();
const util = require("util");

sequelize.sync();

router.get('/shift', async (req, res) => {
    try{
        const uuid = req.session.uuid;
        const gameData = await getRedisData(uuid, 'gameData');
        const jsonData = JSON.parse(gameData);
        if(jsonData['chart'].length > 50){
            let shiftData = jsonData['chart'].shift();
            client.hset(uuid, 'gameData', JSON.stringify(jsonData));
            client.expire('gameData', 3600);

            res.json(shiftData);
        }
    }catch(err){
        console.log(err);
    }
});

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

        let gameData = {};
        let chartData = companyData.map((e, index) => {
            let data = {};
            data.price = ['', e.low_price, e.start_price, e.end_price, e.high_price, `시가 : ${e.start_price.toLocaleString()}\n고가 : ${e.high_price.toLocaleString()}\n저가 : ${e.low_price.toLocaleString()}\n 종가 : ${e.end_price.toLocaleString()}`];
            data.volume = ['', e.volume];
            return data;
        });
        gameData.chart = chartData;
        gameData.position = {
            next_btn: 'buy',
            buy_price: 0,
            stocks: 0
        };
        gameData.user = {
            win: 0,
            lose: 0,
            acc_gain_price: 0,
            account: 100000000
        };
        
        client.hset(uuid, 'gameData', JSON.stringify(gameData));
        client.expire('gameData', 3600);

        res.json(gameData);
    } catch (err) {
        console.log(err);
    }
});

router.get('/gameget', async (req, res) => {
    const uuid = req.session.uuid;
    const gameData = await getRedisData(uuid, 'gameData');
    if(!gameData){
        res.redirect('/api/gameset')
    }else{
        const jsonData = JSON.parse(gameData);
        console.log(jsonData['chart'].length)
        res.json(jsonData);
    }
});

router.post('/buy', async (req, res) => {
    const nowPrice = req.body.nowPrice;
    try {
        const uuid = req.session.uuid;
        const gameData = await getRedisData(uuid, 'gameData');
        const jsonData = JSON.parse(gameData);
        const account = jsonData['user'].account;
        const stocks = Math.floor(account/nowPrice);
        console.log('account : ', account)
        jsonData['position'].next_btn = 'sell';
        jsonData['position'].buy_price = nowPrice;
        jsonData['position'].stocks = stocks;
        jsonData['user'].account = account - nowPrice * stocks;

        client.hset(uuid, 'gameData', JSON.stringify(jsonData));
        client.expire('gameData', 3600);

        res.json({account: account - nowPrice * stocks});
    } catch (err) {
        console.log(err);
    }
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