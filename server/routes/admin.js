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
const { ValidationError } = require('../utils/error.js');

sequelize.sync();

router.post('/auth', async (req, res, next) => {
  try {
    const id = req.body.id;
    const pwd = req.body.password;
    const memberData = await Member.findOne({
      where: {
        member_id: id
      }
    });
    if (!memberData) {
      throw new ValidationError('INVALID ID');
    } else {
      const checkPwd = await bcrypt.compare(pwd, memberData.member_pwd);
      if (!checkPwd) {
        throw new ValidationError('INVALID PWD');
      } else {
        const token = jwt.sign({id: id}, config.SECRET_KEY, {expiresIn: '1h'});
        res.cookie('token', token, {maxAge: 360000, httpOnly: true, signed: true}).send('OK');
      }
    }
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).send(err.message);
    } else {
      next(err);
    }
  }
});

router.delete('/auth', (req, res, next) => {
  res.clearCookie('token').send('LOGOUT');
})

router.use((req, res, next) => {
  try {
    const token = req.signedCookies.token;
    const decoded = jwt.verify(token, config.SECRET_KEY);
    if (decoded) {
      next();
    } else {
      throw new ValidationError('INVALID TOKEN');
    }
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).send(err.message);
    } else {
      res.status(401).send(err.message);
    }
  }
});

router.get('/', (req, res, next) => {
  res.send('admin');
});

router.delete('/record/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    if (id === 'all') {
      await Record.destroy({
        where: {},
        truncate: true
      });
      console.log('!!!!! Ranklist Reset !!!!!');
      res.send('DEL');
    } else {
      await Record.destroy({
        where: {id: id}
      });
      res.send('DEL');
    }
  } catch (err) {
    next(err);
  }
});

router.get('/company', async (req, res, next) => {
  try {
    const companyData = await Company.findAll({
      attributes: ['code', 'name', [sequelize.fn('COUNT', sequelize.col('code')), 'rows'], 'createdAt'],
      group: ['code'],
      raw: true
    });
    res.json(companyData);
  } catch (err) {
    next(err);
  }
});

router.post('/company', async (req, res, next) => {
  const code = req.body.code;
  const name = req.body.name;
  for(let i=1; i<=10; i++){
    const getHtml = async () => {
      try {
        return await axios.get(`https://finance.naver.com/item/sise_day.nhn?code=${code}&page=${i}`, {
          responseType: 'arraybuffer',
          responseEncoding: 'binary'
        });
      } catch (err) {
        next(err)
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
        const filterList = list.filter(val => val);
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
        next(err);
      })
  }
  res.send('ADD');
});

router.delete('/company/:code', async (req, res, next) => {
  const code = req.params.code;
  try {
    await Company.destroy({
      where: {code: code}
    });
    res.send('DEL');
  } catch (err) {
    next(err);
  }
});

// node-schedule
schedule.scheduleJob('0 0 9 * * 1', async () => {
  try { 
    await Record.destroy({
      where: {},
      truncate: true
    });
    console.log('!!!!! Ranklist Reset !!!!!');
  } catch (err) {
    next(err);
  }
});

module.exports = router;