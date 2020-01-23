"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 *
 * More info at [www.dropzonejs.com](http://www.dropzonejs.com)
 *
 * Copyright (c) 2012, Matias Meno
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

// The Emitter class provides the ability to call `.on()` on Dropzone to listen
// to events.
// It is strongly based on component's emitter class, and I removed the
// functionality because of the dependency hell with different frameworks.
var Emitter = function () {
  function Emitter() {
    _classCallCheck(this, Emitter);
  }

  _createClass(Emitter, [{
    key: "on",

    // Add an event listener for given event
    value: function on(event, fn) {
      this._callbacks = this._callbacks || {};
      // Create namespace for this event
      if (!this._callbacks[event]) {
        this._callbacks[event] = [];
      }
      this._callbacks[event].push(fn);
      return this;
    }
  }, {
    key: "emit",
    value: function emit(event) {
      this._callbacks = this._callbacks || {};
      var callbacks = this._callbacks[event];

      if (callbacks) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        for (var _iterator = callbacks, _isArray = true, _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }

          var callback = _ref;

          callback.apply(this, args);
        }
      }

      return this;
    }

    // Remove event listener for given event. If fn is not provided, all event
    // listeners for that event will be removed. If neither is provided, all
    // event listeners will be removed.

  }, {
    key: "off",
    value: function off(event, fn) {
      if (!this._callbacks || arguments.length === 0) {
        this._callbacks = {};
        return this;
      }

      // specific event
      var callbacks = this._callbacks[event];
      if (!callbacks) {
        return this;
      }

      // remove all handlers
      if (arguments.length === 1) {
        delete this._callbacks[event];
        return this;
      }

      // remove specific handler
      for (var i = 0; i < callbacks.length; i++) {
        var callback = callbacks[i];
        if (callback === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }

      return this;
    }
  }]);

  return Emitter;
}();

var Dropzone = function (_Emitter) {
  _inherits(Dropzone, _Emitter);

  _createClass(Dropzone, null, [{
    key: "initClass",
    value: function initClass() {

      // Exposing the emitter class, mainly for tests
      this.prototype.Emitter = Emitter;

      /*
       This is a list of all available events you can register on a dropzone object.
        You can register an event handler like this:
        dropzone.on("dragEnter", function() { });
        */
      this.prototype.events = ["drop", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "addedfile", "addedfiles", "removedfile", "thumbnail", "error", "errormultiple", "processing", "processingmultiple", "uploadprogress", "totaluploadprogress", "sending", "sendingmultiple", "success", "successmultiple", "canceled", "canceledmultiple", "complete", "completemultiple", "reset", "maxfilesexceeded", "maxfilesreached", "queuecomplete"];

      this.prototype.defaultOptions = {
        /**
         * Has to be specified on elements other than form (or when the form
         * doesn't have an `action` attribute). You can also
         * provide a function that will be called with `files` and
         * must return the url (since `v3.12.0`)
         */
        url: null,

        /**
         * Can be changed to `"put"` if necessary. You can also provide a function
         * that will be called with `files` and must return the method (since `v3.12.0`).
         */
        method: "post",

        /**
         * Will be set on the XHRequest.
         */
        withCredentials: false,

        /**
         * The timeout for the XHR requests in milliseconds (since `v4.4.0`).
         */
        timeout: 30000,

        /**
         * How many file uploads to process in parallel (See the
         * Enqueuing file uploads* documentation section for more info)
         */
        parallelUploads: 2,

        /**
         * Whether to send multiple files in one request. If
         * this it set to true, then the fallback file input element will
         * have the `multiple` attribute as well. This option will
         * also trigger additional events (like `processingmultiple`). See the events
         * documentation section for more information.
         */
        uploadMultiple: false,

        /**
         * Whether you want files to be uploaded in chunks to your server. This can't be
         * used in combination with `uploadMultiple`.
         *
         * See [chunksUploaded](#config-chunksUploaded) for the callback to finalise an upload.
         */
        chunking: false,

        /**
         * If `chunking` is enabled, this defines whether **every** file should be chunked,
         * even if the file size is below chunkSize. This means, that the additional chunk
         * form data will be submitted and the `chunksUploaded` callback will be invoked.
         */
        forceChunking: false,

        /**
         * If `chunking` is `true`, then this defines the chunk size in bytes.
         */
        chunkSize: 2000000,

        /**
         * If `true`, the individual chunks of a file are being uploaded simultaneously.
         */
        parallelChunkUploads: false,

        /**
         * Whether a chunk should be retried if it fails.
         */
        retryChunks: false,

        /**
         * If `retryChunks` is true, how many times should it be retried.
         */
        retryChunksLimit: 3,

        /**
         * If not `null` defines how many files this Dropzone handles. If it exceeds,
         * the event `maxfilesexceeded` will be called. The dropzone element gets the
         * class `dz-max-files-reached` accordingly so you can provide visual feedback.
         */
        maxFilesize: 256,

        /**
         * The name of the file param that gets transferred.
         * **NOTE**: If you have the option  `uploadMultiple` set to `true`, then
         * Dropzone will append `[]` to the name.
         */
        paramName: "file",

        /**
         * Whether thumbnails for images should be generated
         */
        createImageThumbnails: true,

        /**
         * In MB. When the filename exceeds this limit, the thumbnail will not be generated.
         */
        maxThumbnailFilesize: 10,

        /**
         * If `null`, the ratio of the image will be used to calculate it.
         */
        thumbnailWidth: 120,

        /**
         * The same as `thumbnailWidth`. If both are null, images will not be resized.
         */
        thumbnailHeight: 120,

        /**
         * How the images should be scaled down in case both, `thumbnailWidth` and `thumbnailHeight` are provided.
         * Can be either `contain` or `crop`.
         */
        thumbnailMethod: 'crop',

        /**
         * If set, images will be resized to these dimensions before being **uploaded**.
         * If only one, `resizeWidth` **or** `resizeHeight` is provided, the original aspect
         * ratio of the file will be preserved.
         *
         * The `options.transformFile` function uses these options, so if the `transformFile` function
         * is overridden, these options don't do anything.
         */
        resizeWidth: null,

        /**
         * See `resizeWidth`.
         */
        resizeHeight: null,

        /**
         * The mime type of the resized image (before it gets uploaded to the server).
         * If `null` the original mime type will be used. To force jpeg, for example, use `image/jpeg`.
         * See `resizeWidth` for more information.
         */
        resizeMimeType: null,

        /**
         * The quality of the resized images. See `resizeWidth`.
         */
        resizeQuality: 0.8,

        /**
         * How the images should be scaled down in case both, `resizeWidth` and `resizeHeight` are provided.
         * Can be either `contain` or `crop`.
         */
        resizeMethod: 'contain',

        /**
         * The base that is used to calculate the filesize. You can change this to
         * 1024 if you would rather display kibibytes, mebibytes, etc...
         * 1024 is technically incorrect, because `1024 bytes` are `1 kibibyte` not `1 kilobyte`.
         * You can change this to `1024` if you don't care about validity.
         */
        filesizeBase: 1000,

        /**
         * Can be used to limit the maximum number of files that will be handled by this Dropzone
         */
        maxFiles: null,

        /**
         * An optional object to send additional headers to the server. Eg:
         * `{ "My-Awesome-Header": "header value" }`
         */
        headers: null,

        /**
         * If `true`, the dropzone element itself will be clickable, if `false`
         * nothing will be clickable.
         *
         * You can also pass an HTML element, a CSS selector (for multiple elements)
         * or an array of those. In that case, all of those elements will trigger an
         * upload when clicked.
         */
        clickable: true,

        /**
         * Whether hidden files in directories should be ignored.
         */
        ignoreHiddenFiles: true,

        /**
         * The default implementation of `accept` checks the file's mime type or
         * extension against this list. This is a comma separated list of mime
         * types or file extensions.
         *
         * Eg.: `image/*,application/pdf,.psd`
         *
         * If the Dropzone is `clickable` this option will also be used as
         * [`accept`](https://developer.mozilla.org/en-US/docs/HTML/Element/input#attr-accept)
         * parameter on the hidden file input as well.
         */
        acceptedFiles: null,

        /**
         * **Deprecated!**
         * Use acceptedFiles instead.
         */
        acceptedMimeTypes: null,

        /**
         * If false, files will be added to the queue but the queue will not be
         * processed automatically.
         * This can be useful if you need some additional user input before sending
         * files (or if you want want all files sent at once).
         * If you're ready to send the file simply call `myDropzone.processQueue()`.
         *
         * See the [enqueuing file uploads](#enqueuing-file-uploads) documentation
         * section for more information.
         */
        autoProcessQueue: true,

        /**
         * If false, files added to the dropzone will not be queued by default.
         * You'll have to call `enqueueFile(file)` manually.
         */
        autoQueue: true,

        /**
         * If `true`, this will add a link to every file preview to remove or cancel (if
         * already uploading) the file. The `dictCancelUpload`, `dictCancelUploadConfirmation`
         * and `dictRemoveFile` options are used for the wording.
         */
        addRemoveLinks: false,

        /**
         * Defines where to display the file previews – if `null` the
         * Dropzone element itself is used. Can be a plain `HTMLElement` or a CSS
         * selector. The element should have the `dropzone-previews` class so
         * the previews are displayed properly.
         */
        previewsContainer: null,

        /**
         * This is the element the hidden input field (which is used when clicking on the
         * dropzone to trigger file selection) will be appended to. This might
         * be important in case you use frameworks to switch the content of your page.
         *
         * Can be a selector string, or an element directly.
         */
        hiddenInputContainer: "body",

        /**
         * If null, no capture type will be specified
         * If camera, mobile devices will skip the file selection and choose camera
         * If microphone, mobile devices will skip the file selection and choose the microphone
         * If camcorder, mobile devices will skip the file selection and choose the camera in video mode
         * On apple devices multiple must be set to false.  AcceptedFiles may need to
         * be set to an appropriate mime type (e.g. "image/*", "audio/*", or "video/*").
         */
        capture: null,

        /**
         * **Deprecated**. Use `renameFile` instead.
         */
        renameFilename: null,

        /**
         * A function that is invoked before the file is uploaded to the server and renames the file.
         * This function gets the `File` as argument and can use the `file.name`. The actual name of the
         * file that gets used during the upload can be accessed through `file.upload.filename`.
         */
        renameFile: null,

        /**
         * If `true` the fallback will be forced. This is very useful to test your server
         * implementations first and make sure that everything works as
         * expected without dropzone if you experience problems, and to test
         * how your fallbacks will look.
         */
        forceFallback: false,

        /**
         * The text used before any files are dropped.
         */
        dictDefaultMessage: "Drop files here to upload",

        /**
         * The text that replaces the default message text it the browser is not supported.
         */
        dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",

        /**
         * The text that will be added before the fallback form.
         * If you provide a  fallback element yourself, or if this option is `null` this will
         * be ignored.
         */
        dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",

        /**
         * If the filesize is too big.
         * `{{filesize}}` and `{{maxFilesize}}` will be replaced with the respective configuration values.
         */
        dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",

        /**
         * If the file doesn't match the file type.
         */
        dictInvalidFileType: "You can't upload files of this type.",

        /**
         * If the server response was invalid.
         * `{{statusCode}}` will be replaced with the servers status code.
         */
        dictResponseError: "Server responded with {{statusCode}} code.",

        /**
         * If `addRemoveLinks` is true, the text to be used for the cancel upload link.
         */
        dictCancelUpload: "Cancel upload",

        /**
         * The text that is displayed if an upload was manually canceled
         */
        dictUploadCanceled: "Upload canceled.",

        /**
         * If `addRemoveLinks` is true, the text to be used for confirmation when cancelling upload.
         */
        dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",

        /**
         * If `addRemoveLinks` is true, the text to be used to remove a file.
         */
        dictRemoveFile: "Remove file",

        /**
         * If this is not null, then the user will be prompted before removing a file.
         */
        dictRemoveFileConfirmation: null,

        /**
         * Displayed if `maxFiles` is st and exceeded.
         * The string `{{maxFiles}}` will be replaced by the configuration value.
         */
        dictMaxFilesExceeded: "You can not upload any more files.",

        /**
         * Allows you to translate the different units. Starting with `tb` for terabytes and going down to
         * `b` for bytes.
         */
        dictFileSizeUnits: { tb: "TB", gb: "GB", mb: "MB", kb: "KB", b: "b" },
        /**
         * Called when dropzone initialized
         * You can add event listeners here
         */
        init: function init() {},


        /**
         * Can be an **object** of additional parameters to transfer to the server, **or** a `Function`
         * that gets invoked with the `files`, `xhr` and, if it's a chunked upload, `chunk` arguments. In case
         * of a function, this needs to return a map.
         *
         * The default implementation does nothing for normal uploads, but adds relevant information for
         * chunked uploads.
         *
         * This is the same as adding hidden input fields in the form element.
         */
        params: function params(files, xhr, chunk) {
          if (chunk) {
            return {
              dzuuid: chunk.file.upload.uuid,
              dzchunkindex: chunk.index,
              dztotalfilesize: chunk.file.size,
              dzchunksize: this.options.chunkSize,
              dztotalchunkcount: chunk.file.upload.totalChunkCount,
              dzchunkbyteoffset: chunk.index * this.options.chunkSize
            };
          }
        },


        /**
         * A function that gets a [file](https://developer.mozilla.org/en-US/docs/DOM/File)
         * and a `done` function as parameters.
         *
         * If the done function is invoked without arguments, the file is "accepted" and will
         * be processed. If you pass an error message, the file is rejected, and the error
         * message will be displayed.
         * This function will not be called if the file is too big or doesn't match the mime types.
         */
        accept: function accept(file, done) {
          return done();
        },


        /**
         * The callback that will be invoked when all chunks have been uploaded for a file.
         * It gets the file for which the chunks have been uploaded as the first parameter,
         * and the `done` function as second. `done()` needs to be invoked when everything
         * needed to finish the upload process is done.
         */
        chunksUploaded: function chunksUploaded(file, done) {
          done();
        },

        /**
         * Gets called when the browser is not supported.
         * The default implementation shows the fallback input field and adds
         * a text.
         */
        fallback: function fallback() {
          // This code should pass in IE7... :(
          var messageElement = void 0;
          this.element.className = this.element.className + " dz-browser-not-supported";

          for (var _iterator2 = this.element.getElementsByTagName("div"), _isArray2 = true, _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
            var _ref2;

            if (_isArray2) {
              if (_i2 >= _iterator2.length) break;
              _ref2 = _iterator2[_i2++];
            } else {
              _i2 = _iterator2.next();
              if (_i2.done) break;
              _ref2 = _i2.value;
            }

            var child = _ref2;

            if (/(^| )dz-message($| )/.test(child.className)) {
              messageElement = child;
              child.className = "dz-message"; // Removes the 'dz-default' class
              break;
            }
          }
          if (!messageElement) {
            messageElement = Dropzone.createElement("<div class=\"dz-message\"><span></span></div>");
            this.element.appendChild(messageElement);
          }

          var span = messageElement.getElementsByTagName("span")[0];
          if (span) {
            if (span.textContent != null) {
              span.textContent = this.options.dictFallbackMessage;
            } else if (span.innerText != null) {
              span.innerText = this.options.dictFallbackMessage;
            }
          }

          return this.element.appendChild(this.getFallbackForm());
        },


        /**
         * Gets called to calculate the thumbnail dimensions.
         *
         * It gets `file`, `width` and `height` (both may be `null`) as parameters and must return an object containing:
         *
         *  - `srcWidth` & `srcHeight` (required)
         *  - `trgWidth` & `trgHeight` (required)
         *  - `srcX` & `srcY` (optional, default `0`)
         *  - `trgX` & `trgY` (optional, default `0`)
         *
         * Those values are going to be used by `ctx.drawImage()`.
         */
        resize: function resize(file, width, height, resizeMethod) {
          var info = {
            srcX: 0,
            srcY: 0,
            srcWidth: file.width,
            srcHeight: file.height
          };

          var srcRatio = file.width / file.height;

          // Automatically calculate dimensions if not specified
          if (width == null && height == null) {
            width = info.srcWidth;
            height = info.srcHeight;
          } else if (width == null) {
            width = height * srcRatio;
          } else if (height == null) {
            height = width / srcRatio;
          }

          // Make sure images aren't upscaled
          width = Math.min(width, info.srcWidth);
          height = Math.min(height, info.srcHeight);

          var trgRatio = width / height;

          if (info.srcWidth > width || info.srcHeight > height) {
            // Image is bigger and needs rescaling
            if (resizeMethod === 'crop') {
              if (srcRatio > trgRatio) {
                info.srcHeight = file.height;
                info.srcWidth = info.srcHeight * trgRatio;
              } else {
                info.srcWidth = file.width;
                info.srcHeight = info.srcWidth / trgRatio;
              }
            } else if (resizeMethod === 'contain') {
              // Method 'contain'
              if (srcRatio > trgRatio) {
                height = width / srcRatio;
              } else {
                width = height * srcRatio;
              }
            } else {
              throw new Error("Unknown resizeMethod '" + resizeMethod + "'");
            }
          }

          info.srcX = (file.width - info.srcWidth) / 2;
          info.srcY = (file.height - info.srcHeight) / 2;

          info.trgWidth = width;
          info.trgHeight = height;

          return info;
        },


        /**
         * Can be used to transform the file (for example, resize an image if necessary).
         *
         * The default implementation uses `resizeWidth` and `resizeHeight` (if provided) and resizes
         * images according to those dimensions.
         *
         * Gets the `file` as the first parameter, and a `done()` function as the second, that needs
         * to be invoked with the file when the transformation is done.
         */
        transformFile: function transformFile(file, done) {
          if ((this.options.resizeWidth || this.options.resizeHeight) && file.type.match(/image.*/)) {
            return this.resizeImage(file, this.options.resizeWidth, this.options.resizeHeight, this.options.resizeMethod, done);
          } else {
            return done(file);
          }
        },


        /**
         * A string that contains the template used for each dropped
         * file. Change it to fulfill your needs but make sure to properly
         * provide all elements.
         *
         * If you want to use an actual HTML element instead of providing a String
         * as a config option, you could create a div with the id `tpl`,
         * put the template inside it and provide the element like this:
         *
         *     document
         *       .querySelector('#tpl')
         *       .innerHTML
         *
         */
        previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-image\"><img data-dz-thumbnail /></div>\n  <div class=\"dz-details\">\n    <div class=\"dz-size\"><span data-dz-size></span></div>\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n  <div class=\"dz-success-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Check</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <path d=\"M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" stroke-opacity=\"0.198794158\" stroke=\"#747474\" fill-opacity=\"0.816519475\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\"></path>\n      </g>\n    </svg>\n  </div>\n  <div class=\"dz-error-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Error</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Check-+-Oval-2\" sketch:type=\"MSLayerGroup\" stroke=\"#747474\" stroke-opacity=\"0.198794158\" fill=\"#FFFFFF\" fill-opacity=\"0.816519475\">\n          <path d=\"M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" sketch:type=\"MSShapeGroup\"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>",

        // END OPTIONS
        // (Required by the dropzone documentation parser)


        /*
         Those functions register themselves to the events on init and handle all
         the user interface specific stuff. Overwriting them won't break the upload
         but can break the way it's displayed.
         You can overwrite them if you don't like the default behavior. If you just
         want to add an additional event handler, register it on the dropzone object
         and don't overwrite those options.
         */

        // Those are self explanatory and simply concern the DragnDrop.
        drop: function drop(e) {
          return this.element.classList.remove("dz-drag-hover");
        },
        dragstart: function dragstart(e) {},
        dragend: function dragend(e) {
          return this.element.classList.remove("dz-drag-hover");
        },
        dragenter: function dragenter(e) {
          return this.element.classList.add("dz-drag-hover");
        },
        dragover: function dragover(e) {
          return this.element.classList.add("dz-drag-hover");
        },
        dragleave: function dragleave(e) {
          return this.element.classList.remove("dz-drag-hover");
        },
        paste: function paste(e) {},


        // Called whenever there are no files left in the dropzone anymore, and the
        // dropzone should be displayed as if in the initial state.
        reset: function reset() {
          return this.element.classList.remove("dz-started");
        },


        // Called when a file is added to the queue
        // Receives `file`
        addedfile: function addedfile(file) {
          var _this2 = this;

          if (this.element === this.previewsContainer) {
            this.element.classList.add("dz-started");
          }

          if (this.previewsContainer) {
            file.previewElement = Dropzone.createElement(this.options.previewTemplate.trim());
            file.previewTemplate = file.previewElement; // Backwards compatibility

            this.previewsContainer.appendChild(file.previewElement);
            for (var _iterator3 = file.previewElement.querySelectorAll("[data-dz-name]"), _isArray3 = true, _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
              var _ref3;

              if (_isArray3) {
                if (_i3 >= _iterator3.length) break;
                _ref3 = _iterator3[_i3++];
              } else {
                _i3 = _iterator3.next();
                if (_i3.done) break;
                _ref3 = _i3.value;
              }

              var node = _ref3;

              node.textContent = file.name;
            }
            for (var _iterator4 = file.previewElement.querySelectorAll("[data-dz-size]"), _isArray4 = true, _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
              if (_isArray4) {
                if (_i4 >= _iterator4.length) break;
                node = _iterator4[_i4++];
              } else {
                _i4 = _iterator4.next();
                if (_i4.done) break;
                node = _i4.value;
              }

              node.innerHTML = this.filesize(file.size);
            }

            if (this.options.addRemoveLinks) {
              file._removeLink = Dropzone.createElement("<a class=\"dz-remove\" href=\"javascript:undefined;\" data-dz-remove>" + this.options.dictRemoveFile + "</a>");
              file.previewElement.appendChild(file._removeLink);
            }

            var removeFileEvent = function removeFileEvent(e) {
              e.preventDefault();
              e.stopPropagation();
              if (file.status === Dropzone.UPLOADING) {
                return Dropzone.confirm(_this2.options.dictCancelUploadConfirmation, function () {
                  return _this2.removeFile(file);
                });
              } else {
                if (_this2.options.dictRemoveFileConfirmation) {
                  return Dropzone.confirm(_this2.options.dictRemoveFileConfirmation, function () {
                    return _this2.removeFile(file);
                  });
                } else {
                  return _this2.removeFile(file);
                }
              }
            };

            for (var _iterator5 = file.previewElement.querySelectorAll("[data-dz-remove]"), _isArray5 = true, _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
              var _ref4;

              if (_isArray5) {
                if (_i5 >= _iterator5.length) break;
                _ref4 = _iterator5[_i5++];
              } else {
                _i5 = _iterator5.next();
                if (_i5.done) break;
                _ref4 = _i5.value;
              }

              var removeLink = _ref4;

              removeLink.addEventListener("click", removeFileEvent);
            }
          }
        },


        // Called whenever a file is removed.
        removedfile: function removedfile(file) {
          if (file.previewElement != null && file.previewElement.parentNode != null) {
            file.previewElement.parentNode.removeChild(file.previewElement);
          }
          return this._updateMaxFilesReachedClass();
        },


        // Called when a thumbnail has been generated
        // Receives `file` and `dataUrl`
        thumbnail: function thumbnail(file, dataUrl) {
          if (file.previewElement) {
            file.previewElement.classList.remove("dz-file-preview");
            for (var _iterator6 = file.previewElement.querySelectorAll("[data-dz-thumbnail]"), _isArray6 = true, _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
              var _ref5;

              if (_isArray6) {
                if (_i6 >= _iterator6.length) break;
                _ref5 = _iterator6[_i6++];
              } else {
                _i6 = _iterator6.next();
                if (_i6.done) break;
                _ref5 = _i6.value;
              }

              var thumbnailElement = _ref5;

              thumbnailElement.alt = file.name;
              thumbnailElement.src = dataUrl;
            }

            return setTimeout(function () {
              return file.previewElement.classList.add("dz-image-preview");
            }, 1);
          }
        },


        // Called whenever an error occurs
        // Receives `file` and `message`
        error: function error(file, message) {
          if (file.previewElement) {
            file.previewElement.classList.add("dz-error");
            if (typeof message !== "String" && message.error) {
              message = message.error;
            }
            for (var _iterator7 = file.previewElement.querySelectorAll("[data-dz-errormessage]"), _isArray7 = true, _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
              var _ref6;

              if (_isArray7) {
                if (_i7 >= _iterator7.length) break;
                _ref6 = _iterator7[_i7++];
              } else {
                _i7 = _iterator7.next();
                if (_i7.done) break;
                _ref6 = _i7.value;
              }

              var node = _ref6;

              node.textContent = message;
            }
          }
        },
        errormultiple: function errormultiple() {},


        // Called when a file gets processed. Since there is a cue, not all added
        // files are processed immediately.
        // Receives `file`
        processing: function processing(file) {
          if (file.previewElement) {
            file.previewElement.classList.add("dz-processing");
            if (file._removeLink) {
              return file._removeLink.innerHTML = this.options.dictCancelUpload;
            }
          }
        },
        processingmultiple: function processingmultiple() {},


        // Called whenever the upload progress gets updated.
        // Receives `file`, `progress` (percentage 0-100) and `bytesSent`.
        // To get the total number of bytes of the file, use `file.size`
        uploadprogress: function uploadprogress(file, progress, bytesSent) {
          if (file.previewElement) {
            for (var _iterator8 = file.previewElement.querySelectorAll("[data-dz-uploadprogress]"), _isArray8 = true, _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
              var _ref7;

              if (_isArray8) {
                if (_i8 >= _iterator8.length) break;
                _ref7 = _iterator8[_i8++];
              } else {
                _i8 = _iterator8.next();
                if (_i8.done) break;
                _ref7 = _i8.value;
              }

              var node = _ref7;

              node.nodeName === 'PROGRESS' ? node.value = progress : node.style.width = progress + "%";
            }
          }
        },


        // Called whenever the total upload progress gets updated.
        // Called with totalUploadProgress (0-100), totalBytes and totalBytesSent
        totaluploadprogress: function totaluploadprogress() {},


        // Called just before the file is sent. Gets the `xhr` object as second
        // parameter, so you can modify it (for example to add a CSRF token) and a
        // `formData` object to add additional information.
        sending: function sending() {},
        sendingmultiple: function sendingmultiple() {},


        // When the complete upload is finished and successful
        // Receives `file`
        success: function success(file) {
          if (file.previewElement) {
            return file.previewElement.classList.add("dz-success");
          }
        },
        successmultiple: function successmultiple() {},


        // When the upload is canceled.
        canceled: function canceled(file) {
          return this.emit("error", file, this.options.dictUploadCanceled);
        },
        canceledmultiple: function canceledmultiple() {},


        // When the upload is finished, either with success or an error.
        // Receives `file`
        complete: function complete(file) {
          if (file._removeLink) {
            file._removeLink.innerHTML = this.options.dictRemoveFile;
          }
          if (file.previewElement) {
            return file.previewElement.classList.add("dz-complete");
          }
        },
        completemultiple: function completemultiple() {},
        maxfilesexceeded: function maxfilesexceeded() {},
        maxfilesreached: function maxfilesreached() {},
        queuecomplete: function queuecomplete() {},
        addedfiles: function addedfiles() {}
      };

      this.prototype._thumbnailQueue = [];
      this.prototype._processingThumbnail = false;
    }

    // global utility

  }, {
    key: "extend",
    value: function extend(target) {
      for (var _len2 = arguments.length, objects = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        objects[_key2 - 1] = arguments[_key2];
      }

      for (var _iterator9 = objects, _isArray9 = true, _i9 = 0, _iterator9 = _isArray9 ? _iterator9 : _iterator9[Symbol.iterator]();;) {
        var _ref8;

        if (_isArray9) {
          if (_i9 >= _iterator9.length) break;
          _ref8 = _iterator9[_i9++];
        } else {
          _i9 = _iterator9.next();
          if (_i9.done) break;
          _ref8 = _i9.value;
        }

        var object = _ref8;

        for (var key in object) {
          var val = object[key];
          target[key] = val;
        }
      }
      return target;
    }
  }]);

  function Dropzone(el, options) {
    _classCallCheck(this, Dropzone);

    var _this = _possibleConstructorReturn(this, (Dropzone.__proto__ || Object.getPrototypeOf(Dropzone)).call(this));

    var fallback = void 0,
        left = void 0;
    _this.element = el;
    // For backwards compatibility since the version was in the prototype previously
    _this.version = Dropzone.version;

    _this.defaultOptions.previewTemplate = _this.defaultOptions.previewTemplate.replace(/\n*/g, "");

    _this.clickableElements = [];
    _this.listeners = [];
    _this.files = []; // All files

    if (typeof _this.element === "string") {
      _this.element = document.querySelector(_this.element);
    }

    // Not checking if instance of HTMLElement or Element since IE9 is extremely weird.
    if (!_this.element || _this.element.nodeType == null) {
      throw new Error("Invalid dropzone element.");
    }

    if (_this.element.dropzone) {
      throw new Error("Dropzone already attached.");
    }

    // Now add this dropzone to the instances.
    Dropzone.instances.push(_this);

    // Put the dropzone inside the element itself.
    _this.element.dropzone = _this;

    var elementOptions = (left = Dropzone.optionsForElement(_this.element)) != null ? left : {};

    _this.options = Dropzone.extend({}, _this.defaultOptions, elementOptions, options != null ? options : {});

    // If the browser failed, just call the fallback and leave
    if (_this.options.forceFallback || !Dropzone.isBrowserSupported()) {
      var _ret;

      return _ret = _this.options.fallback.call(_this), _possibleConstructorReturn(_this, _ret);
    }

    // @options.url = @element.getAttribute "action" unless @options.url?
    if (_this.options.url == null) {
      _this.options.url = _this.element.getAttribute("action");
    }

    if (!_this.options.url) {
      throw new Error("No URL provided.");
    }

    if (_this.options.acceptedFiles && _this.options.acceptedMimeTypes) {
      throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");
    }

    if (_this.options.uploadMultiple && _this.options.chunking) {
      throw new Error('You cannot set both: uploadMultiple and chunking.');
    }

    // Backwards compatibility
    if (_this.options.acceptedMimeTypes) {
      _this.options.acceptedFiles = _this.options.acceptedMimeTypes;
      delete _this.options.acceptedMimeTypes;
    }

    // Backwards compatibility
    if (_this.options.renameFilename != null) {
      _this.options.renameFile = function (file) {
        return _this.options.renameFilename.call(_this, file.name, file);
      };
    }

    _this.options.method = _this.options.method.toUpperCase();

    if ((fallback = _this.getExistingFallback()) && fallback.parentNode) {
      // Remove the fallback
      fallback.parentNode.removeChild(fallback);
    }

    // Display previews in the previewsContainer element or the Dropzone element unless explicitly set to false
    if (_this.options.previewsContainer !== false) {
      if (_this.options.previewsContainer) {
        _this.previewsContainer = Dropzone.getElement(_this.options.previewsContainer, "previewsContainer");
      } else {
        _this.previewsContainer = _this.element;
      }
    }

    if (_this.options.clickable) {
      if (_this.options.clickable === true) {
        _this.clickableElements = [_this.element];
      } else {
        _this.clickableElements = Dropzone.getElements(_this.options.clickable, "clickable");
      }
    }

    _this.init();
    return _this;
  }

  // Returns all files that have been accepted


  _createClass(Dropzone, [{
    key: "getAcceptedFiles",
    value: function getAcceptedFiles() {
      return this.files.filter(function (file) {
        return file.accepted;
      }).map(function (file) {
        return file;
      });
    }

    // Returns all files that have been rejected
    // Not sure when that's going to be useful, but added for completeness.

  }, {
    key: "getRejectedFiles",
    value: function getRejectedFiles() {
      return this.files.filter(function (file) {
        return !file.accepted;
      }).map(function (file) {
        return file;
      });
    }
  }, {
    key: "getFilesWithStatus",
    value: function getFilesWithStatus(status) {
      return this.files.filter(function (file) {
        return file.status === status;
      }).map(function (file) {
        return file;
      });
    }

    // Returns all files that are in the queue

  }, {
    key: "getQueuedFiles",
    value: function getQueuedFiles() {
      return this.getFilesWithStatus(Dropzone.QUEUED);
    }
  }, {
    key: "getUploadingFiles",
    value: function getUploadingFiles() {
      return this.getFilesWithStatus(Dropzone.UPLOADING);
    }
  }, {
    key: "getAddedFiles",
    value: function getAddedFiles() {
      return this.getFilesWithStatus(Dropzone.ADDED);
    }

    // Files that are either queued or uploading

  }, {
    key: "getActiveFiles",
    value: function getActiveFiles() {
      return this.files.filter(function (file) {
        return file.status === Dropzone.UPLOADING || file.status === Dropzone.QUEUED;
      }).map(function (file) {
        return file;
      });
    }

    // The function that gets called when Dropzone is initialized. You
    // can (and should) setup event listeners inside this function.

  }, {
    key: "init",
    value: function init() {
      var _this3 = this;

      // In case it isn't set already
      if (this.element.tagName === "form") {
        this.element.setAttribute("enctype", "multipart/form-data");
      }

      if (this.element.classList.contains("dropzone") && !this.element.querySelector(".dz-message")) {
        this.element.appendChild(Dropzone.createElement("<div class=\"dz-default dz-message\"><span>" + this.options.dictDefaultMessage + "</span></div>"));
      }

      if (this.clickableElements.length) {
        var setupHiddenFileInput = function setupHiddenFileInput() {
          if (_this3.hiddenFileInput) {
            _this3.hiddenFileInput.parentNode.removeChild(_this3.hiddenFileInput);
          }
          _this3.hiddenFileInput = document.createElement("input");
          _this3.hiddenFileInput.setAttribute("type", "file");
          if (_this3.options.maxFiles === null || _this3.options.maxFiles > 1) {
            _this3.hiddenFileInput.setAttribute("multiple", "multiple");
          }
          _this3.hiddenFileInput.className = "dz-hidden-input";

          if (_this3.options.acceptedFiles !== null) {
            _this3.hiddenFileInput.setAttribute("accept", _this3.options.acceptedFiles);
          }
          if (_this3.options.capture !== null) {
            _this3.hiddenFileInput.setAttribute("capture", _this3.options.capture);
          }

          // Not setting `display="none"` because some browsers don't accept clicks
          // on elements that aren't displayed.
          _this3.hiddenFileInput.style.visibility = "hidden";
          _this3.hiddenFileInput.style.position = "absolute";
          _this3.hiddenFileInput.style.top = "0";
          _this3.hiddenFileInput.style.left = "0";
          _this3.hiddenFileInput.style.height = "0";
          _this3.hiddenFileInput.style.width = "0";
          Dropzone.getElement(_this3.options.hiddenInputContainer, 'hiddenInputContainer').appendChild(_this3.hiddenFileInput);
          return _this3.hiddenFileInput.addEventListener("change", function () {
            var files = _this3.hiddenFileInput.files;

            if (files.length) {
              for (var _iterator10 = files, _isArray10 = true, _i10 = 0, _iterator10 = _isArray10 ? _iterator10 : _iterator10[Symbol.iterator]();;) {
                var _ref9;

                if (_isArray10) {
                  if (_i10 >= _iterator10.length) break;
                  _ref9 = _iterator10[_i10++];
                } else {
                  _i10 = _iterator10.next();
                  if (_i10.done) break;
                  _ref9 = _i10.value;
                }

                var file = _ref9;

                _this3.addFile(file);
              }
            }
            _this3.emit("addedfiles", files);
            return setupHiddenFileInput();
          });
        };
        setupHiddenFileInput();
      }

      this.URL = window.URL !== null ? window.URL : window.webkitURL;

      // Setup all event listeners on the Dropzone object itself.
      // They're not in @setupEventListeners() because they shouldn't be removed
      // again when the dropzone gets disabled.
      for (var _iterator11 = this.events, _isArray11 = true, _i11 = 0, _iterator11 = _isArray11 ? _iterator11 : _iterator11[Symbol.iterator]();;) {
        var _ref10;

        if (_isArray11) {
          if (_i11 >= _iterator11.length) break;
          _ref10 = _iterator11[_i11++];
        } else {
          _i11 = _iterator11.next();
          if (_i11.done) break;
          _ref10 = _i11.value;
        }

        var eventName = _ref10;

        this.on(eventName, this.options[eventName]);
      }

      this.on("uploadprogress", function () {
        return _this3.updateTotalUploadProgress();
      });

      this.on("removedfile", function () {
        return _this3.updateTotalUploadProgress();
      });

      this.on("canceled", function (file) {
        return _this3.emit("complete", file);
      });

      // Emit a `queuecomplete` event if all files finished uploading.
      this.on("complete", function (file) {
        if (_this3.getAddedFiles().length === 0 && _this3.getUploadingFiles().length === 0 && _this3.getQueuedFiles().length === 0) {
          // This needs to be deferred so that `queuecomplete` really triggers after `complete`
          return setTimeout(function () {
            return _this3.emit("queuecomplete");
          }, 0);
        }
      });

      var noPropagation = function noPropagation(e) {
        e.stopPropagation();
        if (e.preventDefault) {
          return e.preventDefault();
        } else {
          return e.returnValue = false;
        }
      };

      // Create the listeners
      this.listeners = [{
        element: this.element,
        events: {
          "dragstart": function dragstart(e) {
            return _this3.emit("dragstart", e);
          },
          "dragenter": function dragenter(e) {
            noPropagation(e);
            return _this3.emit("dragenter", e);
          },
          "dragover": function dragover(e) {
            // Makes it possible to drag files from chrome's download bar
            // http://stackoverflow.com/questions/19526430/drag-and-drop-file-uploads-from-chrome-downloads-bar
            // Try is required to prevent bug in Internet Explorer 11 (SCRIPT65535 exception)
            var efct = void 0;
            try {
              efct = e.dataTransfer.effectAllowed;
            } catch (error) {}
            e.dataTransfer.dropEffect = 'move' === efct || 'linkMove' === efct ? 'move' : 'copy';

            noPropagation(e);
            return _this3.emit("dragover", e);
          },
          "dragleave": function dragleave(e) {
            return _this3.emit("dragleave", e);
          },
          "drop": function drop(e) {
            noPropagation(e);
            return _this3.drop(e);
          },
          "dragend": function dragend(e) {
            return _this3.emit("dragend", e);
          }

          // This is disabled right now, because the browsers don't implement it properly.
          // "paste": (e) =>
          //   noPropagation e
          //   @paste e
        } }];

      this.clickableElements.forEach(function (clickableElement) {
        return _this3.listeners.push({
          element: clickableElement,
          events: {
            "click": function click(evt) {
              // Only the actual dropzone or the message element should trigger file selection
              if (clickableElement !== _this3.element || evt.target === _this3.element || Dropzone.elementInside(evt.target, _this3.element.querySelector(".dz-message"))) {
                _this3.hiddenFileInput.click(); // Forward the click
              }
              return true;
            }
          }
        });
      });

      this.enable();

      return this.options.init.call(this);
    }

    // Not fully tested yet

  }, {
    key: "destroy",
    value: function destroy() {
      this.disable();
      this.removeAllFiles(true);
      if (this.hiddenFileInput != null ? this.hiddenFileInput.parentNode : undefined) {
        this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);
        this.hiddenFileInput = null;
      }
      delete this.element.dropzone;
      return Dropzone.instances.splice(Dropzone.instances.indexOf(this), 1);
    }
  }, {
    key: "updateTotalUploadProgress",
    value: function updateTotalUploadProgress() {
      var totalUploadProgress = void 0;
      var totalBytesSent = 0;
      var totalBytes = 0;

      var activeFiles = this.getActiveFiles();

      if (activeFiles.length) {
        for (var _iterator12 = this.getActiveFiles(), _isArray12 = true, _i12 = 0, _iterator12 = _isArray12 ? _iterator12 : _iterator12[Symbol.iterator]();;) {
          var _ref11;

          if (_isArray12) {
            if (_i12 >= _iterator12.length) break;
            _ref11 = _iterator12[_i12++];
          } else {
            _i12 = _iterator12.next();
            if (_i12.done) break;
            _ref11 = _i12.value;
          }

          var file = _ref11;

          totalBytesSent += file.upload.bytesSent;
          totalBytes += file.upload.total;
        }
        totalUploadProgress = 100 * totalBytesSent / totalBytes;
      } else {
        totalUploadProgress = 100;
      }

      return this.emit("totaluploadprogress", totalUploadProgress, totalBytes, totalBytesSent);
    }

    // @options.paramName can be a function taking one parameter rather than a string.
    // A parameter name for a file is obtained simply by calling this with an index number.

  }, {
    key: "_getParamName",
    value: function _getParamName(n) {
      if (typeof this.options.paramName === "function") {
        return this.options.paramName(n);
      } else {
        return "" + this.options.paramName + (this.options.uploadMultiple ? "[" + n + "]" : "");
      }
    }

    // If @options.renameFile is a function,
    // the function will be used to rename the file.name before appending it to the formData

  }, {
    key: "_renameFile",
    value: function _renameFile(file) {
      if (typeof this.options.renameFile !== "function") {
        return file.name;
      }
      return this.options.renameFile(file);
    }

    // Returns a form that can be used as fallback if the browser does not support DragnDrop
    //
    // If the dropzone is already a form, only the input field and button are returned. Otherwise a complete form element is provided.
    // This code has to pass in IE7 :(

  }, {
    key: "getFallbackForm",
    value: function getFallbackForm() {
      var existingFallback = void 0,
          form = void 0;
      if (existingFallback = this.getExistingFallback()) {
        return existingFallback;
      }

      var fieldsString = "<div class=\"dz-fallback\">";
      if (this.options.dictFallbackText) {
        fieldsString += "<p>" + this.options.dictFallbackText + "</p>";
      }
      fieldsString += "<input type=\"file\" name=\"" + this._getParamName(0) + "\" " + (this.options.uploadMultiple ? 'multiple="multiple"' : undefined) + " /><input type=\"submit\" value=\"Upload!\"></div>";

      var fields = Dropzone.createElement(fieldsString);
      if (this.element.tagName !== "FORM") {
        form = Dropzone.createElement("<form action=\"" + this.options.url + "\" enctype=\"multipart/form-data\" method=\"" + this.options.method + "\"></form>");
        form.appendChild(fields);
      } else {
        // Make sure that the enctype and method attributes are set properly
        this.element.setAttribute("enctype", "multipart/form-data");
        this.element.setAttribute("method", this.options.method);
      }
      return form != null ? form : fields;
    }

    // Returns the fallback elements if they exist already
    //
    // This code has to pass in IE7 :(

  }, {
    key: "getExistingFallback",
    value: function getExistingFallback() {
      var getFallback = function getFallback(elements) {
        for (var _iterator13 = elements, _isArray13 = true, _i13 = 0, _iterator13 = _isArray13 ? _iterator13 : _iterator13[Symbol.iterator]();;) {
          var _ref12;

          if (_isArray13) {
            if (_i13 >= _iterator13.length) break;
            _ref12 = _iterator13[_i13++];
          } else {
            _i13 = _iterator13.next();
            if (_i13.done) break;
            _ref12 = _i13.value;
          }

          var el = _ref12;

          if (/(^| )fallback($| )/.test(el.className)) {
            return el;
          }
        }
      };

      var _arr = ["div", "form"];
      for (var _i14 = 0; _i14 < _arr.length; _i14++) {
        var tagName = _arr[_i14];
        var fallback;
        if (fallback = getFallback(this.element.getElementsByTagName(tagName))) {
          return fallback;
        }
      }
    }

    // Activates all listeners stored in @listeners

  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      return this.listeners.map(function (elementListeners) {
        return function () {
          var result = [];
          for (var event in elementListeners.events) {
            var listener = elementListeners.events[event];
            result.push(elementListeners.element.addEventListener(event, listener, false));
          }
          return result;
        }();
      });
    }

    // Deactivates all listeners stored in @listeners

  }, {
    key: "removeEventListeners",
    value: function removeEventListeners() {
      return this.listeners.map(function (elementListeners) {
        return function () {
          var result = [];
          for (var event in elementListeners.events) {
            var listener = elementListeners.events[event];
            result.push(elementListeners.element.removeEventListener(event, listener, false));
          }
          return result;
        }();
      });
    }

    // Removes all event listeners and cancels all files in the queue or being processed.

  }, {
    key: "disable",
    value: function disable() {
      var _this4 = this;

      this.clickableElements.forEach(function (element) {
        return element.classList.remove("dz-clickable");
      });
      this.removeEventListeners();
      this.disabled = true;

      return this.files.map(function (file) {
        return _this4.cancelUpload(file);
      });
    }
  }, {
    key: "enable",
    value: function enable() {
      delete this.disabled;
      this.clickableElements.forEach(function (element) {
        return element.classList.add("dz-clickable");
      });
      return this.setupEventListeners();
    }

    // Returns a nicely formatted filesize

  }, {
    key: "filesize",
    value: function filesize(size) {
      var selectedSize = 0;
      var selectedUnit = "b";

      if (size > 0) {
        var units = ['tb', 'gb', 'mb', 'kb', 'b'];

        for (var i = 0; i < units.length; i++) {
          var unit = units[i];
          var cutoff = Math.pow(this.options.filesizeBase, 4 - i) / 10;

          if (size >= cutoff) {
            selectedSize = size / Math.pow(this.options.filesizeBase, 4 - i);
            selectedUnit = unit;
            break;
          }
        }

        selectedSize = Math.round(10 * selectedSize) / 10; // Cutting of digits
      }

      return "<strong>" + selectedSize + "</strong> " + this.options.dictFileSizeUnits[selectedUnit];
    }

    // Adds or removes the `dz-max-files-reached` class from the form.

  }, {
    key: "_updateMaxFilesReachedClass",
    value: function _updateMaxFilesReachedClass() {
      if (this.options.maxFiles != null && this.getAcceptedFiles().length >= this.options.maxFiles) {
        if (this.getAcceptedFiles().length === this.options.maxFiles) {
          this.emit('maxfilesreached', this.files);
        }
        return this.element.classList.add("dz-max-files-reached");
      } else {
        return this.element.classList.remove("dz-max-files-reached");
      }
    }
  }, {
    key: "drop",
    value: function drop(e) {
      if (!e.dataTransfer) {
        return;
      }
      this.emit("drop", e);

      // Convert the FileList to an Array
      // This is necessary for IE11
      var files = [];
      for (var i = 0; i < e.dataTransfer.files.length; i++) {
        files[i] = e.dataTransfer.files[i];
      }

      this.emit("addedfiles", files);

      // Even if it's a folder, files.length will contain the folders.
      if (files.length) {
        var items = e.dataTransfer.items;

        if (items && items.length && items[0].webkitGetAsEntry != null) {
          // The browser supports dropping of folders, so handle items instead of files
          this._addFilesFromItems(items);
        } else {
          this.handleFiles(files);
        }
      }
    }
  }, {
    key: "paste",
    value: function paste(e) {
      if (__guard__(e != null ? e.clipboardData : undefined, function (x) {
        return x.items;
      }) == null) {
        return;
      }

      this.emit("paste", e);
      var items = e.clipboardData.items;


      if (items.length) {
        return this._addFilesFromItems(items);
      }
    }
  }, {
    key: "handleFiles",
    value: function handleFiles(files) {
      for (var _iterator14 = files, _isArray14 = true, _i15 = 0, _iterator14 = _isArray14 ? _iterator14 : _iterator14[Symbol.iterator]();;) {
        var _ref13;

        if (_isArray14) {
          if (_i15 >= _iterator14.length) break;
          _ref13 = _iterator14[_i15++];
        } else {
          _i15 = _iterator14.next();
          if (_i15.done) break;
          _ref13 = _i15.value;
        }

        var file = _ref13;

        this.addFile(file);
      }
    }

    // When a folder is dropped (or files are pasted), items must be handled
    // instead of files.

  }, {
    key: "_addFilesFromItems",
    value: function _addFilesFromItems(items) {
      var _this5 = this;

      return function () {
        var result = [];
        for (var _iterator15 = items, _isArray15 = true, _i16 = 0, _iterator15 = _isArray15 ? _iterator15 : _iterator15[Symbol.iterator]();;) {
          var _ref14;

          if (_isArray15) {
            if (_i16 >= _iterator15.length) break;
            _ref14 = _iterator15[_i16++];
          } else {
            _i16 = _iterator15.next();
            if (_i16.done) break;
            _ref14 = _i16.value;
          }

          var item = _ref14;

          var entry;
          if (item.webkitGetAsEntry != null && (entry = item.webkitGetAsEntry())) {
            if (entry.isFile) {
              result.push(_this5.addFile(item.getAsFile()));
            } else if (entry.isDirectory) {
              // Append all files from that directory to files
              result.push(_this5._addFilesFromDirectory(entry, entry.name));
            } else {
              result.push(undefined);
            }
          } else if (item.getAsFile != null) {
            if (item.kind == null || item.kind === "file") {
              result.push(_this5.addFile(item.getAsFile()));
            } else {
              result.push(undefined);
            }
          } else {
            result.push(undefined);
          }
        }
        return result;
      }();
    }

    // Goes through the directory, and adds each file it finds recursively

  }, {
    key: "_addFilesFromDirectory",
    value: function _addFilesFromDirectory(directory, path) {
      var _this6 = this;

      var dirReader = directory.createReader();

      var errorHandler = function errorHandler(error) {
        return __guardMethod__(console, 'log', function (o) {
          return o.log(error);
        });
      };

      var readEntries = function readEntries() {
        return dirReader.readEntries(function (entries) {
          if (entries.length > 0) {
            for (var _iterator16 = entries, _isArray16 = true, _i17 = 0, _iterator16 = _isArray16 ? _iterator16 : _iterator16[Symbol.iterator]();;) {
              var _ref15;

              if (_isArray16) {
                if (_i17 >= _iterator16.length) break;
                _ref15 = _iterator16[_i17++];
              } else {
                _i17 = _iterator16.next();
                if (_i17.done) break;
                _ref15 = _i17.value;
              }

              var entry = _ref15;

              if (entry.isFile) {
                entry.file(function (file) {
                  if (_this6.options.ignoreHiddenFiles && file.name.substring(0, 1) === '.') {
                    return;
                  }
                  file.fullPath = path + "/" + file.name;
                  return _this6.addFile(file);
                });
              } else if (entry.isDirectory) {
                _this6._addFilesFromDirectory(entry, path + "/" + entry.name);
              }
            }

            // Recursively call readEntries() again, since browser only handle
            // the first 100 entries.
            // See: https://developer.mozilla.org/en-US/docs/Web/API/DirectoryReader#readEntries
            readEntries();
          }
          return null;
        }, errorHandler);
      };

      return readEntries();
    }

    // If `done()` is called without argument the file is accepted
    // If you call it with an error message, the file is rejected
    // (This allows for asynchronous validation)
    //
    // This function checks the filesize, and if the file.type passes the
    // `acceptedFiles` check.

  }, {
    key: "accept",
    value: function accept(file, done) {
      if (this.options.maxFilesize && file.size > this.options.maxFilesize * 1024 * 1024) {
        return done(this.options.dictFileTooBig.replace("{{filesize}}", Math.round(file.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", this.options.maxFilesize));
      } else if (!Dropzone.isValidFile(file, this.options.acceptedFiles)) {
        return done(this.options.dictInvalidFileType);
      } else if (this.options.maxFiles != null && this.getAcceptedFiles().length >= this.options.maxFiles) {
        done(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}", this.options.maxFiles));
        return this.emit("maxfilesexceeded", file);
      } else {
        return this.options.accept.call(this, file, done);
      }
    }
  }, {
    key: "addFile",
    value: function addFile(file) {
      var _this7 = this;

      file.upload = {
        uuid: Dropzone.uuidv4(),
        progress: 0,
        // Setting the total upload size to file.size for the beginning
        // It's actual different than the size to be transmitted.
        total: file.size,
        bytesSent: 0,
        filename: this._renameFile(file),
        chunked: this.options.chunking && (this.options.forceChunking || file.size > this.options.chunkSize),
        totalChunkCount: Math.ceil(file.size / this.options.chunkSize)
      };
      this.files.push(file);

      file.status = Dropzone.ADDED;

      this.emit("addedfile", file);

      this._enqueueThumbnail(file);

      return this.accept(file, function (error) {
        if (error) {
          file.accepted = false;
          _this7._errorProcessing([file], error); // Will set the file.status
        } else {
          file.accepted = true;
          if (_this7.options.autoQueue) {
            _this7.enqueueFile(file);
          } // Will set .accepted = true
        }
        return _this7._updateMaxFilesReachedClass();
      });
    }

    // Wrapper for enqueueFile

  }, {
    key: "enqueueFiles",
    value: function enqueueFiles(files) {
      for (var _iterator17 = files, _isArray17 = true, _i18 = 0, _iterator17 = _isArray17 ? _iterator17 : _iterator17[Symbol.iterator]();;) {
        var _ref16;

        if (_isArray17) {
          if (_i18 >= _iterator17.length) break;
          _ref16 = _iterator17[_i18++];
        } else {
          _i18 = _iterator17.next();
          if (_i18.done) break;
          _ref16 = _i18.value;
        }

        var file = _ref16;

        this.enqueueFile(file);
      }
      return null;
    }
  }, {
    key: "enqueueFile",
    value: function enqueueFile(file) {
      var _this8 = this;

      if (file.status === Dropzone.ADDED && file.accepted === true) {
        file.status = Dropzone.QUEUED;
        if (this.options.autoProcessQueue) {
          return setTimeout(function () {
            return _this8.processQueue();
          }, 0); // Deferring the call
        }
      } else {
        throw new Error("This file can't be queued because it has already been processed or was rejected.");
      }
    }
  }, {
    key: "_enqueueThumbnail",
    value: function _enqueueThumbnail(file) {
      var _this9 = this;

      if (this.options.createImageThumbnails && file.type.match(/image.*/) && file.size <= this.options.maxThumbnailFilesize * 1024 * 1024) {
        this._thumbnailQueue.push(file);
        return setTimeout(function () {
          return _this9._processThumbnailQueue();
        }, 0); // Deferring the call
      }
    }
  }, {
    key: "_processThumbnailQueue",
    value: function _processThumbnailQueue() {
      var _this10 = this;

      if (this._processingThumbnail || this._thumbnailQueue.length === 0) {
        return;
      }

      this._processingThumbnail = true;
      var file = this._thumbnailQueue.shift();
      return this.createThumbnail(file, this.options.thumbnailWidth, this.options.thumbnailHeight, this.options.thumbnailMethod, true, function (dataUrl) {
        _this10.emit("thumbnail", file, dataUrl);
        _this10._processingThumbnail = false;
        return _this10._processThumbnailQueue();
      });
    }

    // Can be called by the user to remove a file

  }, {
    key: "removeFile",
    value: function removeFile(file) {
      if (file.status === Dropzone.UPLOADING) {
        this.cancelUpload(file);
      }
      this.files = without(this.files, file);

      this.emit("removedfile", file);
      if (this.files.length === 0) {
        return this.emit("reset");
      }
    }

    // Removes all files that aren't currently processed from the list

  }, {
    key: "removeAllFiles",
    value: function removeAllFiles(cancelIfNecessary) {
      // Create a copy of files since removeFile() changes the @files array.
      if (cancelIfNecessary == null) {
        cancelIfNecessary = false;
      }
      for (var _iterator18 = this.files.slice(), _isArray18 = true, _i19 = 0, _iterator18 = _isArray18 ? _iterator18 : _iterator18[Symbol.iterator]();;) {
        var _ref17;

        if (_isArray18) {
          if (_i19 >= _iterator18.length) break;
          _ref17 = _iterator18[_i19++];
        } else {
          _i19 = _iterator18.next();
          if (_i19.done) break;
          _ref17 = _i19.value;
        }

        var file = _ref17;

        if (file.status !== Dropzone.UPLOADING || cancelIfNecessary) {
          this.removeFile(file);
        }
      }
      return null;
    }

    // Resizes an image before it gets sent to the server. This function is the default behavior of
    // `options.transformFile` if `resizeWidth` or `resizeHeight` are set. The callback is invoked with
    // the resized blob.

  }, {
    key: "resizeImage",
    value: function resizeImage(file, width, height, resizeMethod, callback) {
      var _this11 = this;

      return this.createThumbnail(file, width, height, resizeMethod, true, function (dataUrl, canvas) {
        if (canvas == null) {
          // The image has not been resized
          return callback(file);
        } else {
          var resizeMimeType = _this11.options.resizeMimeType;

          if (resizeMimeType == null) {
            resizeMimeType = file.type;
          }
          var resizedDataURL = canvas.toDataURL(resizeMimeType, _this11.options.resizeQuality);
          if (resizeMimeType === 'image/jpeg' || resizeMimeType === 'image/jpg') {
            // Now add the original EXIF information
            resizedDataURL = ExifRestore.restore(file.dataURL, resizedDataURL);
          }
          return callback(Dropzone.dataURItoBlob(resizedDataURL));
        }
      });
    }
  }, {
    key: "createThumbnail",
    value: function createThumbnail(file, width, height, resizeMethod, fixOrientation, callback) {
      var _this12 = this;

      var fileReader = new FileReader();

      fileReader.onload = function () {

        file.dataURL = fileReader.result;

        // Don't bother creating a thumbnail for SVG images since they're vector
        if (file.type === "image/svg+xml") {
          if (callback != null) {
            callback(fileReader.result);
          }
          return;
        }

        return _this12.createThumbnailFromUrl(file, width, height, resizeMethod, fixOrientation, callback);
      };

      return fileReader.readAsDataURL(file);
    }
  }, {
    key: "createThumbnailFromUrl",
    value: function createThumbnailFromUrl(file, width, height, resizeMethod, fixOrientation, callback, crossOrigin) {
      var _this13 = this;

      // Not using `new Image` here because of a bug in latest Chrome versions.
      // See https://github.com/enyo/dropzone/pull/226
      var img = document.createElement("img");

      if (crossOrigin) {
        img.crossOrigin = crossOrigin;
      }

      img.onload = function () {
        var loadExif = function loadExif(callback) {
          return callback(1);
        };
        if (typeof EXIF !== 'undefined' && EXIF !== null && fixOrientation) {
          loadExif = function loadExif(callback) {
            return EXIF.getData(img, function () {
              return callback(EXIF.getTag(this, 'Orientation'));
            });
          };
        }

        return loadExif(function (orientation) {
          file.width = img.width;
          file.height = img.height;

          var resizeInfo = _this13.options.resize.call(_this13, file, width, height, resizeMethod);

          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");

          canvas.width = resizeInfo.trgWidth;
          canvas.height = resizeInfo.trgHeight;

          if (orientation > 4) {
            canvas.width = resizeInfo.trgHeight;
            canvas.height = resizeInfo.trgWidth;
          }

          switch (orientation) {
            case 2:
              // horizontal flip
              ctx.translate(canvas.width, 0);
              ctx.scale(-1, 1);
              break;
            case 3:
              // 180° rotate left
              ctx.translate(canvas.width, canvas.height);
              ctx.rotate(Math.PI);
              break;
            case 4:
              // vertical flip
              ctx.translate(0, canvas.height);
              ctx.scale(1, -1);
              break;
            case 5:
              // vertical flip + 90 rotate right
              ctx.rotate(0.5 * Math.PI);
              ctx.scale(1, -1);
              break;
            case 6:
              // 90° rotate right
              ctx.rotate(0.5 * Math.PI);
              ctx.translate(0, -canvas.width);
              break;
            case 7:
              // horizontal flip + 90 rotate right
              ctx.rotate(0.5 * Math.PI);
              ctx.translate(canvas.height, -canvas.width);
              ctx.scale(-1, 1);
              break;
            case 8:
              // 90° rotate left
              ctx.rotate(-0.5 * Math.PI);
              ctx.translate(-canvas.height, 0);
              break;
          }

          // This is a bugfix for iOS' scaling bug.
          drawImageIOSFix(ctx, img, resizeInfo.srcX != null ? resizeInfo.srcX : 0, resizeInfo.srcY != null ? resizeInfo.srcY : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, resizeInfo.trgX != null ? resizeInfo.trgX : 0, resizeInfo.trgY != null ? resizeInfo.trgY : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);

          var thumbnail = canvas.toDataURL("image/png");

          if (callback != null) {
            return callback(thumbnail, canvas);
          }
        });
      };

      if (callback != null) {
        img.onerror = callback;
      }

      return img.src = file.dataURL;
    }

    // Goes through the queue and processes files if there aren't too many already.

  }, {
    key: "processQueue",
    value: function processQueue() {
      var parallelUploads = this.options.parallelUploads;

      var processingLength = this.getUploadingFiles().length;
      var i = processingLength;

      // There are already at least as many files uploading than should be
      if (processingLength >= parallelUploads) {
        return;
      }

      var queuedFiles = this.getQueuedFiles();

      if (!(queuedFiles.length > 0)) {
        return;
      }

      if (this.options.uploadMultiple) {
        // The files should be uploaded in one request
        return this.processFiles(queuedFiles.slice(0, parallelUploads - processingLength));
      } else {
        while (i < parallelUploads) {
          if (!queuedFiles.length) {
            return;
          } // Nothing left to process
          this.processFile(queuedFiles.shift());
          i++;
        }
      }
    }

    // Wrapper for `processFiles`

  }, {
    key: "processFile",
    value: function processFile(file) {
      return this.processFiles([file]);
    }

    // Loads the file, then calls finishedLoading()

  }, {
    key: "processFiles",
    value: function processFiles(files) {
      for (var _iterator19 = files, _isArray19 = true, _i20 = 0, _iterator19 = _isArray19 ? _iterator19 : _iterator19[Symbol.iterator]();;) {
        var _ref18;

        if (_isArray19) {
          if (_i20 >= _iterator19.length) break;
          _ref18 = _iterator19[_i20++];
        } else {
          _i20 = _iterator19.next();
          if (_i20.done) break;
          _ref18 = _i20.value;
        }

        var file = _ref18;

        file.processing = true; // Backwards compatibility
        file.status = Dropzone.UPLOADING;

        this.emit("processing", file);
      }

      if (this.options.uploadMultiple) {
        this.emit("processingmultiple", files);
      }

      return this.uploadFiles(files);
    }
  }, {
    key: "_getFilesWithXhr",
    value: function _getFilesWithXhr(xhr) {
      var files = void 0;
      return files = this.files.filter(function (file) {
        return file.xhr === xhr;
      }).map(function (file) {
        return file;
      });
    }

    // Cancels the file upload and sets the status to CANCELED
    // **if** the file is actually being uploaded.
    // If it's still in the queue, the file is being removed from it and the status
    // set to CANCELED.

  }, {
    key: "cancelUpload",
    value: function cancelUpload(file) {
      if (file.status === Dropzone.UPLOADING) {
        var groupedFiles = this._getFilesWithXhr(file.xhr);
        for (var _iterator20 = groupedFiles, _isArray20 = true, _i21 = 0, _iterator20 = _isArray20 ? _iterator20 : _iterator20[Symbol.iterator]();;) {
          var _ref19;

          if (_isArray20) {
            if (_i21 >= _iterator20.length) break;
            _ref19 = _iterator20[_i21++];
          } else {
            _i21 = _iterator20.next();
            if (_i21.done) break;
            _ref19 = _i21.value;
          }

          var groupedFile = _ref19;

          groupedFile.status = Dropzone.CANCELED;
        }
        if (typeof file.xhr !== 'undefined') {
          file.xhr.abort();
        }
        for (var _iterator21 = groupedFiles, _isArray21 = true, _i22 = 0, _iterator21 = _isArray21 ? _iterator21 : _iterator21[Symbol.iterator]();;) {
          var _ref20;

          if (_isArray21) {
            if (_i22 >= _iterator21.length) break;
            _ref20 = _iterator21[_i22++];
          } else {
            _i22 = _iterator21.next();
            if (_i22.done) break;
            _ref20 = _i22.value;
          }

          var _groupedFile = _ref20;

          this.emit("canceled", _groupedFile);
        }
        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", groupedFiles);
        }
      } else if (file.status === Dropzone.ADDED || file.status === Dropzone.QUEUED) {
        file.status = Dropzone.CANCELED;
        this.emit("canceled", file);
        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", [file]);
        }
      }

      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    }
  }, {
    key: "resolveOption",
    value: function resolveOption(option) {
      if (typeof option === 'function') {
        for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }

        return option.apply(this, args);
      }
      return option;
    }
  }, {
    key: "uploadFile",
    value: function uploadFile(file) {
      return this.uploadFiles([file]);
    }
  }, {
    key: "uploadFiles",
    value: function uploadFiles(files) {
      var _this14 = this;

      this._transformFiles(files, function (transformedFiles) {
        if (files[0].upload.chunked) {
          // This file should be sent in chunks!

          // If the chunking option is set, we **know** that there can only be **one** file, since
          // uploadMultiple is not allowed with this option.
          var file = files[0];
          var transformedFile = transformedFiles[0];
          var startedChunkCount = 0;

          file.upload.chunks = [];

          var handleNextChunk = function handleNextChunk() {
            var chunkIndex = 0;

            // Find the next item in file.upload.chunks that is not defined yet.
            while (file.upload.chunks[chunkIndex] !== undefined) {
              chunkIndex++;
            }

            // This means, that all chunks have already been started.
            if (chunkIndex >= file.upload.totalChunkCount) return;

            startedChunkCount++;

            var start = chunkIndex * _this14.options.chunkSize;
            var end = Math.min(start + _this14.options.chunkSize, file.size);

            var dataBlock = {
              name: _this14._getParamName(0),
              data: transformedFile.webkitSlice ? transformedFile.webkitSlice(start, end) : transformedFile.slice(start, end),
              filename: file.upload.filename,
              chunkIndex: chunkIndex
            };

            file.upload.chunks[chunkIndex] = {
              file: file,
              index: chunkIndex,
              dataBlock: dataBlock, // In case we want to retry.
              status: Dropzone.UPLOADING,
              progress: 0,
              retries: 0 // The number of times this block has been retried.
            };

            _this14._uploadData(files, [dataBlock]);
          };

          file.upload.finishedChunkUpload = function (chunk) {
            var allFinished = true;
            chunk.status = Dropzone.SUCCESS;

            // Clear the data from the chunk
            chunk.dataBlock = null;
            // Leaving this reference to xhr intact here will cause memory leaks in some browsers
            chunk.xhr = null;

            for (var i = 0; i < file.upload.totalChunkCount; i++) {
              if (file.upload.chunks[i] === undefined) {
                return handleNextChunk();
              }
              if (file.upload.chunks[i].status !== Dropzone.SUCCESS) {
                allFinished = false;
              }
            }

            if (allFinished) {
              _this14.options.chunksUploaded(file, function () {
                _this14._finished(files, '', null);
              });
            }
          };

          if (_this14.options.parallelChunkUploads) {
            for (var i = 0; i < file.upload.totalChunkCount; i++) {
              handleNextChunk();
            }
          } else {
            handleNextChunk();
          }
        } else {
          var dataBlocks = [];
          for (var _i23 = 0; _i23 < files.length; _i23++) {
            dataBlocks[_i23] = {
              name: _this14._getParamName(_i23),
              data: transformedFiles[_i23],
              filename: files[_i23].upload.filename
            };
          }
          _this14._uploadData(files, dataBlocks);
        }
      });
    }

    /// Returns the right chunk for given file and xhr

  }, {
    key: "_getChunk",
    value: function _getChunk(file, xhr) {
      for (var i = 0; i < file.upload.totalChunkCount; i++) {
        if (file.upload.chunks[i] !== undefined && file.upload.chunks[i].xhr === xhr) {
          return file.upload.chunks[i];
        }
      }
    }

    // This function actually uploads the file(s) to the server.
    // If dataBlocks contains the actual data to upload (meaning, that this could either be transformed
    // files, or individual chunks for chunked upload).

  }, {
    key: "_uploadData",
    value: function _uploadData(files, dataBlocks) {
      var _this15 = this;

      var xhr = new XMLHttpRequest();

      // Put the xhr object in the file objects to be able to reference it later.
      for (var _iterator22 = files, _isArray22 = true, _i24 = 0, _iterator22 = _isArray22 ? _iterator22 : _iterator22[Symbol.iterator]();;) {
        var _ref21;

        if (_isArray22) {
          if (_i24 >= _iterator22.length) break;
          _ref21 = _iterator22[_i24++];
        } else {
          _i24 = _iterator22.next();
          if (_i24.done) break;
          _ref21 = _i24.value;
        }

        var file = _ref21;

        file.xhr = xhr;
      }
      if (files[0].upload.chunked) {
        // Put the xhr object in the right chunk object, so it can be associated later, and found with _getChunk
        files[0].upload.chunks[dataBlocks[0].chunkIndex].xhr = xhr;
      }

      var method = this.resolveOption(this.options.method, files);
      var url = this.resolveOption(this.options.url, files);
      xhr.open(method, url, true);

      // Setting the timeout after open because of IE11 issue: https://gitlab.com/meno/dropzone/issues/8
      xhr.timeout = this.resolveOption(this.options.timeout, files);

      // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179
      xhr.withCredentials = !!this.options.withCredentials;

      xhr.onload = function (e) {
        _this15._finishedUploading(files, xhr, e);
      };

      xhr.onerror = function () {
        _this15._handleUploadError(files, xhr);
      };

      // Some browsers do not have the .upload property
      var progressObj = xhr.upload != null ? xhr.upload : xhr;
      progressObj.onprogress = function (e) {
        return _this15._updateFilesUploadProgress(files, xhr, e);
      };

      var headers = {
        "Accept": "application/json",
        "Cache-Control": "no-cache",
        "X-Requested-With": "XMLHttpRequest"
      };

      if (this.options.headers) {
        Dropzone.extend(headers, this.options.headers);
      }

      for (var headerName in headers) {
        var headerValue = headers[headerName];
        if (headerValue) {
          xhr.setRequestHeader(headerName, headerValue);
        }
      }

      var formData = new FormData();

      // Adding all @options parameters
      if (this.options.params) {
        var additionalParams = this.options.params;
        if (typeof additionalParams === 'function') {
          additionalParams = additionalParams.call(this, files, xhr, files[0].upload.chunked ? this._getChunk(files[0], xhr) : null);
        }

        for (var key in additionalParams) {
          var value = additionalParams[key];
          formData.append(key, value);
        }
      }

      // Let the user add additional data if necessary
      for (var _iterator23 = files, _isArray23 = true, _i25 = 0, _iterator23 = _isArray23 ? _iterator23 : _iterator23[Symbol.iterator]();;) {
        var _ref22;

        if (_isArray23) {
          if (_i25 >= _iterator23.length) break;
          _ref22 = _iterator23[_i25++];
        } else {
          _i25 = _iterator23.next();
          if (_i25.done) break;
          _ref22 = _i25.value;
        }

        var _file = _ref22;

        this.emit("sending", _file, xhr, formData);
      }
      if (this.options.uploadMultiple) {
        this.emit("sendingmultiple", files, xhr, formData);
      }

      this._addFormElementData(formData);

      // Finally add the files
      // Has to be last because some servers (eg: S3) expect the file to be the last parameter
      for (var i = 0; i < dataBlocks.length; i++) {
        var dataBlock = dataBlocks[i];
        formData.append(dataBlock.name, dataBlock.data, dataBlock.filename);
      }

      this.submitRequest(xhr, formData, files);
    }

    // Transforms all files with this.options.transformFile and invokes done with the transformed files when done.

  }, {
    key: "_transformFiles",
    value: function _transformFiles(files, done) {
      var _this16 = this;

      var transformedFiles = [];
      // Clumsy way of handling asynchronous calls, until I get to add a proper Future library.
      var doneCounter = 0;

      var _loop = function _loop(i) {
        _this16.options.transformFile.call(_this16, files[i], function (transformedFile) {
          transformedFiles[i] = transformedFile;
          if (++doneCounter === files.length) {
            done(transformedFiles);
          }
        });
      };

      for (var i = 0; i < files.length; i++) {
        _loop(i);
      }
    }

    // Takes care of adding other input elements of the form to the AJAX request

  }, {
    key: "_addFormElementData",
    value: function _addFormElementData(formData) {
      // Take care of other input elements
      if (this.element.tagName === "FORM") {
        for (var _iterator24 = this.element.querySelectorAll("input, textarea, select, button"), _isArray24 = true, _i26 = 0, _iterator24 = _isArray24 ? _iterator24 : _iterator24[Symbol.iterator]();;) {
          var _ref23;

          if (_isArray24) {
            if (_i26 >= _iterator24.length) break;
            _ref23 = _iterator24[_i26++];
          } else {
            _i26 = _iterator24.next();
            if (_i26.done) break;
            _ref23 = _i26.value;
          }

          var input = _ref23;

          var inputName = input.getAttribute("name");
          var inputType = input.getAttribute("type");
          if (inputType) inputType = inputType.toLowerCase();

          // If the input doesn't have a name, we can't use it.
          if (typeof inputName === 'undefined' || inputName === null) continue;

          if (input.tagName === "SELECT" && input.hasAttribute("multiple")) {
            // Possibly multiple values
            for (var _iterator25 = input.options, _isArray25 = true, _i27 = 0, _iterator25 = _isArray25 ? _iterator25 : _iterator25[Symbol.iterator]();;) {
              var _ref24;

              if (_isArray25) {
                if (_i27 >= _iterator25.length) break;
                _ref24 = _iterator25[_i27++];
              } else {
                _i27 = _iterator25.next();
                if (_i27.done) break;
                _ref24 = _i27.value;
              }

              var option = _ref24;

              if (option.selected) {
                formData.append(inputName, option.value);
              }
            }
          } else if (!inputType || inputType !== "checkbox" && inputType !== "radio" || input.checked) {
            formData.append(inputName, input.value);
          }
        }
      }
    }

    // Invoked when there is new progress information about given files.
    // If e is not provided, it is assumed that the upload is finished.

  }, {
    key: "_updateFilesUploadProgress",
    value: function _updateFilesUploadProgress(files, xhr, e) {
      var progress = void 0;
      if (typeof e !== 'undefined') {
        progress = 100 * e.loaded / e.total;

        if (files[0].upload.chunked) {
          var file = files[0];
          // Since this is a chunked upload, we need to update the appropriate chunk progress.
          var chunk = this._getChunk(file, xhr);
          chunk.progress = progress;
          chunk.total = e.total;
          chunk.bytesSent = e.loaded;
          var fileProgress = 0,
              fileTotal = void 0,
              fileBytesSent = void 0;
          file.upload.progress = 0;
          file.upload.total = 0;
          file.upload.bytesSent = 0;
          for (var i = 0; i < file.upload.totalChunkCount; i++) {
            if (file.upload.chunks[i] !== undefined && file.upload.chunks[i].progress !== undefined) {
              file.upload.progress += file.upload.chunks[i].progress;
              file.upload.total += file.upload.chunks[i].total;
              file.upload.bytesSent += file.upload.chunks[i].bytesSent;
            }
          }
          file.upload.progress = file.upload.progress / file.upload.totalChunkCount;
        } else {
          for (var _iterator26 = files, _isArray26 = true, _i28 = 0, _iterator26 = _isArray26 ? _iterator26 : _iterator26[Symbol.iterator]();;) {
            var _ref25;

            if (_isArray26) {
              if (_i28 >= _iterator26.length) break;
              _ref25 = _iterator26[_i28++];
            } else {
              _i28 = _iterator26.next();
              if (_i28.done) break;
              _ref25 = _i28.value;
            }

            var _file2 = _ref25;

            _file2.upload.progress = progress;
            _file2.upload.total = e.total;
            _file2.upload.bytesSent = e.loaded;
          }
        }
        for (var _iterator27 = files, _isArray27 = true, _i29 = 0, _iterator27 = _isArray27 ? _iterator27 : _iterator27[Symbol.iterator]();;) {
          var _ref26;

          if (_isArray27) {
            if (_i29 >= _iterator27.length) break;
            _ref26 = _iterator27[_i29++];
          } else {
            _i29 = _iterator27.next();
            if (_i29.done) break;
            _ref26 = _i29.value;
          }

          var _file3 = _ref26;

          this.emit("uploadprogress", _file3, _file3.upload.progress, _file3.upload.bytesSent);
        }
      } else {
        // Called when the file finished uploading

        var allFilesFinished = true;

        progress = 100;

        for (var _iterator28 = files, _isArray28 = true, _i30 = 0, _iterator28 = _isArray28 ? _iterator28 : _iterator28[Symbol.iterator]();;) {
          var _ref27;

          if (_isArray28) {
            if (_i30 >= _iterator28.length) break;
            _ref27 = _iterator28[_i30++];
          } else {
            _i30 = _iterator28.next();
            if (_i30.done) break;
            _ref27 = _i30.value;
          }

          var _file4 = _ref27;

          if (_file4.upload.progress !== 100 || _file4.upload.bytesSent !== _file4.upload.total) {
            allFilesFinished = false;
          }
          _file4.upload.progress = progress;
          _file4.upload.bytesSent = _file4.upload.total;
        }

        // Nothing to do, all files already at 100%
        if (allFilesFinished) {
          return;
        }

        for (var _iterator29 = files, _isArray29 = true, _i31 = 0, _iterator29 = _isArray29 ? _iterator29 : _iterator29[Symbol.iterator]();;) {
          var _ref28;

          if (_isArray29) {
            if (_i31 >= _iterator29.length) break;
            _ref28 = _iterator29[_i31++];
          } else {
            _i31 = _iterator29.next();
            if (_i31.done) break;
            _ref28 = _i31.value;
          }

          var _file5 = _ref28;

          this.emit("uploadprogress", _file5, progress, _file5.upload.bytesSent);
        }
      }
    }
  }, {
    key: "_finishedUploading",
    value: function _finishedUploading(files, xhr, e) {
      var response = void 0;

      if (files[0].status === Dropzone.CANCELED) {
        return;
      }

      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.responseType !== 'arraybuffer' && xhr.responseType !== 'blob') {
        response = xhr.responseText;

        if (xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) {
          try {
            response = JSON.parse(response);
          } catch (error) {
            e = error;
            response = "Invalid JSON response from server.";
          }
        }
      }

      this._updateFilesUploadProgress(files);

      if (!(200 <= xhr.status && xhr.status < 300)) {
        this._handleUploadError(files, xhr, response);
      } else {
        if (files[0].upload.chunked) {
          files[0].upload.finishedChunkUpload(this._getChunk(files[0], xhr));
        } else {
          this._finished(files, response, e);
        }
      }
    }
  }, {
    key: "_handleUploadError",
    value: function _handleUploadError(files, xhr, response) {
      if (files[0].status === Dropzone.CANCELED) {
        return;
      }

      if (files[0].upload.chunked && this.options.retryChunks) {
        var chunk = this._getChunk(files[0], xhr);
        if (chunk.retries++ < this.options.retryChunksLimit) {
          this._uploadData(files, [chunk.dataBlock]);
          return;
        } else {
          console.warn('Retried this chunk too often. Giving up.');
        }
      }

      for (var _iterator30 = files, _isArray30 = true, _i32 = 0, _iterator30 = _isArray30 ? _iterator30 : _iterator30[Symbol.iterator]();;) {
        var _ref29;

        if (_isArray30) {
          if (_i32 >= _iterator30.length) break;
          _ref29 = _iterator30[_i32++];
        } else {
          _i32 = _iterator30.next();
          if (_i32.done) break;
          _ref29 = _i32.value;
        }

        var file = _ref29;

        this._errorProcessing(files, response || this.options.dictResponseError.replace("{{statusCode}}", xhr.status), xhr);
      }
    }
  }, {
    key: "submitRequest",
    value: function submitRequest(xhr, formData, files) {
      xhr.send(formData);
    }

    // Called internally when processing is finished.
    // Individual callbacks have to be called in the appropriate sections.

  }, {
    key: "_finished",
    value: function _finished(files, responseText, e) {
      for (var _iterator31 = files, _isArray31 = true, _i33 = 0, _iterator31 = _isArray31 ? _iterator31 : _iterator31[Symbol.iterator]();;) {
        var _ref30;

        if (_isArray31) {
          if (_i33 >= _iterator31.length) break;
          _ref30 = _iterator31[_i33++];
        } else {
          _i33 = _iterator31.next();
          if (_i33.done) break;
          _ref30 = _i33.value;
        }

        var file = _ref30;

        file.status = Dropzone.SUCCESS;
        this.emit("success", file, responseText, e);
        this.emit("complete", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("successmultiple", files, responseText, e);
        this.emit("completemultiple", files);
      }

      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    }

    // Called internally when processing is finished.
    // Individual callbacks have to be called in the appropriate sections.

  }, {
    key: "_errorProcessing",
    value: function _errorProcessing(files, message, xhr) {
      for (var _iterator32 = files, _isArray32 = true, _i34 = 0, _iterator32 = _isArray32 ? _iterator32 : _iterator32[Symbol.iterator]();;) {
        var _ref31;

        if (_isArray32) {
          if (_i34 >= _iterator32.length) break;
          _ref31 = _iterator32[_i34++];
        } else {
          _i34 = _iterator32.next();
          if (_i34.done) break;
          _ref31 = _i34.value;
        }

        var file = _ref31;

        file.status = Dropzone.ERROR;
        this.emit("error", file, message, xhr);
        this.emit("complete", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("errormultiple", files, message, xhr);
        this.emit("completemultiple", files);
      }

      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    }
  }], [{
    key: "uuidv4",
    value: function uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
      });
    }
  }]);

  return Dropzone;
}(Emitter);

Dropzone.initClass();

Dropzone.version = "5.5.0";

// This is a map of options for your different dropzones. Add configurations
// to this object for your different dropzone elemens.
//
// Example:
//
//     Dropzone.options.myDropzoneElementId = { maxFilesize: 1 };
//
// To disable autoDiscover for a specific element, you can set `false` as an option:
//
//     Dropzone.options.myDisabledElementId = false;
//
// And in html:
//
//     <form action="/upload" id="my-dropzone-element-id" class="dropzone"></form>
Dropzone.options = {};

// Returns the options for an element or undefined if none available.
Dropzone.optionsForElement = function (element) {
  // Get the `Dropzone.options.elementId` for this element if it exists
  if (element.getAttribute("id")) {
    return Dropzone.options[camelize(element.getAttribute("id"))];
  } else {
    return undefined;
  }
};

// Holds a list of all dropzone instances
Dropzone.instances = [];

// Returns the dropzone for given element if any
Dropzone.forElement = function (element) {
  if (typeof element === "string") {
    element = document.querySelector(element);
  }
  if ((element != null ? element.dropzone : undefined) == null) {
    throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");
  }
  return element.dropzone;
};

// Set to false if you don't want Dropzone to automatically find and attach to .dropzone elements.
Dropzone.autoDiscover = true;

// Looks for all .dropzone elements and creates a dropzone for them
Dropzone.discover = function () {
  var dropzones = void 0;
  if (document.querySelectorAll) {
    dropzones = document.querySelectorAll(".dropzone");
  } else {
    dropzones = [];
    // IE :(
    var checkElements = function checkElements(elements) {
      return function () {
        var result = [];
        for (var _iterator33 = elements, _isArray33 = true, _i35 = 0, _iterator33 = _isArray33 ? _iterator33 : _iterator33[Symbol.iterator]();;) {
          var _ref32;

          if (_isArray33) {
            if (_i35 >= _iterator33.length) break;
            _ref32 = _iterator33[_i35++];
          } else {
            _i35 = _iterator33.next();
            if (_i35.done) break;
            _ref32 = _i35.value;
          }

          var el = _ref32;

          if (/(^| )dropzone($| )/.test(el.className)) {
            result.push(dropzones.push(el));
          } else {
            result.push(undefined);
          }
        }
        return result;
      }();
    };
    checkElements(document.getElementsByTagName("div"));
    checkElements(document.getElementsByTagName("form"));
  }

  return function () {
    var result = [];
    for (var _iterator34 = dropzones, _isArray34 = true, _i36 = 0, _iterator34 = _isArray34 ? _iterator34 : _iterator34[Symbol.iterator]();;) {
      var _ref33;

      if (_isArray34) {
        if (_i36 >= _iterator34.length) break;
        _ref33 = _iterator34[_i36++];
      } else {
        _i36 = _iterator34.next();
        if (_i36.done) break;
        _ref33 = _i36.value;
      }

      var dropzone = _ref33;

      // Create a dropzone unless auto discover has been disabled for specific element
      if (Dropzone.optionsForElement(dropzone) !== false) {
        result.push(new Dropzone(dropzone));
      } else {
        result.push(undefined);
      }
    }
    return result;
  }();
};

// Since the whole Drag'n'Drop API is pretty new, some browsers implement it,
// but not correctly.
// So I created a blacklist of userAgents. Yes, yes. Browser sniffing, I know.
// But what to do when browsers *theoretically* support an API, but crash
// when using it.
//
// This is a list of regular expressions tested against navigator.userAgent
//
// ** It should only be used on browser that *do* support the API, but
// incorrectly **
//
Dropzone.blacklistedBrowsers = [
// The mac os and windows phone version of opera 12 seems to have a problem with the File drag'n'drop API.
/opera.*(Macintosh|Windows Phone).*version\/12/i];

// Checks if the browser is supported
Dropzone.isBrowserSupported = function () {
  var capableBrowser = true;

  if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData && document.querySelector) {
    if (!("classList" in document.createElement("a"))) {
      capableBrowser = false;
    } else {
      // The browser supports the API, but may be blacklisted.
      for (var _iterator35 = Dropzone.blacklistedBrowsers, _isArray35 = true, _i37 = 0, _iterator35 = _isArray35 ? _iterator35 : _iterator35[Symbol.iterator]();;) {
        var _ref34;

        if (_isArray35) {
          if (_i37 >= _iterator35.length) break;
          _ref34 = _iterator35[_i37++];
        } else {
          _i37 = _iterator35.next();
          if (_i37.done) break;
          _ref34 = _i37.value;
        }

        var regex = _ref34;

        if (regex.test(navigator.userAgent)) {
          capableBrowser = false;
          continue;
        }
      }
    }
  } else {
    capableBrowser = false;
  }

  return capableBrowser;
};

Dropzone.dataURItoBlob = function (dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0, end = byteString.length, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob
  return new Blob([ab], { type: mimeString });
};

// Returns an array without the rejected item
var without = function without(list, rejectedItem) {
  return list.filter(function (item) {
    return item !== rejectedItem;
  }).map(function (item) {
    return item;
  });
};

// abc-def_ghi -> abcDefGhi
var camelize = function camelize(str) {
  return str.replace(/[\-_](\w)/g, function (match) {
    return match.charAt(1).toUpperCase();
  });
};

// Creates an element from string
Dropzone.createElement = function (string) {
  var div = document.createElement("div");
  div.innerHTML = string;
  return div.childNodes[0];
};

// Tests if given element is inside (or simply is) the container
Dropzone.elementInside = function (element, container) {
  if (element === container) {
    return true;
  } // Coffeescript doesn't support do/while loops
  while (element = element.parentNode) {
    if (element === container) {
      return true;
    }
  }
  return false;
};

Dropzone.getElement = function (el, name) {
  var element = void 0;
  if (typeof el === "string") {
    element = document.querySelector(el);
  } else if (el.nodeType != null) {
    element = el;
  }
  if (element == null) {
    throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector or a plain HTML element.");
  }
  return element;
};

Dropzone.getElements = function (els, name) {
  var el = void 0,
      elements = void 0;
  if (els instanceof Array) {
    elements = [];
    try {
      for (var _iterator36 = els, _isArray36 = true, _i38 = 0, _iterator36 = _isArray36 ? _iterator36 : _iterator36[Symbol.iterator]();;) {
        if (_isArray36) {
          if (_i38 >= _iterator36.length) break;
          el = _iterator36[_i38++];
        } else {
          _i38 = _iterator36.next();
          if (_i38.done) break;
          el = _i38.value;
        }

        elements.push(this.getElement(el, name));
      }
    } catch (e) {
      elements = null;
    }
  } else if (typeof els === "string") {
    elements = [];
    for (var _iterator37 = document.querySelectorAll(els), _isArray37 = true, _i39 = 0, _iterator37 = _isArray37 ? _iterator37 : _iterator37[Symbol.iterator]();;) {
      if (_isArray37) {
        if (_i39 >= _iterator37.length) break;
        el = _iterator37[_i39++];
      } else {
        _i39 = _iterator37.next();
        if (_i39.done) break;
        el = _i39.value;
      }

      elements.push(el);
    }
  } else if (els.nodeType != null) {
    elements = [els];
  }

  if (elements == null || !elements.length) {
    throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector, a plain HTML element or a list of those.");
  }

  return elements;
};

// Asks the user the question and calls accepted or rejected accordingly
//
// The default implementation just uses `window.confirm` and then calls the
// appropriate callback.
Dropzone.confirm = function (question, accepted, rejected) {
  if (window.confirm(question)) {
    return accepted();
  } else if (rejected != null) {
    return rejected();
  }
};

// Validates the mime type like this:
//
// https://developer.mozilla.org/en-US/docs/HTML/Element/input#attr-accept
Dropzone.isValidFile = function (file, acceptedFiles) {
  if (!acceptedFiles) {
    return true;
  } // If there are no accepted mime types, it's OK
  acceptedFiles = acceptedFiles.split(",");

  var mimeType = file.type;
  var baseMimeType = mimeType.replace(/\/.*$/, "");

  for (var _iterator38 = acceptedFiles, _isArray38 = true, _i40 = 0, _iterator38 = _isArray38 ? _iterator38 : _iterator38[Symbol.iterator]();;) {
    var _ref35;

    if (_isArray38) {
      if (_i40 >= _iterator38.length) break;
      _ref35 = _iterator38[_i40++];
    } else {
      _i40 = _iterator38.next();
      if (_i40.done) break;
      _ref35 = _i40.value;
    }

    var validType = _ref35;

    validType = validType.trim();
    if (validType.charAt(0) === ".") {
      if (file.name.toLowerCase().indexOf(validType.toLowerCase(), file.name.length - validType.length) !== -1) {
        return true;
      }
    } else if (/\/\*$/.test(validType)) {
      // This is something like a image/* mime type
      if (baseMimeType === validType.replace(/\/.*$/, "")) {
        return true;
      }
    } else {
      if (mimeType === validType) {
        return true;
      }
    }
  }

  return false;
};

// Augment jQuery
if (typeof jQuery !== 'undefined' && jQuery !== null) {
  jQuery.fn.dropzone = function (options) {
    return this.each(function () {
      return new Dropzone(this, options);
    });
  };
}

if (typeof module !== 'undefined' && module !== null) {
  module.exports = Dropzone;
} else {
  window.Dropzone = Dropzone;
}

// Dropzone file status codes
Dropzone.ADDED = "added";

Dropzone.QUEUED = "queued";
// For backwards compatibility. Now, if a file is accepted, it's either queued
// or uploading.
Dropzone.ACCEPTED = Dropzone.QUEUED;

Dropzone.UPLOADING = "uploading";
Dropzone.PROCESSING = Dropzone.UPLOADING; // alias

Dropzone.CANCELED = "canceled";
Dropzone.ERROR = "error";
Dropzone.SUCCESS = "success";

/*

 Bugfix for iOS 6 and 7
 Source: http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
 based on the work of https://github.com/stomita/ios-imagefile-megapixel

 */

// Detecting vertical squash in loaded image.
// Fixes a bug which squash image vertically while drawing into canvas for some images.
// This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
var detectVerticalSquash = function detectVerticalSquash(img) {
  var iw = img.naturalWidth;
  var ih = img.naturalHeight;
  var canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = ih;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  var _ctx$getImageData = ctx.getImageData(1, 0, 1, ih),
      data = _ctx$getImageData.data;

  // search image edge pixel position in case it is squashed vertically.


  var sy = 0;
  var ey = ih;
  var py = ih;
  while (py > sy) {
    var alpha = data[(py - 1) * 4 + 3];

    if (alpha === 0) {
      ey = py;
    } else {
      sy = py;
    }

    py = ey + sy >> 1;
  }
  var ratio = py / ih;

  if (ratio === 0) {
    return 1;
  } else {
    return ratio;
  }
};

// A replacement for context.drawImage
// (args are for source and destination).
var drawImageIOSFix = function drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
  var vertSquashRatio = detectVerticalSquash(img);
  return ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
};

// Based on MinifyJpeg
// Source: http://www.perry.cz/files/ExifRestorer.js
// http://elicon.blog57.fc2.com/blog-entry-206.html

var ExifRestore = function () {
  function ExifRestore() {
    _classCallCheck(this, ExifRestore);
  }

  _createClass(ExifRestore, null, [{
    key: "initClass",
    value: function initClass() {
      this.KEY_STR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    }
  }, {
    key: "encode64",
    value: function encode64(input) {
      var output = '';
      var chr1 = undefined;
      var chr2 = undefined;
      var chr3 = '';
      var enc1 = undefined;
      var enc2 = undefined;
      var enc3 = undefined;
      var enc4 = '';
      var i = 0;
      while (true) {
        chr1 = input[i++];
        chr2 = input[i++];
        chr3 = input[i++];
        enc1 = chr1 >> 2;
        enc2 = (chr1 & 3) << 4 | chr2 >> 4;
        enc3 = (chr2 & 15) << 2 | chr3 >> 6;
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }
        output = output + this.KEY_STR.charAt(enc1) + this.KEY_STR.charAt(enc2) + this.KEY_STR.charAt(enc3) + this.KEY_STR.charAt(enc4);
        chr1 = chr2 = chr3 = '';
        enc1 = enc2 = enc3 = enc4 = '';
        if (!(i < input.length)) {
          break;
        }
      }
      return output;
    }
  }, {
    key: "restore",
    value: function restore(origFileBase64, resizedFileBase64) {
      if (!origFileBase64.match('data:image/jpeg;base64,')) {
        return resizedFileBase64;
      }
      var rawImage = this.decode64(origFileBase64.replace('data:image/jpeg;base64,', ''));
      var segments = this.slice2Segments(rawImage);
      var image = this.exifManipulation(resizedFileBase64, segments);
      return "data:image/jpeg;base64," + this.encode64(image);
    }
  }, {
    key: "exifManipulation",
    value: function exifManipulation(resizedFileBase64, segments) {
      var exifArray = this.getExifArray(segments);
      var newImageArray = this.insertExif(resizedFileBase64, exifArray);
      var aBuffer = new Uint8Array(newImageArray);
      return aBuffer;
    }
  }, {
    key: "getExifArray",
    value: function getExifArray(segments) {
      var seg = undefined;
      var x = 0;
      while (x < segments.length) {
        seg = segments[x];
        if (seg[0] === 255 & seg[1] === 225) {
          return seg;
        }
        x++;
      }
      return [];
    }
  }, {
    key: "insertExif",
    value: function insertExif(resizedFileBase64, exifArray) {
      var imageData = resizedFileBase64.replace('data:image/jpeg;base64,', '');
      var buf = this.decode64(imageData);
      var separatePoint = buf.indexOf(255, 3);
      var mae = buf.slice(0, separatePoint);
      var ato = buf.slice(separatePoint);
      var array = mae;
      array = array.concat(exifArray);
      array = array.concat(ato);
      return array;
    }
  }, {
    key: "slice2Segments",
    value: function slice2Segments(rawImageArray) {
      var head = 0;
      var segments = [];
      while (true) {
        var length;
        if (rawImageArray[head] === 255 & rawImageArray[head + 1] === 218) {
          break;
        }
        if (rawImageArray[head] === 255 & rawImageArray[head + 1] === 216) {
          head += 2;
        } else {
          length = rawImageArray[head + 2] * 256 + rawImageArray[head + 3];
          var endPoint = head + length + 2;
          var seg = rawImageArray.slice(head, endPoint);
          segments.push(seg);
          head = endPoint;
        }
        if (head > rawImageArray.length) {
          break;
        }
      }
      return segments;
    }
  }, {
    key: "decode64",
    value: function decode64(input) {
      var output = '';
      var chr1 = undefined;
      var chr2 = undefined;
      var chr3 = '';
      var enc1 = undefined;
      var enc2 = undefined;
      var enc3 = undefined;
      var enc4 = '';
      var i = 0;
      var buf = [];
      // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
      var base64test = /[^A-Za-z0-9\+\/\=]/g;
      if (base64test.exec(input)) {
        console.warn('There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, \'+\', \'/\',and \'=\'\nExpect errors in decoding.');
      }
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
      while (true) {
        enc1 = this.KEY_STR.indexOf(input.charAt(i++));
        enc2 = this.KEY_STR.indexOf(input.charAt(i++));
        enc3 = this.KEY_STR.indexOf(input.charAt(i++));
        enc4 = this.KEY_STR.indexOf(input.charAt(i++));
        chr1 = enc1 << 2 | enc2 >> 4;
        chr2 = (enc2 & 15) << 4 | enc3 >> 2;
        chr3 = (enc3 & 3) << 6 | enc4;
        buf.push(chr1);
        if (enc3 !== 64) {
          buf.push(chr2);
        }
        if (enc4 !== 64) {
          buf.push(chr3);
        }
        chr1 = chr2 = chr3 = '';
        enc1 = enc2 = enc3 = enc4 = '';
        if (!(i < input.length)) {
          break;
        }
      }
      return buf;
    }
  }]);

  return ExifRestore;
}();

ExifRestore.initClass();

/*
 * contentloaded.js
 *
 * Author: Diego Perini (diego.perini at gmail.com)
 * Summary: cross-browser wrapper for DOMContentLoaded
 * Updated: 20101020
 * License: MIT
 * Version: 1.2
 *
 * URL:
 * http://javascript.nwbox.com/ContentLoaded/
 * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
 */

// @win window reference
// @fn function reference
var contentLoaded = function contentLoaded(win, fn) {
  var done = false;
  var top = true;
  var doc = win.document;
  var root = doc.documentElement;
  var add = doc.addEventListener ? "addEventListener" : "attachEvent";
  var rem = doc.addEventListener ? "removeEventListener" : "detachEvent";
  var pre = doc.addEventListener ? "" : "on";
  var init = function init(e) {
    if (e.type === "readystatechange" && doc.readyState !== "complete") {
      return;
    }
    (e.type === "load" ? win : doc)[rem](pre + e.type, init, false);
    if (!done && (done = true)) {
      return fn.call(win, e.type || e);
    }
  };

  var poll = function poll() {
    try {
      root.doScroll("left");
    } catch (e) {
      setTimeout(poll, 50);
      return;
    }
    return init("poll");
  };

  if (doc.readyState !== "complete") {
    if (doc.createEventObject && root.doScroll) {
      try {
        top = !win.frameElement;
      } catch (error) {}
      if (top) {
        poll();
      }
    }
    doc[add](pre + "DOMContentLoaded", init, false);
    doc[add](pre + "readystatechange", init, false);
    return win[add](pre + "load", init, false);
  }
};

// As a single function to be able to write tests.
Dropzone._autoDiscoverFunction = function () {
  if (Dropzone.autoDiscover) {
    return Dropzone.discover();
  }
};
contentLoaded(window, Dropzone._autoDiscoverFunction);

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}
function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkcm9wem9uZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoIXNlbGYpIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG4vKlxuICpcbiAqIE1vcmUgaW5mbyBhdCBbd3d3LmRyb3B6b25lanMuY29tXShodHRwOi8vd3d3LmRyb3B6b25lanMuY29tKVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMiwgTWF0aWFzIE1lbm9cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICpcbiAqL1xuXG4vLyBUaGUgRW1pdHRlciBjbGFzcyBwcm92aWRlcyB0aGUgYWJpbGl0eSB0byBjYWxsIGAub24oKWAgb24gRHJvcHpvbmUgdG8gbGlzdGVuXG4vLyB0byBldmVudHMuXG4vLyBJdCBpcyBzdHJvbmdseSBiYXNlZCBvbiBjb21wb25lbnQncyBlbWl0dGVyIGNsYXNzLCBhbmQgSSByZW1vdmVkIHRoZVxuLy8gZnVuY3Rpb25hbGl0eSBiZWNhdXNlIG9mIHRoZSBkZXBlbmRlbmN5IGhlbGwgd2l0aCBkaWZmZXJlbnQgZnJhbWV3b3Jrcy5cbnZhciBFbWl0dGVyID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBFbWl0dGVyKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBFbWl0dGVyKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhFbWl0dGVyLCBbe1xuICAgIGtleTogXCJvblwiLFxuXG4gICAgLy8gQWRkIGFuIGV2ZW50IGxpc3RlbmVyIGZvciBnaXZlbiBldmVudFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvbihldmVudCwgZm4pIHtcbiAgICAgIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgICAgIC8vIENyZWF0ZSBuYW1lc3BhY2UgZm9yIHRoaXMgZXZlbnRcbiAgICAgIGlmICghdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSkge1xuICAgICAgICB0aGlzLl9jYWxsYmFja3NbZXZlbnRdID0gW107XG4gICAgICB9XG4gICAgICB0aGlzLl9jYWxsYmFja3NbZXZlbnRdLnB1c2goZm4pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImVtaXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZW1pdChldmVudCkge1xuICAgICAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAgICAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG5cbiAgICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICAgICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IgPSBjYWxsYmFja3MsIF9pc0FycmF5ID0gdHJ1ZSwgX2kgPSAwLCBfaXRlcmF0b3IgPSBfaXNBcnJheSA/IF9pdGVyYXRvciA6IF9pdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgIHZhciBfcmVmO1xuXG4gICAgICAgICAgaWYgKF9pc0FycmF5KSB7XG4gICAgICAgICAgICBpZiAoX2kgPj0gX2l0ZXJhdG9yLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmID0gX2l0ZXJhdG9yW19pKytdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfaSA9IF9pdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgICBpZiAoX2kuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmID0gX2kudmFsdWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGNhbGxiYWNrID0gX3JlZjtcblxuICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSBldmVudCBsaXN0ZW5lciBmb3IgZ2l2ZW4gZXZlbnQuIElmIGZuIGlzIG5vdCBwcm92aWRlZCwgYWxsIGV2ZW50XG4gICAgLy8gbGlzdGVuZXJzIGZvciB0aGF0IGV2ZW50IHdpbGwgYmUgcmVtb3ZlZC4gSWYgbmVpdGhlciBpcyBwcm92aWRlZCwgYWxsXG4gICAgLy8gZXZlbnQgbGlzdGVuZXJzIHdpbGwgYmUgcmVtb3ZlZC5cblxuICB9LCB7XG4gICAga2V5OiBcIm9mZlwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvZmYoZXZlbnQsIGZuKSB7XG4gICAgICBpZiAoIXRoaXMuX2NhbGxiYWNrcyB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrcyA9IHt9O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgLy8gc3BlY2lmaWMgZXZlbnRcbiAgICAgIHZhciBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICAgICAgaWYgKCFjYWxsYmFja3MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGNhbGxiYWNrc1tpXTtcbiAgICAgICAgaWYgKGNhbGxiYWNrID09PSBmbikge1xuICAgICAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEVtaXR0ZXI7XG59KCk7XG5cbnZhciBEcm9wem9uZSA9IGZ1bmN0aW9uIChfRW1pdHRlcikge1xuICBfaW5oZXJpdHMoRHJvcHpvbmUsIF9FbWl0dGVyKTtcblxuICBfY3JlYXRlQ2xhc3MoRHJvcHpvbmUsIG51bGwsIFt7XG4gICAga2V5OiBcImluaXRDbGFzc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbml0Q2xhc3MoKSB7XG5cbiAgICAgIC8vIEV4cG9zaW5nIHRoZSBlbWl0dGVyIGNsYXNzLCBtYWlubHkgZm9yIHRlc3RzXG4gICAgICB0aGlzLnByb3RvdHlwZS5FbWl0dGVyID0gRW1pdHRlcjtcblxuICAgICAgLypcbiAgICAgICBUaGlzIGlzIGEgbGlzdCBvZiBhbGwgYXZhaWxhYmxlIGV2ZW50cyB5b3UgY2FuIHJlZ2lzdGVyIG9uIGEgZHJvcHpvbmUgb2JqZWN0LlxuICAgICAgICBZb3UgY2FuIHJlZ2lzdGVyIGFuIGV2ZW50IGhhbmRsZXIgbGlrZSB0aGlzOlxuICAgICAgICBkcm9wem9uZS5vbihcImRyYWdFbnRlclwiLCBmdW5jdGlvbigpIHsgfSk7XG4gICAgICAgICovXG4gICAgICB0aGlzLnByb3RvdHlwZS5ldmVudHMgPSBbXCJkcm9wXCIsIFwiZHJhZ3N0YXJ0XCIsIFwiZHJhZ2VuZFwiLCBcImRyYWdlbnRlclwiLCBcImRyYWdvdmVyXCIsIFwiZHJhZ2xlYXZlXCIsIFwiYWRkZWRmaWxlXCIsIFwiYWRkZWRmaWxlc1wiLCBcInJlbW92ZWRmaWxlXCIsIFwidGh1bWJuYWlsXCIsIFwiZXJyb3JcIiwgXCJlcnJvcm11bHRpcGxlXCIsIFwicHJvY2Vzc2luZ1wiLCBcInByb2Nlc3NpbmdtdWx0aXBsZVwiLCBcInVwbG9hZHByb2dyZXNzXCIsIFwidG90YWx1cGxvYWRwcm9ncmVzc1wiLCBcInNlbmRpbmdcIiwgXCJzZW5kaW5nbXVsdGlwbGVcIiwgXCJzdWNjZXNzXCIsIFwic3VjY2Vzc211bHRpcGxlXCIsIFwiY2FuY2VsZWRcIiwgXCJjYW5jZWxlZG11bHRpcGxlXCIsIFwiY29tcGxldGVcIiwgXCJjb21wbGV0ZW11bHRpcGxlXCIsIFwicmVzZXRcIiwgXCJtYXhmaWxlc2V4Y2VlZGVkXCIsIFwibWF4ZmlsZXNyZWFjaGVkXCIsIFwicXVldWVjb21wbGV0ZVwiXTtcblxuICAgICAgdGhpcy5wcm90b3R5cGUuZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYXMgdG8gYmUgc3BlY2lmaWVkIG9uIGVsZW1lbnRzIG90aGVyIHRoYW4gZm9ybSAob3Igd2hlbiB0aGUgZm9ybVxuICAgICAgICAgKiBkb2Vzbid0IGhhdmUgYW4gYGFjdGlvbmAgYXR0cmlidXRlKS4gWW91IGNhbiBhbHNvXG4gICAgICAgICAqIHByb3ZpZGUgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHdpdGggYGZpbGVzYCBhbmRcbiAgICAgICAgICogbXVzdCByZXR1cm4gdGhlIHVybCAoc2luY2UgYHYzLjEyLjBgKVxuICAgICAgICAgKi9cbiAgICAgICAgdXJsOiBudWxsLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYW4gYmUgY2hhbmdlZCB0byBgXCJwdXRcImAgaWYgbmVjZXNzYXJ5LiBZb3UgY2FuIGFsc28gcHJvdmlkZSBhIGZ1bmN0aW9uXG4gICAgICAgICAqIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2l0aCBgZmlsZXNgIGFuZCBtdXN0IHJldHVybiB0aGUgbWV0aG9kIChzaW5jZSBgdjMuMTIuMGApLlxuICAgICAgICAgKi9cbiAgICAgICAgbWV0aG9kOiBcInBvc3RcIixcblxuICAgICAgICAvKipcbiAgICAgICAgICogV2lsbCBiZSBzZXQgb24gdGhlIFhIUmVxdWVzdC5cbiAgICAgICAgICovXG4gICAgICAgIHdpdGhDcmVkZW50aWFsczogZmFsc2UsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0aW1lb3V0IGZvciB0aGUgWEhSIHJlcXVlc3RzIGluIG1pbGxpc2Vjb25kcyAoc2luY2UgYHY0LjQuMGApLlxuICAgICAgICAgKi9cbiAgICAgICAgdGltZW91dDogMzAwMDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhvdyBtYW55IGZpbGUgdXBsb2FkcyB0byBwcm9jZXNzIGluIHBhcmFsbGVsIChTZWUgdGhlXG4gICAgICAgICAqIEVucXVldWluZyBmaWxlIHVwbG9hZHMqIGRvY3VtZW50YXRpb24gc2VjdGlvbiBmb3IgbW9yZSBpbmZvKVxuICAgICAgICAgKi9cbiAgICAgICAgcGFyYWxsZWxVcGxvYWRzOiAyLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaGV0aGVyIHRvIHNlbmQgbXVsdGlwbGUgZmlsZXMgaW4gb25lIHJlcXVlc3QuIElmXG4gICAgICAgICAqIHRoaXMgaXQgc2V0IHRvIHRydWUsIHRoZW4gdGhlIGZhbGxiYWNrIGZpbGUgaW5wdXQgZWxlbWVudCB3aWxsXG4gICAgICAgICAqIGhhdmUgdGhlIGBtdWx0aXBsZWAgYXR0cmlidXRlIGFzIHdlbGwuIFRoaXMgb3B0aW9uIHdpbGxcbiAgICAgICAgICogYWxzbyB0cmlnZ2VyIGFkZGl0aW9uYWwgZXZlbnRzIChsaWtlIGBwcm9jZXNzaW5nbXVsdGlwbGVgKS4gU2VlIHRoZSBldmVudHNcbiAgICAgICAgICogZG9jdW1lbnRhdGlvbiBzZWN0aW9uIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgdXBsb2FkTXVsdGlwbGU6IGZhbHNlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaGV0aGVyIHlvdSB3YW50IGZpbGVzIHRvIGJlIHVwbG9hZGVkIGluIGNodW5rcyB0byB5b3VyIHNlcnZlci4gVGhpcyBjYW4ndCBiZVxuICAgICAgICAgKiB1c2VkIGluIGNvbWJpbmF0aW9uIHdpdGggYHVwbG9hZE11bHRpcGxlYC5cbiAgICAgICAgICpcbiAgICAgICAgICogU2VlIFtjaHVua3NVcGxvYWRlZF0oI2NvbmZpZy1jaHVua3NVcGxvYWRlZCkgZm9yIHRoZSBjYWxsYmFjayB0byBmaW5hbGlzZSBhbiB1cGxvYWQuXG4gICAgICAgICAqL1xuICAgICAgICBjaHVua2luZzogZmFsc2UsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGBjaHVua2luZ2AgaXMgZW5hYmxlZCwgdGhpcyBkZWZpbmVzIHdoZXRoZXIgKipldmVyeSoqIGZpbGUgc2hvdWxkIGJlIGNodW5rZWQsXG4gICAgICAgICAqIGV2ZW4gaWYgdGhlIGZpbGUgc2l6ZSBpcyBiZWxvdyBjaHVua1NpemUuIFRoaXMgbWVhbnMsIHRoYXQgdGhlIGFkZGl0aW9uYWwgY2h1bmtcbiAgICAgICAgICogZm9ybSBkYXRhIHdpbGwgYmUgc3VibWl0dGVkIGFuZCB0aGUgYGNodW5rc1VwbG9hZGVkYCBjYWxsYmFjayB3aWxsIGJlIGludm9rZWQuXG4gICAgICAgICAqL1xuICAgICAgICBmb3JjZUNodW5raW5nOiBmYWxzZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgYGNodW5raW5nYCBpcyBgdHJ1ZWAsIHRoZW4gdGhpcyBkZWZpbmVzIHRoZSBjaHVuayBzaXplIGluIGJ5dGVzLlxuICAgICAgICAgKi9cbiAgICAgICAgY2h1bmtTaXplOiAyMDAwMDAwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBgdHJ1ZWAsIHRoZSBpbmRpdmlkdWFsIGNodW5rcyBvZiBhIGZpbGUgYXJlIGJlaW5nIHVwbG9hZGVkIHNpbXVsdGFuZW91c2x5LlxuICAgICAgICAgKi9cbiAgICAgICAgcGFyYWxsZWxDaHVua1VwbG9hZHM6IGZhbHNlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaGV0aGVyIGEgY2h1bmsgc2hvdWxkIGJlIHJldHJpZWQgaWYgaXQgZmFpbHMuXG4gICAgICAgICAqL1xuICAgICAgICByZXRyeUNodW5rczogZmFsc2UsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGByZXRyeUNodW5rc2AgaXMgdHJ1ZSwgaG93IG1hbnkgdGltZXMgc2hvdWxkIGl0IGJlIHJldHJpZWQuXG4gICAgICAgICAqL1xuICAgICAgICByZXRyeUNodW5rc0xpbWl0OiAzLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBub3QgYG51bGxgIGRlZmluZXMgaG93IG1hbnkgZmlsZXMgdGhpcyBEcm9wem9uZSBoYW5kbGVzLiBJZiBpdCBleGNlZWRzLFxuICAgICAgICAgKiB0aGUgZXZlbnQgYG1heGZpbGVzZXhjZWVkZWRgIHdpbGwgYmUgY2FsbGVkLiBUaGUgZHJvcHpvbmUgZWxlbWVudCBnZXRzIHRoZVxuICAgICAgICAgKiBjbGFzcyBgZHotbWF4LWZpbGVzLXJlYWNoZWRgIGFjY29yZGluZ2x5IHNvIHlvdSBjYW4gcHJvdmlkZSB2aXN1YWwgZmVlZGJhY2suXG4gICAgICAgICAqL1xuICAgICAgICBtYXhGaWxlc2l6ZTogMjU2LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbmFtZSBvZiB0aGUgZmlsZSBwYXJhbSB0aGF0IGdldHMgdHJhbnNmZXJyZWQuXG4gICAgICAgICAqICoqTk9URSoqOiBJZiB5b3UgaGF2ZSB0aGUgb3B0aW9uICBgdXBsb2FkTXVsdGlwbGVgIHNldCB0byBgdHJ1ZWAsIHRoZW5cbiAgICAgICAgICogRHJvcHpvbmUgd2lsbCBhcHBlbmQgYFtdYCB0byB0aGUgbmFtZS5cbiAgICAgICAgICovXG4gICAgICAgIHBhcmFtTmFtZTogXCJmaWxlXCIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdoZXRoZXIgdGh1bWJuYWlscyBmb3IgaW1hZ2VzIHNob3VsZCBiZSBnZW5lcmF0ZWRcbiAgICAgICAgICovXG4gICAgICAgIGNyZWF0ZUltYWdlVGh1bWJuYWlsczogdHJ1ZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW4gTUIuIFdoZW4gdGhlIGZpbGVuYW1lIGV4Y2VlZHMgdGhpcyBsaW1pdCwgdGhlIHRodW1ibmFpbCB3aWxsIG5vdCBiZSBnZW5lcmF0ZWQuXG4gICAgICAgICAqL1xuICAgICAgICBtYXhUaHVtYm5haWxGaWxlc2l6ZTogMTAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGBudWxsYCwgdGhlIHJhdGlvIG9mIHRoZSBpbWFnZSB3aWxsIGJlIHVzZWQgdG8gY2FsY3VsYXRlIGl0LlxuICAgICAgICAgKi9cbiAgICAgICAgdGh1bWJuYWlsV2lkdGg6IDEyMCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHNhbWUgYXMgYHRodW1ibmFpbFdpZHRoYC4gSWYgYm90aCBhcmUgbnVsbCwgaW1hZ2VzIHdpbGwgbm90IGJlIHJlc2l6ZWQuXG4gICAgICAgICAqL1xuICAgICAgICB0aHVtYm5haWxIZWlnaHQ6IDEyMCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSG93IHRoZSBpbWFnZXMgc2hvdWxkIGJlIHNjYWxlZCBkb3duIGluIGNhc2UgYm90aCwgYHRodW1ibmFpbFdpZHRoYCBhbmQgYHRodW1ibmFpbEhlaWdodGAgYXJlIHByb3ZpZGVkLlxuICAgICAgICAgKiBDYW4gYmUgZWl0aGVyIGBjb250YWluYCBvciBgY3JvcGAuXG4gICAgICAgICAqL1xuICAgICAgICB0aHVtYm5haWxNZXRob2Q6ICdjcm9wJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgc2V0LCBpbWFnZXMgd2lsbCBiZSByZXNpemVkIHRvIHRoZXNlIGRpbWVuc2lvbnMgYmVmb3JlIGJlaW5nICoqdXBsb2FkZWQqKi5cbiAgICAgICAgICogSWYgb25seSBvbmUsIGByZXNpemVXaWR0aGAgKipvcioqIGByZXNpemVIZWlnaHRgIGlzIHByb3ZpZGVkLCB0aGUgb3JpZ2luYWwgYXNwZWN0XG4gICAgICAgICAqIHJhdGlvIG9mIHRoZSBmaWxlIHdpbGwgYmUgcHJlc2VydmVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGUgYG9wdGlvbnMudHJhbnNmb3JtRmlsZWAgZnVuY3Rpb24gdXNlcyB0aGVzZSBvcHRpb25zLCBzbyBpZiB0aGUgYHRyYW5zZm9ybUZpbGVgIGZ1bmN0aW9uXG4gICAgICAgICAqIGlzIG92ZXJyaWRkZW4sIHRoZXNlIG9wdGlvbnMgZG9uJ3QgZG8gYW55dGhpbmcuXG4gICAgICAgICAqL1xuICAgICAgICByZXNpemVXaWR0aDogbnVsbCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2VlIGByZXNpemVXaWR0aGAuXG4gICAgICAgICAqL1xuICAgICAgICByZXNpemVIZWlnaHQ6IG51bGwsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBtaW1lIHR5cGUgb2YgdGhlIHJlc2l6ZWQgaW1hZ2UgKGJlZm9yZSBpdCBnZXRzIHVwbG9hZGVkIHRvIHRoZSBzZXJ2ZXIpLlxuICAgICAgICAgKiBJZiBgbnVsbGAgdGhlIG9yaWdpbmFsIG1pbWUgdHlwZSB3aWxsIGJlIHVzZWQuIFRvIGZvcmNlIGpwZWcsIGZvciBleGFtcGxlLCB1c2UgYGltYWdlL2pwZWdgLlxuICAgICAgICAgKiBTZWUgYHJlc2l6ZVdpZHRoYCBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIHJlc2l6ZU1pbWVUeXBlOiBudWxsLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgcXVhbGl0eSBvZiB0aGUgcmVzaXplZCBpbWFnZXMuIFNlZSBgcmVzaXplV2lkdGhgLlxuICAgICAgICAgKi9cbiAgICAgICAgcmVzaXplUXVhbGl0eTogMC44LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIb3cgdGhlIGltYWdlcyBzaG91bGQgYmUgc2NhbGVkIGRvd24gaW4gY2FzZSBib3RoLCBgcmVzaXplV2lkdGhgIGFuZCBgcmVzaXplSGVpZ2h0YCBhcmUgcHJvdmlkZWQuXG4gICAgICAgICAqIENhbiBiZSBlaXRoZXIgYGNvbnRhaW5gIG9yIGBjcm9wYC5cbiAgICAgICAgICovXG4gICAgICAgIHJlc2l6ZU1ldGhvZDogJ2NvbnRhaW4nLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgYmFzZSB0aGF0IGlzIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSBmaWxlc2l6ZS4gWW91IGNhbiBjaGFuZ2UgdGhpcyB0b1xuICAgICAgICAgKiAxMDI0IGlmIHlvdSB3b3VsZCByYXRoZXIgZGlzcGxheSBraWJpYnl0ZXMsIG1lYmlieXRlcywgZXRjLi4uXG4gICAgICAgICAqIDEwMjQgaXMgdGVjaG5pY2FsbHkgaW5jb3JyZWN0LCBiZWNhdXNlIGAxMDI0IGJ5dGVzYCBhcmUgYDEga2liaWJ5dGVgIG5vdCBgMSBraWxvYnl0ZWAuXG4gICAgICAgICAqIFlvdSBjYW4gY2hhbmdlIHRoaXMgdG8gYDEwMjRgIGlmIHlvdSBkb24ndCBjYXJlIGFib3V0IHZhbGlkaXR5LlxuICAgICAgICAgKi9cbiAgICAgICAgZmlsZXNpemVCYXNlOiAxMDAwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYW4gYmUgdXNlZCB0byBsaW1pdCB0aGUgbWF4aW11bSBudW1iZXIgb2YgZmlsZXMgdGhhdCB3aWxsIGJlIGhhbmRsZWQgYnkgdGhpcyBEcm9wem9uZVxuICAgICAgICAgKi9cbiAgICAgICAgbWF4RmlsZXM6IG51bGwsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFuIG9wdGlvbmFsIG9iamVjdCB0byBzZW5kIGFkZGl0aW9uYWwgaGVhZGVycyB0byB0aGUgc2VydmVyLiBFZzpcbiAgICAgICAgICogYHsgXCJNeS1Bd2Vzb21lLUhlYWRlclwiOiBcImhlYWRlciB2YWx1ZVwiIH1gXG4gICAgICAgICAqL1xuICAgICAgICBoZWFkZXJzOiBudWxsLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBgdHJ1ZWAsIHRoZSBkcm9wem9uZSBlbGVtZW50IGl0c2VsZiB3aWxsIGJlIGNsaWNrYWJsZSwgaWYgYGZhbHNlYFxuICAgICAgICAgKiBub3RoaW5nIHdpbGwgYmUgY2xpY2thYmxlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBhbiBIVE1MIGVsZW1lbnQsIGEgQ1NTIHNlbGVjdG9yIChmb3IgbXVsdGlwbGUgZWxlbWVudHMpXG4gICAgICAgICAqIG9yIGFuIGFycmF5IG9mIHRob3NlLiBJbiB0aGF0IGNhc2UsIGFsbCBvZiB0aG9zZSBlbGVtZW50cyB3aWxsIHRyaWdnZXIgYW5cbiAgICAgICAgICogdXBsb2FkIHdoZW4gY2xpY2tlZC5cbiAgICAgICAgICovXG4gICAgICAgIGNsaWNrYWJsZTogdHJ1ZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogV2hldGhlciBoaWRkZW4gZmlsZXMgaW4gZGlyZWN0b3JpZXMgc2hvdWxkIGJlIGlnbm9yZWQuXG4gICAgICAgICAqL1xuICAgICAgICBpZ25vcmVIaWRkZW5GaWxlczogdHJ1ZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gb2YgYGFjY2VwdGAgY2hlY2tzIHRoZSBmaWxlJ3MgbWltZSB0eXBlIG9yXG4gICAgICAgICAqIGV4dGVuc2lvbiBhZ2FpbnN0IHRoaXMgbGlzdC4gVGhpcyBpcyBhIGNvbW1hIHNlcGFyYXRlZCBsaXN0IG9mIG1pbWVcbiAgICAgICAgICogdHlwZXMgb3IgZmlsZSBleHRlbnNpb25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBFZy46IGBpbWFnZS8qLGFwcGxpY2F0aW9uL3BkZiwucHNkYFxuICAgICAgICAgKlxuICAgICAgICAgKiBJZiB0aGUgRHJvcHpvbmUgaXMgYGNsaWNrYWJsZWAgdGhpcyBvcHRpb24gd2lsbCBhbHNvIGJlIHVzZWQgYXNcbiAgICAgICAgICogW2BhY2NlcHRgXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL0hUTUwvRWxlbWVudC9pbnB1dCNhdHRyLWFjY2VwdClcbiAgICAgICAgICogcGFyYW1ldGVyIG9uIHRoZSBoaWRkZW4gZmlsZSBpbnB1dCBhcyB3ZWxsLlxuICAgICAgICAgKi9cbiAgICAgICAgYWNjZXB0ZWRGaWxlczogbnVsbCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogKipEZXByZWNhdGVkISoqXG4gICAgICAgICAqIFVzZSBhY2NlcHRlZEZpbGVzIGluc3RlYWQuXG4gICAgICAgICAqL1xuICAgICAgICBhY2NlcHRlZE1pbWVUeXBlczogbnVsbCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgZmFsc2UsIGZpbGVzIHdpbGwgYmUgYWRkZWQgdG8gdGhlIHF1ZXVlIGJ1dCB0aGUgcXVldWUgd2lsbCBub3QgYmVcbiAgICAgICAgICogcHJvY2Vzc2VkIGF1dG9tYXRpY2FsbHkuXG4gICAgICAgICAqIFRoaXMgY2FuIGJlIHVzZWZ1bCBpZiB5b3UgbmVlZCBzb21lIGFkZGl0aW9uYWwgdXNlciBpbnB1dCBiZWZvcmUgc2VuZGluZ1xuICAgICAgICAgKiBmaWxlcyAob3IgaWYgeW91IHdhbnQgd2FudCBhbGwgZmlsZXMgc2VudCBhdCBvbmNlKS5cbiAgICAgICAgICogSWYgeW91J3JlIHJlYWR5IHRvIHNlbmQgdGhlIGZpbGUgc2ltcGx5IGNhbGwgYG15RHJvcHpvbmUucHJvY2Vzc1F1ZXVlKClgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBTZWUgdGhlIFtlbnF1ZXVpbmcgZmlsZSB1cGxvYWRzXSgjZW5xdWV1aW5nLWZpbGUtdXBsb2FkcykgZG9jdW1lbnRhdGlvblxuICAgICAgICAgKiBzZWN0aW9uIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgYXV0b1Byb2Nlc3NRdWV1ZTogdHJ1ZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgZmFsc2UsIGZpbGVzIGFkZGVkIHRvIHRoZSBkcm9wem9uZSB3aWxsIG5vdCBiZSBxdWV1ZWQgYnkgZGVmYXVsdC5cbiAgICAgICAgICogWW91J2xsIGhhdmUgdG8gY2FsbCBgZW5xdWV1ZUZpbGUoZmlsZSlgIG1hbnVhbGx5LlxuICAgICAgICAgKi9cbiAgICAgICAgYXV0b1F1ZXVlOiB0cnVlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBgdHJ1ZWAsIHRoaXMgd2lsbCBhZGQgYSBsaW5rIHRvIGV2ZXJ5IGZpbGUgcHJldmlldyB0byByZW1vdmUgb3IgY2FuY2VsIChpZlxuICAgICAgICAgKiBhbHJlYWR5IHVwbG9hZGluZykgdGhlIGZpbGUuIFRoZSBgZGljdENhbmNlbFVwbG9hZGAsIGBkaWN0Q2FuY2VsVXBsb2FkQ29uZmlybWF0aW9uYFxuICAgICAgICAgKiBhbmQgYGRpY3RSZW1vdmVGaWxlYCBvcHRpb25zIGFyZSB1c2VkIGZvciB0aGUgd29yZGluZy5cbiAgICAgICAgICovXG4gICAgICAgIGFkZFJlbW92ZUxpbmtzOiBmYWxzZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVmaW5lcyB3aGVyZSB0byBkaXNwbGF5IHRoZSBmaWxlIHByZXZpZXdzIOKAkyBpZiBgbnVsbGAgdGhlXG4gICAgICAgICAqIERyb3B6b25lIGVsZW1lbnQgaXRzZWxmIGlzIHVzZWQuIENhbiBiZSBhIHBsYWluIGBIVE1MRWxlbWVudGAgb3IgYSBDU1NcbiAgICAgICAgICogc2VsZWN0b3IuIFRoZSBlbGVtZW50IHNob3VsZCBoYXZlIHRoZSBgZHJvcHpvbmUtcHJldmlld3NgIGNsYXNzIHNvXG4gICAgICAgICAqIHRoZSBwcmV2aWV3cyBhcmUgZGlzcGxheWVkIHByb3Blcmx5LlxuICAgICAgICAgKi9cbiAgICAgICAgcHJldmlld3NDb250YWluZXI6IG51bGwsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoaXMgaXMgdGhlIGVsZW1lbnQgdGhlIGhpZGRlbiBpbnB1dCBmaWVsZCAod2hpY2ggaXMgdXNlZCB3aGVuIGNsaWNraW5nIG9uIHRoZVxuICAgICAgICAgKiBkcm9wem9uZSB0byB0cmlnZ2VyIGZpbGUgc2VsZWN0aW9uKSB3aWxsIGJlIGFwcGVuZGVkIHRvLiBUaGlzIG1pZ2h0XG4gICAgICAgICAqIGJlIGltcG9ydGFudCBpbiBjYXNlIHlvdSB1c2UgZnJhbWV3b3JrcyB0byBzd2l0Y2ggdGhlIGNvbnRlbnQgb2YgeW91ciBwYWdlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBDYW4gYmUgYSBzZWxlY3RvciBzdHJpbmcsIG9yIGFuIGVsZW1lbnQgZGlyZWN0bHkuXG4gICAgICAgICAqL1xuICAgICAgICBoaWRkZW5JbnB1dENvbnRhaW5lcjogXCJib2R5XCIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIG51bGwsIG5vIGNhcHR1cmUgdHlwZSB3aWxsIGJlIHNwZWNpZmllZFxuICAgICAgICAgKiBJZiBjYW1lcmEsIG1vYmlsZSBkZXZpY2VzIHdpbGwgc2tpcCB0aGUgZmlsZSBzZWxlY3Rpb24gYW5kIGNob29zZSBjYW1lcmFcbiAgICAgICAgICogSWYgbWljcm9waG9uZSwgbW9iaWxlIGRldmljZXMgd2lsbCBza2lwIHRoZSBmaWxlIHNlbGVjdGlvbiBhbmQgY2hvb3NlIHRoZSBtaWNyb3Bob25lXG4gICAgICAgICAqIElmIGNhbWNvcmRlciwgbW9iaWxlIGRldmljZXMgd2lsbCBza2lwIHRoZSBmaWxlIHNlbGVjdGlvbiBhbmQgY2hvb3NlIHRoZSBjYW1lcmEgaW4gdmlkZW8gbW9kZVxuICAgICAgICAgKiBPbiBhcHBsZSBkZXZpY2VzIG11bHRpcGxlIG11c3QgYmUgc2V0IHRvIGZhbHNlLiAgQWNjZXB0ZWRGaWxlcyBtYXkgbmVlZCB0b1xuICAgICAgICAgKiBiZSBzZXQgdG8gYW4gYXBwcm9wcmlhdGUgbWltZSB0eXBlIChlLmcuIFwiaW1hZ2UvKlwiLCBcImF1ZGlvLypcIiwgb3IgXCJ2aWRlby8qXCIpLlxuICAgICAgICAgKi9cbiAgICAgICAgY2FwdHVyZTogbnVsbCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogKipEZXByZWNhdGVkKiouIFVzZSBgcmVuYW1lRmlsZWAgaW5zdGVhZC5cbiAgICAgICAgICovXG4gICAgICAgIHJlbmFtZUZpbGVuYW1lOiBudWxsLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGZ1bmN0aW9uIHRoYXQgaXMgaW52b2tlZCBiZWZvcmUgdGhlIGZpbGUgaXMgdXBsb2FkZWQgdG8gdGhlIHNlcnZlciBhbmQgcmVuYW1lcyB0aGUgZmlsZS5cbiAgICAgICAgICogVGhpcyBmdW5jdGlvbiBnZXRzIHRoZSBgRmlsZWAgYXMgYXJndW1lbnQgYW5kIGNhbiB1c2UgdGhlIGBmaWxlLm5hbWVgLiBUaGUgYWN0dWFsIG5hbWUgb2YgdGhlXG4gICAgICAgICAqIGZpbGUgdGhhdCBnZXRzIHVzZWQgZHVyaW5nIHRoZSB1cGxvYWQgY2FuIGJlIGFjY2Vzc2VkIHRocm91Z2ggYGZpbGUudXBsb2FkLmZpbGVuYW1lYC5cbiAgICAgICAgICovXG4gICAgICAgIHJlbmFtZUZpbGU6IG51bGwsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGB0cnVlYCB0aGUgZmFsbGJhY2sgd2lsbCBiZSBmb3JjZWQuIFRoaXMgaXMgdmVyeSB1c2VmdWwgdG8gdGVzdCB5b3VyIHNlcnZlclxuICAgICAgICAgKiBpbXBsZW1lbnRhdGlvbnMgZmlyc3QgYW5kIG1ha2Ugc3VyZSB0aGF0IGV2ZXJ5dGhpbmcgd29ya3MgYXNcbiAgICAgICAgICogZXhwZWN0ZWQgd2l0aG91dCBkcm9wem9uZSBpZiB5b3UgZXhwZXJpZW5jZSBwcm9ibGVtcywgYW5kIHRvIHRlc3RcbiAgICAgICAgICogaG93IHlvdXIgZmFsbGJhY2tzIHdpbGwgbG9vay5cbiAgICAgICAgICovXG4gICAgICAgIGZvcmNlRmFsbGJhY2s6IGZhbHNlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgdGV4dCB1c2VkIGJlZm9yZSBhbnkgZmlsZXMgYXJlIGRyb3BwZWQuXG4gICAgICAgICAqL1xuICAgICAgICBkaWN0RGVmYXVsdE1lc3NhZ2U6IFwiRHJvcCBmaWxlcyBoZXJlIHRvIHVwbG9hZFwiLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgdGV4dCB0aGF0IHJlcGxhY2VzIHRoZSBkZWZhdWx0IG1lc3NhZ2UgdGV4dCBpdCB0aGUgYnJvd3NlciBpcyBub3Qgc3VwcG9ydGVkLlxuICAgICAgICAgKi9cbiAgICAgICAgZGljdEZhbGxiYWNrTWVzc2FnZTogXCJZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBkcmFnJ24nZHJvcCBmaWxlIHVwbG9hZHMuXCIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0ZXh0IHRoYXQgd2lsbCBiZSBhZGRlZCBiZWZvcmUgdGhlIGZhbGxiYWNrIGZvcm0uXG4gICAgICAgICAqIElmIHlvdSBwcm92aWRlIGEgIGZhbGxiYWNrIGVsZW1lbnQgeW91cnNlbGYsIG9yIGlmIHRoaXMgb3B0aW9uIGlzIGBudWxsYCB0aGlzIHdpbGxcbiAgICAgICAgICogYmUgaWdub3JlZC5cbiAgICAgICAgICovXG4gICAgICAgIGRpY3RGYWxsYmFja1RleHQ6IFwiUGxlYXNlIHVzZSB0aGUgZmFsbGJhY2sgZm9ybSBiZWxvdyB0byB1cGxvYWQgeW91ciBmaWxlcyBsaWtlIGluIHRoZSBvbGRlbiBkYXlzLlwiLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiB0aGUgZmlsZXNpemUgaXMgdG9vIGJpZy5cbiAgICAgICAgICogYHt7ZmlsZXNpemV9fWAgYW5kIGB7e21heEZpbGVzaXplfX1gIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgcmVzcGVjdGl2ZSBjb25maWd1cmF0aW9uIHZhbHVlcy5cbiAgICAgICAgICovXG4gICAgICAgIGRpY3RGaWxlVG9vQmlnOiBcIkZpbGUgaXMgdG9vIGJpZyAoe3tmaWxlc2l6ZX19TWlCKS4gTWF4IGZpbGVzaXplOiB7e21heEZpbGVzaXplfX1NaUIuXCIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIHRoZSBmaWxlIGRvZXNuJ3QgbWF0Y2ggdGhlIGZpbGUgdHlwZS5cbiAgICAgICAgICovXG4gICAgICAgIGRpY3RJbnZhbGlkRmlsZVR5cGU6IFwiWW91IGNhbid0IHVwbG9hZCBmaWxlcyBvZiB0aGlzIHR5cGUuXCIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIHRoZSBzZXJ2ZXIgcmVzcG9uc2Ugd2FzIGludmFsaWQuXG4gICAgICAgICAqIGB7e3N0YXR1c0NvZGV9fWAgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSBzZXJ2ZXJzIHN0YXR1cyBjb2RlLlxuICAgICAgICAgKi9cbiAgICAgICAgZGljdFJlc3BvbnNlRXJyb3I6IFwiU2VydmVyIHJlc3BvbmRlZCB3aXRoIHt7c3RhdHVzQ29kZX19IGNvZGUuXCIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGBhZGRSZW1vdmVMaW5rc2AgaXMgdHJ1ZSwgdGhlIHRleHQgdG8gYmUgdXNlZCBmb3IgdGhlIGNhbmNlbCB1cGxvYWQgbGluay5cbiAgICAgICAgICovXG4gICAgICAgIGRpY3RDYW5jZWxVcGxvYWQ6IFwiQ2FuY2VsIHVwbG9hZFwiLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgdGV4dCB0aGF0IGlzIGRpc3BsYXllZCBpZiBhbiB1cGxvYWQgd2FzIG1hbnVhbGx5IGNhbmNlbGVkXG4gICAgICAgICAqL1xuICAgICAgICBkaWN0VXBsb2FkQ2FuY2VsZWQ6IFwiVXBsb2FkIGNhbmNlbGVkLlwiLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBgYWRkUmVtb3ZlTGlua3NgIGlzIHRydWUsIHRoZSB0ZXh0IHRvIGJlIHVzZWQgZm9yIGNvbmZpcm1hdGlvbiB3aGVuIGNhbmNlbGxpbmcgdXBsb2FkLlxuICAgICAgICAgKi9cbiAgICAgICAgZGljdENhbmNlbFVwbG9hZENvbmZpcm1hdGlvbjogXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gY2FuY2VsIHRoaXMgdXBsb2FkP1wiLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBgYWRkUmVtb3ZlTGlua3NgIGlzIHRydWUsIHRoZSB0ZXh0IHRvIGJlIHVzZWQgdG8gcmVtb3ZlIGEgZmlsZS5cbiAgICAgICAgICovXG4gICAgICAgIGRpY3RSZW1vdmVGaWxlOiBcIlJlbW92ZSBmaWxlXCIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIHRoaXMgaXMgbm90IG51bGwsIHRoZW4gdGhlIHVzZXIgd2lsbCBiZSBwcm9tcHRlZCBiZWZvcmUgcmVtb3ZpbmcgYSBmaWxlLlxuICAgICAgICAgKi9cbiAgICAgICAgZGljdFJlbW92ZUZpbGVDb25maXJtYXRpb246IG51bGwsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc3BsYXllZCBpZiBgbWF4RmlsZXNgIGlzIHN0IGFuZCBleGNlZWRlZC5cbiAgICAgICAgICogVGhlIHN0cmluZyBge3ttYXhGaWxlc319YCB3aWxsIGJlIHJlcGxhY2VkIGJ5IHRoZSBjb25maWd1cmF0aW9uIHZhbHVlLlxuICAgICAgICAgKi9cbiAgICAgICAgZGljdE1heEZpbGVzRXhjZWVkZWQ6IFwiWW91IGNhbiBub3QgdXBsb2FkIGFueSBtb3JlIGZpbGVzLlwiLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbGxvd3MgeW91IHRvIHRyYW5zbGF0ZSB0aGUgZGlmZmVyZW50IHVuaXRzLiBTdGFydGluZyB3aXRoIGB0YmAgZm9yIHRlcmFieXRlcyBhbmQgZ29pbmcgZG93biB0b1xuICAgICAgICAgKiBgYmAgZm9yIGJ5dGVzLlxuICAgICAgICAgKi9cbiAgICAgICAgZGljdEZpbGVTaXplVW5pdHM6IHsgdGI6IFwiVEJcIiwgZ2I6IFwiR0JcIiwgbWI6IFwiTUJcIiwga2I6IFwiS0JcIiwgYjogXCJiXCIgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhbGxlZCB3aGVuIGRyb3B6b25lIGluaXRpYWxpemVkXG4gICAgICAgICAqIFlvdSBjYW4gYWRkIGV2ZW50IGxpc3RlbmVycyBoZXJlXG4gICAgICAgICAqL1xuICAgICAgICBpbml0OiBmdW5jdGlvbiBpbml0KCkge30sXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FuIGJlIGFuICoqb2JqZWN0Kiogb2YgYWRkaXRpb25hbCBwYXJhbWV0ZXJzIHRvIHRyYW5zZmVyIHRvIHRoZSBzZXJ2ZXIsICoqb3IqKiBhIGBGdW5jdGlvbmBcbiAgICAgICAgICogdGhhdCBnZXRzIGludm9rZWQgd2l0aCB0aGUgYGZpbGVzYCwgYHhocmAgYW5kLCBpZiBpdCdzIGEgY2h1bmtlZCB1cGxvYWQsIGBjaHVua2AgYXJndW1lbnRzLiBJbiBjYXNlXG4gICAgICAgICAqIG9mIGEgZnVuY3Rpb24sIHRoaXMgbmVlZHMgdG8gcmV0dXJuIGEgbWFwLlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBkb2VzIG5vdGhpbmcgZm9yIG5vcm1hbCB1cGxvYWRzLCBidXQgYWRkcyByZWxldmFudCBpbmZvcm1hdGlvbiBmb3JcbiAgICAgICAgICogY2h1bmtlZCB1cGxvYWRzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIGlzIHRoZSBzYW1lIGFzIGFkZGluZyBoaWRkZW4gaW5wdXQgZmllbGRzIGluIHRoZSBmb3JtIGVsZW1lbnQuXG4gICAgICAgICAqL1xuICAgICAgICBwYXJhbXM6IGZ1bmN0aW9uIHBhcmFtcyhmaWxlcywgeGhyLCBjaHVuaykge1xuICAgICAgICAgIGlmIChjaHVuaykge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgZHp1dWlkOiBjaHVuay5maWxlLnVwbG9hZC51dWlkLFxuICAgICAgICAgICAgICBkemNodW5raW5kZXg6IGNodW5rLmluZGV4LFxuICAgICAgICAgICAgICBkenRvdGFsZmlsZXNpemU6IGNodW5rLmZpbGUuc2l6ZSxcbiAgICAgICAgICAgICAgZHpjaHVua3NpemU6IHRoaXMub3B0aW9ucy5jaHVua1NpemUsXG4gICAgICAgICAgICAgIGR6dG90YWxjaHVua2NvdW50OiBjaHVuay5maWxlLnVwbG9hZC50b3RhbENodW5rQ291bnQsXG4gICAgICAgICAgICAgIGR6Y2h1bmtieXRlb2Zmc2V0OiBjaHVuay5pbmRleCAqIHRoaXMub3B0aW9ucy5jaHVua1NpemVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgZnVuY3Rpb24gdGhhdCBnZXRzIGEgW2ZpbGVdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvRE9NL0ZpbGUpXG4gICAgICAgICAqIGFuZCBhIGBkb25lYCBmdW5jdGlvbiBhcyBwYXJhbWV0ZXJzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJZiB0aGUgZG9uZSBmdW5jdGlvbiBpcyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCB0aGUgZmlsZSBpcyBcImFjY2VwdGVkXCIgYW5kIHdpbGxcbiAgICAgICAgICogYmUgcHJvY2Vzc2VkLiBJZiB5b3UgcGFzcyBhbiBlcnJvciBtZXNzYWdlLCB0aGUgZmlsZSBpcyByZWplY3RlZCwgYW5kIHRoZSBlcnJvclxuICAgICAgICAgKiBtZXNzYWdlIHdpbGwgYmUgZGlzcGxheWVkLlxuICAgICAgICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgbm90IGJlIGNhbGxlZCBpZiB0aGUgZmlsZSBpcyB0b28gYmlnIG9yIGRvZXNuJ3QgbWF0Y2ggdGhlIG1pbWUgdHlwZXMuXG4gICAgICAgICAqL1xuICAgICAgICBhY2NlcHQ6IGZ1bmN0aW9uIGFjY2VwdChmaWxlLCBkb25lKSB7XG4gICAgICAgICAgcmV0dXJuIGRvbmUoKTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGludm9rZWQgd2hlbiBhbGwgY2h1bmtzIGhhdmUgYmVlbiB1cGxvYWRlZCBmb3IgYSBmaWxlLlxuICAgICAgICAgKiBJdCBnZXRzIHRoZSBmaWxlIGZvciB3aGljaCB0aGUgY2h1bmtzIGhhdmUgYmVlbiB1cGxvYWRlZCBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyLFxuICAgICAgICAgKiBhbmQgdGhlIGBkb25lYCBmdW5jdGlvbiBhcyBzZWNvbmQuIGBkb25lKClgIG5lZWRzIHRvIGJlIGludm9rZWQgd2hlbiBldmVyeXRoaW5nXG4gICAgICAgICAqIG5lZWRlZCB0byBmaW5pc2ggdGhlIHVwbG9hZCBwcm9jZXNzIGlzIGRvbmUuXG4gICAgICAgICAqL1xuICAgICAgICBjaHVua3NVcGxvYWRlZDogZnVuY3Rpb24gY2h1bmtzVXBsb2FkZWQoZmlsZSwgZG9uZSkge1xuICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0cyBjYWxsZWQgd2hlbiB0aGUgYnJvd3NlciBpcyBub3Qgc3VwcG9ydGVkLlxuICAgICAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBzaG93cyB0aGUgZmFsbGJhY2sgaW5wdXQgZmllbGQgYW5kIGFkZHNcbiAgICAgICAgICogYSB0ZXh0LlxuICAgICAgICAgKi9cbiAgICAgICAgZmFsbGJhY2s6IGZ1bmN0aW9uIGZhbGxiYWNrKCkge1xuICAgICAgICAgIC8vIFRoaXMgY29kZSBzaG91bGQgcGFzcyBpbiBJRTcuLi4gOihcbiAgICAgICAgICB2YXIgbWVzc2FnZUVsZW1lbnQgPSB2b2lkIDA7XG4gICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTmFtZSA9IHRoaXMuZWxlbWVudC5jbGFzc05hbWUgKyBcIiBkei1icm93c2VyLW5vdC1zdXBwb3J0ZWRcIjtcblxuICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjIgPSB0aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJkaXZcIiksIF9pc0FycmF5MiA9IHRydWUsIF9pMiA9IDAsIF9pdGVyYXRvcjIgPSBfaXNBcnJheTIgPyBfaXRlcmF0b3IyIDogX2l0ZXJhdG9yMltTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgICAgdmFyIF9yZWYyO1xuXG4gICAgICAgICAgICBpZiAoX2lzQXJyYXkyKSB7XG4gICAgICAgICAgICAgIGlmIChfaTIgPj0gX2l0ZXJhdG9yMi5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgICBfcmVmMiA9IF9pdGVyYXRvcjJbX2kyKytdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX2kyID0gX2l0ZXJhdG9yMi5uZXh0KCk7XG4gICAgICAgICAgICAgIGlmIChfaTIuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICAgIF9yZWYyID0gX2kyLnZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBfcmVmMjtcblxuICAgICAgICAgICAgaWYgKC8oXnwgKWR6LW1lc3NhZ2UoJHwgKS8udGVzdChjaGlsZC5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICAgIG1lc3NhZ2VFbGVtZW50ID0gY2hpbGQ7XG4gICAgICAgICAgICAgIGNoaWxkLmNsYXNzTmFtZSA9IFwiZHotbWVzc2FnZVwiOyAvLyBSZW1vdmVzIHRoZSAnZHotZGVmYXVsdCcgY2xhc3NcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghbWVzc2FnZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VFbGVtZW50ID0gRHJvcHpvbmUuY3JlYXRlRWxlbWVudChcIjxkaXYgY2xhc3M9XFxcImR6LW1lc3NhZ2VcXFwiPjxzcGFuPjwvc3Bhbj48L2Rpdj5cIik7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQobWVzc2FnZUVsZW1lbnQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBzcGFuID0gbWVzc2FnZUVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzcGFuXCIpWzBdO1xuICAgICAgICAgIGlmIChzcGFuKSB7XG4gICAgICAgICAgICBpZiAoc3Bhbi50ZXh0Q29udGVudCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHNwYW4udGV4dENvbnRlbnQgPSB0aGlzLm9wdGlvbnMuZGljdEZhbGxiYWNrTWVzc2FnZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3Bhbi5pbm5lclRleHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICBzcGFuLmlubmVyVGV4dCA9IHRoaXMub3B0aW9ucy5kaWN0RmFsbGJhY2tNZXNzYWdlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5nZXRGYWxsYmFja0Zvcm0oKSk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0cyBjYWxsZWQgdG8gY2FsY3VsYXRlIHRoZSB0aHVtYm5haWwgZGltZW5zaW9ucy5cbiAgICAgICAgICpcbiAgICAgICAgICogSXQgZ2V0cyBgZmlsZWAsIGB3aWR0aGAgYW5kIGBoZWlnaHRgIChib3RoIG1heSBiZSBgbnVsbGApIGFzIHBhcmFtZXRlcnMgYW5kIG11c3QgcmV0dXJuIGFuIG9iamVjdCBjb250YWluaW5nOlxuICAgICAgICAgKlxuICAgICAgICAgKiAgLSBgc3JjV2lkdGhgICYgYHNyY0hlaWdodGAgKHJlcXVpcmVkKVxuICAgICAgICAgKiAgLSBgdHJnV2lkdGhgICYgYHRyZ0hlaWdodGAgKHJlcXVpcmVkKVxuICAgICAgICAgKiAgLSBgc3JjWGAgJiBgc3JjWWAgKG9wdGlvbmFsLCBkZWZhdWx0IGAwYClcbiAgICAgICAgICogIC0gYHRyZ1hgICYgYHRyZ1lgIChvcHRpb25hbCwgZGVmYXVsdCBgMGApXG4gICAgICAgICAqXG4gICAgICAgICAqIFRob3NlIHZhbHVlcyBhcmUgZ29pbmcgdG8gYmUgdXNlZCBieSBgY3R4LmRyYXdJbWFnZSgpYC5cbiAgICAgICAgICovXG4gICAgICAgIHJlc2l6ZTogZnVuY3Rpb24gcmVzaXplKGZpbGUsIHdpZHRoLCBoZWlnaHQsIHJlc2l6ZU1ldGhvZCkge1xuICAgICAgICAgIHZhciBpbmZvID0ge1xuICAgICAgICAgICAgc3JjWDogMCxcbiAgICAgICAgICAgIHNyY1k6IDAsXG4gICAgICAgICAgICBzcmNXaWR0aDogZmlsZS53aWR0aCxcbiAgICAgICAgICAgIHNyY0hlaWdodDogZmlsZS5oZWlnaHRcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdmFyIHNyY1JhdGlvID0gZmlsZS53aWR0aCAvIGZpbGUuaGVpZ2h0O1xuXG4gICAgICAgICAgLy8gQXV0b21hdGljYWxseSBjYWxjdWxhdGUgZGltZW5zaW9ucyBpZiBub3Qgc3BlY2lmaWVkXG4gICAgICAgICAgaWYgKHdpZHRoID09IG51bGwgJiYgaGVpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgIHdpZHRoID0gaW5mby5zcmNXaWR0aDtcbiAgICAgICAgICAgIGhlaWdodCA9IGluZm8uc3JjSGVpZ2h0O1xuICAgICAgICAgIH0gZWxzZSBpZiAod2lkdGggPT0gbnVsbCkge1xuICAgICAgICAgICAgd2lkdGggPSBoZWlnaHQgKiBzcmNSYXRpbztcbiAgICAgICAgICB9IGVsc2UgaWYgKGhlaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICBoZWlnaHQgPSB3aWR0aCAvIHNyY1JhdGlvO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIE1ha2Ugc3VyZSBpbWFnZXMgYXJlbid0IHVwc2NhbGVkXG4gICAgICAgICAgd2lkdGggPSBNYXRoLm1pbih3aWR0aCwgaW5mby5zcmNXaWR0aCk7XG4gICAgICAgICAgaGVpZ2h0ID0gTWF0aC5taW4oaGVpZ2h0LCBpbmZvLnNyY0hlaWdodCk7XG5cbiAgICAgICAgICB2YXIgdHJnUmF0aW8gPSB3aWR0aCAvIGhlaWdodDtcblxuICAgICAgICAgIGlmIChpbmZvLnNyY1dpZHRoID4gd2lkdGggfHwgaW5mby5zcmNIZWlnaHQgPiBoZWlnaHQpIHtcbiAgICAgICAgICAgIC8vIEltYWdlIGlzIGJpZ2dlciBhbmQgbmVlZHMgcmVzY2FsaW5nXG4gICAgICAgICAgICBpZiAocmVzaXplTWV0aG9kID09PSAnY3JvcCcpIHtcbiAgICAgICAgICAgICAgaWYgKHNyY1JhdGlvID4gdHJnUmF0aW8pIHtcbiAgICAgICAgICAgICAgICBpbmZvLnNyY0hlaWdodCA9IGZpbGUuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIGluZm8uc3JjV2lkdGggPSBpbmZvLnNyY0hlaWdodCAqIHRyZ1JhdGlvO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGluZm8uc3JjV2lkdGggPSBmaWxlLndpZHRoO1xuICAgICAgICAgICAgICAgIGluZm8uc3JjSGVpZ2h0ID0gaW5mby5zcmNXaWR0aCAvIHRyZ1JhdGlvO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlc2l6ZU1ldGhvZCA9PT0gJ2NvbnRhaW4nKSB7XG4gICAgICAgICAgICAgIC8vIE1ldGhvZCAnY29udGFpbidcbiAgICAgICAgICAgICAgaWYgKHNyY1JhdGlvID4gdHJnUmF0aW8pIHtcbiAgICAgICAgICAgICAgICBoZWlnaHQgPSB3aWR0aCAvIHNyY1JhdGlvO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHdpZHRoID0gaGVpZ2h0ICogc3JjUmF0aW87XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gcmVzaXplTWV0aG9kICdcIiArIHJlc2l6ZU1ldGhvZCArIFwiJ1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpbmZvLnNyY1ggPSAoZmlsZS53aWR0aCAtIGluZm8uc3JjV2lkdGgpIC8gMjtcbiAgICAgICAgICBpbmZvLnNyY1kgPSAoZmlsZS5oZWlnaHQgLSBpbmZvLnNyY0hlaWdodCkgLyAyO1xuXG4gICAgICAgICAgaW5mby50cmdXaWR0aCA9IHdpZHRoO1xuICAgICAgICAgIGluZm8udHJnSGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgICAgICAgcmV0dXJuIGluZm87XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FuIGJlIHVzZWQgdG8gdHJhbnNmb3JtIHRoZSBmaWxlIChmb3IgZXhhbXBsZSwgcmVzaXplIGFuIGltYWdlIGlmIG5lY2Vzc2FyeSkuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIHVzZXMgYHJlc2l6ZVdpZHRoYCBhbmQgYHJlc2l6ZUhlaWdodGAgKGlmIHByb3ZpZGVkKSBhbmQgcmVzaXplc1xuICAgICAgICAgKiBpbWFnZXMgYWNjb3JkaW5nIHRvIHRob3NlIGRpbWVuc2lvbnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEdldHMgdGhlIGBmaWxlYCBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyLCBhbmQgYSBgZG9uZSgpYCBmdW5jdGlvbiBhcyB0aGUgc2Vjb25kLCB0aGF0IG5lZWRzXG4gICAgICAgICAqIHRvIGJlIGludm9rZWQgd2l0aCB0aGUgZmlsZSB3aGVuIHRoZSB0cmFuc2Zvcm1hdGlvbiBpcyBkb25lLlxuICAgICAgICAgKi9cbiAgICAgICAgdHJhbnNmb3JtRmlsZTogZnVuY3Rpb24gdHJhbnNmb3JtRmlsZShmaWxlLCBkb25lKSB7XG4gICAgICAgICAgaWYgKCh0aGlzLm9wdGlvbnMucmVzaXplV2lkdGggfHwgdGhpcy5vcHRpb25zLnJlc2l6ZUhlaWdodCkgJiYgZmlsZS50eXBlLm1hdGNoKC9pbWFnZS4qLykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc2l6ZUltYWdlKGZpbGUsIHRoaXMub3B0aW9ucy5yZXNpemVXaWR0aCwgdGhpcy5vcHRpb25zLnJlc2l6ZUhlaWdodCwgdGhpcy5vcHRpb25zLnJlc2l6ZU1ldGhvZCwgZG9uZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBkb25lKGZpbGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIHN0cmluZyB0aGF0IGNvbnRhaW5zIHRoZSB0ZW1wbGF0ZSB1c2VkIGZvciBlYWNoIGRyb3BwZWRcbiAgICAgICAgICogZmlsZS4gQ2hhbmdlIGl0IHRvIGZ1bGZpbGwgeW91ciBuZWVkcyBidXQgbWFrZSBzdXJlIHRvIHByb3Blcmx5XG4gICAgICAgICAqIHByb3ZpZGUgYWxsIGVsZW1lbnRzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJZiB5b3Ugd2FudCB0byB1c2UgYW4gYWN0dWFsIEhUTUwgZWxlbWVudCBpbnN0ZWFkIG9mIHByb3ZpZGluZyBhIFN0cmluZ1xuICAgICAgICAgKiBhcyBhIGNvbmZpZyBvcHRpb24sIHlvdSBjb3VsZCBjcmVhdGUgYSBkaXYgd2l0aCB0aGUgaWQgYHRwbGAsXG4gICAgICAgICAqIHB1dCB0aGUgdGVtcGxhdGUgaW5zaWRlIGl0IGFuZCBwcm92aWRlIHRoZSBlbGVtZW50IGxpa2UgdGhpczpcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIGRvY3VtZW50XG4gICAgICAgICAqICAgICAgIC5xdWVyeVNlbGVjdG9yKCcjdHBsJylcbiAgICAgICAgICogICAgICAgLmlubmVySFRNTFxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgcHJldmlld1RlbXBsYXRlOiBcIjxkaXYgY2xhc3M9XFxcImR6LXByZXZpZXcgZHotZmlsZS1wcmV2aWV3XFxcIj5cXG4gIDxkaXYgY2xhc3M9XFxcImR6LWltYWdlXFxcIj48aW1nIGRhdGEtZHotdGh1bWJuYWlsIC8+PC9kaXY+XFxuICA8ZGl2IGNsYXNzPVxcXCJkei1kZXRhaWxzXFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwiZHotc2l6ZVxcXCI+PHNwYW4gZGF0YS1kei1zaXplPjwvc3Bhbj48L2Rpdj5cXG4gICAgPGRpdiBjbGFzcz1cXFwiZHotZmlsZW5hbWVcXFwiPjxzcGFuIGRhdGEtZHotbmFtZT48L3NwYW4+PC9kaXY+XFxuICA8L2Rpdj5cXG4gIDxkaXYgY2xhc3M9XFxcImR6LXByb2dyZXNzXFxcIj48c3BhbiBjbGFzcz1cXFwiZHotdXBsb2FkXFxcIiBkYXRhLWR6LXVwbG9hZHByb2dyZXNzPjwvc3Bhbj48L2Rpdj5cXG4gIDxkaXYgY2xhc3M9XFxcImR6LWVycm9yLW1lc3NhZ2VcXFwiPjxzcGFuIGRhdGEtZHotZXJyb3JtZXNzYWdlPjwvc3Bhbj48L2Rpdj5cXG4gIDxkaXYgY2xhc3M9XFxcImR6LXN1Y2Nlc3MtbWFya1xcXCI+XFxuICAgIDxzdmcgd2lkdGg9XFxcIjU0cHhcXFwiIGhlaWdodD1cXFwiNTRweFxcXCIgdmlld0JveD1cXFwiMCAwIDU0IDU0XFxcIiB2ZXJzaW9uPVxcXCIxLjFcXFwiIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgeG1sbnM6eGxpbms9XFxcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcXFwiIHhtbG5zOnNrZXRjaD1cXFwiaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zXFxcIj5cXG4gICAgICA8dGl0bGU+Q2hlY2s8L3RpdGxlPlxcbiAgICAgIDxkZWZzPjwvZGVmcz5cXG4gICAgICA8ZyBpZD1cXFwiUGFnZS0xXFxcIiBzdHJva2U9XFxcIm5vbmVcXFwiIHN0cm9rZS13aWR0aD1cXFwiMVxcXCIgZmlsbD1cXFwibm9uZVxcXCIgZmlsbC1ydWxlPVxcXCJldmVub2RkXFxcIiBza2V0Y2g6dHlwZT1cXFwiTVNQYWdlXFxcIj5cXG4gICAgICAgIDxwYXRoIGQ9XFxcIk0yMy41LDMxLjg0MzE0NTggTDE3LjU4NTI0MTksMjUuOTI4Mzg3NyBDMTYuMDI0ODI1MywyNC4zNjc5NzExIDEzLjQ5MTAyOTQsMjQuMzY2ODM1IDExLjkyODkzMjIsMjUuOTI4OTMyMiBDMTAuMzcwMDEzNiwyNy40ODc4NTA4IDEwLjM2NjU5MTIsMzAuMDIzNDQ1NSAxMS45MjgzODc3LDMxLjU4NTI0MTkgTDIwLjQxNDc1ODEsNDAuMDcxNjEyMyBDMjAuNTEzMzk5OSw0MC4xNzAyNTQxIDIwLjYxNTkzMTUsNDAuMjYyNjY0OSAyMC43MjE4NjE1LDQwLjM0ODg0MzUgQzIyLjI4MzU2NjksNDEuODcyNTY1MSAyNC43OTQyMzQsNDEuODYyNjIwMiAyNi4zNDYxNTY0LDQwLjMxMDY5NzggTDQzLjMxMDY5NzgsMjMuMzQ2MTU2NCBDNDQuODc3MTAyMSwyMS43Nzk3NTIxIDQ0Ljg3NTgwNTcsMTkuMjQ4Mzg4NyA0My4zMTM3MDg1LDE3LjY4NjI5MTUgQzQxLjc1NDc4OTksMTYuMTI3MzcyOSAzOS4yMTc2MDM1LDE2LjEyNTU0MjIgMzcuNjUzODQzNiwxNy42ODkzMDIyIEwyMy41LDMxLjg0MzE0NTggWiBNMjcsNTMgQzQxLjM1OTQwMzUsNTMgNTMsNDEuMzU5NDAzNSA1MywyNyBDNTMsMTIuNjQwNTk2NSA0MS4zNTk0MDM1LDEgMjcsMSBDMTIuNjQwNTk2NSwxIDEsMTIuNjQwNTk2NSAxLDI3IEMxLDQxLjM1OTQwMzUgMTIuNjQwNTk2NSw1MyAyNyw1MyBaXFxcIiBpZD1cXFwiT3ZhbC0yXFxcIiBzdHJva2Utb3BhY2l0eT1cXFwiMC4xOTg3OTQxNThcXFwiIHN0cm9rZT1cXFwiIzc0NzQ3NFxcXCIgZmlsbC1vcGFjaXR5PVxcXCIwLjgxNjUxOTQ3NVxcXCIgZmlsbD1cXFwiI0ZGRkZGRlxcXCIgc2tldGNoOnR5cGU9XFxcIk1TU2hhcGVHcm91cFxcXCI+PC9wYXRoPlxcbiAgICAgIDwvZz5cXG4gICAgPC9zdmc+XFxuICA8L2Rpdj5cXG4gIDxkaXYgY2xhc3M9XFxcImR6LWVycm9yLW1hcmtcXFwiPlxcbiAgICA8c3ZnIHdpZHRoPVxcXCI1NHB4XFxcIiBoZWlnaHQ9XFxcIjU0cHhcXFwiIHZpZXdCb3g9XFxcIjAgMCA1NCA1NFxcXCIgdmVyc2lvbj1cXFwiMS4xXFxcIiB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHhtbG5zOnhsaW5rPVxcXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXFxcIiB4bWxuczpza2V0Y2g9XFxcImh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9uc1xcXCI+XFxuICAgICAgPHRpdGxlPkVycm9yPC90aXRsZT5cXG4gICAgICA8ZGVmcz48L2RlZnM+XFxuICAgICAgPGcgaWQ9XFxcIlBhZ2UtMVxcXCIgc3Ryb2tlPVxcXCJub25lXFxcIiBzdHJva2Utd2lkdGg9XFxcIjFcXFwiIGZpbGw9XFxcIm5vbmVcXFwiIGZpbGwtcnVsZT1cXFwiZXZlbm9kZFxcXCIgc2tldGNoOnR5cGU9XFxcIk1TUGFnZVxcXCI+XFxuICAgICAgICA8ZyBpZD1cXFwiQ2hlY2stKy1PdmFsLTJcXFwiIHNrZXRjaDp0eXBlPVxcXCJNU0xheWVyR3JvdXBcXFwiIHN0cm9rZT1cXFwiIzc0NzQ3NFxcXCIgc3Ryb2tlLW9wYWNpdHk9XFxcIjAuMTk4Nzk0MTU4XFxcIiBmaWxsPVxcXCIjRkZGRkZGXFxcIiBmaWxsLW9wYWNpdHk9XFxcIjAuODE2NTE5NDc1XFxcIj5cXG4gICAgICAgICAgPHBhdGggZD1cXFwiTTMyLjY1Njg1NDIsMjkgTDM4LjMxMDY5NzgsMjMuMzQ2MTU2NCBDMzkuODc3MTAyMSwyMS43Nzk3NTIxIDM5Ljg3NTgwNTcsMTkuMjQ4Mzg4NyAzOC4zMTM3MDg1LDE3LjY4NjI5MTUgQzM2Ljc1NDc4OTksMTYuMTI3MzcyOSAzNC4yMTc2MDM1LDE2LjEyNTU0MjIgMzIuNjUzODQzNiwxNy42ODkzMDIyIEwyNywyMy4zNDMxNDU4IEwyMS4zNDYxNTY0LDE3LjY4OTMwMjIgQzE5Ljc4MjM5NjUsMTYuMTI1NTQyMiAxNy4yNDUyMTAxLDE2LjEyNzM3MjkgMTUuNjg2MjkxNSwxNy42ODYyOTE1IEMxNC4xMjQxOTQzLDE5LjI0ODM4ODcgMTQuMTIyODk3OSwyMS43Nzk3NTIxIDE1LjY4OTMwMjIsMjMuMzQ2MTU2NCBMMjEuMzQzMTQ1OCwyOSBMMTUuNjg5MzAyMiwzNC42NTM4NDM2IEMxNC4xMjI4OTc5LDM2LjIyMDI0NzkgMTQuMTI0MTk0MywzOC43NTE2MTEzIDE1LjY4NjI5MTUsNDAuMzEzNzA4NSBDMTcuMjQ1MjEwMSw0MS44NzI2MjcxIDE5Ljc4MjM5NjUsNDEuODc0NDU3OCAyMS4zNDYxNTY0LDQwLjMxMDY5NzggTDI3LDM0LjY1Njg1NDIgTDMyLjY1Mzg0MzYsNDAuMzEwNjk3OCBDMzQuMjE3NjAzNSw0MS44NzQ0NTc4IDM2Ljc1NDc4OTksNDEuODcyNjI3MSAzOC4zMTM3MDg1LDQwLjMxMzcwODUgQzM5Ljg3NTgwNTcsMzguNzUxNjExMyAzOS44NzcxMDIxLDM2LjIyMDI0NzkgMzguMzEwNjk3OCwzNC42NTM4NDM2IEwzMi42NTY4NTQyLDI5IFogTTI3LDUzIEM0MS4zNTk0MDM1LDUzIDUzLDQxLjM1OTQwMzUgNTMsMjcgQzUzLDEyLjY0MDU5NjUgNDEuMzU5NDAzNSwxIDI3LDEgQzEyLjY0MDU5NjUsMSAxLDEyLjY0MDU5NjUgMSwyNyBDMSw0MS4zNTk0MDM1IDEyLjY0MDU5NjUsNTMgMjcsNTMgWlxcXCIgaWQ9XFxcIk92YWwtMlxcXCIgc2tldGNoOnR5cGU9XFxcIk1TU2hhcGVHcm91cFxcXCI+PC9wYXRoPlxcbiAgICAgICAgPC9nPlxcbiAgICAgIDwvZz5cXG4gICAgPC9zdmc+XFxuICA8L2Rpdj5cXG48L2Rpdj5cIixcblxuICAgICAgICAvLyBFTkQgT1BUSU9OU1xuICAgICAgICAvLyAoUmVxdWlyZWQgYnkgdGhlIGRyb3B6b25lIGRvY3VtZW50YXRpb24gcGFyc2VyKVxuXG5cbiAgICAgICAgLypcbiAgICAgICAgIFRob3NlIGZ1bmN0aW9ucyByZWdpc3RlciB0aGVtc2VsdmVzIHRvIHRoZSBldmVudHMgb24gaW5pdCBhbmQgaGFuZGxlIGFsbFxuICAgICAgICAgdGhlIHVzZXIgaW50ZXJmYWNlIHNwZWNpZmljIHN0dWZmLiBPdmVyd3JpdGluZyB0aGVtIHdvbid0IGJyZWFrIHRoZSB1cGxvYWRcbiAgICAgICAgIGJ1dCBjYW4gYnJlYWsgdGhlIHdheSBpdCdzIGRpc3BsYXllZC5cbiAgICAgICAgIFlvdSBjYW4gb3ZlcndyaXRlIHRoZW0gaWYgeW91IGRvbid0IGxpa2UgdGhlIGRlZmF1bHQgYmVoYXZpb3IuIElmIHlvdSBqdXN0XG4gICAgICAgICB3YW50IHRvIGFkZCBhbiBhZGRpdGlvbmFsIGV2ZW50IGhhbmRsZXIsIHJlZ2lzdGVyIGl0IG9uIHRoZSBkcm9wem9uZSBvYmplY3RcbiAgICAgICAgIGFuZCBkb24ndCBvdmVyd3JpdGUgdGhvc2Ugb3B0aW9ucy5cbiAgICAgICAgICovXG5cbiAgICAgICAgLy8gVGhvc2UgYXJlIHNlbGYgZXhwbGFuYXRvcnkgYW5kIHNpbXBseSBjb25jZXJuIHRoZSBEcmFnbkRyb3AuXG4gICAgICAgIGRyb3A6IGZ1bmN0aW9uIGRyb3AoZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImR6LWRyYWctaG92ZXJcIik7XG4gICAgICAgIH0sXG4gICAgICAgIGRyYWdzdGFydDogZnVuY3Rpb24gZHJhZ3N0YXJ0KGUpIHt9LFxuICAgICAgICBkcmFnZW5kOiBmdW5jdGlvbiBkcmFnZW5kKGUpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJkei1kcmFnLWhvdmVyXCIpO1xuICAgICAgICB9LFxuICAgICAgICBkcmFnZW50ZXI6IGZ1bmN0aW9uIGRyYWdlbnRlcihlKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotZHJhZy1ob3ZlclwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgZHJhZ292ZXI6IGZ1bmN0aW9uIGRyYWdvdmVyKGUpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkei1kcmFnLWhvdmVyXCIpO1xuICAgICAgICB9LFxuICAgICAgICBkcmFnbGVhdmU6IGZ1bmN0aW9uIGRyYWdsZWF2ZShlKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiZHotZHJhZy1ob3ZlclwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgcGFzdGU6IGZ1bmN0aW9uIHBhc3RlKGUpIHt9LFxuXG5cbiAgICAgICAgLy8gQ2FsbGVkIHdoZW5ldmVyIHRoZXJlIGFyZSBubyBmaWxlcyBsZWZ0IGluIHRoZSBkcm9wem9uZSBhbnltb3JlLCBhbmQgdGhlXG4gICAgICAgIC8vIGRyb3B6b25lIHNob3VsZCBiZSBkaXNwbGF5ZWQgYXMgaWYgaW4gdGhlIGluaXRpYWwgc3RhdGUuXG4gICAgICAgIHJlc2V0OiBmdW5jdGlvbiByZXNldCgpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJkei1zdGFydGVkXCIpO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gQ2FsbGVkIHdoZW4gYSBmaWxlIGlzIGFkZGVkIHRvIHRoZSBxdWV1ZVxuICAgICAgICAvLyBSZWNlaXZlcyBgZmlsZWBcbiAgICAgICAgYWRkZWRmaWxlOiBmdW5jdGlvbiBhZGRlZGZpbGUoZmlsZSkge1xuICAgICAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICAgICAgaWYgKHRoaXMuZWxlbWVudCA9PT0gdGhpcy5wcmV2aWV3c0NvbnRhaW5lcikge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkei1zdGFydGVkXCIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLnByZXZpZXdzQ29udGFpbmVyKSB7XG4gICAgICAgICAgICBmaWxlLnByZXZpZXdFbGVtZW50ID0gRHJvcHpvbmUuY3JlYXRlRWxlbWVudCh0aGlzLm9wdGlvbnMucHJldmlld1RlbXBsYXRlLnRyaW0oKSk7XG4gICAgICAgICAgICBmaWxlLnByZXZpZXdUZW1wbGF0ZSA9IGZpbGUucHJldmlld0VsZW1lbnQ7IC8vIEJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG5cbiAgICAgICAgICAgIHRoaXMucHJldmlld3NDb250YWluZXIuYXBwZW5kQ2hpbGQoZmlsZS5wcmV2aWV3RWxlbWVudCk7XG4gICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IzID0gZmlsZS5wcmV2aWV3RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZHotbmFtZV1cIiksIF9pc0FycmF5MyA9IHRydWUsIF9pMyA9IDAsIF9pdGVyYXRvcjMgPSBfaXNBcnJheTMgPyBfaXRlcmF0b3IzIDogX2l0ZXJhdG9yM1tTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgICAgICB2YXIgX3JlZjM7XG5cbiAgICAgICAgICAgICAgaWYgKF9pc0FycmF5Mykge1xuICAgICAgICAgICAgICAgIGlmIChfaTMgPj0gX2l0ZXJhdG9yMy5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgICAgIF9yZWYzID0gX2l0ZXJhdG9yM1tfaTMrK107XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX2kzID0gX2l0ZXJhdG9yMy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgaWYgKF9pMy5kb25lKSBicmVhaztcbiAgICAgICAgICAgICAgICBfcmVmMyA9IF9pMy52YWx1ZTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciBub2RlID0gX3JlZjM7XG5cbiAgICAgICAgICAgICAgbm9kZS50ZXh0Q29udGVudCA9IGZpbGUubmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjQgPSBmaWxlLnByZXZpZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1kei1zaXplXVwiKSwgX2lzQXJyYXk0ID0gdHJ1ZSwgX2k0ID0gMCwgX2l0ZXJhdG9yNCA9IF9pc0FycmF5NCA/IF9pdGVyYXRvcjQgOiBfaXRlcmF0b3I0W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgICAgIGlmIChfaXNBcnJheTQpIHtcbiAgICAgICAgICAgICAgICBpZiAoX2k0ID49IF9pdGVyYXRvcjQubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgICAgICBub2RlID0gX2l0ZXJhdG9yNFtfaTQrK107XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX2k0ID0gX2l0ZXJhdG9yNC5uZXh0KCk7XG4gICAgICAgICAgICAgICAgaWYgKF9pNC5kb25lKSBicmVhaztcbiAgICAgICAgICAgICAgICBub2RlID0gX2k0LnZhbHVlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgbm9kZS5pbm5lckhUTUwgPSB0aGlzLmZpbGVzaXplKGZpbGUuc2l6ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYWRkUmVtb3ZlTGlua3MpIHtcbiAgICAgICAgICAgICAgZmlsZS5fcmVtb3ZlTGluayA9IERyb3B6b25lLmNyZWF0ZUVsZW1lbnQoXCI8YSBjbGFzcz1cXFwiZHotcmVtb3ZlXFxcIiBocmVmPVxcXCJqYXZhc2NyaXB0OnVuZGVmaW5lZDtcXFwiIGRhdGEtZHotcmVtb3ZlPlwiICsgdGhpcy5vcHRpb25zLmRpY3RSZW1vdmVGaWxlICsgXCI8L2E+XCIpO1xuICAgICAgICAgICAgICBmaWxlLnByZXZpZXdFbGVtZW50LmFwcGVuZENoaWxkKGZpbGUuX3JlbW92ZUxpbmspO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcmVtb3ZlRmlsZUV2ZW50ID0gZnVuY3Rpb24gcmVtb3ZlRmlsZUV2ZW50KGUpIHtcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICBpZiAoZmlsZS5zdGF0dXMgPT09IERyb3B6b25lLlVQTE9BRElORykge1xuICAgICAgICAgICAgICAgIHJldHVybiBEcm9wem9uZS5jb25maXJtKF90aGlzMi5vcHRpb25zLmRpY3RDYW5jZWxVcGxvYWRDb25maXJtYXRpb24sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpczIucmVtb3ZlRmlsZShmaWxlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMyLm9wdGlvbnMuZGljdFJlbW92ZUZpbGVDb25maXJtYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBEcm9wem9uZS5jb25maXJtKF90aGlzMi5vcHRpb25zLmRpY3RSZW1vdmVGaWxlQ29uZmlybWF0aW9uLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpczIucmVtb3ZlRmlsZShmaWxlKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMyLnJlbW92ZUZpbGUoZmlsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3I1ID0gZmlsZS5wcmV2aWV3RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZHotcmVtb3ZlXVwiKSwgX2lzQXJyYXk1ID0gdHJ1ZSwgX2k1ID0gMCwgX2l0ZXJhdG9yNSA9IF9pc0FycmF5NSA/IF9pdGVyYXRvcjUgOiBfaXRlcmF0b3I1W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgICAgIHZhciBfcmVmNDtcblxuICAgICAgICAgICAgICBpZiAoX2lzQXJyYXk1KSB7XG4gICAgICAgICAgICAgICAgaWYgKF9pNSA+PSBfaXRlcmF0b3I1Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgX3JlZjQgPSBfaXRlcmF0b3I1W19pNSsrXTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfaTUgPSBfaXRlcmF0b3I1Lm5leHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoX2k1LmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgICAgIF9yZWY0ID0gX2k1LnZhbHVlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIHJlbW92ZUxpbmsgPSBfcmVmNDtcblxuICAgICAgICAgICAgICByZW1vdmVMaW5rLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByZW1vdmVGaWxlRXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8vIENhbGxlZCB3aGVuZXZlciBhIGZpbGUgaXMgcmVtb3ZlZC5cbiAgICAgICAgcmVtb3ZlZGZpbGU6IGZ1bmN0aW9uIHJlbW92ZWRmaWxlKGZpbGUpIHtcbiAgICAgICAgICBpZiAoZmlsZS5wcmV2aWV3RWxlbWVudCAhPSBudWxsICYmIGZpbGUucHJldmlld0VsZW1lbnQucGFyZW50Tm9kZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBmaWxlLnByZXZpZXdFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZmlsZS5wcmV2aWV3RWxlbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aGlzLl91cGRhdGVNYXhGaWxlc1JlYWNoZWRDbGFzcygpO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gQ2FsbGVkIHdoZW4gYSB0aHVtYm5haWwgaGFzIGJlZW4gZ2VuZXJhdGVkXG4gICAgICAgIC8vIFJlY2VpdmVzIGBmaWxlYCBhbmQgYGRhdGFVcmxgXG4gICAgICAgIHRodW1ibmFpbDogZnVuY3Rpb24gdGh1bWJuYWlsKGZpbGUsIGRhdGFVcmwpIHtcbiAgICAgICAgICBpZiAoZmlsZS5wcmV2aWV3RWxlbWVudCkge1xuICAgICAgICAgICAgZmlsZS5wcmV2aWV3RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiZHotZmlsZS1wcmV2aWV3XCIpO1xuICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yNiA9IGZpbGUucHJldmlld0VsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWR6LXRodW1ibmFpbF1cIiksIF9pc0FycmF5NiA9IHRydWUsIF9pNiA9IDAsIF9pdGVyYXRvcjYgPSBfaXNBcnJheTYgPyBfaXRlcmF0b3I2IDogX2l0ZXJhdG9yNltTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgICAgICB2YXIgX3JlZjU7XG5cbiAgICAgICAgICAgICAgaWYgKF9pc0FycmF5Nikge1xuICAgICAgICAgICAgICAgIGlmIChfaTYgPj0gX2l0ZXJhdG9yNi5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgICAgIF9yZWY1ID0gX2l0ZXJhdG9yNltfaTYrK107XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX2k2ID0gX2l0ZXJhdG9yNi5uZXh0KCk7XG4gICAgICAgICAgICAgICAgaWYgKF9pNi5kb25lKSBicmVhaztcbiAgICAgICAgICAgICAgICBfcmVmNSA9IF9pNi52YWx1ZTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciB0aHVtYm5haWxFbGVtZW50ID0gX3JlZjU7XG5cbiAgICAgICAgICAgICAgdGh1bWJuYWlsRWxlbWVudC5hbHQgPSBmaWxlLm5hbWU7XG4gICAgICAgICAgICAgIHRodW1ibmFpbEVsZW1lbnQuc3JjID0gZGF0YVVybDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsZS5wcmV2aWV3RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotaW1hZ2UtcHJldmlld1wiKTtcbiAgICAgICAgICAgIH0sIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8vIENhbGxlZCB3aGVuZXZlciBhbiBlcnJvciBvY2N1cnNcbiAgICAgICAgLy8gUmVjZWl2ZXMgYGZpbGVgIGFuZCBgbWVzc2FnZWBcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIGVycm9yKGZpbGUsIG1lc3NhZ2UpIHtcbiAgICAgICAgICBpZiAoZmlsZS5wcmV2aWV3RWxlbWVudCkge1xuICAgICAgICAgICAgZmlsZS5wcmV2aWV3RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotZXJyb3JcIik7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG1lc3NhZ2UgIT09IFwiU3RyaW5nXCIgJiYgbWVzc2FnZS5lcnJvcikge1xuICAgICAgICAgICAgICBtZXNzYWdlID0gbWVzc2FnZS5lcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjcgPSBmaWxlLnByZXZpZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1kei1lcnJvcm1lc3NhZ2VdXCIpLCBfaXNBcnJheTcgPSB0cnVlLCBfaTcgPSAwLCBfaXRlcmF0b3I3ID0gX2lzQXJyYXk3ID8gX2l0ZXJhdG9yNyA6IF9pdGVyYXRvcjdbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICAgICAgdmFyIF9yZWY2O1xuXG4gICAgICAgICAgICAgIGlmIChfaXNBcnJheTcpIHtcbiAgICAgICAgICAgICAgICBpZiAoX2k3ID49IF9pdGVyYXRvcjcubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgICAgICBfcmVmNiA9IF9pdGVyYXRvcjdbX2k3KytdO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF9pNyA9IF9pdGVyYXRvcjcubmV4dCgpO1xuICAgICAgICAgICAgICAgIGlmIChfaTcuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICAgICAgX3JlZjYgPSBfaTcudmFsdWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YXIgbm9kZSA9IF9yZWY2O1xuXG4gICAgICAgICAgICAgIG5vZGUudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3JtdWx0aXBsZTogZnVuY3Rpb24gZXJyb3JtdWx0aXBsZSgpIHt9LFxuXG5cbiAgICAgICAgLy8gQ2FsbGVkIHdoZW4gYSBmaWxlIGdldHMgcHJvY2Vzc2VkLiBTaW5jZSB0aGVyZSBpcyBhIGN1ZSwgbm90IGFsbCBhZGRlZFxuICAgICAgICAvLyBmaWxlcyBhcmUgcHJvY2Vzc2VkIGltbWVkaWF0ZWx5LlxuICAgICAgICAvLyBSZWNlaXZlcyBgZmlsZWBcbiAgICAgICAgcHJvY2Vzc2luZzogZnVuY3Rpb24gcHJvY2Vzc2luZyhmaWxlKSB7XG4gICAgICAgICAgaWYgKGZpbGUucHJldmlld0VsZW1lbnQpIHtcbiAgICAgICAgICAgIGZpbGUucHJldmlld0VsZW1lbnQuY2xhc3NMaXN0LmFkZChcImR6LXByb2Nlc3NpbmdcIik7XG4gICAgICAgICAgICBpZiAoZmlsZS5fcmVtb3ZlTGluaykge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsZS5fcmVtb3ZlTGluay5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuZGljdENhbmNlbFVwbG9hZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHByb2Nlc3NpbmdtdWx0aXBsZTogZnVuY3Rpb24gcHJvY2Vzc2luZ211bHRpcGxlKCkge30sXG5cblxuICAgICAgICAvLyBDYWxsZWQgd2hlbmV2ZXIgdGhlIHVwbG9hZCBwcm9ncmVzcyBnZXRzIHVwZGF0ZWQuXG4gICAgICAgIC8vIFJlY2VpdmVzIGBmaWxlYCwgYHByb2dyZXNzYCAocGVyY2VudGFnZSAwLTEwMCkgYW5kIGBieXRlc1NlbnRgLlxuICAgICAgICAvLyBUbyBnZXQgdGhlIHRvdGFsIG51bWJlciBvZiBieXRlcyBvZiB0aGUgZmlsZSwgdXNlIGBmaWxlLnNpemVgXG4gICAgICAgIHVwbG9hZHByb2dyZXNzOiBmdW5jdGlvbiB1cGxvYWRwcm9ncmVzcyhmaWxlLCBwcm9ncmVzcywgYnl0ZXNTZW50KSB7XG4gICAgICAgICAgaWYgKGZpbGUucHJldmlld0VsZW1lbnQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjggPSBmaWxlLnByZXZpZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1kei11cGxvYWRwcm9ncmVzc11cIiksIF9pc0FycmF5OCA9IHRydWUsIF9pOCA9IDAsIF9pdGVyYXRvcjggPSBfaXNBcnJheTggPyBfaXRlcmF0b3I4IDogX2l0ZXJhdG9yOFtTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgICAgICB2YXIgX3JlZjc7XG5cbiAgICAgICAgICAgICAgaWYgKF9pc0FycmF5OCkge1xuICAgICAgICAgICAgICAgIGlmIChfaTggPj0gX2l0ZXJhdG9yOC5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgICAgIF9yZWY3ID0gX2l0ZXJhdG9yOFtfaTgrK107XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX2k4ID0gX2l0ZXJhdG9yOC5uZXh0KCk7XG4gICAgICAgICAgICAgICAgaWYgKF9pOC5kb25lKSBicmVhaztcbiAgICAgICAgICAgICAgICBfcmVmNyA9IF9pOC52YWx1ZTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciBub2RlID0gX3JlZjc7XG5cbiAgICAgICAgICAgICAgbm9kZS5ub2RlTmFtZSA9PT0gJ1BST0dSRVNTJyA/IG5vZGUudmFsdWUgPSBwcm9ncmVzcyA6IG5vZGUuc3R5bGUud2lkdGggPSBwcm9ncmVzcyArIFwiJVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8vIENhbGxlZCB3aGVuZXZlciB0aGUgdG90YWwgdXBsb2FkIHByb2dyZXNzIGdldHMgdXBkYXRlZC5cbiAgICAgICAgLy8gQ2FsbGVkIHdpdGggdG90YWxVcGxvYWRQcm9ncmVzcyAoMC0xMDApLCB0b3RhbEJ5dGVzIGFuZCB0b3RhbEJ5dGVzU2VudFxuICAgICAgICB0b3RhbHVwbG9hZHByb2dyZXNzOiBmdW5jdGlvbiB0b3RhbHVwbG9hZHByb2dyZXNzKCkge30sXG5cblxuICAgICAgICAvLyBDYWxsZWQganVzdCBiZWZvcmUgdGhlIGZpbGUgaXMgc2VudC4gR2V0cyB0aGUgYHhocmAgb2JqZWN0IGFzIHNlY29uZFxuICAgICAgICAvLyBwYXJhbWV0ZXIsIHNvIHlvdSBjYW4gbW9kaWZ5IGl0IChmb3IgZXhhbXBsZSB0byBhZGQgYSBDU1JGIHRva2VuKSBhbmQgYVxuICAgICAgICAvLyBgZm9ybURhdGFgIG9iamVjdCB0byBhZGQgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAgICAgICAgc2VuZGluZzogZnVuY3Rpb24gc2VuZGluZygpIHt9LFxuICAgICAgICBzZW5kaW5nbXVsdGlwbGU6IGZ1bmN0aW9uIHNlbmRpbmdtdWx0aXBsZSgpIHt9LFxuXG5cbiAgICAgICAgLy8gV2hlbiB0aGUgY29tcGxldGUgdXBsb2FkIGlzIGZpbmlzaGVkIGFuZCBzdWNjZXNzZnVsXG4gICAgICAgIC8vIFJlY2VpdmVzIGBmaWxlYFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiBzdWNjZXNzKGZpbGUpIHtcbiAgICAgICAgICBpZiAoZmlsZS5wcmV2aWV3RWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGZpbGUucHJldmlld0VsZW1lbnQuY2xhc3NMaXN0LmFkZChcImR6LXN1Y2Nlc3NcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzbXVsdGlwbGU6IGZ1bmN0aW9uIHN1Y2Nlc3NtdWx0aXBsZSgpIHt9LFxuXG5cbiAgICAgICAgLy8gV2hlbiB0aGUgdXBsb2FkIGlzIGNhbmNlbGVkLlxuICAgICAgICBjYW5jZWxlZDogZnVuY3Rpb24gY2FuY2VsZWQoZmlsZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVtaXQoXCJlcnJvclwiLCBmaWxlLCB0aGlzLm9wdGlvbnMuZGljdFVwbG9hZENhbmNlbGVkKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2FuY2VsZWRtdWx0aXBsZTogZnVuY3Rpb24gY2FuY2VsZWRtdWx0aXBsZSgpIHt9LFxuXG5cbiAgICAgICAgLy8gV2hlbiB0aGUgdXBsb2FkIGlzIGZpbmlzaGVkLCBlaXRoZXIgd2l0aCBzdWNjZXNzIG9yIGFuIGVycm9yLlxuICAgICAgICAvLyBSZWNlaXZlcyBgZmlsZWBcbiAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uIGNvbXBsZXRlKGZpbGUpIHtcbiAgICAgICAgICBpZiAoZmlsZS5fcmVtb3ZlTGluaykge1xuICAgICAgICAgICAgZmlsZS5fcmVtb3ZlTGluay5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuZGljdFJlbW92ZUZpbGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWxlLnByZXZpZXdFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZS5wcmV2aWV3RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotY29tcGxldGVcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjb21wbGV0ZW11bHRpcGxlOiBmdW5jdGlvbiBjb21wbGV0ZW11bHRpcGxlKCkge30sXG4gICAgICAgIG1heGZpbGVzZXhjZWVkZWQ6IGZ1bmN0aW9uIG1heGZpbGVzZXhjZWVkZWQoKSB7fSxcbiAgICAgICAgbWF4ZmlsZXNyZWFjaGVkOiBmdW5jdGlvbiBtYXhmaWxlc3JlYWNoZWQoKSB7fSxcbiAgICAgICAgcXVldWVjb21wbGV0ZTogZnVuY3Rpb24gcXVldWVjb21wbGV0ZSgpIHt9LFxuICAgICAgICBhZGRlZGZpbGVzOiBmdW5jdGlvbiBhZGRlZGZpbGVzKCkge31cbiAgICAgIH07XG5cbiAgICAgIHRoaXMucHJvdG90eXBlLl90aHVtYm5haWxRdWV1ZSA9IFtdO1xuICAgICAgdGhpcy5wcm90b3R5cGUuX3Byb2Nlc3NpbmdUaHVtYm5haWwgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBnbG9iYWwgdXRpbGl0eVxuXG4gIH0sIHtcbiAgICBrZXk6IFwiZXh0ZW5kXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGV4dGVuZCh0YXJnZXQpIHtcbiAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgb2JqZWN0cyA9IEFycmF5KF9sZW4yID4gMSA/IF9sZW4yIC0gMSA6IDApLCBfa2V5MiA9IDE7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgICAgb2JqZWN0c1tfa2V5MiAtIDFdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yOSA9IG9iamVjdHMsIF9pc0FycmF5OSA9IHRydWUsIF9pOSA9IDAsIF9pdGVyYXRvcjkgPSBfaXNBcnJheTkgPyBfaXRlcmF0b3I5IDogX2l0ZXJhdG9yOVtTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICB2YXIgX3JlZjg7XG5cbiAgICAgICAgaWYgKF9pc0FycmF5OSkge1xuICAgICAgICAgIGlmIChfaTkgPj0gX2l0ZXJhdG9yOS5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgIF9yZWY4ID0gX2l0ZXJhdG9yOVtfaTkrK107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX2k5ID0gX2l0ZXJhdG9yOS5uZXh0KCk7XG4gICAgICAgICAgaWYgKF9pOS5kb25lKSBicmVhaztcbiAgICAgICAgICBfcmVmOCA9IF9pOS52YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvYmplY3QgPSBfcmVmODtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgdmFyIHZhbCA9IG9iamVjdFtrZXldO1xuICAgICAgICAgIHRhcmdldFtrZXldID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cbiAgfV0pO1xuXG4gIGZ1bmN0aW9uIERyb3B6b25lKGVsLCBvcHRpb25zKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIERyb3B6b25lKTtcblxuICAgIHZhciBfdGhpcyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChEcm9wem9uZS5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKERyb3B6b25lKSkuY2FsbCh0aGlzKSk7XG5cbiAgICB2YXIgZmFsbGJhY2sgPSB2b2lkIDAsXG4gICAgICAgIGxlZnQgPSB2b2lkIDA7XG4gICAgX3RoaXMuZWxlbWVudCA9IGVsO1xuICAgIC8vIEZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSBzaW5jZSB0aGUgdmVyc2lvbiB3YXMgaW4gdGhlIHByb3RvdHlwZSBwcmV2aW91c2x5XG4gICAgX3RoaXMudmVyc2lvbiA9IERyb3B6b25lLnZlcnNpb247XG5cbiAgICBfdGhpcy5kZWZhdWx0T3B0aW9ucy5wcmV2aWV3VGVtcGxhdGUgPSBfdGhpcy5kZWZhdWx0T3B0aW9ucy5wcmV2aWV3VGVtcGxhdGUucmVwbGFjZSgvXFxuKi9nLCBcIlwiKTtcblxuICAgIF90aGlzLmNsaWNrYWJsZUVsZW1lbnRzID0gW107XG4gICAgX3RoaXMubGlzdGVuZXJzID0gW107XG4gICAgX3RoaXMuZmlsZXMgPSBbXTsgLy8gQWxsIGZpbGVzXG5cbiAgICBpZiAodHlwZW9mIF90aGlzLmVsZW1lbnQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIF90aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF90aGlzLmVsZW1lbnQpO1xuICAgIH1cblxuICAgIC8vIE5vdCBjaGVja2luZyBpZiBpbnN0YW5jZSBvZiBIVE1MRWxlbWVudCBvciBFbGVtZW50IHNpbmNlIElFOSBpcyBleHRyZW1lbHkgd2VpcmQuXG4gICAgaWYgKCFfdGhpcy5lbGVtZW50IHx8IF90aGlzLmVsZW1lbnQubm9kZVR5cGUgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBkcm9wem9uZSBlbGVtZW50LlwiKTtcbiAgICB9XG5cbiAgICBpZiAoX3RoaXMuZWxlbWVudC5kcm9wem9uZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRHJvcHpvbmUgYWxyZWFkeSBhdHRhY2hlZC5cIik7XG4gICAgfVxuXG4gICAgLy8gTm93IGFkZCB0aGlzIGRyb3B6b25lIHRvIHRoZSBpbnN0YW5jZXMuXG4gICAgRHJvcHpvbmUuaW5zdGFuY2VzLnB1c2goX3RoaXMpO1xuXG4gICAgLy8gUHV0IHRoZSBkcm9wem9uZSBpbnNpZGUgdGhlIGVsZW1lbnQgaXRzZWxmLlxuICAgIF90aGlzLmVsZW1lbnQuZHJvcHpvbmUgPSBfdGhpcztcblxuICAgIHZhciBlbGVtZW50T3B0aW9ucyA9IChsZWZ0ID0gRHJvcHpvbmUub3B0aW9uc0ZvckVsZW1lbnQoX3RoaXMuZWxlbWVudCkpICE9IG51bGwgPyBsZWZ0IDoge307XG5cbiAgICBfdGhpcy5vcHRpb25zID0gRHJvcHpvbmUuZXh0ZW5kKHt9LCBfdGhpcy5kZWZhdWx0T3B0aW9ucywgZWxlbWVudE9wdGlvbnMsIG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMgOiB7fSk7XG5cbiAgICAvLyBJZiB0aGUgYnJvd3NlciBmYWlsZWQsIGp1c3QgY2FsbCB0aGUgZmFsbGJhY2sgYW5kIGxlYXZlXG4gICAgaWYgKF90aGlzLm9wdGlvbnMuZm9yY2VGYWxsYmFjayB8fCAhRHJvcHpvbmUuaXNCcm93c2VyU3VwcG9ydGVkKCkpIHtcbiAgICAgIHZhciBfcmV0O1xuXG4gICAgICByZXR1cm4gX3JldCA9IF90aGlzLm9wdGlvbnMuZmFsbGJhY2suY2FsbChfdGhpcyksIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKF90aGlzLCBfcmV0KTtcbiAgICB9XG5cbiAgICAvLyBAb3B0aW9ucy51cmwgPSBAZWxlbWVudC5nZXRBdHRyaWJ1dGUgXCJhY3Rpb25cIiB1bmxlc3MgQG9wdGlvbnMudXJsP1xuICAgIGlmIChfdGhpcy5vcHRpb25zLnVybCA9PSBudWxsKSB7XG4gICAgICBfdGhpcy5vcHRpb25zLnVybCA9IF90aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiYWN0aW9uXCIpO1xuICAgIH1cblxuICAgIGlmICghX3RoaXMub3B0aW9ucy51cmwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIFVSTCBwcm92aWRlZC5cIik7XG4gICAgfVxuXG4gICAgaWYgKF90aGlzLm9wdGlvbnMuYWNjZXB0ZWRGaWxlcyAmJiBfdGhpcy5vcHRpb25zLmFjY2VwdGVkTWltZVR5cGVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3UgY2FuJ3QgcHJvdmlkZSBib3RoICdhY2NlcHRlZEZpbGVzJyBhbmQgJ2FjY2VwdGVkTWltZVR5cGVzJy4gJ2FjY2VwdGVkTWltZVR5cGVzJyBpcyBkZXByZWNhdGVkLlwiKTtcbiAgICB9XG5cbiAgICBpZiAoX3RoaXMub3B0aW9ucy51cGxvYWRNdWx0aXBsZSAmJiBfdGhpcy5vcHRpb25zLmNodW5raW5nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBjYW5ub3Qgc2V0IGJvdGg6IHVwbG9hZE11bHRpcGxlIGFuZCBjaHVua2luZy4nKTtcbiAgICB9XG5cbiAgICAvLyBCYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICAgIGlmIChfdGhpcy5vcHRpb25zLmFjY2VwdGVkTWltZVR5cGVzKSB7XG4gICAgICBfdGhpcy5vcHRpb25zLmFjY2VwdGVkRmlsZXMgPSBfdGhpcy5vcHRpb25zLmFjY2VwdGVkTWltZVR5cGVzO1xuICAgICAgZGVsZXRlIF90aGlzLm9wdGlvbnMuYWNjZXB0ZWRNaW1lVHlwZXM7XG4gICAgfVxuXG4gICAgLy8gQmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgICBpZiAoX3RoaXMub3B0aW9ucy5yZW5hbWVGaWxlbmFtZSAhPSBudWxsKSB7XG4gICAgICBfdGhpcy5vcHRpb25zLnJlbmFtZUZpbGUgPSBmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICByZXR1cm4gX3RoaXMub3B0aW9ucy5yZW5hbWVGaWxlbmFtZS5jYWxsKF90aGlzLCBmaWxlLm5hbWUsIGZpbGUpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBfdGhpcy5vcHRpb25zLm1ldGhvZCA9IF90aGlzLm9wdGlvbnMubWV0aG9kLnRvVXBwZXJDYXNlKCk7XG5cbiAgICBpZiAoKGZhbGxiYWNrID0gX3RoaXMuZ2V0RXhpc3RpbmdGYWxsYmFjaygpKSAmJiBmYWxsYmFjay5wYXJlbnROb2RlKSB7XG4gICAgICAvLyBSZW1vdmUgdGhlIGZhbGxiYWNrXG4gICAgICBmYWxsYmFjay5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGZhbGxiYWNrKTtcbiAgICB9XG5cbiAgICAvLyBEaXNwbGF5IHByZXZpZXdzIGluIHRoZSBwcmV2aWV3c0NvbnRhaW5lciBlbGVtZW50IG9yIHRoZSBEcm9wem9uZSBlbGVtZW50IHVubGVzcyBleHBsaWNpdGx5IHNldCB0byBmYWxzZVxuICAgIGlmIChfdGhpcy5vcHRpb25zLnByZXZpZXdzQ29udGFpbmVyICE9PSBmYWxzZSkge1xuICAgICAgaWYgKF90aGlzLm9wdGlvbnMucHJldmlld3NDb250YWluZXIpIHtcbiAgICAgICAgX3RoaXMucHJldmlld3NDb250YWluZXIgPSBEcm9wem9uZS5nZXRFbGVtZW50KF90aGlzLm9wdGlvbnMucHJldmlld3NDb250YWluZXIsIFwicHJldmlld3NDb250YWluZXJcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfdGhpcy5wcmV2aWV3c0NvbnRhaW5lciA9IF90aGlzLmVsZW1lbnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKF90aGlzLm9wdGlvbnMuY2xpY2thYmxlKSB7XG4gICAgICBpZiAoX3RoaXMub3B0aW9ucy5jbGlja2FibGUgPT09IHRydWUpIHtcbiAgICAgICAgX3RoaXMuY2xpY2thYmxlRWxlbWVudHMgPSBbX3RoaXMuZWxlbWVudF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfdGhpcy5jbGlja2FibGVFbGVtZW50cyA9IERyb3B6b25lLmdldEVsZW1lbnRzKF90aGlzLm9wdGlvbnMuY2xpY2thYmxlLCBcImNsaWNrYWJsZVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfdGhpcy5pbml0KCk7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhbGwgZmlsZXMgdGhhdCBoYXZlIGJlZW4gYWNjZXB0ZWRcblxuXG4gIF9jcmVhdGVDbGFzcyhEcm9wem9uZSwgW3tcbiAgICBrZXk6IFwiZ2V0QWNjZXB0ZWRGaWxlc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRBY2NlcHRlZEZpbGVzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmlsZXMuZmlsdGVyKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIHJldHVybiBmaWxlLmFjY2VwdGVkO1xuICAgICAgfSkubWFwKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIHJldHVybiBmaWxlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJucyBhbGwgZmlsZXMgdGhhdCBoYXZlIGJlZW4gcmVqZWN0ZWRcbiAgICAvLyBOb3Qgc3VyZSB3aGVuIHRoYXQncyBnb2luZyB0byBiZSB1c2VmdWwsIGJ1dCBhZGRlZCBmb3IgY29tcGxldGVuZXNzLlxuXG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0UmVqZWN0ZWRGaWxlc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRSZWplY3RlZEZpbGVzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmlsZXMuZmlsdGVyKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIHJldHVybiAhZmlsZS5hY2NlcHRlZDtcbiAgICAgIH0pLm1hcChmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICByZXR1cm4gZmlsZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRGaWxlc1dpdGhTdGF0dXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0RmlsZXNXaXRoU3RhdHVzKHN0YXR1cykge1xuICAgICAgcmV0dXJuIHRoaXMuZmlsZXMuZmlsdGVyKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIHJldHVybiBmaWxlLnN0YXR1cyA9PT0gc3RhdHVzO1xuICAgICAgfSkubWFwKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIHJldHVybiBmaWxlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJucyBhbGwgZmlsZXMgdGhhdCBhcmUgaW4gdGhlIHF1ZXVlXG5cbiAgfSwge1xuICAgIGtleTogXCJnZXRRdWV1ZWRGaWxlc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRRdWV1ZWRGaWxlcygpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEZpbGVzV2l0aFN0YXR1cyhEcm9wem9uZS5RVUVVRUQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRVcGxvYWRpbmdGaWxlc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRVcGxvYWRpbmdGaWxlcygpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEZpbGVzV2l0aFN0YXR1cyhEcm9wem9uZS5VUExPQURJTkcpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRBZGRlZEZpbGVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEFkZGVkRmlsZXMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRGaWxlc1dpdGhTdGF0dXMoRHJvcHpvbmUuQURERUQpO1xuICAgIH1cblxuICAgIC8vIEZpbGVzIHRoYXQgYXJlIGVpdGhlciBxdWV1ZWQgb3IgdXBsb2FkaW5nXG5cbiAgfSwge1xuICAgIGtleTogXCJnZXRBY3RpdmVGaWxlc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRBY3RpdmVGaWxlcygpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbGVzLmZpbHRlcihmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICByZXR1cm4gZmlsZS5zdGF0dXMgPT09IERyb3B6b25lLlVQTE9BRElORyB8fCBmaWxlLnN0YXR1cyA9PT0gRHJvcHpvbmUuUVVFVUVEO1xuICAgICAgfSkubWFwKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIHJldHVybiBmaWxlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gVGhlIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgd2hlbiBEcm9wem9uZSBpcyBpbml0aWFsaXplZC4gWW91XG4gICAgLy8gY2FuIChhbmQgc2hvdWxkKSBzZXR1cCBldmVudCBsaXN0ZW5lcnMgaW5zaWRlIHRoaXMgZnVuY3Rpb24uXG5cbiAgfSwge1xuICAgIGtleTogXCJpbml0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgLy8gSW4gY2FzZSBpdCBpc24ndCBzZXQgYWxyZWFkeVxuICAgICAgaWYgKHRoaXMuZWxlbWVudC50YWdOYW1lID09PSBcImZvcm1cIikge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZW5jdHlwZVwiLCBcIm11bHRpcGFydC9mb3JtLWRhdGFcIik7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZHJvcHpvbmVcIikgJiYgIXRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmR6LW1lc3NhZ2VcIikpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKERyb3B6b25lLmNyZWF0ZUVsZW1lbnQoXCI8ZGl2IGNsYXNzPVxcXCJkei1kZWZhdWx0IGR6LW1lc3NhZ2VcXFwiPjxzcGFuPlwiICsgdGhpcy5vcHRpb25zLmRpY3REZWZhdWx0TWVzc2FnZSArIFwiPC9zcGFuPjwvZGl2PlwiKSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmNsaWNrYWJsZUVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgICB2YXIgc2V0dXBIaWRkZW5GaWxlSW5wdXQgPSBmdW5jdGlvbiBzZXR1cEhpZGRlbkZpbGVJbnB1dCgpIHtcbiAgICAgICAgICBpZiAoX3RoaXMzLmhpZGRlbkZpbGVJbnB1dCkge1xuICAgICAgICAgICAgX3RoaXMzLmhpZGRlbkZpbGVJbnB1dC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKF90aGlzMy5oaWRkZW5GaWxlSW5wdXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBfdGhpczMuaGlkZGVuRmlsZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICAgIF90aGlzMy5oaWRkZW5GaWxlSW5wdXQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImZpbGVcIik7XG4gICAgICAgICAgaWYgKF90aGlzMy5vcHRpb25zLm1heEZpbGVzID09PSBudWxsIHx8IF90aGlzMy5vcHRpb25zLm1heEZpbGVzID4gMSkge1xuICAgICAgICAgICAgX3RoaXMzLmhpZGRlbkZpbGVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJtdWx0aXBsZVwiLCBcIm11bHRpcGxlXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBfdGhpczMuaGlkZGVuRmlsZUlucHV0LmNsYXNzTmFtZSA9IFwiZHotaGlkZGVuLWlucHV0XCI7XG5cbiAgICAgICAgICBpZiAoX3RoaXMzLm9wdGlvbnMuYWNjZXB0ZWRGaWxlcyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgX3RoaXMzLmhpZGRlbkZpbGVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJhY2NlcHRcIiwgX3RoaXMzLm9wdGlvbnMuYWNjZXB0ZWRGaWxlcyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChfdGhpczMub3B0aW9ucy5jYXB0dXJlICE9PSBudWxsKSB7XG4gICAgICAgICAgICBfdGhpczMuaGlkZGVuRmlsZUlucHV0LnNldEF0dHJpYnV0ZShcImNhcHR1cmVcIiwgX3RoaXMzLm9wdGlvbnMuY2FwdHVyZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTm90IHNldHRpbmcgYGRpc3BsYXk9XCJub25lXCJgIGJlY2F1c2Ugc29tZSBicm93c2VycyBkb24ndCBhY2NlcHQgY2xpY2tzXG4gICAgICAgICAgLy8gb24gZWxlbWVudHMgdGhhdCBhcmVuJ3QgZGlzcGxheWVkLlxuICAgICAgICAgIF90aGlzMy5oaWRkZW5GaWxlSW5wdXQuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgX3RoaXMzLmhpZGRlbkZpbGVJbnB1dC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgICBfdGhpczMuaGlkZGVuRmlsZUlucHV0LnN0eWxlLnRvcCA9IFwiMFwiO1xuICAgICAgICAgIF90aGlzMy5oaWRkZW5GaWxlSW5wdXQuc3R5bGUubGVmdCA9IFwiMFwiO1xuICAgICAgICAgIF90aGlzMy5oaWRkZW5GaWxlSW5wdXQuc3R5bGUuaGVpZ2h0ID0gXCIwXCI7XG4gICAgICAgICAgX3RoaXMzLmhpZGRlbkZpbGVJbnB1dC5zdHlsZS53aWR0aCA9IFwiMFwiO1xuICAgICAgICAgIERyb3B6b25lLmdldEVsZW1lbnQoX3RoaXMzLm9wdGlvbnMuaGlkZGVuSW5wdXRDb250YWluZXIsICdoaWRkZW5JbnB1dENvbnRhaW5lcicpLmFwcGVuZENoaWxkKF90aGlzMy5oaWRkZW5GaWxlSW5wdXQpO1xuICAgICAgICAgIHJldHVybiBfdGhpczMuaGlkZGVuRmlsZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGZpbGVzID0gX3RoaXMzLmhpZGRlbkZpbGVJbnB1dC5maWxlcztcblxuICAgICAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IxMCA9IGZpbGVzLCBfaXNBcnJheTEwID0gdHJ1ZSwgX2kxMCA9IDAsIF9pdGVyYXRvcjEwID0gX2lzQXJyYXkxMCA/IF9pdGVyYXRvcjEwIDogX2l0ZXJhdG9yMTBbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICAgICAgICB2YXIgX3JlZjk7XG5cbiAgICAgICAgICAgICAgICBpZiAoX2lzQXJyYXkxMCkge1xuICAgICAgICAgICAgICAgICAgaWYgKF9pMTAgPj0gX2l0ZXJhdG9yMTAubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgICAgICAgIF9yZWY5ID0gX2l0ZXJhdG9yMTBbX2kxMCsrXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgX2kxMCA9IF9pdGVyYXRvcjEwLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgIGlmIChfaTEwLmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgX3JlZjkgPSBfaTEwLnZhbHVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBmaWxlID0gX3JlZjk7XG5cbiAgICAgICAgICAgICAgICBfdGhpczMuYWRkRmlsZShmaWxlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMzLmVtaXQoXCJhZGRlZGZpbGVzXCIsIGZpbGVzKTtcbiAgICAgICAgICAgIHJldHVybiBzZXR1cEhpZGRlbkZpbGVJbnB1dCgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBzZXR1cEhpZGRlbkZpbGVJbnB1dCgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLlVSTCA9IHdpbmRvdy5VUkwgIT09IG51bGwgPyB3aW5kb3cuVVJMIDogd2luZG93LndlYmtpdFVSTDtcblxuICAgICAgLy8gU2V0dXAgYWxsIGV2ZW50IGxpc3RlbmVycyBvbiB0aGUgRHJvcHpvbmUgb2JqZWN0IGl0c2VsZi5cbiAgICAgIC8vIFRoZXkncmUgbm90IGluIEBzZXR1cEV2ZW50TGlzdGVuZXJzKCkgYmVjYXVzZSB0aGV5IHNob3VsZG4ndCBiZSByZW1vdmVkXG4gICAgICAvLyBhZ2FpbiB3aGVuIHRoZSBkcm9wem9uZSBnZXRzIGRpc2FibGVkLlxuICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMTEgPSB0aGlzLmV2ZW50cywgX2lzQXJyYXkxMSA9IHRydWUsIF9pMTEgPSAwLCBfaXRlcmF0b3IxMSA9IF9pc0FycmF5MTEgPyBfaXRlcmF0b3IxMSA6IF9pdGVyYXRvcjExW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgIHZhciBfcmVmMTA7XG5cbiAgICAgICAgaWYgKF9pc0FycmF5MTEpIHtcbiAgICAgICAgICBpZiAoX2kxMSA+PSBfaXRlcmF0b3IxMS5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgIF9yZWYxMCA9IF9pdGVyYXRvcjExW19pMTErK107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX2kxMSA9IF9pdGVyYXRvcjExLm5leHQoKTtcbiAgICAgICAgICBpZiAoX2kxMS5kb25lKSBicmVhaztcbiAgICAgICAgICBfcmVmMTAgPSBfaTExLnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IF9yZWYxMDtcblxuICAgICAgICB0aGlzLm9uKGV2ZW50TmFtZSwgdGhpcy5vcHRpb25zW2V2ZW50TmFtZV0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm9uKFwidXBsb2FkcHJvZ3Jlc3NcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX3RoaXMzLnVwZGF0ZVRvdGFsVXBsb2FkUHJvZ3Jlc3MoKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm9uKFwicmVtb3ZlZGZpbGVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX3RoaXMzLnVwZGF0ZVRvdGFsVXBsb2FkUHJvZ3Jlc3MoKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm9uKFwiY2FuY2VsZWRcIiwgZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzMy5lbWl0KFwiY29tcGxldGVcIiwgZmlsZSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gRW1pdCBhIGBxdWV1ZWNvbXBsZXRlYCBldmVudCBpZiBhbGwgZmlsZXMgZmluaXNoZWQgdXBsb2FkaW5nLlxuICAgICAgdGhpcy5vbihcImNvbXBsZXRlXCIsIGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIGlmIChfdGhpczMuZ2V0QWRkZWRGaWxlcygpLmxlbmd0aCA9PT0gMCAmJiBfdGhpczMuZ2V0VXBsb2FkaW5nRmlsZXMoKS5sZW5ndGggPT09IDAgJiYgX3RoaXMzLmdldFF1ZXVlZEZpbGVzKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgLy8gVGhpcyBuZWVkcyB0byBiZSBkZWZlcnJlZCBzbyB0aGF0IGBxdWV1ZWNvbXBsZXRlYCByZWFsbHkgdHJpZ2dlcnMgYWZ0ZXIgYGNvbXBsZXRlYFxuICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpczMuZW1pdChcInF1ZXVlY29tcGxldGVcIik7XG4gICAgICAgICAgfSwgMCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB2YXIgbm9Qcm9wYWdhdGlvbiA9IGZ1bmN0aW9uIG5vUHJvcGFnYXRpb24oZSkge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICAgIHJldHVybiBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgLy8gQ3JlYXRlIHRoZSBsaXN0ZW5lcnNcbiAgICAgIHRoaXMubGlzdGVuZXJzID0gW3tcbiAgICAgICAgZWxlbWVudDogdGhpcy5lbGVtZW50LFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICBcImRyYWdzdGFydFwiOiBmdW5jdGlvbiBkcmFnc3RhcnQoZSkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzMy5lbWl0KFwiZHJhZ3N0YXJ0XCIsIGUpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkcmFnZW50ZXJcIjogZnVuY3Rpb24gZHJhZ2VudGVyKGUpIHtcbiAgICAgICAgICAgIG5vUHJvcGFnYXRpb24oZSk7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMzLmVtaXQoXCJkcmFnZW50ZXJcIiwgZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRyYWdvdmVyXCI6IGZ1bmN0aW9uIGRyYWdvdmVyKGUpIHtcbiAgICAgICAgICAgIC8vIE1ha2VzIGl0IHBvc3NpYmxlIHRvIGRyYWcgZmlsZXMgZnJvbSBjaHJvbWUncyBkb3dubG9hZCBiYXJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTk1MjY0MzAvZHJhZy1hbmQtZHJvcC1maWxlLXVwbG9hZHMtZnJvbS1jaHJvbWUtZG93bmxvYWRzLWJhclxuICAgICAgICAgICAgLy8gVHJ5IGlzIHJlcXVpcmVkIHRvIHByZXZlbnQgYnVnIGluIEludGVybmV0IEV4cGxvcmVyIDExIChTQ1JJUFQ2NTUzNSBleGNlcHRpb24pXG4gICAgICAgICAgICB2YXIgZWZjdCA9IHZvaWQgMDtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGVmY3QgPSBlLmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XG4gICAgICAgICAgICBlLmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ21vdmUnID09PSBlZmN0IHx8ICdsaW5rTW92ZScgPT09IGVmY3QgPyAnbW92ZScgOiAnY29weSc7XG5cbiAgICAgICAgICAgIG5vUHJvcGFnYXRpb24oZSk7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMzLmVtaXQoXCJkcmFnb3ZlclwiLCBlKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZHJhZ2xlYXZlXCI6IGZ1bmN0aW9uIGRyYWdsZWF2ZShlKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMzLmVtaXQoXCJkcmFnbGVhdmVcIiwgZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRyb3BcIjogZnVuY3Rpb24gZHJvcChlKSB7XG4gICAgICAgICAgICBub1Byb3BhZ2F0aW9uKGUpO1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzMy5kcm9wKGUpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkcmFnZW5kXCI6IGZ1bmN0aW9uIGRyYWdlbmQoZSkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzMy5lbWl0KFwiZHJhZ2VuZFwiLCBlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBUaGlzIGlzIGRpc2FibGVkIHJpZ2h0IG5vdywgYmVjYXVzZSB0aGUgYnJvd3NlcnMgZG9uJ3QgaW1wbGVtZW50IGl0IHByb3Blcmx5LlxuICAgICAgICAgIC8vIFwicGFzdGVcIjogKGUpID0+XG4gICAgICAgICAgLy8gICBub1Byb3BhZ2F0aW9uIGVcbiAgICAgICAgICAvLyAgIEBwYXN0ZSBlXG4gICAgICAgIH0gfV07XG5cbiAgICAgIHRoaXMuY2xpY2thYmxlRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoY2xpY2thYmxlRWxlbWVudCkge1xuICAgICAgICByZXR1cm4gX3RoaXMzLmxpc3RlbmVycy5wdXNoKHtcbiAgICAgICAgICBlbGVtZW50OiBjbGlja2FibGVFbGVtZW50LFxuICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgXCJjbGlja1wiOiBmdW5jdGlvbiBjbGljayhldnQpIHtcbiAgICAgICAgICAgICAgLy8gT25seSB0aGUgYWN0dWFsIGRyb3B6b25lIG9yIHRoZSBtZXNzYWdlIGVsZW1lbnQgc2hvdWxkIHRyaWdnZXIgZmlsZSBzZWxlY3Rpb25cbiAgICAgICAgICAgICAgaWYgKGNsaWNrYWJsZUVsZW1lbnQgIT09IF90aGlzMy5lbGVtZW50IHx8IGV2dC50YXJnZXQgPT09IF90aGlzMy5lbGVtZW50IHx8IERyb3B6b25lLmVsZW1lbnRJbnNpZGUoZXZ0LnRhcmdldCwgX3RoaXMzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5kei1tZXNzYWdlXCIpKSkge1xuICAgICAgICAgICAgICAgIF90aGlzMy5oaWRkZW5GaWxlSW5wdXQuY2xpY2soKTsgLy8gRm9yd2FyZCB0aGUgY2xpY2tcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuZW5hYmxlKCk7XG5cbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuaW5pdC5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIC8vIE5vdCBmdWxseSB0ZXN0ZWQgeWV0XG5cbiAgfSwge1xuICAgIGtleTogXCJkZXN0cm95XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICB0aGlzLmRpc2FibGUoKTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsRmlsZXModHJ1ZSk7XG4gICAgICBpZiAodGhpcy5oaWRkZW5GaWxlSW5wdXQgIT0gbnVsbCA/IHRoaXMuaGlkZGVuRmlsZUlucHV0LnBhcmVudE5vZGUgOiB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5oaWRkZW5GaWxlSW5wdXQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmhpZGRlbkZpbGVJbnB1dCk7XG4gICAgICAgIHRoaXMuaGlkZGVuRmlsZUlucHV0ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSB0aGlzLmVsZW1lbnQuZHJvcHpvbmU7XG4gICAgICByZXR1cm4gRHJvcHpvbmUuaW5zdGFuY2VzLnNwbGljZShEcm9wem9uZS5pbnN0YW5jZXMuaW5kZXhPZih0aGlzKSwgMSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInVwZGF0ZVRvdGFsVXBsb2FkUHJvZ3Jlc3NcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlVG90YWxVcGxvYWRQcm9ncmVzcygpIHtcbiAgICAgIHZhciB0b3RhbFVwbG9hZFByb2dyZXNzID0gdm9pZCAwO1xuICAgICAgdmFyIHRvdGFsQnl0ZXNTZW50ID0gMDtcbiAgICAgIHZhciB0b3RhbEJ5dGVzID0gMDtcblxuICAgICAgdmFyIGFjdGl2ZUZpbGVzID0gdGhpcy5nZXRBY3RpdmVGaWxlcygpO1xuXG4gICAgICBpZiAoYWN0aXZlRmlsZXMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjEyID0gdGhpcy5nZXRBY3RpdmVGaWxlcygpLCBfaXNBcnJheTEyID0gdHJ1ZSwgX2kxMiA9IDAsIF9pdGVyYXRvcjEyID0gX2lzQXJyYXkxMiA/IF9pdGVyYXRvcjEyIDogX2l0ZXJhdG9yMTJbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICB2YXIgX3JlZjExO1xuXG4gICAgICAgICAgaWYgKF9pc0FycmF5MTIpIHtcbiAgICAgICAgICAgIGlmIChfaTEyID49IF9pdGVyYXRvcjEyLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMTEgPSBfaXRlcmF0b3IxMltfaTEyKytdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfaTEyID0gX2l0ZXJhdG9yMTIubmV4dCgpO1xuICAgICAgICAgICAgaWYgKF9pMTIuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMTEgPSBfaTEyLnZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBmaWxlID0gX3JlZjExO1xuXG4gICAgICAgICAgdG90YWxCeXRlc1NlbnQgKz0gZmlsZS51cGxvYWQuYnl0ZXNTZW50O1xuICAgICAgICAgIHRvdGFsQnl0ZXMgKz0gZmlsZS51cGxvYWQudG90YWw7XG4gICAgICAgIH1cbiAgICAgICAgdG90YWxVcGxvYWRQcm9ncmVzcyA9IDEwMCAqIHRvdGFsQnl0ZXNTZW50IC8gdG90YWxCeXRlcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRvdGFsVXBsb2FkUHJvZ3Jlc3MgPSAxMDA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmVtaXQoXCJ0b3RhbHVwbG9hZHByb2dyZXNzXCIsIHRvdGFsVXBsb2FkUHJvZ3Jlc3MsIHRvdGFsQnl0ZXMsIHRvdGFsQnl0ZXNTZW50KTtcbiAgICB9XG5cbiAgICAvLyBAb3B0aW9ucy5wYXJhbU5hbWUgY2FuIGJlIGEgZnVuY3Rpb24gdGFraW5nIG9uZSBwYXJhbWV0ZXIgcmF0aGVyIHRoYW4gYSBzdHJpbmcuXG4gICAgLy8gQSBwYXJhbWV0ZXIgbmFtZSBmb3IgYSBmaWxlIGlzIG9idGFpbmVkIHNpbXBseSBieSBjYWxsaW5nIHRoaXMgd2l0aCBhbiBpbmRleCBudW1iZXIuXG5cbiAgfSwge1xuICAgIGtleTogXCJfZ2V0UGFyYW1OYW1lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXRQYXJhbU5hbWUobikge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMucGFyYW1OYW1lID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5wYXJhbU5hbWUobik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJcIiArIHRoaXMub3B0aW9ucy5wYXJhbU5hbWUgKyAodGhpcy5vcHRpb25zLnVwbG9hZE11bHRpcGxlID8gXCJbXCIgKyBuICsgXCJdXCIgOiBcIlwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiBAb3B0aW9ucy5yZW5hbWVGaWxlIGlzIGEgZnVuY3Rpb24sXG4gICAgLy8gdGhlIGZ1bmN0aW9uIHdpbGwgYmUgdXNlZCB0byByZW5hbWUgdGhlIGZpbGUubmFtZSBiZWZvcmUgYXBwZW5kaW5nIGl0IHRvIHRoZSBmb3JtRGF0YVxuXG4gIH0sIHtcbiAgICBrZXk6IFwiX3JlbmFtZUZpbGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3JlbmFtZUZpbGUoZmlsZSkge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMucmVuYW1lRmlsZSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBmaWxlLm5hbWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnJlbmFtZUZpbGUoZmlsZSk7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJucyBhIGZvcm0gdGhhdCBjYW4gYmUgdXNlZCBhcyBmYWxsYmFjayBpZiB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IERyYWduRHJvcFxuICAgIC8vXG4gICAgLy8gSWYgdGhlIGRyb3B6b25lIGlzIGFscmVhZHkgYSBmb3JtLCBvbmx5IHRoZSBpbnB1dCBmaWVsZCBhbmQgYnV0dG9uIGFyZSByZXR1cm5lZC4gT3RoZXJ3aXNlIGEgY29tcGxldGUgZm9ybSBlbGVtZW50IGlzIHByb3ZpZGVkLlxuICAgIC8vIFRoaXMgY29kZSBoYXMgdG8gcGFzcyBpbiBJRTcgOihcblxuICB9LCB7XG4gICAga2V5OiBcImdldEZhbGxiYWNrRm9ybVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRGYWxsYmFja0Zvcm0oKSB7XG4gICAgICB2YXIgZXhpc3RpbmdGYWxsYmFjayA9IHZvaWQgMCxcbiAgICAgICAgICBmb3JtID0gdm9pZCAwO1xuICAgICAgaWYgKGV4aXN0aW5nRmFsbGJhY2sgPSB0aGlzLmdldEV4aXN0aW5nRmFsbGJhY2soKSkge1xuICAgICAgICByZXR1cm4gZXhpc3RpbmdGYWxsYmFjaztcbiAgICAgIH1cblxuICAgICAgdmFyIGZpZWxkc1N0cmluZyA9IFwiPGRpdiBjbGFzcz1cXFwiZHotZmFsbGJhY2tcXFwiPlwiO1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5kaWN0RmFsbGJhY2tUZXh0KSB7XG4gICAgICAgIGZpZWxkc1N0cmluZyArPSBcIjxwPlwiICsgdGhpcy5vcHRpb25zLmRpY3RGYWxsYmFja1RleHQgKyBcIjwvcD5cIjtcbiAgICAgIH1cbiAgICAgIGZpZWxkc1N0cmluZyArPSBcIjxpbnB1dCB0eXBlPVxcXCJmaWxlXFxcIiBuYW1lPVxcXCJcIiArIHRoaXMuX2dldFBhcmFtTmFtZSgwKSArIFwiXFxcIiBcIiArICh0aGlzLm9wdGlvbnMudXBsb2FkTXVsdGlwbGUgPyAnbXVsdGlwbGU9XCJtdWx0aXBsZVwiJyA6IHVuZGVmaW5lZCkgKyBcIiAvPjxpbnB1dCB0eXBlPVxcXCJzdWJtaXRcXFwiIHZhbHVlPVxcXCJVcGxvYWQhXFxcIj48L2Rpdj5cIjtcblxuICAgICAgdmFyIGZpZWxkcyA9IERyb3B6b25lLmNyZWF0ZUVsZW1lbnQoZmllbGRzU3RyaW5nKTtcbiAgICAgIGlmICh0aGlzLmVsZW1lbnQudGFnTmFtZSAhPT0gXCJGT1JNXCIpIHtcbiAgICAgICAgZm9ybSA9IERyb3B6b25lLmNyZWF0ZUVsZW1lbnQoXCI8Zm9ybSBhY3Rpb249XFxcIlwiICsgdGhpcy5vcHRpb25zLnVybCArIFwiXFxcIiBlbmN0eXBlPVxcXCJtdWx0aXBhcnQvZm9ybS1kYXRhXFxcIiBtZXRob2Q9XFxcIlwiICsgdGhpcy5vcHRpb25zLm1ldGhvZCArIFwiXFxcIj48L2Zvcm0+XCIpO1xuICAgICAgICBmb3JtLmFwcGVuZENoaWxkKGZpZWxkcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBNYWtlIHN1cmUgdGhhdCB0aGUgZW5jdHlwZSBhbmQgbWV0aG9kIGF0dHJpYnV0ZXMgYXJlIHNldCBwcm9wZXJseVxuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZW5jdHlwZVwiLCBcIm11bHRpcGFydC9mb3JtLWRhdGFcIik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJtZXRob2RcIiwgdGhpcy5vcHRpb25zLm1ldGhvZCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZm9ybSAhPSBudWxsID8gZm9ybSA6IGZpZWxkcztcbiAgICB9XG5cbiAgICAvLyBSZXR1cm5zIHRoZSBmYWxsYmFjayBlbGVtZW50cyBpZiB0aGV5IGV4aXN0IGFscmVhZHlcbiAgICAvL1xuICAgIC8vIFRoaXMgY29kZSBoYXMgdG8gcGFzcyBpbiBJRTcgOihcblxuICB9LCB7XG4gICAga2V5OiBcImdldEV4aXN0aW5nRmFsbGJhY2tcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0RXhpc3RpbmdGYWxsYmFjaygpIHtcbiAgICAgIHZhciBnZXRGYWxsYmFjayA9IGZ1bmN0aW9uIGdldEZhbGxiYWNrKGVsZW1lbnRzKSB7XG4gICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjEzID0gZWxlbWVudHMsIF9pc0FycmF5MTMgPSB0cnVlLCBfaTEzID0gMCwgX2l0ZXJhdG9yMTMgPSBfaXNBcnJheTEzID8gX2l0ZXJhdG9yMTMgOiBfaXRlcmF0b3IxM1tTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgIHZhciBfcmVmMTI7XG5cbiAgICAgICAgICBpZiAoX2lzQXJyYXkxMykge1xuICAgICAgICAgICAgaWYgKF9pMTMgPj0gX2l0ZXJhdG9yMTMubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgIF9yZWYxMiA9IF9pdGVyYXRvcjEzW19pMTMrK107XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9pMTMgPSBfaXRlcmF0b3IxMy5uZXh0KCk7XG4gICAgICAgICAgICBpZiAoX2kxMy5kb25lKSBicmVhaztcbiAgICAgICAgICAgIF9yZWYxMiA9IF9pMTMudmFsdWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGVsID0gX3JlZjEyO1xuXG4gICAgICAgICAgaWYgKC8oXnwgKWZhbGxiYWNrKCR8ICkvLnRlc3QoZWwuY2xhc3NOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdmFyIF9hcnIgPSBbXCJkaXZcIiwgXCJmb3JtXCJdO1xuICAgICAgZm9yICh2YXIgX2kxNCA9IDA7IF9pMTQgPCBfYXJyLmxlbmd0aDsgX2kxNCsrKSB7XG4gICAgICAgIHZhciB0YWdOYW1lID0gX2FycltfaTE0XTtcbiAgICAgICAgdmFyIGZhbGxiYWNrO1xuICAgICAgICBpZiAoZmFsbGJhY2sgPSBnZXRGYWxsYmFjayh0aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFnTmFtZSkpKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbGxiYWNrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWN0aXZhdGVzIGFsbCBsaXN0ZW5lcnMgc3RvcmVkIGluIEBsaXN0ZW5lcnNcblxuICB9LCB7XG4gICAga2V5OiBcInNldHVwRXZlbnRMaXN0ZW5lcnNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0dXBFdmVudExpc3RlbmVycygpIHtcbiAgICAgIHJldHVybiB0aGlzLmxpc3RlbmVycy5tYXAoZnVuY3Rpb24gKGVsZW1lbnRMaXN0ZW5lcnMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgZm9yICh2YXIgZXZlbnQgaW4gZWxlbWVudExpc3RlbmVycy5ldmVudHMpIHtcbiAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IGVsZW1lbnRMaXN0ZW5lcnMuZXZlbnRzW2V2ZW50XTtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGVsZW1lbnRMaXN0ZW5lcnMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lciwgZmFsc2UpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gRGVhY3RpdmF0ZXMgYWxsIGxpc3RlbmVycyBzdG9yZWQgaW4gQGxpc3RlbmVyc1xuXG4gIH0sIHtcbiAgICBrZXk6IFwicmVtb3ZlRXZlbnRMaXN0ZW5lcnNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5saXN0ZW5lcnMubWFwKGZ1bmN0aW9uIChlbGVtZW50TGlzdGVuZXJzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICAgIGZvciAodmFyIGV2ZW50IGluIGVsZW1lbnRMaXN0ZW5lcnMuZXZlbnRzKSB7XG4gICAgICAgICAgICB2YXIgbGlzdGVuZXIgPSBlbGVtZW50TGlzdGVuZXJzLmV2ZW50c1tldmVudF07XG4gICAgICAgICAgICByZXN1bHQucHVzaChlbGVtZW50TGlzdGVuZXJzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgbGlzdGVuZXIsIGZhbHNlKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0oKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZXMgYWxsIGV2ZW50IGxpc3RlbmVycyBhbmQgY2FuY2VscyBhbGwgZmlsZXMgaW4gdGhlIHF1ZXVlIG9yIGJlaW5nIHByb2Nlc3NlZC5cblxuICB9LCB7XG4gICAga2V5OiBcImRpc2FibGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGlzYWJsZSgpIHtcbiAgICAgIHZhciBfdGhpczQgPSB0aGlzO1xuXG4gICAgICB0aGlzLmNsaWNrYWJsZUVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImR6LWNsaWNrYWJsZVwiKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVycygpO1xuICAgICAgdGhpcy5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICAgIHJldHVybiB0aGlzLmZpbGVzLm1hcChmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICByZXR1cm4gX3RoaXM0LmNhbmNlbFVwbG9hZChmaWxlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJlbmFibGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZW5hYmxlKCkge1xuICAgICAgZGVsZXRlIHRoaXMuZGlzYWJsZWQ7XG4gICAgICB0aGlzLmNsaWNrYWJsZUVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImR6LWNsaWNrYWJsZVwiKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXMuc2V0dXBFdmVudExpc3RlbmVycygpO1xuICAgIH1cblxuICAgIC8vIFJldHVybnMgYSBuaWNlbHkgZm9ybWF0dGVkIGZpbGVzaXplXG5cbiAgfSwge1xuICAgIGtleTogXCJmaWxlc2l6ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmaWxlc2l6ZShzaXplKSB7XG4gICAgICB2YXIgc2VsZWN0ZWRTaXplID0gMDtcbiAgICAgIHZhciBzZWxlY3RlZFVuaXQgPSBcImJcIjtcblxuICAgICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICAgIHZhciB1bml0cyA9IFsndGInLCAnZ2InLCAnbWInLCAna2InLCAnYiddO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdW5pdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgdW5pdCA9IHVuaXRzW2ldO1xuICAgICAgICAgIHZhciBjdXRvZmYgPSBNYXRoLnBvdyh0aGlzLm9wdGlvbnMuZmlsZXNpemVCYXNlLCA0IC0gaSkgLyAxMDtcblxuICAgICAgICAgIGlmIChzaXplID49IGN1dG9mZikge1xuICAgICAgICAgICAgc2VsZWN0ZWRTaXplID0gc2l6ZSAvIE1hdGgucG93KHRoaXMub3B0aW9ucy5maWxlc2l6ZUJhc2UsIDQgLSBpKTtcbiAgICAgICAgICAgIHNlbGVjdGVkVW5pdCA9IHVuaXQ7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzZWxlY3RlZFNpemUgPSBNYXRoLnJvdW5kKDEwICogc2VsZWN0ZWRTaXplKSAvIDEwOyAvLyBDdXR0aW5nIG9mIGRpZ2l0c1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gXCI8c3Ryb25nPlwiICsgc2VsZWN0ZWRTaXplICsgXCI8L3N0cm9uZz4gXCIgKyB0aGlzLm9wdGlvbnMuZGljdEZpbGVTaXplVW5pdHNbc2VsZWN0ZWRVbml0XTtcbiAgICB9XG5cbiAgICAvLyBBZGRzIG9yIHJlbW92ZXMgdGhlIGBkei1tYXgtZmlsZXMtcmVhY2hlZGAgY2xhc3MgZnJvbSB0aGUgZm9ybS5cblxuICB9LCB7XG4gICAga2V5OiBcIl91cGRhdGVNYXhGaWxlc1JlYWNoZWRDbGFzc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfdXBkYXRlTWF4RmlsZXNSZWFjaGVkQ2xhc3MoKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLm1heEZpbGVzICE9IG51bGwgJiYgdGhpcy5nZXRBY2NlcHRlZEZpbGVzKCkubGVuZ3RoID49IHRoaXMub3B0aW9ucy5tYXhGaWxlcykge1xuICAgICAgICBpZiAodGhpcy5nZXRBY2NlcHRlZEZpbGVzKCkubGVuZ3RoID09PSB0aGlzLm9wdGlvbnMubWF4RmlsZXMpIHtcbiAgICAgICAgICB0aGlzLmVtaXQoJ21heGZpbGVzcmVhY2hlZCcsIHRoaXMuZmlsZXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImR6LW1heC1maWxlcy1yZWFjaGVkXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiZHotbWF4LWZpbGVzLXJlYWNoZWRcIik7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImRyb3BcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZHJvcChlKSB7XG4gICAgICBpZiAoIWUuZGF0YVRyYW5zZmVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuZW1pdChcImRyb3BcIiwgZSk7XG5cbiAgICAgIC8vIENvbnZlcnQgdGhlIEZpbGVMaXN0IHRvIGFuIEFycmF5XG4gICAgICAvLyBUaGlzIGlzIG5lY2Vzc2FyeSBmb3IgSUUxMVxuICAgICAgdmFyIGZpbGVzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGUuZGF0YVRyYW5zZmVyLmZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZpbGVzW2ldID0gZS5kYXRhVHJhbnNmZXIuZmlsZXNbaV07XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZW1pdChcImFkZGVkZmlsZXNcIiwgZmlsZXMpO1xuXG4gICAgICAvLyBFdmVuIGlmIGl0J3MgYSBmb2xkZXIsIGZpbGVzLmxlbmd0aCB3aWxsIGNvbnRhaW4gdGhlIGZvbGRlcnMuXG4gICAgICBpZiAoZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBpdGVtcyA9IGUuZGF0YVRyYW5zZmVyLml0ZW1zO1xuXG4gICAgICAgIGlmIChpdGVtcyAmJiBpdGVtcy5sZW5ndGggJiYgaXRlbXNbMF0ud2Via2l0R2V0QXNFbnRyeSAhPSBudWxsKSB7XG4gICAgICAgICAgLy8gVGhlIGJyb3dzZXIgc3VwcG9ydHMgZHJvcHBpbmcgb2YgZm9sZGVycywgc28gaGFuZGxlIGl0ZW1zIGluc3RlYWQgb2YgZmlsZXNcbiAgICAgICAgICB0aGlzLl9hZGRGaWxlc0Zyb21JdGVtcyhpdGVtcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5oYW5kbGVGaWxlcyhmaWxlcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicGFzdGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcGFzdGUoZSkge1xuICAgICAgaWYgKF9fZ3VhcmRfXyhlICE9IG51bGwgPyBlLmNsaXBib2FyZERhdGEgOiB1bmRlZmluZWQsIGZ1bmN0aW9uICh4KSB7XG4gICAgICAgIHJldHVybiB4Lml0ZW1zO1xuICAgICAgfSkgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZW1pdChcInBhc3RlXCIsIGUpO1xuICAgICAgdmFyIGl0ZW1zID0gZS5jbGlwYm9hcmREYXRhLml0ZW1zO1xuXG5cbiAgICAgIGlmIChpdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZEZpbGVzRnJvbUl0ZW1zKGl0ZW1zKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaGFuZGxlRmlsZXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlRmlsZXMoZmlsZXMpIHtcbiAgICAgIGZvciAodmFyIF9pdGVyYXRvcjE0ID0gZmlsZXMsIF9pc0FycmF5MTQgPSB0cnVlLCBfaTE1ID0gMCwgX2l0ZXJhdG9yMTQgPSBfaXNBcnJheTE0ID8gX2l0ZXJhdG9yMTQgOiBfaXRlcmF0b3IxNFtTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICB2YXIgX3JlZjEzO1xuXG4gICAgICAgIGlmIChfaXNBcnJheTE0KSB7XG4gICAgICAgICAgaWYgKF9pMTUgPj0gX2l0ZXJhdG9yMTQubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICBfcmVmMTMgPSBfaXRlcmF0b3IxNFtfaTE1KytdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9pMTUgPSBfaXRlcmF0b3IxNC5uZXh0KCk7XG4gICAgICAgICAgaWYgKF9pMTUuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgX3JlZjEzID0gX2kxNS52YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmaWxlID0gX3JlZjEzO1xuXG4gICAgICAgIHRoaXMuYWRkRmlsZShmaWxlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBXaGVuIGEgZm9sZGVyIGlzIGRyb3BwZWQgKG9yIGZpbGVzIGFyZSBwYXN0ZWQpLCBpdGVtcyBtdXN0IGJlIGhhbmRsZWRcbiAgICAvLyBpbnN0ZWFkIG9mIGZpbGVzLlxuXG4gIH0sIHtcbiAgICBrZXk6IFwiX2FkZEZpbGVzRnJvbUl0ZW1zXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9hZGRGaWxlc0Zyb21JdGVtcyhpdGVtcykge1xuICAgICAgdmFyIF90aGlzNSA9IHRoaXM7XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMTUgPSBpdGVtcywgX2lzQXJyYXkxNSA9IHRydWUsIF9pMTYgPSAwLCBfaXRlcmF0b3IxNSA9IF9pc0FycmF5MTUgPyBfaXRlcmF0b3IxNSA6IF9pdGVyYXRvcjE1W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgdmFyIF9yZWYxNDtcblxuICAgICAgICAgIGlmIChfaXNBcnJheTE1KSB7XG4gICAgICAgICAgICBpZiAoX2kxNiA+PSBfaXRlcmF0b3IxNS5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgX3JlZjE0ID0gX2l0ZXJhdG9yMTVbX2kxNisrXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX2kxNiA9IF9pdGVyYXRvcjE1Lm5leHQoKTtcbiAgICAgICAgICAgIGlmIChfaTE2LmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgX3JlZjE0ID0gX2kxNi52YWx1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgaXRlbSA9IF9yZWYxNDtcblxuICAgICAgICAgIHZhciBlbnRyeTtcbiAgICAgICAgICBpZiAoaXRlbS53ZWJraXRHZXRBc0VudHJ5ICE9IG51bGwgJiYgKGVudHJ5ID0gaXRlbS53ZWJraXRHZXRBc0VudHJ5KCkpKSB7XG4gICAgICAgICAgICBpZiAoZW50cnkuaXNGaWxlKSB7XG4gICAgICAgICAgICAgIHJlc3VsdC5wdXNoKF90aGlzNS5hZGRGaWxlKGl0ZW0uZ2V0QXNGaWxlKCkpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZW50cnkuaXNEaXJlY3RvcnkpIHtcbiAgICAgICAgICAgICAgLy8gQXBwZW5kIGFsbCBmaWxlcyBmcm9tIHRoYXQgZGlyZWN0b3J5IHRvIGZpbGVzXG4gICAgICAgICAgICAgIHJlc3VsdC5wdXNoKF90aGlzNS5fYWRkRmlsZXNGcm9tRGlyZWN0b3J5KGVudHJ5LCBlbnRyeS5uYW1lKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQucHVzaCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5nZXRBc0ZpbGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGl0ZW0ua2luZCA9PSBudWxsIHx8IGl0ZW0ua2luZCA9PT0gXCJmaWxlXCIpIHtcbiAgICAgICAgICAgICAgcmVzdWx0LnB1c2goX3RoaXM1LmFkZEZpbGUoaXRlbS5nZXRBc0ZpbGUoKSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzdWx0LnB1c2godW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2godW5kZWZpbmVkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0oKTtcbiAgICB9XG5cbiAgICAvLyBHb2VzIHRocm91Z2ggdGhlIGRpcmVjdG9yeSwgYW5kIGFkZHMgZWFjaCBmaWxlIGl0IGZpbmRzIHJlY3Vyc2l2ZWx5XG5cbiAgfSwge1xuICAgIGtleTogXCJfYWRkRmlsZXNGcm9tRGlyZWN0b3J5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9hZGRGaWxlc0Zyb21EaXJlY3RvcnkoZGlyZWN0b3J5LCBwYXRoKSB7XG4gICAgICB2YXIgX3RoaXM2ID0gdGhpcztcblxuICAgICAgdmFyIGRpclJlYWRlciA9IGRpcmVjdG9yeS5jcmVhdGVSZWFkZXIoKTtcblxuICAgICAgdmFyIGVycm9ySGFuZGxlciA9IGZ1bmN0aW9uIGVycm9ySGFuZGxlcihlcnJvcikge1xuICAgICAgICByZXR1cm4gX19ndWFyZE1ldGhvZF9fKGNvbnNvbGUsICdsb2cnLCBmdW5jdGlvbiAobykge1xuICAgICAgICAgIHJldHVybiBvLmxvZyhlcnJvcik7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgdmFyIHJlYWRFbnRyaWVzID0gZnVuY3Rpb24gcmVhZEVudHJpZXMoKSB7XG4gICAgICAgIHJldHVybiBkaXJSZWFkZXIucmVhZEVudHJpZXMoZnVuY3Rpb24gKGVudHJpZXMpIHtcbiAgICAgICAgICBpZiAoZW50cmllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IxNiA9IGVudHJpZXMsIF9pc0FycmF5MTYgPSB0cnVlLCBfaTE3ID0gMCwgX2l0ZXJhdG9yMTYgPSBfaXNBcnJheTE2ID8gX2l0ZXJhdG9yMTYgOiBfaXRlcmF0b3IxNltTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgICAgICB2YXIgX3JlZjE1O1xuXG4gICAgICAgICAgICAgIGlmIChfaXNBcnJheTE2KSB7XG4gICAgICAgICAgICAgICAgaWYgKF9pMTcgPj0gX2l0ZXJhdG9yMTYubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgICAgICBfcmVmMTUgPSBfaXRlcmF0b3IxNltfaTE3KytdO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF9pMTcgPSBfaXRlcmF0b3IxNi5uZXh0KCk7XG4gICAgICAgICAgICAgICAgaWYgKF9pMTcuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICAgICAgX3JlZjE1ID0gX2kxNy52YWx1ZTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciBlbnRyeSA9IF9yZWYxNTtcblxuICAgICAgICAgICAgICBpZiAoZW50cnkuaXNGaWxlKSB7XG4gICAgICAgICAgICAgICAgZW50cnkuZmlsZShmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICAgICAgICAgICAgaWYgKF90aGlzNi5vcHRpb25zLmlnbm9yZUhpZGRlbkZpbGVzICYmIGZpbGUubmFtZS5zdWJzdHJpbmcoMCwgMSkgPT09ICcuJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBmaWxlLmZ1bGxQYXRoID0gcGF0aCArIFwiL1wiICsgZmlsZS5uYW1lO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzNi5hZGRGaWxlKGZpbGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVudHJ5LmlzRGlyZWN0b3J5KSB7XG4gICAgICAgICAgICAgICAgX3RoaXM2Ll9hZGRGaWxlc0Zyb21EaXJlY3RvcnkoZW50cnksIHBhdGggKyBcIi9cIiArIGVudHJ5Lm5hbWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJlY3Vyc2l2ZWx5IGNhbGwgcmVhZEVudHJpZXMoKSBhZ2Fpbiwgc2luY2UgYnJvd3NlciBvbmx5IGhhbmRsZVxuICAgICAgICAgICAgLy8gdGhlIGZpcnN0IDEwMCBlbnRyaWVzLlxuICAgICAgICAgICAgLy8gU2VlOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRGlyZWN0b3J5UmVhZGVyI3JlYWRFbnRyaWVzXG4gICAgICAgICAgICByZWFkRW50cmllcygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSwgZXJyb3JIYW5kbGVyKTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiByZWFkRW50cmllcygpO1xuICAgIH1cblxuICAgIC8vIElmIGBkb25lKClgIGlzIGNhbGxlZCB3aXRob3V0IGFyZ3VtZW50IHRoZSBmaWxlIGlzIGFjY2VwdGVkXG4gICAgLy8gSWYgeW91IGNhbGwgaXQgd2l0aCBhbiBlcnJvciBtZXNzYWdlLCB0aGUgZmlsZSBpcyByZWplY3RlZFxuICAgIC8vIChUaGlzIGFsbG93cyBmb3IgYXN5bmNocm9ub3VzIHZhbGlkYXRpb24pXG4gICAgLy9cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGNoZWNrcyB0aGUgZmlsZXNpemUsIGFuZCBpZiB0aGUgZmlsZS50eXBlIHBhc3NlcyB0aGVcbiAgICAvLyBgYWNjZXB0ZWRGaWxlc2AgY2hlY2suXG5cbiAgfSwge1xuICAgIGtleTogXCJhY2NlcHRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWNjZXB0KGZpbGUsIGRvbmUpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubWF4RmlsZXNpemUgJiYgZmlsZS5zaXplID4gdGhpcy5vcHRpb25zLm1heEZpbGVzaXplICogMTAyNCAqIDEwMjQpIHtcbiAgICAgICAgcmV0dXJuIGRvbmUodGhpcy5vcHRpb25zLmRpY3RGaWxlVG9vQmlnLnJlcGxhY2UoXCJ7e2ZpbGVzaXplfX1cIiwgTWF0aC5yb3VuZChmaWxlLnNpemUgLyAxMDI0IC8gMTAuMjQpIC8gMTAwKS5yZXBsYWNlKFwie3ttYXhGaWxlc2l6ZX19XCIsIHRoaXMub3B0aW9ucy5tYXhGaWxlc2l6ZSkpO1xuICAgICAgfSBlbHNlIGlmICghRHJvcHpvbmUuaXNWYWxpZEZpbGUoZmlsZSwgdGhpcy5vcHRpb25zLmFjY2VwdGVkRmlsZXMpKSB7XG4gICAgICAgIHJldHVybiBkb25lKHRoaXMub3B0aW9ucy5kaWN0SW52YWxpZEZpbGVUeXBlKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLm1heEZpbGVzICE9IG51bGwgJiYgdGhpcy5nZXRBY2NlcHRlZEZpbGVzKCkubGVuZ3RoID49IHRoaXMub3B0aW9ucy5tYXhGaWxlcykge1xuICAgICAgICBkb25lKHRoaXMub3B0aW9ucy5kaWN0TWF4RmlsZXNFeGNlZWRlZC5yZXBsYWNlKFwie3ttYXhGaWxlc319XCIsIHRoaXMub3B0aW9ucy5tYXhGaWxlcykpO1xuICAgICAgICByZXR1cm4gdGhpcy5lbWl0KFwibWF4ZmlsZXNleGNlZWRlZFwiLCBmaWxlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuYWNjZXB0LmNhbGwodGhpcywgZmlsZSwgZG9uZSk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImFkZEZpbGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWRkRmlsZShmaWxlKSB7XG4gICAgICB2YXIgX3RoaXM3ID0gdGhpcztcblxuICAgICAgZmlsZS51cGxvYWQgPSB7XG4gICAgICAgIHV1aWQ6IERyb3B6b25lLnV1aWR2NCgpLFxuICAgICAgICBwcm9ncmVzczogMCxcbiAgICAgICAgLy8gU2V0dGluZyB0aGUgdG90YWwgdXBsb2FkIHNpemUgdG8gZmlsZS5zaXplIGZvciB0aGUgYmVnaW5uaW5nXG4gICAgICAgIC8vIEl0J3MgYWN0dWFsIGRpZmZlcmVudCB0aGFuIHRoZSBzaXplIHRvIGJlIHRyYW5zbWl0dGVkLlxuICAgICAgICB0b3RhbDogZmlsZS5zaXplLFxuICAgICAgICBieXRlc1NlbnQ6IDAsXG4gICAgICAgIGZpbGVuYW1lOiB0aGlzLl9yZW5hbWVGaWxlKGZpbGUpLFxuICAgICAgICBjaHVua2VkOiB0aGlzLm9wdGlvbnMuY2h1bmtpbmcgJiYgKHRoaXMub3B0aW9ucy5mb3JjZUNodW5raW5nIHx8IGZpbGUuc2l6ZSA+IHRoaXMub3B0aW9ucy5jaHVua1NpemUpLFxuICAgICAgICB0b3RhbENodW5rQ291bnQ6IE1hdGguY2VpbChmaWxlLnNpemUgLyB0aGlzLm9wdGlvbnMuY2h1bmtTaXplKVxuICAgICAgfTtcbiAgICAgIHRoaXMuZmlsZXMucHVzaChmaWxlKTtcblxuICAgICAgZmlsZS5zdGF0dXMgPSBEcm9wem9uZS5BRERFRDtcblxuICAgICAgdGhpcy5lbWl0KFwiYWRkZWRmaWxlXCIsIGZpbGUpO1xuXG4gICAgICB0aGlzLl9lbnF1ZXVlVGh1bWJuYWlsKGZpbGUpO1xuXG4gICAgICByZXR1cm4gdGhpcy5hY2NlcHQoZmlsZSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIGZpbGUuYWNjZXB0ZWQgPSBmYWxzZTtcbiAgICAgICAgICBfdGhpczcuX2Vycm9yUHJvY2Vzc2luZyhbZmlsZV0sIGVycm9yKTsgLy8gV2lsbCBzZXQgdGhlIGZpbGUuc3RhdHVzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmlsZS5hY2NlcHRlZCA9IHRydWU7XG4gICAgICAgICAgaWYgKF90aGlzNy5vcHRpb25zLmF1dG9RdWV1ZSkge1xuICAgICAgICAgICAgX3RoaXM3LmVucXVldWVGaWxlKGZpbGUpO1xuICAgICAgICAgIH0gLy8gV2lsbCBzZXQgLmFjY2VwdGVkID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfdGhpczcuX3VwZGF0ZU1heEZpbGVzUmVhY2hlZENsYXNzKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBXcmFwcGVyIGZvciBlbnF1ZXVlRmlsZVxuXG4gIH0sIHtcbiAgICBrZXk6IFwiZW5xdWV1ZUZpbGVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGVucXVldWVGaWxlcyhmaWxlcykge1xuICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMTcgPSBmaWxlcywgX2lzQXJyYXkxNyA9IHRydWUsIF9pMTggPSAwLCBfaXRlcmF0b3IxNyA9IF9pc0FycmF5MTcgPyBfaXRlcmF0b3IxNyA6IF9pdGVyYXRvcjE3W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgIHZhciBfcmVmMTY7XG5cbiAgICAgICAgaWYgKF9pc0FycmF5MTcpIHtcbiAgICAgICAgICBpZiAoX2kxOCA+PSBfaXRlcmF0b3IxNy5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgIF9yZWYxNiA9IF9pdGVyYXRvcjE3W19pMTgrK107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX2kxOCA9IF9pdGVyYXRvcjE3Lm5leHQoKTtcbiAgICAgICAgICBpZiAoX2kxOC5kb25lKSBicmVhaztcbiAgICAgICAgICBfcmVmMTYgPSBfaTE4LnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpbGUgPSBfcmVmMTY7XG5cbiAgICAgICAgdGhpcy5lbnF1ZXVlRmlsZShmaWxlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJlbnF1ZXVlRmlsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlbnF1ZXVlRmlsZShmaWxlKSB7XG4gICAgICB2YXIgX3RoaXM4ID0gdGhpcztcblxuICAgICAgaWYgKGZpbGUuc3RhdHVzID09PSBEcm9wem9uZS5BRERFRCAmJiBmaWxlLmFjY2VwdGVkID09PSB0cnVlKSB7XG4gICAgICAgIGZpbGUuc3RhdHVzID0gRHJvcHpvbmUuUVVFVUVEO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9Qcm9jZXNzUXVldWUpIHtcbiAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXM4LnByb2Nlc3NRdWV1ZSgpO1xuICAgICAgICAgIH0sIDApOyAvLyBEZWZlcnJpbmcgdGhlIGNhbGxcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBmaWxlIGNhbid0IGJlIHF1ZXVlZCBiZWNhdXNlIGl0IGhhcyBhbHJlYWR5IGJlZW4gcHJvY2Vzc2VkIG9yIHdhcyByZWplY3RlZC5cIik7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIl9lbnF1ZXVlVGh1bWJuYWlsXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9lbnF1ZXVlVGh1bWJuYWlsKGZpbGUpIHtcbiAgICAgIHZhciBfdGhpczkgPSB0aGlzO1xuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNyZWF0ZUltYWdlVGh1bWJuYWlscyAmJiBmaWxlLnR5cGUubWF0Y2goL2ltYWdlLiovKSAmJiBmaWxlLnNpemUgPD0gdGhpcy5vcHRpb25zLm1heFRodW1ibmFpbEZpbGVzaXplICogMTAyNCAqIDEwMjQpIHtcbiAgICAgICAgdGhpcy5fdGh1bWJuYWlsUXVldWUucHVzaChmaWxlKTtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBfdGhpczkuX3Byb2Nlc3NUaHVtYm5haWxRdWV1ZSgpO1xuICAgICAgICB9LCAwKTsgLy8gRGVmZXJyaW5nIHRoZSBjYWxsXG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIl9wcm9jZXNzVGh1bWJuYWlsUXVldWVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3Byb2Nlc3NUaHVtYm5haWxRdWV1ZSgpIHtcbiAgICAgIHZhciBfdGhpczEwID0gdGhpcztcblxuICAgICAgaWYgKHRoaXMuX3Byb2Nlc3NpbmdUaHVtYm5haWwgfHwgdGhpcy5fdGh1bWJuYWlsUXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcHJvY2Vzc2luZ1RodW1ibmFpbCA9IHRydWU7XG4gICAgICB2YXIgZmlsZSA9IHRoaXMuX3RodW1ibmFpbFF1ZXVlLnNoaWZ0KCk7XG4gICAgICByZXR1cm4gdGhpcy5jcmVhdGVUaHVtYm5haWwoZmlsZSwgdGhpcy5vcHRpb25zLnRodW1ibmFpbFdpZHRoLCB0aGlzLm9wdGlvbnMudGh1bWJuYWlsSGVpZ2h0LCB0aGlzLm9wdGlvbnMudGh1bWJuYWlsTWV0aG9kLCB0cnVlLCBmdW5jdGlvbiAoZGF0YVVybCkge1xuICAgICAgICBfdGhpczEwLmVtaXQoXCJ0aHVtYm5haWxcIiwgZmlsZSwgZGF0YVVybCk7XG4gICAgICAgIF90aGlzMTAuX3Byb2Nlc3NpbmdUaHVtYm5haWwgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIF90aGlzMTAuX3Byb2Nlc3NUaHVtYm5haWxRdWV1ZSgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQ2FuIGJlIGNhbGxlZCBieSB0aGUgdXNlciB0byByZW1vdmUgYSBmaWxlXG5cbiAgfSwge1xuICAgIGtleTogXCJyZW1vdmVGaWxlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZUZpbGUoZmlsZSkge1xuICAgICAgaWYgKGZpbGUuc3RhdHVzID09PSBEcm9wem9uZS5VUExPQURJTkcpIHtcbiAgICAgICAgdGhpcy5jYW5jZWxVcGxvYWQoZmlsZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmZpbGVzID0gd2l0aG91dCh0aGlzLmZpbGVzLCBmaWxlKTtcblxuICAgICAgdGhpcy5lbWl0KFwicmVtb3ZlZGZpbGVcIiwgZmlsZSk7XG4gICAgICBpZiAodGhpcy5maWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW1pdChcInJlc2V0XCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92ZXMgYWxsIGZpbGVzIHRoYXQgYXJlbid0IGN1cnJlbnRseSBwcm9jZXNzZWQgZnJvbSB0aGUgbGlzdFxuXG4gIH0sIHtcbiAgICBrZXk6IFwicmVtb3ZlQWxsRmlsZXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlQWxsRmlsZXMoY2FuY2VsSWZOZWNlc3NhcnkpIHtcbiAgICAgIC8vIENyZWF0ZSBhIGNvcHkgb2YgZmlsZXMgc2luY2UgcmVtb3ZlRmlsZSgpIGNoYW5nZXMgdGhlIEBmaWxlcyBhcnJheS5cbiAgICAgIGlmIChjYW5jZWxJZk5lY2Vzc2FyeSA9PSBudWxsKSB7XG4gICAgICAgIGNhbmNlbElmTmVjZXNzYXJ5ID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBfaXRlcmF0b3IxOCA9IHRoaXMuZmlsZXMuc2xpY2UoKSwgX2lzQXJyYXkxOCA9IHRydWUsIF9pMTkgPSAwLCBfaXRlcmF0b3IxOCA9IF9pc0FycmF5MTggPyBfaXRlcmF0b3IxOCA6IF9pdGVyYXRvcjE4W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgIHZhciBfcmVmMTc7XG5cbiAgICAgICAgaWYgKF9pc0FycmF5MTgpIHtcbiAgICAgICAgICBpZiAoX2kxOSA+PSBfaXRlcmF0b3IxOC5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgIF9yZWYxNyA9IF9pdGVyYXRvcjE4W19pMTkrK107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX2kxOSA9IF9pdGVyYXRvcjE4Lm5leHQoKTtcbiAgICAgICAgICBpZiAoX2kxOS5kb25lKSBicmVhaztcbiAgICAgICAgICBfcmVmMTcgPSBfaTE5LnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpbGUgPSBfcmVmMTc7XG5cbiAgICAgICAgaWYgKGZpbGUuc3RhdHVzICE9PSBEcm9wem9uZS5VUExPQURJTkcgfHwgY2FuY2VsSWZOZWNlc3NhcnkpIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUZpbGUoZmlsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIFJlc2l6ZXMgYW4gaW1hZ2UgYmVmb3JlIGl0IGdldHMgc2VudCB0byB0aGUgc2VydmVyLiBUaGlzIGZ1bmN0aW9uIGlzIHRoZSBkZWZhdWx0IGJlaGF2aW9yIG9mXG4gICAgLy8gYG9wdGlvbnMudHJhbnNmb3JtRmlsZWAgaWYgYHJlc2l6ZVdpZHRoYCBvciBgcmVzaXplSGVpZ2h0YCBhcmUgc2V0LiBUaGUgY2FsbGJhY2sgaXMgaW52b2tlZCB3aXRoXG4gICAgLy8gdGhlIHJlc2l6ZWQgYmxvYi5cblxuICB9LCB7XG4gICAga2V5OiBcInJlc2l6ZUltYWdlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlc2l6ZUltYWdlKGZpbGUsIHdpZHRoLCBoZWlnaHQsIHJlc2l6ZU1ldGhvZCwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBfdGhpczExID0gdGhpcztcblxuICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlVGh1bWJuYWlsKGZpbGUsIHdpZHRoLCBoZWlnaHQsIHJlc2l6ZU1ldGhvZCwgdHJ1ZSwgZnVuY3Rpb24gKGRhdGFVcmwsIGNhbnZhcykge1xuICAgICAgICBpZiAoY2FudmFzID09IG51bGwpIHtcbiAgICAgICAgICAvLyBUaGUgaW1hZ2UgaGFzIG5vdCBiZWVuIHJlc2l6ZWRcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZmlsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHJlc2l6ZU1pbWVUeXBlID0gX3RoaXMxMS5vcHRpb25zLnJlc2l6ZU1pbWVUeXBlO1xuXG4gICAgICAgICAgaWYgKHJlc2l6ZU1pbWVUeXBlID09IG51bGwpIHtcbiAgICAgICAgICAgIHJlc2l6ZU1pbWVUeXBlID0gZmlsZS50eXBlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgcmVzaXplZERhdGFVUkwgPSBjYW52YXMudG9EYXRhVVJMKHJlc2l6ZU1pbWVUeXBlLCBfdGhpczExLm9wdGlvbnMucmVzaXplUXVhbGl0eSk7XG4gICAgICAgICAgaWYgKHJlc2l6ZU1pbWVUeXBlID09PSAnaW1hZ2UvanBlZycgfHwgcmVzaXplTWltZVR5cGUgPT09ICdpbWFnZS9qcGcnKSB7XG4gICAgICAgICAgICAvLyBOb3cgYWRkIHRoZSBvcmlnaW5hbCBFWElGIGluZm9ybWF0aW9uXG4gICAgICAgICAgICByZXNpemVkRGF0YVVSTCA9IEV4aWZSZXN0b3JlLnJlc3RvcmUoZmlsZS5kYXRhVVJMLCByZXNpemVkRGF0YVVSTCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjYWxsYmFjayhEcm9wem9uZS5kYXRhVVJJdG9CbG9iKHJlc2l6ZWREYXRhVVJMKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjcmVhdGVUaHVtYm5haWxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlVGh1bWJuYWlsKGZpbGUsIHdpZHRoLCBoZWlnaHQsIHJlc2l6ZU1ldGhvZCwgZml4T3JpZW50YXRpb24sIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgX3RoaXMxMiA9IHRoaXM7XG5cbiAgICAgIHZhciBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblxuICAgICAgZmlsZVJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgZmlsZS5kYXRhVVJMID0gZmlsZVJlYWRlci5yZXN1bHQ7XG5cbiAgICAgICAgLy8gRG9uJ3QgYm90aGVyIGNyZWF0aW5nIGEgdGh1bWJuYWlsIGZvciBTVkcgaW1hZ2VzIHNpbmNlIHRoZXkncmUgdmVjdG9yXG4gICAgICAgIGlmIChmaWxlLnR5cGUgPT09IFwiaW1hZ2Uvc3ZnK3htbFwiKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGZpbGVSZWFkZXIucmVzdWx0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF90aGlzMTIuY3JlYXRlVGh1bWJuYWlsRnJvbVVybChmaWxlLCB3aWR0aCwgaGVpZ2h0LCByZXNpemVNZXRob2QsIGZpeE9yaWVudGF0aW9uLCBjYWxsYmFjayk7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gZmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjcmVhdGVUaHVtYm5haWxGcm9tVXJsXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZVRodW1ibmFpbEZyb21VcmwoZmlsZSwgd2lkdGgsIGhlaWdodCwgcmVzaXplTWV0aG9kLCBmaXhPcmllbnRhdGlvbiwgY2FsbGJhY2ssIGNyb3NzT3JpZ2luKSB7XG4gICAgICB2YXIgX3RoaXMxMyA9IHRoaXM7XG5cbiAgICAgIC8vIE5vdCB1c2luZyBgbmV3IEltYWdlYCBoZXJlIGJlY2F1c2Ugb2YgYSBidWcgaW4gbGF0ZXN0IENocm9tZSB2ZXJzaW9ucy5cbiAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZW55by9kcm9wem9uZS9wdWxsLzIyNlxuICAgICAgdmFyIGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG5cbiAgICAgIGlmIChjcm9zc09yaWdpbikge1xuICAgICAgICBpbWcuY3Jvc3NPcmlnaW4gPSBjcm9zc09yaWdpbjtcbiAgICAgIH1cblxuICAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGxvYWRFeGlmID0gZnVuY3Rpb24gbG9hZEV4aWYoY2FsbGJhY2spIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2soMSk7XG4gICAgICAgIH07XG4gICAgICAgIGlmICh0eXBlb2YgRVhJRiAhPT0gJ3VuZGVmaW5lZCcgJiYgRVhJRiAhPT0gbnVsbCAmJiBmaXhPcmllbnRhdGlvbikge1xuICAgICAgICAgIGxvYWRFeGlmID0gZnVuY3Rpb24gbG9hZEV4aWYoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHJldHVybiBFWElGLmdldERhdGEoaW1nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhFWElGLmdldFRhZyh0aGlzLCAnT3JpZW50YXRpb24nKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxvYWRFeGlmKGZ1bmN0aW9uIChvcmllbnRhdGlvbikge1xuICAgICAgICAgIGZpbGUud2lkdGggPSBpbWcud2lkdGg7XG4gICAgICAgICAgZmlsZS5oZWlnaHQgPSBpbWcuaGVpZ2h0O1xuXG4gICAgICAgICAgdmFyIHJlc2l6ZUluZm8gPSBfdGhpczEzLm9wdGlvbnMucmVzaXplLmNhbGwoX3RoaXMxMywgZmlsZSwgd2lkdGgsIGhlaWdodCwgcmVzaXplTWV0aG9kKTtcblxuICAgICAgICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgICAgIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gICAgICAgICAgY2FudmFzLndpZHRoID0gcmVzaXplSW5mby50cmdXaWR0aDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gcmVzaXplSW5mby50cmdIZWlnaHQ7XG5cbiAgICAgICAgICBpZiAob3JpZW50YXRpb24gPiA0KSB7XG4gICAgICAgICAgICBjYW52YXMud2lkdGggPSByZXNpemVJbmZvLnRyZ0hlaWdodDtcbiAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSByZXNpemVJbmZvLnRyZ1dpZHRoO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHN3aXRjaCAob3JpZW50YXRpb24pIHtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgLy8gaG9yaXpvbnRhbCBmbGlwXG4gICAgICAgICAgICAgIGN0eC50cmFuc2xhdGUoY2FudmFzLndpZHRoLCAwKTtcbiAgICAgICAgICAgICAgY3R4LnNjYWxlKC0xLCAxKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgIC8vIDE4MMKwIHJvdGF0ZSBsZWZ0XG4gICAgICAgICAgICAgIGN0eC50cmFuc2xhdGUoY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgY3R4LnJvdGF0ZShNYXRoLlBJKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgIC8vIHZlcnRpY2FsIGZsaXBcbiAgICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgY3R4LnNjYWxlKDEsIC0xKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgIC8vIHZlcnRpY2FsIGZsaXAgKyA5MCByb3RhdGUgcmlnaHRcbiAgICAgICAgICAgICAgY3R4LnJvdGF0ZSgwLjUgKiBNYXRoLlBJKTtcbiAgICAgICAgICAgICAgY3R4LnNjYWxlKDEsIC0xKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgIC8vIDkwwrAgcm90YXRlIHJpZ2h0XG4gICAgICAgICAgICAgIGN0eC5yb3RhdGUoMC41ICogTWF0aC5QSSk7XG4gICAgICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgLWNhbnZhcy53aWR0aCk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgICAvLyBob3Jpem9udGFsIGZsaXAgKyA5MCByb3RhdGUgcmlnaHRcbiAgICAgICAgICAgICAgY3R4LnJvdGF0ZSgwLjUgKiBNYXRoLlBJKTtcbiAgICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZShjYW52YXMuaGVpZ2h0LCAtY2FudmFzLndpZHRoKTtcbiAgICAgICAgICAgICAgY3R4LnNjYWxlKC0xLCAxKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgIC8vIDkwwrAgcm90YXRlIGxlZnRcbiAgICAgICAgICAgICAgY3R4LnJvdGF0ZSgtMC41ICogTWF0aC5QSSk7XG4gICAgICAgICAgICAgIGN0eC50cmFuc2xhdGUoLWNhbnZhcy5oZWlnaHQsIDApO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBUaGlzIGlzIGEgYnVnZml4IGZvciBpT1MnIHNjYWxpbmcgYnVnLlxuICAgICAgICAgIGRyYXdJbWFnZUlPU0ZpeChjdHgsIGltZywgcmVzaXplSW5mby5zcmNYICE9IG51bGwgPyByZXNpemVJbmZvLnNyY1ggOiAwLCByZXNpemVJbmZvLnNyY1kgIT0gbnVsbCA/IHJlc2l6ZUluZm8uc3JjWSA6IDAsIHJlc2l6ZUluZm8uc3JjV2lkdGgsIHJlc2l6ZUluZm8uc3JjSGVpZ2h0LCByZXNpemVJbmZvLnRyZ1ggIT0gbnVsbCA/IHJlc2l6ZUluZm8udHJnWCA6IDAsIHJlc2l6ZUluZm8udHJnWSAhPSBudWxsID8gcmVzaXplSW5mby50cmdZIDogMCwgcmVzaXplSW5mby50cmdXaWR0aCwgcmVzaXplSW5mby50cmdIZWlnaHQpO1xuXG4gICAgICAgICAgdmFyIHRodW1ibmFpbCA9IGNhbnZhcy50b0RhdGFVUkwoXCJpbWFnZS9wbmdcIik7XG5cbiAgICAgICAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKHRodW1ibmFpbCwgY2FudmFzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgaWYgKGNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgaW1nLm9uZXJyb3IgPSBjYWxsYmFjaztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGltZy5zcmMgPSBmaWxlLmRhdGFVUkw7XG4gICAgfVxuXG4gICAgLy8gR29lcyB0aHJvdWdoIHRoZSBxdWV1ZSBhbmQgcHJvY2Vzc2VzIGZpbGVzIGlmIHRoZXJlIGFyZW4ndCB0b28gbWFueSBhbHJlYWR5LlxuXG4gIH0sIHtcbiAgICBrZXk6IFwicHJvY2Vzc1F1ZXVlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHByb2Nlc3NRdWV1ZSgpIHtcbiAgICAgIHZhciBwYXJhbGxlbFVwbG9hZHMgPSB0aGlzLm9wdGlvbnMucGFyYWxsZWxVcGxvYWRzO1xuXG4gICAgICB2YXIgcHJvY2Vzc2luZ0xlbmd0aCA9IHRoaXMuZ2V0VXBsb2FkaW5nRmlsZXMoKS5sZW5ndGg7XG4gICAgICB2YXIgaSA9IHByb2Nlc3NpbmdMZW5ndGg7XG5cbiAgICAgIC8vIFRoZXJlIGFyZSBhbHJlYWR5IGF0IGxlYXN0IGFzIG1hbnkgZmlsZXMgdXBsb2FkaW5nIHRoYW4gc2hvdWxkIGJlXG4gICAgICBpZiAocHJvY2Vzc2luZ0xlbmd0aCA+PSBwYXJhbGxlbFVwbG9hZHMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgcXVldWVkRmlsZXMgPSB0aGlzLmdldFF1ZXVlZEZpbGVzKCk7XG5cbiAgICAgIGlmICghKHF1ZXVlZEZpbGVzLmxlbmd0aCA+IDApKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy51cGxvYWRNdWx0aXBsZSkge1xuICAgICAgICAvLyBUaGUgZmlsZXMgc2hvdWxkIGJlIHVwbG9hZGVkIGluIG9uZSByZXF1ZXN0XG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NGaWxlcyhxdWV1ZWRGaWxlcy5zbGljZSgwLCBwYXJhbGxlbFVwbG9hZHMgLSBwcm9jZXNzaW5nTGVuZ3RoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aGlsZSAoaSA8IHBhcmFsbGVsVXBsb2Fkcykge1xuICAgICAgICAgIGlmICghcXVldWVkRmlsZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSAvLyBOb3RoaW5nIGxlZnQgdG8gcHJvY2Vzc1xuICAgICAgICAgIHRoaXMucHJvY2Vzc0ZpbGUocXVldWVkRmlsZXMuc2hpZnQoKSk7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gV3JhcHBlciBmb3IgYHByb2Nlc3NGaWxlc2BcblxuICB9LCB7XG4gICAga2V5OiBcInByb2Nlc3NGaWxlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHByb2Nlc3NGaWxlKGZpbGUpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NGaWxlcyhbZmlsZV0pO1xuICAgIH1cblxuICAgIC8vIExvYWRzIHRoZSBmaWxlLCB0aGVuIGNhbGxzIGZpbmlzaGVkTG9hZGluZygpXG5cbiAgfSwge1xuICAgIGtleTogXCJwcm9jZXNzRmlsZXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcHJvY2Vzc0ZpbGVzKGZpbGVzKSB7XG4gICAgICBmb3IgKHZhciBfaXRlcmF0b3IxOSA9IGZpbGVzLCBfaXNBcnJheTE5ID0gdHJ1ZSwgX2kyMCA9IDAsIF9pdGVyYXRvcjE5ID0gX2lzQXJyYXkxOSA/IF9pdGVyYXRvcjE5IDogX2l0ZXJhdG9yMTlbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgdmFyIF9yZWYxODtcblxuICAgICAgICBpZiAoX2lzQXJyYXkxOSkge1xuICAgICAgICAgIGlmIChfaTIwID49IF9pdGVyYXRvcjE5Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgX3JlZjE4ID0gX2l0ZXJhdG9yMTlbX2kyMCsrXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfaTIwID0gX2l0ZXJhdG9yMTkubmV4dCgpO1xuICAgICAgICAgIGlmIChfaTIwLmRvbmUpIGJyZWFrO1xuICAgICAgICAgIF9yZWYxOCA9IF9pMjAudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmlsZSA9IF9yZWYxODtcblxuICAgICAgICBmaWxlLnByb2Nlc3NpbmcgPSB0cnVlOyAvLyBCYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICAgICAgICBmaWxlLnN0YXR1cyA9IERyb3B6b25lLlVQTE9BRElORztcblxuICAgICAgICB0aGlzLmVtaXQoXCJwcm9jZXNzaW5nXCIsIGZpbGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZE11bHRpcGxlKSB7XG4gICAgICAgIHRoaXMuZW1pdChcInByb2Nlc3NpbmdtdWx0aXBsZVwiLCBmaWxlcyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnVwbG9hZEZpbGVzKGZpbGVzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiX2dldEZpbGVzV2l0aFhoclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfZ2V0RmlsZXNXaXRoWGhyKHhocikge1xuICAgICAgdmFyIGZpbGVzID0gdm9pZCAwO1xuICAgICAgcmV0dXJuIGZpbGVzID0gdGhpcy5maWxlcy5maWx0ZXIoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgcmV0dXJuIGZpbGUueGhyID09PSB4aHI7XG4gICAgICB9KS5tYXAoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgcmV0dXJuIGZpbGU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBDYW5jZWxzIHRoZSBmaWxlIHVwbG9hZCBhbmQgc2V0cyB0aGUgc3RhdHVzIHRvIENBTkNFTEVEXG4gICAgLy8gKippZioqIHRoZSBmaWxlIGlzIGFjdHVhbGx5IGJlaW5nIHVwbG9hZGVkLlxuICAgIC8vIElmIGl0J3Mgc3RpbGwgaW4gdGhlIHF1ZXVlLCB0aGUgZmlsZSBpcyBiZWluZyByZW1vdmVkIGZyb20gaXQgYW5kIHRoZSBzdGF0dXNcbiAgICAvLyBzZXQgdG8gQ0FOQ0VMRUQuXG5cbiAgfSwge1xuICAgIGtleTogXCJjYW5jZWxVcGxvYWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2FuY2VsVXBsb2FkKGZpbGUpIHtcbiAgICAgIGlmIChmaWxlLnN0YXR1cyA9PT0gRHJvcHpvbmUuVVBMT0FESU5HKSB7XG4gICAgICAgIHZhciBncm91cGVkRmlsZXMgPSB0aGlzLl9nZXRGaWxlc1dpdGhYaHIoZmlsZS54aHIpO1xuICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IyMCA9IGdyb3VwZWRGaWxlcywgX2lzQXJyYXkyMCA9IHRydWUsIF9pMjEgPSAwLCBfaXRlcmF0b3IyMCA9IF9pc0FycmF5MjAgPyBfaXRlcmF0b3IyMCA6IF9pdGVyYXRvcjIwW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgdmFyIF9yZWYxOTtcblxuICAgICAgICAgIGlmIChfaXNBcnJheTIwKSB7XG4gICAgICAgICAgICBpZiAoX2kyMSA+PSBfaXRlcmF0b3IyMC5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgX3JlZjE5ID0gX2l0ZXJhdG9yMjBbX2kyMSsrXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX2kyMSA9IF9pdGVyYXRvcjIwLm5leHQoKTtcbiAgICAgICAgICAgIGlmIChfaTIxLmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgX3JlZjE5ID0gX2kyMS52YWx1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgZ3JvdXBlZEZpbGUgPSBfcmVmMTk7XG5cbiAgICAgICAgICBncm91cGVkRmlsZS5zdGF0dXMgPSBEcm9wem9uZS5DQU5DRUxFRDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZpbGUueGhyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGZpbGUueGhyLmFib3J0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMjEgPSBncm91cGVkRmlsZXMsIF9pc0FycmF5MjEgPSB0cnVlLCBfaTIyID0gMCwgX2l0ZXJhdG9yMjEgPSBfaXNBcnJheTIxID8gX2l0ZXJhdG9yMjEgOiBfaXRlcmF0b3IyMVtTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgIHZhciBfcmVmMjA7XG5cbiAgICAgICAgICBpZiAoX2lzQXJyYXkyMSkge1xuICAgICAgICAgICAgaWYgKF9pMjIgPj0gX2l0ZXJhdG9yMjEubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgIF9yZWYyMCA9IF9pdGVyYXRvcjIxW19pMjIrK107XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9pMjIgPSBfaXRlcmF0b3IyMS5uZXh0KCk7XG4gICAgICAgICAgICBpZiAoX2kyMi5kb25lKSBicmVhaztcbiAgICAgICAgICAgIF9yZWYyMCA9IF9pMjIudmFsdWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIF9ncm91cGVkRmlsZSA9IF9yZWYyMDtcblxuICAgICAgICAgIHRoaXMuZW1pdChcImNhbmNlbGVkXCIsIF9ncm91cGVkRmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy51cGxvYWRNdWx0aXBsZSkge1xuICAgICAgICAgIHRoaXMuZW1pdChcImNhbmNlbGVkbXVsdGlwbGVcIiwgZ3JvdXBlZEZpbGVzKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChmaWxlLnN0YXR1cyA9PT0gRHJvcHpvbmUuQURERUQgfHwgZmlsZS5zdGF0dXMgPT09IERyb3B6b25lLlFVRVVFRCkge1xuICAgICAgICBmaWxlLnN0YXR1cyA9IERyb3B6b25lLkNBTkNFTEVEO1xuICAgICAgICB0aGlzLmVtaXQoXCJjYW5jZWxlZFwiLCBmaWxlKTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy51cGxvYWRNdWx0aXBsZSkge1xuICAgICAgICAgIHRoaXMuZW1pdChcImNhbmNlbGVkbXVsdGlwbGVcIiwgW2ZpbGVdKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9Qcm9jZXNzUXVldWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1F1ZXVlKCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlc29sdmVPcHRpb25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVzb2x2ZU9wdGlvbihvcHRpb24pIHtcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGZvciAodmFyIF9sZW4zID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4zID4gMSA/IF9sZW4zIC0gMSA6IDApLCBfa2V5MyA9IDE7IF9rZXkzIDwgX2xlbjM7IF9rZXkzKyspIHtcbiAgICAgICAgICBhcmdzW19rZXkzIC0gMV0gPSBhcmd1bWVudHNbX2tleTNdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9wdGlvbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvcHRpb247XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInVwbG9hZEZpbGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdXBsb2FkRmlsZShmaWxlKSB7XG4gICAgICByZXR1cm4gdGhpcy51cGxvYWRGaWxlcyhbZmlsZV0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ1cGxvYWRGaWxlc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGxvYWRGaWxlcyhmaWxlcykge1xuICAgICAgdmFyIF90aGlzMTQgPSB0aGlzO1xuXG4gICAgICB0aGlzLl90cmFuc2Zvcm1GaWxlcyhmaWxlcywgZnVuY3Rpb24gKHRyYW5zZm9ybWVkRmlsZXMpIHtcbiAgICAgICAgaWYgKGZpbGVzWzBdLnVwbG9hZC5jaHVua2VkKSB7XG4gICAgICAgICAgLy8gVGhpcyBmaWxlIHNob3VsZCBiZSBzZW50IGluIGNodW5rcyFcblxuICAgICAgICAgIC8vIElmIHRoZSBjaHVua2luZyBvcHRpb24gaXMgc2V0LCB3ZSAqKmtub3cqKiB0aGF0IHRoZXJlIGNhbiBvbmx5IGJlICoqb25lKiogZmlsZSwgc2luY2VcbiAgICAgICAgICAvLyB1cGxvYWRNdWx0aXBsZSBpcyBub3QgYWxsb3dlZCB3aXRoIHRoaXMgb3B0aW9uLlxuICAgICAgICAgIHZhciBmaWxlID0gZmlsZXNbMF07XG4gICAgICAgICAgdmFyIHRyYW5zZm9ybWVkRmlsZSA9IHRyYW5zZm9ybWVkRmlsZXNbMF07XG4gICAgICAgICAgdmFyIHN0YXJ0ZWRDaHVua0NvdW50ID0gMDtcblxuICAgICAgICAgIGZpbGUudXBsb2FkLmNodW5rcyA9IFtdO1xuXG4gICAgICAgICAgdmFyIGhhbmRsZU5leHRDaHVuayA9IGZ1bmN0aW9uIGhhbmRsZU5leHRDaHVuaygpIHtcbiAgICAgICAgICAgIHZhciBjaHVua0luZGV4ID0gMDtcblxuICAgICAgICAgICAgLy8gRmluZCB0aGUgbmV4dCBpdGVtIGluIGZpbGUudXBsb2FkLmNodW5rcyB0aGF0IGlzIG5vdCBkZWZpbmVkIHlldC5cbiAgICAgICAgICAgIHdoaWxlIChmaWxlLnVwbG9hZC5jaHVua3NbY2h1bmtJbmRleF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBjaHVua0luZGV4Kys7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRoaXMgbWVhbnMsIHRoYXQgYWxsIGNodW5rcyBoYXZlIGFscmVhZHkgYmVlbiBzdGFydGVkLlxuICAgICAgICAgICAgaWYgKGNodW5rSW5kZXggPj0gZmlsZS51cGxvYWQudG90YWxDaHVua0NvdW50KSByZXR1cm47XG5cbiAgICAgICAgICAgIHN0YXJ0ZWRDaHVua0NvdW50Kys7XG5cbiAgICAgICAgICAgIHZhciBzdGFydCA9IGNodW5rSW5kZXggKiBfdGhpczE0Lm9wdGlvbnMuY2h1bmtTaXplO1xuICAgICAgICAgICAgdmFyIGVuZCA9IE1hdGgubWluKHN0YXJ0ICsgX3RoaXMxNC5vcHRpb25zLmNodW5rU2l6ZSwgZmlsZS5zaXplKTtcblxuICAgICAgICAgICAgdmFyIGRhdGFCbG9jayA9IHtcbiAgICAgICAgICAgICAgbmFtZTogX3RoaXMxNC5fZ2V0UGFyYW1OYW1lKDApLFxuICAgICAgICAgICAgICBkYXRhOiB0cmFuc2Zvcm1lZEZpbGUud2Via2l0U2xpY2UgPyB0cmFuc2Zvcm1lZEZpbGUud2Via2l0U2xpY2Uoc3RhcnQsIGVuZCkgOiB0cmFuc2Zvcm1lZEZpbGUuc2xpY2Uoc3RhcnQsIGVuZCksXG4gICAgICAgICAgICAgIGZpbGVuYW1lOiBmaWxlLnVwbG9hZC5maWxlbmFtZSxcbiAgICAgICAgICAgICAgY2h1bmtJbmRleDogY2h1bmtJbmRleFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZmlsZS51cGxvYWQuY2h1bmtzW2NodW5rSW5kZXhdID0ge1xuICAgICAgICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICAgICAgICBpbmRleDogY2h1bmtJbmRleCxcbiAgICAgICAgICAgICAgZGF0YUJsb2NrOiBkYXRhQmxvY2ssIC8vIEluIGNhc2Ugd2Ugd2FudCB0byByZXRyeS5cbiAgICAgICAgICAgICAgc3RhdHVzOiBEcm9wem9uZS5VUExPQURJTkcsXG4gICAgICAgICAgICAgIHByb2dyZXNzOiAwLFxuICAgICAgICAgICAgICByZXRyaWVzOiAwIC8vIFRoZSBudW1iZXIgb2YgdGltZXMgdGhpcyBibG9jayBoYXMgYmVlbiByZXRyaWVkLlxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX3RoaXMxNC5fdXBsb2FkRGF0YShmaWxlcywgW2RhdGFCbG9ja10pO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBmaWxlLnVwbG9hZC5maW5pc2hlZENodW5rVXBsb2FkID0gZnVuY3Rpb24gKGNodW5rKSB7XG4gICAgICAgICAgICB2YXIgYWxsRmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgY2h1bmsuc3RhdHVzID0gRHJvcHpvbmUuU1VDQ0VTUztcblxuICAgICAgICAgICAgLy8gQ2xlYXIgdGhlIGRhdGEgZnJvbSB0aGUgY2h1bmtcbiAgICAgICAgICAgIGNodW5rLmRhdGFCbG9jayA9IG51bGw7XG4gICAgICAgICAgICAvLyBMZWF2aW5nIHRoaXMgcmVmZXJlbmNlIHRvIHhociBpbnRhY3QgaGVyZSB3aWxsIGNhdXNlIG1lbW9yeSBsZWFrcyBpbiBzb21lIGJyb3dzZXJzXG4gICAgICAgICAgICBjaHVuay54aHIgPSBudWxsO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbGUudXBsb2FkLnRvdGFsQ2h1bmtDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgIGlmIChmaWxlLnVwbG9hZC5jaHVua3NbaV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBoYW5kbGVOZXh0Q2h1bmsoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoZmlsZS51cGxvYWQuY2h1bmtzW2ldLnN0YXR1cyAhPT0gRHJvcHpvbmUuU1VDQ0VTUykge1xuICAgICAgICAgICAgICAgIGFsbEZpbmlzaGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFsbEZpbmlzaGVkKSB7XG4gICAgICAgICAgICAgIF90aGlzMTQub3B0aW9ucy5jaHVua3NVcGxvYWRlZChmaWxlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMxNC5fZmluaXNoZWQoZmlsZXMsICcnLCBudWxsKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGlmIChfdGhpczE0Lm9wdGlvbnMucGFyYWxsZWxDaHVua1VwbG9hZHMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsZS51cGxvYWQudG90YWxDaHVua0NvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgaGFuZGxlTmV4dENodW5rKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhhbmRsZU5leHRDaHVuaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgZGF0YUJsb2NrcyA9IFtdO1xuICAgICAgICAgIGZvciAodmFyIF9pMjMgPSAwOyBfaTIzIDwgZmlsZXMubGVuZ3RoOyBfaTIzKyspIHtcbiAgICAgICAgICAgIGRhdGFCbG9ja3NbX2kyM10gPSB7XG4gICAgICAgICAgICAgIG5hbWU6IF90aGlzMTQuX2dldFBhcmFtTmFtZShfaTIzKSxcbiAgICAgICAgICAgICAgZGF0YTogdHJhbnNmb3JtZWRGaWxlc1tfaTIzXSxcbiAgICAgICAgICAgICAgZmlsZW5hbWU6IGZpbGVzW19pMjNdLnVwbG9hZC5maWxlbmFtZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgX3RoaXMxNC5fdXBsb2FkRGF0YShmaWxlcywgZGF0YUJsb2Nrcyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vLyBSZXR1cm5zIHRoZSByaWdodCBjaHVuayBmb3IgZ2l2ZW4gZmlsZSBhbmQgeGhyXG5cbiAgfSwge1xuICAgIGtleTogXCJfZ2V0Q2h1bmtcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2dldENodW5rKGZpbGUsIHhocikge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWxlLnVwbG9hZC50b3RhbENodW5rQ291bnQ7IGkrKykge1xuICAgICAgICBpZiAoZmlsZS51cGxvYWQuY2h1bmtzW2ldICE9PSB1bmRlZmluZWQgJiYgZmlsZS51cGxvYWQuY2h1bmtzW2ldLnhociA9PT0geGhyKSB7XG4gICAgICAgICAgcmV0dXJuIGZpbGUudXBsb2FkLmNodW5rc1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gYWN0dWFsbHkgdXBsb2FkcyB0aGUgZmlsZShzKSB0byB0aGUgc2VydmVyLlxuICAgIC8vIElmIGRhdGFCbG9ja3MgY29udGFpbnMgdGhlIGFjdHVhbCBkYXRhIHRvIHVwbG9hZCAobWVhbmluZywgdGhhdCB0aGlzIGNvdWxkIGVpdGhlciBiZSB0cmFuc2Zvcm1lZFxuICAgIC8vIGZpbGVzLCBvciBpbmRpdmlkdWFsIGNodW5rcyBmb3IgY2h1bmtlZCB1cGxvYWQpLlxuXG4gIH0sIHtcbiAgICBrZXk6IFwiX3VwbG9hZERhdGFcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3VwbG9hZERhdGEoZmlsZXMsIGRhdGFCbG9ja3MpIHtcbiAgICAgIHZhciBfdGhpczE1ID0gdGhpcztcblxuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICAvLyBQdXQgdGhlIHhociBvYmplY3QgaW4gdGhlIGZpbGUgb2JqZWN0cyB0byBiZSBhYmxlIHRvIHJlZmVyZW5jZSBpdCBsYXRlci5cbiAgICAgIGZvciAodmFyIF9pdGVyYXRvcjIyID0gZmlsZXMsIF9pc0FycmF5MjIgPSB0cnVlLCBfaTI0ID0gMCwgX2l0ZXJhdG9yMjIgPSBfaXNBcnJheTIyID8gX2l0ZXJhdG9yMjIgOiBfaXRlcmF0b3IyMltTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICB2YXIgX3JlZjIxO1xuXG4gICAgICAgIGlmIChfaXNBcnJheTIyKSB7XG4gICAgICAgICAgaWYgKF9pMjQgPj0gX2l0ZXJhdG9yMjIubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICBfcmVmMjEgPSBfaXRlcmF0b3IyMltfaTI0KytdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9pMjQgPSBfaXRlcmF0b3IyMi5uZXh0KCk7XG4gICAgICAgICAgaWYgKF9pMjQuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgX3JlZjIxID0gX2kyNC52YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmaWxlID0gX3JlZjIxO1xuXG4gICAgICAgIGZpbGUueGhyID0geGhyO1xuICAgICAgfVxuICAgICAgaWYgKGZpbGVzWzBdLnVwbG9hZC5jaHVua2VkKSB7XG4gICAgICAgIC8vIFB1dCB0aGUgeGhyIG9iamVjdCBpbiB0aGUgcmlnaHQgY2h1bmsgb2JqZWN0LCBzbyBpdCBjYW4gYmUgYXNzb2NpYXRlZCBsYXRlciwgYW5kIGZvdW5kIHdpdGggX2dldENodW5rXG4gICAgICAgIGZpbGVzWzBdLnVwbG9hZC5jaHVua3NbZGF0YUJsb2Nrc1swXS5jaHVua0luZGV4XS54aHIgPSB4aHI7XG4gICAgICB9XG5cbiAgICAgIHZhciBtZXRob2QgPSB0aGlzLnJlc29sdmVPcHRpb24odGhpcy5vcHRpb25zLm1ldGhvZCwgZmlsZXMpO1xuICAgICAgdmFyIHVybCA9IHRoaXMucmVzb2x2ZU9wdGlvbih0aGlzLm9wdGlvbnMudXJsLCBmaWxlcyk7XG4gICAgICB4aHIub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7XG5cbiAgICAgIC8vIFNldHRpbmcgdGhlIHRpbWVvdXQgYWZ0ZXIgb3BlbiBiZWNhdXNlIG9mIElFMTEgaXNzdWU6IGh0dHBzOi8vZ2l0bGFiLmNvbS9tZW5vL2Ryb3B6b25lL2lzc3Vlcy84XG4gICAgICB4aHIudGltZW91dCA9IHRoaXMucmVzb2x2ZU9wdGlvbih0aGlzLm9wdGlvbnMudGltZW91dCwgZmlsZXMpO1xuXG4gICAgICAvLyBIYXMgdG8gYmUgYWZ0ZXIgYC5vcGVuKClgLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2VueW8vZHJvcHpvbmUvaXNzdWVzLzE3OVxuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9ICEhdGhpcy5vcHRpb25zLndpdGhDcmVkZW50aWFscztcblxuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIF90aGlzMTUuX2ZpbmlzaGVkVXBsb2FkaW5nKGZpbGVzLCB4aHIsIGUpO1xuICAgICAgfTtcblxuICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aGlzMTUuX2hhbmRsZVVwbG9hZEVycm9yKGZpbGVzLCB4aHIpO1xuICAgICAgfTtcblxuICAgICAgLy8gU29tZSBicm93c2VycyBkbyBub3QgaGF2ZSB0aGUgLnVwbG9hZCBwcm9wZXJ0eVxuICAgICAgdmFyIHByb2dyZXNzT2JqID0geGhyLnVwbG9hZCAhPSBudWxsID8geGhyLnVwbG9hZCA6IHhocjtcbiAgICAgIHByb2dyZXNzT2JqLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICByZXR1cm4gX3RoaXMxNS5fdXBkYXRlRmlsZXNVcGxvYWRQcm9ncmVzcyhmaWxlcywgeGhyLCBlKTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBoZWFkZXJzID0ge1xuICAgICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgXCJDYWNoZS1Db250cm9sXCI6IFwibm8tY2FjaGVcIixcbiAgICAgICAgXCJYLVJlcXVlc3RlZC1XaXRoXCI6IFwiWE1MSHR0cFJlcXVlc3RcIlxuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICAgIERyb3B6b25lLmV4dGVuZChoZWFkZXJzLCB0aGlzLm9wdGlvbnMuaGVhZGVycyk7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGhlYWRlck5hbWUgaW4gaGVhZGVycykge1xuICAgICAgICB2YXIgaGVhZGVyVmFsdWUgPSBoZWFkZXJzW2hlYWRlck5hbWVdO1xuICAgICAgICBpZiAoaGVhZGVyVmFsdWUpIHtcbiAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXJOYW1lLCBoZWFkZXJWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cbiAgICAgIC8vIEFkZGluZyBhbGwgQG9wdGlvbnMgcGFyYW1ldGVyc1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYXJhbXMpIHtcbiAgICAgICAgdmFyIGFkZGl0aW9uYWxQYXJhbXMgPSB0aGlzLm9wdGlvbnMucGFyYW1zO1xuICAgICAgICBpZiAodHlwZW9mIGFkZGl0aW9uYWxQYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBhZGRpdGlvbmFsUGFyYW1zID0gYWRkaXRpb25hbFBhcmFtcy5jYWxsKHRoaXMsIGZpbGVzLCB4aHIsIGZpbGVzWzBdLnVwbG9hZC5jaHVua2VkID8gdGhpcy5fZ2V0Q2h1bmsoZmlsZXNbMF0sIHhocikgOiBudWxsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBhZGRpdGlvbmFsUGFyYW1zKSB7XG4gICAgICAgICAgdmFyIHZhbHVlID0gYWRkaXRpb25hbFBhcmFtc1trZXldO1xuICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBMZXQgdGhlIHVzZXIgYWRkIGFkZGl0aW9uYWwgZGF0YSBpZiBuZWNlc3NhcnlcbiAgICAgIGZvciAodmFyIF9pdGVyYXRvcjIzID0gZmlsZXMsIF9pc0FycmF5MjMgPSB0cnVlLCBfaTI1ID0gMCwgX2l0ZXJhdG9yMjMgPSBfaXNBcnJheTIzID8gX2l0ZXJhdG9yMjMgOiBfaXRlcmF0b3IyM1tTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICB2YXIgX3JlZjIyO1xuXG4gICAgICAgIGlmIChfaXNBcnJheTIzKSB7XG4gICAgICAgICAgaWYgKF9pMjUgPj0gX2l0ZXJhdG9yMjMubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICBfcmVmMjIgPSBfaXRlcmF0b3IyM1tfaTI1KytdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9pMjUgPSBfaXRlcmF0b3IyMy5uZXh0KCk7XG4gICAgICAgICAgaWYgKF9pMjUuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgX3JlZjIyID0gX2kyNS52YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBfZmlsZSA9IF9yZWYyMjtcblxuICAgICAgICB0aGlzLmVtaXQoXCJzZW5kaW5nXCIsIF9maWxlLCB4aHIsIGZvcm1EYXRhKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudXBsb2FkTXVsdGlwbGUpIHtcbiAgICAgICAgdGhpcy5lbWl0KFwic2VuZGluZ211bHRpcGxlXCIsIGZpbGVzLCB4aHIsIGZvcm1EYXRhKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fYWRkRm9ybUVsZW1lbnREYXRhKGZvcm1EYXRhKTtcblxuICAgICAgLy8gRmluYWxseSBhZGQgdGhlIGZpbGVzXG4gICAgICAvLyBIYXMgdG8gYmUgbGFzdCBiZWNhdXNlIHNvbWUgc2VydmVycyAoZWc6IFMzKSBleHBlY3QgdGhlIGZpbGUgdG8gYmUgdGhlIGxhc3QgcGFyYW1ldGVyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGRhdGFCbG9jayA9IGRhdGFCbG9ja3NbaV07XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChkYXRhQmxvY2submFtZSwgZGF0YUJsb2NrLmRhdGEsIGRhdGFCbG9jay5maWxlbmFtZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3VibWl0UmVxdWVzdCh4aHIsIGZvcm1EYXRhLCBmaWxlcyk7XG4gICAgfVxuXG4gICAgLy8gVHJhbnNmb3JtcyBhbGwgZmlsZXMgd2l0aCB0aGlzLm9wdGlvbnMudHJhbnNmb3JtRmlsZSBhbmQgaW52b2tlcyBkb25lIHdpdGggdGhlIHRyYW5zZm9ybWVkIGZpbGVzIHdoZW4gZG9uZS5cblxuICB9LCB7XG4gICAga2V5OiBcIl90cmFuc2Zvcm1GaWxlc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfdHJhbnNmb3JtRmlsZXMoZmlsZXMsIGRvbmUpIHtcbiAgICAgIHZhciBfdGhpczE2ID0gdGhpcztcblxuICAgICAgdmFyIHRyYW5zZm9ybWVkRmlsZXMgPSBbXTtcbiAgICAgIC8vIENsdW1zeSB3YXkgb2YgaGFuZGxpbmcgYXN5bmNocm9ub3VzIGNhbGxzLCB1bnRpbCBJIGdldCB0byBhZGQgYSBwcm9wZXIgRnV0dXJlIGxpYnJhcnkuXG4gICAgICB2YXIgZG9uZUNvdW50ZXIgPSAwO1xuXG4gICAgICB2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcChpKSB7XG4gICAgICAgIF90aGlzMTYub3B0aW9ucy50cmFuc2Zvcm1GaWxlLmNhbGwoX3RoaXMxNiwgZmlsZXNbaV0sIGZ1bmN0aW9uICh0cmFuc2Zvcm1lZEZpbGUpIHtcbiAgICAgICAgICB0cmFuc2Zvcm1lZEZpbGVzW2ldID0gdHJhbnNmb3JtZWRGaWxlO1xuICAgICAgICAgIGlmICgrK2RvbmVDb3VudGVyID09PSBmaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGRvbmUodHJhbnNmb3JtZWRGaWxlcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgX2xvb3AoaSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVGFrZXMgY2FyZSBvZiBhZGRpbmcgb3RoZXIgaW5wdXQgZWxlbWVudHMgb2YgdGhlIGZvcm0gdG8gdGhlIEFKQVggcmVxdWVzdFxuXG4gIH0sIHtcbiAgICBrZXk6IFwiX2FkZEZvcm1FbGVtZW50RGF0YVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfYWRkRm9ybUVsZW1lbnREYXRhKGZvcm1EYXRhKSB7XG4gICAgICAvLyBUYWtlIGNhcmUgb2Ygb3RoZXIgaW5wdXQgZWxlbWVudHNcbiAgICAgIGlmICh0aGlzLmVsZW1lbnQudGFnTmFtZSA9PT0gXCJGT1JNXCIpIHtcbiAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMjQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0LCB0ZXh0YXJlYSwgc2VsZWN0LCBidXR0b25cIiksIF9pc0FycmF5MjQgPSB0cnVlLCBfaTI2ID0gMCwgX2l0ZXJhdG9yMjQgPSBfaXNBcnJheTI0ID8gX2l0ZXJhdG9yMjQgOiBfaXRlcmF0b3IyNFtTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgIHZhciBfcmVmMjM7XG5cbiAgICAgICAgICBpZiAoX2lzQXJyYXkyNCkge1xuICAgICAgICAgICAgaWYgKF9pMjYgPj0gX2l0ZXJhdG9yMjQubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgIF9yZWYyMyA9IF9pdGVyYXRvcjI0W19pMjYrK107XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9pMjYgPSBfaXRlcmF0b3IyNC5uZXh0KCk7XG4gICAgICAgICAgICBpZiAoX2kyNi5kb25lKSBicmVhaztcbiAgICAgICAgICAgIF9yZWYyMyA9IF9pMjYudmFsdWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGlucHV0ID0gX3JlZjIzO1xuXG4gICAgICAgICAgdmFyIGlucHV0TmFtZSA9IGlucHV0LmdldEF0dHJpYnV0ZShcIm5hbWVcIik7XG4gICAgICAgICAgdmFyIGlucHV0VHlwZSA9IGlucHV0LmdldEF0dHJpYnV0ZShcInR5cGVcIik7XG4gICAgICAgICAgaWYgKGlucHV0VHlwZSkgaW5wdXRUeXBlID0gaW5wdXRUeXBlLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAvLyBJZiB0aGUgaW5wdXQgZG9lc24ndCBoYXZlIGEgbmFtZSwgd2UgY2FuJ3QgdXNlIGl0LlxuICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXROYW1lID09PSAndW5kZWZpbmVkJyB8fCBpbnB1dE5hbWUgPT09IG51bGwpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgaWYgKGlucHV0LnRhZ05hbWUgPT09IFwiU0VMRUNUXCIgJiYgaW5wdXQuaGFzQXR0cmlidXRlKFwibXVsdGlwbGVcIikpIHtcbiAgICAgICAgICAgIC8vIFBvc3NpYmx5IG11bHRpcGxlIHZhbHVlc1xuICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMjUgPSBpbnB1dC5vcHRpb25zLCBfaXNBcnJheTI1ID0gdHJ1ZSwgX2kyNyA9IDAsIF9pdGVyYXRvcjI1ID0gX2lzQXJyYXkyNSA/IF9pdGVyYXRvcjI1IDogX2l0ZXJhdG9yMjVbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICAgICAgdmFyIF9yZWYyNDtcblxuICAgICAgICAgICAgICBpZiAoX2lzQXJyYXkyNSkge1xuICAgICAgICAgICAgICAgIGlmIChfaTI3ID49IF9pdGVyYXRvcjI1Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgX3JlZjI0ID0gX2l0ZXJhdG9yMjVbX2kyNysrXTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfaTI3ID0gX2l0ZXJhdG9yMjUubmV4dCgpO1xuICAgICAgICAgICAgICAgIGlmIChfaTI3LmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgICAgIF9yZWYyNCA9IF9pMjcudmFsdWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YXIgb3B0aW9uID0gX3JlZjI0O1xuXG4gICAgICAgICAgICAgIGlmIChvcHRpb24uc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoaW5wdXROYW1lLCBvcHRpb24udmFsdWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICghaW5wdXRUeXBlIHx8IGlucHV0VHlwZSAhPT0gXCJjaGVja2JveFwiICYmIGlucHV0VHlwZSAhPT0gXCJyYWRpb1wiIHx8IGlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChpbnB1dE5hbWUsIGlucHV0LnZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJbnZva2VkIHdoZW4gdGhlcmUgaXMgbmV3IHByb2dyZXNzIGluZm9ybWF0aW9uIGFib3V0IGdpdmVuIGZpbGVzLlxuICAgIC8vIElmIGUgaXMgbm90IHByb3ZpZGVkLCBpdCBpcyBhc3N1bWVkIHRoYXQgdGhlIHVwbG9hZCBpcyBmaW5pc2hlZC5cblxuICB9LCB7XG4gICAga2V5OiBcIl91cGRhdGVGaWxlc1VwbG9hZFByb2dyZXNzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF91cGRhdGVGaWxlc1VwbG9hZFByb2dyZXNzKGZpbGVzLCB4aHIsIGUpIHtcbiAgICAgIHZhciBwcm9ncmVzcyA9IHZvaWQgMDtcbiAgICAgIGlmICh0eXBlb2YgZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcHJvZ3Jlc3MgPSAxMDAgKiBlLmxvYWRlZCAvIGUudG90YWw7XG5cbiAgICAgICAgaWYgKGZpbGVzWzBdLnVwbG9hZC5jaHVua2VkKSB7XG4gICAgICAgICAgdmFyIGZpbGUgPSBmaWxlc1swXTtcbiAgICAgICAgICAvLyBTaW5jZSB0aGlzIGlzIGEgY2h1bmtlZCB1cGxvYWQsIHdlIG5lZWQgdG8gdXBkYXRlIHRoZSBhcHByb3ByaWF0ZSBjaHVuayBwcm9ncmVzcy5cbiAgICAgICAgICB2YXIgY2h1bmsgPSB0aGlzLl9nZXRDaHVuayhmaWxlLCB4aHIpO1xuICAgICAgICAgIGNodW5rLnByb2dyZXNzID0gcHJvZ3Jlc3M7XG4gICAgICAgICAgY2h1bmsudG90YWwgPSBlLnRvdGFsO1xuICAgICAgICAgIGNodW5rLmJ5dGVzU2VudCA9IGUubG9hZGVkO1xuICAgICAgICAgIHZhciBmaWxlUHJvZ3Jlc3MgPSAwLFxuICAgICAgICAgICAgICBmaWxlVG90YWwgPSB2b2lkIDAsXG4gICAgICAgICAgICAgIGZpbGVCeXRlc1NlbnQgPSB2b2lkIDA7XG4gICAgICAgICAgZmlsZS51cGxvYWQucHJvZ3Jlc3MgPSAwO1xuICAgICAgICAgIGZpbGUudXBsb2FkLnRvdGFsID0gMDtcbiAgICAgICAgICBmaWxlLnVwbG9hZC5ieXRlc1NlbnQgPSAwO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsZS51cGxvYWQudG90YWxDaHVua0NvdW50OyBpKyspIHtcbiAgICAgICAgICAgIGlmIChmaWxlLnVwbG9hZC5jaHVua3NbaV0gIT09IHVuZGVmaW5lZCAmJiBmaWxlLnVwbG9hZC5jaHVua3NbaV0ucHJvZ3Jlc3MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBmaWxlLnVwbG9hZC5wcm9ncmVzcyArPSBmaWxlLnVwbG9hZC5jaHVua3NbaV0ucHJvZ3Jlc3M7XG4gICAgICAgICAgICAgIGZpbGUudXBsb2FkLnRvdGFsICs9IGZpbGUudXBsb2FkLmNodW5rc1tpXS50b3RhbDtcbiAgICAgICAgICAgICAgZmlsZS51cGxvYWQuYnl0ZXNTZW50ICs9IGZpbGUudXBsb2FkLmNodW5rc1tpXS5ieXRlc1NlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGZpbGUudXBsb2FkLnByb2dyZXNzID0gZmlsZS51cGxvYWQucHJvZ3Jlc3MgLyBmaWxlLnVwbG9hZC50b3RhbENodW5rQ291bnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMjYgPSBmaWxlcywgX2lzQXJyYXkyNiA9IHRydWUsIF9pMjggPSAwLCBfaXRlcmF0b3IyNiA9IF9pc0FycmF5MjYgPyBfaXRlcmF0b3IyNiA6IF9pdGVyYXRvcjI2W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgICB2YXIgX3JlZjI1O1xuXG4gICAgICAgICAgICBpZiAoX2lzQXJyYXkyNikge1xuICAgICAgICAgICAgICBpZiAoX2kyOCA+PSBfaXRlcmF0b3IyNi5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgICBfcmVmMjUgPSBfaXRlcmF0b3IyNltfaTI4KytdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX2kyOCA9IF9pdGVyYXRvcjI2Lm5leHQoKTtcbiAgICAgICAgICAgICAgaWYgKF9pMjguZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICAgIF9yZWYyNSA9IF9pMjgudmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBfZmlsZTIgPSBfcmVmMjU7XG5cbiAgICAgICAgICAgIF9maWxlMi51cGxvYWQucHJvZ3Jlc3MgPSBwcm9ncmVzcztcbiAgICAgICAgICAgIF9maWxlMi51cGxvYWQudG90YWwgPSBlLnRvdGFsO1xuICAgICAgICAgICAgX2ZpbGUyLnVwbG9hZC5ieXRlc1NlbnQgPSBlLmxvYWRlZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMjcgPSBmaWxlcywgX2lzQXJyYXkyNyA9IHRydWUsIF9pMjkgPSAwLCBfaXRlcmF0b3IyNyA9IF9pc0FycmF5MjcgPyBfaXRlcmF0b3IyNyA6IF9pdGVyYXRvcjI3W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgdmFyIF9yZWYyNjtcblxuICAgICAgICAgIGlmIChfaXNBcnJheTI3KSB7XG4gICAgICAgICAgICBpZiAoX2kyOSA+PSBfaXRlcmF0b3IyNy5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgX3JlZjI2ID0gX2l0ZXJhdG9yMjdbX2kyOSsrXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX2kyOSA9IF9pdGVyYXRvcjI3Lm5leHQoKTtcbiAgICAgICAgICAgIGlmIChfaTI5LmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgX3JlZjI2ID0gX2kyOS52YWx1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgX2ZpbGUzID0gX3JlZjI2O1xuXG4gICAgICAgICAgdGhpcy5lbWl0KFwidXBsb2FkcHJvZ3Jlc3NcIiwgX2ZpbGUzLCBfZmlsZTMudXBsb2FkLnByb2dyZXNzLCBfZmlsZTMudXBsb2FkLmJ5dGVzU2VudCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIENhbGxlZCB3aGVuIHRoZSBmaWxlIGZpbmlzaGVkIHVwbG9hZGluZ1xuXG4gICAgICAgIHZhciBhbGxGaWxlc0ZpbmlzaGVkID0gdHJ1ZTtcblxuICAgICAgICBwcm9ncmVzcyA9IDEwMDtcblxuICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IyOCA9IGZpbGVzLCBfaXNBcnJheTI4ID0gdHJ1ZSwgX2kzMCA9IDAsIF9pdGVyYXRvcjI4ID0gX2lzQXJyYXkyOCA/IF9pdGVyYXRvcjI4IDogX2l0ZXJhdG9yMjhbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICB2YXIgX3JlZjI3O1xuXG4gICAgICAgICAgaWYgKF9pc0FycmF5MjgpIHtcbiAgICAgICAgICAgIGlmIChfaTMwID49IF9pdGVyYXRvcjI4Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMjcgPSBfaXRlcmF0b3IyOFtfaTMwKytdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfaTMwID0gX2l0ZXJhdG9yMjgubmV4dCgpO1xuICAgICAgICAgICAgaWYgKF9pMzAuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMjcgPSBfaTMwLnZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBfZmlsZTQgPSBfcmVmMjc7XG5cbiAgICAgICAgICBpZiAoX2ZpbGU0LnVwbG9hZC5wcm9ncmVzcyAhPT0gMTAwIHx8IF9maWxlNC51cGxvYWQuYnl0ZXNTZW50ICE9PSBfZmlsZTQudXBsb2FkLnRvdGFsKSB7XG4gICAgICAgICAgICBhbGxGaWxlc0ZpbmlzaGVkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIF9maWxlNC51cGxvYWQucHJvZ3Jlc3MgPSBwcm9ncmVzcztcbiAgICAgICAgICBfZmlsZTQudXBsb2FkLmJ5dGVzU2VudCA9IF9maWxlNC51cGxvYWQudG90YWw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOb3RoaW5nIHRvIGRvLCBhbGwgZmlsZXMgYWxyZWFkeSBhdCAxMDAlXG4gICAgICAgIGlmIChhbGxGaWxlc0ZpbmlzaGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMjkgPSBmaWxlcywgX2lzQXJyYXkyOSA9IHRydWUsIF9pMzEgPSAwLCBfaXRlcmF0b3IyOSA9IF9pc0FycmF5MjkgPyBfaXRlcmF0b3IyOSA6IF9pdGVyYXRvcjI5W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgdmFyIF9yZWYyODtcblxuICAgICAgICAgIGlmIChfaXNBcnJheTI5KSB7XG4gICAgICAgICAgICBpZiAoX2kzMSA+PSBfaXRlcmF0b3IyOS5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgX3JlZjI4ID0gX2l0ZXJhdG9yMjlbX2kzMSsrXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX2kzMSA9IF9pdGVyYXRvcjI5Lm5leHQoKTtcbiAgICAgICAgICAgIGlmIChfaTMxLmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgX3JlZjI4ID0gX2kzMS52YWx1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgX2ZpbGU1ID0gX3JlZjI4O1xuXG4gICAgICAgICAgdGhpcy5lbWl0KFwidXBsb2FkcHJvZ3Jlc3NcIiwgX2ZpbGU1LCBwcm9ncmVzcywgX2ZpbGU1LnVwbG9hZC5ieXRlc1NlbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIl9maW5pc2hlZFVwbG9hZGluZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfZmluaXNoZWRVcGxvYWRpbmcoZmlsZXMsIHhociwgZSkge1xuICAgICAgdmFyIHJlc3BvbnNlID0gdm9pZCAwO1xuXG4gICAgICBpZiAoZmlsZXNbMF0uc3RhdHVzID09PSBEcm9wem9uZS5DQU5DRUxFRCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh4aHIucmVzcG9uc2VUeXBlICE9PSAnYXJyYXlidWZmZXInICYmIHhoci5yZXNwb25zZVR5cGUgIT09ICdibG9iJykge1xuICAgICAgICByZXNwb25zZSA9IHhoci5yZXNwb25zZVRleHQ7XG5cbiAgICAgICAgaWYgKHhoci5nZXRSZXNwb25zZUhlYWRlcihcImNvbnRlbnQtdHlwZVwiKSAmJiB+eGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiY29udGVudC10eXBlXCIpLmluZGV4T2YoXCJhcHBsaWNhdGlvbi9qc29uXCIpKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICAgIHJlc3BvbnNlID0gXCJJbnZhbGlkIEpTT04gcmVzcG9uc2UgZnJvbSBzZXJ2ZXIuXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3VwZGF0ZUZpbGVzVXBsb2FkUHJvZ3Jlc3MoZmlsZXMpO1xuXG4gICAgICBpZiAoISgyMDAgPD0geGhyLnN0YXR1cyAmJiB4aHIuc3RhdHVzIDwgMzAwKSkge1xuICAgICAgICB0aGlzLl9oYW5kbGVVcGxvYWRFcnJvcihmaWxlcywgeGhyLCByZXNwb25zZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZmlsZXNbMF0udXBsb2FkLmNodW5rZWQpIHtcbiAgICAgICAgICBmaWxlc1swXS51cGxvYWQuZmluaXNoZWRDaHVua1VwbG9hZCh0aGlzLl9nZXRDaHVuayhmaWxlc1swXSwgeGhyKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fZmluaXNoZWQoZmlsZXMsIHJlc3BvbnNlLCBlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJfaGFuZGxlVXBsb2FkRXJyb3JcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2hhbmRsZVVwbG9hZEVycm9yKGZpbGVzLCB4aHIsIHJlc3BvbnNlKSB7XG4gICAgICBpZiAoZmlsZXNbMF0uc3RhdHVzID09PSBEcm9wem9uZS5DQU5DRUxFRCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChmaWxlc1swXS51cGxvYWQuY2h1bmtlZCAmJiB0aGlzLm9wdGlvbnMucmV0cnlDaHVua3MpIHtcbiAgICAgICAgdmFyIGNodW5rID0gdGhpcy5fZ2V0Q2h1bmsoZmlsZXNbMF0sIHhocik7XG4gICAgICAgIGlmIChjaHVuay5yZXRyaWVzKysgPCB0aGlzLm9wdGlvbnMucmV0cnlDaHVua3NMaW1pdCkge1xuICAgICAgICAgIHRoaXMuX3VwbG9hZERhdGEoZmlsZXMsIFtjaHVuay5kYXRhQmxvY2tdKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdSZXRyaWVkIHRoaXMgY2h1bmsgdG9vIG9mdGVuLiBHaXZpbmcgdXAuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMzAgPSBmaWxlcywgX2lzQXJyYXkzMCA9IHRydWUsIF9pMzIgPSAwLCBfaXRlcmF0b3IzMCA9IF9pc0FycmF5MzAgPyBfaXRlcmF0b3IzMCA6IF9pdGVyYXRvcjMwW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgIHZhciBfcmVmMjk7XG5cbiAgICAgICAgaWYgKF9pc0FycmF5MzApIHtcbiAgICAgICAgICBpZiAoX2kzMiA+PSBfaXRlcmF0b3IzMC5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgIF9yZWYyOSA9IF9pdGVyYXRvcjMwW19pMzIrK107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX2kzMiA9IF9pdGVyYXRvcjMwLm5leHQoKTtcbiAgICAgICAgICBpZiAoX2kzMi5kb25lKSBicmVhaztcbiAgICAgICAgICBfcmVmMjkgPSBfaTMyLnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpbGUgPSBfcmVmMjk7XG5cbiAgICAgICAgdGhpcy5fZXJyb3JQcm9jZXNzaW5nKGZpbGVzLCByZXNwb25zZSB8fCB0aGlzLm9wdGlvbnMuZGljdFJlc3BvbnNlRXJyb3IucmVwbGFjZShcInt7c3RhdHVzQ29kZX19XCIsIHhoci5zdGF0dXMpLCB4aHIpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzdWJtaXRSZXF1ZXN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN1Ym1pdFJlcXVlc3QoeGhyLCBmb3JtRGF0YSwgZmlsZXMpIHtcbiAgICAgIHhoci5zZW5kKGZvcm1EYXRhKTtcbiAgICB9XG5cbiAgICAvLyBDYWxsZWQgaW50ZXJuYWxseSB3aGVuIHByb2Nlc3NpbmcgaXMgZmluaXNoZWQuXG4gICAgLy8gSW5kaXZpZHVhbCBjYWxsYmFja3MgaGF2ZSB0byBiZSBjYWxsZWQgaW4gdGhlIGFwcHJvcHJpYXRlIHNlY3Rpb25zLlxuXG4gIH0sIHtcbiAgICBrZXk6IFwiX2ZpbmlzaGVkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9maW5pc2hlZChmaWxlcywgcmVzcG9uc2VUZXh0LCBlKSB7XG4gICAgICBmb3IgKHZhciBfaXRlcmF0b3IzMSA9IGZpbGVzLCBfaXNBcnJheTMxID0gdHJ1ZSwgX2kzMyA9IDAsIF9pdGVyYXRvcjMxID0gX2lzQXJyYXkzMSA/IF9pdGVyYXRvcjMxIDogX2l0ZXJhdG9yMzFbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgdmFyIF9yZWYzMDtcblxuICAgICAgICBpZiAoX2lzQXJyYXkzMSkge1xuICAgICAgICAgIGlmIChfaTMzID49IF9pdGVyYXRvcjMxLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgX3JlZjMwID0gX2l0ZXJhdG9yMzFbX2kzMysrXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfaTMzID0gX2l0ZXJhdG9yMzEubmV4dCgpO1xuICAgICAgICAgIGlmIChfaTMzLmRvbmUpIGJyZWFrO1xuICAgICAgICAgIF9yZWYzMCA9IF9pMzMudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmlsZSA9IF9yZWYzMDtcblxuICAgICAgICBmaWxlLnN0YXR1cyA9IERyb3B6b25lLlNVQ0NFU1M7XG4gICAgICAgIHRoaXMuZW1pdChcInN1Y2Nlc3NcIiwgZmlsZSwgcmVzcG9uc2VUZXh0LCBlKTtcbiAgICAgICAgdGhpcy5lbWl0KFwiY29tcGxldGVcIiwgZmlsZSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZE11bHRpcGxlKSB7XG4gICAgICAgIHRoaXMuZW1pdChcInN1Y2Nlc3NtdWx0aXBsZVwiLCBmaWxlcywgcmVzcG9uc2VUZXh0LCBlKTtcbiAgICAgICAgdGhpcy5lbWl0KFwiY29tcGxldGVtdWx0aXBsZVwiLCBmaWxlcyk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b1Byb2Nlc3NRdWV1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzUXVldWUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDYWxsZWQgaW50ZXJuYWxseSB3aGVuIHByb2Nlc3NpbmcgaXMgZmluaXNoZWQuXG4gICAgLy8gSW5kaXZpZHVhbCBjYWxsYmFja3MgaGF2ZSB0byBiZSBjYWxsZWQgaW4gdGhlIGFwcHJvcHJpYXRlIHNlY3Rpb25zLlxuXG4gIH0sIHtcbiAgICBrZXk6IFwiX2Vycm9yUHJvY2Vzc2luZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfZXJyb3JQcm9jZXNzaW5nKGZpbGVzLCBtZXNzYWdlLCB4aHIpIHtcbiAgICAgIGZvciAodmFyIF9pdGVyYXRvcjMyID0gZmlsZXMsIF9pc0FycmF5MzIgPSB0cnVlLCBfaTM0ID0gMCwgX2l0ZXJhdG9yMzIgPSBfaXNBcnJheTMyID8gX2l0ZXJhdG9yMzIgOiBfaXRlcmF0b3IzMltTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICB2YXIgX3JlZjMxO1xuXG4gICAgICAgIGlmIChfaXNBcnJheTMyKSB7XG4gICAgICAgICAgaWYgKF9pMzQgPj0gX2l0ZXJhdG9yMzIubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICBfcmVmMzEgPSBfaXRlcmF0b3IzMltfaTM0KytdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9pMzQgPSBfaXRlcmF0b3IzMi5uZXh0KCk7XG4gICAgICAgICAgaWYgKF9pMzQuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgX3JlZjMxID0gX2kzNC52YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmaWxlID0gX3JlZjMxO1xuXG4gICAgICAgIGZpbGUuc3RhdHVzID0gRHJvcHpvbmUuRVJST1I7XG4gICAgICAgIHRoaXMuZW1pdChcImVycm9yXCIsIGZpbGUsIG1lc3NhZ2UsIHhocik7XG4gICAgICAgIHRoaXMuZW1pdChcImNvbXBsZXRlXCIsIGZpbGUpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy51cGxvYWRNdWx0aXBsZSkge1xuICAgICAgICB0aGlzLmVtaXQoXCJlcnJvcm11bHRpcGxlXCIsIGZpbGVzLCBtZXNzYWdlLCB4aHIpO1xuICAgICAgICB0aGlzLmVtaXQoXCJjb21wbGV0ZW11bHRpcGxlXCIsIGZpbGVzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvUHJvY2Vzc1F1ZXVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NRdWV1ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfV0sIFt7XG4gICAga2V5OiBcInV1aWR2NFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1dWlkdjQoKSB7XG4gICAgICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbiAoYykge1xuICAgICAgICB2YXIgciA9IE1hdGgucmFuZG9tKCkgKiAxNiB8IDAsXG4gICAgICAgICAgICB2ID0gYyA9PT0gJ3gnID8gciA6IHIgJiAweDMgfCAweDg7XG4gICAgICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBEcm9wem9uZTtcbn0oRW1pdHRlcik7XG5cbkRyb3B6b25lLmluaXRDbGFzcygpO1xuXG5Ecm9wem9uZS52ZXJzaW9uID0gXCI1LjUuMFwiO1xuXG4vLyBUaGlzIGlzIGEgbWFwIG9mIG9wdGlvbnMgZm9yIHlvdXIgZGlmZmVyZW50IGRyb3B6b25lcy4gQWRkIGNvbmZpZ3VyYXRpb25zXG4vLyB0byB0aGlzIG9iamVjdCBmb3IgeW91ciBkaWZmZXJlbnQgZHJvcHpvbmUgZWxlbWVucy5cbi8vXG4vLyBFeGFtcGxlOlxuLy9cbi8vICAgICBEcm9wem9uZS5vcHRpb25zLm15RHJvcHpvbmVFbGVtZW50SWQgPSB7IG1heEZpbGVzaXplOiAxIH07XG4vL1xuLy8gVG8gZGlzYWJsZSBhdXRvRGlzY292ZXIgZm9yIGEgc3BlY2lmaWMgZWxlbWVudCwgeW91IGNhbiBzZXQgYGZhbHNlYCBhcyBhbiBvcHRpb246XG4vL1xuLy8gICAgIERyb3B6b25lLm9wdGlvbnMubXlEaXNhYmxlZEVsZW1lbnRJZCA9IGZhbHNlO1xuLy9cbi8vIEFuZCBpbiBodG1sOlxuLy9cbi8vICAgICA8Zm9ybSBhY3Rpb249XCIvdXBsb2FkXCIgaWQ9XCJteS1kcm9wem9uZS1lbGVtZW50LWlkXCIgY2xhc3M9XCJkcm9wem9uZVwiPjwvZm9ybT5cbkRyb3B6b25lLm9wdGlvbnMgPSB7fTtcblxuLy8gUmV0dXJucyB0aGUgb3B0aW9ucyBmb3IgYW4gZWxlbWVudCBvciB1bmRlZmluZWQgaWYgbm9uZSBhdmFpbGFibGUuXG5Ecm9wem9uZS5vcHRpb25zRm9yRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIC8vIEdldCB0aGUgYERyb3B6b25lLm9wdGlvbnMuZWxlbWVudElkYCBmb3IgdGhpcyBlbGVtZW50IGlmIGl0IGV4aXN0c1xuICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJpZFwiKSkge1xuICAgIHJldHVybiBEcm9wem9uZS5vcHRpb25zW2NhbWVsaXplKGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiaWRcIikpXTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59O1xuXG4vLyBIb2xkcyBhIGxpc3Qgb2YgYWxsIGRyb3B6b25lIGluc3RhbmNlc1xuRHJvcHpvbmUuaW5zdGFuY2VzID0gW107XG5cbi8vIFJldHVybnMgdGhlIGRyb3B6b25lIGZvciBnaXZlbiBlbGVtZW50IGlmIGFueVxuRHJvcHpvbmUuZm9yRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gXCJzdHJpbmdcIikge1xuICAgIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW1lbnQpO1xuICB9XG4gIGlmICgoZWxlbWVudCAhPSBudWxsID8gZWxlbWVudC5kcm9wem9uZSA6IHVuZGVmaW5lZCkgPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk5vIERyb3B6b25lIGZvdW5kIGZvciBnaXZlbiBlbGVtZW50LiBUaGlzIGlzIHByb2JhYmx5IGJlY2F1c2UgeW91J3JlIHRyeWluZyB0byBhY2Nlc3MgaXQgYmVmb3JlIERyb3B6b25lIGhhZCB0aGUgdGltZSB0byBpbml0aWFsaXplLiBVc2UgdGhlIGBpbml0YCBvcHRpb24gdG8gc2V0dXAgYW55IGFkZGl0aW9uYWwgb2JzZXJ2ZXJzIG9uIHlvdXIgRHJvcHpvbmUuXCIpO1xuICB9XG4gIHJldHVybiBlbGVtZW50LmRyb3B6b25lO1xufTtcblxuLy8gU2V0IHRvIGZhbHNlIGlmIHlvdSBkb24ndCB3YW50IERyb3B6b25lIHRvIGF1dG9tYXRpY2FsbHkgZmluZCBhbmQgYXR0YWNoIHRvIC5kcm9wem9uZSBlbGVtZW50cy5cbkRyb3B6b25lLmF1dG9EaXNjb3ZlciA9IHRydWU7XG5cbi8vIExvb2tzIGZvciBhbGwgLmRyb3B6b25lIGVsZW1lbnRzIGFuZCBjcmVhdGVzIGEgZHJvcHpvbmUgZm9yIHRoZW1cbkRyb3B6b25lLmRpc2NvdmVyID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZHJvcHpvbmVzID0gdm9pZCAwO1xuICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCkge1xuICAgIGRyb3B6b25lcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZHJvcHpvbmVcIik7XG4gIH0gZWxzZSB7XG4gICAgZHJvcHpvbmVzID0gW107XG4gICAgLy8gSUUgOihcbiAgICB2YXIgY2hlY2tFbGVtZW50cyA9IGZ1bmN0aW9uIGNoZWNrRWxlbWVudHMoZWxlbWVudHMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMzMgPSBlbGVtZW50cywgX2lzQXJyYXkzMyA9IHRydWUsIF9pMzUgPSAwLCBfaXRlcmF0b3IzMyA9IF9pc0FycmF5MzMgPyBfaXRlcmF0b3IzMyA6IF9pdGVyYXRvcjMzW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgdmFyIF9yZWYzMjtcblxuICAgICAgICAgIGlmIChfaXNBcnJheTMzKSB7XG4gICAgICAgICAgICBpZiAoX2kzNSA+PSBfaXRlcmF0b3IzMy5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgX3JlZjMyID0gX2l0ZXJhdG9yMzNbX2kzNSsrXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX2kzNSA9IF9pdGVyYXRvcjMzLm5leHQoKTtcbiAgICAgICAgICAgIGlmIChfaTM1LmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgX3JlZjMyID0gX2kzNS52YWx1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgZWwgPSBfcmVmMzI7XG5cbiAgICAgICAgICBpZiAoLyhefCApZHJvcHpvbmUoJHwgKS8udGVzdChlbC5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChkcm9wem9uZXMucHVzaChlbCkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh1bmRlZmluZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSgpO1xuICAgIH07XG4gICAgY2hlY2tFbGVtZW50cyhkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImRpdlwiKSk7XG4gICAgY2hlY2tFbGVtZW50cyhkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImZvcm1cIikpO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgZm9yICh2YXIgX2l0ZXJhdG9yMzQgPSBkcm9wem9uZXMsIF9pc0FycmF5MzQgPSB0cnVlLCBfaTM2ID0gMCwgX2l0ZXJhdG9yMzQgPSBfaXNBcnJheTM0ID8gX2l0ZXJhdG9yMzQgOiBfaXRlcmF0b3IzNFtTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgdmFyIF9yZWYzMztcblxuICAgICAgaWYgKF9pc0FycmF5MzQpIHtcbiAgICAgICAgaWYgKF9pMzYgPj0gX2l0ZXJhdG9yMzQubGVuZ3RoKSBicmVhaztcbiAgICAgICAgX3JlZjMzID0gX2l0ZXJhdG9yMzRbX2kzNisrXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9pMzYgPSBfaXRlcmF0b3IzNC5uZXh0KCk7XG4gICAgICAgIGlmIChfaTM2LmRvbmUpIGJyZWFrO1xuICAgICAgICBfcmVmMzMgPSBfaTM2LnZhbHVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgZHJvcHpvbmUgPSBfcmVmMzM7XG5cbiAgICAgIC8vIENyZWF0ZSBhIGRyb3B6b25lIHVubGVzcyBhdXRvIGRpc2NvdmVyIGhhcyBiZWVuIGRpc2FibGVkIGZvciBzcGVjaWZpYyBlbGVtZW50XG4gICAgICBpZiAoRHJvcHpvbmUub3B0aW9uc0ZvckVsZW1lbnQoZHJvcHpvbmUpICE9PSBmYWxzZSkge1xuICAgICAgICByZXN1bHQucHVzaChuZXcgRHJvcHpvbmUoZHJvcHpvbmUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHVuZGVmaW5lZCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0oKTtcbn07XG5cbi8vIFNpbmNlIHRoZSB3aG9sZSBEcmFnJ24nRHJvcCBBUEkgaXMgcHJldHR5IG5ldywgc29tZSBicm93c2VycyBpbXBsZW1lbnQgaXQsXG4vLyBidXQgbm90IGNvcnJlY3RseS5cbi8vIFNvIEkgY3JlYXRlZCBhIGJsYWNrbGlzdCBvZiB1c2VyQWdlbnRzLiBZZXMsIHllcy4gQnJvd3NlciBzbmlmZmluZywgSSBrbm93LlxuLy8gQnV0IHdoYXQgdG8gZG8gd2hlbiBicm93c2VycyAqdGhlb3JldGljYWxseSogc3VwcG9ydCBhbiBBUEksIGJ1dCBjcmFzaFxuLy8gd2hlbiB1c2luZyBpdC5cbi8vXG4vLyBUaGlzIGlzIGEgbGlzdCBvZiByZWd1bGFyIGV4cHJlc3Npb25zIHRlc3RlZCBhZ2FpbnN0IG5hdmlnYXRvci51c2VyQWdlbnRcbi8vXG4vLyAqKiBJdCBzaG91bGQgb25seSBiZSB1c2VkIG9uIGJyb3dzZXIgdGhhdCAqZG8qIHN1cHBvcnQgdGhlIEFQSSwgYnV0XG4vLyBpbmNvcnJlY3RseSAqKlxuLy9cbkRyb3B6b25lLmJsYWNrbGlzdGVkQnJvd3NlcnMgPSBbXG4vLyBUaGUgbWFjIG9zIGFuZCB3aW5kb3dzIHBob25lIHZlcnNpb24gb2Ygb3BlcmEgMTIgc2VlbXMgdG8gaGF2ZSBhIHByb2JsZW0gd2l0aCB0aGUgRmlsZSBkcmFnJ24nZHJvcCBBUEkuXG4vb3BlcmEuKihNYWNpbnRvc2h8V2luZG93cyBQaG9uZSkuKnZlcnNpb25cXC8xMi9pXTtcblxuLy8gQ2hlY2tzIGlmIHRoZSBicm93c2VyIGlzIHN1cHBvcnRlZFxuRHJvcHpvbmUuaXNCcm93c2VyU3VwcG9ydGVkID0gZnVuY3Rpb24gKCkge1xuICB2YXIgY2FwYWJsZUJyb3dzZXIgPSB0cnVlO1xuXG4gIGlmICh3aW5kb3cuRmlsZSAmJiB3aW5kb3cuRmlsZVJlYWRlciAmJiB3aW5kb3cuRmlsZUxpc3QgJiYgd2luZG93LkJsb2IgJiYgd2luZG93LkZvcm1EYXRhICYmIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IpIHtcbiAgICBpZiAoIShcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpKSkge1xuICAgICAgY2FwYWJsZUJyb3dzZXIgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlIGJyb3dzZXIgc3VwcG9ydHMgdGhlIEFQSSwgYnV0IG1heSBiZSBibGFja2xpc3RlZC5cbiAgICAgIGZvciAodmFyIF9pdGVyYXRvcjM1ID0gRHJvcHpvbmUuYmxhY2tsaXN0ZWRCcm93c2VycywgX2lzQXJyYXkzNSA9IHRydWUsIF9pMzcgPSAwLCBfaXRlcmF0b3IzNSA9IF9pc0FycmF5MzUgPyBfaXRlcmF0b3IzNSA6IF9pdGVyYXRvcjM1W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgIHZhciBfcmVmMzQ7XG5cbiAgICAgICAgaWYgKF9pc0FycmF5MzUpIHtcbiAgICAgICAgICBpZiAoX2kzNyA+PSBfaXRlcmF0b3IzNS5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgIF9yZWYzNCA9IF9pdGVyYXRvcjM1W19pMzcrK107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX2kzNyA9IF9pdGVyYXRvcjM1Lm5leHQoKTtcbiAgICAgICAgICBpZiAoX2kzNy5kb25lKSBicmVhaztcbiAgICAgICAgICBfcmVmMzQgPSBfaTM3LnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlZ2V4ID0gX3JlZjM0O1xuXG4gICAgICAgIGlmIChyZWdleC50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG4gICAgICAgICAgY2FwYWJsZUJyb3dzZXIgPSBmYWxzZTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjYXBhYmxlQnJvd3NlciA9IGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIGNhcGFibGVCcm93c2VyO1xufTtcblxuRHJvcHpvbmUuZGF0YVVSSXRvQmxvYiA9IGZ1bmN0aW9uIChkYXRhVVJJKSB7XG4gIC8vIGNvbnZlcnQgYmFzZTY0IHRvIHJhdyBiaW5hcnkgZGF0YSBoZWxkIGluIGEgc3RyaW5nXG4gIC8vIGRvZXNuJ3QgaGFuZGxlIFVSTEVuY29kZWQgRGF0YVVSSXMgLSBzZWUgU08gYW5zd2VyICM2ODUwMjc2IGZvciBjb2RlIHRoYXQgZG9lcyB0aGlzXG4gIHZhciBieXRlU3RyaW5nID0gYXRvYihkYXRhVVJJLnNwbGl0KCcsJylbMV0pO1xuXG4gIC8vIHNlcGFyYXRlIG91dCB0aGUgbWltZSBjb21wb25lbnRcbiAgdmFyIG1pbWVTdHJpbmcgPSBkYXRhVVJJLnNwbGl0KCcsJylbMF0uc3BsaXQoJzonKVsxXS5zcGxpdCgnOycpWzBdO1xuXG4gIC8vIHdyaXRlIHRoZSBieXRlcyBvZiB0aGUgc3RyaW5nIHRvIGFuIEFycmF5QnVmZmVyXG4gIHZhciBhYiA9IG5ldyBBcnJheUJ1ZmZlcihieXRlU3RyaW5nLmxlbmd0aCk7XG4gIHZhciBpYSA9IG5ldyBVaW50OEFycmF5KGFiKTtcbiAgZm9yICh2YXIgaSA9IDAsIGVuZCA9IGJ5dGVTdHJpbmcubGVuZ3RoLCBhc2MgPSAwIDw9IGVuZDsgYXNjID8gaSA8PSBlbmQgOiBpID49IGVuZDsgYXNjID8gaSsrIDogaS0tKSB7XG4gICAgaWFbaV0gPSBieXRlU3RyaW5nLmNoYXJDb2RlQXQoaSk7XG4gIH1cblxuICAvLyB3cml0ZSB0aGUgQXJyYXlCdWZmZXIgdG8gYSBibG9iXG4gIHJldHVybiBuZXcgQmxvYihbYWJdLCB7IHR5cGU6IG1pbWVTdHJpbmcgfSk7XG59O1xuXG4vLyBSZXR1cm5zIGFuIGFycmF5IHdpdGhvdXQgdGhlIHJlamVjdGVkIGl0ZW1cbnZhciB3aXRob3V0ID0gZnVuY3Rpb24gd2l0aG91dChsaXN0LCByZWplY3RlZEl0ZW0pIHtcbiAgcmV0dXJuIGxpc3QuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgcmV0dXJuIGl0ZW0gIT09IHJlamVjdGVkSXRlbTtcbiAgfSkubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgcmV0dXJuIGl0ZW07XG4gIH0pO1xufTtcblxuLy8gYWJjLWRlZl9naGkgLT4gYWJjRGVmR2hpXG52YXIgY2FtZWxpemUgPSBmdW5jdGlvbiBjYW1lbGl6ZShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFwtX10oXFx3KS9nLCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICByZXR1cm4gbWF0Y2guY2hhckF0KDEpLnRvVXBwZXJDYXNlKCk7XG4gIH0pO1xufTtcblxuLy8gQ3JlYXRlcyBhbiBlbGVtZW50IGZyb20gc3RyaW5nXG5Ecm9wem9uZS5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKHN0cmluZykge1xuICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgZGl2LmlubmVySFRNTCA9IHN0cmluZztcbiAgcmV0dXJuIGRpdi5jaGlsZE5vZGVzWzBdO1xufTtcblxuLy8gVGVzdHMgaWYgZ2l2ZW4gZWxlbWVudCBpcyBpbnNpZGUgKG9yIHNpbXBseSBpcykgdGhlIGNvbnRhaW5lclxuRHJvcHpvbmUuZWxlbWVudEluc2lkZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBjb250YWluZXIpIHtcbiAgaWYgKGVsZW1lbnQgPT09IGNvbnRhaW5lcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9IC8vIENvZmZlZXNjcmlwdCBkb2Vzbid0IHN1cHBvcnQgZG8vd2hpbGUgbG9vcHNcbiAgd2hpbGUgKGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICBpZiAoZWxlbWVudCA9PT0gY29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuRHJvcHpvbmUuZ2V0RWxlbWVudCA9IGZ1bmN0aW9uIChlbCwgbmFtZSkge1xuICB2YXIgZWxlbWVudCA9IHZvaWQgMDtcbiAgaWYgKHR5cGVvZiBlbCA9PT0gXCJzdHJpbmdcIikge1xuICAgIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcbiAgfSBlbHNlIGlmIChlbC5ub2RlVHlwZSAhPSBudWxsKSB7XG4gICAgZWxlbWVudCA9IGVsO1xuICB9XG4gIGlmIChlbGVtZW50ID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGBcIiArIG5hbWUgKyBcImAgb3B0aW9uIHByb3ZpZGVkLiBQbGVhc2UgcHJvdmlkZSBhIENTUyBzZWxlY3RvciBvciBhIHBsYWluIEhUTUwgZWxlbWVudC5cIik7XG4gIH1cbiAgcmV0dXJuIGVsZW1lbnQ7XG59O1xuXG5Ecm9wem9uZS5nZXRFbGVtZW50cyA9IGZ1bmN0aW9uIChlbHMsIG5hbWUpIHtcbiAgdmFyIGVsID0gdm9pZCAwLFxuICAgICAgZWxlbWVudHMgPSB2b2lkIDA7XG4gIGlmIChlbHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIGVsZW1lbnRzID0gW107XG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9pdGVyYXRvcjM2ID0gZWxzLCBfaXNBcnJheTM2ID0gdHJ1ZSwgX2kzOCA9IDAsIF9pdGVyYXRvcjM2ID0gX2lzQXJyYXkzNiA/IF9pdGVyYXRvcjM2IDogX2l0ZXJhdG9yMzZbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgaWYgKF9pc0FycmF5MzYpIHtcbiAgICAgICAgICBpZiAoX2kzOCA+PSBfaXRlcmF0b3IzNi5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgIGVsID0gX2l0ZXJhdG9yMzZbX2kzOCsrXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfaTM4ID0gX2l0ZXJhdG9yMzYubmV4dCgpO1xuICAgICAgICAgIGlmIChfaTM4LmRvbmUpIGJyZWFrO1xuICAgICAgICAgIGVsID0gX2kzOC52YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW1lbnRzLnB1c2godGhpcy5nZXRFbGVtZW50KGVsLCBuYW1lKSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZWxlbWVudHMgPSBudWxsO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgZWxzID09PSBcInN0cmluZ1wiKSB7XG4gICAgZWxlbWVudHMgPSBbXTtcbiAgICBmb3IgKHZhciBfaXRlcmF0b3IzNyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZWxzKSwgX2lzQXJyYXkzNyA9IHRydWUsIF9pMzkgPSAwLCBfaXRlcmF0b3IzNyA9IF9pc0FycmF5MzcgPyBfaXRlcmF0b3IzNyA6IF9pdGVyYXRvcjM3W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICBpZiAoX2lzQXJyYXkzNykge1xuICAgICAgICBpZiAoX2kzOSA+PSBfaXRlcmF0b3IzNy5sZW5ndGgpIGJyZWFrO1xuICAgICAgICBlbCA9IF9pdGVyYXRvcjM3W19pMzkrK107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfaTM5ID0gX2l0ZXJhdG9yMzcubmV4dCgpO1xuICAgICAgICBpZiAoX2kzOS5kb25lKSBicmVhaztcbiAgICAgICAgZWwgPSBfaTM5LnZhbHVlO1xuICAgICAgfVxuXG4gICAgICBlbGVtZW50cy5wdXNoKGVsKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoZWxzLm5vZGVUeXBlICE9IG51bGwpIHtcbiAgICBlbGVtZW50cyA9IFtlbHNdO1xuICB9XG5cbiAgaWYgKGVsZW1lbnRzID09IG51bGwgfHwgIWVsZW1lbnRzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgYFwiICsgbmFtZSArIFwiYCBvcHRpb24gcHJvdmlkZWQuIFBsZWFzZSBwcm92aWRlIGEgQ1NTIHNlbGVjdG9yLCBhIHBsYWluIEhUTUwgZWxlbWVudCBvciBhIGxpc3Qgb2YgdGhvc2UuXCIpO1xuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnRzO1xufTtcblxuLy8gQXNrcyB0aGUgdXNlciB0aGUgcXVlc3Rpb24gYW5kIGNhbGxzIGFjY2VwdGVkIG9yIHJlamVjdGVkIGFjY29yZGluZ2x5XG4vL1xuLy8gVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24ganVzdCB1c2VzIGB3aW5kb3cuY29uZmlybWAgYW5kIHRoZW4gY2FsbHMgdGhlXG4vLyBhcHByb3ByaWF0ZSBjYWxsYmFjay5cbkRyb3B6b25lLmNvbmZpcm0gPSBmdW5jdGlvbiAocXVlc3Rpb24sIGFjY2VwdGVkLCByZWplY3RlZCkge1xuICBpZiAod2luZG93LmNvbmZpcm0ocXVlc3Rpb24pKSB7XG4gICAgcmV0dXJuIGFjY2VwdGVkKCk7XG4gIH0gZWxzZSBpZiAocmVqZWN0ZWQgIT0gbnVsbCkge1xuICAgIHJldHVybiByZWplY3RlZCgpO1xuICB9XG59O1xuXG4vLyBWYWxpZGF0ZXMgdGhlIG1pbWUgdHlwZSBsaWtlIHRoaXM6XG4vL1xuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9IVE1ML0VsZW1lbnQvaW5wdXQjYXR0ci1hY2NlcHRcbkRyb3B6b25lLmlzVmFsaWRGaWxlID0gZnVuY3Rpb24gKGZpbGUsIGFjY2VwdGVkRmlsZXMpIHtcbiAgaWYgKCFhY2NlcHRlZEZpbGVzKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gLy8gSWYgdGhlcmUgYXJlIG5vIGFjY2VwdGVkIG1pbWUgdHlwZXMsIGl0J3MgT0tcbiAgYWNjZXB0ZWRGaWxlcyA9IGFjY2VwdGVkRmlsZXMuc3BsaXQoXCIsXCIpO1xuXG4gIHZhciBtaW1lVHlwZSA9IGZpbGUudHlwZTtcbiAgdmFyIGJhc2VNaW1lVHlwZSA9IG1pbWVUeXBlLnJlcGxhY2UoL1xcLy4qJC8sIFwiXCIpO1xuXG4gIGZvciAodmFyIF9pdGVyYXRvcjM4ID0gYWNjZXB0ZWRGaWxlcywgX2lzQXJyYXkzOCA9IHRydWUsIF9pNDAgPSAwLCBfaXRlcmF0b3IzOCA9IF9pc0FycmF5MzggPyBfaXRlcmF0b3IzOCA6IF9pdGVyYXRvcjM4W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgdmFyIF9yZWYzNTtcblxuICAgIGlmIChfaXNBcnJheTM4KSB7XG4gICAgICBpZiAoX2k0MCA+PSBfaXRlcmF0b3IzOC5sZW5ndGgpIGJyZWFrO1xuICAgICAgX3JlZjM1ID0gX2l0ZXJhdG9yMzhbX2k0MCsrXTtcbiAgICB9IGVsc2Uge1xuICAgICAgX2k0MCA9IF9pdGVyYXRvcjM4Lm5leHQoKTtcbiAgICAgIGlmIChfaTQwLmRvbmUpIGJyZWFrO1xuICAgICAgX3JlZjM1ID0gX2k0MC52YWx1ZTtcbiAgICB9XG5cbiAgICB2YXIgdmFsaWRUeXBlID0gX3JlZjM1O1xuXG4gICAgdmFsaWRUeXBlID0gdmFsaWRUeXBlLnRyaW0oKTtcbiAgICBpZiAodmFsaWRUeXBlLmNoYXJBdCgwKSA9PT0gXCIuXCIpIHtcbiAgICAgIGlmIChmaWxlLm5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKHZhbGlkVHlwZS50b0xvd2VyQ2FzZSgpLCBmaWxlLm5hbWUubGVuZ3RoIC0gdmFsaWRUeXBlLmxlbmd0aCkgIT09IC0xKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoL1xcL1xcKiQvLnRlc3QodmFsaWRUeXBlKSkge1xuICAgICAgLy8gVGhpcyBpcyBzb21ldGhpbmcgbGlrZSBhIGltYWdlLyogbWltZSB0eXBlXG4gICAgICBpZiAoYmFzZU1pbWVUeXBlID09PSB2YWxpZFR5cGUucmVwbGFjZSgvXFwvLiokLywgXCJcIikpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChtaW1lVHlwZSA9PT0gdmFsaWRUeXBlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8vIEF1Z21lbnQgalF1ZXJ5XG5pZiAodHlwZW9mIGpRdWVyeSAhPT0gJ3VuZGVmaW5lZCcgJiYgalF1ZXJ5ICE9PSBudWxsKSB7XG4gIGpRdWVyeS5mbi5kcm9wem9uZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IERyb3B6b25lKHRoaXMsIG9wdGlvbnMpO1xuICAgIH0pO1xuICB9O1xufVxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlICE9PSBudWxsKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gRHJvcHpvbmU7XG59IGVsc2Uge1xuICB3aW5kb3cuRHJvcHpvbmUgPSBEcm9wem9uZTtcbn1cblxuLy8gRHJvcHpvbmUgZmlsZSBzdGF0dXMgY29kZXNcbkRyb3B6b25lLkFEREVEID0gXCJhZGRlZFwiO1xuXG5Ecm9wem9uZS5RVUVVRUQgPSBcInF1ZXVlZFwiO1xuLy8gRm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LiBOb3csIGlmIGEgZmlsZSBpcyBhY2NlcHRlZCwgaXQncyBlaXRoZXIgcXVldWVkXG4vLyBvciB1cGxvYWRpbmcuXG5Ecm9wem9uZS5BQ0NFUFRFRCA9IERyb3B6b25lLlFVRVVFRDtcblxuRHJvcHpvbmUuVVBMT0FESU5HID0gXCJ1cGxvYWRpbmdcIjtcbkRyb3B6b25lLlBST0NFU1NJTkcgPSBEcm9wem9uZS5VUExPQURJTkc7IC8vIGFsaWFzXG5cbkRyb3B6b25lLkNBTkNFTEVEID0gXCJjYW5jZWxlZFwiO1xuRHJvcHpvbmUuRVJST1IgPSBcImVycm9yXCI7XG5Ecm9wem9uZS5TVUNDRVNTID0gXCJzdWNjZXNzXCI7XG5cbi8qXG5cbiBCdWdmaXggZm9yIGlPUyA2IGFuZCA3XG4gU291cmNlOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzExOTI5MDk5L2h0bWw1LWNhbnZhcy1kcmF3aW1hZ2UtcmF0aW8tYnVnLWlvc1xuIGJhc2VkIG9uIHRoZSB3b3JrIG9mIGh0dHBzOi8vZ2l0aHViLmNvbS9zdG9taXRhL2lvcy1pbWFnZWZpbGUtbWVnYXBpeGVsXG5cbiAqL1xuXG4vLyBEZXRlY3RpbmcgdmVydGljYWwgc3F1YXNoIGluIGxvYWRlZCBpbWFnZS5cbi8vIEZpeGVzIGEgYnVnIHdoaWNoIHNxdWFzaCBpbWFnZSB2ZXJ0aWNhbGx5IHdoaWxlIGRyYXdpbmcgaW50byBjYW52YXMgZm9yIHNvbWUgaW1hZ2VzLlxuLy8gVGhpcyBpcyBhIGJ1ZyBpbiBpT1M2IGRldmljZXMuIFRoaXMgZnVuY3Rpb24gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vc3RvbWl0YS9pb3MtaW1hZ2VmaWxlLW1lZ2FwaXhlbFxudmFyIGRldGVjdFZlcnRpY2FsU3F1YXNoID0gZnVuY3Rpb24gZGV0ZWN0VmVydGljYWxTcXVhc2goaW1nKSB7XG4gIHZhciBpdyA9IGltZy5uYXR1cmFsV2lkdGg7XG4gIHZhciBpaCA9IGltZy5uYXR1cmFsSGVpZ2h0O1xuICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgY2FudmFzLndpZHRoID0gMTtcbiAgY2FudmFzLmhlaWdodCA9IGloO1xuICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIDApO1xuXG4gIHZhciBfY3R4JGdldEltYWdlRGF0YSA9IGN0eC5nZXRJbWFnZURhdGEoMSwgMCwgMSwgaWgpLFxuICAgICAgZGF0YSA9IF9jdHgkZ2V0SW1hZ2VEYXRhLmRhdGE7XG5cbiAgLy8gc2VhcmNoIGltYWdlIGVkZ2UgcGl4ZWwgcG9zaXRpb24gaW4gY2FzZSBpdCBpcyBzcXVhc2hlZCB2ZXJ0aWNhbGx5LlxuXG5cbiAgdmFyIHN5ID0gMDtcbiAgdmFyIGV5ID0gaWg7XG4gIHZhciBweSA9IGloO1xuICB3aGlsZSAocHkgPiBzeSkge1xuICAgIHZhciBhbHBoYSA9IGRhdGFbKHB5IC0gMSkgKiA0ICsgM107XG5cbiAgICBpZiAoYWxwaGEgPT09IDApIHtcbiAgICAgIGV5ID0gcHk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN5ID0gcHk7XG4gICAgfVxuXG4gICAgcHkgPSBleSArIHN5ID4+IDE7XG4gIH1cbiAgdmFyIHJhdGlvID0gcHkgLyBpaDtcblxuICBpZiAocmF0aW8gPT09IDApIHtcbiAgICByZXR1cm4gMTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcmF0aW87XG4gIH1cbn07XG5cbi8vIEEgcmVwbGFjZW1lbnQgZm9yIGNvbnRleHQuZHJhd0ltYWdlXG4vLyAoYXJncyBhcmUgZm9yIHNvdXJjZSBhbmQgZGVzdGluYXRpb24pLlxudmFyIGRyYXdJbWFnZUlPU0ZpeCA9IGZ1bmN0aW9uIGRyYXdJbWFnZUlPU0ZpeChjdHgsIGltZywgc3gsIHN5LCBzdywgc2gsIGR4LCBkeSwgZHcsIGRoKSB7XG4gIHZhciB2ZXJ0U3F1YXNoUmF0aW8gPSBkZXRlY3RWZXJ0aWNhbFNxdWFzaChpbWcpO1xuICByZXR1cm4gY3R4LmRyYXdJbWFnZShpbWcsIHN4LCBzeSwgc3csIHNoLCBkeCwgZHksIGR3LCBkaCAvIHZlcnRTcXVhc2hSYXRpbyk7XG59O1xuXG4vLyBCYXNlZCBvbiBNaW5pZnlKcGVnXG4vLyBTb3VyY2U6IGh0dHA6Ly93d3cucGVycnkuY3ovZmlsZXMvRXhpZlJlc3RvcmVyLmpzXG4vLyBodHRwOi8vZWxpY29uLmJsb2c1Ny5mYzIuY29tL2Jsb2ctZW50cnktMjA2Lmh0bWxcblxudmFyIEV4aWZSZXN0b3JlID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBFeGlmUmVzdG9yZSgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRXhpZlJlc3RvcmUpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEV4aWZSZXN0b3JlLCBudWxsLCBbe1xuICAgIGtleTogXCJpbml0Q2xhc3NcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdENsYXNzKCkge1xuICAgICAgdGhpcy5LRVlfU1RSID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89JztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZW5jb2RlNjRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZW5jb2RlNjQoaW5wdXQpIHtcbiAgICAgIHZhciBvdXRwdXQgPSAnJztcbiAgICAgIHZhciBjaHIxID0gdW5kZWZpbmVkO1xuICAgICAgdmFyIGNocjIgPSB1bmRlZmluZWQ7XG4gICAgICB2YXIgY2hyMyA9ICcnO1xuICAgICAgdmFyIGVuYzEgPSB1bmRlZmluZWQ7XG4gICAgICB2YXIgZW5jMiA9IHVuZGVmaW5lZDtcbiAgICAgIHZhciBlbmMzID0gdW5kZWZpbmVkO1xuICAgICAgdmFyIGVuYzQgPSAnJztcbiAgICAgIHZhciBpID0gMDtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGNocjEgPSBpbnB1dFtpKytdO1xuICAgICAgICBjaHIyID0gaW5wdXRbaSsrXTtcbiAgICAgICAgY2hyMyA9IGlucHV0W2krK107XG4gICAgICAgIGVuYzEgPSBjaHIxID4+IDI7XG4gICAgICAgIGVuYzIgPSAoY2hyMSAmIDMpIDw8IDQgfCBjaHIyID4+IDQ7XG4gICAgICAgIGVuYzMgPSAoY2hyMiAmIDE1KSA8PCAyIHwgY2hyMyA+PiA2O1xuICAgICAgICBlbmM0ID0gY2hyMyAmIDYzO1xuICAgICAgICBpZiAoaXNOYU4oY2hyMikpIHtcbiAgICAgICAgICBlbmMzID0gZW5jNCA9IDY0O1xuICAgICAgICB9IGVsc2UgaWYgKGlzTmFOKGNocjMpKSB7XG4gICAgICAgICAgZW5jNCA9IDY0O1xuICAgICAgICB9XG4gICAgICAgIG91dHB1dCA9IG91dHB1dCArIHRoaXMuS0VZX1NUUi5jaGFyQXQoZW5jMSkgKyB0aGlzLktFWV9TVFIuY2hhckF0KGVuYzIpICsgdGhpcy5LRVlfU1RSLmNoYXJBdChlbmMzKSArIHRoaXMuS0VZX1NUUi5jaGFyQXQoZW5jNCk7XG4gICAgICAgIGNocjEgPSBjaHIyID0gY2hyMyA9ICcnO1xuICAgICAgICBlbmMxID0gZW5jMiA9IGVuYzMgPSBlbmM0ID0gJyc7XG4gICAgICAgIGlmICghKGkgPCBpbnB1dC5sZW5ndGgpKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlc3RvcmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVzdG9yZShvcmlnRmlsZUJhc2U2NCwgcmVzaXplZEZpbGVCYXNlNjQpIHtcbiAgICAgIGlmICghb3JpZ0ZpbGVCYXNlNjQubWF0Y2goJ2RhdGE6aW1hZ2UvanBlZztiYXNlNjQsJykpIHtcbiAgICAgICAgcmV0dXJuIHJlc2l6ZWRGaWxlQmFzZTY0O1xuICAgICAgfVxuICAgICAgdmFyIHJhd0ltYWdlID0gdGhpcy5kZWNvZGU2NChvcmlnRmlsZUJhc2U2NC5yZXBsYWNlKCdkYXRhOmltYWdlL2pwZWc7YmFzZTY0LCcsICcnKSk7XG4gICAgICB2YXIgc2VnbWVudHMgPSB0aGlzLnNsaWNlMlNlZ21lbnRzKHJhd0ltYWdlKTtcbiAgICAgIHZhciBpbWFnZSA9IHRoaXMuZXhpZk1hbmlwdWxhdGlvbihyZXNpemVkRmlsZUJhc2U2NCwgc2VnbWVudHMpO1xuICAgICAgcmV0dXJuIFwiZGF0YTppbWFnZS9qcGVnO2Jhc2U2NCxcIiArIHRoaXMuZW5jb2RlNjQoaW1hZ2UpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJleGlmTWFuaXB1bGF0aW9uXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGV4aWZNYW5pcHVsYXRpb24ocmVzaXplZEZpbGVCYXNlNjQsIHNlZ21lbnRzKSB7XG4gICAgICB2YXIgZXhpZkFycmF5ID0gdGhpcy5nZXRFeGlmQXJyYXkoc2VnbWVudHMpO1xuICAgICAgdmFyIG5ld0ltYWdlQXJyYXkgPSB0aGlzLmluc2VydEV4aWYocmVzaXplZEZpbGVCYXNlNjQsIGV4aWZBcnJheSk7XG4gICAgICB2YXIgYUJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KG5ld0ltYWdlQXJyYXkpO1xuICAgICAgcmV0dXJuIGFCdWZmZXI7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEV4aWZBcnJheVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRFeGlmQXJyYXkoc2VnbWVudHMpIHtcbiAgICAgIHZhciBzZWcgPSB1bmRlZmluZWQ7XG4gICAgICB2YXIgeCA9IDA7XG4gICAgICB3aGlsZSAoeCA8IHNlZ21lbnRzLmxlbmd0aCkge1xuICAgICAgICBzZWcgPSBzZWdtZW50c1t4XTtcbiAgICAgICAgaWYgKHNlZ1swXSA9PT0gMjU1ICYgc2VnWzFdID09PSAyMjUpIHtcbiAgICAgICAgICByZXR1cm4gc2VnO1xuICAgICAgICB9XG4gICAgICAgIHgrKztcbiAgICAgIH1cbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaW5zZXJ0RXhpZlwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbnNlcnRFeGlmKHJlc2l6ZWRGaWxlQmFzZTY0LCBleGlmQXJyYXkpIHtcbiAgICAgIHZhciBpbWFnZURhdGEgPSByZXNpemVkRmlsZUJhc2U2NC5yZXBsYWNlKCdkYXRhOmltYWdlL2pwZWc7YmFzZTY0LCcsICcnKTtcbiAgICAgIHZhciBidWYgPSB0aGlzLmRlY29kZTY0KGltYWdlRGF0YSk7XG4gICAgICB2YXIgc2VwYXJhdGVQb2ludCA9IGJ1Zi5pbmRleE9mKDI1NSwgMyk7XG4gICAgICB2YXIgbWFlID0gYnVmLnNsaWNlKDAsIHNlcGFyYXRlUG9pbnQpO1xuICAgICAgdmFyIGF0byA9IGJ1Zi5zbGljZShzZXBhcmF0ZVBvaW50KTtcbiAgICAgIHZhciBhcnJheSA9IG1hZTtcbiAgICAgIGFycmF5ID0gYXJyYXkuY29uY2F0KGV4aWZBcnJheSk7XG4gICAgICBhcnJheSA9IGFycmF5LmNvbmNhdChhdG8pO1xuICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzbGljZTJTZWdtZW50c1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzbGljZTJTZWdtZW50cyhyYXdJbWFnZUFycmF5KSB7XG4gICAgICB2YXIgaGVhZCA9IDA7XG4gICAgICB2YXIgc2VnbWVudHMgPSBbXTtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBsZW5ndGg7XG4gICAgICAgIGlmIChyYXdJbWFnZUFycmF5W2hlYWRdID09PSAyNTUgJiByYXdJbWFnZUFycmF5W2hlYWQgKyAxXSA9PT0gMjE4KSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJhd0ltYWdlQXJyYXlbaGVhZF0gPT09IDI1NSAmIHJhd0ltYWdlQXJyYXlbaGVhZCArIDFdID09PSAyMTYpIHtcbiAgICAgICAgICBoZWFkICs9IDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGVuZ3RoID0gcmF3SW1hZ2VBcnJheVtoZWFkICsgMl0gKiAyNTYgKyByYXdJbWFnZUFycmF5W2hlYWQgKyAzXTtcbiAgICAgICAgICB2YXIgZW5kUG9pbnQgPSBoZWFkICsgbGVuZ3RoICsgMjtcbiAgICAgICAgICB2YXIgc2VnID0gcmF3SW1hZ2VBcnJheS5zbGljZShoZWFkLCBlbmRQb2ludCk7XG4gICAgICAgICAgc2VnbWVudHMucHVzaChzZWcpO1xuICAgICAgICAgIGhlYWQgPSBlbmRQb2ludDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGVhZCA+IHJhd0ltYWdlQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWdtZW50cztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZGVjb2RlNjRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVjb2RlNjQoaW5wdXQpIHtcbiAgICAgIHZhciBvdXRwdXQgPSAnJztcbiAgICAgIHZhciBjaHIxID0gdW5kZWZpbmVkO1xuICAgICAgdmFyIGNocjIgPSB1bmRlZmluZWQ7XG4gICAgICB2YXIgY2hyMyA9ICcnO1xuICAgICAgdmFyIGVuYzEgPSB1bmRlZmluZWQ7XG4gICAgICB2YXIgZW5jMiA9IHVuZGVmaW5lZDtcbiAgICAgIHZhciBlbmMzID0gdW5kZWZpbmVkO1xuICAgICAgdmFyIGVuYzQgPSAnJztcbiAgICAgIHZhciBpID0gMDtcbiAgICAgIHZhciBidWYgPSBbXTtcbiAgICAgIC8vIHJlbW92ZSBhbGwgY2hhcmFjdGVycyB0aGF0IGFyZSBub3QgQS1aLCBhLXosIDAtOSwgKywgLywgb3IgPVxuICAgICAgdmFyIGJhc2U2NHRlc3QgPSAvW15BLVphLXowLTlcXCtcXC9cXD1dL2c7XG4gICAgICBpZiAoYmFzZTY0dGVzdC5leGVjKGlucHV0KSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ1RoZXJlIHdlcmUgaW52YWxpZCBiYXNlNjQgY2hhcmFjdGVycyBpbiB0aGUgaW5wdXQgdGV4dC5cXG5WYWxpZCBiYXNlNjQgY2hhcmFjdGVycyBhcmUgQS1aLCBhLXosIDAtOSwgXFwnK1xcJywgXFwnL1xcJyxhbmQgXFwnPVxcJ1xcbkV4cGVjdCBlcnJvcnMgaW4gZGVjb2RpbmcuJyk7XG4gICAgICB9XG4gICAgICBpbnB1dCA9IGlucHV0LnJlcGxhY2UoL1teQS1aYS16MC05XFwrXFwvXFw9XS9nLCAnJyk7XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBlbmMxID0gdGhpcy5LRVlfU1RSLmluZGV4T2YoaW5wdXQuY2hhckF0KGkrKykpO1xuICAgICAgICBlbmMyID0gdGhpcy5LRVlfU1RSLmluZGV4T2YoaW5wdXQuY2hhckF0KGkrKykpO1xuICAgICAgICBlbmMzID0gdGhpcy5LRVlfU1RSLmluZGV4T2YoaW5wdXQuY2hhckF0KGkrKykpO1xuICAgICAgICBlbmM0ID0gdGhpcy5LRVlfU1RSLmluZGV4T2YoaW5wdXQuY2hhckF0KGkrKykpO1xuICAgICAgICBjaHIxID0gZW5jMSA8PCAyIHwgZW5jMiA+PiA0O1xuICAgICAgICBjaHIyID0gKGVuYzIgJiAxNSkgPDwgNCB8IGVuYzMgPj4gMjtcbiAgICAgICAgY2hyMyA9IChlbmMzICYgMykgPDwgNiB8IGVuYzQ7XG4gICAgICAgIGJ1Zi5wdXNoKGNocjEpO1xuICAgICAgICBpZiAoZW5jMyAhPT0gNjQpIHtcbiAgICAgICAgICBidWYucHVzaChjaHIyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW5jNCAhPT0gNjQpIHtcbiAgICAgICAgICBidWYucHVzaChjaHIzKTtcbiAgICAgICAgfVxuICAgICAgICBjaHIxID0gY2hyMiA9IGNocjMgPSAnJztcbiAgICAgICAgZW5jMSA9IGVuYzIgPSBlbmMzID0gZW5jNCA9ICcnO1xuICAgICAgICBpZiAoIShpIDwgaW5wdXQubGVuZ3RoKSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYnVmO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBFeGlmUmVzdG9yZTtcbn0oKTtcblxuRXhpZlJlc3RvcmUuaW5pdENsYXNzKCk7XG5cbi8qXG4gKiBjb250ZW50bG9hZGVkLmpzXG4gKlxuICogQXV0aG9yOiBEaWVnbyBQZXJpbmkgKGRpZWdvLnBlcmluaSBhdCBnbWFpbC5jb20pXG4gKiBTdW1tYXJ5OiBjcm9zcy1icm93c2VyIHdyYXBwZXIgZm9yIERPTUNvbnRlbnRMb2FkZWRcbiAqIFVwZGF0ZWQ6IDIwMTAxMDIwXG4gKiBMaWNlbnNlOiBNSVRcbiAqIFZlcnNpb246IDEuMlxuICpcbiAqIFVSTDpcbiAqIGh0dHA6Ly9qYXZhc2NyaXB0Lm53Ym94LmNvbS9Db250ZW50TG9hZGVkL1xuICogaHR0cDovL2phdmFzY3JpcHQubndib3guY29tL0NvbnRlbnRMb2FkZWQvTUlULUxJQ0VOU0VcbiAqL1xuXG4vLyBAd2luIHdpbmRvdyByZWZlcmVuY2Vcbi8vIEBmbiBmdW5jdGlvbiByZWZlcmVuY2VcbnZhciBjb250ZW50TG9hZGVkID0gZnVuY3Rpb24gY29udGVudExvYWRlZCh3aW4sIGZuKSB7XG4gIHZhciBkb25lID0gZmFsc2U7XG4gIHZhciB0b3AgPSB0cnVlO1xuICB2YXIgZG9jID0gd2luLmRvY3VtZW50O1xuICB2YXIgcm9vdCA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG4gIHZhciBhZGQgPSBkb2MuYWRkRXZlbnRMaXN0ZW5lciA/IFwiYWRkRXZlbnRMaXN0ZW5lclwiIDogXCJhdHRhY2hFdmVudFwiO1xuICB2YXIgcmVtID0gZG9jLmFkZEV2ZW50TGlzdGVuZXIgPyBcInJlbW92ZUV2ZW50TGlzdGVuZXJcIiA6IFwiZGV0YWNoRXZlbnRcIjtcbiAgdmFyIHByZSA9IGRvYy5hZGRFdmVudExpc3RlbmVyID8gXCJcIiA6IFwib25cIjtcbiAgdmFyIGluaXQgPSBmdW5jdGlvbiBpbml0KGUpIHtcbiAgICBpZiAoZS50eXBlID09PSBcInJlYWR5c3RhdGVjaGFuZ2VcIiAmJiBkb2MucmVhZHlTdGF0ZSAhPT0gXCJjb21wbGV0ZVwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIChlLnR5cGUgPT09IFwibG9hZFwiID8gd2luIDogZG9jKVtyZW1dKHByZSArIGUudHlwZSwgaW5pdCwgZmFsc2UpO1xuICAgIGlmICghZG9uZSAmJiAoZG9uZSA9IHRydWUpKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh3aW4sIGUudHlwZSB8fCBlKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIHBvbGwgPSBmdW5jdGlvbiBwb2xsKCkge1xuICAgIHRyeSB7XG4gICAgICByb290LmRvU2Nyb2xsKFwibGVmdFwiKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBzZXRUaW1lb3V0KHBvbGwsIDUwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIGluaXQoXCJwb2xsXCIpO1xuICB9O1xuXG4gIGlmIChkb2MucmVhZHlTdGF0ZSAhPT0gXCJjb21wbGV0ZVwiKSB7XG4gICAgaWYgKGRvYy5jcmVhdGVFdmVudE9iamVjdCAmJiByb290LmRvU2Nyb2xsKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0b3AgPSAhd2luLmZyYW1lRWxlbWVudDtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxuICAgICAgaWYgKHRvcCkge1xuICAgICAgICBwb2xsKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGRvY1thZGRdKHByZSArIFwiRE9NQ29udGVudExvYWRlZFwiLCBpbml0LCBmYWxzZSk7XG4gICAgZG9jW2FkZF0ocHJlICsgXCJyZWFkeXN0YXRlY2hhbmdlXCIsIGluaXQsIGZhbHNlKTtcbiAgICByZXR1cm4gd2luW2FkZF0ocHJlICsgXCJsb2FkXCIsIGluaXQsIGZhbHNlKTtcbiAgfVxufTtcblxuLy8gQXMgYSBzaW5nbGUgZnVuY3Rpb24gdG8gYmUgYWJsZSB0byB3cml0ZSB0ZXN0cy5cbkRyb3B6b25lLl9hdXRvRGlzY292ZXJGdW5jdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKERyb3B6b25lLmF1dG9EaXNjb3Zlcikge1xuICAgIHJldHVybiBEcm9wem9uZS5kaXNjb3ZlcigpO1xuICB9XG59O1xuY29udGVudExvYWRlZCh3aW5kb3csIERyb3B6b25lLl9hdXRvRGlzY292ZXJGdW5jdGlvbik7XG5cbmZ1bmN0aW9uIF9fZ3VhcmRfXyh2YWx1ZSwgdHJhbnNmb3JtKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlICE9PSBudWxsID8gdHJhbnNmb3JtKHZhbHVlKSA6IHVuZGVmaW5lZDtcbn1cbmZ1bmN0aW9uIF9fZ3VhcmRNZXRob2RfXyhvYmosIG1ldGhvZE5hbWUsIHRyYW5zZm9ybSkge1xuICBpZiAodHlwZW9mIG9iaiAhPT0gJ3VuZGVmaW5lZCcgJiYgb2JqICE9PSBudWxsICYmIHR5cGVvZiBvYmpbbWV0aG9kTmFtZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdHJhbnNmb3JtKG9iaiwgbWV0aG9kTmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuIl0sImZpbGUiOiJkcm9wem9uZS5qcyJ9
