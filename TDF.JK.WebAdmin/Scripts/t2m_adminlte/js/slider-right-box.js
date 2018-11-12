/// <reference path="../../jquery-1.10.2.js" />

$.fn.extend({
    /**
     * 侧滑框对象函数
     * @param {} title 
     * @param {} opts [必需 参数对象 {
     * opts:{ paramData: { [可选] 数据加载初始参数 }, 
     *        initFunc: function(sliderRightBox){ [可选]侧滑框显示之前初始化函数，sliderRightBox 当前侧滑框JQ对象},
     *        loadSliderRightBoxData: function(paramData, sliderRightBox){ [核心函数]：数据加载 html 渲染回调函数 },
     *        closeCallBack: function(sliderRightBox){ [可选] 侧滑框关闭后调用}} ]
     * @returns {} 侧滑框对象
     */
    t2mSliderRightBox: function (title, opts) {
        opts = opts || {};
        opts.paramData = opts.paramData || {};
        opts.loadSliderRightBoxData = opts.loadSliderRightBoxData || function () { alert("使用错误： opts.loadSliderRightBoxData(paramData, sliderRightBox) 函数是必需的") };

        var $sliderRightBox = $(this);
        if (typeof opts.initFunc == 'function') {
            opts.initFunc($sliderRightBox);
        }
        /**
         * 显示侧滑框 & 初始化部分数据
         * @param {} paramData [参数对象 可选]
         * @param {} loadSliderRightBoxData[可选 function(paramObj, sliderRightBox) paramObj 参数据对象 sliderRightBox 当前侧滑框JQ对象]
         * @returns {} 
         */
        var show = function (paramData, loadSliderRightBoxData) {
            paramData = paramData || opts.paramData;
            loadSliderRightBoxData = loadSliderRightBoxData || opts.loadSliderRightBoxData;

            var displayState = $sliderRightBox.css("display");
            if (displayState == "none") {
                $sliderRightBox.show().animate({ right: 0 }, 500, function () {
                    if (typeof loadSliderRightBoxData == 'function') {
                        loadSliderRightBoxData(paramData, $(this));
                    }
                });
            } else {
                if (typeof loadSliderRightBoxData == 'function') {
                    loadSliderRightBoxData(paramData, $sliderRightBox);
                }
            }
        }
        /**
         * 关闭侧滑框 
         * @param {} closeCallBack [可选 function() 关闭后回调函数] 
         * @returns {} 
         */
        var close = function (closeCallBack) {
            closeCallBack = closeCallBack || opts.closeCallBack;

            var displayState = $sliderRightBox.css("display");
            if (displayState != "none") {
                $sliderRightBox.animate({ right: -800 }, 500, function () {
                    $(this).hide();
                    if (typeof closeCallBack == 'function') {
                        closeCallBack($(this));
                    }
                });
            }
        }
        var boxHead = $sliderRightBox.find(".box-header:eq(0)");
        if (title) {
            boxHead.find(".box-title").html(title);
            $sliderRightBox.find("[data-widget='close']").unbind("click");
            $sliderRightBox.find("[data-widget='close']").bind("click", function () {
                close();
            });
        }
        return { show: show, close: close };
    }
});