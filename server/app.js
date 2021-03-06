const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const path = require('path');
const passport = require('passport');



dotenv.config();

// 라우터들
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const reviewRouter = require('./routes/review');
const hostRouter = require('./routes/host');
const reservationRouter = require('./routes/reservation');
const favoritesRouter = require('./routes/favorites');
//시퀄라이즈 불러오기
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
app.use(cors({
  origin: true,
  credentials: true
}));

passportConfig();
app.set('port', process.env.PORT || 8640);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

//시퀄라이즈 설정
sequelize.sync( { force: false })
    .then(() => {
        console.log('데이터 베이스 연결 성공.');
    })
    .catch((err) => {
        console.log('데이터 베이스 연결 실패.');
        console.error(err);
    })

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '../frontend/public/uploads')));
app.use(express.json());
app.use(express.urlencoded( { extended: false } ));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    // store: new MysqlStore({
    //     host: 'localhost',
    //     port: 3306,
    //     user: 'root',
    //     password: process.env.SESSION_MYSQL_PASSWORD,
    //     database: 'airbnbclone'
    //   })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/review', reviewRouter);
app.use('/host', hostRouter);
app.use('/reservation', reservationRouter);
app.use('/favorites', favoritesRouter);

app.use( (req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use( (err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.static || 500 );
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});