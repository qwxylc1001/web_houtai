$(function () {
    //表单的校验规则
    var form = layui.form;
    //表单验证规则
    form.verify({
         pwd:[/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
        //老密码不能与新密码一样
        samPwd:function (value) {
        //     给新密码samPwd加校验规则
        // samPwd是在新密码框中，就让samPwd的值与原密码的值进行判断
        //    如果相同就提示
            if (value===$('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        //给确认新密码加校验规则rePwd
        rePwd:function (value) {
        //  判断新密码与确认新密码相同，就return一个错误提示
            if (value !== $('[name=newPwd]').val()){
                return '两次输入的密码不一致'
            }
        }
    })

//重置密码 发请求
    $('.layui-form').on('submit',function (e) {
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/updatepwd',
            data:$(this).serialize(),
            success:function (res) {
                if (res.status !==0){
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功了');
                //通过jQuery[0]的样式转为原生的js 然后调用reset()重置
                //重置表单
                $('.layui-form')[0].reset();
            }
        })
    })
});