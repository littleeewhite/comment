const {mysql}= require ('../qcloud')

module.exports = async(ctx)=>{
	const {id,like} =ctx.request.body
	const row={
		id:id,
		like:like
	}
	console.log(row)
	try{
		await   mysql('news')
				.update('like',like)
				.where("id",id)
				
		console.log(id,like)
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