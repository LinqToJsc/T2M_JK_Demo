
    var columns=["project_id","project_Name","jurisdictionArea","estateType","project_Acreage","get_Land_Date","opening_Date","deliver_Date",
             "display_Date","projectManager","handling_fee_return","display_area_return"];
function closeT2m(){
    $("#t2m_filter").hide();
    $("#btn_filter").removeClass('open');
}
function confimT2m(){
    reloadData();
    $("#t2m_filter").hide();
    $("#btn_filter").removeClass('open');
}
function showAddProjectInfo(){
    var src="${contextPath}/ppm/projectInfo/toAddProjectInfo";
    var width=940;//$(document.body).width()+30;
    var height=$(top.window).height()-40;
    top.showTopDialogs('添加项目',src,50,width,height,[{
        caption:"保存",
        className:"btn",
        icon:"fa fa-check-square",
        click:function(){
            this.saveData(this.win);
        }
    },
    {
        caption:"&times;",
        className:"btn",
        click:function(){
            this.closeDlg();
        }
    }]);
}
    
    
    
//重新加载列表数据
function reloadData(){
    $("#dataTable").DataTable().ajax.reload();
}
var  planProjectId;
function checkPlanData(projectId,src,width,height){
    var src="${contextPath}/ppm/projectInfo/firstApprovalProjectInfo?projectId="+planProjectId;
    var width=$(document.body).width();
    var height=$(top.window).height()-60;
    $.ajax({
        url:"${contextPath}/ppm/projectTaskInfo/ajax/listProjectTaskCategoryList",
        data:{projectId:planProjectId},
        type:"post",
        cache:false,
        success:function(res){
            var taskState0=new Array();//未修改
            var taskState1=new Array();//修改
            var taskState2=new Array();//打回
            var taskState3=new Array();//审批通过
            for(var key in res.data){
                if(res.data[key].taskState==0){
                    taskState0[key]=res.data[key];
                }
                if(res.data[key].taskState==1){
                    taskState1[key]=res.data[key];
                }
                if(res.data[key].taskState==2){
                    taskState2[key]=res.data[key];
                }
                if(res.data[key].taskState==3){
                    taskState3[key]=res.data[key];
                }   
            }
            if(taskState2.length==0&&taskState1.length==0&&taskState0.length==0){
                showDialogs('审核计划',src,1,width,height,[{
                    caption:"提交审核",
                    className:"btn btn-primary",
                    icon:"fa fa-check-square",
                    click:function(){
                        this.saveData();
                    }
                },
                  {
                      caption:"取消",
                      className:"btn btn-info",
                      icon:"fa fa-minus-square",
                      click:function(){
                          this.closeDlg();
                      }
                  }]);
            }else if(taskState2.length>0){
                showDialogs('审核计划',src,1,width,height,[
                  {
                      caption:"打回",
                      className:"btn btn-danger",
                      icon:"fa fa-times",
                      click:function(){
                          this.iframe.contentWindow.repulseData();
                      }
                  },
                  {
                      caption:"取消",
                      className:"btn btn-info",
                      icon:"fa fa-minus-square",
                      click:function(){
                          this.closeDlg();
                      }
                  }]);
            }else{
                showDialogs('审核计划',src,1,width,height,[
                    {
                        caption:"取消",
                        className:"btn btn-info",
                        icon:"fa fa-minus-square",
                        click:function(){
                            this.closeDlg();
                        }
                    }]); 
            }
        }
    });
}
  	
function resetFormQuery(){
    $("#formQuery")[0].reset();
    $("#formQuery input:hidden").val("");
    reloadData();
}
	  	
//加载地区下级列表
//obj为当前选择变更的下载拉，变更后，加载该下拉框对应的子列表
function loadSubAreaList(obj){
    var pid=-1;
    if (obj) {
        pid=obj.options[obj.selectedIndex].value;
    }
    if (pid==""){
        return;
    }
    $(obj).nextAll().remove();
    $.ajax({
        url:"${contextPath}/sys/areaInfo/ajax/listAreaInfo",
        data:{parentId:pid},
        success:function(res){
            if (res.length==0){
                return;
            }
            var $box=$("#areaBox");
            var $sel=$("<select class='select'><option value=''>请选择</option></select>");
            var str=[];
            for (var i=0;i<res.length;i++){
                str.push("<option value='"+res[i].areaId+"'>"+res[i].areaName+"</option>");
            }
            $sel.append(str.join(""));
            if (!obj) {
                $box.append($sel);
            } else {
                $(obj).after($sel);
            }
            $sel.change(function(){
                loadSubAreaList(this);
                if ($box.find("select").length==2){
                    $("#areaId").val(this.value);
                    reloadData();
                }
            });
        }
    });
}
        
  	
$(document).ready(function () {
    var param = {};
    		
    document.onkeypress = function(){
        if(event.keyCode == 13) {
            reloadData();
        }
    }
    	
    $('.toggle-vis').on( 'click', function () {
        var table = $('#dataTable').DataTable();
        table.column(5).visible(true);
    } ); 
        
    // 筛选弹出框
    $('#btn_filter').click(function() {
        var isVisible=$("#formQuery").is(":visible");
        if (!isVisible){
            $(this).find(".fa").removeClass("fa-caret-right").addClass("fa-caret-down");
            showTip(this,null,function(){
                $('#'+this.dlg.attr("id")).css('overflow-y','hidden');
            },{height:'auto',tagId:"formQuery"});
            //滚动条   因为showtip的 function() 生命周期问题 实际执行时间会在 弹出层显示后 所以无法取得宽度 
            //这里我在 id为formQuery 下 加了一个div层
            if($('#formQuery').attr('data-scroll')=="true"){
                CMY_t2m_filter_MyScrollBar.setSize();
            }else{
                $('#formQuery').attr('data-scroll','true');
                $('#formQuery').css('height','500px');
                $('#formQuery').css('overflow-y','hidden');
                CMY_t2m_filter_MyScrollBar =  new MyScrollBar({
                    selId: "formQuery",
                    hasX: false,
                    hasY: true,
                    width: 6
                });                   
            }
        }else {
            $(".t2m-filter-box").hide();
            $(this).find(".fa").removeClass("fa-caret-down").addClass("fa-caret-right");
        }
    });
    $("#formQuery").find("select,:text").on("change",function(){
        reloadData();
    });
         
    $("#btnSelectArea").click(function(){
        var src="${contextPath}/sys/areaInfo/listTreeAreaInfo";
        //showModalDialog(src,'选择地区','10','500','255');
        top.showTopDialogs('选择地区',src,50,500,500,[{
            caption:"确定",
            className:"btn",
            icon:"fa fa-check-square",
            click:function(){
                var area = this.getReturnData();
                $("input[name='location']").val(area.text);
                $("input[name='areaId']").val(area.id);
                reloadData();
                this.closeDlg();
            }
        },
        {
            caption:"&times;",
            className:"btn",
            click:function(){
                this.closeDlg();
            }
        }],window);
    });
    	
    var tableHeight = $(top).height()-parseInt($(".content-header").outerHeight())-170;
    //alert($(window).height()+"::"+parseInt($(".content-header").outerHeight())+"::"+tableHeight);
    var tables = $("#dataTable").dataTable({
        "scrollX": true,
        "scrollY": tableHeight+"px",
        serverSide: true,//分页，取数据等等的都放到服务端去
        //processing: true,//载入数据的时候是否显示“载入中”
        lengthMenu:[5,10,20,30,40,50],
        pageLength: 10,  //首次加载的数据条数
        lengthChange:true,
        ordering: true, //排序操作在服务端进行，所以可以关了。
        pagingType: "simple_numbers",
        autoWidth: false,
        stateSave: false,//保持翻页状态，和comTable.fnDraw(false);结合使用
        searching: false,//禁用datatables搜索,
        sort: true,
        sorting: [0, "desc"],
        ajax: {
            url:"${contextPath}/ppm/projectInfo/ajax/listProjectInfoWithTimeInterval",
            dataSrc: "data",
            cache:false,
            data: function (d) {
                var orderName=columns[d.order[0].column];
                var orderDir = d.order[0].dir;
                //var param = {};
                param.draw = d.draw;
                param.start = d.start;
                param.length =d.length;
                var $form=$("#formQuery");
                if ($form.is(":visible")){
                    var formData = $form.serializeArray();//把form里面的数据序列化成数组
                    formData.forEach(function (e) {
                        param[e.name] = e.value;
                    });
                } else {
                    var projectName=$("#projectName").val();
                    param["projectName"]=projectName;
                }
                param["opType"]="${param.opType}";
                param["orderName"]=orderName;
                param["orderDir"]=orderDir;
                console.log(param);
                return param;//自定义需要传递的参数。
            },
            error:function(){
                if (arguments[0].status==500){
                    top.bootbox.alert("系统忙，请稍候再试！");
                }
                else if(arguments[1]=="parsererror"){
                    top.bootbox.alert({buttons: {ok:{label: '确定',className:'btn-primary'}},message: '登录已失效，请重新登录！',
                        callback : function() {
                            top.location.reload();
                        }
                    }); 
                }
            }
        },
        columns: [//对应上面thead里面的序列
            {"data": null},
            {"data": null},
            {"data": 'jurisdictionArea'},
            {"data": 'estateType'},
            {"data": null},
            {"data": null},
            {"data": null},
            {"data": null},
            {"data": null},
            {"data": null},
            {"data": null},
            {"data": null},
            {"data":"projectStateName"}
            /* {"data": null,"width":"300px"} */
        ],
        //操作按钮
        columnDefs: [
            //不需要排序的列
            { sortable: false, 
                targets: [1,2,3,9]
            },
            //隐藏的列
            /*{ targets: [ 5,6,7,8 ], 
            visible: false 
            },  */
					
            {
                targets: 0,
                "render": function ( data, type, full, meta ) {
                    //return meta.row+1;
                    var api = tables.api();
                    var startIndex= api.context[0]._iDisplayStart;
                    return startIndex+meta.row+1;
                }
            },
            {
                targets: 1, 
                "render": function ( data, type, full, meta ) {
                    return "<div class='projectName'>"+data.projectName+"</div>";
                }
            }, 
            {
                targets: 4, 
                "render": function ( data, type, full, meta ) {
                    return "<div class='projectAcreage'>"+data.projectAcreage+"</div>";
                }
            }, 
            {
                targets: 5, 
                "render": function ( data, type, full, meta ) {
                    if(data.getLandDate!=null){
                        return  data.getLandDate.substring(0,10);
                    }else{
                        return null;
                    }
                }
            }, 
            {
                targets: 6, 
                "render": function ( data, type, full, meta ) {  
                    if(data.displayDate!=null){
                        return  data.displayDate.substring(0,10);
                    }else{
                        return null;
                    }
                }
            },
            {
                targets: 7,  
                "render": function ( data, type, full, meta ) {
                    if(data.openingDate!=null){
                        return  data.openingDate.substring(0,10);
                    }else{
                        return null;
                    }
                }
            },
            {
                targets: 8, 
                "render": function ( data, type, full, meta ) {  
                    if(data.deliverDate!=null){
                        return  data.deliverDate.substring(0,10);
                    }else{
                        return null;
                    }
                }
            },
            {
                targets: 9, 
                "render": function ( data, type, full, meta ) {
                    return "<div class='projectManager'>"+full.projectManagerName+"</div>";
                }
            }, 
            {
                targets: 10, 
                "render": function ( data, type, full, meta ) {  
                    if(data.handlingFeeContract==1){
                        if(data.handlingFeeReturn==data.handlingFeeTotal&&data.handlingFeeReturn==0&&data.handlingFeeTotal==0){
                            return 0;
                        }else if(data.handlingFeeReturn==data.handlingFeeTotal){
                            return "<div style='color:green'>"+data.handlingFeeReturn+"/"+data.handlingFeeTotal+"</div>";
                        }else{
                            return  data.handlingFeeReturn+"/"+data.handlingFeeTotal;
                        }
                    }else{
                        return "<div style='color:red'>未签订</div>";
                    }
                }
            },
            {
                targets: 11, 
                "render": function ( data, type, full, meta ) {  
                    if(data.displayAreaContract==1){
                        if(data.displayAreaReturn==data.displayAreaTotal&&data.displayAreaReturn==0&&data.displayAreaTotal==0){
                            return 0;
                        }else if(data.displayAreaReturn==data.displayAreaTotal){
                            return "<div style='color:green'>"+data.displayAreaReturn+"/"+data.displayAreaTotal+"</div>";
                        }else{
                            return  data.displayAreaReturn+"/"+data.displayAreaTotal;
                        }
                    }else{
                        return "<div style='color:red'>未签订</div>";
                    }
                }
            },
        ],
        language: {
            lengthMenu: "每页显示_MENU_条",
            processing: "正在加载数据...",
            paginate: {
                previous: "上页",
                next: "后页"
            },
            zeroRecords: "没有数据",
            info: "当前 _START_ 至 _END_ 行 &nbsp;&nbsp;共 _PAGES_ 页",
            infoEmpty: "",
            infoFiltered: "",
            sSearch: "输入关键字：",
        },
        //在每次table被draw完后回调函数
        fnDrawCallback: function(row, data, dataIndex ){
	            	            
            $("#dataTable_length").css({"display":"inline"});
            $("#dataTable").find('td').attr('style', 'text-align: center;');
            $(".projectName").attr('style', 'text-align: left;');             
            /* $(".projectAcreage").attr('style', 'text-align: left;');
            $(".projectManager").attr('style', 'text-align: left;'); */
            var table = $('#dataTable').DataTable();
            table.column(5).visible(false);
            table.column(6).visible(false);
            table.column(7).visible(false);
            table.column(8).visible(false);
            if(!(param.getLandDateStart==null||param.getLandDateStart==undefined||param.getLandDateStart=='')){
                table.column(5).visible(true);
                $("#dataTable").find('td').attr('style', 'text-align: center;');
            }
            if(!(param.displayDateStart==null||param.displayDateStart==undefined||param.displayDateStart=='')){
                table.column(6).visible(true);
                $("#dataTable").find('td').attr('style', 'text-align: center;');
            }
            if(!(param.openingDateStart==null||param.openingDateStart==undefined||param.openingDateStart=='')){
                table.column(7).visible(true);
                $("#dataTable").find('td').attr('style', 'text-align: center;');
            }
            if(!(param.deliverDateStart==null||param.deliverDateStart==undefined||param.deliverDateStart=='')){
                table.column(8).visible(true);
                $("#dataTable").find('td').attr('style', 'text-align: center;');
            }
	               	
            $("#dataTable_info").append("&nbsp;&nbsp;&nbsp");
            $("#dataTable_info").after($("#dataTable_length"));
            /*
            var api = this.api();
            //获取到本页开始的条数
            var startIndex= api.context[0]._iDisplayStart;
            api.column(1).nodes().each(function(cell, i) {
                    cell.innerHTML = startIndex + i + 1;
             });
            */
            hideLoading();
            //by CMY 滚动条
            if($('.dataTables_scrollBody').attr('id')=='CMY_dataTables_scrollBody_scroll'){
                CMY_dataTables_scroll.setSize();
            }else{
                $('.dataTables_scrollBody').attr('id','CMY_dataTables_scrollBody_scroll'); 
                $('.dataTables_scrollBody').css('overflow',' hidden');      
                CMY_dataTables_scroll = new MyScrollBar({
                    selId: 'CMY_dataTables_scrollBody_scroll',
                    hasX: true,
                    hasY: true,
                    width: 6
                });
            }
        }
    });
	        
    //任意点击 列表进入项目详情
    $("#dataTable tbody").on( 'click', 'tr', function () {
        var data=tables.api().row( this ).data();
        window.location.href="${contextPath}/ppm/projectInfo/showProjectInfo?projectId="+data.projectId; 
    } );
        
    $(".datepicker").datepicker({
        format: "yyyy-mm-dd",
        minView: "month", //选择日期后，不会再跳转去选择时分秒 
        autoclose: true,
        language : 'zh-CN',
        todayHighlight : true,
        clearBtn: true 
    });
        
        
    $("#btnSearch").click(function(){
        reloadData();
        $('#modal-filter').modal("hide");
    });
		  	
    //加载数据字典
    loadDicts(null,function(){
        $("#formQuery").find("input,select").on("change",function(){
            reloadData();
        });
		    	
    }); 
    //加载区域公司列表
    $.ajax({
        url:"${contextPath}/company/deptInfo/ajax/listDeptInfo",
        data:{deptType:1,parentId:"-1"},
        success:function(res){
            //jurisdictionArea
            var str=["<option value=''>请选择</option>"];
            for (var i=0;i<res.length;i++){
                str.push("<option value='"+res[i].deptId+"'>"+res[i].deptName+"</option>");
            }
            $("#jurisdictionArea").append(str.join("\n"));
        }
    });
	  	
    //当键盘键被松开时发送Ajax获取数据
    $('#projectManagerName').keyup(function(){
        var keywords = $(this).val();
        if (keywords==''){ 
            $('#word').hide(); 
            return
        };
        $.ajax({
            url:'${contextPath}/company/staffInfo/ajax/loadStaffInfoListByName',
            data:{cname:keywords},
            dataType: 'json',
            beforeSend:function(){
                $('#word').append('<div>正在加载......</div>');
            },
            success:function(res){
                $('#word').empty().show();
                if (res.data=='')
                {
                    $('#word').append('<div class="error">没有查询到 "' + keywords + '"</div>');
                }else{
                    $.each(res.data, function(index, content){
                        $('#word').append('<div class="click_work" value="'+content.staffId+'">'+content.cname +'</div>');
                    });
                }
            },
            error:function(){
                $('#word').empty().show();
                $('#word').append('<div class="error click_work">查询 "' + keywords + '" 出错</div>');
            }
        });
    });
		  	
    //点击搜索数据复制给搜索框
    $(document).on('click','.click_work',function(){
        var cname=$(this).text();
        var staffId=$(this).attr("value");
        $('#projectManagerName').val(cname);
        $('#projectManager').val(staffId);
        $('#word').hide();
        reloadData();
    });
    //加载第一个地区列表
    loadSubAreaList();
    <c:if test="${param.addNew==1}">
        showAddProjectInfo();
    </c:if>
});