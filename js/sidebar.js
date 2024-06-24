//페이지의 태그가 모두 불러와지면 사이드바에 로고 넣기
$(document).ready(function setLogo() {
    const logo_str = '<a class="sidebar-brand d-flex" href="index.html"><h3>DAS 모니터링 도구</h3></a><hr class="sidebar-divider my-0">';
    $('#accordionSidebar').prepend(logo_str);
});

//페이지의 태그가 모두 불러와지면 사이드바 우측에 사이드바 리사이즈 핸들 넣기
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

//페이지의 태그가 모두 불러와지면 사이드바에 트리구조 메뉴 넣기
//dtree는 .add() 메소드를 통해 트리구조를 만듦
$(document).ready(function setSideTree() {
    $('.dtree').prepend('<button id="switchBtn" class="fa fa-cog border" onclick="switchmenu()"></button><span><a id="openAll" href="javascript: myMaindtree.openAll();">모두 펼치기</a> | <a id="closeAll" href="javascript: myMaindtree.closeAll();">모두 접기</a></span>');
    let a = -1, b = 9, c = 99, d = 999;   // a가 최상위 메뉴, 마지막 알파벳이 최하위 메뉴
    myMaindtree = new dTree('myMaindtree'); //모니터링, 권한관리 메뉴
    mySubdtree = new dTree('mySubdtree');   //DB 스키마 보기, 서버 관리 메뉴

    //인덱스(초기화면) 페이지면 쿠키 초기화(펼쳐져 있거나 하이라이트 되어 있는 메뉴들 초기화)
    if (document.URL.endsWith('/index')) {
        myMaindtree.clearCookie();
        mySubdtree.clearCookie();
    }

    //pid가 -1이면 루트 노드, dtree.add(id, pid, name, url, title, target, icon, iconOpen, open)
    myMaindtree.add(++a, -1, 'ETRI');

        myMaindtree.add(++b, a, '사용량 모니터링', '', '', '', 'fa fa-chart-line', 'fa fa-chart-line');
            myMaindtree.add(++c, b, 'DB별 사용량', 'db.html', '', '', 'fa fa-chart-line', 'fa fa-chart-line');
            myMaindtree.add(++c, b, 'tablespace별 사용량', 'tablespace.html', '', '', 'fa fa-chart-line', 'fa fa-chart-line');
            myMaindtree.add(++c, b, 'table별 사용량', 'table.html', '', '', 'fa fa-chart-line', 'fa fa-chart-line');
            myMaindtree.add(++c, b, 'index별 사용량', 'indexusage.html', '', '', 'fa fa-chart-line', 'fa fa-chart-line');

        myMaindtree.add(++b, a, 'session 관리', '', '', '', 'fa fa-sitemap', 'fa fa-sitemap');
            myMaindtree.add(++c, b, '접속자 정보 확인', 'userinfo.html', '', '', '', 'fa fa-sitemap', 'fa fa-sitemap');
            myMaindtree.add(++c, b, 'session 정보 확인', 'sessioninfo.html', '', '', 'fa fa-sitemap', 'fa fa-sitemap');

        myMaindtree.add(++b, a, 'SQL 통계 정보', '', '', '', 'fa fa-list-alt', 'fa fa-list-alt');
            myMaindtree.add(++c, b, '디스크 사용량 기준 TOP 50', 'disk.html', '', '', 'fa fa-list-alt', 'fa fa-list-alt');
            myMaindtree.add(++c, b, '실행시간 기준 TOP 50', 'runtime.html', '', '', 'fa fa-list-alt', 'fa fa-list-alt');

        myMaindtree.add(++b, a, '트랜잭션 정보', '', '', '', 'fa fa-exchange-alt', 'fa fa-exchange-alt');
            myMaindtree.add(++c, b, '일정 시간 이상 실행되는 SQL 정보', 'runsql.html', '', '', 'fa fa-exchange-alt', 'fa fa-exchange-alt');
            myMaindtree.add(++c, b, 'wait 또는 blocking 되는 session', 'waitsession.html', '', '', 'fa fa-exchange-alt', 'fa fa-exchange-alt');
            myMaindtree.add(++c, b, 'query block 사용자 확인', 'queryblock.html', '', '', 'fa fa-exchange-alt', 'fa fa-exchange-alt');
            myMaindtree.add(++c, b, 'lock 발생 query 확인', 'querylock.html', '', '', 'fa fa-exchange-alt', 'fa fa-exchange-alt');

        myMaindtree.add(++b, a, 'VACUUM 정보', '', '', '', 'fa fa-hdd', 'fa fa-hdd');
            myMaindtree.add(++c, b, '현재 autovacuum 실행 상태', 'vacuuminfo.html', '', '', 'fa fa-hdd', 'fa fa-hdd');

        myMaindtree.add(++b, a, '이중화 정보', '', '', '', 'fa fa-copy', 'fa fa-copy');
            myMaindtree.add(++c, b, '이중화 설정 상태', 'duplicationinfo.html', '', '', 'fa fa-copy', 'fa fa-copy');
            myMaindtree.add(++c, b, '이중화 서비스 상태', 'serviceinfo.html', '', '', 'fa fa-copy', 'fa fa-copy');

        myMaindtree.add(++b, a, '스케줄링 정보', '', '', '', 'fa fa-tasks', 'fa fa-tasks');
            myMaindtree.add(++c, b, 'job 정보', 'jobinfo.html', '', '', 'fa fa-tasks', 'fa fa-tasks');
            myMaindtree.add(++c, b, 'job 수행 로그 정보', 'joblog.html', '', '', 'fa fa-tasks', 'fa fa-tasks');

    myMaindtree.add(++a, -1, '사용자 권한관리', 'authority.html', '', '', 'fa fa-users', 'fa fa-users');

        myMaindtree.add(++b, a, 'ETRI', 'authority-group1.html', '', '', 'fa fa-users', 'fa fa-users');
            myMaindtree.add(++c, b, 'IRMM', 'authority-user1.html', '', '', 'fa fa-user', 'fa fa-user');
            myMaindtree.add(++c, b, 'DVIM', 'authority-user2.html', '', '', 'fa fa-user', 'fa fa-user');
            myMaindtree.add(++c, b, 'DPAM', 'authority-user3.html', '', '', 'fa fa-user', 'fa fa-user');

        myMaindtree.add(++b, a, 'VAIV(ETRI)', 'authority-group2.html', '', '', 'fa fa-users', 'fa fa-users');
            myMaindtree.add(++c, b, 'EPMM(SEDU)', 'authority-user4.html', '', '', 'fa fa-user', 'fa fa-user');

        myMaindtree.add(++b, a, 'VAIV', 'authority-group3.html', '', '', 'fa fa-users', 'fa fa-users');
            myMaindtree.add(++c, b, 'TMCM', 'authority-user5.html', '', '', 'fa fa-user', 'fa fa-user');
            myMaindtree.add(++c, b, 'DRMM', 'authority-user6.html', '', '', 'fa fa-user', 'fa fa-user');

        myMaindtree.add(++b, a, '스탠스', 'authority-group4.html', '', '', 'fa fa-users', 'fa fa-users');
            myMaindtree.add(++c, b, 'TMTM', 'authority-user7.html', '', '', 'fa fa-user', 'fa fa-user');

        myMaindtree.add(++b, a, '안양대학교', 'authority-group5.html', '', '', 'fa fa-users', 'fa fa-users');
            myMaindtree.add(++c, b, 'SDDM', 'authority-user8.html', '', '', 'fa fa-user', 'fa fa-user');

        myMaindtree.add(++b, a, 'KITV', 'authority-group6.html', '', '', 'fa fa-users', 'fa fa-users');
            myMaindtree.add(++c, b, 'DMSB (SARM)', 'authority-user9.html', '', '', 'fa fa-user', 'fa fa-user');
            myMaindtree.add(++c, b, 'DMSB (DESM)', 'authority-user10.html', '', '', 'fa fa-user', 'fa fa-user');
            myMaindtree.add(++c, b, 'DMSB (DASM)', 'authority-user11.html', '', '', 'fa fa-user', 'fa fa-user');

        myMaindtree.add(++b, a, 'KICT', 'authority-group7.html', '', '', 'fa fa-users', 'fa fa-users');
            myMaindtree.add(++c, b, 'FEDM', 'authority-user12.html', '', '', 'fa fa-user', 'fa fa-user');

        myMaindtree.add(++b, a, 'IANSIT', 'authority-group8.html', '', '', 'fa fa-users', 'fa fa-users');
            myMaindtree.add(++c, b, 'SDCM', 'authority-user13.html', '', '', 'fa fa-user', 'fa fa-user');
            myMaindtree.add(++c, b, 'SEMM', 'authority-user14.html', '', '', 'fa fa-user', 'fa fa-user');
            myMaindtree.add(++c, b, 'CPAM', 'authority-user15.html', '', '', 'fa fa-user', 'fa fa-user');
            myMaindtree.add(++c, b, 'DTGM', 'authority-user16.html', '', '', 'fa fa-user', 'fa fa-user');
            myMaindtree.add(++c, b, 'SDRM', 'authority-user17.html', '', '', 'fa fa-user', 'fa fa-user');
            myMaindtree.add(++c, b, 'DTSM', 'authority-user18.html', '', '', 'fa fa-user', 'fa fa-user');

        myMaindtree.add(++b, a, 'CMWORLD', 'authority-group9.html', '', '', 'fa fa-users', 'fa fa-users');
            myMaindtree.add(++c, b, 'SGMM', 'authority-user19.html', '', '', 'fa fa-user', 'fa fa-user');
            myMaindtree.add(++c, b, 'TGMM', 'authority-user20.html', '', '', 'fa fa-user', 'fa fa-user');
            myMaindtree.add(++c, b, 'GRSM', 'authority-user21.html', '', '', 'fa fa-user', 'fa fa-user');

        myMaindtree.add(++b, a, '나모웹비즈', 'authority-group10.html', '', '', 'fa fa-users', 'fa fa-users');
            myMaindtree.add(++c, b, 'VDCM', 'authority-user22.html', '', '', 'fa fa-user', 'fa fa-user');

        myMaindtree.add(++b, a, '위니텍', 'authority-group11.html', '', '', 'fa fa-users', 'fa fa-users');
            myMaindtree.add(++c, b, 'UTSM', 'authority-user23.html', '', '', 'fa fa-user', 'fa fa-user');

    mySubdtree.add(++a, -1, 'DB 스키마 보기', '', '', '', 'fa fa-inbox', 'fa fa-inbox');
        mySubdtree.add(++b, a, 'dmdb', '\" data-toggle=\"modal\" data-target=\"#informationModal', '', '', 'fa fa-laptop', 'fa fa-laptop');
        mySubdtree.add(++b, a, 'tmdb', '\" data-toggle=\"modal\" data-target=\"#informationModal', '', '', 'fa fa-laptop', 'fa fa-laptop');
        mySubdtree.add(++b, a, 'sidb', '\" data-toggle=\"modal\" data-target=\"#informationModal', '', '', 'fa fa-laptop', 'fa fa-laptop');
        mySubdtree.add(++b, a, 'msdb', '\" data-toggle=\"modal\" data-target=\"#informationModal', '', '', 'fa fa-laptop', 'fa fa-laptop');

    mySubdtree.add(++a, -1, '서버 관리');
        mySubdtree.add(++b, a, 'master', 'master.html', '', '', 'fa fa-laptop', 'fa fa-laptop');
        mySubdtree.add(++b, a, 'slave', 'slave.html', '', '', 'fa fa-laptop', 'fa fa-laptop');

    //트리구조 표시하기
    showmenu();

    //트리에 권한관리 메뉴 넣기
    async function setAuthority(a) {
        myMaindtree.add(++b, a, '전체 보기', '/authority-all', '', '', 'fa fa-users', 'fa fa-users');
        await fetchAuthority(b);
    }

    //권한관리 메뉴 데이터 받아와서 트리에 넣기
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
                //비동기 함수라 트리구조 표시 함수 써야 함
                showmenu();
            });
    }

    //DB 스키마보기 메뉴에 들어갈 데이터 받아와서 트리에 넣기 - db 데이터
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

    //DB 스키마보기 메뉴에 들어갈 데이터 받아와서 트리에 넣기 - table 데이터
    async function fetchTable(datname, b) {
        await fetch('/query/tableList/' + datname)
            .then(response => response.json())
            .then(data => {
                for (let i = 0; i < data.data.length; i++) {
                    mySubdtree.add(++c, b, data.data[i].relname, '\"onclick = fetchModal(\''+ data.data[i].relname + '\',\'' + datname + '\') data-toggle=\"modal\" data-target=\"#informationModal', '', '', 'fa fa-table', 'fa fa-table');
                }
            });
        //여기서 트리구조 표시 함수 실행해야 db와 table 둘다 있는 구조로 표시됨
        showmenu();
    }
});

//페이지의 태그가 모두 불러와지면 informationModal을 body태그에 append
//DB스키마 보기에 있는 각각의 메뉴를 눌렀을 때 정보를 표시할 modal
$(document).ready(function setObjectTable() {
    table_str = "<div class=\"modal fade\" id=\"informationModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"ModalLabel\" aria-hidden=\"true\"><div class=\"modal-dialog modal-lg\" role=\"document\"><div class=\"modal-content\"><div class=\"modal-header\"><h5 class=\"modal-title\" id=\"ModalLabel\">테이블 정보</h5><button class=\"close\" type=\"button\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">×</span></button></div><div class=\"modal-body\"><table class=\"table table-bordered\"><thead><tr><th>칼럼 명</th><th>타입</th><th>PK</th></tr></thead><tbody id='modal-Tbody'></tbody></table></div><div class=\"modal-footer\"><button class=\"btn btn-primary\" type=\"button\" data-dismiss=\"modal\">확인</button></div></div></div></div>";
    $(document.body).append(table_str);
});

//DB스키마 보기에 있는 각각의 메뉴를 눌렀을 때 onclick으로 이 함수가 호출되어 테이블 정보를 넣어 줌
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

//메뉴를 전환해주는 함수, localStorage 이용함
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

//사이드바에 트리구조 표시해주는 함수, 현재 표시된 메뉴에 따라 모두 펼치기, 접기의 대상도 변경해 줌
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