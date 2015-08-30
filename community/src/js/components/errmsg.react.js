/**
 * @file 真女郎的列表
 */
var React = require('react');

var Store = require('../store/community.store');

var ErrMsg = React.createClass({
  getInitialState: function () {
    return {
      text: '',
      timeout : null
    }
  },

  componentWillMount: function() {
    Store.addMsgListener(function() {
      this.setState({
        'text': Store.getErrMsg()
      });
      clearTimeout(this.state.timeout);
      this.state.timeout = setTimeout(function () {
        this.hideSelf();
      }.bind(this),3000);
    }.bind(this));
  },

  componentWillUnmount : function () {
    clearTimeout(this.state.timeout);
  },

  hideSelf: function() {
    this.setState({
      'text': ''
    });
  },

  /**
   * @return {object}
   */
  render: function() {
    var style = {
      'display' : this.state.text? 'block': 'none'
    };
    return (
      <div className="passport-errmsg-container enable-click-ios" style={style} onClick={ this.hideSelf }>
        <div className="passport-common-errmsg" id="layer">
          <span>{ this.state.text }</span>
        </div>
      </div>
    );
  }

});

module.exports = ErrMsg;