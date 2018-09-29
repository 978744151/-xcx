/**
 * created 2017-06-09
 */

var app = getApp();


///////////////////////////////////////////////////////////
// const HOST = 'https://dc.xiaodian.in/app/onefive.php' //
///////////////////////////////////////////////////////////
const HOST = 'https://op.tiantianremai.cn/wmplus/onefive/'
console.log(HOST, app.extURI)
/**
 * [exports description]
 * @param  {[type]} path   [请求路径]
 * @param  {[type]} parmas [请求参数]
 * @return {[type]}        [return Promise]
 */
module.exports = function(path, parmas, method = 'GET') {
  let URL = path.includes('https//') ? path : `${HOST}${path}`;
parmas.weid = app.weid;
return new Promise((resolve, reject) => {
    wx.request({
        url: URL,
        method: method,
        data: Object.assign({}, parmas),
        header: {
            'Content-Type': 'json'
        },
        success: resolve,
        fail: reject
    })
})
}
