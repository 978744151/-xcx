var app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    pickerDefault: "请选择标签",
    bigadrDefault: "小区/写字楼/学校等",
    tagList: ["其它", '家', '公司', '学校'],
    editInfo: {},
    showMessage: false,
    messageContent: '',
    access_token:'',
    contName:'',
    Phone:'',
    detailAdr:'',
    id:'',
    newList:'',
    lat:'',
    lng:'',
    bigadr:'',
    tagname:'',
  },
  onLoad: function (options) {
    var access_token =  wx.getStorageSync('access_token');
    console.log(options)
    this.setData({
      editInfo:options,
      access_token: access_token,
      id:options.id,
      contName: options.contactname,
      Phone: options.phone,
      lat:options.lat,
      lng:options.lng,
      detailAdr: options.detailadr,
      bigadr: options.bigadr,
      tagname: options.tagname
    })
    if(this.data.id){
      this.setData({
        bigadrDefault:''
      })
    }else{
      this.setData({
        bigadrDefault: "小区/写字楼/学校等",
      })
    }
    console.log(this.data.editInfo,'editInfoeditInfoeditInfo')
  },
  //选择地址
  bindTapChooseLocation: function (e) {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res, 'resa')
        if (res.errMsg == "chooseLocation:ok") {
          var data = that.data.editInfo;
          data.lat = res.latitude;
          data.lng = res.longitude;
          data.bigadr = res.address;
          that.setData({
            editInfo: data,
            bigadrDefault: ''
          })
        }
        console.log(that.data.editInfo,555)
      },
      cancel: function (res) { },
      fail: function (res) { },
      complete: function (res) { }
    })
  },
  //选择标签
  bindPickerChange: function (e) {
    console.log(e,'eee')
    var data = this.data.editInfo;
    data.tag = e.detail.value;
    this.setData({
      editInfo: data,
      pickerDefault: ''
    })
  },
  inputBlur: function (e) {
    var tagName = e.currentTarget.dataset.name;
    var tagVal = e.detail.value;
    var data = this.data.editInfo;
    if (tagName == 'name') {
      data.contactname = tagVal;
    }
    if (tagName == 'phone') {
      data.phone = tagVal;
    }
    if (tagName == 'addr') {
      data.detailadr = tagVal;
    }
    
    console.log(data,333)
  },
  editAddr:function(){
    var data = this.data.editInfo;
    var that = this;
    if (!data.contactname) {
      this.setData({
        showMessage: true,
        messageContent: '请填写收货人姓名'
      })
      setTimeout(function () {
        that.setData({
          showMessage: false,
          messageContent: ''
        })
      }, 2000)
      return false;
    }
    if (!data.phone) {
      this.setData({
        showMessage: true,
        messageContent: '请填写手机号码'
      })
      setTimeout(function () {
        that.setData({
          showMessage: false,
          messageContent: ''
        })
      }, 2000)
      return false;
    } else if (!(/^1[34578]\d{9}$/.test(data.phone))) {
      this.setData({
        showMessage: true,
        messageContent: '手机号码有误，请重填'
      })
      setTimeout(function () {
        that.setData({
          showMessage: false,
          messageContent: ''
        })
      }, 2000)
      return false;
    }
    if (!data.bigadr) {
      this.setData({
        showMessage: true,
        messageContent: '请选择收货人地址'
      })
      setTimeout(function () {
        that.setData({
          showMessage: false,
          messageContent: ''
        })
      }, 3000)
      return false;
    } 
    //如果有id，编辑
    if (this.data.id){
      console.log(111)
      wx.request({
        url: app._mhost + "/saveAddress?access_token=" + this.data.access_token,
        method: 'POST',
        dataType: 'json',
        data: data,
        success: function (res) {
          console.log(res);
          // wx.hideLoading();
          if (res.data.status === 0) {
            that.setData({
              showEdit: false,
              editInfo: {},
            })
            wx.navigateBack()
          } else {
            app.showToast(res.data.msg)
          }
        }
      })
    }else{
    //新增
      console.log(222)
    wx.request({
      url: app._mhost + "/saveAddress?access_token=" + this.data.access_token,
      method: 'POST',
      dataType: 'json',
      data: data,
      success: function (res) {
        console.log(res.data.data);
        // wx.hideLoading();
        if (res.data.status===0) {
          that.setData({
            showEdit: false,
            editInfo: {},
            newList: res.data.data
          })
          wx.navigateTo({
            url: '../address_out/address_out',
          })
        } else {
          app.showToast(res.data.msg)
        }
      },
      fail: function (res) {
        // wx.hideLoading();
        app.showToast("网络错误")
      },
      
    })
    }
  },
  delAddr: function (e) {
    wx.showLoading({
      'title': '提交中',
      'mask': true
    })
    var thisId = e.currentTarget.dataset.aid;
    var that = this;
    wx.request({
      url: app._mhost + "/delAddress?access_token=" + that.data.access_token,
      method: 'GET',
      data: {
        id: thisId
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.status) {
          var newList = that.data.addressList;
          delete newList[thisId];
          var hasAddr = that.data.hasAddr;
          if (util.isEmpty(newList)) {
            hasAddr = false
          }
          that.setData({
            showEdit: true,
            isAdd: false,
            editInfo: {},
            addressList: newList,
            hasAddr: hasAddr
          })
        } else {
          app.showToast(res.data.msg)
        }
      },
      fail: function (res) {
        wx.hideLoading();
        app.showToast("网络错误")
      },
      complete: function (res) { }
    })
  }, 
  tapNewAddr: function (e) {
    this.setData({
      showEdit: true,
      isAdd: true,
      pickerDefault: "请选择标签",
      bigadrDefault: "小区/写字楼/学校等",
      editInfo: {}
    })
  },
  
})