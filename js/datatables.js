//데이터테이블을 사용하는 페이지는 body태그에 onload속성에 setTable(query)로 이 함수를 호출함
function setTable(req) {
    //권한관리 페이지가 아닐때만 DB_VALUE값 읽어옴
    if(!document.URL.includes('/authority')) {
        if(localStorage.getItem("DB_VALUE"))
            req += "/" + localStorage.getItem("DB_VALUE");
        else
            req += "/all";
    }

    //테이블에 넣을 데이터 불러오기
    $.getJSON(req, function (data) {
        var columns = [];
        for (var val in data.data[0]) {
            columns.push({"data": val, "title": val});
        }
        if (document.URL.includes('/authority')) columns.push({"data": "모듈명", "title": "저장"});

        var table = $('#dataTable').DataTable({
            columns: columns,
            data: data.data,
            //표시 건수
            lengthChange: true,
            //검색
            searching: {
                return: true
            },
            //정렬
            ordering: true,
            order: [],
            //정보 표시
            info: true,
            //페이징
            paging: true,
            scrollX: true,
            lengthMenu: [[-1, 5, 10, 25, 50, 100], ["전체", "5개", "10개", "25개", "50개", "100개"]],
            language: {
                emptyTable: "데이터가 없습니다.",
                lengthMenu: "페이지에_MENU_건의 데이터 표시",
                zeroRecords: "검색 결과 없음",
                search: "검색:",
                info: "현재 _START_ - _END_ / 총 _TOTAL_건",
                infoEmpty: "데이터 없음",
                infoFiltered: "( _MAX_건의 데이터에서 필터링됨 )",
                loadingRecords: "로딩중...",
                processing: "잠시만 기다려 주세요...",
                paginate: {
                    "next": "다음",
                    "previous": "이전"
                },
                select: {
                    rows: ""
                }
            }
        });
        setTableBtns(table);
    });
}

//권한관리 페이지에서 유저권한 페이지 테이블 생성해주는 함수
function setUserTable(req) {
    $.getJSON(req, function (data) {
        var columns = [];
        for (var val in data.data[0]) {
            columns.push({"data": val, "title": val});
        }
        if (document.URL.includes('/authority')) columns.push({"data": "모듈명", "title": "저장"});

        var table = $('#dataTable').DataTable({
            columns: columns,
            data: data.data,
            //표시 건수
            lengthChange: false,
            //검색
            searching: false,
            //정렬
            ordering: false,
            order: [],
            //정보 표시
            info: false,
            //페이징
            paging: false,
            scrollX: true,
            lengthMenu: [[-1, 5, 10, 25, 50, 100], ["전체", "5개", "10개", "25개", "50개", "100개"]],
            language: {
                emptyTable: "데이터가 없습니다.",
                lengthMenu: "페이지에_MENU_건의 데이터 표시",
                zeroRecords: "검색 결과 없음",
                search: "검색:",
                info: "현재 _START_ - _END_ / 총 _TOTAL_건",
                infoEmpty: "데이터 없음",
                infoFiltered: "( _MAX_건의 데이터에서 필터링됨 )",
                loadingRecords: "로딩중...",
                processing: "잠시만 기다려 주세요...",
                paginate: {
                    "next": "다음",
                    "previous": "이전"
                },
                select: {
                    rows: ""
                }
            }
        });
        setCheckbox();
    });
}

//데이터테이블 상단에 필요한 버튼들을 생성해주는 함수 - 다른 함수들을 모아서 한번에 호출하기 위함
function setTableBtns(table) {
    setFilter(table);

    if (document.URL.includes('/authority')) {
        //권한관리 페이지면 체크박스 넣기
        setCheckbox();
        setSaveAllBtn();
    } else {
        //권한관리 페이지는 DB선택버튼 필요없음
        setDBselectBtn();
    }
    setAdditionalBtn();
}

//칼럼 검색 필터를 생성해주는 함수
function setFilter(table) {
    var filter_str = '<span style="white-space: nowrap;">필터: <select id="search-filter" style="margin: 5px;"><option value="all">전체 검색</option></span>';
    var selectedColumn = -1;

    $('#dataTable thead th').each(function () {
        var title = $(this).text();
        filter_str += '<option value="' + title + '">' + title + '</option>';
    });
    filter_str += '</select>';
    $('#dataTable_filter').prepend(filter_str);

    $('#search-filter').on('change', function () {
        selectedColumn = document.querySelector('#search-filter').selectedIndex - 1;
        searchColumn();
    });

    $('#dataTable_filter input[type="search"]').on('input', function() {
        searchColumn();
    });

    function searchColumn() {
        var searchValue = $('#dataTable_filter input[type="search"]').val();
        table.columns().search('').draw(); //칼럼 필터 초기화

        if (selectedColumn === -1) {
            table.search(searchValue).draw();
        } else {
            table.column(selectedColumn).search(searchValue).draw(); //칼럼 인덱스로 지정하여 검색하기
        }
    }
}

//권한관리 페이지에서 각 db의 읽기, 쓰기 권한에 대해 체크박스로 표시해주는 함수
function setCheckbox() {
    $('#dataTable tbody td').each(function () {
        var auth = $(this).text();
        switch (auth) {
            case 'o':
                this.innerHTML = '<input type="checkbox" checked>';
                break;
            case 'O':
                this.innerHTML = '<input type="checkbox" checked>';
                break;
            case 'x':
                this.innerHTML = '<input type="checkbox">';
                break;
            case 'X':
                this.innerHTML = '<input type="checkbox">';
                break;
            default:
                break;
        }
    });
    setSaveBtn();
}

//권한관리 페이지에서 각각의 행에 저장 버튼을 생성해주는 함수
function setSaveBtn() {
    var rows = $('#dataTable tbody tr');

    for (let i = 0; i < rows.length; i++) {
        var row = $(rows[i]);
        var save_str = '<a class=\"btn btn-primary btn-refresh\"><span class=\"button-content\">저장</span></a>';
        row.find('td:last-child').html(save_str);
    }

    const saveButtons = document.querySelectorAll('.btn-refresh');
    saveButtons.forEach(button => {
        button.addEventListener('click', clickSaveBtn.bind(null, button));
    });
}

//저장 버튼이 클릭 되었을 때 실행되는 함수
async function clickSaveBtn(button) {
    const row = button.closest('tr');
    const rowData = {
        name: row.querySelector('td:nth-child(1)').textContent,
        checkbox1: row.querySelector('td:nth-child(2) input').checked ? 'o' : 'x',
        checkbox2: row.querySelector('td:nth-child(3) input').checked ? 'o' : 'x',
        checkbox3: row.querySelector('td:nth-child(4) input').checked ? 'o' : 'x',
        checkbox4: row.querySelector('td:nth-child(5) input').checked ? 'o' : 'x',
        checkbox5: row.querySelector('td:nth-child(6) input').checked ? 'o' : 'x',
        checkbox6: row.querySelector('td:nth-child(7) input').checked ? 'o' : 'x',
        checkbox7: row.querySelector('td:nth-child(8) input').checked ? 'o' : 'x',
        checkbox8: row.querySelector('td:nth-child(9) input').checked ? 'o' : 'x'
    };
    try {
        const response = await fetch('/authority/updateAuth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rowData)
        });

        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error('Error:', error);
    }
}

//권한관리 페이지에서 변경사항 일괄 저장 버튼 생성 함수
function setSaveAllBtn() {
    var save_str = '<a class="btn btn-primary" onclick="clickSaveAllBtn()" style="margin: 5px;">변경사항 일괄 저장</span></a>';
    $('#dataTable_filter').prepend(save_str);
}

//변경사항 일괄 저장 버튼이 눌렸을 때 실행되는 함수
function clickSaveAllBtn() {
    const saveButtons = document.querySelectorAll('.btn-refresh');
    saveButtons.forEach(button => {
        clickSaveBtn(button);
    });
}

//DB선택 버튼 생성 함수
function setDBselectBtn() {
    var selectDB_str = '<span>DB선택: </span><select id="select-db" style="margin: 5px;" onchange="changeDB(this)">';
    selectDB_str += '<option value="all">전체 선택</option>'
    selectDB_str += '<option value="sidb">sidb</option>';
    selectDB_str += '<option value="tmdb">tmdb</option>';
    selectDB_str += '<option value="dmdb">dmdb</option>';
    selectDB_str += '<option value="msdb">msdb</option></select>';
    $('#dataTable_filter').prepend(selectDB_str);

    const select = document.querySelector("#select-db");
    const dbValue = localStorage.getItem("DB_VALUE");

    if (dbValue) {
        select.value = dbValue;
    }
}

//특정 페이지에만 필요한 버튼들이 생성되는 함수
function setAdditionalBtn() {
    //차트로 보기 버튼 - ~~별 사용량
    if (document.URL.endsWith('monitor-tablespace') || document.URL.endsWith('monitor-table') || document.URL.endsWith('monitor-index')) {
        var showChart_str = '<a class="btn btn-primary btn-refresh" href="/monitor-chart" style="margin: 5px;">차트로 보기</a>';
        $('#dataTable_filter').prepend(showChart_str);
    }

    //세션 상태 별로 검색 셀렉트박스 - session 정보 확인
    if (document.URL.endsWith('session-info')) {
        var showChart_str = '<span>세션 상태: </span><select style="margin: 5px;"><option>전체</option><option>active</option><option>idle</option></select>';
        $('#dataTable_filter').prepend(showChart_str);
    }

    //실행시간 조건 검색 셀렉트박스 - 일정 시간 이상 실행되는 SQL 정보
    if (document.URL.endsWith('trans-time')) {
        var selectDate_str = '<span>검색 시간: </span><input type=\"time\" id=\"startdate\"><script>document.getElementById(\'startdate\').value = new Date().toISOString().substring(0, 10);</script><span> - </span><input type=\"time\" id=\"enddate\" style="margin: 5px;"><script>document.getElementById(\'enddate\').value = new Date().toISOString().substring(0, 10);</script>';
        $('#dataTable_filter').prepend(selectDate_str);
    }

    //기간 지정 검색 캘린더 - 이중화 서비스 상태
    if (document.URL.endsWith('dup-service')) {
        var selectDate_str = '<span>검색 기간: </span><input type=\"datetime-local\" id=\"startdate\"><script>document.getElementById(\'startdate\').value = new Date().toISOString().substring(0, 10);</script><span> - </span><input type=\"datetime-local\" id=\"enddate\" style="margin: 5px;"><script>document.getElementById(\'enddate\').value = new Date().toISOString().substring(0, 10);</script>';
        $('#dataTable_filter').prepend(selectDate_str);
    }

    //기간 지정 검색 캘린더, 활성화 상태 조건 검색 셀렉트박스 - job 정보
    if (document.URL.endsWith('job-info')) {
        var selectDate_str = '<span>검색 기간: </span><input type=\"date\" id=\"startdate\"><script>document.getElementById(\'startdate\').value = new Date().toISOString().substring(0, 10);</script><span> - </span><input type=\"date\" id=\"enddate\" style="margin: 5px;"><script>document.getElementById(\'enddate\').value = new Date().toISOString().substring(0, 10);</script>';
        $('#dataTable_filter').prepend(selectDate_str);
        var showChart_str = '<span>활성화 상태: </span><select style="margin: 5px;"><option>전체</option><option>t</option><option>f</option></select>';
        $('#dataTable_filter').prepend(showChart_str);
    }

    //기간 지정 검색 캘린더 - job 수행 로그 정보
    if (document.URL.endsWith('job-log')) {
        var selectDate_str = '<span>검색 기간: </span><input type=\"date\" id=\"startdate\"><script>document.getElementById(\'startdate\').value = new Date().toISOString().substring(0, 10);</script><span> - </span><input type=\"date\" id=\"enddate\" style="margin: 5px;"><script>document.getElementById(\'enddate\').value = new Date().toISOString().substring(0, 10);</script>';
        $('#dataTable_filter').prepend(selectDate_str);
    }
}

//DB_VALUE를 로컬 스토리지에 저장하고 페이지 새로고침
function changeDB(obj) {
    var selectVal = $(obj).val();
    localStorage.setItem("DB_VALUE", selectVal);
    location.reload();
}