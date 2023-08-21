const {Client} = require('pg');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const port = 8080;
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false
}));

const dbConnections = [
    {user: "etri", host: "192.168.100.24", database: "dmdb", password: "etri1234!", port: 15432},
    {user: "etri", host: "192.168.100.24", database: "sidb", password: "etri1234!", port: 15432},
    {user: "etri", host: "192.168.100.24", database: "tmdb", password: "etri1234!", port: 15432},
    {user: "etri", host: "192.168.100.24", database: "msdb", password: "etri1234!", port: 15432},
    {user: "etri", host: "192.168.100.24", database: "postgres", password: "etri1234!", port: 15432},
    {user: "etri", host: "192.168.100.24", database: "test", password: "etri1234!", port: 15432}
];
const clients = [];
for (const config of dbConnections) {
    const client = new Client(config);
    clients.push(client);
}

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/login/login.html'));
});

app.post('/process/login', (req, res) => {
    const { userId, userPassword } = req.body;
    const query = 'SELECT * FROM main_login WHERE id = $1 AND password = $2';

    clients[0].query(query, [userId, userPassword], (error, result) => {
        if (error) {
            console.error('로그인 정보 조회 중 오류 발생:', error);
            res.redirect('/login');
        } else {
            if (result.rows.length === 1) {
                // 로그인 성공 시 세션에 사용자 정보 저장
                req.session.user = result.rows[0];
                console.log('로그인 성공: ', userId, ', ', userPassword);
                res.redirect('/index');
            } else {
                console.log('로그인 실패: 아이디 또는 비밀번호가 잘못되었습니다.', userId, userPassword);
                res.redirect('/login');
            }
        }
    });
});

app.put('/user/updateSession', (req, res) => {
    const {id, password} = req.body;
    const user = req.session.user;
    user.id = id;
    user.password = password;
    res.status(200).send('세션 정보가 업데이트되었습니다.');
});

app.get('/logout', (req, res) => {
    if (req.session.isCreated) {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            }
        });
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
});

app.get('/:user_input', (req, res) => {
    const userInput = req.params.user_input;
    if (req.session.user) {
        const filePath = path.join(__dirname, setFilePath(userInput));
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('리소스 파일 로드 중 오류 발생:', err);
                res.status(500).send('Internal Server Error');
            } else {
                const user = req.session.user;
                const htmlWithData = data.replace('{{user}}', JSON.stringify(user));
                res.send(htmlWithData);
            }
        });
    } else {
        res.redirect('/login');
    }
});

//sql 쿼리문 처리 - result: {data:[{key:value}]}
app.get('/query/:user_input/:db_input', (req, res) => {
    const userInput = req.params.user_input;
    const dbInput = req.params.db_input;
    let dbNum = setDataBase(dbInput);
    let query = setQuery(userInput);

    clients[dbNum].query(query, (error, result) => {
        if (error) {
            console.error('쿼리문 처리 중 오류 발생:', error);
            res.json({"data": [{"쿼리문 오류 발생" : null}]});
        } else {
            console.log(clients[dbNum].database + ' 쿼리문 요청 데이터 전송 선공: ', query);
            if (result.rows.length == 0)
                res.json({"data": [{"테이블 데이터 없음" : null}]});
            else
                res.json({"data": result.rows});
        }
    });
});

app.get('/authority-group/:user_input', (req, res) => {
    if (req.session.user) {
        const filePath = path.join(__dirname, 'views/authority/authority-group.html');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('리소스 파일 로드 중 오류 발생:', err);
                res.status(500).send('Internal Server Error');
            } else {
                const user = req.session.user;
                const htmlWithData = data.replace('{{user}}', JSON.stringify(user));
                res.send(htmlWithData);
            }
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/authority-user/:user_input', (req, res) => {
    if (req.session.user) {
        const filePath = path.join(__dirname, 'views/authority/authority-user.html');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('리소스 파일 로드 중 오류 발생:', err);
                res.status(500).send('Internal Server Error');
            } else {
                const user = req.session.user;
                const htmlWithData = data.replace('{{user}}', JSON.stringify(user));
                res.send(htmlWithData);
            }
        });
    } else {
        res.redirect('/login');
    }
});

//권한 관련 쿼리문 처리
app.get('/authority/authGroup/:user_input', (req, res) => {
    const userInput = req.params.user_input;
    let dbNum = 4;
    var query = "SELECT module_name AS \"모듈명\", sidb_read, sidb_write, msdb_read, msdb_write, tmdb_read, tmdb_write, dmdb_read, dmdb_write, company_name AS \"담당기관\" FROM public.authority WHERE company_name = \'" + userInput + "\';";

    clients[dbNum].query(query, (error, result) => {
        if (error) {
            console.error('쿼리문 처리 중 오류 발생:', error);
            res.json({"data": [{"쿼리문 오류 발생" : null}]});
        } else {
            console.log(clients[dbNum].database + ' 쿼리문 요청 데이터 전송 선공: ', query);
            if (result.rows.length == 0)
                res.json({"data": [{"테이블 데이터 없음" : null}]});
            else
                res.json({"data": result.rows});
        }
    });
});

app.get('/authority/authUser/:user_input', (req, res) => {
    const userInput = req.params.user_input;
    let dbNum = 4;
    var query = "SELECT module_name AS \"모듈명\", sidb_read, sidb_write, msdb_read, msdb_write, tmdb_read, tmdb_write, dmdb_read, dmdb_write, company_name AS \"담당기관\" FROM public.authority WHERE module_name = \'" + userInput + "\';"

    clients[dbNum].query(query, (error, result) => {
        if (error) {
            console.error('쿼리문 처리 중 오류 발생:', error);
            res.json({"data": [{"쿼리문 오류 발생" : null}]});
        } else {
            console.log(clients[dbNum].database + ' 쿼리문 요청 데이터 전송 선공: ', query);
            if (result.rows.length == 0)
                res.json({"data": [{"테이블 데이터 없음" : null}]});
            else
                res.json({"data": result.rows});
        }
    });
});

app.post('/authority/updateAuth', (req, res) => {
    const rowData = req.body;
    let dbNum = 4;
    const query = `UPDATE public.authority SET sidb_read = $1, sidb_write = $2, msdb_read = $3, msdb_write = $4, tmdb_read = $5, tmdb_write = $6, dmdb_read = $7, dmdb_write = $8 WHERE module_name = $9;`;

    const values = [rowData.checkbox1, rowData.checkbox2, rowData.checkbox3, rowData.checkbox4, rowData.checkbox5, rowData.checkbox6, rowData.checkbox7, rowData.checkbox8, rowData.name];

    clients[dbNum].query(query, values, (error, result) => {
        if (error) {
            console.error('권한 수정 처리 중 오류 발생:', error);
            res.json('권한 수정 처리 중 오류 발생:' + error);
        } else {
            console.log(clients[dbNum].database, ' 권한 수정 성공: ', rowData.name);
            res.json('권한 수정 성공: ' + rowData.name);
        }
    });
});

//테이블 정보 쿼리문 처리
app.get('/infoTable/:user_input/:db_input', (req, res) => {
    const userInput = req.params.user_input;
    const dbInput = req.params.db_input;
    const query = "SELECT column_name, data_type, CASE WHEN column_name IN (SELECT column_name FROM information_schema.key_column_usage WHERE table_name = \'" + userInput + "\' AND constraint_name = \'" + userInput + "_pkey\') THEN \'PK\' ELSE \'\' END AS primary_key FROM information_schema.columns WHERE table_name = \'" + userInput + "\'\;";
    let dbNum = setDataBase(dbInput);

    clients[dbNum].query(query, (error, result) => {
        if (error) {
            console.error('쿼리문 처리 중 오류 발생:', error);
            res.json({"data": [{"쿼리문 오류 발생" : null}]});
        } else {
            console.log(clients[dbNum].database + ' 쿼리문 요청 데이터 전송 선공: ', query);
            if (result.rows.length == 0)
                res.json({"data": [{"테이블 데이터 없음" : null}]});
            else
                res.json({"data": result.rows});
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    for (let i = 0; i < clients.length; i++) {
        connectDB(clients[i]);
    }
});

function connectDB(client) {
    client.connect()
        .then(() => console.log(`${client.database} database 연결 성공`))
        .catch(err => console.error(`${client.database} database 연결 중 에러 발생:`, err));
}

function setDataBase(dbInput) {
    switch (dbInput) {
        case 'dmdb':
            return 0;
        case 'sidb':
            return 1;
        case 'tmdb':
            return 2;
        case 'msdb':
            return 3;
        case 'postgres':
            return 4;
        case 'test':
            return 5;
        case 'all':
            return 0;
        default:
            console.log("db설정 오류: ", dbInput);
            return 0;
    }
}

function setQuery(userInput) {
    switch (userInput) {
        //사용량 관리
        case 'dbUsage':
            return "SELECT pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname)) AS size FROM pg_database;";
        case 'tablespaceUsage':
            return "select spcname AS tablespace명, pg_size_pretty(pg_tablespace_size(spcname)) AS 사용량 from pg_tablespace;";
        case 'tableUsage':
            return "SELECT tablename AS table명, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS 사용량 FROM pg_tables where schemaname NOT IN ('utl_file','information_schema','pg_catalog');";
        case 'indexUsage':
            return "SELECT indexrelid::regclass AS index명,  pg_size_pretty(pg_relation_size(indexrelid::regclass)) AS 사용량 FROM pg_index where indexrelid > 16000;";

        //session 관리
        case 'userSession':
            return "SELECT datname AS DB명, usename AS 사용자명, client_addr AS \"클라이언트 IP\", client_port AS \"클라이언트 PORT\", application_name AS 응용명 FROM pg_stat_activity;";
        case 'infoSession':
            return "SELECT datname AS DB명, usename AS \"세션을 시작한 사용자명\", state AS \"세션 상태 정보\", backend_start AS \"세션 시작 시간\" FROM pg_stat_activity WHERE state = 'active';";

        //sql 통계 정보
        case 'diskTop':
            return "select dbid AS DB명, query, calls AS \"query문 실행 횟수\", total_exec_time AS \"query문 실행 총 시간\" from pg_stat_statements order by local_blks_read,local_blks_written,shared_blks_read,shared_blks_written desc limit 50;";
        case 'runtimeTop':
            return "select dbid AS DB명, query, calls AS \"query문 실행 횟수\", total_exec_time AS \"query문 실행 총 시간\" from pg_stat_statements order by total_exec_time,min_exec_time,max_exec_time,blk_read_time,blk_write_time desc limit 50;";

        //트랜잭션 정보
        case 'certaintimeSQL':
            return "SELECT pid, now() - a.query_start AS duration, usename, query, state FROM pg_stat_activity a WHERE state = 'active' And now() - a.query_start > interval '1 minutes';";
        case 'waitblockSession':    //postgresql 버전 확인 (9.3.5)
            return "SELECT datname, usename, query FROM pg_stat_activity WHERE waiting = true;";
        case 'queryblockUser':      //postgresql 버전 확인 (9.3.5)
            return "SELECT w.query AS waiting_query, w.pid AS waiting_pid, w.usename AS waiting_user, l.query AS locking_query, l.pid AS locking_pid, l.usename AS locking_user, t.schemaname || '.' || t.relname AS tablename " +
                "FROM pg_stat_activity w JOIN pg_locks l1 ON w.pid = l1.pid AND NOT l1.granted JOIN pg_locks l2 ON l1.relation = l2.relation AND l2.granted JOIN pg_stat_activity l ON l2.pid = l.pid JOIN pg_stat_user_tables t ON l1.relation = t.relid WHERE w.waiting;";
        case 'lockQuery':
            return "SELECT lock1.pid AS locked_pid, stat1.usename AS locked_user, stat1.query AS locked_statement, stat1.state AS state, stat2.query AS locking_statement, stat2.state AS state, now()- stat1.query_start AS locking_duration, lock2.pid AS locking_pid, stat2.usename AS locking_user " +
                "FROM pg_locks lock1 JOIN pg_stat_activity stat1 ON lock1.pid = stat1.pid JOIN pg_locks lock2 ON (lock1.locktype, lock1.database, lock1.relation, lock1.page, lock1.tuple, lock1.virtualxid, lock1.transactionid, lock1.classid, lock1.objid, lock1.objsubid) IS NOT DISTINCT " +
                "FROM (lock2.locktype, lock2.DATABASE, lock2.relation, lock2.page, lock2.tuple, lock2.virtualxid, lock2.transactionid, lock2.classid, lock2.objid, lock2.objsubid) " +
                "JOIN pg_stat_activity stat2 ON lock2.pid = stat2.pid WHERE NOT lock1.granted AND lock2.granted;";

        //vacuum 정보
        case 'stateVacuum':
            return "SELECT  datname, usename, pid, wait_event, current_timestamp - xact_start AS xact_runtime, query FROM pg_stat_activity WHERE upper(query) like '%VACUUM%' ORDER BY xact_start;";

        //이중화 정보 (master에서만, 결과가 없는 경우 slave와 이중화가 끊어지거나 중지된 경우)
        case 'settingsDuplication':
            return "SELECT application_name, state, sync_state FROM pg_stat_replication;";
        case 'servicesDuplication':
            return "SELECT slot_name, active, restart_lsn FROM pg_replication_slots;";

        //스케줄링 정보 ("postgres" DB에 접근 후 질의 수행해야 함)
        case 'infoJob':
            return "SELECT * FROM pgagent.pga_job;";
        case 'logJob':
            return "SELECT * FROM pgagent.pga_joblog;";

        //DBMS object
        case 'dbList':
            return "SELECT datname FROM pg_database WHERE datistemplate = false;";
        case 'schemaList':
            return "SELECT nspname FROM pg_namespace WHERE nspname NOT LIKE 'information_schema' AND nspname NOT LIKE 'pg_%';";
        case 'tableList':
            return "SELECT relname FROM PG_STAT_USER_TABLES;";

        //사용자 권한 관리
        case 'authority-all':
            return "SELECT module_name AS \"모듈명\", sidb_read, sidb_write, msdb_read, msdb_write, tmdb_read, tmdb_write, dmdb_read, dmdb_write, company_name AS \"담당기관\" FROM public.authority ORDER BY company_name, module_name;";

        default:
            return null;
    }
}

function setFilePath(userInput) {
    switch (userInput) {
        case 'index':
            return '/views/index.html';

        case 'info':
            return '/views/login/info.html';

        case 'monitor-db':
            return '/views/monitoring/db.html';
        case 'monitor-tablespace':
            return '/views/monitoring/tablespace.html';
        case 'monitor-table':
            return '/views/monitoring/table.html';
        case 'monitor-indexusage':
            return '/views/monitoring/indexusage.html';

        case 'session-user':
            return '/views/session/user-info.html';
        case 'session-info':
            return '/views/session/session-info.html';

        case 'disk-top':
            return '/views/sql/disk.html';
        case 'runtime-top':
            return '/views/sql/runtime.html';

        case 'trans-time':
            return '/views/transaction/certaintime-sql.html';
        case 'trans-wait':
            return '/views/transaction/wait-block.html';
        case 'trans-block':
            return '/views/transaction/queryblock-user.html';
        case 'trans-lock':
            return '/views/transaction/lock-query.html';

        case 'vac-state':
            return '/views/vacuum/run-state.html';

        case 'dup-setting':
            return '/views/duplication/setting-info.html';
        case 'dup-service':
            return '/views/duplication/service-info.html';

        case 'job-info':
            return '/views/scheduling/job.html';
        case 'job-log':
            return '/views/scheduling/job-log.html';

        case 'authority-all':
            return '/views/authority/authority-all.html';
        case 'authority-group':
            return '/views/authority/authority-group.html';
        case 'authority-user':
            return '/views/authority/authority-user.html';

        case 'master-connect':
            return '/views/connect/master.html';
        case 'slave-connect':
            return '/views/connect/slave.html';

        default:
            return '/views/error/404.html';
    }
}