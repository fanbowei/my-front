
const express = require('express')
const app = express()
const port = 3000

app.use(express.urlencoded({extended:true})) //获取post请求的请求体
app.use(express.static(__dirname+'/public/'))


app.get('/test_get', (req, res) => {
    let arr=req.query
    res.send(`dosomething(${JSON.stringify(arr)})`)
})
app.post('/test_post', (req, res) => {
    res.header('content-type','html/text,charset:utf-8')
    res.send('我是服务器返回的jsonp跨域post请求')
})


app.listen(port, () => console.log(`服务器启动:http://127.0.0.1:3000/1.html`))