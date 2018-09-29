var app = getApp(),
    API = require('../../utils/api.js'),
    wechat = require('../../utils/wechat.js'),
    utils = require('../../utils/util.js');
Page({
    data: {
        isIndexLoad: true,
        praise: {
            yawp: { name: '不满', img: 'https://pic.repaiapp.com/pic/ef/be/58/efbe58f72b6ca0566852e9b7a219c927d5e2f6ed.png' },
            common: { name: '一般', img: 'https://pic.repaiapp.com/pic/9a/7d/3f/9a7d3fd1bfed712e112600fb2847f5a30bcd3500.png' },
            ok: { name: '满意', img: 'https://pic.repaiapp.com/pic/7a/e5/30/7ae530f2550f258e25946884804614b72db68c52.png' },
            supPraise: { name: '超赞', img: 'https://pic.repaiapp.com/pic/65/e9/e9/65e9e9c607c234bb32dd29b5661ccf3e3ac0cc0e.png' },
        },
        dialog: {
            color: app.currentbg.bgcolor,
            body: '',
            hidden: true
        },
        selectBox:false,//店长推荐
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 300,
        shopInfo: {}, //商家信息
        showMessage: false,
        messageContent: '',
        params: {},
        couponList: [], //优惠券列表
        couponCount: 0, //优惠券数量
        storeid: null,
        commentList: [], //评论列表
        toView: '',    //店长推荐toview
        isShowToViewBtn: false,  //显示toview按钮
        reList: {}, //优惠券激活状态对象
        isRe: false, //启用激活对象
        showKing:true,//大王卡弹窗,
        types:{},
        moneyBox:false,
        box:true,
        redMoney:false,
        redPackData:'',
        redNum:'',//后台返回弹框总次数
        needNum:'',//剩余弹框次数
        
        unicom: null,
        money: null,
        individual: null,
        ten: null,
        hundred: null,
        kingCard:true

    },
    onLoad: function (options) {
      wx.setStorageSync('flag', '0');
      //this.onGetData()
      
    },
    onHide() {
        this.setData({ isRe: false })
    },
    //红包关闭
    redClose(){
      this.setData({
        moneyBox:false
      })
    },
    ////立即拆开
    openBack(e){
      console.log(e)
      this.setData({
        box:false,
        redMoney:true
      })
      var id = e.currentTarget.dataset.id;
      var parmas = { access_token: this.data.access_token, packet_id:id};
      API.openRedBack(parmas).then((res) => {
        var data = res.data.data;

        if (data.tradeId) {
          this.setData({ tradeId: data.tradeId });
          // wx.redirectTo({
          //     url: `/pages/itgexchange/itgexchange?id=${data.tradeId}`
          // })
          // return;
        }
        let { items, address, status, msg } = data;
        this.setData({ items, address, status, msg, isIndexLoad: false });
        wx.stopPullDownRefresh() //停止下拉刷新
      }, (err) => {
        this.setData({ isIndexLoad: false });
        console.error(err);
        app.showToast('请求数据错误')
        wx.stopPullDownRefresh() //停止下拉刷新
      })
    },
    //  导航
    goMap: function () {
        var lat = parseFloat(this.data.shopInfo.storeinfo.storelat);
        var lng = parseFloat(this.data.shopInfo.storeinfo.storelng);
        wx.openLocation({
            latitude: lat,
            longitude: lng,
            name: this.data.shopInfo.storeinfo.storename,
            address: this.data.shopInfo.storeinfo.storeaddress,
            scale: 18
        })
    },
    // 电话
    calling: function () {
        wx.makePhoneCall({
            phoneNumber: this.data.shopInfo.storeinfo.storetel,
            success: res => { },
            fail: res => { }
        })
    },
    // 评价图片预览
    imgView: function (e) {
        console.log(e.currentTarget.dataset.picarr)
        wx.previewImage({
            current: e.currentTarget.dataset.pic,
            urls: e.currentTarget.dataset.picarr,
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
    this.setData({
      individual,
      ten: ten || '',
      hundred: hundred || ''
    })
  },
    onShow: function () {
        if (app.navTitle) {
            API.setNavTtitle(app.navTitle);
        }
        app.checkSession((params) => {
            var that = this, access_token = params.access_token, storeid = app.shopId;
            var dataJSON = { access_token, storeid, access_token }
            that.setData({ access_token, storeid })
            Promise.all([API.getIndexData(dataJSON), API.getCouponList(dataJSON), API.getIndexRed(dataJSON)]).then((res) => {
                console.log(res,333);
                const data1 = res[0].data.data,
                      redData=res[2].data.data, 
                { allList, listCount } = res[1].data.data;
                wx.setStorageSync('storetel', data1.storeinfo.storetel)
                wx.setStorageSync('storehours', data1.storeinfo.storehours)
                wx.setStorageSync('is_show', data1.storeinfo.is_show)
                var is_show = data1.storeinfo.is_show,
                    storehours = data1.storeinfo.storehours,
                    getHours = new Date().getHours();
                // storehours = storehours.split('/') //判断营业时间
                // var busyHours = []
                // var t1, t2, t3, t4, falg = true;;
                // for (var i = 0; i < storehours.length;i++){
                //   var date = new Date(); 
                //   var dateTime = date.getTime()
                //   var hours = storehours[i].split('-');
                //   console.log(hours)
                //   t1 = storehours[i].split('-')[0];
                //   t2 = storehours[i].split('-')[1];
                //   t1 = t1.split(':'),t2 = t2.split(':')
                //   var beginTime = date.setHours(t1[0], t1[1]), lastTime = date.setHours(t2[0], t2[1])
                //   console.log(t1, t2, storehours, date, dateTime)
                //   if (dateTime > beginTime && dateTime < lastTime ){
                //     console.log(true)
                //   }else{
                //     console.log(false)
                //   }
                // }
                let commentList =  this.computedCommentList(data1.storecomment.list);
                let toView = data1.storerecommend.counts > 4 ? `to-0` : '';
                let isShowToViewBtn = data1.storerecommend.counts > 4;
                wx.setStorageSync('userinfo', data1.userinfo);
                this.setData({
                    shopInfo: data1,
                    isIndexLoad: false,
                    couponList:  allList,
                    couponCount: listCount,
                    commentList,
                    toView,
                    isShowToViewBtn,
                    unicom: data1.userinfo.unicom,
                    money: data1.userinfo.money,
                    isVip: data1.userinfo.isVip,
                    is_show,
                    redPackData:redData,
                    redNum: redData.info.num_pop,
                  unicom: data1.userinfo.unicom,
                  money: data1.userinfo.money
                }); 
              console.log(this.data.unicom , this.data.money)
              this.spiltNum(String(data1.userinfo.money))
              console.log(this.data.unicom , this.data.money)
                wx.setStorageSync('tel', data1.storeinfo.storetel);
                wx.setStorageSync('storetename', data1.storeinfo.storename);
                if (!this.data.isRe) {
                    this.computedCoupList();
                }
                var that=this;
                if (JSON.stringify(redData.info) !== '{}') {
                  wx.getStorage({
                    key: 'redPocket',
                    success: function (res) {
                      that.yesRedPocket(res.data)
                      
                    },
                    fail: function () {
                      that.noRedPocket();
                      
                    }
                  })
                }else{
                  this.setData({
                    kingCard:true,
                    moneyBox:false
                  })
                }
            }, (err) => {
              that.setData({ isIndexLoad: false })
              utils.showMessage(that, '请求接口错误')
                console.log(err);
            })
        });
        
    },
    yesRedPocket(params) {
      let newDate = new Date(utils.formatTime(new Date()));
      let locDate = new Date(params.time)

      if (params.num !== parseInt(this.data.redPackData.info.num_pop)) { //判断后台有没有修改
        wx.setStorage({
          key: 'redPocket',
          data: {
            time: params.time,
            num: parseInt(this.data.redPackData.info.num_pop),
            onum: params.onum
          },
        })
        
      }
      if (newDate.getTime() == locDate.getTime()) {
        if (params.num > params.onum) {
          let obj = {
            time: params.time,
            num: params.num,
            onum: params.onum + 1
          }
          wx.setStorage({
            key: 'redPocket',
            data: obj,
          })
          this.showRedPocket();
          
        }
      } else {
        wx.setStorage({
          key: 'redPocket',
          data: {
            time: utils.formatTime(new Date()),
            num: parseInt(this.data.redPackData.info.num_pop),
            onum: 1
          },
        })
        
        this.showRedPocket()
        
      }
    },
    noRedPocket() {
      wx.setStorage({
        key: 'redPocket',
        data: {
          time: utils.formatTime(new Date()),
          num: parseInt(this.data.redPackData.info.num_pop),
          onum: 1
        },
      })
      this.showRedPocket()
      
    },
    showRedPocket() { //显示红包
      let data = this.data.redPackData.info
      this.setData({
        moneyBox: true,
        kingCard: false
      })
    },
    onShareAppMessage: function () {
        var that = this;
        return {
            title: '欢迎光临',
            path: '/pages/index/index',
            success: function (res) {
                console.log(res)
                app.showToast("转发成功", 'success')
            },
            fail: function (res) {
                console.log(res)
                utils.showMessage(that, '取消转发')
            }
        }
    },
    onPullDownRefresh() {
        this.onShow();
        wx.stopPullDownRefresh();
    },
    /**
     * 计算优惠券
     */
    computedCoupList() {
        const couponList = this.data.couponList;
        var reList = {}; //计算后是否领取优惠券列表
        couponList.map((item) => {
            if (item.is_has == 1 || item.is_over == 1) {
                reList[item.id] = 1;
            } else {
                reList[item.id] = 0;
            }

        })
        this.setData({ reList })
    },
    /**
     * 过滤评论信息 名字
     */
    computedCommentList(commentList) {
        let _list = [];
        if (commentList instanceof Array && commentList.length > 0) {
            commentList.map((item) => {
                var _item = item
                _item.nickname = utils.funcName(item.nickname);
                _list.push(_item)
            })
        } else {
            _list = commentList;
        }
        return _list
    },
    /**
    * 领取优惠券
    */
    addCoupon(e) {
        if(this.data.isVip != 1) {
            wx.showToast({
              title: '请先开启会员',
          })
          return
        }
        console.log(e);
        const index = e.currentTarget.dataset.index,
            id = e.currentTarget.dataset.id,
            ishas = e.currentTarget.dataset.ishas,
            isover = e.currentTarget.dataset.isover,
            couponList = this.data.couponList,
            curCoupon = couponList[index];

        var params = [];

        if (ishas == 0 && isover != 1) {
            var cardId = curCoupon.card_id;
            var cardExt = JSON.stringify(curCoupon.cardExt);
            params.push({ cardId, cardExt });

            this.wechatAddCard(params, id);
        }
        console.log(params,'ttt')
    },
    //领取红包
    getCoupon(e) {
      if (this.data.isVip != 1) {
        wx.showToast({
          title: '请先开启会员',
        })
        return
      }
      console.log(e);
      const id = e.currentTarget.dataset.id;
      var params = [],
        redPackData = this.data.redPackData.info;
      var cardId = redPackData.card_id;
      var cardExt = JSON.stringify(redPackData.cardExt);
      var liType = e.currentTarget.dataset.type;
      var form='onefive_red_list'
        params.push({ cardId, cardExt, form})
        this.wechatGetCard(params, id);
      console.log(params, 'ttt111')
    },
    /**
     * 调用微信领取接口
     */
    wechatAddCard(params, id) {
      var reList = this.data.reList;
      wechat.addCard(params).then((res) => {
        console.log('卡券', res);
        reList[id] = 1;
        this.setData({ reList, isRe: true })
        var code = res.cardList[0].code,
          access_token = this.data.access_token,
          card_id = res.cardList[0].cardId;
        // console.log(res);
        API.getAddCouponNotice({ code, card_id, access_token }).then((res) => {

          this.onShow();
          app.showToast('领取优惠券成功', 'success')
          console.log(res)
        }, (err) => {
          console.log(err)
        })
      }, (err) => {
        // utils.showMessage(this, err.errMsg);
        console.log(err);
      })
    },
    wechatGetCard(params, id) {
        var reList = this.data.reList;
        wechat.addCard(params).then((res) => {
          console.log('卡券',res);
            reList[id] = 1;
            this.setData({ reList, isRe: true })
            var code = res.cardList[0].code,
                access_token = this.data.access_token,
                card_id = res.cardList[0].cardId,
                from = 'onefive_red_list';
            // console.log(res);
            API.getAddCouponNotice({ code, card_id, access_token, from}).then((res) => {

                this.onShow();
                app.showToast('领取优惠券成功', 'success')
                console.log(res)
            }, (err) => {
                console.log(err)
            })
        }, (err) => {
            // utils.showMessage(this, err.errMsg);
            console.log(err);
        })
    },
    /**
     * 点击滑动
     */
    moveCommendView(e) {
        const commendList = this.data.shopInfo.storerecommend.list;

        let toView = this.data.toView;
        let index = toView.split('-')[1];

        if ((parseInt(index) + 4) >= commendList.length) {
            // var isShowToViewBtn = false
            this.setData({ toView: "to-0" })
        } else {
            index = parseInt(index) + 1;
            toView = `to-${index}`;
            this.setData({ toView })
        }
    },
    /**
     * 点击会员卡色块
     */
    tapVip(e) {
        const shopInfo = this.data.shopInfo,
            url = e.currentTarget.dataset.url,
            dialog = this.data.dialog,
            card = shopInfo.card;

        if (card.iscard == 0) {
            dialog.hidden = false;
            dialog.body = card.message;
            this.setData({ dialog })
        } else {
            wx.navigateTo({
                url: url
            })
        }
    },
    /**
     * 点击知道了
     */
    closePopover(){
        var dialog = this.data.dialog;
        dialog.hidden = true;
        this.setData({ dialog })
    },
    // 打开外卖小程序
  goWm:function(){
    wx.navigateToMiniProgram({
      appId: '',//外卖小程序appid
      path: '',//空为默认首页
      extraData: {},//需要传递的参数
      envVersion: 'develop',
      success(res) {
        // 打开成功
      },
      fail(res){
        //失败回掉
      },
    })
  },
  //关闭推荐方式弹框
  selectClose:function(){
    this.setData({
      selectBox:false
    })
  },
  //店长推荐
  hotType:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.id
    var hottype = e.currentTarget.dataset.type;
    var types = this.data.types
    types.openTs = hottype.indexOf('1') != -1 ?  1 : 0 
    types.openWm = hottype.indexOf('2') != -1 ? 1 : 0 
    types.openZt = hottype.indexOf('3') != -1 ? 1 : 0 
    this.setData({
      selectBox:true,
      types: types
    })
  },
  // 关闭大王卡弹窗
  closeKingModal() {
    wx.showTabBar();
    this.setData({
      uncion: 1,
      money: 0
    });
  },

  // 去看看
  goKingCard(){
    
  },
  
})
