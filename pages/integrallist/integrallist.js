// pages/integral/integral.js
var app = getApp(),
    API = require('../../utils/api.js');
Page({
    data: {
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 300,
        access_token: null,
        isIndexLoad: true,
        isMore: false,
        imgUrls: 'https://pic.repaiapp.com/pic/93/63/37/936337bf032f23c3f857263538000851d40b2e79.png',
        list: [],
        nextPage: null,
        allPage: null,
        count: null,
        isEnd: false,
        mycredit: null,
        pageError: false,
        errorMsg: '',
        isCodebg: false,
        istemp: 'intergralbg',
        Ntype: '',
        type:''
    },
    onLoad: function(options) {
       var type = options.type || '';
       var access_token = app.access_token || wx.getStorageSync('access_token');
       this.setData({ access_token, type });
       if (type == '3'){
          var title = "实物专区"
       } else if (type == '4'){
          var title = "积分兑换"
       } else{
          var title = "新品上新"
       }
      //  this.setData({ type })
       wx.setNavigationBarTitle({
          title: title
       })
    },
    onShow() {
        this.setData({
            nextPage: null,
            allPage: null,
            isEnd: false,
        })
        this.getData();
    },
    onPullDownRefresh() {
        this.onShow();
    },
    onReachBottom() { //上拉加载更多
        console.log('上拉加载更多')
        this.getData();
    },
    getData() {
        var page = !!this.data.nextPage ? this.data.nextPage : 1;
        var isRest = (this.data.nextPage === null) && (this.data.allPage === null);
        if ((isRest || this.data.allPage >= this.data.nextPage) && !this.data.isEnd) {
            if (this.data.allPage >= this.data.nextPage) {
                this.setData({
                    isMore: true
                })
            }
            if (app.modeInfo.is_score == 0) {
                this.setData({ isIndexLoad: false, isCodebg: true });
                return;
            }
            API.getIntegarlIndex({ access_token: this.data.access_token, page, size: 10 ,type: this.data.type}).then((res) => {
                if (res.data.status == false) {
                    this.setData({
                        pageError: true,
                        isIndexLoad: false,
                        errorMsg: res.data.msg
                    })
                } else {
                    var data = res.data.data;
                    let { list, nextPage, allPage, count, mycredit, isEnd } = data;
                    list = isRest ? list : this.data.list.concat(list);
                    this.setData({
                        list,
                        nextPage,
                        allPage,
                        count,
                        mycredit,
                        isEnd,
                        isIndexLoad: false,
                        isMore: false,
                    })
                    wx.stopPullDownRefresh() //停止下拉刷新
                }

            }, (err) => {
                this.setData({ isIndexLoad: false, isMore: false, });
                wx.stopPullDownRefresh() //停止下拉刷新
                console.error(err);
                app.showToast('请求接口错误');
            })
        }
    },
    reback: function() {
        wx.navigateBack({ delta: 1 })
    },
    Myorder: function(){

    }
})