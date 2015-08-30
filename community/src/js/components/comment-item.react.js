/**
 * @file 真女郎的列表
 */
var React = require('react');

var CommentItem = React.createClass({

  /**
   * @desc 默认参数
   * @property defaultConfig
   */
  getDefaultProps: function() {
    return {
      text : '',
      author : '',
      time : '',
      count : '',
      sid : ''
    }
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div className="comment-item">
        <h3>{this.props.text}</h3>
        <p>{this.props.author} &nbsp; {this.props.time} &nbsp; 回复 &nbsp; {this.props.count}</p>
        <div className="reply-btn">
          <a href={"#/commentreplylist/" + this.props.sid}>回复</a>
        </div>
      </div>
    )
  }
});

module.exports = CommentItem;
