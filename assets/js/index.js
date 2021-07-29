$(function () {
    //调用getUserInfo获取用户基本信息这个函数
    getUserInfo();
    var layer = layui.layer;
    //点击按钮 实现退出功能
    $('#btnLogOut').on('click',function (e) {
        // e.preventDefault();
    //是否确认退出
        layer.confirm('确定退出登录？', {icon: 3, title:'提示'},
            function(index){
            //1,清空本地存储的token
                localStorage.removeItem('toke');
            // 2.重新跳转到登录页面
                window.location.href='./login.html';
            //    关闭confirm询问框
            layer.close(index);
        });

    })
});
//自定义方法获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        //headers就是请求头配置对象
        // headers:{
        //     Authorization:localStorage.getItem('toke')||''
        // },
        success:function (res) {
            if (res.status !==0 ){
                return layui.layer.msg('获取用户信息失败')
            }
            //调用rederAvatar函数渲染头像
            renderAvatar(res.data)
        },
        //无论成功还是失败，最后都会调用complete这个回调函数
        //如果没有登录 就不让他通过URL访问这个页面
        // complete:function (res) {
        //     console.log('执行了 complete 回调');
        //     console.log(res.responseJSON);
        // //    在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message ==='身份认证失败！'){
        // //     // 1.强制清空token
        //         localStorage.removeItem('toke');
        // //     // 2.强制回到登录页面
        //        window.location.href='./login.html';
        //     }
        // }
    })

}
//渲染用户头像
function renderAvatar(user) {
    //1.获取用户的名称
    var name = user.nickname ||user.username;
    //2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;'+name);
    //  3,按需渲染用户头像
    if (user.user_pic!==null){
    //    3.1渲染图片头像
        $('.layui-nav-img').attr('src',user_pic).show();
        $('.text-avatar').hide();
    }else {
    //3.2渲染文本头像
        $('.layui-nav-img').hide();
        //获取第一个字母 转成大写的
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}
