<template>
	<div>
		<div class='avatar1' @click="showDetail">
          <img :src="avatarurl"/>
        </div>
         
	</div>
</template> 

<script >
	export default{
		 props:['searchusr'],
		data(){
			return{
				avatarurl:"",
				nickname:"",
				userinfo:[]
			}
		},
		methods:{
			showDetail(){
				console.log(this.searchusr)
				var open=this.searchusr[1].split(",")
				var open1 =open[0].split("\"")
				var openid=open1[1]
				console.log(openid)
				if(openid==this.userinfo.openId){
					wx.switchTab({
						url:'/pages/me/main',

					})
				}
				else{
					wx.navigateTo({
						url:"/pages/detail/main?source="+openid
					})
				} 
			},
			getinfo(){
				console.log("执行了searchusr的getinfo",this.searchusr)
				const nick=this.searchusr[2].split(",")
				const nick1=nick[0].split("\"")
				const avatar=this.searchusr[8].split("\"")
				const avatarurl1=avatar[1].concat(":"+this.searchusr[9])
				const avatar1=avatarurl1.split(",")
				const avatar2=avatar1[0].split("\"")
				this.avatarurl=avatar2[0]
				this.nickname=nick1[1]
				console.log(this.avatarurl)
				console.log(this.nickname)
			}
		},
		mounted(){
			console.log("执行了searchusr的mounted",this.searchusr)
			this.getinfo()
			this.userinfo=wx.getStorageSync("userinfo")
		}
	}

</script>
<style lang="scss">
.avatar1{
	position:relative;
  img{
  	position:absolute;
   left:10rpx;
	 top:30rpx;
    width: 120rpx;
    height: 120rpx;
    border-radius: 90rpx;
    background: #f2f2f2;
  }
}
</style>