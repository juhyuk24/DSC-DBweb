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
    }
})

document.addEventListener('mouseup', event => {
    if (resizeData.tracking) resizeData.tracking = false
});

container = document.getElementById('dTreeview');
d = new dTree('d');

d.add(10, -1, '모니터링', 'index.html');

d.add(100, 10, 'DB별 사용량', 'index.html');

d.add(1000, 100, 'DM 데이터베이스');
d.add(1001, 1000, 'tablespace별 사용량', 'index.html');
d.add(1002, 1000, 'table별 사용량', 'index.html');
d.add(1003, 1000, 'index별 사용량', 'index.html');
d.add(1004, 1000, '접속자 정보', 'index.html');
d.add(1005, 1000, 'session 정보', 'index.html');
d.add(1006, 1000, 'SQL 통계 정보', 'index.html');
d.add(1007, 1000, '트랜잭션 정보', 'index.html');
d.add(1008, 1000, 'VACUUM정보', 'index.html');
d.add(1009, 1000, '이중화 정보', 'index.html');
d.add(1010, 1000, '스케줄링 정보', 'index.html');

d.add(1100, 100, 'MS 데이터베이스');
d.add(1101, 1100, 'tablespace별 사용량', 'index.html');
d.add(1102, 1100, 'table별 사용량', 'index.html');
d.add(1103, 1100, 'index별 사용량', 'index.html');
d.add(1104, 1100, '접속자 정보', 'index.html');
d.add(1105, 1100, 'session 정보', 'index.html');
d.add(1106, 1100, 'SQL 통계 정보', 'index.html');
d.add(1107, 1100, '트랜잭션 정보', 'index.html');
d.add(1108, 1100, 'VACUUM정보', 'index.html');
d.add(1109, 1100, '이중화 정보', 'index.html');
d.add(1110, 1100, '스케줄링 정보', 'index.html');

d.add(1200, 100, 'SI 데이터베이스');
d.add(1201, 1200, 'tablespace별 사용량', 'index.html');
d.add(1202, 1200, 'table별 사용량', 'index.html');
d.add(1203, 1200, 'index별 사용량', 'index.html');
d.add(1204, 1200, '접속자 정보', 'index.html');
d.add(1205, 1200, 'session 정보', 'index.html');
d.add(1206, 1200, 'SQL 통계 정보', 'index.html');
d.add(1207, 1200, '트랜잭션 정보', 'index.html');
d.add(1208, 1200, 'VACUUM정보', 'index.html');
d.add(1209, 1200, '이중화 정보', 'index.html');
d.add(1210, 1200, '스케줄링 정보', 'index.html');

d.add(1300, 100, 'TM 데이터베이스');
d.add(1301, 1300, 'tablespace별 사용량', 'index.html');
d.add(1302, 1300, 'table별 사용량', 'index.html');
d.add(1303, 1300, 'index별 사용량', 'index.html');
d.add(1304, 1300, '접속자 정보', 'index.html');
d.add(1305, 1300, 'session 정보', 'index.html');
d.add(1306, 1300, 'SQL 통계 정보', 'index.html');
d.add(1307, 1300, '트랜잭션 정보', 'index.html');
d.add(1308, 1300, 'VACUUM정보', 'index.html');
d.add(1309, 1300, '이중화 정보', 'index.html');
d.add(1310, 1300, '스케줄링 정보', 'index.html');

d.add(20, -1, '사용자 권한 관리', 'index.html');

d.add(200, 20, 'DB별 권한관리');

d.add(2000, 200, 'DM 데이터베이스', 'index.html');
d.add(2001, 200, 'MS 데이터베이스', 'index.html');
d.add(2002, 200, 'SI 데이터베이스', 'index.html');
d.add(2003, 200, 'TM 데이터베이스', 'index.html');

container.innerHTML = d;