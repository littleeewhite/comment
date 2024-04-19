<template>
	<div>
		<div class="box">
			<div class="line2"></div>
			<div class="box1">
          <div class='avatar'>
    				<img :src="userinfo.avatarUrl"/>
  				</div>
          <div class="head1">
          <div class="box2">
              <div class="name">
       				   {{userinfo.nickName}}
    			    </div>
             <div  class="time">
      			     {{create_time}}
    			   </div>
           </div>
          
           </div>
            <div @click="delete1" >
             
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
  			 		        <img :src="src" class="newspic">
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
  import {showModel,post} from '@/util'
  import {showSuccess} from "@/util"
  export default {
    props:['news','userinfo'],
    data(){
     return {
      create_time:formatTime(new Date(this.news.create_time)),
      src:this.news.src.split(","),
      any:"你好",
      islike:false,
      likenum:this.news.like,
      likearr:[]

    }},
    methods:{
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
                this.$parent.getPersonnalNews(true)
              }catch(e){
                console.log("错误信息",e)

              }
            }else if(res.cancel){ 
              console.log("用户点击了取消",this.news.id)
            }
          }
        })
        
      } ,
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
  }
    },
    watch:{
     src(){
       this.src=this.news.src.split(",")
     }
   },
   mounted(){
     console.log("执行newlist 的mountetd")
     console.log("newsList图片链接",this.news.id,this.news.src.split(","))
     this.mylike()
   }
 }

</script>

<style lang="scss">
.head1{
 display: flex;
 flex-direction: row;
 
 width:550rpx;
}

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
  width:50rpx;
  height: 50rpx;
 margin-right:10rpx;
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