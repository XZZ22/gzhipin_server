var express = require('express');
var router = express.Router();

//加密
const md5 = require('blueimp-md5');
//引入
const {UserModel} = require('../db/models');

//过滤数据
const filter = {password:0,_v:0};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/*
b.提供一个用户注册的接口
  a)path为: /register
  b)请求方式为: POST
  c)接收username和password参数
  d)admin是已注册用户
  e)注册成功返回: {code: 0, data: {_id: 'abc', username: ‘xxx’, password:’123’}
  f)注册失败返回: {code: 1, msg: '此用户已存在'}
   */

/*
分三步：
1、发送请求
  GET:
    query参数：
      映射路由的时候：/register/username
      发送请求的url中：/register？username=xxx
      req.query
    param参数：
      映射路由的时候：/register/:username
      发送请求的url中：/register/username=xxx
      req.parmas
  POST：body中。  req.boby
2、处理数据
3、返回响应
 */

// // 1、发送请求
// router.post('/register',function (req,res,next) {
//   const {username,password} = req.body;
//   // 2、处理数据
//   if(username === 'admin'){ //3、返回响应（失败）
//     res.send({code: 1, msg: '此用户已存在'});
//     /*res.send({code: 1, msg: '此用户已存在'});
//       注意：使用res.send()的时候，如果传的是一个对象或者数组，内部会自动调用res.json()
//           所以在这里，rea.send()的本质是调用的res.json()
//      */
//   }else{  //3、返回响应（成功）
//     res.send({code: 0, data: {_id: 'abc', username, password}})
//   }
// })

//注册路由
router.post('/register',function (req,res) {
  //获取请求
  const {username,password,type} = req.body;
  //处理请求
    //去数据库中查找书否存在这个用户，
  UserModel.findOne({username},function (error,userDoc) {
    if(userDoc){// 如果存在，返回失败的响应，
      res.send({code:1,msg:'已经存在这个用户名'})
    }else{// 如果不存在，返回成功的响应，保存到数据库中，保存到cookie中，返回成功的响应
      new UserModel({username,password:md5(password),type}).save(function (error,userDoc) {
        // 实现7天免登陆
        res.cookie('userid',userDoc._id,{maxAge:1000*60*60*24*7});
        res.send({code:0,data:{_id:userDoc._id,username,type}})
      })
    }
  })
})

//登录路由
router.post('/login',function (req,res) {
  //获取请求
  const {username,password} = req.body;
  //处理请求
  //去数据库中查找书否存在这个用户，
  UserModel.findOne({username,password:md5(password)},filter,function (error,userDoc) {
    if(userDoc){// 如果存在，返回成功的响应，
      //实现7天免登陆
      res.cookie('userid',userDoc._id,{maxAge:1000*60*60*24*7});
      res.send({code:0,data:{_id:userDoc._id,username}})
    }else{// 如果不存在，返回成功的响应，保存到数据库中，保存到cookie中，返回成功的响应
      res.send({code:1,msg:'用户名或者密码错误'})
    }
  })
})

//更新用户路由
router.post('/update',function (req,res) {
  //1、获取cookies中的userid，
  const userid = req.cookies.userid;
  // 2、如果没有，直接响应给用户重新登录的信息
  if(!userid){
    return res.send({code:1,msg:'请先登陆'})
  }
  //3、如果有，去数据库中查找相关的数据,更新数据
  UserModel.findByIdAndUpdate({_id: userid},req.body,function (error,userDoc) {
    //获取数据库中原来的数据
    const {_id, username, type} = userDoc;
    //合并用户数据
    const data = Object.assign(req.body,{_id, username, type});
    //返回响应成功的信息
    return res.send({code:0,data});
  })
})

//获取cookie中的userid，保持书信后仍然是登录的状态
router.get('/user',function (req,res) {
  //1、获取cookie中的userid
  const userid = req.cookies.userid;
  //2、如果 没有，返回登录界面
  if(!userid){
    return res.send({code: 1, msg: '请先登陆'})
  }
  //3、如果有，数据库中查找，返回响应成功
  UserModel.findOne({_id: userid}, filter, function (err, user) {
    return res.send({code: 0, data: user})
  })
})

module.exports = router;
