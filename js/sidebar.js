$(document).ready(function setLogo() {
    const logo_str = '<a class="sidebar-brand d-flex" href="/index"><h3>DAS 모니터링 도구</h3></a><hr class="sidebar-divider my-0">';
    $('#accordionSidebar').prepend(logo_str);
});

$(document).ready(function sideResize() {
    let sidebarSize = localStorage.getItem('sidebarSize');
    if (sidebarSize)
        document.getElementById('accordionSidebar').style.width = sidebarSize + 'px';
    else
        document.getElementById('accordionSidebar').style.width = '290px';

    const resizeData = {
        tracking: false,
        startCursorScreenX: null,
        maxWidth: 900,
        minWidth: 100
    };

    document.getElementById('resize-handle').addEventListener('mousedown', event => {
        event.preventDefault();
        event.stopPropagation();
        resizeData.startWidth = parseInt(document.getElementById('accordionSidebar').style.width);
        resizeData.startCursorScreenX = event.clientX;
        resizeData.tracking = true;
    });

    document.addEventListener('mousemove', event => {
        if (resizeData.tracking) {
            const cursorScreenXDelta = event.clientX - resizeData.startCursorScreenX;
            let newWidth = Math.min(resizeData.startWidth + cursorScreenXDelta, resizeData.maxWidth);
            newWidth = Math.max(resizeData.minWidth, newWidth);
            document.getElementById('accordionSidebar').style.width = newWidth + 'px';
            console.log(newWidth, ",  " + resizeData.startWidth);
            localStorage.setItem('sidebarSize', newWidth);
        }
    });

    document.addEventListener('mouseup', event => {
        if (resizeData.tracking) resizeData.tracking = false
    });
});

$(document).ready(function setSideTree() {
    $('.dtree').prepend('<p><a href="javascript: mydtree.openAll();">모두 펼치기</a> | <a href="javascript: mydtree.closeAll();">모두 접기</a></p>');
    let a = -1, b = 9, c = 99, d = 999;   // a가 최상위 메뉴, 마지막 알파벳이 최하위 메뉴
    mydtree = new dTree('mydtree');


    if (document.URL.endsWith('/index')) {
        mydtree.clearCookie();
    }

    mydtree.add(++a, -1, 'ETRI');

        mydtree.add(++b, a, '사용량 모니터링');
            mydtree.add(++c, b, 'DB별 사용량', '/monitoring/db');
            mydtree.add(++c, b, 'tablespace별 사용량', '/monitoring/tablespace');
            mydtree.add(++c, b, 'table별 사용량', '/monitoring/table');
            mydtree.add(++c, b, 'index별 사용량', '/monitoring/indexusage');

        mydtree.add(++b, a, 'session 관리');
            mydtree.add(++c, b, '접속자 정보 확인', '/session/userinfo');
            mydtree.add(++c, b, 'session 정보 확인', '/session/sessioninfo');

        mydtree.add(++b, a, 'SQL 통계 정보');
            mydtree.add(++c, b, '디스크 사용량 기준 TOP 50', '/sql/disk');
            mydtree.add(++c, b, '실행시간 기준 TOP 50', '/sql/runtime');

        mydtree.add(++b, a, '트랜잭션 정보');
            mydtree.add(++c, b, '일정 시간 이상 실행되는 SQL 정보', '/transaction/certaintime-sql');
            mydtree.add(++c, b, 'wait 또는 blocking 되는 session', '/transaction/wait-block');
            mydtree.add(++c, b, 'query block 사용자 확인', '/transaction/queryblock-user');
            mydtree.add(++c, b, 'lock 발생 query 확인', '/transaction/lock-query');

        mydtree.add(++b, a, 'VACUUM 정보');
            mydtree.add(++c, b, '현재 autovacuum 실행 상태', '/vacuum/run-state');

        mydtree.add(++b, a, '이중화 정보');
            mydtree.add(++c, b, '이중화 설정 상태', '/duplication/setting-info');
            mydtree.add(++c, b, '이중화 서비스 상태', '/duplication/serviceinfo');

        mydtree.add(++b, a, '스케줄링 정보');
            mydtree.add(++c, b, 'job 정보', '/scheduling/job');
            mydtree.add(++c, b, 'job 수행 로그 정보', '/scheduling/job-log');

    mydtree.add(++a, -1, '사용자 권한관리', '', '', '', 'fa fa-users', 'fa fa-users');
        mydtree.add(++b, a, '전체 보기', '/authority/authority-all', '', '', 'fa fa-users', 'fa fa-users');
            mydtree.add(++c, b, '사용자1');

        mydtree.add(++b, a, '서버 관리');
            mydtree.add(++c, b, 'master', '/connect/master');
            mydtree.add(++c, b, 'slave', '/connect/slave');

        mydtree.add(++b, a, 'DBMS object');
            setDBMSobjects(b);

    async function setDBMSobjects(b) {
        await fetch('/query/dbList/postgres')
            .then(response => response.json())
            .then(data => {
                for (let i = 0; i < data.data.length; i++) {
                    mydtree.add(++c, b, data.data[i].datname);
                    fetchTable(data.data[i].datname, c);
                }
            });
    }

    async function fetchTable(datname, c) {
        await fetch('/query/tableList/' + datname)
            .then(response => response.json())
            .then(data => {
                for (let i = 0; i < data.data.length; i++) {
                    mydtree.add(++d, c, data.data[i].relname, '" data-toggle="modal" data-target="#informationModal');
                }
            });
        document.getElementById('dTreeview').innerHTML = mydtree;
    }
});

$(document).ready(function setObjectTable() {
    table_str = "<div class=\"modal fade\" id=\"informationModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"ModalLabel\" aria-hidden=\"true\"><div class=\"modal-dialog modal-lg\" role=\"document\"><div class=\"modal-content\"><div class=\"modal-header\"><h5 class=\"modal-title\" id=\"ModalLabel\">테이블 정보</h5><button class=\"close\" type=\"button\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">×</span></button></div><div class=\"modal-body\"><table id=\"modal-Table\" class=\"table table-bordered\"><thead><tr><th>칼럼 명</th><th>타입</th><th>PK</th></tr></thead><tbody></tbody></table></div><div class=\"modal-footer\"><button class=\"btn btn-primary\" type=\"button\" data-dismiss=\"modal\">확인</button></div></div></div></div>";
    $(document.body).append(table_str);
});