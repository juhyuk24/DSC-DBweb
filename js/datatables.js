function setTable(query) {
    if (localStorage.getItem("DB_VALUE"))
        fetch('/setDB/' + localStorage.getItem("DB_VALUE"));

    $.getJSON(query, function (data) {
        var columns = [];
        for (var val in data.data[0]) {
            columns.push({"data": val, "title": val});
        }
        if (document.URL.endsWith('/authority/authority-all')) columns.push({"data": "module_name", "title": "저장"});

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
            columnDefs: [
                {targets: '_all', width: '200px'}
            ],
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

function setTableBtns(table) {
    setFilter(table);

    if (document.URL.endsWith('/authority-all')) {
        //권한관리 페이지면 체크박스 넣기
        setCheckbox();
        setSaveAllBtn();
    } else {
        //권한관리 페이지는 DB선택버튼 필요없음
        setDBselectBtn();
    }
    setAdditionalBtn();
}

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
    var rows = $('#dataTable tbody tr');

    for (let i = 0; i < rows.length; i++) {
        var row = $(rows[i]);
        var lastCellText = row.find('td:last-child').text();
        var save_str = '<a id="' + lastCellText + '" class="btn btn-primary btn-refresh" href=""><span class="button-content">저장</span></a>';
        row.find('td:last-child').html(save_str);
    }
}

function setSaveAllBtn() {
    var save_str = '<a class="btn btn-primary btn-refresh" href="" style="margin: 5px;">변경사항 일괄 저장</span></a>';
    $('#dataTable_filter').prepend(save_str);
}

function setDBselectBtn() {
    var selectDB_str = '<span>DB선택: </span><select id="select-db" style="margin: 5px;" onchange="changeDB(this)">';
    selectDB_str += '<option value="all">전체 선택</option>'
    selectDB_str += '<option value="sidb">sidb</option>';
    selectDB_str += '<option value="tmdb">tmdb</option>';
    selectDB_str += '<option value="dmdb">dmdb</option>';
    selectDB_str += '<option value="msdb">msdb</option>';
    selectDB_str += '<option value="postgres">postgres</option>';
    selectDB_str += '</select>'
    $('#dataTable_filter').prepend(selectDB_str);

    const select = document.querySelector("#select-db");
    const dbValue = localStorage.getItem("DB_VALUE");

    if (dbValue) {
        select.value = dbValue;
    }
}

function setAdditionalBtn() {
    if (document.URL.endsWith('/tablespace') || document.URL.endsWith('/table') || document.URL.endsWith('/indexusage')) {
        var showChart_str = '<a class="btn btn-primary btn-refresh" href="chart-showtable.html" style="margin: 5px;">차트로 보기</a>';
        $('#dataTable_filter').prepend(showChart_str);
    }

    if (document.URL.endsWith('/serviceinfo')) {
        var selectDate_str = '<span>검색 기간: </span><input type=\"datetime-local\" id=\"startdate\"><script>document.getElementById(\'startdate\').value = new Date().toISOString().substring(0, 10);</script><span> - </span><input type=\"datetime-local\" id=\"enddate\" style="margin: 5px;"><script>document.getElementById(\'enddate\').value = new Date().toISOString().substring(0, 10);</script>';
        $('#dataTable_filter').prepend(selectDate_str);
    }

    if (document.URL.endsWith('/infoJob')) {
        var selectDate_str = '<span>검색 기간: </span><input type=\"date\" id=\"startdate\"><script>document.getElementById(\'startdate\').value = new Date().toISOString().substring(0, 10);</script><span> - </span><input type=\"date\" id=\"enddate\" style="margin: 5px;"><script>document.getElementById(\'enddate\').value = new Date().toISOString().substring(0, 10);</script>';
        $('#dataTable_filter').prepend(selectDate_str);
        var showChart_str = '<span>활성화 상태: </span><select style="margin: 5px;"><option>전체</option><option>t</option><option>f</option></select>';
        $('#dataTable_filter').prepend(showChart_str);
    }

    if (document.URL.endsWith('/logJob')) {
        var selectDate_str = '<span>검색 기간: </span><input type=\"date\" id=\"startdate\"><script>document.getElementById(\'startdate\').value = new Date().toISOString().substring(0, 10);</script><span> - </span><input type=\"date\" id=\"enddate\" style="margin: 5px;"><script>document.getElementById(\'enddate\').value = new Date().toISOString().substring(0, 10);</script>';
        $('#dataTable_filter').prepend(selectDate_str);
    }

    if (document.URL.endsWith('/runtime')) {
        var selectDate_str = '<span>검색 시간: </span><input type=\"time\" id=\"startdate\"><script>document.getElementById(\'startdate\').value = new Date().toISOString().substring(0, 10);</script><span> - </span><input type=\"time\" id=\"enddate\" style="margin: 5px;"><script>document.getElementById(\'enddate\').value = new Date().toISOString().substring(0, 10);</script>';
        $('#dataTable_filter').prepend(selectDate_str);
    }

    if (document.URL.endsWith('/sessioninfo')) {
        var showChart_str = '<span>세션 상태: </span><select style="margin: 5px;"><option>전체</option><option>active</option><option>idle</option></select>';
        $('#dataTable_filter').prepend(showChart_str);
    }
}

function changeDB(obj) {
    var selectVal = $(obj).val();
    localStorage.setItem("DB_VALUE", selectVal);
    location.reload();
}