var app = getApp();

function countdown(that) {
    var second = that.data.second
    if (second == 0) {
        if (that.data.type == 'yuding') {
            wx.redirectTo({
                url: `/pages/maskDetail/maskDetail?orderid=${that.data.orderid}`
            })
        } else {
            wx.redirectTo({
                url: `/pages/orderDetail/orderDetail?tablesid=${that.data.tablesid}&orderid=${that.data.orderid}`
            })
        }
        return;
    }
    setTimeout(function () {
        that.setData({
            second: second - 1
        });
        countdown(that);
    }, 1000)
}

Page({
    data: {
        //调用系统颜色
        pagecolor: {
            bgcolor: app.currentbg.bgcolor,
            textcolor: app.currentbg.textcolor
        },
        second: 3,
        isLoading: true,
        tablesid: '',
        orderid: '',
    },

    onLoad: function (options) {
        var tablesid = options.tablesid,
            orderid = options.orderid,
            type = options.type || '';
        this.setData({ tablesid, orderid, type })
        countdown(this)
        console.log(tablesid)
    },
    onShow: function () {
        // wx.setNavigationBarTitle({
        //     title: '提交订单'
        // })
        this.setData({
            isLoading: false
        })
    },

})