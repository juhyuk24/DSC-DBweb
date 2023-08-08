// Call the dataTables jQuery plugin
$(document).ready(function () {
    $('#dataTable').DataTable({
        //표시 건수
        lengthChange: true,
        //검색
        searching: {
            return: true
        },
        //정렬
        ordering: true,
        //정보 표시
        info: true,
        //페이징
        paging: true,
        scrollX: true,
        lengthMenu: [[-1, 5, 10, 25, 50, 100], ["전체", "5개", "10개", "25개", "50개", "100개"]],
        columnDefs: [
            //{targets: '_all', width: 'fit-content'}
        ],
        language : {
            emptyTable: "데이터가 없습니다.",
            lengthMenu: "페이지에_MENU_건의 데이터 표시",
            search: "검색:",
            info: "현재 _START_ - _END_ / 총 _TOTAL_건",
            infoEmpty: "데이터 없음",
            infoFiltered: "( _MAX_건의 데이터에서 필터링됨 )",
            loadingRecords: "로딩중...",
            processing:     "잠시만 기다려 주세요...",
            paginate: {
                "next": "다음",
                "previous": "이전"
            },
            select: {
                rows: ""
            }
        }
    });
    var filter_str = '<span style="white-space: nowrap;">필터: <select style="margin-right: 5px;"><option value="all">전체 검색</option></span>';

    $('#dataTable thead th').each(function () {
        var title = $(this).text();
        filter_str +='<option value="' + title + '">' + title + '</option>';
    });

    filter_str += '</select>';
    $('#dataTable_filter').prepend(filter_str);

    $('#dataTable_filter').on('change', function () {
        var selectedColumn = $(this).val();
        table.columns().search('').draw();
        if (selectedColumn) {
            table.columns().header().to$().filter(':contains(' + selectedColumn + ')').each(function () {
                var columnIndex = $(this).index();
                table.columns(columnIndex).search(selectedColumn).draw();
            });
        }
    });

    if(document.URL.endsWith('/authority.html') || document.URL.endsWith('/authority-group1.html') || document.URL.endsWith('/authority-group2.html') || document.URL.endsWith('/authority-group3.html') || document.URL.endsWith('/authority-group4.html') || document.URL.endsWith('/authority-group5.html')
        || document.URL.endsWith('/authority-group6.html') || document.URL.endsWith('/authority-group7.html') || document.URL.endsWith('/authority-group8.html') || document.URL.endsWith('/authority-group9.html') || document.URL.endsWith('/authority-group10.html') || document.URL.endsWith('/authority-group11.html')) {
        var save_str = '<a class="btn btn-primary btn-refresh" href="" style="margin-right: 5px;">변경사항 일괄 저장하기</span></a>';
        $('#dataTable_filter').prepend(save_str);
    }
    else {
        var selectDB_str = '<span>DB선택: </span><select style="margin-right: 5px;"><option value="all">전체 선택</option></span>';
        selectDB_str += '<option value="sidb">sidb</option>';
        selectDB_str += '<option value="tmdb">tmdb</option>';
        selectDB_str += '<option value="dmdb">dmdb</option>';
        selectDB_str += '<option value="msdb">msdb</option>';

        selectDB_str += '</select>'
        $('#dataTable_filter').prepend(selectDB_str);
    }

    if(document.URL.endsWith('/tablespace.html') || document.URL.endsWith('/table.html') || document.URL.endsWith('/indexusage.html')) {
        var showChart_str = '<a class="btn btn-primary btn-refresh" href="chart-showtable.html" style="margin-right: 5px;">차트로 보기</a>';
        $('#dataTable_filter').prepend(showChart_str);
    }

    if(document.URL.endsWith('/serviceinfo.html')) {
        var selectDate_str = '<span>검색 기간: </span><input type=\"datetime-local\" id=\"startdate\"><script>document.getElementById(\'startdate\').value = new Date().toISOString().substring(0, 10);</script><span> - </span><input type=\"datetime-local\" id=\"enddate\" style="margin-right: 5px;"><script>document.getElementById(\'enddate\').value = new Date().toISOString().substring(0, 10);</script>';
        $('#dataTable_filter').prepend(selectDate_str);
    }

    if(document.URL.endsWith('/jobinfo.html')) {
        var selectDate_str = '<span>검색 기간: </span><input type=\"date\" id=\"startdate\"><script>document.getElementById(\'startdate\').value = new Date().toISOString().substring(0, 10);</script><span> - </span><input type=\"date\" id=\"enddate\" style="margin-right: 5px;"><script>document.getElementById(\'enddate\').value = new Date().toISOString().substring(0, 10);</script>';
        $('#dataTable_filter').prepend(selectDate_str);
        var showChart_str = '<span>활성화 상태: </span><select style="margin-right: 5px;"><option>전체</option><option>t</option><option>f</option></select>';
        $('#dataTable_filter').prepend(showChart_str);
    }

    if(document.URL.endsWith('/joblog.html')) {
        var selectDate_str = '<span>검색 기간: </span><input type=\"date\" id=\"startdate\"><script>document.getElementById(\'startdate\').value = new Date().toISOString().substring(0, 10);</script><span> - </span><input type=\"date\" id=\"enddate\" style="margin-right: 5px;"><script>document.getElementById(\'enddate\').value = new Date().toISOString().substring(0, 10);</script>';
        $('#dataTable_filter').prepend(selectDate_str);
    }

    if(document.URL.endsWith('/runsql.html')) {
        var selectDate_str = '<span>검색 시간: </span><input type=\"time\" id=\"startdate\"><script>document.getElementById(\'startdate\').value = new Date().toISOString().substring(0, 10);</script><span> - </span><input type=\"time\" id=\"enddate\" style="margin-right: 5px;"><script>document.getElementById(\'enddate\').value = new Date().toISOString().substring(0, 10);</script>';
        $('#dataTable_filter').prepend(selectDate_str);
    }

    if(document.URL.endsWith('/sessioninfo.html')) {
        var showChart_str = '<span>세션 상태: </span><select style="margin-right: 5px;"><option>전체</option><option>active</option><option>idle</option></select>';
        $('#dataTable_filter').prepend(showChart_str);
    }
});
