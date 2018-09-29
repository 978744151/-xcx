//index.js
//获取应用实例
var app = getApp(),
    utils = require('../../utils/util.js'),
    city = require('../../utils/city.js'),
    QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js'),
    wechat = require('../../utils/wechat.js');
var demo = new QQMapWX({
    key: 'BQOBZ-FIUCJ-QQFF4-KS546-W2BR3-UKFE4' // 腾讯地图key值
});


Page({
    data: {
        searchLetter: [],
        showLetter: "",
        winHeight: 0,
        tHeight: 0,
        bHeight: 0,
        startPageY: 0,
        cityList: [],
        isShowLetter: false,
        scrollTop: 0,
        city: "",
        adcode: "",
        cityArr: [],
        qqCity: '',
        adcode: '',
        searchValue: '',
        isFocus: false,
        scrollHeight: null,
        showMessage: false,
        isMapLoad: false,
        messageContent: '',
    },
    onLoad: function (options) {
        //历史选择，应该在缓存中记录，或者在在app中全局记录
        //当前城市通过之前的页面穿过来或者调用定位
        var c = '北京'
        var cityArr = ['上海', '北京']
        this.setData({
            cityArr: cityArr,
            city: c
        })
        // 生命周期函数--监听页面加载
        var searchLetter = city.searchLetter;
        var cityList = city.cityList();
        // console.log(cityInfo);

        var sysInfo = wx.getSystemInfoSync();
        // console.log(sysInfo);
        var winHeight = sysInfo.windowHeight;
        var scrollHeight = utils.mathScorllHeight(106);
        //添加要匹配的字母范围值
        //1、更加屏幕高度设置子元素的高度
        var itemH = (winHeight - 50) * .75 / (searchLetter.length + 1);
        var tempObj = [];
        for (var i = 0; i < searchLetter.length; i++) {
            var temp = {};
            temp.name = searchLetter[i];
            temp.tHeight = i * itemH;
            temp.bHeight = (i + 1) * itemH;

            tempObj.push(temp)
        }

        //获取qq定位
        var qqCity = wx.getStorageSync('qqCity') || '';
        var adcode = wx.getStorageSync('adcode') || '';

        this.setData({
            winHeight: winHeight,
            itemH: itemH,
            searchLetter: tempObj,
            cityList: cityList,
            qqCity,
            adcode,
            scrollHeight,
        })

    },
    searchStart: function (e) {
        var showLetter = e.currentTarget.dataset.letter;
        var pageY = e.touches[0].pageY;
        this.setScrollTop(this, showLetter);
        this.nowLetter(pageY, this);
        this.setData({
            showLetter: showLetter,
            startPageY: pageY,
            isShowLetter: true,
        })
    },
    back(e) { //点击选择
        var city = e.currentTarget.dataset.text,
            id = e.currentTarget.dataset.id,
            sycIndex = wx.getStorageSync('sycIndex') || {};
        sycIndex.city = city;
        sycIndex.areaid = id;
        wx.setStorageSync('sycIndex', sycIndex);
        var pages = getCurrentPages();
        var prePage = pages[pages.length - 2];
        prePage.setData({ selectCity: city, selectAreaid: id, isloadList: true })
        wx.navigateBack({
            delta: 1
        })
    },
    searchMove: function (e) {
        var pageY = e.touches[0].pageY;
        var startPageY = this.data.startPageY;
        var tHeight = this.data.tHeight;
        var bHeight = this.data.bHeight;
        var showLetter = 0;
        console.log(pageY);
        if (startPageY - pageY > 0) { //向上移动
            if (pageY < tHeight) {
                // showLetter=this.mateLetter(pageY,this);
                this.nowLetter(pageY, this);
            }
        } else { //向下移动
            if (pageY > bHeight) {
                // showLetter=this.mateLetter(pageY,this);
                this.nowLetter(pageY, this);
            }
        }
    },
    searchEnd: function (e) {
        // console.log(e);
        // var showLetter=e.currentTarget.dataset.letter;
        var that = this;
        setTimeout(function () {
            that.setData({
                isShowLetter: false
            })
        }, 1000)

    },
    nowLetter: function (pageY, that) { //当前选中的信息
        var letterData = this.data.searchLetter;
        var bHeight = 0;
        var tHeight = 0;
        var showLetter = "";
        for (var i = 0; i < letterData.length; i++) {
            if (letterData[i].tHeight <= pageY && pageY <= letterData[i].bHeight) {
                bHeight = letterData[i].bHeight;
                tHeight = letterData[i].tHeight;
                showLetter = letterData[i].name;
                break;
            }
        }

        this.setScrollTop(that, showLetter);

        that.setData({
            bHeight: bHeight,
            tHeight: tHeight,
            showLetter: showLetter,
            startPageY: pageY
        })
    },
    bindScroll: function (e) {
        // console.log(e.detail)
    },

    setScrollTop: function (that, showLetter) {
        var scrollTop = 0;
        var cityList = that.data.cityList;
        var cityCount = 0;
        var initialCount = 0;
        for (var i = 0; i < cityList.length; i++) {
            if (showLetter == cityList[i].initial) {
                scrollTop = initialCount * 30 + cityCount * 41;
                break;
            } else {
                initialCount++;
                cityCount += cityList[i].cityInfo.length;
            }
        }
        that.setData({
            scrollTop: scrollTop - 1558
        })
    },
    bindCity: function (e) {
        var city = e.currentTarget.dataset.city;
        this.setData({ city: city })
    },
    wxSortPickerViewItemTap: function (e) {
        var city = e.currentTarget.dataset.text,
            id = e.currentTarget.dataset.id,
            sycIndex = wx.getStorageSync('sycIndex') || {};
        // app.returnIndexTitle = city;
        // app.returnIndexCode = id;
        sycIndex.city = city;
        sycIndex.areaid = id;
        var pages = getCurrentPages();
        var prePage = pages[pages.length - 2];
        prePage.setData({ selectCity: city, selectAreaid: id, isloadList: true })
        wx.setStorageSync('sycIndex', sycIndex)
        // app.isChangeCity = true;
        wx.navigateBack({
            delta: 1
        })
        //可以跳转了
        // console.log('选择了城市：', city);
    },
    bindInput(e) {
        var cityObj = city.cityObj;
        var shcity = [];
        for (var i = 0; i < cityObj.length; i++) {
            if (cityObj[i].city.includes(e.detail.value)) {
                shcity.push(cityObj[i]);
            }
        }
        this.setData({
            shcity: shcity,
            searchValue: e.detail.value
        })
    },
    getFocus() {
        this.setData({ isFocus: true });
    },
    blur() {
        this.setData({ isFocus: false });
    },
    handleConfirm(e) {
        var falg = false,
            cityItem = {};
        city.cityObj.map((item) => {
            if (item.city.includes(e.detail.value)) {
                falg = true
                cityItem = item;
            }
        })

        if (falg) {
            app.returnIndexTitle = cityItem.city;
            app.returnIndexCode = cityItem.id;
            wx.navigateBack({
                delta: 1
            })
        } else {
            utils.showMessage(this, '请输入正确的城市');
            this.setData({ isFocus: true, searchValue: '' })
        }
    },
    aginMap() {
        this.setData({ isMapLoad: true })
        wechat.getLocation().then((res) => {
            this.qqChangeLocation({ lat: res.latitude, lng: res.longitude });
              console.log(res) 
        }, (err) => {
            utils.showMessage(this, '请输入正确的城市');
        })
    },
    qqChangeLocation(params) { //坐标解析
        var that = this,
            sycIndex = wx.getStorageSync('sycIndex') || {};
        demo.reverseGeocoder({
            location: {
                latitude: params.lat, //x
                longitude: params.lng //y
            },
            success: function (res) {
               console.log('res',res)
                that.setData({
                    qqCity: res.result.ad_info.city,
                    adcode: res.result.ad_info.adcode,
                    isMapLoad: false
                })
                sycIndex.city = res.result.ad_info.city;
                sycIndex.areaid = res.result.ad_info.adcode;
                sycIndex.lat = params.lat;
                sycIndex.lng = params.lng;
                sycIndex.date = nowDate.getTime();
                wx.setStorageSync('qqCity', res.result.ad_info.city);
                wx.setStorageSync('adcode', res.result.ad_info.adcode);
            },
            fail: function (res) {
                that.setData({ isMapLoad: false });
                utils.showMessage(that, '转换地址失败');
                console.log('根据坐标转换具体地址失败');
            }
        });
    },
})