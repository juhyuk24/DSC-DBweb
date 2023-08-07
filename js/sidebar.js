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

    if (document.URL.endsWith('/index.html')) {
        d.clearCookie();
    }

    d.add(0, -1, 'ETRI');

    d.add(10, 0, '사용량 모니터링');
    d.add(100, 10, 'DB별 사용량', 'db.html');
    d.add(101, 10, 'tablespace별 사용량', 'tablespace.html');
    d.add(102, 10, 'table별 사용량', 'table.html');
    d.add(103, 10, 'index별 사용량', 'indexusage.html');

    d.add(20, 0, 'session 관리');
    d.add(200, 20, '접속자 정보 확인', 'userinfo.html');
    d.add(201, 20, 'session 정보 확인', 'sessioninfo.html');

    d.add(30, 0, 'SQL 통계 정보');
    d.add(300, 30, '디스크 사용량 기준 TOP 50', 'disk.html');
    d.add(301, 30, '실행시간 기준 TOP 50', 'runtime.html');

    d.add(40, 0, '트랜잭션 정보');
    d.add(400, 40, '일정 시간 이상 실행되는 SQL 정보', 'runsql.html');
    d.add(401, 40, 'wait 또는 blocking 되는 session', 'waitsession.html');
    d.add(402, 40, 'query block 사용자 확인', 'queryblock.html');
    d.add(403, 40, 'lock 발생 query 확인', 'querylock.html');

    d.add(50, 0, 'VACUUM 정보');
    d.add(500, 50, '현재 autovacuum 실행 상태', 'vacuuminfo.html');

    d.add(60, 0, '이중화 정보');
    d.add(600, 60, '이중화 설정 상태', 'duplicationinfo.html');
    d.add(601, 60, '이중화 서비스 상태', 'serviceinfo.html');

    d.add(70, 0, '스케줄링 정보');
    d.add(700, 70, 'job 정보', 'jobinfo.html');
    d.add(701, 70, 'job 수행 로그 정보', 'joblog.html');

    d.add(80, 0, 'DBMS object');
    d.add(800, 80, 'dmdb');
    d.add(8000, 800, 'table1', '#" data-toggle="modal" data-target="#informationModal');
    d.add(8001, 800, 'table2', '#" data-toggle="modal" data-target="#informationModal');
    d.add(8002, 800, 'table3', '#" data-toggle="modal" data-target="#informationModal');
    d.add(810, 80, 'tmdb');
    d.add(8003, 810, 'table1', '#" data-toggle="modal" data-target="#informationModal');
    d.add(8004, 810, 'table2', '#" data-toggle="modal" data-target="#informationModal');
    d.add(8005, 810, 'table3', '#" data-toggle="modal" data-target="#informationModal');
    d.add(820, 80, 'sidb');
    d.add(8006, 820, 'table1', '#" data-toggle="modal" data-target="#informationModal');
    d.add(8007, 820, 'table2', '#" data-toggle="modal" data-target="#informationModal');
    d.add(8008, 820, 'table3', '#" data-toggle="modal" data-target="#informationModal');
    d.add(830, 80, 'msdb');
    d.add(8009, 830, 'table1', '#" data-toggle="modal" data-target="#informationModal');
    d.add(8010, 830, 'table2', '#" data-toggle="modal" data-target="#informationModal');
    d.add(8011, 830, 'table3', '#" data-toggle="modal" data-target="#informationModal');

    d.add(1, -1, '사용자 권한관리');
    d.add(90, 1, '전체 보기', 'authority.html');
    d.add(900, 90, 'RTT', 'authority-group1.html');
    d.add(9000, 900, '김정훈', 'authority-user1.html');
    d.add(9001, 900, '김철수', 'authority-user2.html');
    d.add(9002, 900, '방주혁', 'authority-user3.html');
    d.add(9003, 900, '안유진', 'authority-user4.html');
    d.add(9004, 900, '황태식', 'authority-user5.html');

    d.add(910, 90, 'ETRI', 'authority-group2.html');
    d.add(9100, 910, 'user1');
    d.add(9101, 910, 'user2');
    d.add(9102, 910, 'user3');
    d.add(9103, 910, 'user4');
    d.add(9104, 910, 'user5');

    document.getElementById('dTreeview').innerHTML = d;
});