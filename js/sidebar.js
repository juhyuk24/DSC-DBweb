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

//트리뷰 생성
container = document.getElementById('dTreeview');

d = new dTree('d');

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
        d.add(300, 30, '디스크 사용량 기준', 'disk.html');
        d.add(301, 30, '실행시간 기준', 'runtime.html');

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
        d.add(800, 80, 'table1', '#" data-toggle="modal" data-target="#informationModal');
            d.add(8000, 800, 'column1');
            d.add(8001, 800, 'column2');
            d.add(8002, 800, 'column3');
            d.add(8003, 800, 'column4');
            d.add(8004, 800, 'column5');
            d.add(8005, 800, 'column6');
            d.add(8006, 800, 'column7');
            d.add(8007, 800, 'column8');
            d.add(8008, 800, 'column9');
            d.add(8009, 800, 'column10');
            d.add(8010, 800, 'column11');
            d.add(8011, 800, 'column12');
            d.add(8012, 800, 'column13');
        d.add(810, 80, 'table2', '#" data-toggle="modal" data-target="#informationModal');
            d.add(8100, 810, 'column1');
            d.add(8101, 810, 'column2');
            d.add(8102, 810, 'column3');
            d.add(8103, 810, 'column4');
            d.add(8104, 810, 'column5');
            d.add(8105, 810, 'column6');
            d.add(8106, 810, 'column7');
            d.add(8107, 810, 'column8');
            d.add(8108, 810, 'column9');
            d.add(8109, 810, 'column10');
            d.add(8110, 810, 'column11');
            d.add(8111, 810, 'column12');
            d.add(8112, 810, 'column13');
        d.add(820, 80, 'table3', '#" data-toggle="modal" data-target="#informationModal');
            d.add(8200, 820, 'column1');
            d.add(8201, 820, 'column2');
            d.add(8202, 820, 'column3');
            d.add(8203, 820, 'column4');
            d.add(8204, 820, 'column5');
            d.add(8205, 820, 'column6');
            d.add(8206, 820, 'column7');
            d.add(8207, 820, 'column8');
            d.add(8208, 820, 'column9');
            d.add(8209, 820, 'column10');
            d.add(8210, 820, 'column11');
            d.add(8211, 820, 'column12');
            d.add(8212, 820, 'column13');
        
d.add(1, -1, '사용자 권한관리');
    d.add(90, 1, '전체 보기', 'authority.html');
        d.add(900, 90, 'RTT', 'authority.html');
            d.add(9000, 900, '김정훈', 'authority-user1.html');
            d.add(9001, 900, '김철수', 'authority-user2.html');
            d.add(9002, 900, '방주혁', 'authority-user3.html');
            d.add(9003, 900, '안유진', 'authority-user4.html');
            d.add(9004, 900, '황태식', 'authority-user5.html');

container.innerHTML = d;