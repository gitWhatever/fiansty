;window.mobileUploader = (function() {

  'use strict';

  var
    /**
     * @desc 默认的裁切压缩配置
     */
    compressConfig = {
      width: 1080,
      height: 1080,
      // 图片质量，只有type为`image/jpeg`的时候才有效。
      quality: 90,
      // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
      allowMagnify: false,
      // 是否允许裁剪。
      crop: false,
      // 是否保留头部meta信息。
      preserveHeaders: false,
      // 如果发现压缩后文件大小比原来还大，则使用原来图片
      // 此属性可能会影响图片自动纠正功能
      noCompressIfLarger: true,
      // 单位字节，如果图片大小小于此值，不会采用压缩。
      compressSize: 0
    };

  /**
   * @desc 初始化上传节点
   */
  function initUploader(opts) {
  //  try {
      if (!WebUploader.Uploader.support()) {
        throw new Error('WebUploader does not support the browser you are using.');
      }
      var
        /**
         * @desc 上传图片的选择器
         * @type {*|string}
         */
        selector = opts.selector || '.webuploader',

        /**
         * @desc 上传图片地址
         * @type {*|string}
         */
        link = opts.link || '';
      if(!link || link.length == 0) {
        throw new Error("Are U kidding? What's the interface?");
      }

      var
        /**
         * @desc 是否是多张图
         */
        isMultiple = opts.multiple || false,

        /**
         * @desc 上传图片的最大size
         * @type {Number}
         */
        limit =  opts.sizeLimit,

        /**
         * @desc 压缩的配置 默认压缩
         */
        config = !opts.doNotCompress ? compressConfig : null;
      return WebUploader.create({
        server: link,
        pick: {
          id: selector,
          multiple: isMultiple
        },
        chunked: false,
        accept: {
          title: 'Images',
          extensions: 'gif,jpg,jpeg,png',
          mimeTypes: 'image/*'
        },
        compress: config,
        fileSingleSizeLimit: limit || 1024*1024*5, //5M
        //for Android
        sendAsBinary:true,
        //缩略图
        thumb:{
          //缩略图裁剪
          crop : true
        }
      });

   // } catch(e) {
    //  return null;
   // }
  }

  return {
    initUploader: initUploader
  }
})();