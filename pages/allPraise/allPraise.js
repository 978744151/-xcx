var app = getApp(), 
utils = require('../../utils/util'),
API = require('../../utils/api.js');
Page({
    data: {
        isIndexLoad: true,
        praise: {
            yawp: { name: '不满', img: 'https://pic.repaiapp.com/pic/ef/be/58/efbe58f72b6ca0566852e9b7a219c927d5e2f6ed.png' },
            common: { name: '一般', img: 'https://pic.repaiapp.com/pic/9a/7d/3f/9a7d3fd1bfed712e112600fb2847f5a30bcd3500.png' },
            ok: { name: '满意', img: 'https://pic.repaiapp.com/pic/7a/e5/30/7ae530f2550f258e25946884804614b72db68c52.png' },
            supPraise: { name: '超赞', img: 'https://pic.repaiapp.com/pic/65/e9/e9/65e9e9c607c234bb32dd29b5661ccf3e3ac0cc0e.png' },
        },
        praiseList: [],
        isMore: false,
        nextPage: null,
        allPage: null,
        isEnd: false,
        page: 1
    },
    onLoad: function (options) {
    },
    onShow: function () {
        this.getData();
    },
    onPullDownRefresh: function () {
        this.setData({ page: 1, isEnd: false });
        this.getData();
        wx.stopPullDownRefresh();
    },
    // 上拉加载
    onReachBottom: function () {
        var page = this.data.page;
        if (!this.data.isEnd) {
            page = Number(page) + 1;
            this.setData({ page, isMore: false })
            this.getData();
        }
    },
    // 获取评价数据
    getData() {
        if (!this.data.isEnd) {
            var access_token = wx.getStorageSync('access_token'), page = this.data.page;
            API.getAllPraise({ access_token, page }).then((res) => {
                let { list, isEnd, nowPage, allPage } = res.data.data;
                list = this.data.praiseList.length > 0 && nowPage != 1 ? this.data.praiseList.concat(list) : list;
                var _list = [];
                if (list instanceof Array && list.length>0){
                    list.map((item) => {
                        var _item = item
                        _item.nickname = utils.funcName(item.nickname);
                        _list.push(_item)
                    })
                }else{
                    _list = list;
                }
                
                var isMore = true;
                if (nowPage == allPage) {
                    isMore = false
                }
                this.setData({ praiseList: _list, isEnd, isIndexLoad: false, page: nowPage, isMore: isMore, allPraise: res.data.data })
            }, (err) => {
            })
        }
    },
    //预览
    imgView: function (e) {
        console.log(e.currentTarget.dataset.picarr)
        wx.previewImage({
            current: e.currentTarget.dataset.pic,
            urls: e.currentTarget.dataset.picarr,
        })
    },
})

