<template>
  <div>
  	
  	<div class="modal-mask"></div>
  	<div class="modal-dialog">
     <div class="modal-content">
      <img src="../../static/images/login/welcome.jpg" class="img">
      <div class="content-text">
       <p class="key-bold">欢迎来到小小留言板</p>
       <p class="key-bold">欢迎来到小小留言板</p>
       <p class="key-bold">欢迎来到小小留言板</p>
       <p class="key-bold">欢迎来到小小留言板</p>
     </div>
   </div>
   <div class="modal-footer">
    <button open-type="getUserInfo" lang="zh_CN"  @getuserinfo="login">
      授权登录
    </button>
  </div>
</div>
</div>
</template>

<script>
	import config from"@/config"
	import qcloud from"wafer2-client-sdk"
	import {showSuccess} from "@/util"
	export default{
		data(){
			return{
				arr:[],
				searchdata:[]
			}
			
   },
   methods:{
    login(){
     qcloud.setLoginUrl(config.loginUrl);
     qcloud.login({
      success: userInfo=> {
       console.log('登录成功', userInfo)
       console.log(userInfo.code)
       this.loginSuccess(userInfo)
       this.$emit("changeShow",false,userInfo,wx.showTabBar())
       showSuccess("登录成功")
      
     },
     fail: err=> {
      console.log('登录失败', err);
    }
  });
   },
   loginSuccess(userInfo){
     wx.setStorageSync('userinfo',userInfo)
     wx.setStorageSync("like_list",this.arr)
     wx.setStorageSync("searchdata",this.searchdata)
   }
   
 }
 
}
</script>

<style lang="scss">

.modal-mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: #000;
  opacity: 0.5;
  overflow: hidden;
  z-index: 9000;
  color: #fff;
}
.modal-dialog {
  box-sizing: border-box;
  width: 560rpx;
  overflow: hidden;
  position: fixed;
  top: 30%;
  left: 0;
  z-index: 9999;
  background: #fff;
  margin: -150rpx 95rpx;
  border-radius: 16rpx;
}
.modal-content {
  box-sizing: border-box;
  display: flex;
  padding: 0rpx 53rpx 50rpx 53rpx;
  font-size: 32rpx;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.content-tip {
  text-align: center;
  font-size: 36rpx;
  color: #333333;
}
.content-text {
  height:100px;
  padding:10px 0px 50px 0px;
  font-size:14px;
}
.modal-footer {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  border-top: 1px solid #e5e5e5;
  font-size: 16px;
  font-weight:bold;
  height: 45px;
  line-height: 45px;
  text-align: center;
  background:#3EA6AC;
}
button {
  width: 100%;
  background:#3EA6AC;
  color:#FFFFFF;
  font-weight:bold;
}
.img {
  width: 280px;
  height:140px;
}
.little-tip {
  padding-top:15px;
  padding-bottom:3px;
  font-size: 14px;
  font-weight:bold;
  color: #feb600;
}
.little-content {
  padding-top:5px;
  font-size: 13px;
  color:#606060;
}
.key-bold {
  padding-top:5px;
  font-size: 14px;
  font-weight:bold;
}

</style>

