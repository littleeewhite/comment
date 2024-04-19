<template>
	<div>
		<button @click="clearstorage">清除缓存</button>
		<div class='search'>
			<input type='text' placeholder='输入你想要的内容' confirm-type='search'  bindinput='bindKeyInput' bindconfirm='query' maxlength="30"  v-model="inputValue" >
			
			</input>
			<image class="" src='/static/images/search.png' @click="query"></image>
		</div>
	<div v-if="showLogin">
		<LoginWindow @changeShow="getMode(arguments)"></LoginWindow>
	</div>

	<div>
		<FindNews v-for="(news,index) in news":key="index" :news='news'></FindNews>
	</div>
	<p v-if="!more" class="foot">暂无更多留言~</p>
	<p v-else class="foot">加载中...</p>
</div>
</template>
<script >
	import ListBody from '@/components/ListBody'
	import LoginWindow from '@/components/LoginWindow'
	import FindNews from '@/components/FindNews'
	import {post,showModel,showSuccess,get} from '@/util'
	export default{
		components:{
			ListBody,
			LoginWindow,
			FindNews
			
		},
		data(){
			return{
				userinfo:{},
				showLogin:false,
				show_news:false,
				news:[],
				page:0,
				more:true,
				com_num:0,
				inputValue:""
			}
		},
		methods:{
			getMode(val){
				this.showLogin=val[0]
				this.userinfo=val[1]      
			},
			async query(event){
				var	inputValue=this.inputValue
				if(this.inputValue.length>0){

					
					wx.navigateTo({
						url:"/pages/search/main?source="+inputValue
					})
					this.inputValue=""
				}
				else{
					console.log("执行了")
					showModel("搜索失败","搜索内容不能为空")
				}
				
			},
            clearstorage(){
            	wx.clearStorage()
            },
			async getFindNews(init){

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
						
						page:this.page
					}
					const res=await get("/weapp/getfindnews",data)
					console.log("从后端传过来的信息是------find",res)
					this.news=this.news.concat(res.news)
					console.log("拼接后的信息",this.news)

					
					if(res.news.length<10 && this.page>=0){
						this.more=false
						console.log("more:",this.more)
					}
					
					if(this.news===0){
						show_news:true
					}else{
						show_news:false
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
			this.getFindNews()
		},
		onPullDownRefresh(){
			this.getFindNews(true)
			wx.stopPullDownRefresh()
			console.log("发现页面刷新")
		},
		mounted(){
			const userinfo=wx.getStorageSync('userinfo')
			if(userinfo.openId){
				this.userinfo=userinfo
				console.log("用户信息",userinfo)
				this.getFindNews(true)
			}else{
				wx.hideTabBar()
				this.showLogin=true
			}
		},
		onShow(){
			console.log("执行find的onshow")
			//this.getFindNews(true)
		// if(userinfo.openId){
		// 	this.userinfo=userinfo
		// 	console.log("this.userinfo",this.userinfo)
		// 	this.getPersonnalNews()
		// }

	}
}     
</script>
<style lang="scss">
.foot{
	color:gray;
	font-size:30rpx;
	justify-content: center;
	display: flex;
	flex-direction: column;
	position:relative;
}
.search
{
	display: flex;
	flex-direction: row;
	justify-content:space-between;
	align-items: center;
	width:730rpx;
	height:60rpx;
	background-color:whitesmoke;
	margin-top:10rpx;
	margin:10rpx;
	border:1rpx solid whitesmoke;
	border-radius: 5rpx;

}


.search input
{
	font-size:27rpx;
	font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	padding-left:30rpx; 
}

.search image
{ 
	width:40rpx;
	height:40rpx;
	padding-right:20rpx;
}
</style>