function setTable (query) {
    $.getJSON(query, function(data) {
        var columns = [];

        for (var key in data.data[0]) {
            columns.push({ "data": key, "title": key });
        }

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
        //정보 표시
        info: true,
        //페이징
        paging: true,
        scroller: true,
        columnDefs: [
            {targets: '_all', width: 'fit-content'}
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
        if(document.url == '/authority/authority-all') {
            $('#dataTable tbody td').each(function () {
                var auth = $(this).text();
                var auth_str ='<option value="' + auth + '">' + auth + '</option>';
            });
        }

        var selectDB_str = '<a>DB선택: </a><select style="margin-right: 5px;"><option value="all">전체 선택</option>';
        $.getJSON('/query/dbList', function (data) {
            for(let i=0;i<data.data.length;i++) {
                selectDB_str += '<option value="' + data.data[i].datname + '">' + data.data[i].datname + '</option>';
            }
            selectDB_str += '</select>'
            $('#dataTable_filter').prepend(selectDB_str);
        });

        var filter_str = '<a>필터: </a><select style="margin-right: 5px;"><option value="all">전체 검색</option>';

        $('#dataTable thead th').each(function () {
            var title = $(this).text();
            filter_str +='<option value="' + title + '">' + title + '</option>';
        });

        filter_str += '</select style="margin-right: 2px">';
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
});
}
