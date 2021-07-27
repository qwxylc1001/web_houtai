$(function () {
    //点击去注册的链接
    $('#link_reg').on('click',function () {
        // 点击去注册按钮把去登录隐藏
        $('.login-box').hide();
    //    把去注册显示
        $('.reg-box').show();
    })
    //点击去登录的链接
    $('#link_login').on('click',function () {
        // 点击去登录按钮把去注册隐藏
        $('.reg-box').hide();
        //    把去登录显示
        $('.login-box').show();
    })

    // 自定义校验规则
    //1.从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    //2.通过form.verify()函数来自定义校验规则
    form.verify({
        //自定义一个叫做pwd的校验规则
        //第一个正则表达式是规则，如果输入的不正确，就返回下面的提示文字
        pwd:[
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        //校验两次密码是否一致的规则
        repwd:function (value) {
        //    通过形参拿到的是确认密码框中的内容
        //    还需要拿到密码框的内容
           var pwd = $('.reg-box [name=password]').val();
           if (pwd!==value){
               //    进行比较，
               //    如果判断失败，则return错误的提示消息
               return '两次密码不一致'
           }

        }
    })

//  监听注册表单的提交事件
    $('#form_reg').on('submit',function (e) {
        //阻止表单的默认行为
        e.preventDefault();
        //发送ajax请求
        var data = {username:$('#form_reg [name=username]').val(),
            password:$('#form_reg [name=password]').val()};
        $.post('/api/reguser',data,
            function (res) {
                if (res.status !==0){
                    return layer.msg(res.message)
                }
                layer.msg('注册成功请登录');
                //   注册成功后，模拟人的点击行为，自动跳转到登录页面
                $('#link_login').click();

            })
    });

    //监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        /*阻止默认提交行为*/
        e.preventDefault();
        $.ajax({
            url:'/api/login',
            method:'POST',
            //快速获取表单中的数据
            data:$(this).serialize(),
            success:function (res) {
                if (res.status!==0) {
                    return layer.msg('登录失败')
                }

                //测试密码ad321  addddd
                layer.msg('登录成功');
                // console.log(res.token);
                //将登录成功得到的token字符串，保存到localStorage中
                localStorage.setItem('toke',res.token);
                //登录成功后，跳转到后台主页
                window.location= './index.html';
            }

        })
    })
});