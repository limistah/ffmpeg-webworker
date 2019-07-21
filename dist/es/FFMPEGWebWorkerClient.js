function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import WorkerFile from "webworker-file";
import workerFile from "./FFMPEGWebWorker";
import { EventEmitter } from "events";

var FFMPEGWebworkerClient =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(FFMPEGWebworkerClient, _EventEmitter);

  /**
   * @type {Worker}
   */

  /**
   * @type {Blob}
   */

  /**
   * @type {Boolean}
   */
  function FFMPEGWebworkerClient() {
    var _this;

    _classCallCheck(this, FFMPEGWebworkerClient);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FFMPEGWebworkerClient).call(this));

    _defineProperty(_assertThisInitialized(_this), "_worker", {});

    _defineProperty(_assertThisInitialized(_this), "_inputFile", {});

    _defineProperty(_assertThisInitialized(_this), "workerIsReady", false);

    _defineProperty(_assertThisInitialized(_this), "readFileAsBufferArray", function (file) {
      return new Promise(function (resolve, reject) {
        var fileReader = new FileReader();

        fileReader.onload = function () {
          resolve(this.result);
        };

        fileReader.onerror = function () {
          reject(this.error);
        };

        fileReader.readAsArrayBuffer(file);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "runCommand", function (command) {
      if (typeof command !== "string" || !command.length) {
        throw new Error("command should be string and not empty");
      }

      _this.convertInputFileToArrayBuffer().then(function (arrayBuffer) {
        while (!_this.workerIsReady) {}

        var filename = "video.webm";
        var inputCommand = "-i ".concat(filename, " ").concat(command);

        _this.worker.postMessage({
          type: "command",
          arguments: inputCommand.split(" "),
          files: [{
            data: new Uint8Array(arrayBuffer),
            name: filename
          }]
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "log", function (message) {
      return Array.isArray(message) ? console.log.call(null, message) : console.log(message);
    });

    _defineProperty(_assertThisInitialized(_this), "isVideo", function (file) {
      var fileType = file.type;
      return file instanceof Blob && (fileType.includes("video") || fileType.includes("audio"));
    });

    _this.initWebWorker();

    return _this;
  }

  _createClass(FFMPEGWebworkerClient, [{
    key: "initWebWorker",
    value: function initWebWorker() {
      var _this2 = this;

      this.worker = new WorkerFile(workerFile);

      this.worker.onmessage = function (event) {
        var message = event.data;

        if (message.type == "ready") {
          _this2.emit("onReady", "ffmpeg-asm.js file has been loaded.");

          _this2.workerIsReady = true;
        } else if (message.type == "stdout") {
          _this2.emit("onStdout", message.data);
        } else if (message.type == "start") {
          _this2.emit("onFileReceived", "File Received");

          log("file received ffmpeg command.");
        } else if (message.type == "done") {
          _this2.emit("onDone", message.data); // const result = message.data[0];
          // log(JSON.stringify(result));
          // const blob = new File([result.data], "test.mp4", {
          //   type: "video/mp4"
          // });
          // // log(blob);
          // resolve(blob);

        }
      };
    }
  }, {
    key: "inputFileExists",
    value: function inputFileExists() {
      var inputFile = this.inputFile;
      return !!(inputFile && inputFile instanceof Blob && inputFile.size && inputFile.type);
    }
    /**
     * use worker to encode audio
     * @param {Blob} inputFile
     * @return {Promise<ArrayBuffer>}
     */

  }, {
    key: "convertInputFileToArrayBuffer",
    value: function convertInputFileToArrayBuffer() {
      if (!this.inputFileExists()) {
        throw new Error("Input File has not been set");
      }

      return this.readFileAsBufferArray(this.inputFile);
    }
    /**
     * @param {String} command
     */

  }, {
    key: "worker",
    set: function set(worker) {
      this._worker = worker;
    },
    get: function get() {
      return this._worker;
    }
  }, {
    key: "inputFile",
    set: function set(inputFile) {
      if (!this.isVideo(inputFile)) {
        throw new Error("Input file is expected to be an audio or a video");
      }

      this._inputFile = inputFile;
    },
    get: function get() {
      return this._inputFile;
    }
    /**
     * use worker to encode audio
     * @param {Blob} file
     * @return {Promise<ArrayBuffer>}
     */

  }]);

  return FFMPEGWebworkerClient;
}(EventEmitter);

export { FFMPEGWebworkerClient as default };