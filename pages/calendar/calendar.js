Page({
    data:{
        weeks: ['日','一','二','三','四','五','六'],
        allMonthNumber: [],
        // 当前年月日   '2016-11-01'
        getNowYear: new Date().getFullYear(),//年
        getNowMonth: new Date().getMonth(),//月
        getNowDay: new Date().getDate(),//日
        windowHeight: 650,//设置最大初始值
        /***********下面是一次性渲染4个月数据无上限加载的参数***********/
        // 计算Reach 年月
        computReachYear: new Date().getFullYear(),
        computReachMonth: new Date().getMonth(),
        // 计算Pull 年月
        computPullYear: new Date().getFullYear(),
        computPullMonth: new Date().getMonth(),
        numPageMonth: 6,//当前页面一次性渲染多少个月的
        pullTimes: 0,
    },
    // init 页面入口
    onLoad(){
        //31是weeks 高度
        this.setData({
            'windowHeight':wx.getSystemInfoSync().windowHeight
        });
        // 每次渲染4个月日历和数据
        this.getMoreDate('reachbottom','scrollinit');
    },
    // 计算每月的天数
    computeMonthDayNum(year){
        var monthday = [31,28,31,30,31,30,31,31,30,31,30,31];
        // 闰年计算
        if ((year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0)) {
            monthday[1] = 29;
        }
        return monthday;
    },
    // 计算每月的日历number
    getDayNumber(year,month){
        var firstDay = (new Date(year, month, 1)).getDay(), //每月第一天是星期几[0-6]对应星期天-星期六
            weekNumArr = [], //计算number
            addnum = 0,
            addnumflag = false,
            monthdayArr = this.computeMonthDayNum(year),
            monthdaynum = 5*7; //每月的日子的总数 6*7  或者 5*7
        // 灵活处理每个月份的 monthdaynum
        if((monthdayArr[month] >29 && firstDay == 6) || ( monthdayArr[month] >30 && firstDay == 5)){
            monthdaynum = 6*7;
        }
        // 循环月份
        for(var i = 0; i <monthdaynum; i++){
            // 计算上月的日子
            if(i<firstDay){
                weekNumArr[i] = {
                    num: ''
                };
            }
            // 计算当月或当月和下月的日子
            else if(i>=firstDay){
                if(addnum < monthdayArr[month]){
                    addnum ++;
                }else{
                    addnumflag = true;
                }
                weekNumArr[i] = {
                    num: addnumflag ? '': addnum
                };
            }
        }
        return {
            'nowYear':year,
            'nowMonth':month,
            'weekNumArr':weekNumArr
        };
    },
    // 一次性渲染2年日历
    getTwoYearDate(){
        let self = this.data,
            allMonthNumber= self.allMonthNumber,
            gyears = self.getNowYear-1,
            gmonth = self.getNowMonth;
        // 计算渲染页面的日子
        for( let i=0; i <self.allPageMonth;i++ ){
            allMonthNumber.push(this.getDayNumber(gyears,gmonth));
            gmonth ++;
            if(gmonth > 11){
                gmonth = 0;
                gyears ++;
            }
        }
        // 更新视图
        this.setData({
            'allMonthNumber': allMonthNumber,
            'scrollDom': `wx${self.getNowYear}${self.getNowMonth}`
        });
    },
    // 每次渲染4个月日历和数据
    getMoreDate(type,init){
        var self = this.data,
            allMonthNumber= self.allMonthNumber,
            scrollDom = '',
            reachYear = self.computReachYear,
            reachMonth = self.computReachMonth,
            pullYear = self.computPullYear,
            pullMonth = self.computPullMonth;

        if(self.pullTimes == 0){
            // 计算下拉
            if(pullMonth == 0){
                pullMonth = 11;
                pullYear --;
            }else {
                pullMonth --;
            }
        }
        // scrollDom 处理
        if(init == 'scrollinit'){
            scrollDom = 'wx'+reachYear+reachMonth;
            // 处理-1，0，1，2月份
            if(reachMonth == 0){
                reachYear --;
                reachMonth = 11;
            }else{
                reachMonth --;
            }
        }else if(init == 'scrollpull'){
            scrollDom = 'wx'+pullYear+pullMonth;
        }
        // 计算渲染页面的日子
        for( let i=0; i <self.numPageMonth;i++ ){
            // 月份和年份增加处理
            if(type == 'reachbottom'){
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
            }else if(type == 'pulldown'){
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
            'allMonthNumber': allMonthNumber,
            'scrollDom': scrollDom
        });
        setTimeout(() => {
            this.data.pullflag = false;
            this.data.reachflag = false;
        },800);
    },
    // 每次渲染个月日历和数据
    scrollCalendar(event){
        // 监听滚动时间 触顶触发
        let scrolldata = event.detail;
        if(scrolldata.scrollTop == 0 && !!!this.data.pullflag){
            this.data.pullflag = true;
            this.getMoreDate('pulldown','scrollpull');
            this.data.pullTimes ++;
        }
    },
    // scrollview 上拉触底事件的处理函数
    pageLower(){
        if(!!!this.data.reachflag){
            this.data.reachflag = true;
            this.getMoreDate('reachbottom','pageLower');
        }
    }
});