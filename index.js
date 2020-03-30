let postData = {
  pageIndex: 1,
  pageSize: 10
}
let num = 1
Component({
  properties: {
    //数据总数
    totalCount: {
      type: Number,
      value: 0,
    },
    // 请求是否已经完成
    requesting: {
      type: Boolean,
      value: false,
      observer: 'requestingEnd',
    },
    //距顶部多少rpx
    topPx: {
      type: Number,
      value: 0,
    },
    // 底部高度
    bottomPx: {
      type: Number,
      value: 0,
    },
    //是否是全部数据的列表， 不分页！不刷新
    isAllList: {
      type: Boolean,
      value: false,
    }
  },
  data: {
    mode: 'refresh', // refresh 和 more 两种模式
    successShow: false, // 显示success
    successTran: false, // 过度success
    refreshStatus: 0, // 1: 下拉刷新, 2: 松开刷新, 3: 加载中, 4: 加载完成
    move: -100, // movable-view 偏移量
    scrollHeight1: 0, // refresh view 高度负值
    scrollHeight2: 0, // refresh view - success view 高度负值
    scrollTop: 0,
    //当前是否正在重新加载列表中
    isRefresh: true,
    //是否还有更多数据
    haveMore: true,
    emptyUrl: "../../images/create-collection.png",
    refreshSize: 90, // 下拉刷新的高度
    showDiv: false
  },
  methods: {
    /**
     * 加载更多
     */
    more() {
      //判断是否还有数据
      if (!this.properties.isAllList && this.properties.totalCount > (postData.pageIndex * postData.pageSize)) {
        postData.pageIndex++
          this.setData({
            haveMore: true
          })
        this.triggerEvent('getData', postData);
      } else {
        //没有更多数据了
        this.setData({
          haveMore: false
        })
      }
    },
    //列表数据变化
    /**
     * 监听 requesting 字段变化, 来处理下拉刷新对应的状态变化
     */
    requestingEnd(newVal, oldVal) {
      
      if (this.data.mode == 'more') {
        return
      }
      console.log(newVal,oldVal)
      if (oldVal === false && newVal === true) {
        //有新数据来是时候
        this.setData({
          successShow: true,
        });
        //判断是否还有数据
        if (this.properties.totalCount > (postData.pageIndex * postData.pageSize)) {
          // postData.pageIndex++
            this.setData({
              haveMore: true
            })
        } else {
          //没有更多数据了
          this.setData({
            haveMore: false
          })
        }
        setTimeout(() => {
          this.setData({
            refreshStatus: 1,
            successShow: false,
            successTran: false,
            move: -100
          });
        }, 1000)
      }
    },

    /**
     * 处理 bindscrolltolower 失效情况
     */
    scroll(e) {
      if(this.data.showDiv){
        console.log('1')
        this.setData({
          showDiv: false
        })
      }
      // clearTimeout(this.timer)
      console.log(e.detail.scrollTop)
      // this.timer = setTimeout(() => {
        console.log(2)
      //   this.setData({
      //     scrollTop: e.detail.scrollTop
      //   })
      // }, 100)
    },
    /**
     * movable-view 滚动监听
     */
    change(e) {
      console.log('change')
      if (this.data.showDiv) {
        this.setData({
          showDiv: false
        })
      }
      if (this.properties.isAllList) {
        return 
      }
      const data = e.detail
      if (data.y == 0) {
        //回到初始位置 也就是出现等待图表时
        postData.pageIndex = 1
        if (!this.properties.isAllList) {
          this.triggerEvent('getData', postData);
        }
      }
      const {
        refreshStatus
      } = this.data;
      // 判断如果状态大于3则返回
      if (refreshStatus >= 3) {
        return
      }
    },
    /**
     * movable-view 触摸结束事件
     */
    touchend() {
      console.log('end')
      const {
        refreshStatus
      } = this.data;

      if (refreshStatus >= 3) {
        return
      }
      if (refreshStatus == 2) {
        wx.vibrateShort();
        this.setData({
          refreshStatus: 3,
          move: 0,
          mode: 'refresh'
        })
      } else if (refreshStatus == 1) {
        this.setData({
          move: this.data.scrollHeight1
        })
      }
    },
    /**
     * 监听下拉刷新高度变化, 如果改变重新初始化参数, 最小高度80rpx
     */
    refreshChange(newVal, oldVal) {
      if (newVal <= 80) {
        this.setData({
          refreshSize: 80
        })
      }
    },
  },
  ready() {
    this.setData({
      refreshStatus: 2,
    })
    postData={
      pageIndex: 1,
      pageSize: 10
    }
    // 没有下拉功能时，列表top值不够
    if (this.properties.isAllList){
        this.setData({
          showDiv: true
        })
    }
  }
})