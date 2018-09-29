// var app = getApp(),
//     utils = require('../../utils/util.js'),
//     API = require('../../utils/api.js');
// Page({
//     data: {
//         //调用系统颜色
//         pagecolor: {
//             bgcolor: app.currentbg.bgcolor,
//             textcolor: app.currentbg.textcolor
//         },
//         access_token: null,
//         showMessage: false,
//         messageContent: '',
//         typeValue: '',
//         typeName: '',
//         inputValue: '',
//         sex: '',
//         birthday: '',
//         sexArray: ['男', '女'],
//         userInfo: {},
//     },
//     onLoad: function(options) {
//         var access_token = app.access_token || wx.getStorageSync('access_token'),
//             type = options.type || '',
//             typeValue = options.value || '';
//         this.setData({ access_token, typeValue });
//         this.switchType(type);

//     },
//     onShow: function() {
//         var that = this;

//     },
//     bindDateChange: function(e) { //选择生日
//         this.setData({
//             birthday: e.detail.value
//         })
//     },
//     onPullDownRefresh() { //
//         wx.stopPullDownRefresh();
//     },
//     bindInput(e) {
//         this.setData({ inputValue: e.detail.value });
//     },
//     submitFn() {

//         var ajaxData = { access_token: this.data.access_token, isEdit: 1 },
//             regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
//         switch (this.data.type) {
//             case 'realname':
//                 if (!this.data.inputValue) {
//                     utils.showMessage(this, '请输入姓名');
//                     return;
//                 } else if (this.data.typeValue === this.data.inputValue) {
//                     wx.navigateBack({
//                         delta: 1
//                     })
//                     return;
//                 } else {
//                     ajaxData.realname = this.data.inputValue;
//                 }
//                 break;
//             case 'gender':
//                 if (!this.data.sex && this.data.sex != '请选择性别') {
//                     utils.showMessage(this, '请选择性别');
//                     return;
//                 } else if ( this.data.sexArray[this.data.typeValue-1] === this.data.sex) {
//                     wx.navigateBack({
//                         delta: 1
//                     })
//                     return;
//                 } else {
//                     ajaxData.gender = this.data.sex;
//                 }
//                 break;
//             case 'birthday':
//                 if (!this.data.birthday && this.data.birthday != '请选择生日') {
//                     utils.showMessage(this, '请选择生日');
//                     return;
//                 } else if (this.data.typeValue === this.data.birthday) {
//                     wx.navigateBack({
//                         delta: 1
//                     })
//                     return;
//                 } else {
//                     ajaxData.birthday = this.data.birthday;
//                 }
//                 break;
//             case 'email':

//                 if (!this.data.inputValue) {
//                     utils.showMessage(this, '请输入邮箱');
//                     return;
//                 } else if (!regEmail.test(this.data.inputValue)) {
//                     utils.showMessage(this, '请输入正确邮箱');
//                     return;
//                 } else if (this.data.inputValue.length > 50){
//                     utils.showMessage(this, '邮箱长度超过限制');
//                     return;
//                 }else if (this.data.typeValue === this.data.inputValue) {
//                     wx.navigateBack({
//                         delta: 1
//                     })
//                     return;
//                 } else {
//                     ajaxData.email = this.data.inputValue;
//                 }
//                 break;
//         }

//         wx.showLoading({ 'title': '提交中...', mask: true })
//         API.submitVipAction(ajaxData).then((res) => {
//             console.log(res.data.status);
//             wx.hideLoading()
//             if (res.data.status) {
//                 app.showToast(`修改${this.data.typeName}成功`, 'success', '', () => {
//                     wx.navigateBack({
//                         delta: 1
//                     })
//                 })
//             } else {
//                 utils.showMessage(this, res.data.msg);
//                 this.setData({ iSubmit: false });
//                 // app.showToast(res.data.data.msg)
//             }
//         }, (err) => {
//             wx.hideLoading();
//             console.eror(err);
//         })
//     },
//     switchType(e) {
//         switch (e) {
//             case 'gender':
//                 var sex = (this.data.typeValue == 1 || this.data.typeValue == 2) ? this.data.sexArray[this.data.typeValue-1] : '请选择性别';
//                 this.setData({ type: 'gender', typeName: '性别', sex });
//                 wx.setNavigationBarTitle({ title: '性别' });
//                 break;
//             case 'realname':
//                 this.setData({ type: 'realname', typeName: '姓名', inputValue: this.data.typeValue });
//                 wx.setNavigationBarTitle({ title: '姓名' });
//                 break;
//             case 'birthday':
//                 var birthday = !!this.data.typeValue ? this.data.typeValue : '请选择生日';
//                 this.setData({ type: 'birthday', typeName: '生日', birthday });
//                 wx.setNavigationBarTitle({ title: '生日' });
//                 break;
//             case 'email':
//                 this.setData({ type: 'email', typeName: '邮箱', inputValue: this.data.typeValue });
//                 wx.setNavigationBarTitle({ title: '邮箱' });
//                 break;
//         }
//     },
//     bindPickerChange: function(e) { //选择性别
//         var index = e.detail.value,
//             sex = this.data.sexArray[index];
//         this.setData({ sex: sex });
//     },
// })


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
        typeValue: '',
        typeName: '',
        inputValue: '',
        sex: '',
        birthday: '',
        sexArray: ['男', '女'],
        userInfo: {},
        type: '',
        isIndexLoad: true,
        start: '1990-01-01'
    },
    onLoad: function (options) {
        var access_token = app.access_token || wx.getStorageSync('access_token'),
            type = options.type || '',
            typeValue = options.value || '';
        this.setData({ access_token, typeValue, type });
        this.switchType(type);

    },
    onShow: function () {
        setTimeout(() => {
            this.setData({ isIndexLoad: false });
        }, 500)
    },
    bindDateChange: function (e) { //选择生日
        this.setData({
            birthday: e.detail.value
        })
    },
    onPullDownRefresh() { //
        wx.stopPullDownRefresh();
    },
    bindInput(e) {
        this.setData({ inputValue: e.detail.value });
    },
    submitFn() {

        var ajaxData = { access_token: this.data.access_token, isEdit: 1 },
            regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        switch (this.data.type) {
            case 'realname':
                if (!this.data.inputValue) {
                    utils.showMessage(this, '请输入姓名');
                    return;
                } else if (this.data.typeValue === this.data.inputValue) {
                    wx.navigateBack({
                        delta: 1
                    })
                    return;
                } else {
                    ajaxData.realname = this.data.inputValue;
                }
                break;
            case 'gender':
                if (!this.data.sex && this.data.sex != '请选择性别') {
                    utils.showMessage(this, '请选择性别');
                    return;
                } else if (this.data.sexArray[this.data.typeValue - 1] === this.data.sex) {
                    wx.navigateBack({
                        delta: 1
                    })
                    return;
                } else {
                    ajaxData.gender = this.data.sex;
                }
                break;
            case 'birthday':
                if (!this.data.birthday && this.data.birthday != '请选择生日') {
                    utils.showMessage(this, '请选择生日');
                    return;
                } else if (this.data.typeValue === this.data.birthday) {
                    wx.navigateBack({
                        delta: 1
                    })
                    return;
                } else {
                    ajaxData.birthday = this.data.birthday;
                }
                break;
            case 'email':

                if (!this.data.inputValue) {
                    utils.showMessage(this, '请输入邮箱');
                    return;
                } else if (!regEmail.test(this.data.inputValue)) {
                    utils.showMessage(this, '请输入正确邮箱');
                    return;
                } else if (this.data.inputValue.length > 50) {
                    utils.showMessage(this, '邮箱长度超过限制');
                    return;
                } else if (this.data.typeValue === this.data.inputValue) {
                    wx.navigateBack({
                        delta: 1
                    })
                    return;
                } else {
                    ajaxData.email = this.data.inputValue;
                }
                break;
        }

        wx.showLoading({ 'title': '提交中...', mask: true })
        API.submitVipAction(ajaxData).then((res) => {
            console.log(res.data.status);
            wx.hideLoading()
            if (res.data.status) {
                app.showToast(`修改${this.data.typeName}成功`, 'success', '', () => {
                    wx.navigateBack({
                        delta: 1
                    })
                })
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
    switchType(e) {
        switch (e) {
            case 'gender':
                var sex = (this.data.typeValue == 1 || this.data.typeValue == 2) ? this.data.sexArray[this.data.typeValue - 1] : '请选择性别';
                this.setData({ type: 'gender', typeName: '性别', sex });
                wx.setNavigationBarTitle({ title: '性别' });
                break;
            case 'realname':
                this.setData({ type: 'realname', typeName: '姓名', inputValue: this.data.typeValue });
                wx.setNavigationBarTitle({ title: '姓名' });
                break;
            case 'birthday':
                var birthday = !!this.data.typeValue ? this.data.typeValue : '生日一经填写无法修改';
                this.setData({ type: 'birthday', typeName: '生日', birthday });
                wx.setNavigationBarTitle({ title: '生日' });
                break;
            case 'email':
                this.setData({ type: 'email', typeName: '邮箱', inputValue: this.data.typeValue });
                wx.setNavigationBarTitle({ title: '邮箱' });
                break;
        }
    },
    bindPickerChange: function (e) { //选择性别
        var index = e.detail.value,
            sex = this.data.sexArray[index];
        this.setData({ sex: sex });
    },
    showMsg() {
        utils.showMessage(this, '生日已填写不能修改');
    }
})