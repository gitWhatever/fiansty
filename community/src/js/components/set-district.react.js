/**
 * @file 真女郎的列表
 */
var React = require('react');
var o = require('g-octopus');
var q = require('q');

var TopBar = require('./top-bar.react');
var Input = require('./input.react');

var SetDistrict = React.createClass({

  /**
   * @desc 默认参数
   * @property defaultConfig
   */
  getDefaultProps: function() {
    return {
      data : {}
    }
  },

  /**
   * @desc 注册事件监听
   * @property unbind event with react method
   */
  componentDidMount: function() {
    this._getArea();
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
          if(data.data.district != '' && data.data.district != undefined){
            $('select').val(data.data.district);
          }
        }
      }.bind(this)
    });

  },

  _getArea : function () {
    var url = location.host;
    url = url.replace('renzhenge.','api.renzhenge.');

    o.ajax.ajaxJSONP({
      url: 'http://' + url + '/index/getDistrict',
      jsonp: '_jp',
      data: {},
      success: function (data) {
        console.log(data);
        if(data.errno == 0){
          this.props.data = data.data;
          var op = '',
            i = 34,
            sel = document.getElementsByTagName('select')[0];
          while(--i){
            op = '<option>' + this.props.data[i].province_name + '</option>\n';
            sel.innerHTML = op + sel.innerHTML;
          }
          sel.innerHTML = '<option>请选择</option>' + sel.innerHTML;
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
        'data' : '{"district":"'+ cont +'"}'
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
        <TopBar title='修改地区' backUrl='#/info' />
        <div className="info-set-save">
          <div className="save-btn">保存</div>
        </div>
        <div className="info-select-area">
          <span>地区</span>
          <select>
          </select>
        </div>
      </div>
    )
  }
});

module.exports = SetDistrict;