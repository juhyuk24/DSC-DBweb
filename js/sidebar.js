$(document).ready(function sideResize() {
    let sidebarSize = localStorage.getItem('sidebarSize');

    if(sidebarSize) document.getElementById('accordionSidebar').style.width = sidebarSize + 'px';
    else document.getElementById('accordionSidebar').style.width = '220px';

    const resizeData = {
        tracking: false,
        startWidth: null,
        startCursorX: null,
        maxWidth: 900,
        minWidth: 100
    };

    document.getElementById('resize-handle').addEventListener('mousedown', event => {
        event.preventDefault();
        event.stopPropagation();
        resizeData.startWidth = document.getElementById('accordionSidebar').clientWidth;
        resizeData.startCursorX = event.clientX;
        resizeData.tracking = true;
        console.log(event.clientX);
    });

    document.addEventListener('mousemove', event => {
        if (resizeData.tracking) {
            const cursorXDelta = event.clientX - resizeData.startCursorX;
            let newWidth = resizeData.startWidth + cursorXDelta;
            newWidth = Math.min(resizeData.maxWidth, Math.max(resizeData.minWidth, newWidth));
            document.getElementById('accordionSidebar').style.width = newWidth + 'px';
            localStorage.setItem('sidebarSize', newWidth);
            document.body.style.cursor = 'ew-resize';
        }
    });

    document.addEventListener('mouseup', event => {
        if (resizeData.tracking) resizeData.tracking = false;
        document.body.style.cursor = 'auto';
    });
});

$(document).ready(function sideTree() {
    d = new dTree('d');

    if (document.URL.endsWith('/index.html')) {
        d.clearCookie();
    }

    d.add(0, -1, 'ETRI');

    d.add(11, 0, '서버 관리');
    d.add(110, 11, 'master','manageConnection-master.html');
    d.add(111, 11, 'slave','manageConnection-slave.html');

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

    d.add(900, 90, 'ETRI', 'authority-group1.html');
    d.add(9000, 900, 'IRMM', 'authority-user1.html');
    d.add(9001, 900, 'DVIM', 'authority-user2.html');
    d.add(9002, 900, 'DPAM', 'authority-user3.html');

    d.add(901, 90, 'VAIV(ETRI)', 'authority-group2.html');
    d.add(9003, 901, 'EPMM(SEDU)', 'authority-user4.html');

    d.add(902, 90, 'VAIV', 'authority-group3.html');
    d.add(9004, 902, 'TMCM', 'authority-user5.html');
    d.add(9005, 902, 'DRMM', 'authority-user6.html');

    d.add(903, 90, '스탠스', 'authority-group4.html');
    d.add(9006, 903, 'TMTM', 'authority-user7.html');

    d.add(904, 90, '안양대학교', 'authority-group5.html');
    d.add(9007, 904, 'SDDM', 'authority-user8.html');

    d.add(905, 90, 'KITV', 'authority-group6.html');
    d.add(9008, 905, 'DMSB (SARM)', 'authority-user9.html');
    d.add(9009, 905, 'DMSB (DESM)', 'authority-user10.html');
    d.add(9010, 905, 'DMSB (DASM)', 'authority-user11.html');

    d.add(906, 90, 'KICT', 'authority-group7.html');
    d.add(9011, 906, 'FEDM', 'authority-user12.html');

    d.add(907, 90, 'IANSIT', 'authority-group8.html');
    d.add(9012, 907, 'SDCM', 'authority-user13.html');
    d.add(9013, 907, 'SEMM', 'authority-user14.html');
    d.add(9014, 907, 'CPAM', 'authority-user15.html');
    d.add(9015, 907, 'DTGM', 'authority-user16.html');
    d.add(9016, 907, 'SDRM', 'authority-user17.html');
    d.add(9017, 907, 'DTSM', 'authority-user18.html');

    d.add(908, 90, 'CMWORLD', 'authority-group9.html');
    d.add(9018, 908, 'SGMM', 'authority-user19.html');
    d.add(9019, 908, 'TGMM', 'authority-user20.html');
    d.add(9020, 908, 'GRSM', 'authority-user21.html');

    d.add(909, 90, '나모웹비즈', 'authority-group10.html');
    d.add(9021, 909, 'VDCM', 'authority-user22.html');

    d.add(910, 90, '위니텍', 'authority-group11.html');
    d.add(9022, 910, 'UTSM', 'authority-user23.html');

    document.getElementById('dTreeview').innerHTML = d;
});