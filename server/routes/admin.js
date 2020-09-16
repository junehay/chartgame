const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const moment = require('moment');
const sequelize = require('../models/index').sequelize;
const { Company } = require('../models');
const { Member } = require('../models');
const { Record } = require('../models');
const config = require('../config/config.json');
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
    try {
        await Record.destroy({
            where: {id: _id}
        });
        res.send('DEL');
    } catch (err) {
        console.log('err : ', err);
    }
});

module.exports = router;