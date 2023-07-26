const {Client} = require("pg");
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const port = 8080;
const app = express();
const mainClient = new Client({
    user: "etri",
    host: "192.168.100.24",
    database: "dmdb",
    password: "etri1234!",
    port: 15432,
});
mainClient.connect((err) => {
    if (err) {
        console.error('DB 연결 오류:', err);
    } else {
        console.log('DB 연결 성공!');
    }
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.urlencoded({extended: false}));
app.use(
    session({
        secret: 'mysecret',
        resave: false,
        saveUninitialized: false
    })
);

app.get('/column/:table_name', (req, res) => {
    const tableName = req.params.table_name;
    const query = "SELECT column_name  FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = " + "\'" + tableName + "\'";
    mainClient.query(query, (error, result) => {
        if (error) {
            console.error('로그인 정보 조회 중 오류 발생:', error);
        } else {
            console.log('데이터 전송 선공');
            res.json(result.rows);
        }
    });
});


//2차 db 로그인 페이지
app.get('/dbLogin', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/login/login.html'));
});
let dbClient;
//2차 db로그인용 db 연결
app.post('/process/dbConnect', (req, res) => {
    const {dbHost, dbUser, port, dbPassword, database} = req.body;
    console.log('Received DB Password:', dbPassword);

    // DB 연결 설정
    dbClient = new Client({
        user: dbUser,
        host: dbHost,
        database: database,
        password: dbPassword,
        port: port // PostgreSQL 포트 번호
    });

    // DB 연결 시도
    dbClient.connect((err) => {
        if (err) {
            console.error('DB 연결 오류:', err);
            res.send('DB 연결 실패');
        } else {
            console.log('DB 연결 성공!');
            // DB 연결이 성공하면, 연결된 클라이언트 객체를 다른 라우트에서 사용할 수 있도록 설정
            req.dbClient = dbClient;
            res.redirect('/history');
        }
    });
});

function getTableData(req, res) {
    const query = 'SELECT * FROM dsec.sensor_mgt';
    dbClient.query(query, (error, result) => {
        if (error) {
            console.error('데이터 조회 중 오류 발생:', error);
            res.status(500).send('데이터 조회 중 오류 발생');
        } else {
            res.json(result.rows);
        }
    });
}

//테이블 불러오기
app.get('/getTableData', (req, res) => {
    getTableData(req, res); // req, res를 인자로 전달하여 함수 실행
});


app.get('/history', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/management/history.html'));
});


app.get('/process/mainLogout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
    });
    res.redirect('/mainLogin');
});


app.get('/process/dbLogout', (req, res) => {
    req.dbClient.end((err) => {
        if (err) {
            console.log(err);
        }
    });
    res.redirect('/dbLogin');
});


app.put('/user/updateSession', (req, res) => {
    const {id, password, name, email, phone, office} = req.body;
    const user = req.session.user;
    user.id = id;
    user.password = password;
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.office = office;

    res.status(200).send('세션 정보가 업데이트되었습니다.');
});

app.get('/index.html', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});


app.get('/login.html', (req, res) => {
    res.sendFile(__dirname + '/views/login/login.html');
});

app.get('/info.html', (req, res) => {
    res.sendFile(__dirname + '/views/login/info.html');
});

app.get('/register.html', (req, res) => {
    res.sendFile(__dirname + '/views/login/register.html');
});

app.get('/forgot-password.html', (req, res) => {
    res.sendFile(__dirname + '/views/login/forgot-password.html');
});


app.get('/db.html', (req, res) => {
    res.sendFile(__dirname + '/views/db.html');
});

app.get('/tablespace.html', (req, res) => {
    res.sendFile(__dirname + '/views/tablespace.html');
});

app.get('/table.html', (req, res) => {
    res.sendFile(__dirname + '/views/table.html');
});

app.get('/indexusage.html', (req, res) => {
    res.sendFile(__dirname + '/views/indexusage.html');
});

app.get('/userinfo.html', (req, res) => {
    res.sendFile(__dirname + '/views/userinfo.html');
});

app.get('/sessioninfo.html', (req, res) => {
    res.sendFile(__dirname + '/views/sessioninfo.html');
});

app.get('/disk.html', (req, res) => {
    res.sendFile(__dirname + '/views/disk.html');
});

app.get('/runtime.html', (req, res) => {
    res.sendFile(__dirname + '/views/runtime.html');
});

app.get('/runsql.html', (req, res) => {
    res.sendFile(__dirname + '/views/runsql.html');
});

app.get('/waitsession.html', (req, res) => {
    res.sendFile(__dirname + '/views/waitsession.html');
});

app.get('/queryblock.html', (req, res) => {
    res.sendFile(__dirname + '/views/queryblock.html');
});

app.get('/querylock.html', (req, res) => {
    res.sendFile(__dirname + '/views/querylock.html');
});

app.get('/vacuuminfo.html', (req, res) => {
    res.sendFile(__dirname + '/views/vacuuminfo.html');
});

app.get('/duplicationinfo.html', (req, res) => {
    res.sendFile(__dirname + '/views/duplicationinfo.html');
});

app.get('/serviceinfo.html', (req, res) => {
    res.sendFile(__dirname + '/views/serviceinfo.html');
});

app.get('/jobinfo.html', (req, res) => {
    res.sendFile(__dirname + '/views/jobinfo.html');
});

app.get('/joblog.html', (req, res) => {
    res.sendFile(__dirname + '/views/joblog.html');
});
app.get('/authority.html', (req, res) => {
    res.sendFile(__dirname + '/views/authority.html');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});