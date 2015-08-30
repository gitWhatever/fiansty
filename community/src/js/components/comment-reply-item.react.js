/**
 * @file 真女郎的列表
 */
var React = require('react');

var CommentReplyItem = React.createClass({

  /**
   * @desc 默认参数
   * @property defaultConfig
   */
  getDefaultProps: function() {
    return {
      imgSrc : '',
      author : '',
      floor : '',
      date : '',
      time : '',
      cont : ''
    }
  },

  /**
   * @return {object}
   */
  render: function() {
    var st = {
      'height' : this.props.contHeight
    };
    return (
      <div className="reply-item">
        <div className="reply-author">
          <div className="reply-pic">
            <img src={this.props.imgSrc} align="center" />
          </div>
          <div className="reply-name">{this.props.author}</div>
          <div className="reply-info">
            <p>{this.props.floor} &nbsp; {this.props.time} &nbsp; 回复</p>
          </div>
        </div>
        <div className="reply-cont">{this.props.cont}</div>
      </div>
    )
  }
});

module.exports = CommentReplyItem;
