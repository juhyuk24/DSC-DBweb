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

//user가 요청하는 쿼리문 처리 - result: {data:[{key:value}]}
app.get('/query/:user_input', (req, res) => {
    const userInput = req.params.user_input;
    let query = setQuery(userInput);

    mainClient.query(query, (error, result) => {
            if (error) {
                console.error('쿼리문 처리 중 오류 발생:', error);
            } else {
                console.log('쿼리문 요청 데이터 전송 선공: ', query);
                res.json({data: result.rows});
            }
        });
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/login/login.html'));
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    connectDB();
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
        case 'waitblockSession':    //postgresql 버전 확인 (9.3.5)
            query = "SELECT datname, usename, query FROM pg_stat_activity WHERE waiting = true;";
            break;
        case 'queryblockUser':      //postgresql 버전 확인 (9.3.5)
            query = "SELECT w.query AS waiting_query, w.pid AS waiting_pid, w.usename AS waiting_user, l.query AS locking_query, l.pid AS locking_pid, l.usename AS locking_user, t.schemaname || '.' || t.relname AS tablename " +
                "FROM pg_stat_activity w JOIN pg_locks l1 ON w.pid = l1.pid AND NOT l1.granted JOIN pg_locks l2 ON l1.relation = l2.relation AND l2.granted JOIN pg_stat_activity l ON l2.pid = l.pid JOIN pg_stat_user_tables t ON l1.relation = t.relid WHERE w.waiting;";
            break;
        case 'lockQuery':
            query = "SELECT lock1.pid AS locked_pid, stat1.usename AS locked_user, stat1.query AS locked_statement, stat1.state AS state, stat2.query AS locking_statement, stat2.state AS state, now()- stat1.query_start AS locking_duration, lock2.pid AS locking_pid, stat2.usename AS locking_user " +
                "FROM pg_locks lock1 JOIN pg_stat_activity stat1 ON lock1.pid = stat1.pid JOIN pg_locks lock2 ON (lock1.locktype, lock1.database, lock1.relation, lock1.page, lock1.tuple, lock1.virtualxid, lock1.transactionid, lock1.classid, lock1.objid, lock1.objsubid) IS NOT DISTINCT " +
                "FROM (lock2.locktype, lock2.DATABASE, lock2.relation, lock2.page, lock2.tuple, lock2.virtualxid, lock2.transactionid, lock2.classid, lock2.objid, lock2.objsubid) " +
                "JOIN pg_stat_activity stat2 ON lock2.pid = stat2.pid WHERE NOT lock1.granted AND lock2.granted;";
            break;

        //vacuum 정보
        case 'stateVacuum':
            query = "SELECT  datname, usename, pid, wait_event, current_timestamp - xact_start AS xact_runtime, query FROM pg_stat_activity WHERE upper(query) like '%VACUUM%' ORDER BY xact_start;";
            break;

        //이중화 정보 (master에서만, 결과가 없는 경우 slave와 이중화가 끊어지거나 중지된 경우)
        case 'settingsDuplication':
            query = "SELECT application_name, state, sync_state FROM pg_stat_replication;";
            break;
        case 'servicesDuplication':
            query = "SELECT slot_name, active, restart_lsn FROM pg_replication_slots;";
            break;

        //스케줄링 정보 ("postgre" DB에 접근 후 질의 수행해야 함)
        case 'infoJob':
            query = "SELECT * FROM pgagent.pga_job;";
            break;
        case 'logJob':
            query = "SELECT * FROM pgagent.pga_joblog;";
            break;

        //DBMS object
        case 'dbList':
            query = "SELECT datname FROM pg_database WHERE datistemplate = false;";
            break;
        case 'schemaList':
            query = "SELECT nspname FROM pg_namespace WHERE nspname NOT LIKE 'information_schema' AND nspname NOT LIKE 'pg_%';";
            break;
        case 'tableList':
            query = "SELECT schemaname, relname FROM PG_STAT_USER_TABLES;";
            break;

        //사용자 권한관리
    }
    return query;
}