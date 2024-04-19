<template>
	<div>
		<div class ='header'>
			<div class="avatar1">
				<img :src="userinfo.avatarUrl">
			</div>
			<div class="login">
			<label>{{userinfo.nickName}}</label>
			</div>
		</div>
		<div v-if="show_news">
			<div>还没有发表过任何留言~</div>
		</div>
		<div v-else>
			<NewsList v-for="(news,index) in news":key="index" :news='news':userinfo='userinfo'>
			</NewsList>
		
		</div>
		<p v-if="!more" class="foot">暂无更多留言~</p>
		<p v-else class="foot">加载中...</p>
	</div>
</template>

<script >
	import NewsList from '@/components/NewsList'
	import {post,showModel,showSuccess,get} from '@/util'

	export default{
		components:{
			NewsList
		},
		data(){
			return{
			userinfo:{},
			show_news:false,
			news:[],
			com_num:0,
			page:0,
			more:true
		}
	},
	methods:{
		showDetails(){
        wx.navigateTo({
          url:"/pages/detail/main"
        })
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
      			openid:this.userinfo.openId,
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
	onShow(){
		console.log("执行me的onshow")
		const userinfo=wx.getStorageSync('userinfo')
		if(userinfo.openId){
			console.log(userinfo.avatarUrl)
			this.userinfo=userinfo
			console.log("this.userinfo",this.userinfo)
			this.getPersonnalNews(true)
		}

	}

}
</script>
<style lang="scss" scoped>

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