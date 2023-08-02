const {Client} = require('pg');
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

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.urlencoded({extended: false}));
app.use(session({
        secret: 'mysecret',
        resave: false,
        saveUninitialized: false
}));

//user가 요청하는 쿼리문 처리
app.get('/query/:user_input', (req, res) => {
    const userInput = req.params.user_input;
    let query = setQuery(userInput);

    mainClient.query(query, (error, result) => {
            if (error) {
                console.error('쿼리문 처리 중 오류 발생:', error);
            } else {
                console.log('쿼리문 요청 데이터 전송 선공');
                res.json({tables: result.rows});
            }
        });
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/login/login.html'));
    connectDB();
});

app.get('/logout', (req, res) => {
    if (req.session.isCreated) {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            }
        });
    }
    res.redirect('/login');
});

app.get('/info', (req, res) => {
    res.sendFile(__dirname + '/views/login/info.html')
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/views/login/register.html')
});

app.get('/forgot-password', (req, res) => {
    res.sendFile(__dirname + '/views/login/forgot-password.html')
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

//특정 db의 모든 테이블명 리턴
app.get('/tableNames/:db_name', (req, res) => {
    const dbName = req.params.db_name;
    mainClient.query("SELECT table_name FROM information_schema.tables WHERE table_schema = " + "\'" + dbName + "\'",
        (err, result) => {
            if (err) {
                console.error('테이블 정보 조회 중 오류 발생:', err);
            } else {
                console.log('테이블 데이터 전송 선공');
                const tableNames = result.rows.map((row) => row.table_name);
                res.json({tables: tableNames});
            }
        }
    );
});

//특정 table의 모든 칼럼명 리턴
app.get('/columnNames/:table_name', (req, res) => {
    const tableName = req.params.table_name;
    mainClient.query("SELECT column_name  FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = " + "\'" + tableName + "\'",
        (error, result) => {
            if (error) {
                console.error('칼럼 정보 조회 중 오류 발생:', error);
            } else {
                console.log('칼럼 데이터 전송 선공');
                const columnNames = result.rows.map((row) => row.column_name);
                res.json({tables: columnNames});
            }
        });
});

app.get('/index', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});


app.get('/monitoring/db', (req, res) => {
    res.sendFile(__dirname + '/views/monitoring/db.html');
});
app.get('/monitoring/tablespace', (req, res) => {
    res.sendFile(__dirname + '/views/monitoring/tablespace.html');
});
app.get('/monitoring/table', (req, res) => {
    res.sendFile(__dirname + '/views/monitoring/table.html');
});
app.get('/monitoring/indexusage', (req, res) => {
    res.sendFile(__dirname + '/views/monitoring/indexusage.html');
});


app.get('/session/userinfo', (req, res) => {
    res.sendFile(__dirname + '/views/session/user-info.html');
});
app.get('/session/sessioninfo', (req, res) => {
    res.sendFile(__dirname + '/views/session/session-info.html');
});


app.get('/sql/disk', (req, res) => {
    res.sendFile(__dirname + '/views/sql/disk.html');
});
app.get('/sql/runtime', (req, res) => {
    res.sendFile(__dirname + '/views/sql/runtime.html');
});


app.get('/transaction/certaintime-sql', (req, res) => {
    res.sendFile(__dirname + '/views/transaction/certaintime-sql.html');
});
app.get('/transaction/wait-block', (req, res) => {
    res.sendFile(__dirname + '/views/transaction/wait-block.html');
});
app.get('/transaction/queryblock-user', (req, res) => {
    res.sendFile(__dirname + '/views/transaction/queryblock-user.html');
});
app.get('/transaction/lock-query', (req, res) => {
    res.sendFile(__dirname + '/views/transaction/lock-query.html');
});


app.get('/vacuum/run-state', (req, res) => {
    res.sendFile(__dirname + '/views/vacuum/run-state.html');
});


app.get('/duplication/setting-info', (req, res) => {
    res.sendFile(__dirname + '/views/duplication/setting-info.html');
});
app.get('/duplication/serviceinfo', (req, res) => {
    res.sendFile(__dirname + '/views/duplication/service-info.html');
});


app.get('/scheduling/job', (req, res) => {
    res.sendFile(__dirname + '/views/scheduling/job.html');
});
app.get('/scheduling/job-log', (req, res) => {
    res.sendFile(__dirname + '/views/scheduling/job-log.html');
});


app.get('/authority/authority-all', (req, res) => {
    res.sendFile(__dirname + '/views/authority/authority-all.html');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

function connectDB() {
    mainClient.connect((err) => {
        if (err) {
            console.error('DB 연결 오류:', err);
        } else {
            console.log('DB 연결 성공!');
        }
    });
}

function setQuery(userInput) {
    let query;
    switch (userInput) {
        //사용량 관리
        case 'dbUsage':
            query = "SELECT pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname)) AS size FROM pg_database;";
            break;
        case 'tablespaceUsage':
            query = "select spcname, pg_size_pretty(pg_tablespace_size(spcname)) from pg_tablespace;";
            break;
        case 'tableUsage':
            query = "SELECT tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) FROM pg_tables where schemaname NOT IN ('utl_file','information_schema','pg_catalog');";
            break;
        case 'indexUsage':
            query = "SELECT indexrelid::regclass,  pg_size_pretty(pg_relation_size(indexrelid::regclass))  FROM pg_index where indexrelid > 16000;";
            break;

        //session 관리
        case 'userSession':
            query = "SELECT datname, usename, client_addr, client_port, application_name FROM pg_stat_activity;";
            break;
        case 'infoSession':
            query = "SELECT datname, usename, state, query FROM pg_stat_activity WHERE state = 'active';";
            break;

        //sql 통계 정보
        case 'diskTop':
            query = "select * from pg_stat_statements order by local_blks_read,local_blks_written,shared_blks_read,shared_blks_written desc limit 50;";
            break;
        case 'runtimeTop':
            query = "select * from pg_stat_statements order by total_exec_time,min_exec_time,max_exec_time,blk_read_time,blk_write_time desc limit 50;";
            break;

        //트랜잭션 정보
        case 'certaintimeSQL':
            query = "SELECT pid, now() - a.query_start AS duration, usename, query, state FROM pg_stat_activity a WHERE state = 'active' And now() - a.query_start > interval '1 minutes';";
            break;
    }
    return query;
}