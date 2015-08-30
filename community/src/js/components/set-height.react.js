/**
 * @file 真女郎的列表
 */
var React = require('react');
var o = require('g-octopus');

var TopBar = require('./top-bar.react');
var Input = require('./input.react');

var SetHeight = React.createClass({

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
          if(data.data.height != '' && data.data.height != undefined){
            o.$('.passport-common-input input')[0].value = data.data.height;
          }
        }
      }.bind(this)
    });

  },

  _save : function () {
    var url = location.host;
    url = url.replace('renzhenge.','api.renzhenge.');

    var cont = o.$('input')[0].value;

    o.ajax.ajaxJSONP({
      url: 'http://' + url + '/uprofile/edit',
      jsonp: '_jp',
      dataType : 'json',
      data: {
        'data' : '{"height":"'+ cont +'"}'
      },
      success: function (data) {
        console.log(data);
        if(data.errno == 0){
          location.hash = '#/info';
        }
      }
    });
  },

  /**
   * @return {object}
   */
  render: function() {
    var option = {
      'type': 'text',
      'holder': '请输入身高'
    };
    return (
      <div className="info-set-container">
        <TopBar title='修改身高' backUrl='#/info' />
        <div className="info-set-save">
          <div className="save-btn">保存</div>
        </div>
        <div className="info-name-input-area">
          <Input option={ option } />
        </div>
        <div className="info-name-mark">
          <p>真实的高度，与众不同的美。</p>
        </div>
      </div>
    )
  }
});

module.exports = SetHeight;