var app = getApp(), API = require('../../utils/api.js');
Page({
    data: {
        isLoading: true,
        orderList: [],
        isMore: false,
        nextPage: null,
        allPage: null,
        isEnd: false,
        page: 1,
        tabIdx:'1',
        scrollHeight:0,
        toggleTxt: '查看更多',
        tempGoodsList: [], // 商品列表
        isShowMore: true,
        isToggle: false, //是否展示更多
        flag:''
    },
    onLoad: function (options) { 
      this.mathscrollHeight(100);
    },
    onShow: function () {
      var phone = wx.getStorageSync('storetel');
      this.setData({ isEnd: false });
      var flag = wx.getStorageSync("flag") || '';
      if (flag != '') {
        this.setData({
          flag: flag,
          phone
        });
      }
      this.getData(this.data.flag);
    },
    // onHide(){
    //     this.setData({ tabIdx:0});
    // },
    onPullDownRefresh: function () {
        this.setData({ page: 1, isEnd: false });
        this.getData();
        wx.stopPullDownRefresh();
    },
    // 上拉加载
    onReachBottom: function () {
        var page = this.data.page;
        if (!this.data.isEnd) {
            page = Number(page) + 1;
            this.setData({ page, isMore: false })
            this.getData();
        }
    },
    telShopper(e){
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.phone
      })
    },
    // 获取订单列表数据
    getData(dining_mode =this.data.flag) {
        if (!this.data.isEnd) {
            var access_token = wx.getStorageSync('access_token'), page = this.data.page;
            API.getAllOrderList({ access_token, page, dining_mode }).then((res) => {
                let { list,  isEnd, nowPage, allPage } = res.data.data;
                list = this.data.orderList.length > 0 && nowPage != 1 ? this.data.orderList.concat(list) : list;
                var isMore = true;
                if (nowPage == allPage) {
                    isMore = false
                }
                this.setData({ 
                orderList: list, 
                isEnd, 
                isLoading: false,
                page: nowPage,
                isMore 
                  })
            }, (err) => {
            })
        }
    },
  // 计算中间内容的高度 sroll
  mathscrollHeight: function (h) {
    var res = wx.getSystemInfoSync();

    var scrollHeight = (Number(res.windowHeight) * 750 / res.windowWidth) - h; //150 - 124
    this.setData({
      scrollHeight: scrollHeight
    });
  },
    // tab切换
  changeTab(e){
    let flag = e.currentTarget.dataset.flag;
    wx.setStorageSync('flag', e.currentTarget.dataset.flag);
    // console.log(flag)
    this.setData({tabIdx:flag});
    
    this.setData({ isEnd: false });
    this.getData(flag)
  },

  //跳转到自提订单详情页
    goDetails(e) {
        wx.navigateTo({
          url: "/pages/oCarteDetail/oCarteDetail?orderid=" + e.currentTarget.dataset.id + "&tablesid=" + e.currentTarget.dataset.tablesid
        })
    },
   
    showMoreGoods: function () { //展示更多列表
        var list = this.data.orderList,
            goodsList = this.data.isToggle ? list.slice(0, 3) : list,
            toggleTxt = this.data.isToggle ? '查看更多' : '折叠列表';
        this.setData({
            tempGoodsList: goodsList,
            isShowMore: false,
            isToggle: !this.data.isToggle,
            toggleTxt: toggleTxt
        })
    },
}) 