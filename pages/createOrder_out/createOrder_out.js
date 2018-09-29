var app = getApp(),
  utils = require('../../utils/util.js'),
  OLDAPI = require('../../utils/wmapi.js'),
  API = require('../../utils/api.js');
Page({
  data: {
    //调用系统颜色
    pagecolor: {
      bgcolor: '#f14949',
      textcolor: app.currentbg.textcolor
    },
    istabCoupon: null,
    peoplenumber: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], //人数数组
    maxpeople: 20, //后台传最多人数
    hidden: false,
    isHidden: true,
    isTitle: true,
    access_token: null,
    tablesid: -2,
    orderid: '',
    orderInfo: {}, //订单详情
    tempGoodsList: [], // 商品列表
    isShowMore: true,
    isToggle: false, //是否展示更多
    toggleTxt: '查看更多',
    isLoading: true,
    isSuccess: false,    //支付成功弹窗Boolean
    orderItems: {}, //支付成功信息数据
    paysale: '10',//优惠券
    scorecheck: true, //积分抵扣开启按钮
    saledia: false,//打开折扣弹窗
    showMessage: false, //提示
    messageContent: '', //提示文字
    switchChecked: true,
    payMoney: 0, //支付金额
    isBalancePayment: false,
    saleMoney: 0,
    d_type: '',
    detailURI: '',
    detMoney: '',
    address: '',//收货地址
    dialog: {
      title: '',
      color: app.currentbg.bgcolor,
      text: '购物车已被同桌删除',
      textAlign: 'left',
      hidden: true
    },
    defaultDialog: {
      isShow: true,
      title: '',
      content: '购物车已被提交,是否前往订单详情?',
      cancelText: '取消',
      confirmText: '确认',
      color: app.currentbg.bgcolor,
    },
    uid: null,
    saleDialog: {
      color: app.currentbg.bgcolor,
      items: {}
    },
    successData: {},
    cardstatue: null,
    isCheckPoint: false,
    total_price: '',//总额
    total_dish_count: '',
    orderInfo: '',
    pointsNum: 0,
    remainMoney: 0,
    _remainMoney: 0,
    _pointMoney: 0,
    pointMoney: 0,
    noticeMsgNomal: "",
    noticeMsgWarring: '',
    couponMoney: '',            //选中优惠券金额
    couponMsg: '',              //选中优惠券提示文字
    isComeCoupon: false,        //Boolean优惠券页面回来
    coupon_record_id: null,     //优惠券微信id
    card_id: null,              //优惠券主键id
    sendPoints: 0,               //送积分
    isShowOtherPayDialog: false,  //其他支付弹窗
    subMoney: 0,                   //减去折扣后的金额
    orderCarte: true,//是否自提详情
    wkIdx: 0,//自提时间左侧index
    showTime: false,//控制时间弹窗mask
    addmyCart: [],
    ztTime: '',
    isTime: false, //选择时间
    pickerTimeList: [], //总时间数据
    pickerTimeIndex: 0, //选择时间对应下标
    pickerTimeRight: [], //选择下标对应时间列表
    pickerTimeRightIndex: null, //时间列表选中下标
    newList: {},
    storetename: '',
    allPrice: '',
    unicom: null,
    money: null,
    packvalue: 0,
    newpscost: 0
  },
  onLoad: function (options) {
    console.log(options, 'options')
    var uid = wx.getStorageSync('uid') || '',
      storetename = wx.getStorageSync('storetename') || '',
      access_token = app.access_token || wx.getStorageSync('access_token'),
      fontColor,
      bgColor,
      xz = options.xz || '',
      xb = options.xb || '',
      orderid = options.orderid || '',
      navBarTitle = '';
    this.setData({
      storetename: storetename,
      orderid
    })
    // console.log(this.data.storetename, 'store')
    if (!xz) {
      fontColor = '#ffffff';
      bgColor = '#f14949';
      navBarTitle = '订单详情';
    } else {
      fontColor = '#000000';
      bgColor = '#ffffff';
      navBarTitle = '向商家付款';
    }
    this.setData({
      xz,
      xb
    });
    wx.setNavigationBarColor({
      frontColor: fontColor,
      backgroundColor: bgColor,
    })
    wx.setNavigationBarTitle({ title: navBarTitle, })
    this.setData({
      access_token: access_token,
      uid,

    })

  },
  onShow: function () {
    // this.setData({ pointMoney: 0, remainMoney: 0, isCheckPoint: false, isBalancePayment: false })
    this.getData();
    this.userinfo()
  },
  cateCoupon() {
    wx.navigateTo({
      url: '/pages/getKingCoup/getKingCoup',
    })
  },
  closeCoupon() {
    // console.log(1)
    this.setData({
      unicom: 1,
      money: 0
    })
  },
  onPullDownRefresh() {
    this.onShow();
    this.funcPayMoney();
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  //是否开始积分抵扣
  scorecheck: function () {
    this.setData({ scorecheck: !this.data.scorecheck })
  },
  salehint: function () {
    this.setData({ saledia: !this.data.saledia })
  },
  switch2Change: function (e) { //是否使用会员折扣
    var orderInfo = this.data.orderInfo;
    var payMoney = e.detail.value ? Number(Number(orderInfo.totalprice) - Number(orderInfo.totalprice * this.data.mem_discount)).toFixed(2) : orderInfo.totalprice;
    this.setData({ switchChecked: e.detail.value, payMoney })
  },
  userinfo() {
    var userinfo = wx.getStorageSync('userinfo')
    this.setData({
      isVip: userinfo.isVip,
      money: userinfo.money,
      unicom: userinfo.unicom
    })
    // console.log(this.data.isVip, this.data.money, this.data.unicom)
  },
  getData: function () { //获取数据
    let access_token = this.data.access_token,
      total_dish_count = wx.getStorageSync('shopInfo').total_dish_count || 0,
      packvalue = wx.getStorageSync('shopInfo').packvalue || 0,
      total_price = wx.getStorageSync('shopInfo').total_price || 0,
      myCart = wx.getStorageSync('shopInfo').myCart || [],
      is_show = wx.getStorageSync('is_show'),
      parmas = {
        access_token: access_token,
        storeid: app.shopId,
        totalprice: parseInt(total_price),
      },
      table_title = wx.getStorageSync('table_title'),
      dummyNum = table_title.split('-')[1];
    var couponPrice;
    couponPrice = Number(total_price).toFixed(2); //无会员的时候 菜品价格  - 会员价格  + 配送价格
    console.log(couponPrice);
    var allPrice = Number(total_price) - Number(packvalue);
    parseInt(packvalue);
    this.setData({
      newList: myCart,
      total_price: total_price,
      total_dish_count: total_dish_count,
      packvalue,
      is_show
    })
    OLDAPI.getCreatOrder(parmas).then((res) => {
      // console.log(res.data, 'resresres')
      var _tempGoodsList = myCart.slice(0, 3);
      var newpscost = Number(res.data.data.deaddress.newpscost) ? Number(res.data.data.deaddress.newpscost) : 0,
        goodsCost = (Number(newpscost) + Number(total_price)).toFixed(2);
      this.setData({
        isLoading: false,
        orderInfo: res.data.data,
        mem_discountStr: res.data.data.mem_discount * 10,
        address: res.data.data.deaddress,
        newpscost,
        goodsCost
      })
      var result = res.data.data,
        saleDialog = this.data.saleDialog;
      this.canps(result)
      var canps = this.canps(result);
      result.items = result.list;
      const { msg } = result.memberInfo;
      saleDialog.items = msg;
      // console.log(result, 'result')
      var mem_discount = !!result.mem_discount ? (1 - result.mem_discount).toFixed(2) : result.mem_discount;

      if (result.is_vip == 1 && !!result.mem_discount) {
        myCart.map((item) => {
          item.sale_pay = Number(item.price * mem_discount).toFixed(2);
        })
      }
      this.setData({
        mem_discount,
        canps
      })

      //会员卡这款金额
      if (result.cardstatue) {
        var saleMoney = utils.myToFixed(allPrice * mem_discount);
        var detMoney = allPrice - saleMoney;
        couponPrice = Number(total_price - saleMoney).toFixed(2);//有会员的时候 菜品价格  + 会员价格  - 配送价格
        console.log(couponPrice, saleMoney, total_price, packvalue)
        this.setData({ saleMoney, detMoney })
      }
      this.funcPayMoney();

      this.setData({ couponPrice: Number(couponPrice) })
      if (result.cardstatue) {
        this.funCoupon();
      }
      // console.log(this.data.payMoney, 'payMoney')

    }, (err) => {
      // console.log('创建订单页面获取数据失败${err}');
    })
  },
  canps(data) {
    console.log(data.deaddress.canps)
    let canps = data.deaddress.canps;
    if (canps == 0) {
      wx.showModal({
        title: '提示',
        content: '超出商家配送范围',
      })
    }
    return canps
  },
  iKown() { //弹窗知道了
    let dialog = this.data.dialog;
    dialog.hidden = true;
    this.setData({ dialog });

  },
  closeDialog() {
    let defaultDialog = this.data.defaultDialog;
    defaultDialog.isShow = true;
    this.setData({
      defaultDialog
    })
  },
  dialogSuccess() {
    this.closeDialog();
    wx.redirectTo({
      url: detailURI
    })
  },
  dialogCancel() {
    this.closeDialog();
    this.getData();
  },
  /**
   * 判断支付条件 payMoneyd大于零吊起微信支付 || 其他支付弹窗
   */
  sendPayNow() {
    if (this.data.is_show == 0) {
      // wx.showModal({
      //   title: '提示',
      //   content: '本店已打烊',
      // })
      var dialog = this.data.dialog;
      dialog.hidden = false;
      dialog.text = '本店不在营业时间中~';
      this.setData({ dialog });
      return
    }
    if (this.data.canps == 0) {
      wx.showModal({
        title: '提示',
        content: '超出商家配送范围',
      })
      return
    }
    // console.log(this.data.counts, 9)
    if (this.data.address == '' && this.data.tablesid == -2) {
      wx.showToast({
        title: '请选择收货地址',
        icon: "none"
      })
    } else {
      if (this.data.counts == '') {
        wx.showToast({
          title: '请选择用餐人数',
          icon: "none"
        })

      } else {

        this.createdOrder()
      }
    }
  },
  /**
   * 其他支付弹窗
   */
  showOtherPayDialog() {
    setTimeout(() => {
      wx.hideLoading();
      this.setData({ isShowOtherPayDialog: true })
    }, 1000);
  },
  /**
   * 
   */
  closeOtherPayDialog() {
    this.setData({ isShowOtherPayDialog: false })
  },
  /**
   * 点击其他支付弹窗 确认按钮
   */
  tapOtherPay() {

    this.closeOtherPayDialog();
    this.payNow();
    wx.showLoading({ title: '虚拟支付中', mask: true })
  },
  /**
   * 立即支付
   */
  payNow: function () { //立即支付
    var that = this,
      access_token = this.data.access_token,
      orderid = this.data.orderid,
      type = this.data.switchChecked ? 1 : 0, //是否有折扣
      money = this.data.isBalancePayment && this.data.remainMoney > 0 ? this.data.remainMoney : 0, //455.47
      credit = this.data.isCheckPoint && this.data.pointsNum > 0 ? this.data.pointsNum : 0, //41.81
      card_id = this.data.card_id,
      coupon_record_id = this.data.coupon_record_id,
      tablesid = this.data.tablesid,
      parmas1 = {
        meal_time: '',
        orderid,
        access_token,
        tablesid,
        type,
        money,
        credit,
        card_id,
        coupon_record_id,
        tel: this.data.address.phone
      };
    API.goPayMoney(parmas1).then((res) => {
      var data = res.data;
      wx.hideLoading();
      if (data.data == '-89') {
        utils.showMessage(this, '已有人在支付,请稍后...');
        return;
      }

      if (data.code == '-78') {
        utils.showMessage(this, '其他人提交中，请稍后...');
        return;
      }

      if (data.data == '-90') {
        var dialog = this.data.dialog;
        dialog.hidden = false;
        dialog.text = '该订单状态已改变~';
        this.setData({ dialog, d_type: 'payorder' });
        return;
      }


      if (data.status) {
        //无需支付流程 ①积分余额代金券等恰好抵消，则返回支付成功或异常：
        if (data.data.hasOwnProperty('paystatue')) {
          this.otherPay(data, parmas1)
        } else {
          //发起微信支付
          var params2 = {
            'timeStamp': data.data.timeStamp,
            'nonceStr': data.data.nonceStr,
            'package': data.data.package,
            'signType': data.data.signType,
            'paySign': data.data.paySign,
          }
          this.wechatPay(params2, parmas1);
        }
      } else {
        // console.log(res);
        utils.showMessage(this, data.msg)
        this.payFail(parmas1);
      }
    }, (err) => {
      this.payFail(parmas1);
      // console.log(err);
      utils.showMessage(this, '支付失败')
    })
  },
  /**
   * 积分余额代金券等支付
   */
  otherPay(data, parmas) {
    if (data.data.paystatue) {
      this.getSuccessData(); //请求支付成功接口
    } else {
      this.payFail(parmas);
      utils.showMessage(this, data.data.retmsg);
    }
  },
  /**
   * 付款失败，解锁
   */
  payFail: function (parmas) {
    API.lockPayFail(parmas).then((res) => {
      // console.log(res);
    }, (err) => {
      this.payFail(parmas);
      console.log(err);
      utils.showMessag(this, '联系柜台付款')
    })
  },
  wechatPay: function (parmas, parmas1) { //弹出微信支付
    API.fetPay(parmas).then((res) => {
      this.getSuccessData(); //请求支付成功接口
      this.payFail(parmas1);
    }, (err) => {
      // console.log(err);
      this.payFail(parmas1);
      utils.showMessage(this, '已取消支付')
      // app.showToast('支付失败')
    })
  },
  showMoreGoods: function () { //展示更多列表
    var list = this.data.myCart,
      goodsList = this.data.isToggle ? list.slice(0, 3) : list,
      toggleTxt = this.data.isToggle ? '查看更多' : '折叠列表';
    this.setData({
      tempGoodsList: goodsList,
      isShowMore: false,
      isToggle: !this.data.isToggle,
      toggleTxt: toggleTxt
    })
    // console.log(list, 1111)
  },
  /**
   * 支付成功 回调
   */
  getSuccessData: function () { //获取支付成功数据
    var that = this,
      access_token = this.data.access_token,
      orderid = this.data.orderid,
      parmas = { 'orderid': orderid, 'tablesid': this.data.tablesid, 'access_token': access_token };

    API.getPaySuccessData(parmas).then((res) => {
      this.setData({ successData: res.data.data })
      this.pullUpSuc();
    }, (err) => {
      utils.showMessage(this, '获取支付成功信息失败')
      // app.showToast('获取支付成功信息失败')
    })
  },
  /**
   * 支付成功弹窗
   */
  pullUpSuc: function () { //上拉成功
    this.setData({ isSuccess: true })
  },
  /**
   * 关闭支付成功弹窗
   */
  pullDownSuc: function () {
    this.setData({ isSuccess: false })

  },
  /**
   * 返回首页
   */
  backIndex: function () {
    this.pullDownSuc();
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  /**
   * 使用优惠券
   */
  useSale(e) { //是否使用折扣

    var allMoney = this.data.orderInfo.totalprice;                      //总金额
    var needDiscount = this.data.orderInfo.needDiscount || allMoney;    //参与打折金额    
    var cardstatue = this.data.cardstatue;                              //会员是否可用
    var mem_discount = this.data.mem_discount;                          // 会员折扣
    var vipPayMoney = (needDiscount * mem_discount).toFixed(2);             //会员折扣价格
    var rPayMoney = Number((needDiscount * (1 - mem_discount)).toFixed(2)); //折扣后价格
    var switchChecked = e.detail.value;
    var couponMoney = this.data.couponMoney || 0;                          //优惠券判断使用条件 已此参数为准


    var saleMoney = switchChecked ? vipPayMoney : 0;
    this.setData({ switchChecked, saleMoney })

    var pointMoney = this.data.pointMoney || 0;
    var pointsNum = this.data.pointsNum || 0;
    var remainMoney = this.data.remainMoney || 0;
    var lastmoney = Number(this.data.orderInfo.moneyrule.lastmoney);

    var lastcreadit = Number(this.data.orderInfo.creaditrule.lastcreadit), //总积分
      pointRate = this.data.orderInfo.creaditrule.rate; //积分兑换比率
    var _pointMoney = utils.myToFixed(lastcreadit * pointRate) //兑换总金额

    var isCheckPoint = this.data.isCheckPoint;
    var isBalancePayment = this.data.isBalancePayment;

    if (switchChecked) {

      if (isBalancePayment && !isCheckPoint) {
        remainMoney = (allMoney - pointMoney - saleMoney - couponMoney).toFixed(2);
        remainMoney = remainMoney >= lastmoney ? lastmoney : remainMoney;
        this.setData({ remainMoney })
      }

      if (isCheckPoint && !isBalancePayment) {
        pointMoney = utils.myToFixed(allMoney - remainMoney - saleMoney - couponMoney);
        pointMoney = pointMoney >= _pointMoney ? _pointMoney : pointMoney;
        pointsNum = Math.floor((pointMoney / pointRate) * 100) / 100 //兑换总金额
        this.setData({ pointMoney, pointsNum })
      }

      if (isBalancePayment && isCheckPoint) {
        remainMoney = (allMoney - saleMoney).toFixed(2);
        if (remainMoney >= lastmoney) {
          remainMoney = lastmoney;
          pointMoney = utils.myToFixed(allMoney - saleMoney - pointMoney - couponMoney);
          pointMoney = pointMoney >= _pointMoney ? _pointMoney : pointMoney;
          pointsNum = Math.floor((pointMoney / pointRate) * 100) / 100 //兑换总金额
        } else {
          remainMoney = remainMoney;
          pointMoney = 0;
          pointsNum = 0;
        }
        // console.log(pointMoney)
        this.setData({ pointMoney, remainMoney, pointsNum })
        // remainMoney = remainMoney >= lastmoney ? lastmoney : remainMoney;
        // this.setData({ remainMoney })
      }

      // if()
    } else {
      if (isBalancePayment) {
        remainMoney = (allMoney - pointMoney - saleMoney - couponMoney).toFixed(2);
        remainMoney = remainMoney >= lastmoney ? lastmoney : remainMoney;
        this.setData({ remainMoney })
      }

      if (isCheckPoint) {
        pointMoney = (allMoney - remainMoney - saleMoney - couponMoney).toFixed(2);
        pointMoney = pointMoney >= _pointMoney ? _pointMoney : pointMoney;
        var pointsNum = utils.myToFixed(pointMoney / pointRate)//兑换总金额
        this.setData({ pointMoney, pointsNum })
      }
    }
    // var payMoney = allMoney-
    this.funcPayMoney();

  },
  balancePayment(e) { //余额支付    
    var payMoney = Number(this.data.payMoney),
      isBalancePayment = e.detail.value,
      lastmoney = Number(this.data.orderInfo.moneyrule.lastmoney);
    // console.log('eee', payMoney, isBalancePayment)
    var remainMoney = 0;

    if (payMoney > 0 || !isBalancePayment) {
      // var remainMoney = (lastmoney >= payMoney) &&  isBalancePayment ? payMoney
      if (isBalancePayment) {
        remainMoney = lastmoney >= payMoney ? payMoney : lastmoney;
      } else {
        remainMoney = 0;
      }
    } else {
      isBalancePayment = false;
      utils.showMessage(this, '暂无可用余额或支付已满')
    }

    this.setData({ remainMoney, isBalancePayment })
    this.funcPayMoney();

  },
  usePoint(e) { //使用积分支付
    var payMoney = Number(this.data.payMoney),
      isCheckPoint = e.detail.value,
      lastcreadit = Number(this.data.orderInfo.creaditrule.lastcreadit), //总积分
      pointRate = this.data.orderInfo.creaditrule.rate; //积分兑换比率
    var _pointMoney = utils.myToFixed(lastcreadit * pointRate)//兑换总金额
    var pointMoney = 0, pointsNum = 0;

    if (payMoney > 0 || !isCheckPoint) {
      if (isCheckPoint) {
        pointMoney = _pointMoney >= payMoney ? payMoney : _pointMoney;
        pointsNum = Number((pointMoney / pointRate).toFixed(2))
        if (parseInt(pointsNum) != pointsNum) {
          pointsNum = parseInt(pointsNum);
          _pointMoney = utils.myToFixed(pointsNum * pointRate);
          pointMoney = _pointMoney >= payMoney ? payMoney : _pointMoney;
        }
        // console.log(pointsNum)
      } else {
        pointMoney = 0;
        pointsNum = 0;
      }
    } else {
      isCheckPoint = false;
      utils.showMessage(this, '暂无可用积分或余额支付已满')
    }
    this.setData({ pointMoney, isCheckPoint, pointsNum })
    this.funcPayMoney();


  },
  bindInput(e) { //输入框
    var type = e.currentTarget.dataset.type;

    // var payMoney = this.data.payMoney; //总金额
    var allMoney = this.data.total_price; //总金额
    console.log(allMoney)
    var saleMoney = this.data.saleMoney || 0;
    var pointMoney = this.data.pointMoney || 0;
    var remianMoney = this.data.remainMoney || 0;
    var couponMoney = this.data.couponMoney || 0;
    var newpscost = this.data.newpscost || 0;
    var pointRate = this.data.orderInfo.creaditrule.rate; //积分兑换规则
    var allPoint = this.data.orderInfo.creaditrule.lastcreadit; //总积分


    var isCheckPoint = this.data.isCheckPoint;
    var isBalancePayment = this.data.isBalancePayment;
    console.log(newpscost)
    /**
     * 总金额  - 积分 - 余额   _remainMoney  remainMoney 超过 不超过显示
     */
    if (type == 'money') {
      var _payMoney = (Number(allMoney) - Number(saleMoney) - Number(pointMoney) - Number(couponMoney) + Number(newpscost)).toFixed(2);
      // console.log(allMoney, saleMoney, pointMoney,couponMoney)
      var _remainMoney = this.data.orderInfo.moneyrule.lastmoney; //余额支付金额
      _remainMoney = _remainMoney >= _payMoney ? _payMoney : _remainMoney;
      var remainMoney = e.detail.value;
      remainMoney = _remainMoney >= remainMoney ? Number(remainMoney) : Number(_remainMoney);
      remainMoney = Number(remainMoney).toFixed(2)
      // console.log(remainMoney, _remainMoney)
      this.setData({ remainMoney, _remainMoney: Number(remainMoney) })
      this.funcPayMoney('money');
    } else if (type == 'point') {
      var _payMoney = (Number(allMoney) - Number(saleMoney) - Number(remianMoney) - Number(couponMoney) + Number(newpscost)).toFixed(2);
      console.log(allMoney, saleMoney, pointMoney, couponMoney)
      var _pointMoney = utils.myToFixed(allPoint * pointRate); //余额支付金额
      _payMoney = _pointMoney >= _payMoney ? _payMoney : _pointMoney;
      // console.log(_payMoney)
      var _pointsNum = (_payMoney / pointRate).toFixed(2);
      var pointsNum = Number(e.detail.value);
      pointsNum = _pointsNum >= pointsNum ? pointsNum : _pointsNum;
      pointsNum = Number(Number(pointsNum).toFixed(2))
      var pointMoney = utils.myToFixed(pointsNum * pointRate);
      if (parseInt(pointsNum) != pointsNum) {
        pointsNum = parseInt(pointsNum);
        pointMoney = utils.myToFixed(pointsNum * pointRate);
        // pointMoney = _pointMoney >= payMoney ? payMoney : _pointMoney;
      }
      this.setData({ pointsNum, pointMoney })
      this.funcPayMoney('point');
    }
  },
  funcPayMoney(type) { //计算支付金额
    var orderInfo = this.data.orderInfo;    //获取信息
    var allMoney = this.data.total_price;  //总金额
    var saleMoney = this.data.saleMoney || 0; //折扣价
    var remainMoney = this.data.remainMoney || 0; //余额支付
    var pointMoney = this.data.pointMoney || 0; //积分支付
    var newpscost = this.data.newpscost;
    var rate_money_to_point = orderInfo.memberInfo.hasOwnProperty('rate_money_to_point') && orderInfo.memberInfo.rate_money_to_point > 0 ? orderInfo.memberInfo.rate_money_to_point : 0; //每消费1元，送y积分  积分兑换规则 
    var couponMoney = this.data.couponMoney || 0;
    var payMoney = (allMoney - saleMoney - remainMoney - pointMoney - couponMoney + newpscost).toFixed(2);
    console.log(payMoney)
    // console.log(payMoney)
    var subMoney = allMoney - saleMoney + newpscost; //减去折扣价后的总金额
    subMoney = subMoney > 0 ? subMoney : 0;

    var sendMoney = Number(allMoney - saleMoney - couponMoney - pointMoney);        //实际支付金额（包含余额）

    sendMoney = sendMoney >= 0 ? sendMoney : 0;
    // console.log(sendMoney)
    var sendPoints = parseInt(sendMoney * rate_money_to_point);

    var lastmoney = Number(this.data.orderInfo.moneyrule.lastmoney); //余额支付金额

    var isCheckPoint = this.data.isCheckPoint;
    var isBalancePayment = this.data.isBalancePayment;

    var pointRate = this.data.orderInfo.creaditrule.rate; //积分兑换规则
    var allPoint = this.data.orderInfo.creaditrule.lastcreadit; //总积分
    var _pointMoney = utils.myToFixed(allPoint * pointRate); //余额支付金额
    var PriceFix = this.data.subMoney.toFixed(2)
    this.setData({
      allPrice: PriceFix
    })
    // console.log(this.data.allPrice, 99999)
    if (type != 'money') {
      var _remainMoney = (allMoney - saleMoney - pointMoney - couponMoney).toFixed(2);
      _remainMoney = lastmoney >= _remainMoney ? _remainMoney : lastmoney;

      this.setData({ _remainMoney })
    }

    if (type != 'point') {
      var _ptMoney = (allMoney - saleMoney - remainMoney - couponMoney).toFixed(2);
      _pointMoney = _pointMoney >= _ptMoney ? _ptMoney : _pointMoney;
      // _pointMoney = lastmoney >= _pointMoney ? lastmoney : _remainMoney;
      this.setData({ _pointMoney })
    }


    payMoney = payMoney > 0 ? payMoney : 0;
    sendPoints = sendPoints > 0 ? sendPoints : 0;

    this.setData({ payMoney, sendPoints, subMoney })


  },
  showDialog(e) { //点击显示弹窗
    var name = e.currentTarget.dataset.name,
      dialog = this.data.dialog,
      orderInfo = this.data.orderInfo;

    switch (name) {
      case 'vip':
        dialog.title = '会员折扣说明';
        dialog.text = `${orderInfo.memberInfo.cardtitle}今日全场菜品${orderInfo.mem_discount * 10}折优惠`;
        dialog.hidden = false;
        dialog.textAlign = '';
        this.setData({ dialog })
        break;
      case 'money':
        dialog.title = '余额支付说明';
        dialog.text = `钱包余额在收银时可最大化使用，余额明细可至我的余额-账单查看，如有疑问请联系商家客服。`;
        dialog.hidden = false;
        dialog.textAlign = 'left';
        this.setData({ dialog })
        break;
      case 'point':
        dialog.title = '积分抵扣说明';
        dialog.text = `${orderInfo.memberInfo.creaditrulestr}`;
        dialog.hidden = false;
        dialog.textAlign = 'left';
        this.setData({ dialog })
        break;
      default:
        break;
    }
  },
  affknow: function () {
    this.getData();
    this.setData({
      display: 'none',
      flagDialog: 'close',
    })
    wx.setStorageSync('flagDialog', 'close');
  },
  /**
   * 计算优惠券
   */
  funCoupon() {
    var ticker = wx.getStorageSync('ticker') || {};
    // console.log(ticker)
    var orderInfo = this.data.orderInfo;
    var _couponlist = orderInfo.couponlist.list;
    var couponlist = [];
    var count = orderInfo.couponlist.count;
    var subMoney = this.data.subMoney; //减去折扣后的金额
    var couponPrice = this.data.couponPrice;//减去会员后的金额
    console.log(couponPrice)
    var couponMoney = 0;
    var couponMsg = '';


    _couponlist.map((item, index) => {
      if (item.card_type == 5 && couponPrice >= item.value) {
        couponlist.push(item);
      }
      if (item.card_type == 4) {
        couponlist.push(item);
      }
    })

    // console.log(couponlist)
    //是否有可用优惠券
    if (couponlist.length > 0) {

      if (!utils.isEmpty(ticker)) {
        //card_type 5现金抵扣券
        var _couponMoney = ticker[0].value;
        // console.log(_couponMoney)
        if (ticker[0].card_type == 5) {
          if (subMoney >= _couponMoney || this.data.isComeCoupon) {
            couponMsg = `-￥${_couponMoney}`
            couponMoney = _couponMoney
            this.setData({ coupon_record_id: ticker[0].id, card_id: ticker[0].card_id })
          } else {
            couponMsg = '无可用优惠券'
            couponMoney = 0
          }
        }

        if (ticker[0].card_type == 4) { //折扣券
          //   _couponMoney = utils.myToFixed((couponPrice * (1 - _couponMoney * 0.1)))
          _couponMoney = (couponPrice * Number(1 - _couponMoney * 0.1)).toFixed(2);
          console.log(_couponMoney, couponPrice)
          if (couponPrice > 0 || this.data.isComeCoupon) {
            couponMsg = `-￥${_couponMoney}`
            couponMoney = _couponMoney
            this.setData({ coupon_record_id: ticker[0].id, card_id: ticker[0].card_id })
          } else {
            couponMsg = '无可用优惠券'
            couponMoney = 0
          }
        }
      } else {
        couponMsg = `共${couponlist.length}张可用`
      }
    } else {
      couponMsg = '无可用优惠券'
    }
    // console.log(typeof couponMoney)
    this.setData({ couponMoney, couponMsg })
    this.funCouponYu();
  },
  /**
   * 有优惠券的使用
   */
  funCouponYu() {
    var allMoney = this.data.goodsCost;  //总金额
    var saleMoney = this.data.saleMoney || 0;     //折扣价
    var remainMoney = this.data.remainMoney || 0; //余额支付
    var pointMoney = this.data.pointMoney || 0; //积分支付
    var couponMoney = this.data.couponMoney || 0;
    console.log(couponMoney)
    var payMoney = Number((allMoney - saleMoney - remainMoney - pointMoney - couponMoney).toFixed(2));
    // console.log(allMoney, saleMoney, remainMoney, pointMoney, couponMoney)
    var lastmoney = Number(this.data.orderInfo.moneyrule.lastmoney); //余额支付金额


    var isCheckPoint = this.data.isCheckPoint;
    var isBalancePayment = this.data.isBalancePayment;

    var pointRate = this.data.orderInfo.creaditrule.rate; //积分兑换规则
    var allPoint = this.data.orderInfo.creaditrule.lastcreadit; //总积分
    var _pointMoney = Number((allPoint * pointRate).toFixed(2)); //余额支付金额

    var _remainMoney = 0, remainMoney = 0, pointMoney = 0, pointNum = this.data.pointNum;
    //判断条件 选择优惠券&&(余额支付||积分支付开启)
    if (this.data.couponMoney > 0 || this.data.isComeCoupon) {
      // console.log(allMoney, saleMoney, couponMoney);
      var _cpmoney = (allMoney - saleMoney - couponMoney).toFixed(2);
      if (isBalancePayment || isCheckPoint) {
        if ((isBalancePayment && isCheckPoint) || (isBalancePayment && !isCheckPoint)) {
          if (lastmoney >= _cpmoney) {
            _remainMoney = _cpmoney;
            remainMoney = _remainMoney;
            _pointMoney = 0
            pointMoney = 0
            this.setData({ pointNum: 0, isCheckPoint: false })
          } else {
            _remainMoney = lastmoney;
            remainMoney = _remainMoney;
            _pointMoney = (_cpmoney - lastmoney).toFixed(2)
            pointMoney = _pointMoney
          }
        } else {
          if (_pointMoney >= _cpmoney) {
            _pointMoney = _cpmoney;
            pointMoney = _pointMoney;
            _remainMoney = 0
            _remainMoney = 0
          } else {
            remainMoney = (_cpmoney - _pointMoney).toFixed(2)
            remainMoney = _remainMoney;
          }
        }

      }
      payMoney = Number((allMoney - saleMoney - remainMoney - pointMoney - couponMoney).toFixed(2));
      this.setData({ _remainMoney, _pointMoney, remainMoney, pointMoney, payMoney })
    }

  },
  // showChangeTime
  showChangeTime() {
    this.setData({ showTime: true });
  },

  //   *---------------------
  showPickerTime() { //控制PICKTIME显示隐藏
    this.setData({
      isTime: !this.data.isTime
    })
    this.countZTtime();
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
    this.setData({ isHidden: false, isChecked: false })
  },
  tcfalse: function () { //点击取消或者遮罩关闭层
    this.setData({ isHidden: true });
  },
  tapYes() { //点击确定选择人数
    const changeNum = this.data.changeNum,
      order_people = this.data.order_people;
    if (changeNum > 0) {
      this.setData({ counts: changeNum });
      this.tcfalse();

    } else {
      this.setData({ changeNum: 0, })
    }
  },
  addTimer: function () {
    wx.navigateTo({
      url: '../address_out/address_out',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  createdOrder() { //创建订单

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    const access_token = this.data.access_token,
      storeid = app.shopId,
      counts = this.data.counts,
      orderid = this.data.orderid,
      allCart = this.data.newList,
      username = this.data.address.contactname,
      address = this.data.address.address,
      tel = this.data.address.phone,
      packvalue = this.data.packvalue,
      tablesid = this.data.tablesid,
      newpscost = this.data.newpscost;
    // // console.log(this.data.addCartNums < 0 || counts <= 0)
    if (counts <= 0 && tablesid != '-2') {
      wx.hideLoading();
      this.tcpeople();
      return;
    }

    var parmas = {};
    console.log(orderid)
    if (!!orderid) {
      parmas = { access_token, storeid, allCart, counts, orderid, tablesid, username, address, tel, packvalue, newpscost }
      var payMoney = this.data.payMoney;
      if (payMoney > 0) {
        this.payNow()
      } else {
        this.showOtherPayDialog()
      }
    } else {
      parmas = { access_token, storeid, allCart, counts, tablesid, username, address, tel, packvalue, newpscost }

      console.log(allCart, 'allCartallCartallCart')
      API.submitYuDingOrder(parmas).then((res) => {
        if (res.data.status) {
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.setData({ isFrist: true, isLoading: true });
          // wx.removeStorageSync('myCart');
          // wx.removeStorageSync('total_dish_count');
          // wx.removeStorageSync('total_price');
          var payMoney = this.data.payMoney;
          var showMsg = this.data.payMoney > 0 ? '唤起支付中' : '订单提交中';
          wx.showLoading({ title: showMsg, mask: true })
          this.setData({
            orderid: res.data.data.orderid
          })
          if (payMoney > 0) {
            this.payNow()
          } else {
            this.showOtherPayDialog()
          }
          // if (this.data.tablesid == -1) {
          //   wx.redirectTo({
          //     url: `/pages/payment/payment?type=diancan&orderid=${res.data.data.orderid}&tablesid=${this.data.tablesid}&xb=true`
          //   })
          // } else {
          //   wx.redirectTo({
          //     url: `/pages/payment/payment?type=diancan&orderid=${res.data.data.orderid}&tablesid=${this.data.tablesid}&xz=true`
          //   })
          // }

        } else {
          wx.hideLoading()
          utils.showMessage(this, res.data.msg);
        }
        console.log(res.data, 'orderidorderidorderid')
      }, (err) => {
        wx.hideLoading()
        utils.showMessage(this, '提交数据错误');
      })
    }

  },
  //跳转地址列表
  selectAdr: function () {
    wx.navigateTo({
      url: '../address_out/address_out',
    })
  }
})
