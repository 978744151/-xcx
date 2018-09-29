var app = getApp();
Page({
    data: {
        animationData: {},
        isSuccess: false,
        isMask: false,
        wHeight: 0,
        tabArr:{}
    },

    onLoad: function(options) {
        var res = wx.getSystemInfoSync(),
            wHeight = res.windowHeight;
        this.setData({
            wHeight: wHeight
        })
    },
    onShow: function() {},
    pullUpSuc: function() { //上拉成功    
        var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: "ease",
            delay: 0
        })
        this.animation = animation
        animation.translateY(0).step()
        this.setData({
            animationData: animation.export(),
            isSuccess: true,
            isMask: true,
        })
    },
    pullDownSuc: function() {
        var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: "ease",
            delay: 0
        })
        this.animation = animation
        animation.translateY(this.data.wHeight).step();
        this.setData({
            animationData: animation.export(),
            isMask: false,
        })

        setTimeout(function() {
            this.setData({
                isSuccess: false
            })
        }.bind(this), 1000)
    },
    tapCloseSuccess: function() {
        app.isSuccuess = 0;
        // wx.removeStorageSync('successData');
        this.pullDownSuc();
    },
    choosestar: function(e) {
        var strnumber = e.target.dataset.id;
        var _obj = {};
        _obj.curHdIndex = strnumber;
        this.setData({
            tabArr: _obj
        });
    },
    bindFormSubmit: function(e) {
        var value = e.detail.value.textarea.length
        console.log(value)
        if (value > 144) {
            wx.showToast({
                title: '输入不能超过144个字符',
                icon: 'loading',
                duration: 2000
            })
        } else {
            wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 2000
            })
            setTimeout(function() {
                wx.navigateBack({
                    url: '/pages/mycenter/mycenter'
                })
            }, 3000);
        }


    },
})
