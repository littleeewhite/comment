<template>
	<div>
		<div class="contain">
			<div class="row">
				<label>编辑留言</label>
			</div>
			<div class="row text">
				<div>
					<textarea 
					v-model="news"
					 maxlength="400"
					  placeholder="点击这里输入文本~" class="input">
					  	
					  </textarea>
					  <label class="word-count">{{word_count}}/400</label>
				</div>
			</div>
			<div class="row">
				<div>
					<label>上传照片(选填)</label>
					<label class="img-count">{{img_count}}/9</label>
				</div>
				<label v-for="(item,index) in src":key="index">
					<img class="img" :src="item">
				</label>
				<label v-if="img_count<9" @click="uploadPicture" >
					<img src="../../../static/images/new/addimage.png" class="img">
				</label>
			</div>
			
		</div>
		<button @click="submit">发表</button>
	</div>
</template>

<script >
	import {post,showModel,showSuccess} from '@/util'
	import {base64_encode} from '@/util'
	export default{
		data(){
			return {
				news:"",
				word_count:0,
				src:[],
				img_count:0
				
			}
		},
		watch:{
			news(){
				this.word_count=this.news.length
			},
			src(){ 
				this.img_count=this.src.length
			}
		},
		onload(){
			
		},
		onShow :function(){
			
		},
		mounted(){

		},
		methods:{
			uploadPicture(){
				let that=this
				wx.chooseImage({
  				count: 9,
  				sizeType: ['original', 'compressed'],
 				 sourceType: ['album', 'camera'],
  				success (res) {
  					// wx.getFileSystemManager().readFile({
  					// 	filePath: res.tempFilePaths[0],
  					// 	encoding: 'base64',
  					// 	success:res=>{
  					// 		console.log(res.data)
  					// 		that.src.push("data:image/jpeg;base64,"+res.data)
  					// 	}
  					// })
  				const tempFilePaths = res.tempFilePaths[0]
  				wx.uploadFile({
  					url:'http://localhost:5757/weapp/upload',
  					filePath:tempFilePaths,
  					name:'file',
  					formData: {
                    'user': 'test'
                   },
  					success: function(res){
                     console.log(res.data)
                     console.log('chenggong ')
                    //do something
                  },
                   fail: function (e) {
                      console.log(e)
                     },

  				})
    			 that.src.push(tempFilePaths)
 		 		}
				})
			},
			async submit(){
				
				if(this.word_count>0){
					const data={
					news:this.news,
					src:this.src.join(","),
					openid:wx.getStorageSync('userinfo').openId
				}

					try{
						
						const res=await post('/weapp/createnews',data)
						var that=this
						wx.showModal({
							title:'留言成功',
							confirmText:'继续',
							content:'要继续留言吗？',

							success:(res)=>{
								
								if(res.cancel){
									Object.assign(this.$data, this.$options.data())
								wx.switchTab({
									url:'/pages/find/main',

								})
								}else if(res.confirm){
									
									Object.assign(this.$data, this.$options.data())
								}
							}

						})
						

					}catch(e){
						console.log("------错误",e)
						showModel("发表失败","失败")
					}
				}else{
					showModel("提交失败","发表留言不能为空")
				}
			}
	}
}
</script>

<style lang="scss">
	
.contain{
  background:#FFFFFF;
  font-size:15px;
  .text {
    height: 300px;
  }
  .row{
    border-bottom: 1px #E8E8E8 solid;
    padding: 5px 15px;
    .name {
      width:80%;
      height: 40px;
      line-height: 40px;
    }
    .input {
      width:100%;
      height:270px;
      font-size:14px;
      padding-top:5px;
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
    .add-img {
      width:80px;
      height:80px;
    }
    .img {
      width:66px;
      height:66px;
      margin-bottom:7px;
      margin-right: 10px;
    }
    .wechat-input{
      font-size:14px;
    }
  }
}  
button {
  margin:20px auto;
  width:90%;
  border-radius: 5px;
  background:#3EA6AC;
  font-size:16px;
  color:#FFFFFF;
  font-weight:bold;
}

</style>