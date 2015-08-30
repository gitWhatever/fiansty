/**
 * @file 真女郎的列表
 */
var React = require('react');

var Store = require('../store/community.store');

var Layer = React.createClass({

  /**
   * @desc 默认参数
   * @property defaultConfig
   */
  getDefaultProps: function () {
    return {}
  },

  getInitialState: function () {
    return {
      visibility: false
    }
  },

  componentWillMount: function() {
    Store.addLayerListener(function() {
      this.setState({
        'visibility': Store.getLayerVisibility()
      });
    }.bind(this));
  },

  /**
   * @return {object}
   */
  render: function () {
    var style = {'display' : this.state.visibility? 'block': 'none'};
    return (
      <div className="dream-layer" style={style}>
        <div className="dream-layer-pic"></div>
        <div className="dream-layer-text">
          <p>点击右上角分享到朋友圈</p>
          <p>其实你本来就很美</p>
        </div>
      </div>
    )
  }
});

module.exports = Layer;