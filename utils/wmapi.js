const fetch = require('./wmfetch.js');


const AJAXLOGINPATH = 'c=entry&do=wxappauth&m=weisrc_dish';
let ajaxLogin = function(parmas) {
    return fetch(AJAXLOGINPATH, parmas, 'POST');
}

/**
 * [getIndexDetail 获取首页信息]
 * @param  {[type]} parmas [{ 'lat' => '经纬度', 'lng' => '经纬度','access_token' => '小程序用户信息接口返回',}]
 *                          lat、lng 可选参数
 * @return {[type]}        [description]
 */
const INDEXPATH = 'c=entry&do=wxapp&m=weisrc_dish';
let getIndexDetail = function(parmas) {
    return fetch(INDEXPATH, parmas);
}


// --------------------------zyStart----------------------------------

// 首页全部数据
const INDEXDATAPATH = 'c=onefive&do=onefivewxapp&m=weisrc_dish';
let getIndexData = function(parmas) {
    return fetch(INDEXDATAPATH, parmas);
}
// 可优化的地方 action值的变动
/**
 * 获取所有的评价
 */
const PRAISEPATH = 'c=onefive&do=onefiveactiondo&m=weisrc_dish&action=fetchAllComment';
let getAllPraise = function(parmas) {
    return fetch(PRAISEPATH, parmas);
}

// 提交评价内容
const SUBMITPRAISEPATH = 'c=onefive&do=onefiveactiondo&m=weisrc_dish&action=submitComment';
let submitPraise = function(parmas) {
    return fetch(SUBMITPRAISEPATH, parmas);
}

//查看我的评价
const LOOKPRAISEPATH = 'c=onefive&do=onefiveactiondo&m=weisrc_dish&action=fetchMyComment';
let lookPraise = function(parmas) {
    return fetch(LOOKPRAISEPATH, parmas);
}

// 我的页面
const MYCEBTERPATH = 'c=onefive&do=onefiveusercard&m=weisrc_dish';
let getMyCenter = function(parmas) {
    return fetch(MYCEBTERPATH, parmas);
}

//配送条件
const ORDERTERM = 'shopCert';
let GetTremGo = function (parmas) {
  return fetch(ORDERTERM, parmas);
}

// 确认订单
const GREATORDERdATA = 'cartDetail';
let getCreatOrder = function(parmas) {
    return fetch(GREATORDERdATA, parmas);
}


// 获取全部订单
const ALLORDER = 'c=onefive&do=onefiveactiondo&m=weisrc_dish&action=fetchallOrderslist';
let getAllOrderList = function(params) {
    return fetch(ALLORDER, params);
}



/**
 * 获取优惠券列表
 */
const COUPONLISTPATH = 'c=onefive&do=couponlist&m=weisrc_dish';
const getCouponList = function(params) {
    return fetch(COUPONLISTPATH, params)
}


/**
 * 领取优惠券成功 通知后台
 */
const ADDCARDMSGERVERPATH = 'c=onefive&do=coupongetnotice&m=weisrc_dish';
const getAddCouponNotice = function(params) {
    return fetch(ADDCARDMSGERVERPATH, params)
}


// --------------------------zyEnd----------------------------------
/**
 * 获取附近商家
 */
const NEARSHOPLISTPATH = 'c=entry&do=diancannearshoplist&m=weisrc_dish';
const getNearShopList = function(parmas) {
    return fetch(NEARSHOPLISTPATH, parmas)
}

/**
 * [getCarteOrderList @description 获取订单列表]
 * @param  {[type]} parmas [description]
 * @return {[type]}        [description]
 */
const CARTEORDERAPTH = 'c=entry&do=diancanolist&m=weisrc_dish';
let getCarteOrderList = function(parmas) {
    return fetch(CARTEORDERAPTH, parmas);
}


/**
 * [queuePATH 获取排队列表]
 * @type {String}
 */
const queuePATH = 'c=entry&do=queueapi&m=weisrc_dish&a=list';
let getQueueList = function(parmas) {
    return fetch(queuePATH, parmas);
}

/**
 * 预点餐 列表
 */
const YUDIANORDERLIST = 'c=entry&do=yudingolist&m=weisrc_dish&a=list';
const getYuDianOderList = function(parmas) {
    return fetch(YUDIANORDERLIST, parmas);
}

const queueINDEXPATH = 'c=entry&do=queueapi&a=queue&m=weisrc_dish';
let getQueueIndex = function(parmas) {
    return fetch(queueINDEXPATH, parmas);
}


const queueCancePATH = 'c=entry&do=queueapi&m=weisrc_dish&a=cancel';
let cancelQueue = function(parmas) {
    return fetch(queueCancePATH, parmas);
}

const queueDelPath = 'c=entry&do=queueapi&m=weisrc_dish&a=delete';
let delQueue = function(parmas) {
    return fetch(queueDelPath, parmas);
}

/**
 * 检查餐桌状态
 */
const CHECKTABLESTATICEPATH = 'c=entry&do=diancantablestatue&m=weisrc_dish';
const checkTableStatic = function(parmas) {
    return fetch(CHECKTABLESTATICEPATH, parmas)
}

/*
 * 检查 购物车商品是否存在
 */
const CHECKGOODSTID = 'c=entry&do=confirmchangecart&m=weisrc_dish';
const checkGoodsTid = function(parmas) {
    return fetch(CHECKGOODSTID, parmas);
}
/**
 * [queueSTARTPATH 开始排队]
 * @type {String}
 */
const queueSTARTPATH = 'c=entry&do=queueapi&m=weisrc_dish&a=add';
let startQueue = function(parmas) {
    return fetch(queueSTARTPATH, parmas);
}


/**
 *  测试 
 */
const QUEUESDETAIL = 'c=entry&do=queueapi&m=weisrc_dish&a=detail';
let getQueueDetail = function(parmas) {
    return fetch(QUEUESDETAIL, parmas);
}


/**
 *  点餐购物车ajax 
 */
const CHANGECARTPATH = 'c=entry&do=dianchanchangecart&m=weisrc_dish';
const changeCart = function(parmas) {
    return fetch(CHANGECARTPATH, parmas);
}

/**
 * 修改购物车数量
 */
const EDITCARTNUMPATH = 'c=entry&do=confirmcartnum&m=weisrc_dish';
const editCartNum = function(parmas) {
    return fetch(EDITCARTNUMPATH, parmas);
}

/**
 * [SUBMITCARTPATH 点餐提交购物车]
 * @type {String}
 */
const SUBMITCARTPATH = 'c=entry&do=diancansubmitorder&m=weisrc_dish';
const submitOrderCart = function(parmas) {
    return fetch(SUBMITCARTPATH, parmas);
}


/**
 * [CATEGORYPATH 点餐分类]  zy=>点餐分类
 * @type {String}
 */
const CATEGORYPATH = 'c=onefive&do=onefivecategory&m=weisrc_dish';
const getCartegory = function(parmas) {
    return fetch(CATEGORYPATH, parmas);
}


/**
 * [CATEGORYPATH 预点餐商品类型]
 * @type {String}
 */
const YUDINGCATEGORYPATH = 'category';
const getYuDianCartegory = function(parmas) {
    return fetch(YUDINGCATEGORYPATH, parmas);
}

// //外卖生成订单
// const GETCREATEORDER = 'c=onefive&do=onefiveactiondo&m=weisrc_dish&action=submitOrder';
// let getOrderData = function (parmas) {
//   return fetch(GETCREATEORDER, parmas,'POST');
// }
/**
 * [CATEGORYPATH 提交订单]   zy=>
 * @type {String}
 */
const YUDINGSUBMITORDER = 'c=onefive&do=onefiveactiondo&m=weisrc_dish&action=submitOrder';
const submitYuDingOrder = function(parmas) {
    return fetch(YUDINGSUBMITORDER, parmas, 'POST');
}

/**
 * [GOODLISTPATH 点餐商品goodlist] zy=>类别下面的商品列表
 * @type {String}
 */
const GOODLISTPATH = 'goodslist';
const getGoodsList = function(parmas) {
    return fetch(GOODLISTPATH, parmas);
}


/**
 * [YUDIANGOODLISTPATH 预点订单] 
 * @type {String}
 */
const YUDIANGOODLISTPATH = 'goodslist';
const getYuDianGoodsList = function(parmas) {
    return fetch(YUDIANGOODLISTPATH, parmas);
}

/**
 * 确认订单 ajax请求
 */
const CONFIRMGOODSPAHT = 'c=entry&do=diancanconfirmgoods&m=weisrc_dish';
const getComfirmGoods = function(parmas) {
    return fetch(CONFIRMGOODSPAHT, parmas);
}

/**
 * 预定订单 ajax请求   
 */
const YUDIANCONFIRMGOODSPAHT = 'c=entry&do=yudingconfirmgoods&m=weisrc_dish';
const getYuDianComfirmGoods = function(parmas) {
    return fetch(YUDIANCONFIRMGOODSPAHT, parmas);
}


/**
 * 预点餐列表详情
 */
const YUDIANODETAIL = 'c=entry&do=yudingodetail&m=weisrc_dish&a=list';
const getYuDianODetail = function(parmas) {
    return fetch(YUDIANODETAIL, parmas);
}



/**
 * 预点订单 合并或取消
 */
const YUDIANMERGEDETAIL = 'c=entry&do=yudingtodiancan&m=weisrc_dish';
const getYuDianMergeDetail = function(parmas) {
    return fetch(YUDIANMERGEDETAIL, parmas)
}

/**
 *  迁移餐桌
 */
const YUDIANCHANGETABLEPATH = 'c=entry&do=diancanchangetable&m=weisrc_dish';
const getYuDianChangeTable = function(parmas) {
    return fetch(YUDIANCHANGETABLEPATH, parmas)
}

/**
 * 通用版 获取排队人数
 */
const DEFULTQUEUENUMPATH = 'c=entry&do=diancanqueuecounts&m=weisrc_dish';
const getQueueNum = function(parmas) {
    return fetch(DEFULTQUEUENUMPATH, parmas)
}


/**
 * 通用版 验证预定状态
 */
const CHECKYUDIANSTATICPATH = 'c=entry&do=yudingstatue&m=weisrc_dish';
const checkYuDianStatic = function(parmas) {
    return fetch(CHECKYUDIANSTATICPATH, parmas);
}

/**
 * [GOODSPATH 获取菜单详情]
 * @type {String}
 */
const GOODSPATH = 'c=entry&tablesid=26&do=diancan&m=weisrc_dish';
let getGoodsDetail = function(params) {
    return fetch(GOODSPATH, params)
}

/**
 * [setCart 添加购物车]
 * @type {String}
 */
let SETCARTPATH = 'c=entry&do=addcart&m=weisrc_dish';
let setCart = function(params) {
    // var PATH = SETCARTPATH + access_token;
    // console.log(PATH)
    return fetch(SETCARTPATH, params, 'POST');
}


/**
 * [CLASSIFYCARTPATH 获取确认订单]
 * @type {String}
 */
const CLASSIFYCARTPATH = 'c=entry&do=getcart&m=weisrc_dish';
let getClassifyCart = function(params) {
    return fetch(CLASSIFYCARTPATH, params);
}


/**
 * [CHECKCARTPATH 检测购物车是否有变化接口]
 * @type {String}
 */
const CHECKCARTPATH = 'c=entry&do=checkcart&m=weisrc_dish';
let checkCartChange = function(parmas) {
    return fetch(CHECKCARTPATH, parmas);
}

/**
 * [CreatedOrderPATH 提交订单接口]
 * @type {String}
 */
const CreatedOrderPATH = 'c=entry&do=submitorder&m=weisrc_dish';
let getCreatedOrder = function(params) {
    return fetch(CreatedOrderPATH, params, 'POST');
}


/**
 * [ORDERDETAILPATH 获取订单详情]  zy
 * @type {String}
 */
const ORDERDETAILPATH = 'c=onefive&do=onefiveodetail&m=weisrc_dish';
let getOrderDetail = function(parmas) {
    return fetch(ORDERDETAILPATH, parmas);
}

/**
 * [ZTORDERDETAILPATH 自提订单状态修改]
 * @type {String}
 */
const ZTORDERDETAILPATH = 'c=onefive&do=onefiveztodetail&m=weisrc_dish';
let getZtOrderDetail = function (parmas) {
    return fetch(ZTORDERDETAILPATH, parmas);
}


/**
 * [DELAYORDERPATH 等待支付接口详情]
 * @type {String}
 */
const DELAYORDERPATH = 'c=entry&do=wxapppay&m=weisrc_dish';
let getDelayOrder = function(parmas) {
    return fetch(DELAYORDERPATH, parmas);
}


/**
 * [PAYMONEYPATH 去支付]
 * @type {String}
 */
const PAYMONEYPATH = 'c=onefive&do=onefivewxapppay&m=weisrc_dish';
let goPayMoney = function(params) {
    var PATH = PAYMONEYPATH + '&meal_time=' + params.meal_time + '&orderid=' + params.orderid + '&tablesid=' + params.tablesid + '&access_token=' + params.access_token + '&type=' + params.type + '&money=' + params.money + '&credit=' + params.credit + '&card_id=' + params.card_id + '&coupon_record_id=' + params.coupon_record_id
    return fetch(PATH, {}, 'POST');
}

/**
 * [NEARYBYSHOPPATH 获取附近商家]
 * @type {String}
 */
const NEARYBYSHOPPATH = 'c=entry&do=flist&m=weisrc_dish';
let getNearByShopDetail = function(params) {
    return fetch(NEARYBYSHOPPATH, params);
}

/**
 * [PAYSUCCESSPATH 获取支付成功数据]
 * @type {String}
 */
const PAYSUCCESSPATH = 'c=onefive&do=onefiveodetailjump&m=weisrc_dish';
let getPaySuccessData = function(params) {
    return fetch(PAYSUCCESSPATH, params);
}

/**
 * [checkPayStatic 验证支付转态]
 * @param  {[type]} parmas [description]
 * @return {[type]}        [description]
 */
const CHECKPAYPATH = 'c=entry&do=checkpay&m=weisrc_dish';
let checkPayStatic = function(parmas) {
    return fetch(CHECKPAYPATH, parmas);
}

/**
 * [PAYFAILPATH 付款失败]
 * @type {String}
 */
const PAYFAILPATH = 'c=onefive&do=onefivepayfaile&m=weisrc_dish';
let lockPayFail = function(parmas) {
    return fetch(PAYFAILPATH, parmas);
}

/**
 * [fetPay 调用微信支付接口]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
let fetPay = function(params) {
    console.log(params.package)
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            'timeStamp': params.timeStamp,
            'nonceStr': params.nonceStr,
            'package': params.package,
            'signType': params.signType,
            'paySign': params.paySign,
            success: resolve,
            fail: reject,
        })
    })
}

/**
 * [getUserCard 获取会员信息]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const USERCARDATH = 'c=entry&do=onefiveusercard&m=weisrc_dish';
let getUserCard = function(parmas) {
    return fetch(USERCARDATH, parmas);
}

/**
 * [getUserCard 获取会员交易信息]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const USERTRADEDATH = 'c=entry&do=usertrade&m=weisrc_dish';
let getTradeInfo = function(parmas) {
    return fetch(USERTRADEDATH, parmas);
}



/**
 * [getReceiveVip 领取会员]
 * @param  {[type]} parmas [description]
 * @return {[type]}        [description]
 */
const RECEIVEPATH = 'c=entry&do=usercard&m=weisrc_dish&a=receive';
let getReceiveVip = function(parmas) {
    return fetch(RECEIVEPATH, parmas);
}

/**
 * [getVipInfo 会员信息]
 * @param  {[type]} parmas [description]
 * @return {[type]}        [description]
 */
const VIPINFOPATH = 'c=entry&do=usercardInfo&m=weisrc_dish';
let getVipInfo = function(parmas) {
    return fetch(VIPINFOPATH, parmas);
}

/**
 * [getVipDetail 获取会员详情]   zy =>会员卡详情信息接口
 * @param  {[type]} parmas [description]
 * @return {[type]}        [description]
 */
const VIPDETAILPATH = 'c=onefive&do=onefiveusercardlevel&m=weisrc_dish&a=info';
const getVipDetail = function(parmas) {
    return fetch(VIPDETAILPATH, parmas)
}


/**
 * [getVipLevel 获取会员等级]  zy  =>会员卡等级接口
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const VIPLEVELPATH = 'c=onefive&do=onefiveusercardlevel&m=weisrc_dish';
const getVipLevel = function(params) {
    return fetch(VIPLEVELPATH, params)
}

/**
 * [getVipRule 获取会员积分规则]   zy  =>会员等级升级信息接口
 * @param  {[type]} parmas [description]
 * @return {[type]}        [description]
 */
const VIPRULEPATH = 'c=onefive&do=onefiveusercardInfo&m=weisrc_dish&a=prule';
const getVipRule = function(parmas) {
    return fetch(VIPRULEPATH, parmas)
}


/**
 * [getVipIsActionFiled 激活vip上传的字段]   zy=>激活会员卡需要提交的信息接口
 * @param  {[type]} parmas [description]
 * @return {[type]}        [description]
 */
const VIPISACTION = 'c=onefive&do=onefiveusercard&m=weisrc_dish&a=getFields';
const getVipIsActionFiled = function(parmas) {
    return fetch(VIPISACTION, parmas);
}

/**
 * [submitVipAction 提交vip激活]   zy  =>激活会员接口
 * @param  {[type]} parmas [description]
 * @return {[type]}        [description]
 */
const VIPDOPATH = 'c=onefive&do=onefiveusercard&m=weisrc_dish&a=editor';
const submitVipAction = function(parmas) {
    return fetch(VIPDOPATH, parmas);
}

/**
 * [getVIPUserInfo 获取会员信息]  zy=> 个人信息接口
 * @param  {[type]} parmas [description]
 * @return {[type]}        [description]
 */
const USERVIPINFOPATH = 'c=onefive&do=onefiveusercard&m=weisrc_dish&a=userInfo';
const getVIPUserInfo = function(parmas) {
    return fetch(USERVIPINFOPATH, parmas);
}

/**
 * [getViPoints 获取会员积分]  zy   =>会员积分详情接口
 * @param  {[type]} parmas [description]
 * @return {[type]}        [description]
 */
const VIPPOINTS = 'c=onefive&do=onefiveusercardInfo&m=weisrc_dish&a=plist';
const getViPoints = function(parmas) {
    return fetch(VIPPOINTS, parmas);
}

/**
 * [getIntegarlIndex 积分商城首页]    zy  =>积分商城首页
 * @param  {[type]} parmas [description]
 * @return {[type]}        [description]
 */
const INTEGRALINDEXPATH = 'c=onefive&do=onefivecreditlist&m=weisrc_dish';
const getIntegarlIndex = function(parmas) {
    return fetch(INTEGRALINDEXPATH, parmas);
}

/**
 * [getIgGoods 获取单个积分商品信息]  zy=>积分商品详情
 * @param  {[type]} parmas [description]
 * @return {[type]}        [description]
 */
const IGGOODSPATH = 'c=onefive&do=onefivecreditdetail&m=weisrc_dish';
const getIgGoods = function(parmas) {
    return fetch(IGGOODSPATH, parmas);
}

/**
 * [getExchangeGoods 兑换商品]  zy=>商品兑换请求接口
 * @param  {[type]} parmas [description]
 * @return {[type]}        [description]
 */
const EXCHANGEGOODSPATH = 'c=onefive&do=onefivesubmitcredit&m=weisrc_dish';
const getExchangeGoods = function(parmas) {
    return fetch(EXCHANGEGOODSPATH, parmas);
}

/**
 * [cancelExchange 取消兑换]
 * @param  {[type]} parmas [description]
 * @return {[type]}        [description]
 */
const CANCELEXCHANGPATH = 'c=entry&do=closecredit&m=weisrc_dish';
const cancelExchange = function(parmas) {
    return fetch(CANCELEXCHANGPATH, parmas);
}

/**
 * [getExchangeGoodsList 获取兑换商品列表]  zy  => 积分商城我的订单
 * @param  {[type]} parmas [description]
 * @return {[type]}        [description]
 */
const EXCHANGEGOODSLISTPATH = 'c=onefive&do=onefiveceditorderlist&m=weisrc_dish';
const getExchangeGoodsList = function(parmas) {
    return fetch(EXCHANGEGOODSLISTPATH, parmas);
}


/**
 * [getExchangeOrder 获取订单详情]
 * @param  {[type]} parmas [description]
 * @return {[type]}        [description]
 */
const EXCHANGORDER = 'c=entry&do=ocdetail&m=weisrc_dish';
const getExchangeOrder = function(parmas) {
    return fetch(EXCHANGORDER, parmas);
}

/**
 * [getMobileCode 获取手机验证码]
 * @param  {[type]} parmas [description]
 * @return {[type]}        [description]
 */
const MOBILECODEPATH = 'c=onefive&do=onefivemessage&m=weisrc_dish';
const getMobileCode = function(parmas) {
    return fetch(MOBILECODEPATH, parmas);
}

/**
 * [getShopDetail 店铺详情]
 * @param  {[type]} parmas [description]
 * @return {[type]}        [description]
 */
const SHOPDETAILPATH = 'c=entry&do=storedetail&m=weisrc_dish';
const getShopDetail = function(parmas) {
    return fetch(SHOPDETAILPATH, parmas);
}
//地址列表
const ADRESSLIST ='addressInfo';
const getAdressList = function(parmas){
  return fetch(ADRESSLIST, parmas);
}
//地址增加,改

/**
 * [getIgAddress 获取地址详情]
 * @param  {[type]} parmas [description]
 * @return {[type]}        [description]
 */
const IGADDRESSPATH = 'c=entry&do=detailaddress&m=weisrc_dish';
const getIgAddress = function(parmas) {
    return fetch(IGADDRESSPATH, parmas);
}

/**
 * [editIgAddress 修改地址详情]
 * @param  {[type]} parmas [description]
 * @return {[type]}        [description]
 */
const EDITADDRESSPATH = 'https://dc.xiaodian.in/app/index.php?c=entry&do=saveaddress&m=weisrc_dish';
const editIgAddress = function(parmas) {
    var path = `${EDITADDRESSPATH}&access_token=${parmas.access_token}`
    console.log(path)
    return fetch(path, parmas, "POST");
}


/**
 * [setNavTtitle 设置小程序navbar标题]
 * @param  {[type]} title [description]
 * @return {[type]}        [description]
 */
const setNavTtitle = function(title) {
    wx.setNavigationBarTitle({
        title: title
    })
}

/**
 * [RECHARGEPATH 发送充值请求]-------  zy=>立即充值=>会员卡请求充值接口
 * @type {String}
 */
const RECHARGEPATH = 'c=onefive&do=onefivedeposit&m=weisrc_dish&a=deposit';
const sendRecharge = function(params) {
    return fetch(RECHARGEPATH, params)
}


/**
 * [充值回调]
 */
const DEPOSTCALLBACKPATH = 'c=onefive&do=onefiveautodeposit&m=weisrc_dish';
const depostCallback = function(params) {
    return fetch(DEPOSTCALLBACKPATH, params)
}

/**
 * 付款码 详情-----zy =>会员卡充值信息接口
 */
const PAYMENTCODEPATH = 'c=onefive&do=onefivedeposit&m=weisrc_dish&a=payinfo';
const getPaymentCode = function(params) {
    return fetch(PAYMENTCODEPATH, params);
}
/**
 * 付款码 详情
 */
const SCORESTAICNEW = 'c=entry&do=creditlist&m=weisrc_dish';
const scoreStaicNew = function(params) {
    return fetch(SCORESTAICNEW, params);
}


/**
 * [getPictxtDetail 获取图文详情]
 * @param  {[type]} title [description]
 * @return {[type]}        [description]
 */
const PICTXTPATH = 'c=onefive&do=onefiveactiondo&m=weisrc_dish&action=textPic';
const getPictxtDetail = function(parmas) {
    return fetch(PICTXTPATH, parmas);
}

/**
 * 请求打印机
 */
const PRINTPATH = 'c=entry&do=diancanautoprint&m=weisrc_dish';
const printDetail = function(parmas) {
    return fetch(PRINTPATH, parmas)
}

/**
 * [BILLPATH 获取账单]  zy=>充值明细接口/
 * @type {String}
 */
const BILLPATH = 'c=onefive&do=onefivedeposit&m=weisrc_dish&a=depositList';
const DEFAULTBILL = {
    limit: 10,
    type: 1
}
const getBillDetail = function(parmas) {
    parmas = Object.assign({}, DEFAULTBILL, parmas);
    return fetch(BILLPATH, parmas);
}

/**
 * 获取快捷支付
 */
const FASTBUYPATH = 'c=onefive&do=onefivefastbuy&m=weisrc_dish';
const getFastBuy = function(params) {
    return fetch(FASTBUYPATH, params);
}

/**
 * 快捷支付 调取微信支付
 */
const FASTBUYPAYPATH = 'c=onefive&do=onefivewxfastpay&m=weisrc_dish';
const getFastBuyPay = function(params) {
    var PATH = FASTBUYPAYPATH + '&inmoney=' + params.inmoney + '&outmoney=' + params.outmoney + '&access_token=' + params.access_token + '&paymoney=' + params.paymoney + '&remark=' + params.remark + '&aid=' + params.aid
    return fetch(PATH, params,'POST');
}

module.exports = {
    setNavTtitle: setNavTtitle, //1
    ajaxLogin: ajaxLogin,
    getIndexDetail: getIndexDetail,
    getIndexData: getIndexData, //2
    getAllPraise: getAllPraise, //3
    submitPraise: submitPraise, //4
    lookPraise: lookPraise, //5
    getMyCenter: getMyCenter, //6
    getCouponList: getCouponList, //7
    getAddCouponNotice, //领取优惠券通知后台
    getCreatOrder: getCreatOrder, //8
    getAllOrderList: getAllOrderList, //9
    getCarteOrderList: getCarteOrderList,
    getQueueIndex: getQueueIndex,
    getQueueList: getQueueList,
    startQueue: startQueue,
    getQueueDetail: getQueueDetail,
    cancelQueue: cancelQueue,
    delQueue: delQueue,
    getGoodsDetail: getGoodsDetail,
    setCart: setCart,
    getClassifyCart: getClassifyCart,
    checkCartChange: checkCartChange,
    getOrderDetail: getOrderDetail,
    getZtOrderDetail: getZtOrderDetail,
    getCreatedOrder: getCreatedOrder,
    getDelayOrder: getDelayOrder,
    getNearByShopDetail: getNearByShopDetail,
    getPaySuccessData: getPaySuccessData,
    goPayMoney: goPayMoney,
    checkPayStatic: checkPayStatic,
    lockPayFail: lockPayFail,
    getUserCard: getUserCard,
    getTradeInfo: getTradeInfo,
    getReceiveVip: getReceiveVip,
    getVipInfo,
    getVipLevel,
    getVIPUserInfo,
    getVipDetail,
    getVipRule: getVipRule,
    getVipIsActionFiled: getVipIsActionFiled,
    submitVipAction: submitVipAction,
    getViPoints: getViPoints,
    getIntegarlIndex: getIntegarlIndex,
    getIgGoods,
    getExchangeGoods,
    cancelExchange,
    getExchangeGoodsList,
    getExchangeOrder,
    getMobileCode,
    getShopDetail,
    getIgAddress,
    editIgAddress,
    changeCart,
    getCartegory,
    getGoodsList,
    checkYuDianStatic,
    getYuDianGoodsList,
    getYuDianCartegory,
    getYuDianComfirmGoods,
    getYuDianMergeDetail,
    submitYuDingOrder,
    getYuDianOderList,
    getYuDianODetail,
    getComfirmGoods,
    checkGoodsTid,
    checkTableStatic,
    submitOrderCart,
    getYuDianChangeTable,
    getQueueNum,
    editCartNum,
    getNearShopList,
    sendRecharge,
    getPaymentCode,
    fetPay,
    scoreStaicNew,
    getPictxtDetail,
    printDetail,
    getBillDetail,
    depostCallback,
    getFastBuy,  //快捷支付
    getFastBuyPay, //快捷支付调取微信支付
    GetTremGo,
    getCreatOrder,
    getAdressList
    
}