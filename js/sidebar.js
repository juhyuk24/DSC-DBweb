$(document).ready(function sideResize() {
    let sidebarSize = localStorage.getItem('sidebarSize');
    if (sidebarSize) {
        document.getElementById('accordionSidebar').style.width = sidebarSize + 'px';
    }
    const resizeData = {
        tracking: false,
        startCursorScreenX: null,
        maxWidth: 900,
        minWidth: 100
    };

    document.getElementById('resize-handle').addEventListener('mousedown', event => {
        event.preventDefault();
        event.stopPropagation();
        resizeData.startWidth = document.getElementById('accordionSidebar').offsetWidth;
        resizeData.startCursorScreenX = event.screenX;
        resizeData.tracking = true;
    });

    document.addEventListener('mousemove', event => {
        if (resizeData.tracking) {
            const cursorScreenXDelta = event.screenX - resizeData.startCursorScreenX;
            let newWidth = Math.min(resizeData.startWidth + cursorScreenXDelta, resizeData.maxWidth);
            newWidth = Math.max(resizeData.minWidth, newWidth);
            document.getElementById('accordionSidebar').style.width = newWidth + 'px';
            localStorage.setItem('sidebarSize', newWidth);
        }
    })

    document.addEventListener('mouseup', event => {
        if (resizeData.tracking) resizeData.tracking = false
    });
});

$(document).ready(function sideTree() {
    d = new dTree('d');
    let tableNum = 800;
    let colNum = 8000;

    if (document.URL.endsWith('/index')) {
        d.clearCookie();
    }

    d.add(0, -1, 'ETRI');

    d.add(10, 0, '사용량 모니터링');
    d.add(100, 10, 'DB별 사용량', '/monitoring/db');
    d.add(101, 10, 'tablespace별 사용량', '/monitoring/tablespace');
    d.add(102, 10, 'table별 사용량', '/monitoring/table');
    d.add(103, 10, 'index별 사용량', '/monitoring/indexusage');

    d.add(20, 0, 'session 관리');
    d.add(200, 20, '접속자 정보 확인', '/session/userinfo');
    d.add(201, 20, 'session 정보 확인', '/session/sessioninfo');

    d.add(30, 0, 'SQL 통계 정보');
    d.add(300, 30, '디스크 사용량 기준', '/sql/disk');
    d.add(301, 30, '실행시간 기준', '/sql/runtime');

    d.add(40, 0, '트랜잭션 정보');
    d.add(400, 40, '일정 시간 이상 실행되는 SQL 정보', '/transaction/certaintime-sql');
    d.add(401, 40, 'wait 또는 blocking 되는 session', '/transaction/wait-block');
    d.add(402, 40, 'query block 사용자 확인', '/transaction/queryblock-user');
    d.add(403, 40, 'lock 발생 query 확인', '/transaction/lock-query');

    d.add(50, 0, 'VACUUM 정보');
    d.add(500, 50, '현재 autovacuum 실행 상태', '/vacuum/run-state');

    d.add(60, 0, '이중화 정보');
    d.add(600, 60, '이중화 설정 상태', '/duplication/setting-info');
    d.add(601, 60, '이중화 서비스 상태', '/duplication/serviceinfo');

    d.add(70, 0, '스케줄링 정보');
    d.add(700, 70, 'job 정보', '/scheduling/job');
    d.add(701, 70, 'job 수행 로그 정보', '/scheduling/job-log');

    d.add(80, 0, 'DBMS object');

    fetch('/tableNames/dsec')
        .then((response) => response.json())
        .then((data) => {
            for (let i = 0; i < data.tables.length; i++) {
                d.add(tableNum + i, 80, data.tables[i], '#" data-toggle="modal" data-target="#informationModal');
            }
            let copydata = data.tables;

            for (let i = 0; i < copydata.length; i++) {
                fetch('/columnNames/' + copydata[i])
                    .then((response) => response.json())
                    .then((data) => {
                        for (let i = 0; i < data.tables.length; i++) {
                            d.add(colNum + i, tableNum + i, data.tables[i], );
                        }
                    })
            }
        })
        .catch((error) => {
            console.error('오류 발생:', error);
        });

    d.add(1, -1, '사용자 권한관리');
    d.add(90, 1, '전체 보기', '/authority/authority-all');
    d.add(900, 90, '사용자1');

    document.getElementById('dTreeview').innerHTML = d;
});