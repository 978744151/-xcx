var app = getApp(),
    API = require('../../utils/api.js'),
    utils = require('../../utils/util.js');
var ajaxFlag = true;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabIndex: 0,
        scrollHeight: null,
        isHidden: true,
        access_token: null,
        isEnd: false,
        list: [],
        nowPage: 1,
        totalPage: null,
        isLoading: true,
        isMore: true,
        isUndata: false,
        dateStr: '',
        date: '',
        startDate: '',
        start: null,
        end: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var wHeight = 70 + 100 + 10;
        var scrollHeight = utils.mathScorllHeight(wHeight);
        var access_token = app.access_token || wx.getStorageSync('access_token');
        var now = new Date();
        var dateStr = now.getFullYear() + '年' + utils.addTen(now.getMonth() + 1) + '月';
        var date = now.getFullYear() + utils.addTen(now.getMonth() + 1);
        var startDate = now.getFullYear() + '-' + utils.addTen(now.getMonth() + 1);
        const { start, end } = utils.getTimeSlotMonth(now.getFullYear(), now.getMonth() + 1)
        this.setData({ scrollHeight, access_token, dateStr, date, startDate, start, end })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.getData();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        if(!this.data.isEnd){
            this.getData();
        }
        
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },
    /**
     * [getData 获取数据]
     * @return {[type]} [description]
     */
    getData() {
        var parmars = { page: this.data.nowPage, access_token: this.data.access_token, type: this.data.tabIndex, begindate: this.data.start, enddate: this.data.end };
        API.getBillDetail(parmars).then((res) => {
            var data = res.data.data;
            console.log(data.list)
            let { isEnd, list, nowPage, totalPage } = data;
            list = nowPage > 1 ? Object.assign(this.data.list,list) : list;
            let isUndata = !Boolean(list.length > 0);
            this.setData({
                isEnd,
                list,
                nowPage,
                totalPage,
                isLoading: false,
                isMore: false,
                isUndata
            })
            ajaxFlag = true;
            wx.stopPullDownRefresh() //停止下拉刷新
        }, (err) => {
            ajaxFlag = true;
            this.setData({ isLoading: false, isMore: false })
            wx.stopPullDownRefresh() //停止下拉刷新
        })
    },
    /**
     *点击切换tab选项卡
     */
    switchTab(e) {
        var tabIndex = e.currentTarget.dataset.index;
        if (tabIndex != this.data.tabIndex) {
            this.setData({ tabIndex, nowPage: 1, list: [], isMore: true, isUndata: false });
        }
        // this.getData();
    },
    /**
     * 滑动 swiper组件 更改tabindex值
     */
    viewChange(e) {
        var tabIndex = e.detail.current;
        this.setData({ tabIndex, nowPage: 1, list: [], isMore: true, isUndata: false });
        this.getData();
    },
    /**
     * 展示筛选时间
     */
    showDate() {
        this.setData({ isHidden: !this.data.isHidden })
    },
    /**
     * 筛选时间
     */
    selectDate(e) {
        console.log(e.detail.value)
        var str = e.detail.value.split('-');
        var dateStr = str[0] + '年' + utils.addTen(str[1]) + '月';
        var date = str[0] + utils.addTen(str[1]);
        const { start, end } = utils.getTimeSlotMonth(str[0], str[1]);
        this.setData({
            dateStr,
            date,
            isMore: true,
            nowPage: 1,
            start,
            end,
        })
        this.getData();
    },
    loadCarteMore() { //加载更多
        if (!this.data.isMore && !this.data.isEnd && ajaxFlag) {
            this.setData({
                nowPage: this.data.nowPage + 1,
                isMore: true
            })
            ajaxFlag = false;
            // setTimeout(() => {
            this.getData();
            // }, 1500)
        }
    }
})