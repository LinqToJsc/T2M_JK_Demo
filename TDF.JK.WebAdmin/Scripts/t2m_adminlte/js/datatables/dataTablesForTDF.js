var TdfDataTableParams = function () {
    var _getTabOpts = function (serverUrl, searchFormId, columns, opts, serverParamsFunction, rowCallbackFunction) {
        opts = opts || {};
        opts.searchPlaceholder = opts.searchPlaceholder || "关键词";
        opts.dom = opts.dom || "frt<'row'<'col-sm-6'il><'col-sm-6'p>>";
        //是否显示操作按钮 默认true
        opts.showButtons = (opts.showButtons == null || opts.showButtons == undefined) ? true : opts.showButtons,
        //默认有一个刷新按钮
            opts.buttons = opts.buttons || [];
        if (opts.showButtons === true) {
            opts.dom = "<'pull-right'Bf>rt<'row'<'col-sm-6'il><'col-sm-6'p>>";
            if (opts.buttons.length === 0)
                opts.buttons.push({
                    className: "btn btn-default btn-sm",
                    text: '<i class="glyphicon glyphicon-refresh icon-refresh">',
                    action: function (e, dt, node, config) {
                        dt.ajax.reload();
                    }
                });
        }

        return {
            language: {
                url: '/Scripts/t2m_adminlte/bower_components/datatables.net/localisation/Chinese_zh.json'
            },
            columnDefs: [
                { "orderable": false, "targets": ['_all'] } // 在开启排序功能的情况下 对所有列禁用排序；如需对单独某个列设置排序，请在 columns 中对列设置 orderable [bool]属性
            ],
            order: [],
            lengthMenu: opts.lengthMenu || [[10, 25, 50], [10, 25, 50]],
            lengthChange: (opts.lengthChange == null || opts.lengthChange == undefined) ? true : opts.lengthChange,
            iDisplayLength: opts.pageSize || 10,
            processing:
                true, //是否显示数据加载等待状态的弹出窗
            serverSide:
                true, // 是否开启服务器模式
            ordering: (opts.ordering == null || opts.ordering == undefined) ? true : opts.ordering, //是否开启所有列排序功能
            deferRender:
                true,
            searching: (opts.searching == null || opts.searching == undefined) ? true : opts.searching,
            info: (opts.info == null || opts.info == undefined) ? true : opts.info,
            columns: columns,
            dom: opts.dom,
            initComplete: function (settings, json) {
                var wrapper = $("#" + settings.sTableId + "_wrapper");
                //修过样式
                $("#" + settings.sTableId + "_info").css({ "float": "left", "padding-right": "10px" });
                $("#" + settings.sTableId + "_length").css({ "float": "left", "margin-top": "5px" });

                $("#" + settings.sTableId + "_filter").css({ "float": "right" });
                $(".dt-buttons", wrapper).css({ "float": "right" });
                $(".dt-button", wrapper).css({ "border-radius": "0" });
                if (opts.searchTextWidth)
                    $("[type='search']", wrapper).css({ "width": opts.searchTextWidth });
                $("[type='search']", wrapper).attr("placeholder", opts.searchPlaceholder);
            },
            buttons: opts.buttons,
            ajax:
            {
                url: serverUrl,
                type:
                    "get",
                data:
                    function (prams) {
                        var dataParams = {};
                        dataParams.PageIndex = (prams.start / prams.length);
                        dataParams.PageSize = prams.length;
                        dataParams.Keyword = prams.search.value;
                        dataParams.OrderSorts = [];
                        dataParams.draw = prams.draw;
                        // 这里只处理对单个列的排序功能，如需支持对多个列同时排序 则需遍历order数组 并重新构造服务器参数接收对象
                        if (prams.order.length > 0) {
                            $.each(prams.order, function (i, item) {
                                dataParams.OrderSorts.push({ OrderName: prams.columns[item.column].data, OrderType: item.dir });
                            });
                        }

                        // 注入更多自定义 查询条件 参数 从搜索条件From表单中读取
                        //var o1 = { a: 'a',c:"ad" }, o2 = { a:'hg', b: 'b' };
                        //var o3 = $.extend(o1, o2);  //合并两个对象 合并之后 o1==o3 且如果 合并的两个对象具有相同的属性 其合并结果为 后面的属性值覆盖前面的属性值
                        var formData = $('#' + searchFormId).serializeObject();
                        $.extend(dataParams, formData);

                        //通常用于对参数的额外加工 回调函数
                        if ((typeof serverParamsFunction == 'function')) {
                            // 通过回调函数 注入更多 ajax查询参数
                            var ps = serverParamsFunction(dataParams);
                            if (ps) {
                                return ps;
                            }
                        }

                        return dataParams;
                    },
                dataSrc: "data"
            },
            rowCallback: function (row, data, index) {
                if ((typeof rowCallbackFunction == 'function'))
                    rowCallbackFunction(row, data, index);
            }
        }
    }


    return {
        /**
         * domTabId [string 必须] 表格Table的 Dom ID
         * searchFormId [string 必须,但值可以为空] 筛选条件Dom容器 From表单ID
         * serverUrl [string 必须] ajax数据请求服务端URL
         * columns [ObjectArray 必须] 定义表格列
         * opts [Object 可选] 列表Table 初始化配置参数
         * serverParamsCallBack [function 可选] 通常用于对筛选参数的额外加工 回调函数
         * rowCallBack [function 可选] 表格行绘制 回调函数
         */
        CreateDataTable: function (domTabId, searchFormId, serverUrl, columns, opts, serverParamsCallBack, rowCallBack) {
            return $('#' + domTabId).DataTable(_getTabOpts(serverUrl, searchFormId, columns, opts, serverParamsCallBack, rowCallBack));
        }
    };
}();