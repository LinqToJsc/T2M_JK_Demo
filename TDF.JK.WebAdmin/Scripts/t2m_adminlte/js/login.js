var Login = function () {
    //登录
    var handleLogin = function () {
        $('.login-form').validate({
            rules: {
                LoginName: {
                    required: true
                },
                Password: {
                    required: true
                },
                verifyCode: { required: true }
            },
            messages: {
                LoginName: {
                    required: "请输入帐号和密码"
                },
                Password: {
                    required: "请输入帐号和密码"
                },
                verifyCode: { required: "验证码不能为空" }
            },
            highlight: function (element) { // hightlight error inputs
                $('.login-box-msg').html('');
            },
            //errorPlacement: function (error, element) {
            //    $('.login-box-msg').html($(error).text());
            //},
            success: function(label, element) {
                $('.login-box-msg').html('');
            },
            showErrors: function (errorMap, errorList) {
                if (errorList.length > 0) {
                    $('.login-box-msg').text(errorList[0].message);
                }else
                    $('.login-box-msg').html('');

            },
            submitHandler: function(form) {
                $.ajax({
                    type: 'POST',
                    url: $('#defaultForm').attr("action"),
                    data: { UserName: $('#LoginName').val().trim(), Password: $('#Password').val().trim(), Code: $('#verifyCode').val() },
                    dataType: 'JSON',
                    success: function(result) {
                        if (result.Success) {
                            location.replace($("#IndexUrl").val());
                            if ($goUrl !== '')
                                setCookie('t2m_sel_menu', '');

                        } else {
                            $('.login-box-msg').html(result.Message);
                            //刷新验证码
                            getVerifyCode($('#img_verifyCode'));
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        $('.login-box-msg').html('登录失败');
                        //刷新验证码
                        getVerifyCode($('#img_verifyCode'));
                    },
                    async: false
                });
            }

        });

        $('.login-form input').keypress(function (e) {
            if (e.which == 13) {
                if ($('.login-form').validate().form()) {
                    $('.login-form').submit();
                }
                return false;
            }
        });
    }
    //退出
    var handleLoginOut = function() {
        $.ajax({
            type: 'POST',
            url: '/Login/LoginOut',
            data: { },
            dataType: 'JSON',
            success: function (result) {
                if (result.Success) {
                    location.replace('/Login');
                } 
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                
            },
            async: false
        });
    }
    return{
        init: function() {
            handleLogin();
        },
        loginOut: function() {
            handleLoginOut();
        }
    };
}();
jQuery(document).ready(function () {
    Login.init();
});