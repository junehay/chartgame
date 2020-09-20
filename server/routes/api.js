const express = require('express');
const router = express.Router();
const sequelize = require('../models/index').sequelize;
const { Company } = require('../models');
const { Record } = require('../models');
const redis = require('redis');
const client = redis.createClient('6379', process.env.REDIS_HOST);
const util = require('util');
const moment = require('moment');

sequelize.sync();

router.post('/shift', async (req, res) => {
    try{
        const uuid = req.session.uuid;
        const gameData = await getRedisData(uuid, 'gameData');
        const jsonData = JSON.parse(gameData);
        if(jsonData['chart'].length > 50){
            let shiftData = jsonData['chart'].shift();
            client.hset(uuid, 'gameData', JSON.stringify(jsonData));
            client.expire('gameData', 3600);

            res.json(shiftData);
        }else{
            res.send('end');
        }
    }catch(err){
        console.log(err);
    }
});

router.post('/gameset', async (req, res) => {
    try {
        const uuid = req.session.uuid;
        const code = await Company.findOne({
            attributes: ['code'],
            order: sequelize.random(),
            raw: true
        });
        
        const companyCode = code.code;
        let companyData = await Company.findAll({
            where: {
                code: companyCode
            },
            order: [
                ['trading_date', 'ASC']
            ]
        });
        let rand = Math.floor(Math.random() * 20);
        companyData = companyData.slice(rand, rand + 80);

        let companyName;
        let startDate;
        let endDate;
        let chartData = companyData.map((e, index) => {
            let data = {};
            data.price = ['', e.low_price, e.start_price, e.end_price, e.high_price, `시가 : ${e.start_price.toLocaleString()}\n고가 : ${e.high_price.toLocaleString()}\n저가 : ${e.low_price.toLocaleString()}\n 종가 : ${e.end_price.toLocaleString()}`];
            data.volume = ['', e.volume];
            if(index === 0){
                startDate = e.trading_date;
                companyName = e.name;
            }else if(index === 79){
                endDate = e.trading_date;
            }
            return data;
        });

        let gameData = {};
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
        gameData.company = companyName;
        gameData.start_date = moment(startDate).format('YYYY-MM-DD');
        gameData.end_date = moment(endDate).format('YYYY-MM-DD');
        
        client.hset(uuid, 'gameData', JSON.stringify(gameData));
        client.expire('gameData', 3600);
        res.redirect(307, '/api/gameget');
    } catch (err) {
        console.log(err);
    }
});

router.post('/gameget', async (req, res) => {
    const uuid = req.session.uuid;
    const gameData = await getRedisData(uuid, 'gameData');
    if(!gameData){
        res.redirect(307, '/api/gameset')
    }else{
        const jsonData = JSON.parse(gameData);
        res.json(jsonData);
    }
});

router.post('/buy', async (req, res) => {
    try {
        const uuid = req.session.uuid;
        const gameData = await getRedisData(uuid, 'gameData');
        const jsonData = JSON.parse(gameData);
        const nowPrice = jsonData['chart'][49].price[3]; // [{"price":[option, low, start, end, high, tooltip],"volume":[option, value]}, ...]
        const account = jsonData['user'].account;
        const stocks = Math.floor(account/nowPrice);
        jsonData['position'].next_btn = 'sell';
        jsonData['position'].buy_price = nowPrice;
        jsonData['position'].stocks = stocks;
        jsonData['user'].account = account - nowPrice * stocks;

        client.hset(uuid, 'gameData', JSON.stringify(jsonData));
        client.expire('gameData', 3600);

        res.json({nowPrice: nowPrice, stocks: stocks, account: account - nowPrice * stocks});
    } catch (err) {
        console.log(err);
    }
});

router.post('/sell', async (req, res) => {
    try {
        const uuid = req.session.uuid;
        const gameData = await getRedisData(uuid, 'gameData');
        const jsonData = JSON.parse(gameData);
        const nowPrice = jsonData['chart'][49].price[3];
        const buyPrice = jsonData['position'].buy_price;
        const stocks = jsonData['position'].stocks;
        const nowAccount = jsonData['user'].account;
        jsonData['position'].next_btn = 'buy';
        jsonData['position'].buy_price = 0;
        jsonData['position'].stocks = 0;

        let result;
        if (nowPrice - buyPrice > 0) {
            result = 'win';
            jsonData['user'].win += 1;
        } else {
            result = 'lose';
            jsonData['user'].lose += 1;
        }
        const gainPrice = (nowPrice - buyPrice) * stocks;
        const afterAccount = nowAccount + nowPrice * stocks
        jsonData['user'].acc_gain_price += gainPrice;
        jsonData['user'].account = afterAccount;

        client.hset(uuid, 'gameData', JSON.stringify(jsonData));
        client.expire('gameData', 3600);

        res.json({result: result, gainPrice: gainPrice, account: afterAccount});
    } catch (err) {
        console.log(err);
    }
});

router.post('/endgame', async (req, res) => {
    try{
        const uuid = req.session.uuid;
        const gameData = await getRedisData(uuid, 'gameData');
        const jsonData = JSON.parse(gameData);
        const company = jsonData.company;
        const date = `${jsonData.start_date} ~ ${jsonData.end_date}`;
        const userData = jsonData.user;
        const accGainPrice = userData.acc_gain_price;
        const account = userData.account;
        const win = userData.win;
        const lose = userData.lose;
        const vicPercent = isNaN((win/(win+lose)))?0:(win/(win+lose)*100).toFixed(2);
        res.json({
            vicPercent: vicPercent,
            accGainPrice: accGainPrice,
            account: account,
            company: company,
            date: date
        });
    }catch(err){
        console.log('err : ', err)
    }
});

router.post('/rankset', async (req, res) => {
    try {
        const name = req.body.name;
        const company = req.body.company;
        const vicPercent = parseFloat(req.body.vicPercent);
        const gainPercent = parseFloat(req.body.gainPercent);
        const account = req.body.account;
        await Record.create({
            name: name,
            company: company,
            vic_percent: vicPercent,
            gain_percent: gainPercent,
            account: account
        });
        res.send('rankset');
    } catch (err) {
        console.log('err : ', err)
    }
});

router.get('/ranklist', async (req, res) => {
    let recordData = await Record.findAll({
        order: [
            ['account', 'DESC']
        ]
    });

    let rankList = recordData.map((e, index) => {
        let data = {};
        data._id = e.id;
        data.name = e.name;
        data.company = e.company;
        data.vicPercent = e.vic_percent;
        data.gainPercent = e.gain_percent;
        data.account = e.account;

        return data;
    });

    res.json(rankList);
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