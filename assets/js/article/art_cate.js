$(function () {
    var form = layui.form
    initArtCateList();
//    获取文章的分类列表 table数据
    function initArtCateList() {
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function (res) {
                //通过模板引擎渲染数据
                var htmlStr = template('tp1-table',res);
                $('tbody').html(htmlStr);
            }
        })
    }

    // 1.为添加类型添加点击事件 激活弹出层
    //定义新增索引
    var indnxAdd = null;
    $('#btnAddCate').on('click',function () {
        //layer.open会返回一个索引
        indnxAdd = layui.layer.open({
            type:1,
            title: '添加文章分类',
            area: ['500px', '260px']
            ,content: $('#dialog-add').html()
        })
    });

//   弹出层的点击确认按钮添加事件
//    通过代理形式为动态添加的元素，弹出层id="form-add"表单绑定submit事件
//    body(先被加载的)是要代理的，#form-add(后被加载的)是被代理的
    $('body').on('submit','#form-add',function (e) {
        // console.log($(this).serialize());
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data:$(this).serialize(),
            success:function (res) {
                if(res.status!==0){
                    return layui.layer.msg('添加文章失败！');
                }
            //    如果没有被return出去 那么就添加成功
                //，重新调用获取文章的分类列表 table数据的数据就可以了
                initArtCateList();
                layui.layer.msg('新增分类成功！');
            // 通过索引关闭添加按钮的弹出层
                layui.layer.close(indnxAdd);
            }
        })
    })
//为什么要通过代理的形式哪，就是因为这个按钮在script中，script的代码是最后加载的
//    所以要通过代理的形式,来触发这个按钮的点击事件
//     通过代理形式，为编辑按钮btn-edit按钮绑定点击事件
    var indexEdit= null; //为了关闭弹出层 而设置的
    $('tbody').on('click','#btn-edit',function () {
        //弹出一个修改文章分类信息的层
        indexEdit = layui.layer.open({
            type:1,
            title: '修改文章分类',
            area: ['500px', '260px']
            ,content: $('#dialog-edit').html()
        });
        //点击那个编辑 拿到那个编辑对应的id
        var id = $(this).attr('data-id');
        // console.log(id)
    //    发起请求获取对应分类的数据
        $.ajax({
          method:'GET',
            url:'/my/article/cates/'+id,
            success:function (res) {
                //快速给form表单赋值
                form.val('form-edit',res.data)
            }
        })
    })

    //通过代理的形式，为修改分类的表单绑定 submit事件
    $('body').on('submit','#form-edit',function (e) {
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data: $(this).serialize(),
            success:function (res) {
                if(res.status !==0){
                    return layui.layer.msg('更新分类失败')
                }
                layui.layer.msg('更新分类成功');
                //关闭弹出层
                layui.layer.close(indexEdit);
            //    重新获取数据
                initArtCateList();
            }
        })
        
    })

//    通过代理形式，为删除按钮绑定点击事件
    $('tbody').on('click','.btn-delete',function () {
        // console.log('ok')
        var id = $(this).attr('data-id');
        //提示用户是否要删除
        layui.layer.confirm('确认删除？',{icon:3,title:'提示'},function (index) {
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/'+id,
                success:function (res) {
                    if(res.status !==0){
                        return layui.layer.msg('删除分类失败')
                    }
                    return layui.layer.msg('删除分类成功');
                    layer.close(index);
                    //关闭弹框后 重新渲染数据
                    initArtCateList();
                }
            })

        })
    })
});