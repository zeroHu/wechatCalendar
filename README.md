### 这是一款日历小程序，不同于普通的日历是点击翻页，这个是滚动翻页的日历小程序
-----
#### 上下滚动翻页式日历的来源：
```
    1. 网上有很多日历的，但大多数都是单页式的，点击按钮加载上月或者下月，上一年或者下一年
    2. 有个需求需要做一个滚动加载的日历，优点是能够同时方便查看前后的日历
```
#### 难点：需要进行顶部底部的监控翻页，实时刷新，如果是但是小程序的scroll-view里面的监听事件有时候兼听不到[无奈，哭]

#### 部分费解代码解释
```
calendar.wxml 里面有这样一段代码
    `bindscrolltolower="pageLower" bindscrolltoupper="pageUpper"`
为啥用了bindscrolltoupper 而没用bindscrolltoupper 反而用了bindscroll，这个是我想了很久然后用滚动监听的方法来解决。（但是不排除后来微信将这个方法改好的可能，那就不需要用bindscroll方法了）
是因为我在测试的时候 不管是真机还是模拟器 如果用而没用bindscrolltoupper 都会有一段卡，这个月和上个月不能出现自然滚动的效果
```
####  特点:1：可以定义一次性渲染多少个月( ONCERENDER )，2：认渲染的月数为nowmonth-1 + ONCERENDER 的月数，为了更加方便查询上个月和下下几个月设计的

##### tips: 写得比较粗糙，可以进行修改

##### 日历成果图
![图片](http://oqt0cgoq9.bkt.clouddn.com/calendar.jpg)
![图片](http://oqt0cgoq9.bkt.clouddn.com/calendar-2.jpg)

