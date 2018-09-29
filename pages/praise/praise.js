var app = getApp(),
   API = require('../../utils/api.js'),
   utils = require('../../utils/util.js'),
   access_token;



Page({
   data: {
      isIndexLoad: true,
      current: 0,
      picArr: [],
      showMessage: false,
      messageContent: '',
      praiseCon: '',
      isSend:false,
      praise: {
         yawp: {
            name: '不满',
            img: 'https://pic.repaiapp.com/pic/ef/be/58/efbe58f72b6ca0566852e9b7a219c927d5e2f6ed.png',
            unimg: 'https://pic.repaiapp.com/static/png/20171206/11/1512531349742734952.png',
            hint: '打入冷宫不受待见'
         },
         common: {
            name: '一般',
            img: 'https://pic.repaiapp.com/pic/9a/7d/3f/9a7d3fd1bfed712e112600fb2847f5a30bcd3500.png',
            unimg: 'https://pic.repaiapp.com/static/png/20171206/11/1512531519710900102.png',
            hint: '随便去去取还可以'
         },
         ok: {
            name: '满意',
            img: 'https://pic.repaiapp.com/pic/7a/e5/30/7ae530f2550f258e25946884804614b72db68c52.png',
            unimg: 'https://pic.repaiapp.com/static/png/20171206/11/1512531540567749949.png',
            hint: '可以经常翻牌'
         },
         supPraise: {
            name: '超赞',
            img: 'https://pic.repaiapp.com/pic/65/e9/e9/65e9e9c607c234bb32dd29b5661ccf3e3ac0cc0e.png',
            unimg: 'https://pic.repaiapp.com/static/png/20171206/11/1512531375887995698.png',
            hint: '值得翻山越岭去拔草'
         },
      },
   },

   //页面加载
   onLoad: function (options) {
     this.getData();
   },

   onReady: function () { },

   //判断是否已评价
   getData(){
     wx.setNavigationBarTitle({ title: '评价', })
     access_token = wx.getStorageSync('access_token');
     API.lookPraise({ access_token }).then((res) => {

       console.log(res.data)
       if (res.data.status) {
         //  app.showToast('您已评价', 'success')
         let pics = JSON.parse(res.data.data.myComment.pics);
         this.setData({ isIndexLoad: false, isSend: true, current: res.data.data.myComment.star, praiseCon: res.data.data.myComment.content, picArr: pics })
       } else {
         this.setData({ isIndexLoad: false, current: 0, praiseCon: '', picArr: [], isSend: false });
       }
     }, (err) => {
       console.log(err);
     })
   },

   // 评价是否满意
   isOk: function (e) {
     if(!this.data.isSend){
        this.setData({ current: e.currentTarget.dataset.type });
     }
   },
   // 上传图片
   choosePic: function () {
      var that = this;
      wx.chooseImage({
         count: 1,
         sizeType: ['original', 'compressed'],
         sourceType: ['album'],
         success: function (res) {
            console.log(res)
             that.upload_file('https://cy.tiantianremai.cn/app/index.php?i=4&c=entry&m=ewei_shopv2&do=mobile&r=apps.kitchen.upload_image', res.tempFilePaths[0])
         }
      })
   },
   //上传图片
   upload_file: function (url, filePath) {
      wx.showLoading({ icon: "loading", title: '正在上传', })
      var that = this;
      wx.uploadFile({
         url: url,
         filePath: filePath,
         name: 'uploadFile',
         header: {
            'content-type': 'multipart/form-data'
         }, // 设置请求的 header
         formData: {
            access_token: wx.getStorageSync("access_token")
         }, // HTTP 请求中其他额外的 form data
         success: function (res) {
            console.log(res);
            app.showToast('上传成功', 'success')
            that.data.picArr.push(res.data);
            console.log(that.data.picArr)
            that.setData({ picArr: that.data.picArr })
         },
         fail: function (res) {
         }
      })
   },
   // 删除图片
   closePic: function (e) {
      var picArr = this.data.picArr;
      picArr.splice(e.currentTarget.dataset.index, 1);
      this.setData({ picArr });
      app.showToast('删除成功', 'success')
   },
   // 输入评价内容
   inputValue: function (e) {
      this.setData({ praiseCon: e.detail.value });
   },
   /**
    * 提交评价
      praiseCon=>评价内容
      current=>评价状态 1 2 3 4
    */
   submitPraise: function () {
      if (this.data.current == 0) {
         utils.showMessage(this, '请选择评价满意度');
         return;
      } else if (this.data.praiseCon == '') {
         utils.showMessage(this, '请填写评价内容');
         return;
      }
      var that = this;
      wx.showModal({
         content: '确认提交评价吗？',
         confirmColor: '#f14949',
         success: function (res) {
            if (res.confirm) {
               API.submitPraise({ access_token, content: that.data.praiseCon, star: that.data.current, pics: that.data.picArr })
               .then((res) => {
                 that.getData();
                  // wx.switchTab({url: '/pages/index/index'})
               }, (err) => {
                  console.log(err);
               })
            } else if (res.cancel) {
               app.showToast('已取消', 'success')
            }
         }
      })
   },
   /**
    *点击评价完成
    */
  tapSubmit(e){
     utils.showMessage(this,'评价已完成,不能修改') 
  },
   onShow: function () {
      
   },

   onHide: function () { },

   onUnload: function () { },

   onPullDownRefresh: function () { wx.stopPullDownRefresh(); },

   onReachBottom: function () { },

})