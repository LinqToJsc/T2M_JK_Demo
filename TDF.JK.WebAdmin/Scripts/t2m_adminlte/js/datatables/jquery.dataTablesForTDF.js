 var dataTables = {};
//初始化配置

 dataTables = {
     tableId: "",//table的id
     buttonId: "buttonId",
    
};
//dataTables方法封装
 function dataTablesInit(elo) {
     if (elo.search == null) { elo.search = true };
     if (elo.searching == null) { elo.searching = true };
     if (elo.processing == null) { elo.processing = true };
     if (elo.serverSide == null) { elo.serverSide = true };
     if (elo.lengthChange == null) { elo.lengthChange = true };
     if (elo.paging == null) { elo.paging = true };
     if (elo.scrollCollapse == null) { elo.scrollCollapse = true };
     if (elo.jQueryUI == null) { elo.jQueryUI = false };
     if (elo.autoWidth == null) { elo.autoWidth = true };
     if (elo.info == null) { elo.info = true };
     if (elo.ordering == null) { elo.ordering = true };
     var dataTablesModel = $('#' + elo.tableId).DataTable({
        "processing": elo.processing,//是否显示等待状态
        "serverSide": elo.serverSide,//服务器模式
        ajax: elo.ajaxUrl ||
            {
                url: elo.requestUrl,//请求后台路径
                type: elo.ajaxtype || 'POST',
                data: elo.ajaxData || function (d) {
                    if (d.start != 0) { d.PageIndex = d.start / d.length } else { d.PageIndex = 0 };
                    if (d.length <= 0) { d.PageSize =""} else { d.PageSize = d.length; }                  
                    d.searchText = $("#" + elo.tableId + "-searchText").val();
                },
                error: function(jqXHR, textStatus, errorMsg){
                    alert("请求失败");
                },
                "dataSrc": elo.dataSrc||"data"
            },
        "searching": elo.searching ,//搜索框，默认是开启
        "lengthChange": elo.lengthChange ,//是否允许用户改变表格每页显示的记录数，默认是开启
        "paging": elo.paging ,//是否开启本地分页，默认是开启
        "scrollCollapse": elo.scrollCollapse ,  //是否开启DataTables的高度自适应，当数据条数不够分页数据条数的时候，插件高度是否随数据条数而改变
        "scrollY": elo.scrollY || "auto",//设置高
        "scrollX": elo.scrollX || "100%" ,//设置宽度
        "scrollXInner": elo.scrollXInner || "100%",//设置内宽度
        "jQueryUI": elo.jQueryUI,//jquery 风格
        "autoWidth" : elo.autoWidth, //是否自适应宽度
        "columns": elo.columns || "",//字段
        "ordering":elo.ordering,//s是否打开排序
        "columnDefs": elo.columnDefs || [
                                                 { "searchable": false, "orderable": false, "targets": 0 },//第一行不进行排序和搜索
                                                 { defaultContent: '', targets: ['_all'] } //所有列设置默认值为空字符串
                                                 ],//列表状态
        "order": elo.order || "",//[[2, "asc"]],//指定列表某个列排序状态
        "iDisplayLength": elo.iDisplayLength|| 10,//初始化显示多少行
        "lengthMenu": elo.lengthMenu || [[5, 10, 20, -1], [5, 10, 20, "All"]],
        "info": elo.info,//是否显示提示信息
        "language": {
            "sProcessing": "处理中...",
            "sLengthMenu": "显示 _MENU_ 项结果",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "显示 _START_ 至 _END_ 行 每页显示_MENU_，共 _TOTAL_ 项",
            "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": "搜索:",
            "sUrl": "",
            "sEmptyTable": "未搜索到数据",
            "sLoadingRecords": "载入中...",
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "上页",
                "sNext": "下页",
                "sLast": "末页"
            },
            "oAria": {
                "sSortAscending": ": 以升序排列此列",
                "sSortDescending": ": 以降序排列此列"
            }
        },
        "dom": "<'row'<'col-sm-2'><'#" + elo.buttonId + ".col-sm-10'><'col-sm-6'f>r>t<'row'<'col-sm-6'il><'col-sm-6'p>>",
        "initComplete": function () {
            //修过样式
            $("#" + elo.tableId + "_info").css({ "float": "left", "margin-top": "4px", "padding-right": "8px" });
            $("#" + elo.tableId + "_length").css({ "float": "left", "margin-top": "8px" });
            //添加按钮组
            $("#" + elo.buttonId).append(elo.buttons);
            if(elo.search){
                $search = $("input[type='search']");
                //隐藏默认的搜索框
                $search.parent().hide();
            }
            //加载完成之后 初始化checkbox
            checkbox(elo.tableId);
            $("#reload").click(function(){
                dataTablesReload(dataTablesModel);
            });
            $("#batchIds").click(function () {
                batchIds();
            });
            $("#selection").click(function () {
                selection();
            });
          
            $("#clearSearch").click(function () {
                clearSearch("form-controlSearch");
            });
            //checkbox全选
            $("#"+elo.checkAllId).click(function () {
                if ($(this).prop("checked")) {
                    $("input[name='checkList']").prop("checked",true);
                    $("tr").addClass('selected');
                } else {
                    $("input[name='checkList']").prop("checked",false);
                    $("tr").removeClass('selected');
                }
            });
        }
    });
    //错误信息提示
    $.fn.dataTable.ext.errMode = function(s,h,m){
        if(h==1){
            alert("连接服务器失败！");
        }else if(h==7){
            alert("返回数据错误！");
        }
    };
    //回调，如果返回的时候有问题提示信息
    dataTablesModel.on('xhr.dt', function ( e, settings, json, xhr ) {
        console.log("重新加载了数据");
        if(typeof(json.code)!="undefined"	&&	json.code!="0"){
            alert(json.message);
        }
    } );
    //鼠标经过高亮
    var lastIdx = null;
    dataTablesModel.on( 'mouseover', 'td', function () {
        if(typeof(dataTablesModel.cell(this).index())!="undefined"){
            var colIdx = dataTablesModel.cell(this).index().column;
            if ( colIdx !== lastIdx ) {
                $( dataTablesModel.cells().nodes() ).removeClass( 'highlight' );
                $( dataTablesModel.column( colIdx ).nodes() ).addClass( 'highlight' );
            }
        }
    } );
    dataTablesModel.on( 'mouseleave', function () {
        $(dataTablesModel.cells().nodes()).removeClass( 'highlight' );
    } );
    //自动搜索方法
    $('.form-controlSearch').on('keyup change', function () {
        elo.autoSearch = $("#autoSearch").prop("checked");
        if(elo.autoSearch){
            filterColumn( $(this).attr('data-column') );
        }
    });
  return  dataTablesModel;
}
//选中一行 checkbox选中
function checkbox(tableId){
    //每次加载时都先清理
    $('#'+tableId+' tbody').off("click","tr");
    $('#'+tableId+' tbody').on("click", "tr", function () {
        $(this).toggleClass('selected');
        if($(this).hasClass("selected")){
            $(this).find("input").prop("checked",true);
        }else{
            $(this).find("input").prop("checked",false);
        }
    });
}
//按钮搜索方法
function dataTablesSearch(id,dataTablesModel) {
    $("#"+id+"-search").click(function () {
        dataTablesModel.draw();
    });
    //搜索的数据一次条件，节省资源
  
}
//搜索
function filterColumn(i, dataTablesModel) {
    dataTablesModel.column(i).search(
           // $('#search').val()
    ).draw();
}
//清理搜索数据
function clearSearch(id, dataTablesModel) {
    $("."+id).each(function(){
        $(this).val("");
    });
    //清空查询条件重新读取数据
    dataTablesModel.columns().search("").draw();
}
//获取所有选中行的UUID
function batchIds(dataTablesModel) {
    var uuid = '';
    var uuids =dataTablesModel.rows(".selected").data();
    if(uuids.length==0){
        alert(dataTablesModel.table.statusTitle);
    }else{
        for(var i=0;i<uuids.length;i++){
            uuid = uuid+uuids[i].extn+",";
        }
        alert(uuid);
    }
}
//单选
function selection(dataTablesModel) {
    if (dataTablesModel.rows(".selected").data().length==1) {
        var uuid =dataTablesModel.row(".selected").data().extn;
        if(uuid==""){
            alert(dataTablesModel.table.statusTitle);
        }else{
            alert(uuid);
        }
    }else{
        alert(dataTablesModel.table.statusTitle);
    }
}
//刷新页面
//重新加载数据
function dataTablesReload(dataTablesModel) {
    dataTablesModel.ajax.reload();
}
//销毁table
function destroyDataTable(tableId){
    var dttable =  $('#'+tableId).DataTable();
    dttable.destroy();
}



//$(document).ready(function(){
//    dataTablesInit(dataTables);
//});
