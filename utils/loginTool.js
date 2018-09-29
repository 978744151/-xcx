



/**
 * 接口文件 
 * create 2017-06-08 ypf
 */

// const HOST = app.extURI ? 'https://static.xiaodian.in/app/onefive.php' : 'https://dc.xiaodian.in/app/onefive.php'

// const HOST = 'https://static.xiaodian.in/';


/**
 * [getLoginInfo 获取首页信息]
 * @param  {[type]} _code          [小程序授权码]
 * @param  {[type]} _id            [门店ID]
 * @param  {[type]} _encryptedData [小程序encryptedData]
 * @param  {[type]} _iv            [小程序iv]
 * @return {[type]}                [return Promise]
 */
let getLoginInfo = function(params) {
  var app = getApp();
  console.log(app.extURI)
    var HOST = app.extURI ? 'https://cydev.tiantianremai.cn/' : 'https://cy.tiantianremai.cn/';
    // console.log(params)
    return new Promise((resolve, reject) => {
        wx.request({
          url: HOST + 'app/onefive.php?c=onefive&do=wxappauth&m=weisrc_dish',
            method: 'POST',
            dataType: 'json',
            data: params,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                resolve(res);
            },
            fail: function(res) {
                reject(res);
            }
        })
    })
}

/**
 * [getUserInfo 获取用户信息]
 * @return {[type]} [return Promise]
 */
let getUserInfo = function() {
    return new Promise((resolve, reject) => {
        wx.getUserInfo({
            withCredentials: true,
            success: function(res) {
                resolve(res);
            },
            fail: function(res) {
                reject(res);
            }
        });
    })
}

/**
 * [getLogin 微信小程序登录]
 * @return {[type]} [return Promise]
 */
let getLogin = function() {
    return new Promise((resolve, reject) => {
        wx.login({
            success: function(res) {
                resolve(res)
            },
            fail: function(res) {
                reject(res)
            }
        });
    })
}


let getLocation = function() {
    return new Promise((resolve, reject) => {
        wx.getLocation({
            type: 'wgs84',
            success: resolve,
            fail: reject,
        })
    })

}

module.exports = {
    getLoginInfo: getLoginInfo,
    getUserInfo: getUserInfo,
    getLogin: getLogin,
    getLocation: getLocation
}
