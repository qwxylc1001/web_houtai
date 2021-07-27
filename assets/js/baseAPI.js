//注意：每次调用$.get()或者$.post()或者$.ajax()的时候
//会先调用$.ajaxPrefilter这个函数
//在这个函数中，可以拿到我们给Ajax提供的配置对象
//使用公共的URL进行拼接
$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    //在发起真正的ajax请求的之前来，统一拼接请求的根路径
    options.url='http://api-breakingnews-web.itheima.net'+options.url
});