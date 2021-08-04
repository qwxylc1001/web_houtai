//文章列表
$(function () {
    var form = layui.form;
    //下面这个是分页要用的
    var laypage = layui.laypage;
    //定义美化时间的过滤器
    //处理什么数据 都可以通过function的形参拿到
    template.defaults.imports.dateFormat=function (data) {
        const dt =new Date(data);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth()+1);
        var d = padZero(dt.getDate());

        var hh= padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y+'-'+m+'-'+d+' '+hh+':'+mm+':'+ss
    };
    //定义补零的函数
    function padZero(n) {
       return n > 9 ? n : '0' + n
    }

    //定义一个查询的参数对象，将来请求数据的时候，我们需要将
//    请求参数对象提交到服务器
   var q={
       pagenum:1,//页码值 默认请求第一页的数据
       pagesize:2, //每页显示几条数据，默认每页显示2条
       cate_id:'',//文章分类的id
       state:'',//文章的发布状态
   };
    initTable();
    initCate();
   //获取文章列表数据的方法
   function initTable() {
       $.ajax({
           method:'GET',
           url:'/my/article/list',
           data:q,
           success:function (res) {
               // console.log(res);
               if(res.status !==0){
                   return layui.layer.msg('获取文章列表失败')
               }
           //  使用模板引擎渲染页面的数据
           var htmlStr =template('tpl-table',res);
               $('tbody').html(htmlStr);
           //    渲染数据之后，调用渲染分页的方法
               renderPage(res.total)
           }
       })
   }

//   初始化文章分类的方法

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success:function (res) {
                if(res.status !== 0){
                    return layui.layer.msg('获取分类数据失败')
                }
            //    调用模板引擎渲染分类的可选项
                var htmlStr= template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //通知layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }
//    为筛选表单绑定submit 事件
    $('#form-search').on('submit',function (e) {
        e.preventDefault();
    // 获取表单中选中项的值
        var cate_id=$('[name=cate_id]').val();
        var state = $('[name=state]').val();
    //    为查询参数对象q中对应的属性赋值
        q.cate_id=cate_id;
        q.state=state;
    //    根据最新的筛选条件 从新渲染表格的数据
    //     console.log(q)
        initTable();
    })

    //定义渲染分页的方法
    function renderPage(total) {
        //调用laypage.render()方法来渲染分页的结构
        laypage.render({
            //指向存放分页的容器
            // 注意是容器的id id不需要加#
            elem:'pageBox',
            //只要指定了总的数据条数,又指定了limit,他内部就会做除法的操作,就能动态的计算出有多少个分页了
            count:total,//总数据条数
            limit:q.pagesize, //每页显示多少条数据
            curr:q.pagenum,  //    默认那一页被选中
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10],
            //分页发生切换的时候，触发jump回调
            //出发jump回调的方式有两种：
            //    1，点击页码的时候，会触发jump回调
            //    2.只要调用了laypage.render这个方法 就会触发jump回调
            //出现死循环的原因是因为第二种(laypage.render)，当我们出现第一种的时候 first的值为undefined
            //当触发第二种情况的时候，first的值为true
            jump:function (obj,first) {
                //可以通过first的值来判断是通过那种方式触发的jump回调，
                //如果first的值为true，证明是方式2触发的
                //否则就是方式1触发的
                //拿到最新的页码值
                // console.log(obj.curr);
                //把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum=obj.curr;
                // console.log(obj.limit); //得到每页显示的条数
                //把最新的条目数，赋值q这个查询参数对象的pagesize属性中
                q.pagesize=obj.limit;
                //根据最新的q获取对应的数据列表，并渲染表格
                //必须是！first的时候调用，不然会出现死循环
                if(!first){
                    initTable();
                }
            }
        })
    }

//    通过代理的形式为删除按钮绑定点击事件处理函数
    $('tbody').on('click','.btn-delete',function () {
        //获取删除按钮的个数
        var len=$('.btn-delete').length;

        //获取文章的id
        var id=$(this).attr('data-id');
        console.log(id)
        //询问用户是否要删除数据
       layui.layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //发送ajax删除对应的数据
            $.ajax({
                method:'GET',
                url:'/my/article/delete/'+id,
                success:function (res) {
                 if(res.status!==0){
                     return layui.layer.msg('删除文章失败')
                 }
                 layui.layer.msg('删除文章成功');
                 //当数据删除完成后，需要判断当前这一页中是否还有剩余的数据
                 //   如果没有剩余的数据，则让页码值-1，之后
                 //   在重新调用initTable方法
                    if(len===1){
                    //len(按钮的个数)的值等于1，证明删除完毕之后，页面上就没有数据了
                    //    页码最小必须是1
                        q.pagenum=q.pagenum===1?1:q.pagenum-1;
                    }
                 initTable();
                }
            });
            layer.close(index);
        });
    })
});