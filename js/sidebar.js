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
    $('.dtree').prepend('<button id="switchBtn" class="fa fa-cog border" onclick="switchmenu()"></button><span><a id="openAll" href="javascript: myMaindtree.openAll();">모두 펼치기</a> | <a id="closeAll" href="javascript: myMaindtree.closeAll();">모두 접기</a></span>');
    let a = -1, b = 9, c = 99, d = 999;   // a가 최상위 메뉴, 마지막 알파벳이 최하위 메뉴
    myMaindtree = new dTree('myMaindtree');
    mySubdtree = new dTree('mySubdtree');


    if (document.URL.endsWith('/index')) {
        myMaindtree.clearCookie();
        mySubdtree.clearCookie();
    }

    myMaindtree.add(++a, -1, 'ETRI');

        myMaindtree.add(++b, a, '사용량 모니터링', '', '', '', 'fa fa-chart-line', 'fa fa-chart-line');
            myMaindtree.add(++c, b, 'DB별 사용량', '/monitor-db', '', '', 'fa fa-chart-line', 'fa fa-chart-line');
            myMaindtree.add(++c, b, 'tablespace별 사용량', '/monitor-tablespace', '', '', 'fa fa-chart-line', 'fa fa-chart-line');
            myMaindtree.add(++c, b, 'table별 사용량', '/monitor-table', '', '', 'fa fa-chart-line', 'fa fa-chart-line');
            myMaindtree.add(++c, b, 'index별 사용량', '/monitor-indexusage', '', '', 'fa fa-chart-line', 'fa fa-chart-line');

        myMaindtree.add(++b, a, 'session 관리', '', '', '', 'fa fa-sitemap', 'fa fa-sitemap');
            myMaindtree.add(++c, b, '접속자 정보 확인', '/session-user', '', '', '', 'fa fa-sitemap', 'fa fa-sitemap');
            myMaindtree.add(++c, b, 'session 정보 확인', '/session-info', '', '', 'fa fa-sitemap', 'fa fa-sitemap');

        myMaindtree.add(++b, a, 'SQL 통계 정보', '', '', '', 'fa fa-list-alt', 'fa fa-list-alt');
            myMaindtree.add(++c, b, '디스크 사용량 기준 TOP 50', '/disk-top', '', '', 'fa fa-list-alt', 'fa fa-list-alt');
            myMaindtree.add(++c, b, '실행시간 기준 TOP 50', '/runtime-top', '', '', 'fa fa-list-alt', 'fa fa-list-alt');

        myMaindtree.add(++b, a, '트랜잭션 정보', '', '', '', 'fa fa-exchange-alt', 'fa fa-exchange-alt');
            myMaindtree.add(++c, b, '일정 시간 이상 실행되는 SQL 정보', '/trans-time', '', '', 'fa fa-exchange-alt', 'fa fa-exchange-alt');
            myMaindtree.add(++c, b, 'wait 또는 blocking 되는 session', '/trans-wait', '', '', 'fa fa-exchange-alt', 'fa fa-exchange-alt');
            myMaindtree.add(++c, b, 'query block 사용자 확인', '/trans-block', '', '', 'fa fa-exchange-alt', 'fa fa-exchange-alt');
            myMaindtree.add(++c, b, 'lock 발생 query 확인', '/trans-lock', '', '', 'fa fa-exchange-alt', 'fa fa-exchange-alt');

        myMaindtree.add(++b, a, 'VACUUM 정보', '', '', '', 'fa fa-hdd', 'fa fa-hdd');
            myMaindtree.add(++c, b, '현재 autovacuum 실행 상태', '/vac-state', '', '', 'fa fa-hdd', 'fa fa-hdd');

        myMaindtree.add(++b, a, '이중화 정보', '', '', '', 'fa fa-copy', 'fa fa-copy');
            myMaindtree.add(++c, b, '이중화 설정 상태', '/dup-setting', '', '', 'fa fa-copy', 'fa fa-copy');
            myMaindtree.add(++c, b, '이중화 서비스 상태', '/dup-service', '', '', 'fa fa-copy', 'fa fa-copy');

        myMaindtree.add(++b, a, '스케줄링 정보', '', '', '', 'fa fa-tasks', 'fa fa-tasks');
            myMaindtree.add(++c, b, 'job 정보', '/job-info', '', '', 'fa fa-tasks', 'fa fa-tasks');
            myMaindtree.add(++c, b, 'job 수행 로그 정보', '/job-log', '', '', 'fa fa-tasks', 'fa fa-tasks');

    myMaindtree.add(++a, -1, '사용자 권한관리', '', '', '', 'fa fa-users', 'fa fa-users');
        setAuthority(a);

    mySubdtree.add(++a, -1, 'DB 스키마 보기', '', '', '', 'fa fa-inbox', 'fa fa-inbox');
        setDBMSobjects(a);

    mySubdtree.add(++a, -1, '서버 관리');
        mySubdtree.add(++b, a, 'master', '/master-connect', '', '', 'fa fa-laptop', 'fa fa-laptop');
        mySubdtree.add(++b, a, 'slave', '/slave-connect', '', '', 'fa fa-laptop', 'fa fa-laptop');

    showmenu();

    async function setAuthority(a) {
        myMaindtree.add(++b, a, '전체 보기', '/authority-all', '', '', 'fa fa-users', 'fa fa-users');
        await fetchAuthority(b);
    }

    function fetchAuthority(b) {
        fetch('/query/authority-all/postgres')
            .then(response => response.json())
            .then(data => {
                var companys = [];
                var menus = [];
                let index = -1;

                for (let i = 0; i < data.data.length; i++) {
                    for (let j = 0; j < companys.length; j++) {
                        if(companys[j] == data.data[i].담당기관) {
                            index = j;
                            break;
                        }
                        else index = -1;
                    }
                    if(index == -1) {
                        myMaindtree.add(++c, b, data.data[i].담당기관, '/authority-group/' + data.data[i].담당기관, '', '', 'fa fa-users', 'fa fa-users');
                        myMaindtree.add(++d, c, data.data[i].모듈명, '/authority-user/' + data.data[i].모듈명, '', '', 'fa fa-user', 'fa fa-user');
                        companys.push(data.data[i].담당기관);
                        menus.push(c);
                    }
                    else {
                        myMaindtree.add(++d, menus[index], data.data[i].모듈명, '/authority-user/' + data.data[i].모듈명, '', '', 'fa fa-user', 'fa fa-user');
                    }
                }
                showmenu();
            });
    }

    async function setDBMSobjects(a) {
        await fetch('/query/dbList/postgres')
            .then(response => response.json())
            .then(data => {
                for (let i = 0; i < data.data.length; i++) {
                    mySubdtree.add(++b, a, data.data[i].datname, '', '', '', 'fa fa-database', 'fa fa-database');
                    fetchTable(data.data[i].datname, b);
                }
            });
    }

    async function fetchTable(datname, b) {
        await fetch('/query/tableList/' + datname)
            .then(response => response.json())
            .then(data => {
                for (let i = 0; i < data.data.length; i++) {
                    mySubdtree.add(++c, b, data.data[i].relname, '\"onclick = fetchModal(\''+ data.data[i].relname + '\',\'' + datname + '\') data-toggle=\"modal\" data-target=\"#informationModal', '', '', 'fa fa-table', 'fa fa-table');
                }
            });
        showmenu();
    }
});

$(document).ready(function setObjectTable() {
    table_str = "<div class=\"modal fade\" id=\"informationModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"ModalLabel\" aria-hidden=\"true\"><div class=\"modal-dialog modal-lg\" role=\"document\"><div class=\"modal-content\"><div class=\"modal-header\"><h5 class=\"modal-title\" id=\"ModalLabel\">테이블 정보</h5><button class=\"close\" type=\"button\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">×</span></button></div><div class=\"modal-body\"><table class=\"table table-bordered\"><thead><tr><th>칼럼 명</th><th>타입</th><th>PK</th></tr></thead><tbody id='modal-Tbody'></tbody></table></div><div class=\"modal-footer\"><button class=\"btn btn-primary\" type=\"button\" data-dismiss=\"modal\">확인</button></div></div></div></div>";
    $(document.body).append(table_str);
});

async function fetchModal(relname, datname) {
    var table = document.getElementById("modal-Tbody");
    var modal_str = '';

    await fetch('/infoTable/' + relname + '/' + datname)
        .then(response => response.json())
        .then(data => {
            for(let i=0; i<data.data.length; i++) {
                if(data.data[i].primary_key == 'PK')
                    data.data[i].primary_key = 'O';
                modal_str += "<tr><td>" + data.data[i].column_name + "</td><td>" + data.data[i].data_type + "</td><td>" + data.data[i].primary_key + "</td></tr>";
            }
        });

    table.innerHTML = modal_str;
}

function switchmenu() {
    var value = localStorage.getItem("MENU_VALUE");
    if(value == "main") {
        localStorage.setItem("MENU_VALUE", "sub");
        showmenu();
    }
    else {
        localStorage.setItem("MENU_VALUE", "main");
        showmenu();
    }
}

function showmenu() {
    var value = localStorage.getItem("MENU_VALUE");

    if(!value)
        localStorage.setItem("MENU_VALUE", "main");

    if(value == "main") {
        document.getElementById('dTreeview').innerHTML = myMaindtree;
        document.querySelector("#openAll").href = "javascript: myMaindtree.openAll();"
        document.querySelector("#closeAll").href = "javascript: myMaindtree.closeAll();"
    }
    else {
        document.getElementById('dTreeview').innerHTML = mySubdtree;
        document.querySelector("#openAll").href = "javascript: mySubdtree.openAll();"
        document.querySelector("#closeAll").href = "javascript: mySubdtree.closeAll();"
    }
}