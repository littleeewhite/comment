const {mysql}= require ('../qcloud')

module.exports =async(ctx)=>{
	//const {id} =ctx.request.query
	//const id=0
    //console.log("===id=====",id)
    const {open_id} =ctx.request.query
    console.log("getwritter头像openid",open_id)
	try{
		const userinfo =await  mysql("csessioninfo")
		                   .select("user_info")
						  .where("open_id",open_id)
		ctx.state.data={
			userinfo
		}
		console.log("===userinfo=====",userinfo)
	}catch(e){
		ctx.state ={
			code:-1,
			data:{
				msg:"获取失败"+e.sqlMessage
			}
		}
	}
	
}