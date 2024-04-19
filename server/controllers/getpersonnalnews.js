const {mysql}= require ('../qcloud')

module.exports =async(ctx)=>{
	const {openid,page} =ctx.request.query

	try{
		const news =await mysql("news")
						.where("openid",openid)
						.orderBy("id","desc")
						.limit(10).offset(Number(page)*10)
		ctx.state.data={
			news
		}
	}catch(e){
		ctx.state ={
			code:-1,
			data:{
				msg:"获取失败"+e.sqlMessage
			}
		}
	}
	
}