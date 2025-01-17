let {Router}=require('express')
let db=require('../db/db.js')
bsrouter=new Router()


    //处理注册路由
    bsrouter.post('/register',async (req,res)=>{
        //获取用户的输入
        const {email,password,nick_name,re_password}=req.body
        //校验数据的合法性
            // 邮箱地址(email)
        const emailreg=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
            //昵称校验
        const nickreg=/[\u4e00-\u9fa5]/gm;
            // 密码校验
        const passwordreg=zzbds=/[a-zA-Z0-9_@#$%\.]{2,16}/;
        let errmsg={}
            if(!emailreg.test(email))
            {
                errmsg.email="邮箱格式非法"
            }
            if(!nickreg.test(nick_name))
            {
                errmsg.nick_name="昵称格式非法"
            }
            if(!passwordreg.test(password))
            {
                errmsg.password="密码格式非法"
            }
            if(!password===re_password)
            {
                errmsg.re_password="密码不一致"
            }
            //检测错误对象是否为空
            if(JSON.stringify(errmsg)!=='{}')
            {
                res.render('register',{errmsg,neterr:''})
                return
            }
            
    
            
        //注册过--驳回,未注册--注册
        //该邮箱是否注册过
        try {
            if(await db.usermodle.findOne({email:email}))
            {
                errmsg.email='邮箱已被注册'
                res.render('register',{errmsg})
                return
            }
            await db.usermodle.create({email,nick_name,password})
            res.redirect(`/login/?emailto=${email}`)
        } catch (error) {
            //1.计数 //2.引入警报模块
            console.log(error);
            res.render('register',{errmsg:{},neterr:'网络不稳定'})
        }   
    })
    
    
    bsrouter.post('/login',async (req,res)=>{
        const {email,password}=req.body
        const emailreg=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        const passwordreg=zzbds=/[a-zA-Z0-9_@#$%\.]{2,16}/;
        let errmsg={}
        errmsg.emailto;
            if(!emailreg.test(email))
            {
                errmsg.email="邮箱格式非法"
            
            }
            if(!passwordreg.test(password))
            {

                errmsg.password="密码非法"
    
            }

            //检测错误对象是否为空
            if(JSON.stringify(errmsg)!=='{}')
            {
                res.render('login',{errmsg})
                return
            }
            try {
                let finder=await db.usermodle.findOne({email,password})
                if(!finder)
                {
                    errmsg.email='邮箱或密码错误'
                    errmsg.password='邮箱或密码错误'
                    res.render('login',{errmsg})
                    return
                   
                }
                //种下ccokie
                res.cookie('_id',finder._id,{maxAge:20000})
                res.redirect(`user/`)
            } catch (error) {
               console.log(error)
               errmsg.neterr='网络不稳定';

               res.render('login',{errmsg})
            }
    
    }) 

    module.exports=bsrouter