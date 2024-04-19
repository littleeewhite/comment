const {mysql}= require ('../qcloud')

module.exports =async(ctx)=>{
	const {newsid} =ctx.request.body
	console .log("=======",newsid)
	
	try{
		await mysql('news').delete ()
						   .where("id",newsid)

		ctx.state.data={
		code:0,
		msg:"success"
		}
		console.log("执行成功")

	}catch(e){
		ctx.state={
			code:-1,
			data:{
				msg:"删除失败"+e.sqlMessage
			}
		}
		console.log("执行错误")
	}
	
	
}