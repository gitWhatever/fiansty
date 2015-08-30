/**
 * @file 真女郎的列表
 */
var React = require('react');
var o = require('g-octopus');

var TopBar = require('./top-bar.react');
var Input = require('./input.react');

var action = require('../actions/community.action');

var SetName = React.createClass({
  /**
   * @desc 默认参数
   * @property defaultConfig
   */
  getDefaultProps: function() {
    return {
      timeout: null
    }
  },

  /**
   * @desc 注册事件监听
   * @property unbind event with react method
   */
  componentDidMount: function() {
    o.$('.save-btn')[0].addEventListener('click', this._save);

    var url = location.host;
    url = url.replace('renzhenge.','api.renzhenge.');
    o.ajax.ajaxJSONP({
      url: 'http://' + url + '/uprofile/getProfile',
      jsonp: '_jp',
      data: {},
      success: function (data) {
        console.log(data.data);
        if(data.errno == 0){
          this.props.data = data.data;
          if(data.data.nickName != '' && data.data.nickName != undefined){
            o.$('.passport-common-input input')[0].value = data.data.nickName;
          }
        }
      }.bind(this)
    });
  },

  _save : function () {
    var url = location.host;
    url = url.replace('renzhenge.','api.renzhenge.');

    var cont = o.$('input')[0].value;
    if(cont == ''){
      action.showErrMsg('输入为空！');

      if(this.props.timeout != null){
        clearTimeout(this.props.timeout);
      }
      this.props.timeout = setTimeout(function(){
        action.showErrMsg('');
      }.bind(this),3000);
    }

    if(cont != ''){
      o.ajax.ajaxJSONP({
        url: 'http://' + url + '/uprofile/edit',
        jsonp: '_jp',
        dataType : 'json',
        data: {
          'data' : '{"nickName":"'+ cont +'"}'
        },
        success: function (data) {
          console.log(data);
          if(data.errno == 0){
            location.hash = '#/info';
          }else if(data.errno == 1503){
            action.showErrMsg('输入为空！');
            clearTimeout(this.props.timeout);
            this.props.timeout = setTimeout(function(){
              action.showErrMsg('');
            }.bind(this),3000);
          }
        }.bind(this)
      });
    }
  },

  /**
   * @return {object}
   */
  render: function() {
    var option = {
      'type': 'text',
      'holder': '请输入姓名'
    };
    return (
      <div className="info-set-container">
        <TopBar title='修改名字' backUrl='#/info' />
        <div className="info-set-save">
          <div className="save-btn">保存</div>
        </div>
        <div className="info-name-input-area">
          <Input option={ option } />
        </div>
        <div className="info-name-mark">
          <p>真实姓名能让你得到更多关注和官方认证。</p>
        </div>
      </div>
    )
  }
});

module.exports = SetName;