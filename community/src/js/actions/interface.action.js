var q = require('q');
var o = require('g-octopus');

var CryptoJS = require('../lib/aes');

var url = location.host.replace('renzhenge.','u.renzhenge.');

var apiInterFace = {

  requestRuc: function(type, data) {
    data = data || {};
    var deferred = q.defer();
    o.ajax.ajaxJSONP({
      url: 'http://' + url + '/' + type,
      jsonp: '_jp',
      data: data,
      success: function (response) {
        deferred.resolve(response);
      }
    });
    return deferred.promise;
  },

  aesPassword: function(word) {
    var deferred = q.defer();
    apiInterFace.requestRuc('ajax_aeskey', null)
      .then(function(response) {
        var key = response.data || '';
        key = CryptoJS.enc.Utf8.parse(key);
        var iv = CryptoJS.enc.Utf8.parse("995d1b5ebbac3761");
        var encrypted = CryptoJS.AES.encrypt(word, key, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.ZeroPadding
        }).toString();
        deferred.resolve(encrypted);
      });
    return deferred.promise;
  },

  askForAuth: function() {
    return apiInterFace.requestRuc('auth', null);
  },

  login: function(data) {
    return apiInterFace.requestRuc('ajax_login', data);
  },

  register: function(data) {
    return apiInterFace.requestRuc('ajax_mobile_register', data);
  },

  requestRegistVCode: function(data) {
    return apiInterFace.requestRuc('ajax_send_register_sms', data);
  },

  requestPasswordVCode: function(data) {
    return apiInterFace.requestRuc('ajax_send_reset_pwd_sms', data);
  },

  askPassword: function(data) {
    return apiInterFace.requestRuc('ajax_check_reset_pwd_mobile', data);
  },

  resetPassword: function(data) {
    return apiInterFace.requestRuc('ajax_reset_forget_pwd', data);
  }
};

module.exports = apiInterFace;