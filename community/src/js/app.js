/**
 * @file 真女孩社区
 */
var React = require('react');

/**
 * @desc 路由相关
 */
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var NotFoundRoute = Router.NotFoundRoute;

/**
 * @desc 首页
 */
var IndexPage = require('./components/index.react.js');
var TestList2 = require('./components/test-list-2.react.js');
/**
 * @desc 登录相关
 */
var Login = require('./components/login.react');
var Regist = require('./components/regist.react');
var Forget = require('./components/forget.react');
/**
 * @desc 我的梦想
 */
var Dream = require('./components/dream.react.js');
var DreamSts = require('./components/dream-sts.react.js');
var DreamSubtitle = require('./components/dream-subtitle.react.js');
/**
 * @desc 评论相关
 */
var CommentList = require('./components/comment-list.react.js');
var CommentPub = require('./components/comment-pub.react.js');
var CommentReply = require('./components/comment-reply.react.js');
var CommentReplyList = require('./components/comment-reply-list.react.js');
/**
 * @desc 修改信息
 */
var Info = require('./components/info.react');
var SetStory = require('./components/set-story.react');
var SetName = require('./components/set-name.react');
var SetHeight = require('./components/set-height.react');
var SetConstellation = require('./components/set-constellation.react');
var SetDistrict = require('./components/set-district.react');
var SetAge = require('./components/set-age.react');
var SetGender = require('./components/set-gender.react');
/**
 * @desc 修改密码
 */
var Modify = require('./components/modify.react');
/**
 * @desc 全局组件
 */
var Layer = require('./components/layer.react');
var ErrMsg = require('./components/errmsg.react');
var BgMusic = require('./components/music.react');




var App = React.createClass({

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div className='community-container'>
        <RouteHandler />
        <Layer />
        <ErrMsg />
        <BgMusic/>
      </div>
    );
  }

});

var routes = (
  <Route name="app" path="/" handler={ App }>
    <Route name="testlist1" path="/testlist1" handler={ IndexPage } />
    <Route name="testlist2" path="/testlist2" handler={ TestList2 } />
    <Route name="dream" path="/dream/:uid" handler={ Dream } ></Route>
    <Route name="dreamsubtitle" path="/dreamsubtitle/:uid" handler={ DreamSubtitle } ></Route>
    <Route name="dreamsts" path="/dreamsts/:uid" handler={ DreamSts } ></Route>

    <Route name="login" path="/login" handler={ Login } />
    <Route name="regist" path="/regist" handler={ Regist } />
    <Route name="forget">
      <Route name="forget-step1" path="/forget/step1" handler={ Forget } />
      <NotFoundRoute handler={ Forget } />
      <DefaultRoute handler={ Forget } />
    </Route>

    <Route name="info" path="/info" handler={ Info } />
    <Route name="modify" path="/modify" handler={ Modify } />
    <Route name="setstory" path="/setstory" handler={ SetStory } />
    <Route name="setname" path="/setname" handler={ SetName } />
    <Route name="setheight" path="/setheight" handler={ SetHeight } />
    <Route name="setconstellation" path="/setconstellation" handler={ SetConstellation } />
    <Route name="setdistrict" path="/setdistrict" handler={ SetDistrict } />
    <Route name="setage" path="/setage" handler={ SetAge } />
    <Route name="setgender" path="/setgender" handler={ SetGender } />

    <Route name="commentlists" >
      <Route name="commentlist"  path="/commentlist/:uid" handler={ CommentList } />
      <NotFoundRoute handler={DreamSts} />
    </Route>
    <Route name="commentpub" path="/commentpub" handler={ CommentPub } />
    <Route name="commentreplys">
      <Route name="commentreply"  path="/commentreply/:sid" handler={ CommentReply } />
      <NotFoundRoute handler={CommentReplyList} />
    </Route>
    <Route name="commentreplylists">
      <Route name="commentreplylist" path="/commentreplylist/:sid" handler={ CommentReplyList } />
      <NotFoundRoute handler={CommentList} />
    </Route>

    <NotFoundRoute handler={ IndexPage } />
    <DefaultRoute handler={ IndexPage } />
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(
    <Handler/>,
    document.body
  );
});