$(function () {
   // 导入layui的form
   var form= layui.form;
   var layer=layui.layer;
   // console.log(form)
    //通过form.varify自定义验证规则
    form.verify({
        //nickname是input标签lay-verify中填写的值
        nickname:function (value) {
            // console.log(value);
            if (value.length<6){
                return'昵称长度必须在1-6字符之间！'
            }
        }
    });
    initUserInfo();
    //初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success:function (res) {
                if (res.status!==0){
                    return layer.msg('获取用户信息失败')
                }
                // console.log(res);
            // 调用form.val()快速为表单 lay-filter="formUserInfo"赋值
            //    第一个参数是是用来指定给那个表单赋值，是那个表单通过lay-filter来进行选取
            //    第二个参数是用户信息对象 也就是后台返回的对象
                form.val('formUserInfo',res.data)
            //    这样就实现了快速赋值了
            }
        })
    }
//    重置表单数据
    $('#btnReset').on('click',function (e) {
        // 阻止表单的默认重置行为
        e.preventDefault();
        initUserInfo();
    });

//    监听表单的提交事件
    $('.layui-form').on('submit',function (e) {
        //阻止表单的默认行为
        e.preventDefault();
    //    发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data:$(this).serialize(),
            success:function (res) {
                if (res.status!==0){
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新成功')
            //    调用父页面的方法,重新渲染用户的头像和用户的信息
                window.parent.getUserInfo();
            }

        })
    })
});
