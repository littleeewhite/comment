<template>
	<div>
		<div class ='header'>
			<div class="avatar1">
				<img :src="avatarurl">
			</div>
			<div class="login">
			<label>{{nickName}}</label>
			</div>
		</div>
		<div v-if="show_news">
			<div>还没有发表过任何留言~</div>
		</div>
		<div v-else>
			<ListBody v-for="(news,index) in news":key="index" :news='news' :open_id='open_id':nickName='nickName':avatarurl='avatarurl'>
			</ListBody>
		
		</div>
		<p v-if="!more" class="foot">暂无更多留言~</p>
		<p v-else class="foot">加载中...</p>
		
	</div>
</template>
<script >
	import {post,showModel,showSuccess,get} from '@/util'
	import ListBody from '@/components/ListBody'
	export default{
		components:{
			ListBody
		},
		data(){
			return {
				open_id:"",
				nickName:"",
				avatarurl:"",
				page:0,
				more:true,
				show_news:false,
				news:[],


			}
	},
	methods:{
		async getauthor(){
			console.log(this.open_id)
			const data={
				open_id:this.open_id
			}
			const res=await get("/weapp/getwrittersrc",data)
			console.log(res)
			const find =res.userinfo[0].user_info.split(",")
			const avatar=find[7].split(":")
			const nick=find[1].split(":")
			const nick1=nick[1].split("\"")
			this.nickName=nick1[1]
			const final=avatar[1].concat(":"+avatar[2])
			const final1=final.split("\"")
			this.avatarurl=final1[1]
			console.log("头像",this.avatarurl)
			console.log("昵称",this.nickName)
		},
		async getPersonnalNews(init){
			wx.showToast({
				title:"加载中",
				icon:"loading"
			})
			if(init){
				this.page =0
				this.more =true
			}
			if(this.page ===0){
				this.news=[]
			}
			try{
				const data={
					openid:this.open_id,
					page:this.page
				}
				const res=await get("/weapp/getpersonnalnews",data)

				this.news=this.news.concat(res.news)
				console.log("从后端传过来的信息",this.news)
				if(res.news.length<10 && this.page>=0){
					this.more=false
				}

				if(this.news===0){
					this.show_news=true
				}else{
					this.show_news=false
				}
				wx.hideToast()
			}catch(e){
				console.log("错误信息",e)
				wx.hideToast()
			}
		}

	},
	onReachBottom(){
		if(!this.more){
			return 
		}
		this.page=this.page+1
		console.log("当前在第"+this.page+"页")
		this.getPersonnalNews()
	},
	onPullDownRefresh(){
		this.getPersonnalNews(true)
		wx.stopPullDownRefresh()
		console.log("个人中心刷新")
	},
	onLoad:function(options){

			this.open_id=decodeURIComponent(options.source)
			this.getauthor()
			},
	mounted(){
		this.getPersonnalNews(true)

	}
}
</script>
<style lang="scss">

	
.header {
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position:relative;
  display: flex;
  background:#3EA6AC;
  height: 220rpx;
  padding: 12rpx 30rpx;                                                                                                                        
  color: #fff;
}
.avatar1 {
	img {
  width: 140rpx;
  height: 140rpx;
  border-radius: 70rpx;
  background: #f2f2f2;
 }
}
.login {
  font-size: 40rpx;
 }
.comment{
  background-image: "../../static/images/me/comment.png"
}

.foot{
	color:gray;
	font-size:30rpx;
	 justify-content: center;
	  display: flex;
	   flex-direction: column;
	    position:relative;
}


</style>