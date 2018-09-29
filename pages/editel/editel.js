var app = getApp(),
    utils = require('../../utils/util.js'),
    API = require('../../utils/api.js');
Page({
    data: {
        //调用系统颜色
        pagecolor: {
            bgcolor: app.currentbg.bgcolor,
            textcolor: app.currentbg.textcolor
        },
        access_token: null,
        showMessage: false,
        messageContent: '',
        tel: '',
        pcode: '',
        iSubmit: false,
        isdisable: true,
        verifyInfo: '获取验证码',
    },
    onLoad: function (options) {
        var access_token = app.access_token || wx.getStorageSync('access_token');
        this.setData({ access_token });
    },
    onShow: function () {
        var that = this;

    },
    timeout: function () {
        var re = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
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
    onPullDownRefresh() { //
        wx.stopPullDownRefresh();
    },
    bindInput(e) {
        var type = e.currentTarget.dataset.typeinput;
        switch (type) {
            case 'tel':
                this.setData({ tel: e.detail.value });
                break;
            case 'pcode':
                this.setData({ pcode: e.detail.value });
                break;
            default:
                break;
        }

        if (!!this.data.tel && !!this.data.pcode) {
            this.setData({ iSubmit: true });
        }
    },
    submitFn() {
        var regTel = /^1[34578]\d{9}$/;
        if (!this.data.iSubmit) {
            return;
        }

        if (!regTel.test(this.data.tel)) {
            utils.showMessage(this, '手机号格式有误');
            this.setData({ iSubmit: false });
            return;
        }

        // console.log(this.data.pcode.toString().length)    
        if (this.data.pcode.toString().length != 4) {
            utils.showMessage(this, '请输入4位验证码');
            this.setData({ iSubmit: false });
            return;
        }


        var ajaxData = { access_token: this.data.access_token, isEdit: 1, mobile: this.data.tel, pcode: this.data.pcode };
        wx.showLoading({ 'title': '修改中...', mask: true })
        API.submitVipAction(ajaxData).then((res) => {
            console.log(res.data.status);
            wx.hideLoading()
            if (res.data.status) {
                wx.navigateBack({
                    delta: 1
                })
                utils.showMessage(this, '修改手机号成功');
            } else {
                utils.showMessage(this, res.data.msg);
                this.setData({ iSubmit: false });
                // app.showToast(res.data.data.msg)
            }
        }, (err) => {
            wx.hideLoading();
            console.eror(err);
        })
    },
    getCode() {
        var parmas = { access_token: this.data.access_token, moblie: this.data.tel },
            count = 60,
            that = this;
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

        API.getMobileCode(parmas).then((res) => {
            if (res.data.status) {
                utils.showMessage(this, '短信发送成功');
            } else {
                that.setData({
                    verifyInfo: '重新获取验证码',
                    isdisable: true
                })
                clearInterval(timer);
                utils.showMessage(this, res.data.msg);
            }
        }, (err) => {
            utils.showMessage(this, '请求数据错误');
        })
    }

})
