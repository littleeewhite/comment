const {mysql}= require ('../qcloud')

module.exports =async(ctx)=>{
  const {usertime} =ctx.request.query
	//const id=0
    //console.log("===id=====",id)
   
    
	try{
		const userinfo =await 
		                   mysql("csessioninfo")
		                   .select("user_info")
		                   .limit(1).offset(Number(usertime)*1)
						  
		ctx.state.data={
			userinfo
		}
		console.log("========",userinfo)
	}catch(e){
		ctx.state ={
			code:-1,
			data:{
				msg:"获取失败"+e.sqlMessage
			}
		}
	}
	
}