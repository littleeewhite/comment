<template>
	<div>
		<div class="user">
			<div class="row">
				<label>相关用户</label>

			</div>
			<div v-if="showuser">
				<SearchUser v-for="(searchusr,index) in searchusr":key="index":searchusr='searchusr'></SearchUser>
				
				<p v-if ="showmoreuser">
					<img src="/static/images/moreuser.png" class="moreuser">
				</p>
			</div>
			<div v-else>
				<div class="none">
					<img src="/static/images/nomoreuser.png" class="nomoreuser">
				</div>
			</div>
		</div>
		<div>
			<div class="row">
				<label>相关留言</label>
				<label>{{this.searchnews.length}}</label>
			</div>
			<div v-if="showsearch">
				<FindNews  v-for="(searchnews,index) in searchnews":key="index" :news='searchnews'></FindNews>
				<p v-if="!more" class="foot">暂无更多相关留言~</p>
				<p v-else class="foot">搜索中...</p>
			</div>
			<div v-else>
				<div class="none">
					<img src="/static/images/nonenews.png" class="nonews">

					
				</div>
			</div>
		</div>
	</div>
</template>
<script >
	import {post,showModel,showSuccess,get} from '@/util'
	import FindNews from '@/components/FindNews'
	import SearchUser from '@/components/SearchUser'
	export default{
		components:{
			FindNews,
			SearchUser
		},
		data(){
			return {
				key:"",
				page :0,
				more:true,
				page:0,
				news:[],
				searchnews:[],
				showsearch:true,
				searchusr:[],
				user:[],
				nickname:[],
				show_news:false,
				totalarr:[],
				time:0,
				searchuserid:[],
				showuser:true,
				usertime:0,
				showmoreuser:true,
				userinfo:[]
			}
		},
		methods:{
			
			async searchnew(){
				this.time=this.time+1
				console.log("执行了search")

				console.log(this.news.length)
				var arr=[]
				for(var i=0;i<this.news.length;i++){
					if(this.news[i].news.indexOf(this.key)>=0){
						arr.push(this.news[i].id)
						console.log(this.news[i].news)
					}
				}
				console.log("搜i索的新闻d",arr)
				console.log(arr.length)
				
				for (var i=0;i<this.news.length;i++){
					for(var j=0;j<arr.length;j++)
					{
						if(this.news[i].id==arr[j]){
							this.searchnews.push(this.news[i])
						}
					}
					
				}
				this.totalarr.push(this.searchnews)

				console.log(this.news.length)
				if(this.news.length==10){
					if(!this.more){
						return 
					}
					this.page=this.page+1
					console.log("当前在第"+this.page+"页")
					this.getFindNews()
				}else {
					console.log("//////////",this.time)
					var t=0
					for(var i=0;i<this.time;i++){
						if(this.totalarr[i].length==0){
							t=t+1
						}
					}
					if (t==this.time){
						this.showsearch=false
					}
				}
				console.log("搜索到的新闻",this.searchnews)
				console.log("..........",this.totalarr)
			},
			async searchuser(){
				console.log("===================....=================",this.user)
				var arr=this.user
				
					const first=arr[0].split(":")
					const second=first[2].split(",")
					const third=second[0].split("\"")
					console.log("===============================1",first)
					console.log("===============================2",second)
					console.log("===============================3",third)
					this.nickname.push(third[1])
					if(third[1].indexOf(this.key)>=0){
						console.log("找到了用户")
						this.searchusr.push(first)
						if(this.searchusr.length===3){
							return 

						}else {
							this.usertime=this.usertime+1
							console.log("当前的usertime",this.usertime)
							this.getalluser()
						}
					}else{
						this.usertime=this.usertime+1
						console.log("当前的usertime",this.usertime)
						this.getalluser()
					}

				
				if(this.user)
				console.log("找到的用户信息",this.searchusr)
			},
			async getalluser(){
				console.log("执行了搜索alluser")
				try{
					const data={
						usertime:this.usertime
					}
					const res =await get("/weapp/getoneuser",data)
					console.log("......,,,............=======",res)
					if(res.userinfo.length==0){
						this.showmoreuser==false
						console.log("已经遍历完数据库")
						console.log("所有用户信息",res)
						console.log(this.searchusr)
						console.log(this.searchusr.length)
						if(this.searchusr.length==0){
							this.showuser=false

						}
						if(this.searchusr.length<3){
							this.showmoreuser=false
						}
					}else{
						var arr=[]
						console.log("-------------------------------",res.userinfo.length)

						arr.push(res.userinfo[0].user_info)

						console.log("-------------------------------",arr)
						this.user=arr
						this.searchuser()
					}
				}catch(e){
					console.log("错误信息",e)
					wx.hideToast()
				}
				
			},
			async getFindNews(init){
				console.log("执行了findnews")
				console.log(this.searchnews)
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
					this.news=res.news
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
					this.searchnew()
					wx.hideToast()
				}catch(e){
					console.log("错误信息",e)
					wx.hideToast()
				}
			}
		},

		onUnload:function(options){
			Object.assign(this.$data, this.$options.data())
		},
		onLoad:function(options){
			console.log("执行了onload")
			this.key=decodeURIComponent(options.source)
			console.log(this.key)
		},
		mounted(){
			console.log("执行了mounted")
			this.getFindNews(true)
			this.getalluser()

			
		},
		onReachBottom(){
			console.log("========，，，，，执行了")
			if(!this.more){
				return 
			}
			this.page=this.page+1
			console.log("当前在第"+this.page+"页")
			this.getFindNews()
		},
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

.none{
	color:gray;
	display:flex;
	align-items: center;
	
	justify-content:center;
	
	position:relative;
	.img{
		position:absolute;
		align-items:center;
		justify-content:center;
		display: flex;
		width: 180rpx;
        height: 180rpx;
	}
	
}
.nomoreuser{
		position:absolute;
	display: flex;
	 left:10rpx;
	 top:30rpx;
    width: 120rpx;
    height: 120rpx;

}
.moreuser{
		position:absolute;
	display: flex;
	 right:10rpx;
	 top:30rpx;
    width: 120rpx;
    height: 120rpx;

}
.user{
	height:240rpx;
	
}
.nonews{
	height:180rpx;
	width:180rpx;
	top:150rpx;
	position:absolute;
}
		
.row{
	font-size:15px;
	border-top:1px #F0F8FF solid;
    border-bottom: 1px #F0F8FF solid;
    color:gray;
    padding: 5px 15px;
    .name {
      width:80%;
      height: 40px;
      line-height: 40px;
    }
    
    .word-count {
      float:right;
      color: #808080;
      margin-bottom:20rpx;
    }
    .img-count {
      float:right;
      line-height: 40px;
      color: #808080;
    }
    
    
    
  }
</style>