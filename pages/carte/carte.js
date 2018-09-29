let app = getApp(),
  API = require('../../utils/api.js'),
  wechat = require('../../utils/wechat.js'),
  utils = require('../../utils/util.js'),
  SCROLLFALG = true,
  isLinkDetail = true,
  SCROLLTIMER = null;

Page({
  data: {
    //调用系统颜色
    pagecolor: {
      bgcolor: app.currentbg.bgcolor,
      linecolor: '#f14949',
      textcolor: app.currentbg.textcolor
    },
    menulist: [], //菜单导航
    goodsList: [], //商品列表
    scrollArray: [],
    tablesid: null, //桌号
    access_token: null, //token
    selected: 0, //tab active selected
    tSelected: 0, //tab选项卡selected
    sSelected: 0, //滚动区selected
    scrollHeight: null, //滚动区高度
    table_title: '',
    isLoading: true,
    isShowDialog: false, //是否展开弹窗
    isShowType: false, //弹窗规格
    isShowGoods: false, //弹窗商品
    goodsHasAttr: {},
    animationData: {}, //弹窗动画
    isPull: false,
    orderid: null,
    myCart: [],
    otherCart: [],
    total_price: 0,
    total_dish_count: 0,
    myCartSup: {},
    myCartSub: {},//菜品列表的缓存（为了显示已选商品的数量）
    menuCart: {}, //菜单下标-显示的数字
    isTableOrder: false,
    book_order: 0, //订单id
    book_order_count: 0,
    book_order_price: 0,
    bookstr: '',
    dialog: {
      color: app.currentbg.bgcolor,
      text: '购物车已被同桌删除',
      hidden: true
    },
    defaultDialog: {
      isShow: true,
      title: '提示',
      content: '购物车已被提交,是否前往订单详情?',
      cancelText: '取消',
      confirmText: '确认',
      color: app.currentbg.bgcolor,
    },
    detailURI: '',//详情url
    showMessage: false,
    messageContent: '',
    animationData: {},
    backRightPage: false,
    uid: '',
    counts: '',
    isFrist: true,
    panelHeight: 'auto',
    resHeight: '',
    scrollY: true,
    unicom: null,//0=>没领，1=>已领
    money: null,
    individual: null,
    ten: null,
    hundred: null,
    showBanner: true,
  },
  closeBanner() {
    this.setData({ showBanner: false });
    this.mathscrollHeight(85)
  },
  onLoad: function (options) {
    let cardInfo = wx.getStorageSync('userinfo') || ''
    isLinkDetail = true;
    console.log('----------参数-------------')
    console.log(options)
    console.log('----------参数 end----------')
    const access_token = wx.getStorageSync('access_token') || app.access_token,
      uid = wx.getStorageSync('uid') || '',
      tablesid = options.tablesid || wx.getStorageSync('tablesid');
    var res = wx.getSystemInfoSync();
    console.log(res.windowHeight)
    this.setData({ access_token, uid, isFrist: true, tablesid, resHeight: `${res.windowHeight}px`, cardInfo });

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
    this.setData({
      individual,
      ten: ten || '',
      hundred: hundred || ''
    })
  },
  onShow: function (e) {
    if (!!this.data.access_token) {
      this.getData();
    } else {
      app.checkSession((token) => {
        this.setData({ access_token: token.access_token })
        this.getData();
      })
    }
    this.spiltNum(String(this.data.cardInfo.money))
  },
  // 计算中间内容的高度 sroll菜品信息
  mathscrollHeight: function (h) {
    var res = wx.getSystemInfoSync();

    var scrollHeight = (Number(res.windowHeight) * 750 / res.windowWidth) - h -120; //150 - 124
    this.setData({
      scrollHeight: scrollHeight
    });
  },
  onHide: function () { //隐藏页面

  },
  onUnload: function () { //卸载页面
    // this.onHide()
  },
  scroll: function (e) { //tab标签滚动
    var that = this;
    if (SCROLLFALG) {
      var scrolltop = e.detail.scrollTop;
      var _array = that.data.scrollArray;
      var tSelected = that.data.tSelected;
      for (var i = 0; i < _array.length; i++) {
        if (scrolltop <= _array[i].height) {
          if (_array[i].id != tSelected) {

            that.setData({
              tSelected: _array[i].id,
              selected: _array[i].id
            })

          }
          break
        }
      }
    }
  },
  //获取页面信息   
  getData: function () {
    const parmas = {
      access_token: this.data.access_token,
      storeid: app.shopId,
      tablesid: this.data.tablesid
    };
    let myCart = wx.getStorageSync('myCart') || [],
      total_dish_count = wx.getStorageSync('total_dish_count') || 0,
      total_price = wx.getStorageSync('total_price') || 0;
    Promise.all([API.getYuDianCartegory(parmas), API.getYuDianGoodsList(parmas)]).then((res) => {
      console.log(res);
      if (res[0].data.msg == "门店暂停营业!"){
        this.setData({
          dialog: {
            color: app.currentbg.bgcolor,
            text: '本店暂停营业！如有不便敬请谅解',
            hidden: false
          },
        })
      }
      const category = res[0].data.data.category,
        tSelected = category[0].id,
        selected = tSelected, //默认选中tab
        sSelected = tSelected;
      const { list, table_title, my_order, my_order_count, my_order_price } = res[1].data.data;
      wx.setStorageSync('table_title', res[1].data.data.table_title)
      var myCartSup = {}, myCartSub = {}, menuCart = {};
      console.log(!this.data.isFrist)
      if (this.data.isFrist) { //第一次进入 && 没有数据 置空所有数据
        myCart = [];
        total_dish_count = 0;
        total_price = 0;
      } else {  // 其他情况读取缓存数据
        myCartSup = this.computedSupCart(myCart);
        myCartSub = this.computedSubCart(myCart);
        menuCart = this.computedMenu(myCart);
      }
      var detailURI = `/pages/orderDetail/orderDetail?orderid=${my_order}&tablesid=${this.data.tablesid}`;
      this.setData({
        category,
        list,
        isTableOrder: Boolean(my_order > 0),
        detailURI,
        my_order_count,
        my_order_price,
        goodsList: list,
        table_title,
        tSelected,
        sSelected,
        selected,
        myCartSup,
        menuCart,
        myCartSub,
        myCart,
        total_dish_count,
        total_price,
        isLoading: false,
        isFrist: false
      })

      if (my_order > 0) {
        this.mathscrollHeight(319)
      } else {
        this.mathscrollHeight(215)
      }
      utils.mathScroll(this);
      isLinkDetail = false;
    }, (err) => {
      this.setData({
        isLoading: false
      })
    })
  },
  touchstart: function (e) { //点击tab选项卡
    var that = this;
    SCROLLFALG = false;
    clearTimeout(SCROLLTIMER);
    this.setData({
      sSelected: e.target.dataset.current,
      selected: e.target.dataset.current
    })
  },
  touchend: function () { //点击tab结束 阻止scroll冒泡
    SCROLLTIMER = setTimeout(function () {
      SCROLLFALG = true;
    }, 500)

  },
  tapBtnMiu: function (e) { //点击初始化减少按钮
    var isAttr = e.currentTarget.dataset.isattr || false;
    const tempid = e.currentTarget.dataset.tempid,
      menuId = e.currentTarget.dataset.menuid,
      goodsid = e.currentTarget.dataset.goodsid,
      storeid = app.shopId,
      access_token = this.data.access_token,
      type = 1, //添加2
      uid = this.data.uid,
      tablesid = this.data.tablesid;
    let tid = !!tempid ? tempid : e.currentTarget.dataset.goodsid,
      parmas = { storeid, type, tid, tablesid, uid, access_token };


    if (isAttr) {
      utils.showMessage(this, '多规格商品只能去购物册车删除哦');
      return;
    } else {
      this.minNum(menuId, goodsid, tid)
    }
  },
  tapadd: function (e) { //点击初始化添加按钮
    const tempid = e.currentTarget.dataset.tempid,
      menuId = e.currentTarget.dataset.menuid,
      goodsid = e.currentTarget.dataset.goodsid,
      storeid = app.shopId,
      access_token = this.data.access_token,
      type = 2, //添加2
      uid = this.data.uid,
      tablesid = this.data.tablesid;
    let tid = !!tempid ? tempid : goodsid;
    this.addNum(menuId, goodsid, tid)
  },
  addTypeCart: function (e) { //多规格添加
    const menuId = e.currentTarget.dataset.menuid,
      goodsHasAttr = this.data.goodsHasAttr,
      access_token = this.data.access_token,
      storeid = app.shopId,
      type = 2, //添加
      _specs = goodsHasAttr._specs.hasOwnProperty('selected') ? goodsHasAttr._specs.selected : 0;

    let tid = `${goodsHasAttr.id}_${_specs}`;

    goodsHasAttr['attr'].map((item) => {
      var temp = item.hasOwnProperty('index') ? item.index : 0;
      tid += `_${temp}`;
    })
    this.addNum(menuId, goodsHasAttr.id, tid);
    this.closeType();
  },
  showPullCart: function () { //展示上拉购物车
    if (this.data.total_dish_count > 0) {
      this.setData({
        isPull: !this.data.isPull
      })
    }
  },
  closePullCart: function () { //关闭上拉购物车
    this.setData({
      isPull: false
    })
  },
  clearCart: function () { //清空购物车
    const config = {
      title: '提示',
      content: '确认全部清空么？',
    };
    const total_price = 0,
      total_dish_count = 0,
      myCartSup = {},
      myCartSub = {};
    wechat.showModal(config).then((res) => {
      if (res.confirm) {
        this.setData({
          total_price,
          total_dish_count,
          myCartSup,
          myCartSub
        })
        wx.removeStorageSync('myCart')
        wx.removeStorageSync('total_dish_count')
        wx.removeStorageSync('total_price')
        this.ajaxClearCart();
        this.closePullCart();
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    })
  },
  ajaxClearCart() { //是否清空购物车？
    this.setData({
      myCartSup: {},
      myCartSub: {},
      myCart: [],
      menuCart: {},
      total_dish_count: 0,
      total_price: 0
    })
  },
  goCreateOrder: function () { //跳转到创建订单页面
    if (this.data.total_dish_count > 0) { //购物车数量大于0时才让提交
      // wx.setStorageSync('myCartSup', this.data.myCartSup);
      // wx.setStorageSync('myCartSub', this.data.myCartSub);
      wx.setStorageSync('myCart', this.data.myCart);
      wx.setStorageSync('total_dish_count', this.data.total_dish_count);
      wx.setStorageSync('total_price', this.data.total_price);
      this.closePullCart();
      wx.navigateTo({
        url: '/pages/createOrder/createOrder?tablesid=' + this.data.tablesid + '&storeid=' + app.shopId
      })
    }
  },
  closediv: function () {
    var isTableOrder = this.data.isTableOrder;
    isTableOrder = false;
    this.setData({
      isTableOrder
    })
    this.mathscrollHeight(215);
  },
  /**
   * show 商品放大弹窗
   */
  showScale: function (e) { //展示商品放大弹窗
    this.dialogScale();
    let meunId = e.currentTarget.dataset.menuid, //获取菜单Id
      goodsId = e.currentTarget.dataset.goodsid, //获取商品ID
      goodsInfo = this.data.goodsList[meunId][goodsId];

    goodsInfo["menuId"] = meunId;
    this.setData({
      isShowDialog: true,
      isShowGoods: true,
      goodsHasAttr: goodsInfo,
      panelHeight: this.data.resHeight,
      scrollY: false
    })
  },
  /**
   * show 商品类型弹窗
   */
  showDialogType: function (e) { //显示类型弹窗
    this.dialogScale();
    let meunId = e.currentTarget.dataset.menuid, //获取菜单Id
      goodsId = e.currentTarget.dataset.goodsid, //获取商品ID
      goodsInfo = this.data.goodsList[meunId][goodsId];

    goodsInfo["menuId"] = meunId;
    this.setData({
      isShowType: true,
      isShowDialog: true,
      goodsHasAttr: goodsInfo,
      panelHeight: this.data.resHeight,
      scrollY: false
    })
  },
  changeSpecs: function (e) { // 改变规格（弹窗）
    var id = e.currentTarget.dataset.id,
      money = e.currentTarget.dataset.money,
      goodsId = e.currentTarget.dataset.goodsid,
      menuId = e.currentTarget.dataset.menuid,
      goodsList = this.data.goodsList,
      goodsHasAttr = this.data.goodsHasAttr;
    goodsList[menuId][goodsId]._specs.selected = id;
    goodsHasAttr._specs.selected = id;
    goodsList[menuId][goodsId].marketprice = money;
    goodsHasAttr.marketprice = money;
    goodsList[menuId][goodsId].specs_name = goodsHasAttr._specs.items[id].specs_name;
    goodsHasAttr.specs_name = goodsHasAttr._specs.items[id].specs_name;
    this.setData({
      goodsHasAttr: goodsHasAttr,
      goodsList: goodsList
    })
  },
  closeType: function () {
    this.tapDialogMark();
  },
  changeGoodsAttr: function (e) { //改变属性（弹窗）
    var index = e.currentTarget.dataset.index,
      selectedIndex = e.currentTarget.dataset.sindex,
      value = e.currentTarget.dataset.value,
      goodsId = e.currentTarget.dataset.goodsid,
      menuId = e.currentTarget.dataset.menuid,
      goodsHasAttr = this.data.goodsHasAttr,
      goodsList = this.data.goodsList;
    goodsList[menuId][goodsId]["attr"][index].selected = value;
    goodsList[menuId][goodsId]["attr"][index].index = selectedIndex;
    goodsHasAttr.attr[index].selected = value;
    goodsHasAttr.attr[index].index = selectedIndex;
    this.setData({
      goodsHasAttr: goodsHasAttr,
      goodsList: goodsList
    })
  },
  dialogScale: function () {
    var animation = wx.createAnimation({
      duration: 400,
      // transformOrigin: "-50% -50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    animation.scale(1, 1).step();
    this.setData({
      animationData: animation.export()
    })
  },
  dialogCloseScale: function () {
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })
    this.animation = animation;
    animation.scale(.5, .5).step()
    this.setData({
      animationData: animation.export(),
      scrollY: true
    })
  },
  /**
   * 关闭弹窗
   */
  tapDialogMark: function () {
    this.setData({
      isShowDialog: false,
      isShowType: false,
      isShowGoods: false,
      panelHeight: 'auto',
      scrollY: true
    })
    this.dialogCloseScale();
  },
  dialogAddCart: function (e) { //点击添加弹窗加入购物车
    const falg = e.currentTarget.dataset.isattr,
      goodsid = e.currentTarget.dataset.goodsid,
      tid = !!e.currentTarget.dataset.tempid ? e.currentTarget.dataset.tempid : goodsid,
      menuId = e.currentTarget.dataset.menuid,
      storeid = app.shopId,
      access_token = this.data.access_token,
      type = 2, //添加2
      tablesid = this.data.tablesid;

    if (falg) {
      this.setData({
        isShowGoods: false,
        isShowType: true,
      })

    } else {
      this.setData({
        isShowGoods: false,
        isShowDialog: false,
      })
      this.addNum(menuId, goodsid, tid);
      this.dialogCloseScale();
    }
  },
  computedMenu(data) { // 计算菜单下标
    var json = {};
    data.map((item) => {
      if (json.hasOwnProperty(item.pcate)) {
        json[item.pcate] = Number(json[item.pcate]) + Number(item.total);
      } else {
        json[item.pcate] = item.total;
      }
    })
    return json;
  },
  computedSupCart(data) {
    var json = {};
    data.map((item) => {
      console.log(item)
      json[item.tid] = item;
    })
    return json;
  },
  computedSubCart(data) {
    var json = {};
    data.map((item) => {
      json[item.goodsid] = item;
    })
    return json;
  },
  addNum(menuId, goodsid, tid) {
    const goodsList = this.data.goodsList;
    let myCartSup = this.data.myCartSup,
      total_dish_count = this.data.total_dish_count,
      total_price = this.data.total_price,
      myCart = [],
      myCartSub = this.data.myCartSub,
      menuCart = {},
      _specs = goodsList[menuId][goodsid]._specs.items,
      curGoods = goodsList[menuId][goodsid];
      var tid = tid;
      var specsName;
      var marketprice;
    total_dish_count = Number(total_dish_count) + 1;
    if (_specs){
      tid = tid.split('_')
      total_price = (Number(total_price) + Number(_specs[tid[1]].marketprice)).toFixed(2);
      specsName = _specs[tid[1]].specs_name
      marketprice = _specs[tid[1]].marketprice
    }else{
      total_price = (Number(total_price) + Number(curGoods.marketprice)).toFixed(2);
      specsName = curGoods.specs_name
      marketprice = curGoods.marketprice
    }
    if (tid instanceof Array){
      tid = tid.join('_')
    }
    // total_price = (Number(total_price) + Number(curGoods.marketprice)).toFixed(2);
    if (myCartSup.hasOwnProperty(tid)) {
      myCartSup[tid].total++;
    } else {
      curGoods.total = 1;
      curGoods.per_price = marketprice;
      curGoods.price = marketprice;
      curGoods.specs_name = specsName;
      curGoods.goodsid = goodsid;
      curGoods.tid = tid;
      if (curGoods.attr.length > 0) {
        var temp = '';
        curGoods.attr.map((item) => {
          temp += ',' + item.selected;
        })
        curGoods.attr_name = temp;
      } else {
        curGoods.attr_name = '';
      }
      myCartSup[tid] = curGoods;
    }

    if (myCartSub.hasOwnProperty(goodsid)) {
      myCartSub[goodsid].total++;
    } else {
      curGoods.total = 1;
      curGoods.per_price = marketprice;
      curGoods.price = marketprice;
      curGoods.goodsid = goodsid;
      curGoods.tid = tid;
      if (curGoods.attr.length > 0) {
        var temp = '';
        curGoods.attr.map((item) => {
          temp += ',' + item.selected;
        })
        curGoods.attr_name = temp;
      } else {
        curGoods.attr_name = '';
      }
      myCartSub[goodsid] = curGoods;
    }

    for (var index in myCartSup) {
      myCart.push(myCartSup[index]);
    }
    menuCart = this.computedMenu(myCart);
    this.setData({
      myCartSup,
      myCartSub,
      myCart,
      total_dish_count,
      total_price,
      menuCart
    })
  },
  minNum(menuId, goodsid, tid) {
    const goodsList = this.data.goodsList;
    let myCartSup = this.data.myCartSup,
      myCartSub = this.data.myCartSub,
      total_dish_count = this.data.total_dish_count,
      total_price = this.data.total_price,
      isPull = this.data.isPull,
      myCart = [],
      menuCart = {},
      _specs = goodsList[menuId][goodsid]._specs.items,
      curGoods = goodsList[menuId][goodsid];
    total_dish_count = total_dish_count < 1 ? 0 : total_dish_count - 1;
    isPull = total_dish_count == 0 ? false : isPull;

    if (_specs) {
      tid = tid.split('_')
      total_price = (total_dish_count < 1 ? 0 : (total_price - _specs[tid[1]].marketprice) - Number(_specs[tid[1]].packvalue)).toFixed(2);
    } else {
      total_price = (total_dish_count < 1 ? 0 : (total_price - curGoods.marketprice) - Number(goodsList[menuId][goodsid].packvalue)).toFixed(2);
    }
    if (tid instanceof Array){
      tid = tid.join('_')
    }
    // total_price = total_dish_count < 1 ? 0 : (total_price - curGoods.marketprice).toFixed(2);
    if (myCartSup.hasOwnProperty(tid)) {
      if (myCartSup[tid].total > 1) {
        myCartSup[tid].total--;
      } else {
        delete myCartSup[tid];
      }

    }

    if (myCartSub.hasOwnProperty(goodsid)) {
      if (myCartSub[goodsid].total > 1) {
        myCartSub[goodsid].total--;
      } else {
        delete myCartSub[goodsid];
      }

    }

    for (var index in myCartSup) {
      myCart.push(myCartSup[index]);
    }
    menuCart = this.computedMenu(myCart);
    this.setData({
      myCartSup,
      myCartSub,
      myCart,
      total_dish_count,
      total_price,
      menuCart,
      isPull
    })
  },

  iKown() {
    let dialog = this.data.dialog;
    dialog.hidden = true;
    this.setData({
      dialog
    })
  },
  showComfirmDialog(data) {
    if (data.submitorder) {
      const tablesid = this.data.tablesid;
      let defaultDialog = this.data.defaultDialog;
      defaultDialog.isShow = false;

      const detailURI = `/pages/orderDetail/orderDetail?orderid=${data.orderid}&tablesid=${tablesid}`
      this.setData({
        defaultDialog,
        detailURI
      })
    }

  },
  dialogCancel() { // 点击对话框 取消
    let defaultDialog = this.data.defaultDialog;
    defaultDialog.isShow = true;
    this.setData({
      defaultDialog
    })
  },
  dialogSuccess() { //点击对话框 确认
    wx.navigateTo({
      url: this.data.detailURI
    })
    this.dialogCancel();
  },
  goDetail() {
    // this.setData({ isFrist: true });
    wx.navigateTo({
      url: this.data.detailURI
    })
  },
  // 关闭大王卡弹窗
  closeKingModal() {
    this.setData({
      cardInfo:{
        uncion: 1,
        money: 0
      }
    });
  },
})