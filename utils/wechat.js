var QQMapWX = require('./qqmap-wx-jssdk.min.js');

/**
 * [getUserInfo 获取用户信息]
 * @return {[type]} [return Promise]
 */
let getUserInfo = function () {
    return new Promise((resolve, reject) => {
        wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
                resolve(res);
            },
            fail: function (res) {
                reject(res);
            }
        });
    })
}


/**
 * [getLocation 获取地理定位]
 * @param  {String} type [description]
 * @return {[type]}      [description]
 */
let getLocation = function (type = 'wgs84', flag) {
    return new Promise((resolve, reject) => {
        wx.getLocation({
            type: type,
            success: function (res) {
                resolve(res);
            },
            fail: function (res) {
                reject(res);
            }
        })
    })
}



// title   String  是   提示的标题
// content String  是   提示的内容
// showCancel  Boolean 否   是否显示取消按钮，默认为 true
// cancelText  String  否   取消按钮的文字，默认为"取消"，最多 4 个字符
// cancelColor HexColor    否   取消按钮的文字颜色，默认为"#000000"
// confirmText String  否   确定按钮的文字，默认为"确定"，最多 4 个字符
// confirmColor    HexColor    否   确定按钮的文字颜色，默认为"#3CC51F"
// success Function    否   接口调用成功的回调函数
// fail    Function    否   接口调用失败的回调函数
// complete    Function    否   接口调用结束的回调函数（调用成功、失败都会执行）

let showModal = function (parmas) {
    const DEFAULT = Object.assign({
        title: '',
        content: '',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#666666',
        confirmText: '确定',
        confirmColor: '#f14949'
    });
    parmas = Object.assign({}, DEFAULT, parmas);
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: parmas.title,
            content: parmas.content,
            showCancel: parmas.showCancel,
            cancelText: parmas.cancelText,
            cancelColor: parmas.cancelColor,
            confirmText: parmas.confirmText,
            confirmColor: parmas.confirmColor,
            success: resolve,
            fail: reject
        })
    })
}


/**
 * [getLogin 微信小程序登录]
 * @return {[type]} [return Promise]
 */
let login = function () {
    return new Promise((resolve, reject) => {
        wx.login({
            success: resolve,
            fail: reject,
        })
    })
}

/**
 * [checkSession 验证session]
 * @return {[type]} [description]
 */
let checkSession = function () {
    return new Promise((resolve, reject) => {
        wx.checkSession({
            success: resolve,
            fail: reject
        })
    })
}

const getPower = function () {
    getUserInfo().then((res) => {
        wx.setStorageSync('userInfo', res);
        return myGetLocation('wgs84', true)
    }, (err) => {
        return myGetLocation('wgs84', false)
    })
}


const scanCode = function (onlyFromCamera = true) {
    return new Promise((resolve, reject) => {
        wx.scanCode({
            onlyFromCamera: onlyFromCamera,
            success: resolve,
            fail: reject
        })
    })
}

const myGetLocation = function (type, flag) {
    console.log(`type ${type} | flag ${flag}`)
    getLocation(type, flag).then((res) => {

        wx.setStorageSync('dir', {
            lat: res.latitude,
            lng: res.longitude
        })
        if (!flag) {
            wx.reLaunch({
                url: '/pages/noauthority/index'
            })
        }
    }, (err) => {
        wx.reLaunch({
            url: '/pages/noauthority/index'
        })
    })
}

var demo = new QQMapWX({
    key: 'BQOBZ-FIUCJ-QQFF4-KS546-W2BR3-UKFE4' // 腾讯地图key值
});

const qqMap = function (params) {
    return new Promise((resolve, reject) => {
        demo.reverseGeocoder({
            location: {
                latitude: params.lat, //x
                longitude: params.lng //y
            },
            success: resolve,
            fail: reject
        });
    })
}

const addCard = function (params) {
    return new Promise((reslove, reject) => {
        wx.addCard({
            cardList: params,
            success: reslove,
            fail: reject
        })
    })
}

module.exports = {
    getUserInfo: getUserInfo,
    login: login,
    getLocation: getLocation,
    checkSession: checkSession,
    showModal: showModal,
    getPower: getPower,
    scanCode,
    qqMap,
    addCard
}
