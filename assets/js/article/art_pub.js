$(function () {
    var form =layui.form;
//    定义加载文章分类的方法
    initCate();
    //调用富文本编辑器
    initEditor();
    function initCate() {
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function (res) {
               if (res.status!==0){
                   return layui.layer.msg('获取数据失败')
               }
            //   调用模板引擎，渲染分类的下拉菜单
                var htmlStr=template('tpl-cate',res);
                $('[name=cate_id]').html(htmlStr);
            //一定要记得调用form.render()方法重新渲染表单区域
                form.render();
            }
        })
    };
    // 1. 初始化图片裁剪器
    var $image = $('#image');

    // 2. 裁剪选项
    var options = {
        aspectRatio: 1,
        preview: '.img-preview'
    };

    // console.log($image.cropper(options))
    // 3. 初始化裁剪区域
    $image.cropper(options);

    //为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click',function () {
        // alert('111')
        $('#coverFile').click();
    });

//    监听隐藏输入框(coverFile)的change事件，获取用户选择的文件列表
//    将图片设置到裁剪区域中
    $('#coverFile').on('change',function (e) {
        //获取文件隐藏input框选中那个文件的列表数组
        var files=e.target.files;
        if(files.length===0){
            return
        }
       // 1. 拿到用户选择的文件
       // var file = e.target.files[0];
       // 2. 根据选择的文件，创建一个对应的 URL 地址：
       var newImgURL = URL.createObjectURL(files[0]);
     //   为裁剪区域重新设置图片
     //3. 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
       $image
          .cropper('destroy')      // 销毁旧的裁剪区域
          .attr('src', newImgURL)  // 重新设置图片路径
          .cropper(options)        // 重新初始化裁剪区域

    });
    //定义文章的发布状态
    var art_state='已发布';
    //为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click',function () {
        art_state='草稿'
    })
//为表单绑定submit提交事件
    $('#form-pub').on('submit',function (e) {
    //    1,阻止表单的默认提交行为
        e.preventDefault();
    //    2.基础form表单，快速创建一个FormData对象
            //new FormData($(this)[0])中的$(this)[0]把表单里的收据转成原生的JavaScript对象存在FormData
       var fb= new FormData($(this)[0]);
       //3,将文章的发布状态 存到fb中
       fb.append('state',art_state);

    //   4.将封面裁剪过后的图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

            //  5.将文件对象存储fb也就是formData中
                fb.append('cover_img',blob)
            //    6.发起ajax请求
            //    调用发表文章的操作
                publishArticle(fb)
            })
    })
//    定义一个发布文章的方法
    function publishArticle(fb) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data:fb,  //传递的是formData的数据
        //    注意：如果向服务器提交的是formData格式的数据，必须添加以下两个配置项
            contentType:false,
            processData:false,
            success:function (res) {
                if(res.status!==0){
                    return layui.layer.msg('发布文章失败')
                }
                layui.layer.msg('发布文章成功');
                //发布文章成功 后， 跳转到文章列表页面
                location.href='../article/art_list.html'
            }
        })
    }
});