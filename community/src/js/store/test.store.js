/**
 * @file 个人信息的store
 */

var Dispatcher = require('../dispatcher/test.dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/test.constants.js');
var assign = require('object-assign');

var test = {};

var TestStore = assign({}, EventEmitter.prototype, {

});

module.exports = TestStore;
