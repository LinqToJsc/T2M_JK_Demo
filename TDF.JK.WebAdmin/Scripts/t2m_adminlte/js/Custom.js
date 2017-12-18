//JS 数组去重复
Array.prototype.unique3 = function () {
    var res = [];
    var json = {};
    for (var i = 0; i < this.length; i++) {
        if (!json[this[i]]) {
            res.push(this[i]);
            json[this[i]] = 1;
        }
    }
    return res;
}
/*
用于将form表单的控件对象序列化为对象，方便列表查询时不用手动拼接条件
调用例子：$("#form1").serializeObject();
*/
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
}
//读取cookies 
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    }
    else {
        return null;
    }
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

//bootstrap toast 浮动提示
var i = -1,
    toastCount = 0,
    $toastlast,
    getMessage = function () {
        var msgs = ['Hello, some notification sample goes here',
            'Did you like this one ? :)',
            'Totally Awesome!!!',
            'Yeah, this is the Metronic!',
            'Explore the power of App. '
            //'Explore the power of App. '
        ];
        i++;
        if (i === msgs.length) {
            i = 0;
        }
        return msgs[i];
    };

//显示浮动提示框
var showToast = function (type, title, message) {

    var toastType = ['success', 'info', 'warning', 'error'];
    //toastr[success]("Gnome & Growl type non-blocking notifications", "Toastr Notifications");
    if (type > 3) type = 1;
    if (!message) message = getMessage();

    toastr[toastType[type]](message, title);
};

/**
 * 表单验证
 * jqForm form的JQ对象
 * rules 验证规则对象
 * submitHandlerFunction(form) [function 必须参数] 验证成功回调函数
 * messages [Object 可选] 验证提示语对象
 * isDebug [Boolean 可选,默认值:false]是否开启debug模式，开启后表单将只验证不提交
 */
var customFormValidate = function(jqForm, rules, submitHandlerFunction, messages, isDebug) {
    rules = rules || {};
    messages = messages || {};
    isDebug = isDebug || false;
    jqForm.validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block',
        rules: rules,
        messages: messages,
        debug: isDebug,
        highlight: function (element) { // hightlight error inputs
            var titleLabel = $(element).parent().find('label:eq(0)');
            //if (titleLabel.find('.fa-check').length > 0)
            //    titleLabel.find('.fa-check').remove();
            $(element).closest('.form-group').removeClass("has-success").addClass('has-error'); // set error class to the control group
            titleLabel.addClass('text-black');
        },
        errorPlacement: function (error, element) {
            if ($(element).attr('hideerror'))
                return;
            error.appendTo(element.parent());
        },
        success: function (label, element) {
            var titleLabel = $(element).parent().find('label:eq(0)');
            $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
            titleLabel.addClass('text-black');
            $(label).appendTo($(element).parent());
        },
        submitHandler: function(form) {
            if (typeof submitHandlerFunction == 'function') {
                submitHandlerFunction(form);
            }
        }
    });


}