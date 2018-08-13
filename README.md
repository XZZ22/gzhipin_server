# gzhipin_server
硅谷直聘后台服务器搭建
#day02--后台服务器的搭建

##1)需求:
  a.后台应用运行端口指定为4000
  b.提供一个用户注册的接口
    a)path为: /register
    b)请求方式为: POST
    c)接收username和password参数
    d)admin是已注册用户
    e)注册成功返回: {code: 0, data: {_id: 'abc', username: ‘xxx’, password:’123’}
    f)注册失败返回: {code: 1, msg: '此用户已存在'}
    修改端口号: bin/www
  b.启动：npm start
  c.利用postman工具进行接口测试
    a)利用nodemon包实现后台应用自动重运行
        下载: npm install --save-dev nodemon
        配置: "start": "nodemon ./bin/www"

##2)使用mongoose操作数据库

  使用mongoose操作mongodb的测试文件，一般步骤：

    1. 连接数据库
      1.1. 引入mongoose
      1.2. 连接指定数据库(URL只有数据库是变化的)
      1.3. 获取连接对象
      1.4. 绑定连接完成的监听(用来提示连接成功)
    2. 得到对应特定集合的Model
      2.1. 字义Schema(描述文档结构)
      2.2. 定义Model(与集合对应, 可以操作集合)
    3. 通过Model或其实例对集合数据进行CRUD操作
      3.1. 通过Model实例的save()添加数据
      3.2. 通过Model的find()/findOne()查询多个或一个数据
      3.3. 通过Model的findByIdAndUpdate()更新某个数据
      3.4. 通过Model的remove()删除匹配的数据

    注意：用到的依赖包下载：npm install --save mongoose blueimp-md5（加密）

##3)安装webstorm的mongodb插件: Mongo Plugin(免费工具还包括：robo3t)

##4)注册/登陆后台处理
  a)数据库数据操作模块: db/models.js
  b)路由器模块: routes/index.js
  c)使用postman测试接口