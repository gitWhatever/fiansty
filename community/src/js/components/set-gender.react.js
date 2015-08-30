/**
 * @file 真女郎的列表
 */
var React = require('react');
var o = require('g-octopus');

var TopBar = require('./top-bar.react');
var Input = require('./input.react');

var SetGender = React.createClass({

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
          if(data.data.gender != '' && data.data.gender != undefined){
            $('select').val(data.data.gender);
          }
        }
      }.bind(this)
    });

  },

  _save : function () {
    var url = location.host;
    url = url.replace('renzhenge.','api.renzhenge.');

    if(!o.$('select')[0].selectedIndex){
      return;
    }
    var cont = o.$('select')[0].selectedOptions[0].innerHTML;

    o.ajax.ajaxJSONP({
      url: 'http://' + url + '/uprofile/edit',
      jsonp: '_jp',
      dataType : 'json',
      data: {
        'data' : '{"gender":"'+ cont +'"}'
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
    return (
      <div className="info-set-container">
        <TopBar title='修改性别' backUrl='#/info' />
        <div className="info-set-save">
          <div className="save-btn">保存</div>
        </div>
        <div className="info-select-area">
          <span>性别</span>
          <select>
            <option>请选择</option>
            <option>男</option>
            <option>女</option>
          </select>
        </div>
      </div>
    )
  }
});

module.exports = SetGender;