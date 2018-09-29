/**
 * socket 长连接
 */

const PATH = 'wss://socket.xiaodian.in';

let connectSocket = function(parmas) {
    return new Promise((resolve, reject) => {
        wx.connectSocket({
            url: PATH,
            data: parmas,
            header: {
                'content-type': 'application/json'
            },
            method: "GET",
            success: resolve,
            fail: reject
        })
    })
}

module.exports = {
    connectSocket: connectSocket
}
