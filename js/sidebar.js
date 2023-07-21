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

d.add(0, -1, 'ETRI');

    d.add(10, 0, '사용량 모니터링');
        d.add(100, 10, 'DB별 사용량', 'charts.html');
        d.add(101, 10, 'tablespace별 사용량', 'table.html');
        d.add(102, 10, 'table별 사용량', 'table.html');
        d.add(103, 10, 'index별 사용량', 'table.html');

    d.add(20, 0, 'session 관리');
        d.add(200, 20, '접속자 정보 확인', 'table.html');
        d.add(201, 20, 'session 정보 확인', 'table.html');

    d.add(30, 0, 'SQL 통계 정보');
        d.add(300, 30, '디스크 사용량 기준', 'table.html');
        d.add(301, 30, '실행시간 기준', 'table.html');

    d.add(40, 0, 'DBMS object');
        d.add(400, 40, '테이블 리스트');
        d.add(4000, 400, '테이블 칼럼 정보', 'table.html');

    d.add(50, 0, '트랜잭션 정보');
        d.add(500, 50, '일정 시간 이상 실행되는 SQL 정보', 'table.html');
        d.add(501, 50, 'wait 또는 blocking 되는 session', 'table.html');
        d.add(502, 50, 'query block 사용자 확인', 'table.html');
        d.add(503, 50, 'lock 발생 query 확인', 'table.html');

    d.add(60, 0, 'VACUUM 정보');
        d.add(600, 60, '현재 autovacuum 실행 상태', 'table.html');

    d.add(70, 0, '이중화 정보');
        d.add(700, 70, '이중화 설정 상태', 'table.html');
        d.add(701, 70, '이중화 서비스 상태', 'table.html');

    d.add(80, 0, '스케줄링 정보');
        d.add(800, 80, 'job 정보', 'table.html');
        d.add(801, 80, 'job 수행 로그 정보', 'table.html');

container.innerHTML = d;