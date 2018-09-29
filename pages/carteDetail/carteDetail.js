var app = getApp(),
  API = require('../../utils/api.js'),
  wechat = require('../../utils/wechat.js'),
  utils = require('../../utils/util.js');
Page({
  data: {
    access_token: null,
    //调用系统颜色
    pagecolor: {
      bgcolor: app.currentbg.bgcolor,
      textcolor: app.currentbg.textcolor,
      linecolor: '#f14949',
    },
    peoplenumber: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], //人数数组
    maxpeople: 20, //后台传最多人数
    // peopletrue: 0, //已选择人数
    selected: 0,
    remark: '', //备注
    orderid: '', //订单id
    dialogTitle: '请选择用餐人数', //选择人数抬头
    isLoading: true,
    newList: {},
    myCart: [],
    shopname: '',
    addCartNums: 0,
    total_dish_count: 0,
    total_price: 0,
    isHidden: true,
    counts: 0,
    showMore: true,
  },
  onLoad: function (options) {
    // app.checkSession();
    const access_token = wx.getStorageSync('access_token') || app.access_token,
      total_dish_count = wx.getStorageSync('total_dish_count') || 0,
      myCart = wx.getStorageSync('myCart') || {},
      tablesid = options.tablesid || wx.getStorageSync('tablesid');
    console.log(tablesid)
    this.setData({ access_token, myCart, tablesid, total_dish_count });
  },
  onShow: function () {
    this.getData();
  },
  onPullDownRefresh() {
    this.onShow();
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  shownumber: function () { //点击更多显示更多人数
    var that = this
    var show = that.data.show
    var num = that.data.maxpeople
    var peoplenumber = that.data.peoplenumber
    for (var i = 12; i <= num; i++) {
      peoplenumber.push(i)
      that.setData({
        peoplenumber: peoplenumber
      })
    }

    this.setData({ //隐藏更多按钮
      show: false
    })
  },
  getData: function () { //获取数据
    const access_token = this.data.access_token,
      total_dish_count = wx.getStorageSync('total_dish_count') || 0,
      total_price = wx.getStorageSync('total_price') || 0,
      myCart = wx.getStorageSync('myCart') || [],
      parmas = {
        access_token: access_token,
        storeid: app.shopId,
        tablesid: this.data.tablesid
      },
      table_title = wx.getStorageSync('table_title'),
      dummyNum = table_title.split('-')[1];

    console.log(myCart)
    API.getCreatOrder(parmas).then((res) => {
      const { category, shopname } = res.data.data;
      const { order, order_people } = res.data.data.order;
      let newList = {},
        orderid = order,
        counts = order_people;
      myCart.map((item, index) => {
        console.log('item', item)
        console.log('index', index)
        if (item.specs == 0) {
          item.specs_name = '';
        }

        if (category.hasOwnProperty(item.pcate)) {
          if (newList.hasOwnProperty(item.pcate)) {
            newList[item.pcate].category.total = Number(newList[item.pcate].category.total) + Number(item.total);
            newList[item.pcate].items.push(item)
          } else {
            newList[item.pcate] = {};
            newList[item.pcate].category = {};
            newList[item.pcate].category.total = item.total;
            newList[item.pcate].category.name = category[item.pcate];
            newList[item.pcate].items = [];
            newList[item.pcate].items.push(item);
          }
        }

      })

      this.setData({ newList, shopname, dummyNum, isLoading: false, myCart, total_dish_count, total_price, orderid, counts })
    }, (err) => {
      console.log('创建订单页面获取数据失败${err}');
    })
  },
  tapBtnMiu: function (e) { //点击初始化减少按钮
    var menuId = e.currentTarget.dataset.menuid,
      tid = e.currentTarget.dataset.tid,
      idx = e.currentTarget.dataset.index;

    var newList = this.data.newList,
      myCart = this.data.myCart,
      total_dish_count = this.data.total_dish_count,
      total_price = this.data.total_price;


    total_dish_count = Number(total_dish_count) - 1;
    total_price = (Number(total_price) - Number(newList[menuId].items[idx].per_price)).toFixed(2);

    console.log(newList[menuId].category.total)
    if (newList[menuId].items[idx].total > 1) {
      newList[menuId].items[idx].total = Number(newList[menuId].items[idx].total) - 1;
    } else {
      newList[menuId].items.splice(idx, 1);
    }

    if (newList[menuId].category.total > 1) {
      newList[menuId].category.total = Number(newList[menuId].category.total) - 1;
    } else {
      delete newList[menuId];
    }


    myCart.map((item, index) => {
      if (item.tid == tid) {
        console.log(myCart[index].total)
        if (myCart[index].total > 1) {
          myCart[index].total = Number(myCart[index].total) - 1;
          myCart[index].price = myCart[index].total * myCart[index].per_price;
        } else {
          myCart.splice(index, 1);
        }
      }
    })

    wx.setStorageSync('myCart', myCart);
    wx.setStorageSync('total_dish_count', total_dish_count);
    wx.setStorageSync('total_price', total_price);
    this.setData({ newList, total_dish_count, total_price })
  },
  tapadd: function (e) { //点击初始化添加按钮
    var menuId = e.currentTarget.dataset.menuid,
      tid = e.currentTarget.dataset.tid,
      idx = e.currentTarget.dataset.index;

    var newList = this.data.newList,
      myCart = this.data.myCart,
      total_dish_count = this.data.total_dish_count,
      total_price = this.data.total_price;

    newList[menuId].category.total = Number(newList[menuId].category.total) + 1;
    newList[menuId].items[idx].total = Number(newList[menuId].items[idx].total) + 1;
    newList[menuId].items[idx].price = (newList[menuId].items[idx].total * newList[menuId].items[idx].per_price).toFixed(2);
    total_dish_count = Number(total_dish_count) + 1;
    total_price = (Number(total_price) + Number(newList[menuId].items[idx].per_price)).toFixed(2);

    myCart.map((item, index) => {
      if (item.tid == tid) {
        myCart[index].price = myCart[index].total * myCart[index].per_price;
        myCart[index].total = Number(myCart[index].total) + 1;
      }
    })

    wx.setStorageSync('myCart', myCart);
    wx.setStorageSync('total_dish_count', total_dish_count)
    wx.setStorageSync('total_price', total_price)
    this.setData({ newList, total_dish_count, total_price })
  },
  shownumber: function () { //点击更多显示更多人数
    var that = this
    var show = that.data.show
    var num = that.data.maxpeople
    var peoplenumber = that.data.peoplenumber
    for (var i = 12; i <= num; i++) {
      peoplenumber.push(i)
      that.setData({
        peoplenumber: peoplenumber
      })
    }

    this.setData({ //隐藏更多按钮
      showMore: false
    })
  },
  clickpeople: function (e) { //选择人数
    var thisid = e.target.dataset.id
    this.setData({ changeNum: thisid })
  },
  tcpeople: function () { //点击立即下单弹出层
    this.setData({ isHidden: false, wHeight: this.data.windowHeight })
  },
  tcfalse: function () { //点击取消或者遮罩关闭层
    this.setData({ isHidden: true, wHeight: 'auto' });
  },
  tapYes() { //点击确定选择人数
    const changeNum = this.data.changeNum,
      order_people = this.data.order_people;
    if (changeNum > 0) {
      this.setData({ counts: changeNum });
      this.tcfalse();
      if (!(order_people > 0)) {
        this.createdOrder();
      }
    } else {
      this.setData({ changeNum: 0, })
    }
  },
  bindRemarkInput: function (e) { //输入备注
    this.setData({
      remark: e.detail.value
    })
  },
  createdOrder() { //创建订单
    const access_token = this.data.access_token,
      storeid = app.shopId,
      counts = this.data.counts,
      orderid = this.data.orderid,
      allCart = this.data.myCart,
      tablesid = this.data.tablesid,
      remark = this.data.remark;

    // // console.log(this.data.addCartNums < 0 || counts <= 0)
    // if (counts <= 0) {
    //    this.tcpeople();
    //    return;
    // }

    var parmas = {};
    if (!!orderid) {
      parmas = { access_token, storeid, allCart, remark, counts, orderid, tablesid }
    } else {
      parmas = { access_token, storeid, allCart, remark, counts, tablesid }
    }

    API.submitYuDingOrder(parmas).then((res) => {
      if (res.data.status) {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        prevPage.setData({ isFrist: true, isLoading: true });
        wx.removeStorageSync('myCart');
        wx.removeStorageSync('total_dish_count');
        wx.removeStorageSync('total_price');
        wx.redirectTo({
          // url: `/pages/ordering/ordering?type=yuding&orderid=${res.data.data.orderid}`
          url: `/pages/ordering/ordering?type=diancan&orderid=${res.data.data.orderid}&tablesid=${this.data.tablesid}`
        })
      } else {
        utils.showMessage(this, res.data.msg);
      }
    }, (err) => {
      utils.showMessage(this, '提交数据错误');
    })
  },
  backCarte() { //点击底部知道了
    wx.navigateBack({
      delta: 1
    })
  }
})
