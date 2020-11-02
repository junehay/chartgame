import express, { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import axios from 'axios';
import iconv from 'iconv-lite';
import cheerio from 'cheerio';
import schedule from 'node-schedule';
import { sequelize } from '../models';
import { Member } from '../models/member';
import { Rank } from '../models/rank';
import { Company } from '../models/company';
import config from '../config/config';
import { ValidationError } from '../utils/error';

declare module 'axios' {
  export interface AxiosRequestConfig {
    responseEncoding: string;
  }
}

const router: Router = express.Router();

router.post('/auth', async (req, res, next) => {
  interface Body {
    id: string;
    password: string;
  }

  try {
    const body = req.body as Body;
    const id = body.id;
    const pwd = body.password;
    const memberData = await Member.findOne({
      where: {
        member_id: id
      }
    });
    if (!memberData) {
      throw new ValidationError('INVALID ID');
    } else {
      const checkPwd = await bcrypt.compare(pwd, memberData.member_pwd as string);
      if (!checkPwd) {
        throw new ValidationError('INVALID PWD');
      } else {
        const token = jwt.sign({ id: id }, config.SECRET_KEY as string, { expiresIn: '1h' });
        res.cookie('token', token, { maxAge: 360000, httpOnly: true, signed: true }).send('OK');
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

router.delete('/auth', (req, res) => {
  res.clearCookie('token').send('LOGOUT');
});

router.use((req, res, next) => {
  interface SignedCookies {
    token?: string;
  }
  try {
    const signedCookies = req.signedCookies as SignedCookies;
    const token = signedCookies.token as string;

    const decoded = jwt.verify(token, config.SECRET_KEY as string);
    if (decoded) {
      next();
    } else {
      throw new ValidationError('INVALID TOKEN');
    }
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).send(err.message);
    } else if (err instanceof Error) {
      res.status(401).send(err.message);
    } else {
      console.log('err : ', err);
    }
  }
});

router.get('/', (req, res) => {
  res.send('admin');
});

router.delete('/record/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    if (id === 'all') {
      await Rank.destroy({
        where: {},
        truncate: true
      });
      console.log('!!!!! Ranklist Reset !!!!!');
      res.send('DEL');
    } else {
      await Rank.destroy({
        where: {
          id: id
        }
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
      attributes: ['code', 'name', [sequelize.Sequelize.fn('COUNT', sequelize.Sequelize.col('code')), 'rows'], 'createdAt'],
      group: ['code'],
      raw: true
    });
    res.json(companyData);
  } catch (err) {
    next(err);
  }
});

router.post('/company', async (req, res, next) => {
  interface Body {
    code: string;
    name: string;
  }

  const body = req.body as Body;
  const code = body.code;
  const name = body.name;

  for (let i = 1; i <= 10; i++) {
    const getHtml = async () => {
      try {
        return await axios.get(`https://finance.naver.com/item/sise_day.nhn?code=${code}&page=${i}`, {
          responseType: 'arraybuffer',
          responseEncoding: 'binary'
        });
      } catch (err) {
        next(err);
      }
    };
    await getHtml()
      .then((html) => {
        if (html) {
          const decodeHtml = iconv.decode(html.data, 'EUC-KR');
          const list: Record<string, string>[] = [];
          const $ = cheerio.load(decodeHtml);
          const $bodyList = $('table tbody tr');
          $bodyList.each((i, elem) => {
            if ($(elem).find('.gray03').text()) {
              list[i] = {
                code: code,
                name: name,
                date: $(elem).find('.gray03').text(),
                endPrice: $(elem).find('.p11').first().text(),
                startPrice: $(elem).find('.p11').eq(2).text(),
                highPrice: $(elem).find('.p11').eq(3).text(),
                lowPrice: $(elem).find('.p11').eq(4).text(),
                volume: $(elem).find('.p11').last().text()
              };
            }
          });
          const filterList = list.filter((val) => val);
          return filterList;
        }
      })
      .then(async (list) => {
        if (list) {
          for (let i = 0; i < list.length; i++) {
            await Company.create({
              code: code,
              name: name,
              trading_date: list[i].date.replace(/\./g, '-'),
              end_price: parseInt(list[i].endPrice.replace(/,/g, '')),
              start_price: parseInt(list[i].startPrice.replace(/,/g, '')),
              high_price: parseInt(list[i].highPrice.replace(/,/g, '')),
              low_price: parseInt(list[i].lowPrice.replace(/,/g, '')),
              volume: parseInt(list[i].volume.replace(/,/g, ''))
            });
          }
        }
      })
      .catch((err) => {
        next(err);
      });
  }
  res.send('ADD');
});

router.delete('/company/:code', async (req, res, next) => {
  const code = req.params.code;
  try {
    await Company.destroy({
      where: { code: code }
    });
    res.send('DEL');
  } catch (err) {
    next(err);
  }
});

// node-schedule
schedule.scheduleJob('0 0 9 * * 1', () => {
  async () => {
    try {
      await Rank.destroy({
        where: {},
        truncate: true
      });
      console.log('!!!!! Ranklist Reset !!!!!');
    } catch (err) {
      console.log(err);
    }
  };
});

export default router;
