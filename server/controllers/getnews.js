const {mysql}= require ('../qcloud')

module.exports =async(ctx)=>{
	//const {id} =ctx.request.query
	//const id=0
    //console.log("===id=====",id)
    
	try{
		const news =await mysql("news")
						
						.orderBy("id","desc")
						

		ctx.state.data={
			news
		}
		console.log("===findnews=====",news)
	}catch(e){
		ctx.state ={
			code:-1,
			data:{
				msg:"获取失败"+e.sqlMessage
			}
		}
	}
	
}