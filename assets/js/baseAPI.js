//注意：每次调用$.get()或者$.post()或者$.ajax()的时候
//会先调用$.ajaxPrefilter这个函数
//在这个函数中，可以拿到我们给Ajax提供的配置对象
//使用公共的URL进行拼接
$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    //在发起真正的ajax请求的之前来，统一拼接请求的根路径
    options.url='http://api-breakingnews-web.itheima.net'+options.url;


//  统一为有权限的接口，设置headers 设置请求头
//    URL中含有/my的才加headers这个请求头
//     console.log(options.url.indexOf('/my/'))
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('toke') || ''

        }
        // console.log(  localStorage.getItem('toke'))
    }

    //全局统一挂载complete回调函数
    //无论成功还是失败，最后都会调用complete这个回调函数
    //如果没有登录 就不让他通过URL访问这个页面
    options.complete=function(res){
        console.log('执行了 complete 回调');
        console.log(res.responseJSON);
        //    在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message ==='身份认证失败！'){
            //     // 1.强制清空token
            localStorage.removeItem('toke');
            //     // 2.强制回到登录页面
            window.location.href='./login.html';
        }
    }
});