var app = getApp(),
isPullDown = false,
utils = require('../../utils/util.js'),
API = require('../../utils/api.js');
Page({
data: {
    //调用系统颜色
    pagecolor: {
        bgcolor: app.currentbg.bgcolor,
        textcolor: app.currentbg.textcolor
    },
    lat: null,
    lng: null,
    city: '',
    list: [],
    isLoading: true,
    isCodebg: false,
    istemp: 'nearbg',
    access_token: null,
    data: {},
    params: {},
    allList: [],
    isEnd: false,
    thisPage: 1,
    allshopcount: 0,
    pageCount: 0
},

onLoad: function(options) {

    var access_token = app.access_token || wx.getStorageSync('access_token');
    //     sycIndex = wx.getStorageSync('sycIndex') || {},
    //     lat = sycIndex.lat || null,
    //     lng = sycIndex.lng || null;
    this.setData({
        access_token,

    })
},
onShow: function() {
    var that = this,
        sycIndex = wx.getStorageSync('sycIndex') || {},
        city = sycIndex.city || '',
        adcode = sycIndex.areaid || '';
    this.setData({
        city,
        adcode
    })
    var params = {
        lat: sycIndex.lat,
        lng: sycIndex.lng,
        city: sycIndex.city,
        areaid: sycIndex.areaid,
        access_token: this.data.access_token,
        page: 1
    }
    this.getData(params);
},
calling: function(e) {
    wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.tel, //此号码并非真实电话号码，仅用于测试
    })
},
onPullDownRefresh() {
    this.setData({
        thisPage: 1
    })
    this.onShow();
    wx.stopPullDownRefresh();
},
onReachBottom() {
    if (!this.data.isEnd) {
        var parmas = this.data.params;
        console.log(parmas)
        parmas.page = this.data.thisPage + 1;
        // this.setData({ thisPage })
        this.getData(parmas)
    }
},
getData: function(params) {
    if (!!app.returnIndexTitle && !!app.returnIndexCode) {
        // this.setData({ city: app.returnIndexTitle });
        // parmas.areaid = app.returnIndexCode;
        if (!isPullDown) {
            // wx.showLoading({ title: '加载中', mask: false })
        }
    }
    this.setData({
        params
    })
    console.log(params)
    API.getNearShopList(params).then((res) => {
        const data = res.data.data;
        let {allList, isEnd, thisPage, listCount, pageCount} = res.data.data;
        allList = thisPage > 1 ? this.data.allList.concat(allList) : allList;
        this.setData({
            data,
            isLoading: false,
            allList,
            isEnd,
            thisPage,
            listCount,
            pageCount
        });
        isPullDown = false;
        wx.hideLoading()
    }, (err) => {
        this.setData({
            isLoading: false
        })
        isPullDown = false;
        wx.hideLoading()
    })
},
// goMap: function(e) {
//     var options = {
//         lng: e.currentTarget.dataset.lng,
//         lat: e.currentTarget.dataset.lat,
//         name: e.currentTarget.dataset.name,
//         address: e.currentTarget.dataset.address
//     }
//     console.log(options)
//     utils.goMap(options);
// },
reback: function() {
    wx.navigateBack({
        delta: 1
    })
}
})