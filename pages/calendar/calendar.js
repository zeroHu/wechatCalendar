Page({
    data:{
        weeks: ['日','一','二','三','四','五','六'],
        allMonthNumber: [],
        getNowYear: new Date().getFullYear(),
        getNowMonth: new Date().getMonth(),
        getNowDay: new Date().getDate(),
        windowHeight: 650,// 设置屏幕高度最大初始值
        // 计算Reach 年月
        computReachYear: new Date().getFullYear(),
        computReachMonth: new Date().getMonth(),
        // 计算Pull 年月
        computPullYear: new Date().getFullYear(),
        computPullMonth: new Date().getMonth(),
        numPageMonth: 6, // 页面一次性渲染多少个月的设置数字
        pullTimes: 0
    },
    onLoad(){
        // 设置高度撑起 calendar
        this.setData({
            'windowHeight': wx.getSystemInfoSync().windowHeight
        });
        // 默认初始化加载当前月数后的日历
        this.getMoreDate('reachbottom', 'scrollinit');
    },
    // 计算每月的天数
    computeMonthDayNum(year){
        var monthDay = [31,28,31,30,31,30,31,31,30,31,30,31];
        // 闰年计算
        if ((year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0)) {
            monthDay[1] = 29;
        }
        return monthDay;
    },
    // 计算每月的日历number
    getDayNumber(year, month){
        var firstDay = (new Date(year, month, 1)).getDay(), //每月第一天是星期几[0-6]对应星期天-星期六
            weekNumArr = [], //计算number
            addNum = 0,
            addNumFlag = false,
            monthDayArr = this.computeMonthDayNum(year),
            monthDayNum = 5*7; // 每月的日子的总数 6*7  或者 5*7 思路是 当前月份多多是 31天 可能第一天是星期一或者星期天

        // 灵活处理每个月份的 monthdaynum
        if((monthDayArr[month] > 29 && firstDay == 6) || ( monthDayArr[month] > 30 && firstDay == 5)){
            monthDayNum = 6*7;
        }
        // 循环月份
        for(var i = 0; i < monthDayNum; i++){
            // 计算上月的日子
            if(i < firstDay){
                weekNumArr[i] = {
                    num: ''
                };
            }
            // 计算当月或当月和下月的日子
            else if(i >= firstDay){
                if(addNum < monthDayArr[month]){
                    addNum ++;
                }else{
                    addNumFlag = true;
                }
                weekNumArr[i] = {
                    num: addNumFlag ? '': addNum
                };
            }
        }
        return {
            'nowYear':year,
            'nowMonth':month,
            'weekNumArr':weekNumArr
        };
    },
    // 渲染日历和数据
    getMoreDate(type, init){
        var self = this.data,
            allMonthNumber= self.allMonthNumber,
            reachYear = self.computReachYear,
            reachMonth = self.computReachMonth,
            pullYear = self.computPullYear,
            pullMonth = self.computPullMonth;
        // 初始第一次上拉
        if(self.pullTimes == 0){
            // 计算下拉
            if(pullMonth == 0){
                pullMonth = 11;
                pullYear --;
            }else {
                pullMonth --;
            }
        }
        if(init == 'scrollinit'){
            // 处理 -1，0，1，2月份
            if(reachMonth == 0){
                reachYear --;
                reachMonth = 11;
            }else{
                reachMonth --;
            }
        }
        // 计算渲染页面的日子
        for( let i=0; i < self.numPageMonth; i++ ){
            // 月份和年份增加处理
            if (type == 'reachbottom') {
                // 添加数据
                allMonthNumber.push(this.getDayNumber(reachYear,reachMonth));
                // 增加月份
                reachMonth ++;
                if(reachMonth > 11){
                    reachMonth = 0;
                    reachYear ++;
                }
                // 记录新的年份和月份
                self.computReachYear = reachYear;
                self.computReachMonth = reachMonth;
            } else if (type == 'pulldown') {
                // 减少月份
                pullMonth --;
                if(pullMonth < 0){
                    pullMonth = 11;
                    pullYear --;
                }
                // 记录新的年份和月份
                self.computPullYear = pullYear;
                self.computPullMonth = pullMonth;
                // 增加数据
                allMonthNumber.unshift(this.getDayNumber(pullYear,pullMonth));
            }
        }
        // 更新视图
        this.setData({
            'allMonthNumber': allMonthNumber
        });
        // 设置恢复Flag
        setTimeout(() => {
            this.data.pullFlag = false;
            this.data.reachFlag = false;
        }, 500);
    },
    // 每次渲染个月日历和数据
    scrollCalendar(event){
        // 监听滚动时间 触顶触发
        let scrolldata = event.detail;
        if(scrolldata.scrollTop === 0 && !!!this.data.pullFlag){
            this.data.pullFlag = true;
            this.getMoreDate('pulldown', 'scrollpull');
            this.data.pullTimes ++;
        }
    },
    // scrollview 上拉触底事件的处理函数
    pageLower(){
        if(!!!this.data.reachFlag){
            this.data.reachFlag = true;
            this.getMoreDate('reachbottom', 'pageLower');
        }
    }
});