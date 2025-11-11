var express = require('express');
var router = express.Router();
var connection = require('../db/sql.js')
var user = require('../db/userSql.js')
let jwt = require('jsonwebtoken')

//引入支付宝文件
const alipaySdk = require('../db/alipay.js')
const AlipayFormData = require('alipay-sdk/lib/form').default

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});
//发起支付
router.post('/api/payment',function(req,res,next){
    //订单号
    let orderId = req.body.orderId;
    //商品总价
    let price = req.body.price;
    //购买商品的名称
    let name = req.body.name;
    //开始对接支付宝API
    const formData = new AlipayFormData();
    // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
    formData.setMethod('get');
    //支付时信息
    formData.addField('bizContent', {
      outTradeNo: orderId,//订单号
      productCode: 'FAST_INSTANT_TRADE_PAY',//写死的
      totalAmount: price,//价格
      subject: name,//商品名称
    });
    //支付成功或者失败跳转的链接
    formData.addField('returnUrl', 'http://localhost:5173/payment');
    //返回promise
    const result = alipaySdk.exec(
      'alipay.trade.page.pay',
      {},
      { formData: formData },
    );
    //对接支付宝成功，支付宝方返回的数据
    result.then(resp=>{
        res.send({
            data:{
                code:200,
                success:true,
                msg:'支付中',
                paymentUrl : resp
            }
        })
    })
})

//修改订单状态
router.post('/api/submitOrder',function(req,res,next){
    //token
    let token = req.headers.token;
    let tokenObj = jwt.decode(token);
    //订单号
    let orderId = req.body.orderId;
    //购物车选中的商品id
    let shopArr = req.body.shopArr;
    //查询用户
    connection.query(`select * from user where tel = ${tokenObj.tel}`,function(error,results){
        //用户id
        let uId = results[0].id;
        connection.query(`select * from store_order where uId = ${uId} and order_id = ${orderId}`,function(err,result){
            //订单的数据库id
            let id = result[0].id;
            //修改订单状态 1==>2
            connection.query(`update store_order set order_status = replace(order_status,'1','2') where id = ${id}`,function(e,r){
                //购物车数据删除
                shopArr.forEach(v=>{
                    connection.query(`delete from goods_cart where id = ${v}`,function(){
                    })
                })
				res.send({
				    data:{
				        code:200,
				        success:true
				    }
				})
            })
        })
    })
    
})

//查询订单
router.post('/api/selectOrder',function(req,res,next){
    //接收前端给后端的订单号
    let orderId = req.body.orderId;
    connection.query(`select * from store_order where order_id='${orderId}'`,function(err,result){
         res.send({
            data:{
                 success:true,
                 code:200,
                 data:result
            }
         })
    })
})

//生成一个订单
router.post('/api/addOrder',function(req,res,next){
    //token
    let token = req.headers.token;
    let tokenObj = jwt.decode(token);
    //前端给后端的数据
    let goodsArr = req.body.arr;
    //生成订单号order_id，规则：时间戳 + 6为随机数
    function setTimeDateFmt( s ){
        return s < 10 ? '0' + s : s
    }
    function randomNumber(){
        const now = new Date();
        let month = now.getMonth() + 1;
        let day = now.getDate();
        let hour = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        month = setTimeDateFmt(month);
        day = setTimeDateFmt(day);
        hour = setTimeDateFmt(hour);
        minutes = setTimeDateFmt(minutes);
        seconds = setTimeDateFmt(seconds);
        let orderCode = now.getFullYear().toString() + month.toString() + day + hour + minutes + seconds + (Math.round(Math.random() * 1000000 )).toString();
        return orderCode;
    }
    /*
    未支付：1
    待支付：2
    支付成功：3
    支付失败：4 | 0
    */
    //商品列表名称
    let goodsName = [];
    //订单商品总金额
    let goodsPrice = 0;
    //订单商品总数量
    let goodsNum = 0;
	//订单号
	let orderId = randomNumber();
    
    goodsArr.forEach(v=>{
        goodsName.push( v.goods_name );
        goodsPrice += v.goods_price * v.goods_num;
        goodsNum += parseInt(v.goods_num);
    })
    //查询当前用户
    connection.query(`select * from user where tel = ${tokenObj.tel}`,function(error,results){
        //用户id
        let uId = results[0].id;
        connection.query(`insert into store_order (order_id,goods_name,goods_price,goods_num,order_status,uId) values ('${orderId}','${goodsName}','${goodsPrice}','${goodsNum}','1',${uId})`,function(e,r){
			connection.query(`select * from store_order where uId = ${uId} and order_id='${orderId}'`,function(err,result){
                res.send({
                    data:{
                        success:true,
                        code:200,
                        data:result
                    }
                })
            })
        })
    })
    
})

//修改购物车数量
router.post('/api/updateNum',function(req,res,next){
    
    let id = req.body.id;
    let changeNum = req.body.num;
    
    connection.query(`select * from goods_cart where id = ${id}`,function(error,results){
        //原来的数量
        let num = results[0].goods_num;
        connection.query(`update goods_cart set goods_num = replace(goods_num,${num},${changeNum}) where id = ${id}`,function(err,result){
            res.send({
                data:{
                    code:200,
                    success:true
                }
            })
        })
    })
})

//查询购物车数据
router.post('/api/selectCart',function(req,res,next){
    //token
    let token = req.headers.token;
    let tokenObj = jwt.decode(token);
    //查询用户
    connection.query(`select * from user where tel = ${tokenObj.tel}`,function(error,results){
        //用户id
        let uId = results[0].id;
        //查询购物车
        connection.query(`select * from goods_cart where uId = ${uId}`,function(err,result){
            res.send({
                data:{
                    code:200,
                    success:true,
                    data:result
                }
            })
        })
    })
})

//添加购物车数据
router.post('/api/addCart', function(req, res, next) {
	//后端接收前端的参数
	let goodsId = req.body.goodsId;
	//token
	let token = req.headers.token;
	let tokenObj = jwt.decode(token);
	console.log(tokenObj)
	//查询用户
	connection.query(`select * from user where tel = ${tokenObj.tel}`,function(error,results){
		//用户id
		let uId = results[0].id;
		//查询商品
		connection.query(`select * from goods_list where id=${goodsId}`,function(err,result){
			let goodsName = result[0].name;
			let goodsPrice = result[0].price;
			let goodsImgUrl = result[0].imgUrl;
			connection.query(`insert into goods_cart (uId,goods_id,goods_name,goods_price,goods_num,goods_imgUrl) values ("${uId}","${goodsId}","${goodsName}","${goodsPrice}","1","${goodsImgUrl}")`,function(e,r){
			   res.send({
				   data:{
					   code:200,
					   success:true,
					   msg:'添加成功'
				   }
			   }) 
			})
		})
	})
})

//修改密码
router.post('/api/modify',function(req,res,next){
	let params = {
		userTel : req.body.phone,
		userPwd : req.body.pwd
	}
	//查询用户是否存在
	connection.query( user.queryUserTel( params ) ,function(error,results){
		//某一条记录数id
		let id = results[0].id;
		let pwd = results[0].pwd;
		connection.query(`update user set pwd = replace(pwd,'${pwd}','${params.userPwd}') where id = ${id}`,function(err,result){
			res.send({
				code:200,
				data:{
					success:true,
					msg:'修改成功'
				}
			})
		})
	})
})

//注册
router.post('/api/register',function(req,res,next){
	let params = {
		userTel : req.body.phone,
		userPwd : req.body.pwd
	}
	//查询用户是否存在
	connection.query( user.queryUserTel( params ) ,function(error,results){
		if(error) throw error;
		//用户存在
		if( results.length > 0 ){
			res.send({
				code:200,
				data:{
					success:true,
					msg:'用户已存在，请登录！',
					data:results[0]
				}
			})
		}else{
			//不存在，新增一条数据
			connection.query( user.inserData ( params ),function(err,result){
				connection.query( user.queryUserTel( params ) , function(e,r){
					res.send({
						code:200,
						data:{
							success:true,
							msg:'注册成功！登录成功',
							data:r[0]
						}
					})
				})
			})
		}
	})
	
})

//手机号密码登录
router.post('/api/login',function(req,res,next){
	//接收用户传递的手机号和密码
	let params = {
		userTel : req.body.userTel,
		userPwd : req.body.userPwd
	}
	//查询用户手机号
	connection.query( user.queryUserTel(params),function(error,results){
		//手机号存在
		if( results.length > 0 ){
			connection.query(user.queryUserPwd(params),function(err,result){
				if(result.length > 0){
					//手机号密码正确
					res.send({
						code:200,
						data:{
							msg:'登录成功',
							success:true,
							data:result[0]
						}
					})
				}else{
					//密码不对
					res.send({
						code:302,
						data:{
							msg:'密码不对',
							success:false
						}
					})
				}
			})
		}else{
			//手机号不存在
			res.send({
				code:301,
				data:{
					msg:'手机号不存在',
					success:false
				}
			})
		}
	} )
})

//通过商品id查询
router.get('/api/goods/id',function(req,res,next){
	//前端传给后端的id
	let id = req.query.id
	connection.query('select * from goods_list where id=' + id + '',function(error,results){
		if(error) throw error
		res.json({
			code:0,
			data:results[0]
		})
	})
})

//分类的接口
router.get('/api/goods/list',function(req,res,next){
	res.send({
		code:0,
		data:[{
			//一级数据(左侧)
			id:0,
			name:'正在流行',
			data:[{
				//二级数据(右侧)
				id:0,
				name:'热销爆款',
				imgUrl:'/images/list-1.webp'
			},
			{
				id:1,
				name:'短袖',
				imgUrl:'/images/list-2.webp'
			},
			{
				id:2,
				name:'针织衫',
				imgUrl:'/images/list-3.webp'
			},
			{
				id:3,
				name:'衬衫',
				imgUrl:'/images/list-4.webp'
			}]
		},
		{
			//一级数据(左侧)
			id:1,
			name:'上衣',
			data:[{
				//二级数据(右侧)
				id:0,
				name:'热销爆款',
				imgUrl:'/images/list-4.webp'
			},
			{
				id:1,
				name:'套装',
				imgUrl:'/images/list-3.webp'
			},
			{
				id:2,
				name:'冲锋衣',
				imgUrl:'/images/list-2.webp'
			},
			{
				id:3,
				name:'防晒衣',
				imgUrl:'/images/list-1.webp'
			}]
		}]
	})
})

router.get('/api/goods/shopList', function (req, res, next) {
	
  const searchName = req.query.searchName;
console.log(searchName)
  connection.query(
    'SELECT * FROM goods_list WHERE name LIKE ?',
    ['%' + searchName + '%'],
    function (error, results) {
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).send({
          code: 0,
          message: '服务器内部错误',
        });
      }
      res.send({
        code: 1,
        data: results,
      });
    }
  );
});


//首页数据
router.get('/api/index', function(req, res, next) {
	res.send({
		code: 0,
		data: {
			sortList: [{
					id: 1,
					title: '女装',
					imgUrl: './images/1.webp'
				}, {
					id: 2,
					title: '女鞋',
					imgUrl: './images/2.webp'
				},
				{
					id: 3,
					title: '上衣',
					imgUrl: './images/3.webp'
				},
				{
					id: 4,
					title: '美妆/护肤',
					imgUrl: './images/4.webp'
				},
				{
					id: 5,
					title: '裤子',
					imgUrl: './images/5.webp'
				},
				{
					id: 6,
					title: '母婴/童装',
					imgUrl: './images/6.webp'
				},
				{
					id: 7,
					title: '裙子',
					imgUrl: './images/7.webp'
				},
				{
					id: 8,
					title: '男装男鞋',
					imgUrl: './images/8.webp'
				},
				{
					id: 9,
					title: '套装',
					imgUrl: './images/9.webp'
				},
				{
					id: 10,
					title: '配饰',
					imgUrl: './images/10.webp'
				}
			],
			goodsList: [{
					id: 1,
					name: '60两件春秋圆环拉链上衣高领显瘦修身长袖打底衫T恤女针织毛衣',
					actor: './images/list-1.webp',
					actorname: '小甜心',
					actortag: '爆单女王',
					price: '111',
					sales: 500,
					imgUrl: './images/list-1.webp',
					leftUrl: './images/zhibotongjia.png',
					rightUrl: './images/zhibo.png',
					byUrl: './images/baoyou.png'
				},
				{
					id: 2,
					name: '【送运费险】早秋黑色上衣女新款百搭纯色V领交叉长袖针织衫',
					actor: './images/list-2.webp',
					actorname: '小甜心',
					actortag: '爆单女王',
					price: '222',
					sales: 222,
					imgUrl: './images/list-2.webp',
					leftUrl: './images/zhibotongjia.png',
					rightUrl: './images/zhibo.png',
					byUrl: './images/baoyou.png'
				},
				{
					id: 3,
					name: '2件60露背t恤女短袖新款夏修身针织衫上衣冰丝体恤微透打底衫',
					actor: './images/list-3.webp',
					actorname: '小甜心',
					actortag: '爆单女王',
					price: '333',
					sales: 333,
					imgUrl: './images/list-3.webp',
					leftUrl: './images/zhibotongjia.png',
					rightUrl: './images/zhibo.png',
					byUrl: './images/baoyou.png'
				},
				{
					id: 4,
					name: '2件50元纯色百搭粉色体恤衫少女学生上衣服ins紧身短袖t恤',
					actor: './images/list-4.webp',
					actorname: '小甜心',
					actortag: '爆单女王',
					price: '444',
					sales: 444,
					imgUrl: './images/list-4.webp',
					leftUrl: './images/zhibotongjia.png',
					rightUrl: './images/zhibo.png',
					byUrl: './images/baoyou.png'
				},
				{
					id: 5,
					name: '大码女装短款法式不规则高级感上衣女胖mm显瘦遮肉内搭打底衫',
					actor: './images/list-5.jpg',
					actorname: '小甜心',
					actortag: '爆单女王',
					price: '555',
					sales: 555,
					imgUrl: './images/list-5.jpg',
					leftUrl: './images/zhibotongjia.png',
					rightUrl: './images/zhibo.png',
					byUrl: './images/baoyou.png'
				},
				{
					id: 6,
					name: '60两件长袖t恤女春秋新款网红百搭露肩宽松设计感打底心机上衣',
					actor: './images/list-6.webp',
					actorname: '小甜心',
					actortag: '爆单女王',
					price: '666',
					sales: 666,
					imgUrl: './images/list-6.webp',
					leftUrl: './images/zhibotongjia.png',
					rightUrl: './images/zhibo.png',
					byUrl: './images/baoyou.png'
				}
			]
		}
	})
})
module.exports = router;