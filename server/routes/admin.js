const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const schedule = require('node-schedule');
const sequelize = require('../models/index').sequelize;
const { Company } = require('../models');
const { Member } = require('../models');
const { Record } = require('../models');
const config = require('../config/config.js');

sequelize.sync();

router.post('/login', async (req, res) => {
    try {
        const id = req.body.id;
        const pwd = req.body.password;
        let memberData = await Member.findOne({
            where: {
                member_id: id
            }
        });
        if (!memberData) {
            throw new Error('INVALID ID');
        } else {
            let checkPwd = await bcrypt.compare(pwd, memberData.member_pwd);
            if (!checkPwd) {
                throw new Error('INVALID PWD');
            } else {
                const token = jwt.sign({id: id}, config.SECRET_KEY, {expiresIn: '1h'});
                res.cookie('token', token, {maxAge: 360000, httpOnly: true, signed: true}).send('OK');
            }
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token').send('LOGOUT');
})

router.use((req, res, next) => {
    try {
        const token = req.signedCookies.token;
        const decoded = jwt.verify(token, config.SECRET_KEY);
        if (decoded) {
            next();
        } else {
            throw new Error('INVALID TOKEN');
        }
    } catch (err) {
        res.status(401).send(err.message);
    }
});

router.post('/', (req, res) => {
    res.send('admin');
});

router.post('/record/del', async (req, res) => {
    const _id = req.body._id;
    const all = req.body.all;
    try {
        if (all) {
            await Record.destroy({
                where: {},
                truncate: true
            });
            console.log('Ranklist Reset!!!!!!!');
            res.send('DEL');
        } else {
            await Record.destroy({
                where: {id: _id}
            });
            res.send('DEL');
        }
    } catch (err) {
        console.log('err : ', err);
    }
});

router.post('/company', async (req, res) => {
    try {
        const companyData = await Company.findAll({
            attributes: ['code', 'name', [sequelize.fn('COUNT', sequelize.col('code')), 'rows'], 'createdAt'],
            group: ['code'],
            raw: true
        });
        res.json(companyData);
    } catch (err) {
        console.log('err : ', err);
    }
});

router.post('/company/del', async (req, res) => {
    const code = req.body.code;
    try {
        await Company.destroy({
            where: {code: code}
        });
        res.send('DEL');
    } catch (err) {
        console.log('err : ', err);
    }
});

router.post('/company/add', async (req, res) => {
    const code = req.body.code;
    const name = req.body.name;
    for(let i=1; i<=10; i++){
        const getHtml = async () => {
            try {
                return await axios.get(`https://finance.naver.com/item/sise_day.nhn?code=${code}&page=${i}`, {
                    responseType: 'arraybuffer',
                    responseEncoding: 'binary'
                });
            } catch (error) {
                console.error(error);
            }
        };
        await getHtml()
            .then(html => {
                let decodeHtml = iconv.decode(html.data, 'EUC-KR');
                let list = [];
                const $ = cheerio.load(decodeHtml);
                const $bodyList = $('table tbody tr');
                $bodyList.each(function (i, elem) {
                    if($(this).find('.gray03').text()){
                        list[i] = {
                            code: code,
                            name: name,
                            date: $(this).find('.gray03').text(),
                            endPrice: $(this).find('.p11').first().text(),
                            startPrice: $(this).find('.p11').eq(2).text(),
                            highPrice: $(this).find('.p11').eq(3).text(),
                            lowPrice: $(this).find('.p11').eq(4).text(),
                            volume: $(this).find('.p11').last().text()
                        }
                    }
                });
                let filterList = list.filter((val, index, arr) => {
                    if(val){
                        return val;
                    }
                });
                return filterList;
            })
            .then(list => {
                for(let i=0; i<list.length; i++){
                    Company.create({
                        code: code,
                        name: name,
                        trading_date: list[i].date.replace(/\./g, '-'),
                        end_price: parseInt(list[i].endPrice.replace(/,/g, '')),
                        start_price: parseInt(list[i].startPrice.replace(/,/g, '')),
                        high_price: parseInt(list[i].highPrice.replace(/,/g, '')),
                        low_price: parseInt(list[i].lowPrice.replace(/,/g, '')),
                        volume: parseInt(list[i].volume.replace(/,/g, ''))
                    })
                }
            })
            .catch(err => {
               console.error(err);
               res.json(err);
            })
    }
    res.send('ADD');
});

// node-schedule
schedule.scheduleJob('0 0 9 * * 1', async () => {
    try { 
        await Record.destroy({
            where: {},
            truncate: true
        });
        console.log('Ranklist Reset!!!!!!!');
    } catch (err) {
        console.log('err : ', err)
    }
});


module.exports = router;