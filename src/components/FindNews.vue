<template>
	
	<div>
     
		<div class="box">
			<div class="box1">
        <div class='avatar' @click="showDetail">
          <img :src="avatarurl"/>
        </div>
        <div class="head1">
        <div class="box2">
          <div class="name">
           {{nickname}}
         </div>
         <div  class="time">
           {{create_time}}
         </div>
       </div>
       </div>
       <div @click="delete1" v-if="showDelete">
             <img src="/static/images/deleate.png" class="deleate">
          </div>
     </div>
    
      
    
     <div class="box3">
       <div>
        {{news.news}}
      </div>
      <div class="pic">
       <div v-if="news.src" class="newpic">

        <div v-for="(src,index) in src":key="index" >
          <img :src="src" class="newspic" @click="imgYu">
        </div>

      </div>
      <div v-else>

      </div>
    </div>
  </div>

  <div >

    <label class="interact" @click="like">
      <img v-if="!islike" src="/static/images/dislike.png" class="comment">
      <img v-else src="/static/images/like.png" class="comment">
      <div class="like" >{{likenum}}</div>
    </label>
  </div>
  <div class="line2"></div>
</div>
</div>
</template>

<script >
	import {formatTime} from '../utils/index.js'
  import {post,showModel,showSuccess,get} from '@/util'
  export default{
    props:['news'],

    data(){
      return {
       create_time:formatTime(new Date(this.news.create_time)),
       src:this.news.src,
       // split(","),
       avatarurl:"",
       nickname:"",
       islike:false,
       likenum:this.news.like,
      userinfo:{},
       data:"",
       likearr:[],
       showDelete:false,
       openid:""
     }
   },
   onshow(){
			//console.log("------news--",news)
      // console.log(this.src)
     this.getNewsWritter(this.news.id)
   },
   watch:{
   //  src(){
   //   this.src=this.news.src.split(",")
   // }
 },

 methods:{
  // downloadsrc(){
  //   wx.downloadFile({
  //     url:this.src[0],
  //     success:function(res){
  //       if(res.statusCode === 200){
  //        this.src=res.temFilePath
  //        console.log(this.src)
  //       }else {
  //         console.log("下载原图片不是200//////////////////////////////")
  //       }
  //     },
  //     fail:function(e){
  //       console.log('下载原图片失败///////////////////////////////',e)
  //     }
  //   })
  // },
  imgYu:function(event){
    console.log("图片地址测试，，，，，，，，，，，，，，",this.src[0])
        wx.previewImage({
          current:this.src[0],
          urls:this.src
          
        })

      },
 delete1(){

        console.log('删除',this.news.id)
        wx.showModal({
          'content':'确定要删除该留言吗？',
          success:async res=>{
            if(res.confirm){

              console.log('用户确定删除',this.news.id)
              try{
                const data={
                  newsid:this.news.id
                }
                const res= await post("/weapp/deletenews",data)
                showSuccess("删除成功")
                this.$parent.getFindNews(true)
              }catch(e){
                console.log("错误信息",e)

              }
            }else if(res.cancel){ 
              console.log("用户点击了取消",this.news.id)
            }
          }
        })
        
      } ,

  async getNewsWritter(init){
    console.log("getNewsWritter执行了")
    try{
      const data={
        id:init

      }

      const res=await get("/weapp/getnewswritter",data)
      console.log("从后端传过来的信息openid",res.open_id[0].openid)
      this.openid =res.open_id[0].openid
      console.log("=======================",this.openid)
      if(this.openid==wx.getStorageSync("userinfo").openId){
        this.showDelete=true
      }else{
        this.showDelete=false
      }
      const data1={

        open_id:res.open_id[0].openid
      }
      
      console.log("前端打印openid",data1)
      const res1=await get("/weapp/getwrittersrc",data1)
      const find =res1.userinfo[0].user_info.split(",")
      const avatar=find[7].split(":")
      const final=avatar[1].concat(":"+avatar[2])
      const final1=final.split("\"")
      this.avatarurl=final1[1]
      console.log("头像",this.avatarurl)
      const name=find[1].split(":")
      const name1=name[1].split("\"")
      this.nickname=name1[1]
      console.log("昵称",name1)

      wx.hideToast()
    }catch(e){
      console.log("错误信息",e)
      wx.hideToast()
    }
  },
  async like(){

    this.likearr=wx.getStorageSync("like_list")
    const likelist=wx.getStorageSync("like_list")
    console.log(likelist.length)
    if(this.islike){
      this.islike=false
      --this.likenum
      console.log("取消点赞")
      for(var i=0;i<likelist.length;i++){
        if(likelist[i]==this.news.id){
          this.likearr.splice(i,1)
        }
        wx.setStorageSync("like_list",this.likearr)
      }

      try{
        console.log(this.news.like)
        const data={
          id:this.news.id,
          like:this.likenum
          
        }
        console.log(data)
        const res=await post("/weapp/changelike",data)
       
      }catch(e){
         console.log("错误信息",e)
      }

    }else if(!this.islike){
      this.islike=true
      ++this.likenum
      console.log("点赞")
      this.likearr.push(this.news.id)
      
      wx.setStorageSync("like_list",this.likearr)
      console.log(this.likearr)

      try{
        console.log(this.news.like)
        const data={
          id:this.news.id,
          like:this.likenum
          
        }
        console.log(data)
        const res=await post("/weapp/changelike",data)
        console.log(res)
      }catch(e){
         console.log("错误信息",e)
      }
    }
    
  },
  mylike(){
  const likelist=wx.getStorageSync("like_list")
    for(var i=0;i<likelist.length;i++ ){
      if(likelist[i]==this.news.id){
        this.islike=true
        console.log("我喜欢")
        break
      }else{
        this.islike=false
        console.log("我不喜欢")
      }
    }
  },
  showDetail(){
    var openid=this.news.openid
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
  }

},

mounted(){
  console.log(this.news)
  console.log("执行findnews的mountetd")
  console.log(this.src)
  // console.log("findnews 图片链接",this.news.id,this.news.src.split(","))
  this.userinfo=wx.getStorageSync("userinfo")
  this.getNewsWritter(this.news.id)
  this.mylike()
  // if(this.userinfo.openId !==this.openid){
  //     this.downloadsrc()
  // }

   
}

}
</script>

<style lang="scss">
.deleate{
  width:45rpx;
  height:40rpx;
  margin-top:20rpx;
  
}
.like{
  margin-top:17rpx;
}
.box{
  background-color: #F5FFFA;
  display: flex;
  flex-direction: column;
}
.box1{
 background-color: #F5FFFA;
 color: black;
 display: flex;
 flex-direction:row;
 height: 110rpx;

}
.box2{
 background-color: #F5FFFA;
 color: black;

 display: flex;
 flex-direction:column;
 margin-left: 30rpx;
}
.box3 {
  margin-left: 30rpx;
  margin-right: 30rpx;
}
.box3 text{
  font-size: 25rpx;
  color: black;
}
.avatar {

  img{
    margin-top: 10rpx;
    margin-left: 20rpx;
    width: 90rpx;
    height: 90rpx;
    border-radius: 45rpx;
    background: #f2f2f2;
  }
}
.time {
  font-size: 22rpx;
  color: gray;
  margin-top: 10rpx;
}
.name{
  color: black;
  font-size: 30rpx;
  margin-top: 10rpx;
}
.comment {
  width: 50rpx;
  height: 50rpx;
  margin-right: 10rpx;
  float:  right;
  margin-top: 10rpx;
}
.interact{
  display: flex;
  flex-direction: row;
  float:  right;
  margin-right: 40rpx;
  font-size:30rpx;
  color:gray;
   margin-top: 10rpx;

}

.line2{

  height: 1px;
  margin: 10rpx;
  background:lightgrey;
}
.pic{
  display: flex;
  flex-direction:row;
  .newpic{
    display: flex;
    flex-direction:row;
    .newspic{

     height:140rpx;
     width:140rpx; 
     margin-top: 40rpx;

   }
 }
}
</style>