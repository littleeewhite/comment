const {mysql}= require ('../qcloud')

module.exports =async(ctx)=>{
	//const {id} =ctx.request.query
	//const id=0
    //console.log("===id=====",id)
    const {id} =ctx.request.query
    console.log("newsid",id)
	try{
		const open_id =await 
		                   mysql("news")
		                   .select("openid")
						  .where("id",id)
		ctx.state.data={
			open_id
		}
		console.log("===newswritter=====",open_id)
	}catch(e){
		ctx.state ={
			code:-1,
			data:{
				msg:"获取失败"+e.sqlMessage
			}
		}
	}
	
}