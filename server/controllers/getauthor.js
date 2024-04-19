const {mysql}= require ('../qcloud')

module.exports =async(ctx)=>{
	//const {id} =ctx.request.query
	//const id=0
    //console.log("===id=====",id)
    const {mysql}= require ('../qcloud')
    const {open_id} =ctx.request.query
    console.log("作者id",open_id)
	try{
		const csessioninfo =await 
		                   mysql("csessioninfo")
		                   .select("user_info")
						  .where("open_id",open_id)
		ctx.state.data={
			csessioninfo
		}
		console.log("========",csessioninfo)
	}catch(e){
		ctx.state ={
			code:-1,
			data:{
				msg:"获取失败"+e.sqlMessage
			}
		}
	}
	
}