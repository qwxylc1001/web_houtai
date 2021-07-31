$(function () {

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');

// 1.2 配置选项
    const options = {
        // 纵横比
        //1代表是正方形
        //aspectRatio:可以是宽高比16/9
        //aspectRatio:16/9就是长方形了
        aspectRatio: 1/1,
        // preview指定预览区域  是div的.img-preview
        preview: '.img-preview'
    };

// 1.3 创建裁剪区域
    $image.cropper(options);

//    点击上传按钮 然后上传文件
    $('#btnChooseImage').on('click',function () {
    //    如果用户点击了上传按钮，我们就要模拟input file的点击事件
        $('#file').click();
    });
    //导入layer
    // var layer = layui.layer;
//    头像选择的区域 然后替换剪辑区域的头像的替换
//    为文件选择框绑定change事件
    $('#file').on('change',function (e) {
    //这个e里面可以拿到用户选择的文件
    // 获取用户选择的文件
        var filelist = e.target.files;
        if(filelist.length === 0){
            return layui.layer.msg('请选择图片!')
         }
        // 更换裁剪的图片
        //1.拿到用户选择的文件
        var file = e.target.files[0];
        //  2.将文件转化为URL路径
        var imgURL = URL.createObjectURL(file);
        //3.重新初始化裁剪区域，
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src',imgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });
    //为确定按钮绑定点击事件
    $('#btnUpload').on('click',function () {
        // 1.拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            .toDataURL('image/png');

        //    2.调用接口把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功！');
                window.parent.getUserInfo();
                // location.reload();
            }
        })

    })

});

