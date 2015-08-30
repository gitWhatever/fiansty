/**
 * @file 真女郎的列表
 */
var React = require('react');
var o = require('g-octopus');

var BgMusic = React.createClass({
  /**
   * @return {object}
   */
  render: function() {
    return (
      <audio src="http://v.game.360tpcdn.com/bgm-rzg.mp3" loop="loop"></audio>
    );
  }
});

module.exports = BgMusic;