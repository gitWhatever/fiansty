/**
 * @file 真女郎的列表
 */
var React = require('react');
var o = require('g-octopus');

var TopBar = require('./top-bar.react');

var SetStory = React.createClass({

  /**
   * @desc 默认参数
   * @property defaultConfig
   */
  getDefaultProps: function () {
    return {
      theme: [
        'http://p3.qhimg.com/d/inn/eb8857ee/theme1.jpg',
        'http://p3.qhimg.com/d/inn/0f114bd3/theme2.jpg',
        'http://p6.qhimg.com/d/inn/57447511/theme3.jpg'
      ]
    }
  },

  /**
   * @desc 注册事件监听
   * @property unbind event with react method
   */
  componentDidMount: function() {
    this.refs.save.getDOMNode().addEventListener('click', this._save);

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
          if(data.data.story != '' && data.data.story != undefined){
            this.refs.inputStory.getDOMNode().value = data.data.story;
          }
          if(data.data.theme == 'http://p3.qhimg.com/d/inn/eb8857ee/theme1.jpg'){
            $($('input')[0]).attr("checked", "checked");
          }else if(data.data.theme == 'http://p3.qhimg.com/d/inn/0f114bd3/theme2.jpg'){
            $($('input')[1]).attr("checked", "checked");
          }else if(data.data.theme == 'http://p6.qhimg.com/d/inn/57447511/theme3.jpg'){
            $($('input')[2]).attr("checked", "checked");
          }
        }
      }.bind(this)
    });

  },

  _save : function () {
    var url = location.host;
    url = url.replace('renzhenge.','api.renzhenge.');

    var theme = '';
    if(document.getElementsByName('theme')[0].checked){
      theme = 'http://p3.qhimg.com/d/inn/eb8857ee/theme1.jpg';
    }else if(document.getElementsByName('theme')[1].checked){
      theme = 'http://p3.qhimg.com/d/inn/0f114bd3/theme2.jpg';
    }else if(document.getElementsByName('theme')[2].checked){
      theme = 'http://p6.qhimg.com/d/inn/57447511/theme3.jpg';
    }

    var cont = encodeURI(this.refs.inputStory.getDOMNode().value);

    o.ajax.ajaxJSONP({
      url: 'http://' + url + '/uprofile/edit',
      jsonp: '_jp',
      dataType : 'json',
      data: {
        'data' : '{"story":"'+ cont +'", "theme":"'+ theme +'"}'
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
        <TopBar title='梦想故事' backUrl='#/info' />
        <div className="info-set-save">
          <div className="save-btn" ref="save">完成</div>
        </div>
        <div className="info-set-textarea">
          <textarea autoComplete="off" autoCorrect="off" maxLength="64" data-sug="1" ref="inputStory"></textarea>
        </div>
        <div className="info-set-theme">
          <div className="theme-wrap">
            <p>请选择主题背景</p>
            <div className="theme-choose">
              <img src="../../../img/passport/theme1.jpg"/>
              <input type="radio" name="theme" value="st1"/>
              <span>浪漫爱情</span>
            </div>
            <div className="theme-choose">
              <img src="../../../img/passport/theme2.jpg"/>
              <input type="radio" name="theme" value="st2"/>
              <span>蓝色梦想</span>
            </div>
            <div className="theme-choose">
              <img src="../../../img/passport/theme3.jpg"/>
              <input type="radio" name="theme" value="st3"/>
              <span>星语心愿</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = SetStory;