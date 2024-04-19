//knex操作数据库

const {mysql}= require ('../qcloud')

module.exports =async(ctx)=>{
	const {news,src,openid} =ctx.request.body
	console .log("=======",news)
	console .log("=======",src)
	console .log("=======",openid)
	try{
		await mysql('news').insert({
			news,src,openid
		})

		ctx.state.data={
			code:0,
			msg:"success"
		}
		console.log("执行成功")

	}catch(e){
		ctx.state={
			code:-1,
			data:{
				msg:"添加失败"+e.sqlMessage
			}
		}
		console.log("执行错误")
	}
	
	
}