function setTable (query) {
    $.getJSON(query, function(data) {
        var columns = [];

        for (var key in data.data[0]) {
            columns.push({ "data": key, "title": key });
        }

    $('#dataTable').DataTable({
        columns: columns,
        data: data.data,
        //표시 건수
        lengthChange: true,
        //검색
        searching: true,
        //정렬
        ordering: true,
        //정보 표시
        info: true,
        //페이징
        paging: true,
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
});
}
