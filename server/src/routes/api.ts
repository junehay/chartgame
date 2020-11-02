import express, { Router } from 'express';
import { sequelize } from '../models';
import { Rank } from '../models/rank';
import { Company } from '../models/company';
import redis from 'redis';
import util from 'util';
import moment from 'moment';

const client = redis.createClient(6379, process.env.REDIS_HOST);
const router: Router = express.Router();

interface Session {
  uuid?: string;
}

interface GameData {
  chart: Record<string, (string | number)[]>[];
  position: Record<string, string | number>;
  user: Record<string, number>;
  company: string;
  start_date: string;
  end_date: string;
}

interface RankList {
  _id: number;
  name: string;
  company: string;
  vicPercent: number;
  gainPercent: number;
  account: number;
}

router.get('/id', (req, res) => {
  res.send(req.session?.uuid);
});

router.get('/gameset', async (req, res, next) => {
  try {
    const session = req.session as Session;
    const uuid = session.uuid as string;
    const randomCode = await Company.findOne({
      attributes: ['code'],
      order: sequelize.random(),
      raw: true
    });

    if (!randomCode) {
      throw new Error('null');
    } else {
      const companyCode = randomCode.code;
      let companyData = await Company.findAll({
        where: {
          code: companyCode
        },
        order: [['trading_date', 'ASC']]
      });
      const rand = Math.floor(Math.random() * 20);
      companyData = companyData.slice(rand, rand + 80);

      let companyName = '';
      let startDate;
      let endDate;
      const chartData = companyData.map((e, index) => {
        const data: Record<string, (string | number)[]> = {};
        data.price = [
          '',
          e.low_price,
          e.start_price,
          e.end_price,
          e.high_price,
          `시가 : ${e.start_price.toLocaleString()}\n고가 : ${e.high_price.toLocaleString()}\n저가 : ${e.low_price.toLocaleString()}\n 종가 : ${e.end_price.toLocaleString()}`
        ];
        data.volume = ['', e.volume];
        if (index === 0) {
          startDate = e.trading_date;
          companyName = e.name;
        } else if (index === 79) {
          endDate = e.trading_date;
        }
        return data;
      });

      const gameData = {} as GameData;
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
      res.redirect('/api/gamedata');
    }
  } catch (err) {
    next(err);
  }
});

router.get('/gamedata', async (req, res) => {
  const session = req.session as Session;
  const uuid = session.uuid as string;
  const gameData = await getRedisData(uuid, 'gameData');
  if (gameData instanceof Error) {
    console.log('dd');
  } else if (!gameData) {
    res.redirect('/api/gameset');
  } else {
    const jsonData = JSON.parse(gameData) as GameData;
    res.json(jsonData);
  }
});

router.get('/shift', async (req, res, next) => {
  try {
    const session = req.session as Session;
    const uuid = session.uuid as string;
    const gameData = await getRedisData(uuid, 'gameData');
    if (gameData instanceof Error) {
      next(gameData);
    } else {
      const jsonData = JSON.parse(gameData) as GameData;
      if (jsonData['chart'].length > 50) {
        const shiftData = jsonData['chart'].shift();
        client.hset(uuid, 'gameData', JSON.stringify(jsonData));
        client.expire('gameData', 3600);

        res.json(shiftData);
      } else {
        res.send('end');
      }
    }
  } catch (err) {
    next(err);
  }
});

router.get('/buy', async (req, res, next) => {
  try {
    const session = req.session as Session;
    const uuid = session.uuid as string;
    const gameData = await getRedisData(uuid, 'gameData');
    if (gameData instanceof Error) {
      next(gameData);
    } else {
      const jsonData = JSON.parse(gameData) as GameData;
      const nowPrice = jsonData['chart'][49].price[3] as number; // chartData.length : 80, [{"price":[option, low, start, end, high, tooltip],"volume":[option, value]}, ...]
      const account = jsonData['user'].account;
      const stocks = Math.floor(account / nowPrice);
      jsonData['position'].next_btn = 'sell';
      jsonData['position'].buy_price = nowPrice;
      jsonData['position'].stocks = stocks;
      jsonData['user'].account = account - nowPrice * stocks;

      client.hset(uuid, 'gameData', JSON.stringify(jsonData));
      client.expire('gameData', 3600);

      res.json({ nowPrice: nowPrice, stocks: stocks, account: account - nowPrice * stocks });
    }
  } catch (err) {
    next(err);
  }
});

router.get('/sell', async (req, res, next) => {
  try {
    const session = req.session as Session;
    const uuid = session.uuid as string;
    const gameData = await getRedisData(uuid, 'gameData');
    if (gameData instanceof Error) {
      next(gameData);
    } else {
      const jsonData = JSON.parse(gameData) as GameData;
      const nowPrice = jsonData['chart'][49].price[3] as number;
      const buyPrice = jsonData['position'].buy_price as number;
      const stocks = jsonData['position'].stocks as number;
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
      const afterAccount = nowAccount + nowPrice * stocks;
      jsonData['user'].acc_gain_price += gainPrice;
      jsonData['user'].account = afterAccount;

      client.hset(uuid, 'gameData', JSON.stringify(jsonData));
      client.expire('gameData', 3600);

      res.json({ result: result, gainPrice: gainPrice, account: afterAccount });
    }
  } catch (err) {
    next(err);
  }
});

router.get('/end', async (req, res, next) => {
  try {
    const session = req.session as Session;
    const uuid = session.uuid as string;
    const gameData = await getRedisData(uuid, 'gameData');
    if (gameData instanceof Error) {
      next(gameData);
    } else {
      const jsonData = JSON.parse(gameData) as GameData;
      const company = jsonData.company;
      const date = `${jsonData.start_date} ~ ${jsonData.end_date}`;
      const userData = jsonData.user;
      const accGainPrice = userData.acc_gain_price;
      const account = userData.account;
      const win = userData.win;
      const lose = userData.lose;
      const vicPercent = isNaN(win / (win + lose)) ? 0 : ((win / (win + lose)) * 100).toFixed(2);
      res.json({
        vicPercent: vicPercent,
        accGainPrice: accGainPrice,
        account: account,
        company: company,
        date: date
      });
    }
  } catch (err) {
    next(err);
  }
});

router.post('/rank', async (req, res, next) => {
  interface Body {
    name: string;
    company: string;
    vicPercent: number;
    gainPercent: number;
    account: number;
  }
  try {
    const body = req.body as Body;
    const name = body.name;
    const company = body.company;
    const vicPercent = body.vicPercent;
    const gainPercent = body.gainPercent;
    const account = body.account;
    await Rank.create({
      name: name,
      company: company,
      vic_percent: vicPercent,
      gain_percent: gainPercent,
      account: account
    });
    res.send('rankset');
  } catch (err) {
    next(err);
  }
});

router.get('/ranklist', async (req, res) => {
  const RankData = await Rank.findAll({
    order: [['account', 'DESC']]
  });

  const rankList = RankData.map((e) => {
    const data = {} as RankList;
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

async function getRedisData(key: string, field: string) {
  const hget = client.hget.bind(client);
  const hgetPromise = util.promisify(hget).bind(client);
  const redisData = await hgetPromise(key, field)
    .then((data) => {
      return data;
    })
    .catch((err: Error) => {
      return err;
    });
  return redisData;
}

export default router;
