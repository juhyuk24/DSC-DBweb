const {Pool} = require('pg');
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

//초기 db연결을 위한 정보
const dbConnection = {
    user: "etri",
    host: "192.168.100.24",
    database: "dmdb",
    password: "etri1234!",
    port: 15432
}

//커넥션 풀을 설정하여 dbConnection에서 database만 변경하여 사용할 수 있게
const mainPool = new Pool(dbConnection);
app.locals.dbPool = mainPool;
app.use((req, res, next) => {
    req.dbPool = mainPool;
    next();
});

//로그인 페이지 반환
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/login/login.html'));
});

//로그인 처리
app.post('/process/login',  (req, res) => {
    const { userId, userPassword } = req.body;
    const query = 'SELECT * FROM main_login WHERE id = $1 AND password = $2';

    try {
        const dbPool = new Pool({ ...dbConnection, database: 'dmdb' });
        dbPool.query(query, [userId, userPassword], (error, result) => {
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
        dbPool.end();
    }
    catch (e) {
        console.log(e);
    }
});

//로그아웃 하면 세션, 쿠키 없애기
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

//입력에 따라 페이지를 반환
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

//입력에 따른 SQL 쿼리문 처리 - result: {data:[{key:value}]}
app.get('/query/:user_input/:db_input', async (req, res) => {
    const userInput = req.params.user_input;
    const dbInput = req.params.db_input;
    let query = setQuery(userInput);

    try {
        if(dbInput == 'all') {
            sendQueryAll(res, query);
        }
        else {
            sendQuery(res, query, dbInput);
        }
    }
    catch (e) {
        console.log(e);
    }
});

//그룹 권한 페이지 처리
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

//유저 권한 페이지 처리
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

//그룹 권한 조회 쿼리문 처리
app.get('/authority/authGroup/:user_input', async (req, res) => {
    const userInput = req.params.user_input;
    var query = "SELECT module_name AS \"모듈명\", sidb_read, sidb_write, msdb_read, msdb_write, tmdb_read, tmdb_write, dmdb_read, dmdb_write, company_name AS \"담당기관\" FROM public.authority WHERE company_name = \'" + userInput + "\';";

    sendQuery(res, query, dbInput);
});

//유저 권한 조회 쿼리문 처리
app.get('/authority/authUser/:user_input', async (req, res) => {
    const userInput = req.params.user_input;
    var query = "SELECT module_name AS \"모듈명\", sidb_read, sidb_write, msdb_read, msdb_write, tmdb_read, tmdb_write, dmdb_read, dmdb_write, company_name AS \"담당기관\" FROM public.authority WHERE module_name = \'" + userInput + "\';"

    sendQuery(res, query, dbInput);
});

//권한 업데이트 쿼리문 처리
app.post('/authority/updateAuth', async (req, res) => {
    const rowData = req.body;
    const query = `UPDATE public.authority SET sidb_read = $1, sidb_write = $2, msdb_read = $3, msdb_write = $4, tmdb_read = $5, tmdb_write = $6, dmdb_read = $7, dmdb_write = $8 WHERE module_name = $9;`;
    const values = [rowData.checkbox1, rowData.checkbox2, rowData.checkbox3, rowData.checkbox4, rowData.checkbox5, rowData.checkbox6, rowData.checkbox7, rowData.checkbox8, rowData.name];

    try {
        const dbPool = new Pool({ ...dbConnection, database: 'postgres' });
        dbPool.query(query, values, (error, result) => {
            if (error) {
                console.error('권한 수정 중 오류 발생:', error);
                res.json('권한 수정 중 오류 발생: ' + error);
            } else {
                console.log('postgres 권한 수정 성공: ', rowData.name);
                res.json('권한 수정 성공: ' + rowData.name);
            }
        });
        dbPool.end();
    }
    catch (e) {
        console.log(e);
    }
});

//테이블 정보 쿼리문 처리
app.get('/infoTable/:user_input/:db_input', async (req, res) => {
    const userInput = req.params.user_input;
    const dbInput = req.params.db_input;
    const query = "SELECT column_name, data_type, CASE WHEN column_name IN (SELECT column_name FROM information_schema.key_column_usage WHERE table_name = \'" + userInput + "\' AND constraint_name = \'" + userInput + "_pkey\') THEN \'PK\' ELSE \'\' END AS primary_key FROM information_schema.columns WHERE table_name = \'" + userInput + "\'\;";

    sendQuery(res, query, dbInput);
});

//node.js 서버 포트 열기
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

//db에 쿼리문 보내기
function sendQuery(res, query, dbInput) {
    try {
        const dbPool = new Pool({ ...dbConnection, database: dbInput });
        dbPool.query(query, (error, result) => {
            if (error) {
                console.error(dbInput, ' 쿼리문 처리 중 오류 발생:', error);
                res.json({"data": [{"쿼리문 오류 발생" : error.message}]});
            } else {
                console.log(dbInput, ' 쿼리문 요청 데이터 전송 선공: ', query);
                if (result.rows.length == 0)
                    res.json({"data": []});
                else
                    res.json({"data": result.rows});
            }
        });
        dbPool.end();
    }
    catch (e) {
        console.log(e);
    }
}

//모든 db에 쿼리문 보내기
async function sendQueryAll(res, query) {
    const databaseListQuery = 'SELECT datname FROM pg_database WHERE datistemplate = false;';
    const { rows } = await mainPool.query(databaseListQuery);
    const databaseNames = rows.map(row => row.datname);
    const dataArr = [];
    let cnt = 0;

    try {
        for (const dbName of databaseNames) {
            const dbPool = new Pool({ ...dbConnection, database: dbName });
            dbPool.query(query, (error, result) => {
                if (error) {
                    console.error(dbName, '쿼리문 처리 중 오류 발생: ', error);
                } else {
                    console.log(dbName, ' 쿼리문 요청 데이터 전송 선공: ', query);
                    if (result.rows.length != 0) {
                        const resultWithDB = result.rows.map(row => {
                            return {
                                '검색한 db명': dbName,
                                ...row
                            }
                        });
                        for(let i= 0; i < resultWithDB.length; i++) {
                            dataArr.push(resultWithDB[i]);
                        }
                    }
                }
                dbPool.end();
                cnt++;
                if(cnt > databaseNames.length - 1) {
                    console.log(dataArr);
                    if(!(dataArr.length === 0))
                        res.json({"data": dataArr});
                    else
                        res.json({"data": []});
                }
            });
        }
    }
    catch (e) {
        console.log(e);
    }
}

//입력에 따른 쿼리문 처리
function setQuery(userInput) {
    switch (userInput) {
        //사용량 관리
        case 'dbUsage':
            return "SELECT pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname)) AS size FROM pg_database;";
        case 'tablespaceUsage':
            return "select spcname AS tablespace명, pg_size_pretty(pg_tablespace_size(spcname)) AS 사용량 from pg_tablespace ORDER BY CASE " +
                "WHEN pg_size_pretty(pg_tablespace_size(spcname)) LIKE '%GB' THEN substring(pg_size_pretty(pg_tablespace_size(spcname)), 1, length(pg_size_pretty(pg_tablespace_size(spcname))) - 2)::numeric * 1024 * 1024 * 1024 " +
                "WHEN pg_size_pretty(pg_tablespace_size(spcname)) LIKE '%MB' THEN substring(pg_size_pretty(pg_tablespace_size(spcname)), 1, length(pg_size_pretty(pg_tablespace_size(spcname))) - 2)::numeric * 1024 * 1024 " +
                "WHEN pg_size_pretty(pg_tablespace_size(spcname)) LIKE '%kB' THEN substring(pg_size_pretty(pg_tablespace_size(spcname)), 1, length(pg_size_pretty(pg_tablespace_size(spcname))) - 2)::numeric * 1024 " +
                "WHEN pg_size_pretty(pg_tablespace_size(spcname)) LIKE '%bytes' THEN substring(pg_size_pretty(pg_tablespace_size(spcname)), 1, length(pg_size_pretty(pg_tablespace_size(spcname))) - 5)::numeric END DESC;";
        case 'tableUsage':
            return "SELECT tablename AS table명, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS 사용량 FROM pg_tables where schemaname NOT IN ('utl_file','information_schema','pg_catalog') ORDER BY CASE " +
                "WHEN pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) LIKE '%GB' THEN substring(pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)), 1, length(pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))) - 2)::numeric * 1024 * 1024 * 1024" +
                "WHEN pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) LIKE '%MB' THEN substring(pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)), 1, length(pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))) - 2)::numeric * 1024 * 1024 " +
                "WHEN pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) LIKE '%kB' THEN substring(pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)), 1, length(pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))) - 2)::numeric * 1024 " +
                "WHEN pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) LIKE '%bytes' THEN substring(pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)), 1, length(pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))) - 5)::numeric END DESC;";
        case 'indexUsage':
            return "SELECT indexrelid::regclass AS index명,  pg_size_pretty(pg_relation_size(indexrelid::regclass)) AS 사용량 FROM pg_index where indexrelid > 16000 ORDER BY CASE " +
                "WHEN pg_size_pretty(pg_relation_size(indexrelid::regclass)) LIKE '%GB' THEN substring(pg_size_pretty(pg_relation_size(indexrelid::regclass)), 1, length(pg_size_pretty(pg_relation_size(indexrelid::regclass))) - 2)::numeric * 1024 * 1024 * 1024 " +
                "WHEN pg_size_pretty(pg_relation_size(indexrelid::regclass)) LIKE '%MB' THEN substring(pg_size_pretty(pg_relation_size(indexrelid::regclass)), 1, length(pg_size_pretty(pg_relation_size(indexrelid::regclass))) - 2)::numeric * 1024 * 1024 " +
                "WHEN pg_size_pretty(pg_relation_size(indexrelid::regclass)) LIKE '%kB' THEN substring(pg_size_pretty(pg_relation_size(indexrelid::regclass)), 1, length(pg_size_pretty(pg_relation_size(indexrelid::regclass))) - 2)::numeric * 1024 " +
                "WHEN pg_size_pretty(pg_relation_size(indexrelid::regclass)) LIKE '%bytes' THEN substring(pg_size_pretty(pg_relation_size(indexrelid::regclass)), 1, length(pg_size_pretty(pg_relation_size(indexrelid::regclass))) - 5)::numeric END DESC;"

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

//입력에 따른 페이지 파일 경로 설정
function setFilePath(userInput) {
    switch (userInput) {
        //초기 페이지
        case 'index':
            return '/views/index.html';

        //사용자 정보 조회 페이지
        case 'info':
            return '/views/login/info.html';

        //사용량 모니터링 페이지
        case 'monitor-db':
            return '/views/monitoring/db.html';
        case 'monitor-tablespace':
            return '/views/monitoring/tablespace.html';
        case 'monitor-table':
            return '/views/monitoring/table.html';
        case 'monitor-index':
            return '/views/monitoring/index-usage.html';
        case 'monitor-chart':
            return '/views/monitoring/chart-usage.html'

        //세션 관리 페이지
        case 'session-user':
            return '/views/session/user-info.html';
        case 'session-info':
            return '/views/session/session-info.html';

        //SQL 통계 정보 페이지
        case 'disk-top':
            return '/views/sql/disk.html';
        case 'runtime-top':
            return '/views/sql/runtime.html';

        //트랜잭션 정보 페이지
        case 'trans-time':
            return '/views/transaction/certaintime-sql.html';
        case 'trans-wait':
            return '/views/transaction/wait-block.html';
        case 'trans-block':
            return '/views/transaction/queryblock-user.html';
        case 'trans-lock':
            return '/views/transaction/lock-query.html';

        //VACUUM 정보 페이지
        case 'vac-state':
            return '/views/vacuum/run-state.html';

        //이중화 정보 페이지
        case 'dup-setting':
            return '/views/duplication/setting-info.html';
        case 'dup-service':
            return '/views/duplication/service-info.html';

        //스케줄링 정보 페이지
        case 'job-info':
            return '/views/scheduling/job.html';
        case 'job-log':
            return '/views/scheduling/job-log.html';

        //사용자 권한 관리 페이지
        case 'authority-all':
            return '/views/authority/authority-all.html';
        case 'authority-group':
            return '/views/authority/authority-group.html';
        case 'authority-user':
            return '/views/authority/authority-user.html';

        //서버 관리 페이지
        case 'master-connect':
            return '/views/connect/master.html';
        case 'slave-connect':
            return '/views/connect/slave.html';

        //404 NOT FOUNT 에러 표시 페이지
        default:
            return '/views/error/404.html';
    }
}