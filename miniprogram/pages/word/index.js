const app = getApp();
const db = wx.cloud.database()
const utils = app.utils;
import Dialog from "../../components/vant/dialog/dialog";
import context from "../../components/chinese/index";
Page({
    data:{
      label:'',
      searchVal:'',
      word:{},
      activeNames:[ ]
    },
    onLoad( ){ 
      this.init()
      
    },
    init( ){
      let label = '汉字'; 
      let that = this;
      this.setData({ 
        label:label 
      })
      /*
      wx.getClipboardData({
        success (res){
          let data=res.data ;
          let re=/[\u4e00-\u9fa5]/;
          if (data && data.length==1 && re.test(data)){
            let message = '检测到您的剪贴板存在汉字“'+data+'”，要搜索这个汉字么？';
            Dialog.confirm({
              title: '',
              message: message
               
            }).then(() => {
              // on confirm
              console.log('confirm')
              that.search(data)
            })
            .catch(() => {
              // on cancel
              console.log('cancel')
            });
          }
        }
      })
      */
    },
    actionSearch( ){
        const keyword = this.selectComponent('#searchText')
        let val = keyword.data.value;
        this.search(val);
    },
    
    onCofirmSearch(e){
        let val = e.detail;
        this.search(val);
    },
    search(val){
      if(!val){
          return;
      }
      val = val.trim();
      if (this.data.searchVal== val ) {
        return ;
      }
      
      console.log(val); 
      let re=/[\u4e00-\u9fa5]/;
      let that = this;
      if (val && re.test(val)) {
        wx.showLoading({
          title: '查询词典中',
        });
        db.collection('words').limit(1).where({ 
          word: val
        })
        .get({
          success: function(res) { 
            if (res.data && res.data.length>0) {
              wx.hideLoading();
              let word  = (res.data)[0];
              //console.log('word ',word)
              that.setData({
                word:word
              })
            }else{
              //TODO 查繁体,可以封装下，
              //算了懒得封装，反正没人用
              db.collection('words').limit(1).where({ 
                oldword: val
              })
              .get({
                success: function(res) {
                  wx.hideLoading();
                  if (res.data && res.data.length>0) {
                    
                    let word  = (res.data)[0];
                    //console.log('word ',word)
                    that.setData({
                      word:word
                    })
                  }else{
                    utils.showWxToast('字典未查询到数据')
                  }
                 }
              })
             
            }
           
          }
        })
        that.setData({
          searchVal:val
        })
      }else{
        utils.showWxToast('请输入一个汉字喔！');
      }
    },
    onChange(event) {
      this.setData({
        activeNames: event.detail,
      });
    },
    viewIdiom(){
      let searchVal = this.data.searchVal;
      if(searchVal){
        wx.navigateTo({
          url: '/pages/idiom/index?val='+searchVal,
        })
      }
       
    },
    onShareAppMessage(){
      return {
          title:'亲爱的，这个字你认识么',
          imageUrl:'',//图片样式
          path:''//链接
      }
    },
    createChineseWrite(char){
      this.writerCtx = context({
        id: 'hz-writer',
        character: '吃',
        page: this,
      });
      // You can call any normal HanziWriter method here
      this.writerCtx.loopCharacterAnimation();
    }
})