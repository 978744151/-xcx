let app = getApp(),
    wechat = require('../../utils/wechat.js'),
    API = require('../../utils/api.js')
Page({

  data: {
    showHint:true,
    Course:false,
    params:{},
    yetCoin:false,
    readyCoin:false,
    status:false,//状态弹窗-
    // status:true,
    // stu:'-3'
  },

  onLoad: function (options) { 
    const access_token = wx.getStorageSync('access_token') || app.access_token,
    uid = wx.getStorageSync('uid') || '',
      cardInfo = wx.getStorageSync('userinfo') || '';
    this.setData({
      access_token: access_token,
      uid: uid, cardInfo
    })
    // 
  },
  // 查看教程
  showCourse(){
    this.setData({ Course:true});
  },
  closeCourse() {
    this.setData({ Course: false });
  },
  onReady: function () { },

  onShow: function () {
 
    var userinfo = wx.getStorageSync('userinfo')
    this.spiltNum(String(userinfo.money))
    this.setData({
      isVip: userinfo.isVip,
      money: userinfo.money,
      unicom: userinfo.unicom
    })
   },
  spiltNum(userMoeny) {
    var individual, ten, hundred
    userMoeny.split("");
    if (userMoeny.length == 1) {
      individual = userMoeny[0]
    } else if (userMoeny.length == 2) {
      individual = userMoeny[1]
      ten = userMoeny[0]
    } else if (userMoeny.length == 3) {
      individual = userMoeny[2]
      ten = userMoeny[1]
      hundred = userMoeny[0]
    }
    console.log(individual, ten, hundred)
    this.setData({
      individual,
      ten: ten || '',
      hundred: hundred || ''
    })
  },
  closeKingModal(){
    this.setData({ yetCoin: false, readyCoin:false,status:false})
  },
  showCode(){
      wechat.scanCode(false).then((res) => {
        console.log(res)
        if (res.errMsg == 'scanCode:ok'){
          var params = { access_token: this.data.access_token, uid: this.data.uid, iccId: res.result }
          console.log(params)
          API.getCoinCard(params).then(res =>{
            console.log(res)
            if (res.data.status){
              let { data } = res.data;
              wx.showToast({ title: '恭喜你,领取成功', icon: 'none', duration: 2000 })
              this.setData({ readyCoin: true })
            }else{
              let { data } = res.data;
              console.log(data)
              data == '-9' ? this.setData({ yetCoin: true}) : '';
              if(data=='-9') return;
              data == '-2' || data == '-3' || data == '-4' ? this.setData({ stu: data, status: true }) : wx.showToast({ title: '条形码验证失败,请重试～', icon: 'none', duration: 2000 });
              
            }
          },err=>{
            wx.showToast({ title: '条形码验证失败,请重试～', icon: 'none', duration: 2000 })
          })
        }else{
          wx.showToast({ title: '条形码验证失败,请重试～', icon: 'none', duration: 2000 })
        }
      }).catch(fail=>{
        if (fail.errMsg == 'scanCode:fail cancel') {
          wx.showToast({ title: '已取消扫码', icon: 'none', duration: 2000 })
        } else {
          wx.showToast({ title: '条形码验证失败,请重试～', icon: 'none', duration: 2000 })
        }
      })
   
    
  },
  onHide: function () { },

  onUnload: function () { },

  onPullDownRefresh: function () {
    this.onShow()
    wx.stopPullDownRefresh();
  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})