/**
 * @file 真女郎的列表
 */
var React = require('react');
var $ = require('jquery');
var IndexSlider = require('./index-slider.react');
var o = require('g-octopus');

var Router = require('react-router');
var Link = Router.Link;

var IndexPage = React.createClass({

  getInitialState: function() {
    return {
      title: '',
      logo: '',
      data: []
    };
  },

  /**
   * @desc 默认参数
   * @property defaultConfig
   */
  getDefaultProps: function() {
    return {
    }
  },

  componentDidMount: function() {
    o.$('#s_index')[0].addEventListener('click', function () {
      this.getUserInfo();
    }.bind(this));
  },

  componentWillMount: function() {
    $.ajax('http://api.renzhenge.youxi.com/index/first', {
      dataType: 'jsonp',
      jsonp: '_jp'
    }).then(this.getIndexDataCompleted);
  },

  getIndexDataCompleted: function(data) {
    data = data.data ? data.data : [];
    this.setState({
      data: data
    });
  },

  contextTypes: {
    router: React.PropTypes.func
  },

  getUserInfoCompleted: function(data) {
    if(data.errno == '0' && data.data && data.data.rid) {
      this.context.router.transitionTo('dream', {uid: data.data.rid});
    } else {
      window.location.hash = '#/login';
    }
  },

  getUserInfo: function() {
    var url = location.host;
    url = url.replace('renzhenge.','u.renzhenge.');

    $.ajax('http://'+ url +'/auth', {
      dataType: 'jsonp',
      jsonp: '_jp'
    }).then(this.getUserInfoCompleted);
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div className="index-container">
        <div className="index-header"></div>
        <IndexSlider data={ this.state.data } />
        <div className="index-footer">
          <div className="footer-btn cur" id="z_index">
            <i></i>
            <p>真女孩</p>
          </div>
          <div className="footer-btn" id="s_index">
            <i></i>
            <p>我的梦想</p>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = IndexPage;