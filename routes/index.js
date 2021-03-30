const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User, Host, Reservation, Image } = require('../models');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
  });

router.get('/', (req, res, next) => {
    res.render('main', { title: "노드연습하기" });
});

router.get('/join', isNotLoggedIn, (req, res, next) => {
    res.render('join', { title: "회원가입" });
});

router.get('/login', isNotLoggedIn, (req, res, next) => {
    res.render('login', { title: "로그인" });
});

router.get('/host', isLoggedIn, (req, res, next) => {
    res.render('hosting', { title: "호스트" });
});

router.get('/host/apply', isLoggedIn, (req, res, next) => {
    res.render('hostapply', { title: "호스트" });
});

router.get('/userinfo', isLoggedIn, async (req, res, next) => {
    try {
        const UserReservation = await Reservation.findAll({
            where: {
                UserId: req.user.id,
            },
            include: {
                model: Host,
                attributes: ['title', 'hostaddress'],
                include: {
                    model: Image,
                    attributes: ['src'],
                },
            },
            order: [['id', 'DESC']],
        });
        res.render('userinfo', {title: "내정보", UserReservation});
    } catch(error) {
        console.error(error);
        next(error);
    }
});




module.exports = router;