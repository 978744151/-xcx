function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('-');
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}
function spiltNum(userMoeny) {
  var individual, ten, hundred
  userMoeny.split("");
  if (userMoeny.length == 1) {
    individual = userMoeny[0]
  } else if (userMoeny.length == 2) {
    individual = userMoeny[1]
    ten = userMoeny[0]
  } else if (userMoeny.length == 3) {
    individual = userMoeny[2]
    ten = userMoeny[1]
    hundred = userMoeny[0]
  }
  console.log(individual, ten, hundred)
  this.setData({
    individual,
    ten,
    hundred: hundred || ''
  })
}

function isEmpty(obj) {
    for (var name in obj) {
        return false; //debugTel
    }
    return true;
}
;

/**
 * [mathScroll 计算每个列表高度]
 * @param  {[type]} that [app this]
 * @return {[type]}      [列表数组]
 */
function mathScroll(that) {
    var res = wx.getSystemInfoSync(),
        rpx = 750 / res.windowWidth,
        menulist = that.data.category,
        goodsList = that.data.list;



    this.margHeight = 15;
    this.titleHeight = 25 + 30 + 40 + 10 + 18 + 25;
    this.imageHeight = 232
    this.nameHeight = 14 + 30;
    this.priceHeight = 56 + 14;
    this.btnHeight = 52;
    this.twPanleHeight = this.imageHeight + this.nameHeight + this.priceHeight + this.btnHeight + 14;


    this.titleHeightPx = Number((this.titleHeight / rpx).toFixed(1));
    this.twPanleHeightPX = Number((this.twPanleHeight / rpx).toFixed(1));
    var scrollArray = [],
        temp = 0;
    // console.log(menulist)
    menulist.map((item) => {
        var id = item.id,
            length = 0,
            row = 0;
        if (!isEmpty(goodsList[id])) {
            for (var item in goodsList[id]) {
                length++;
            }
            row = Math.ceil((length + 1) / 3);
            temp = Number(temp + (this.titleHeightPx + this.twPanleHeightPX * row));
        }
        // console.log(temp)
        scrollArray.push({
            'height': temp,
            'id': id
        });
    })

    that.setData({
        scrollArray: scrollArray
    })
}




/**
 * [goMap 地图]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function goMap(options) {
    var _latitude = options.lat || '';
    var _longitude = options.lng || '';
    var _name = options.name || '';
    var _address = options.address || '';
    wx.openLocation({
        latitude: Number(_latitude),
        longitude: Number(_longitude),
        name: _name,
        address: _address,
        scale: 28
    })
}


/**
 * 姓名函数
 */
function funcName(name) {
    var str = '';
    if (!!name) {
        str = `${name.substring(0, 1)}**${name.substring(name.length - 1, name.length)}`
    } else {
        str = '匿名评价'
    }
    return str
}

function showMessage(that, msg) {
    if (that.data.showMessage) {
        return;
    }
    that.setData({
        showMessage: true,
        messageContent: msg
    })
    setTimeout(() => {
        that.setData({
            showMessage: false,
        })
    }, 3000)
}


function strEllipse(str) {
    if (str.length > 13) {
        str = `${str.substring(0, 4)}...${str.substring(str.length - 4, str.length + 1)}`
    }
    return str;
}


const mathScorllHeight = function (height) {
    var res = wx.getSystemInfoSync();
    var scrollHeight = (Number(res.windowHeight) * 750 / res.windowWidth) - height;
    return scrollHeight;
}



function addTen(ten) {
    var str = ten >= 10 ? ten : '0' + parseInt(ten);
    return str;
}



function getTimeSlotMonth(year, month) {
    var new_year = year; //取当前的年份
    var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）
    if (month > 12) //如果当前大于12月，则年份转到下一年
    {
        new_month -= 12; //月份减
        new_year++; //年份增
    }
    var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天
    var startDate = new Date(new_date.getTime() - 1000 * 60 * 60 * 24);
    var end = new_year + '-' + new_month + '-' + startDate.getDate(); //月初开始时间
    var start = new_year + '-' + new_month + '-01';
    return { start, end };
}


const splitStar = function (str, start, end) {
    str = str.substr(0, start) + '******' + str.substr(str.length - 4, str.length);
    return str;
}


const debugTel = function (that, phone) {
    wx.makePhoneCall({
        phoneNumber: phone, //此号码并非真实电话号码，仅用于测试
        fail: function (e) {
            if (e.errMsg == 'makePhoneCall:fail') {
                wx.setClipboardData({
                    data: phone,
                    success: function (res) {
                        showMessage(that, '部分手机不支持打电话，已将电话复制到剪切板')
                    },
                })
            }

        }
    })
}

/**
 *保留两位小数 
 */
const myToFixed = function (num) {
    var str = num.toString();
    if (str.indexOf('.') == -1) {
        return Number(num)
    } else {
        var nInt = str.split('.')[0];
        var nFloat = (str.split('.')[1]).toString().substr(0, 2);
        var aa = `${nInt}.${nFloat}`;
        return Number(aa);
    }
}

module.exports = {
    formatTime: formatTime,
    isEmpty: isEmpty,
    mathScroll: mathScroll,
    goMap: goMap,
    showMessage: showMessage,
    strEllipse,
    mathScorllHeight,
    addTen,
    getTimeSlotMonth,
    splitStar,
    debugTel,
    funcName,
    myToFixed,
    spiltNum: spiltNum
}
