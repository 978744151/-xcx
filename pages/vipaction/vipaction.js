var app = getApp(),
    utils = require('../../utils/util.js'),
    API = require('../../utils/api.js');


const date = new Date()
const years = []
const months = []
const days = []
const hours = []
var code = null
var y = 1990, m = 1, d = 1;

//时间日期
for (let i = 1950; i <= date.getFullYear(); i++) {
    years.push(i)
}

for (let i = 1; i <= 12; i++) {
    var j = i;
    if (j < 10) {
        j = "0" + String(j);
    }
    months.push(j)
}

for (let i = 1; i <= 31; i++) {
    var j = i;
    if (j < 10) {
        j = "0" + String(j);
    }
    days.push(j)
}

for (let i = 1; i <= 60; i++) {
    var j = i;
    if (j < 10) {
        j = "0" + String(j);
    }
    hours.push(j)
}

Page({
    data: {
        //调用系统颜色
        pagecolor: {
            bgcolor: app.currentbg.bgcolor,
            textcolor: app.currentbg.textcolor
        },
        access_token: null,
        date: '',
        sexArray: ['男', '女'],
        sex: '',
        startdate: '1990-01-01',
        birthdayStr: '生日一经填写无法修改',
        sexStr: '请选择您的性别',
        endate: utils.formatTime(new Date()),
        date: '',
        tel: '',
        email: '',
        name: '',
        pcode: '',
        isagree: true,
        showMessage: false, //验证出错
        messageContent: '',
        isIndexLoad: true,
        requireFields: {}, //必填字段
        checkFieids: {}, //选填字段
        isdisable: true,
        verifyInfo: '获取验证码',
        scrollHeight: null,
        isVipRuleHidde: true,
        shopName: '',
        years: years,
        months: months,
        days: days,
        isDate: true,
        dateValue: [40, 0, 0, 0, 0],
        dialog: {
            color: app.currentbg.bgcolor,
            text: '激活会员卡成功',
            hidden: true
        },
        active:1
    },
    onLoad: function (options) {
        wx.login({
          success: function (res) {
            console.log(res)
            code = encodeURIComponent(res.code);
          }
        });
        var access_token = app.access_token || wx.getStorageSync('access_token'),
            res = wx.getSystemInfoSync(),
            shopName = wx.getStorageSync('shopname'),
            scrollHeight = (Number(res.windowHeight) * 750 / res.windowWidth) - 190 * 2;
        this.setData({ access_token, scrollHeight, shopName });

    },
    onShow: function () {
        this.getData();
    },
    onPullDownRefresh() {
        this.getData();
    },
    handActive(){
      this.setData({
        active : 2
      })
    },
    getPhoneNumber: function (e) {
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      var that = this;
      var iv = encodeURIComponent(e.detail.iv);
      var enData = encodeURIComponent(e.detail.encryptedData);
      var token = wx.getStorageSync('access_token') || '';
      console.log(iv,enData,token)
      wx.request({
        url: 'https://op.tiantianremai.cn/v1/auth/getPhoneNum',
        data: {
          code: code,
          shopId: app.shopId,
          enData: enData,
          iv: iv
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data.data)
          that.setData({
            tel: res.data.data.data.phoneNumber,
            active: 1
          })
          console.log(that.data.mobile)
          wx.login({
            success: function (res) {
              code = encodeURIComponent(res.code);
            }
          });
        }
      })
    }
  },
    timeout: function () {
        var re = /^1[3|4|5|7|8|9][0-9]\d{4,8}$/;
        if (!this.data.tel) {
            utils.showMessage(this, '手机号不能为空');
            return false;
        } else if (!re.test(this.data.tel)) {
            utils.showMessage(this, '手机号格式有误');
            return false;
        } else {
            if (!this.data.isdisable) {
                return;
            }
            this.getCode();
        }
    },
    getCode() {
        var parmas = { access_token: this.data.access_token, moblie: this.data.tel },
            count = 60,
            that = this;

        API.getMobileCode(parmas).then((res) => {
            if (res.data.status) {
                var timer = setInterval(function () {
                    count--;
                    if (count >= 1) {
                        that.setData({
                            verifyInfo: '获取验证码(' + count + ')',
                            isdisable: false
                        })
                    } else {
                        that.setData({
                            verifyInfo: '重新获取验证码',
                            isdisable: true
                        })
                        clearInterval(timer);
                    }
                }, 1000);
                app.showToast('短信发送成功', 'success');
            } else {
                utils.showMessage(this, res.data.msg);
            }

        }, (err) => {
            console.error(err);
            utils.showMessage(this, '请求数据错误');
        })
    },
    getData: function () { //获取激活条件
        API.getVipIsActionFiled({ access_token: this.data.access_token })
            .then((res) => {
              console.log(res.data.data)
                console.log(res);
                this.setData({
                    isIndexLoad: false,
                    requireFields: res.data.data.obligatory,
                    checkFieids: res.data.data.optional
                })
                // this.submitFn();
                wx.stopPullDownRefresh() //停止下拉刷新
            }, (err) => {
                console.error(err);
                this.setData({
                    isIndexLoad: false,
                })
                app.showToast('数据请求错误')
                wx.stopPullDownRefresh() //停止下拉刷新
            })
    },
    bindDateChange: function (e) { //选择生日
        this.setData({
            date: e.detail.value
        })
    },
    bindPickerChange: function (e) { //选择性别
        var index = e.detail.value,
            sex = this.data.sexArray[index];
        this.setData({ sex: sex });
    },
    bindInput: function (e) {
        var type = e.currentTarget.dataset.typeinput;
        switch (type) {
            case 'tel':
                this.setData({ tel: e.detail.value });
                break;
            case 'pcode':
                this.setData({ pcode: e.detail.value });
                break;
            case 'name':
                this.setData({ name: e.detail.value });
                break;
            case 'email':
                this.setData({ email: e.detail.value });
                break;
            default:
                break;
        }
    },
    submitFn: function () {
        var ajaxData = { 'access_token': this.data.access_token, isEdit: 0 },
            regTel = /^1[345789]\d{9}$/,
            regName = /^[\u4E00-\u9FA5]{2,6}$/,
            regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
            requireFields = this.data.requireFields,
            checkFieids = this.data.checkFieids;


        for (var i = 0; i < requireFields.length; i++) {
            if (requireFields[i].bind == 'realname') { //验证姓名
                if (!this.data.name) {
                    utils.showMessage(this, '姓名必填');
                    return;
                } else {
                    ajaxData.realname = this.data.name;
                }
            }
            if (requireFields[i].bind == 'mobile') {
                if (!this.data.tel) {
                    utils.showMessage(this, '手机号必填');
                    return;
                } else if (!regTel.test(this.data.tel)) {
                    utils.showMessage(this, '手机号填写不正确');
                    return;
                } else {
                    ajaxData.mobile = this.data.tel;
                }
                if(this.data.active == 2){
                  if (!this.data.pcode) { //验证码校验
                    utils.showMessage(this, '验证码必填');
                    return;
                  } else if (this.data.pcode.length != 4) {
                    utils.showMessage(this, '填写4位验证码');
                    return;
                  } else {
                    ajaxData.pcode = this.data.pcode;
                  }
                }else{

                }
              
            }


            if (requireFields[i].bind == 'gender') {
                if (!this.data.sex) {
                    utils.showMessage(this, '性别为必选');
                    return;
                } else {
                    ajaxData.gender = this.data.sex;
                }
            }


            if (requireFields[i].bind == 'birthday') {
                if (!this.data.date) {
                    utils.showMessage(this, '生日为必选');
                    return;
                } else {
                    ajaxData.birthday = this.data.date;
                }
            }

            if (requireFields[i].bind == 'email') {
                if (!this.data.email) {
                    utils.showMessage(this, '邮箱为必填');
                    return;
                } else if (!regEmail.test(this.data.email)) {
                    utils.showMessage(this, '邮箱格式不正确');
                    return;
                } else {
                    ajaxData.email = this.data.email;
                }
            }

        }


        for (var i = 0; i < checkFieids.length; i++) {
            if (checkFieids[i].bind == 'realname') { //验证姓名
                if (!regName.test(this.data.name) && !!this.data.name) {
                    utils.showMessage(this, '用户填写不正确');
                    return;
                } else {
                    ajaxData.realname = this.data.name;
                }
            }

            if (checkFieids[i].bind == 'gender') { //验证姓名
                ajaxData.gender = this.data.sex;
            }

            if (checkFieids[i].bind == 'birthday') { //验证姓名
                ajaxData.birthday = this.data.date;

            }

            if (checkFieids[i].bind == 'email') {
                if (!regEmail.test(this.data.email) && !!this.data.email) {
                    utils.showMessage(this, '邮箱格式不正确');
                    return;
                } else {
                    ajaxData.email = this.data.email;
                }
            }
        }
      ajaxData.type = this.data.active;
      console.log(1)
        if (!this.data.isagree) {
            utils.showMessage(this, '请阅读小店规则');
            return;
        }
        wx.showLoading({ 'title': '提交中...', mask: true })
        API.submitVipAction(ajaxData).then((res) => {
            console.log(res.data.status);
            wx.hideLoading()
            if (res.data.status) {
                this.showRegisterDialog();
                // app.showToast('会员激活成功', 'success');
                // wx.navigateBack({
                //     delta: 1
                // })
            } else {
                utils.showMessage(this, res.data.msg);
            }
        }, (err) => {
            wx.hideLoading();
            console.eror(err);
        })
    },
    /**
     * 注册成功 弹窗
     */
    showRegisterDialog(e) {
        // var dialog = this.data.dialog;
        // dialog.hidden = false;
        // this.setData({ dialog })
        app.showToast('激活会员卡成功','success')
        setTimeout(() => {
            wx.navigateBack({ delta: 1 })
        }, 1000);
    },
    /**
     * 点击弹窗 知道了
     */
    iKown() {
        var dialog = this.data.dialog;
        dialog.hidden = true;
        this.setData({ dialog })
        wx.navigateBack({
            delta: 1
        })
    },
    /**
     * 点击复选框 是否同意
     */
    checkboxChange: function (e) {
        this.setData({
            isagree: !this.data.isagree
        })
    },
    /**
     * 点击阅读会员卡守则
     */
    showRule() {
        wx.setNavigationBarTitle({ title: '会员卡守则' })
        this.setData({ isVipRuleHidde: false, isagree: true })
    },
    closeRule() {
        wx.setNavigationBarTitle({ title: '激活VIP' })
        this.setData({ isVipRuleHidde: true })
    },
    dateChange: function (e) {
        var that = this;
        y = e.detail.value[0] + 1950;
        m = utils.addTen(e.detail.value[1] + 1);
        d = utils.addTen(e.detail.value[2] + 1);
        // h = e.detail.value[3] + 1;
        // i = e.detail.value[4] + 1;
        //console.log(e)
    },
    //确定选择
    ideChoice: function (e) {
        var that = this;
        var $act = e.currentTarget.dataset.act;
        var $mold = e.currentTarget.dataset.mold;

        //时间日期
        if ($act == 'confirm' && $mold == 'dateTime') {
            var dateTime = y + '-' + m + '-' + d;
            that.setData({
                date: dateTime,

            })
        }

        //城市
        if ($act == 'confirm' && $mold == 'city') {
            that.setData({
                cityText: provinceName + ' ' + cityName + ' ' + countyName,
            })
        }
        that.setData({
            isCity: true,
            isDate: true
        })
    },
    //调起选择器
    risePicker: function (e) {
        var that = this;
        var $mold = e.currentTarget.dataset.mold;
        if ($mold == 'dateTime') {
            that.setData({
                isDate: false
            })
        }
        if ($mold == 'city') {
            that.setData({
                isCity: false
            })
        }
    },
})