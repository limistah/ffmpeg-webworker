import WorkerFile from "webworker-file";
import workerFile from "./FFMPEGWebWorker";
import { EventEmitter } from "events";

export default class FFMPEGWebworkerClient extends EventEmitter {
  /**
   * @type {Worker}
   */
  _worker = {};
  /**
   * @type {Blob}
   */
  _inputFile = {};

  /**
   * @type {Boolean}
   */
  workerIsReady = false;
  constructor() {
    super();
    this.initWebWorker();
  }

  initWebWorker() {
    this.worker = new WorkerFile(workerFile);
    this.worker.onmessage = event => {
      let message = event.data;
      if (message.type == "ready") {
        this.emit("onReady", "ffmpeg-asm.js file has been loaded.");
        this.workerIsReady = true;
      } else if (message.type == "stdout") {
        this.emit("onStdout", message.data);
      } else if (message.type == "start") {
        this.emit("onFileReceived", "File Received");
        log("file received ffmpeg command.");
      } else if (message.type == "done") {
        this.emit("onDone", message.data);
        // const result = message.data[0];
        // log(JSON.stringify(result));
        // const blob = new File([result.data], "test.mp4", {
        //   type: "video/mp4"
        // });
        // // log(blob);
        // resolve(blob);
      }
    };
  }

  set worker(worker) {
    this._worker = worker;
  }
  get worker() {
    return this._worker;
  }

  set inputFile(inputFile) {
    if (!this.isVideo(inputFile)) {
      throw new Error("Input file is expected to be an audio or a video");
    }
    this._inputFile = inputFile;
  }
  get inputFile() {
    return this._inputFile;
  }

  /**
   * use worker to encode audio
   * @param {Blob} file
   * @return {Promise<ArrayBuffer>}
   */
  readFileAsBufferArray = file => {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.onload = function() {
        resolve(this.result);
      };
      fileReader.onerror = function() {
        reject(this.error);
      };
      fileReader.readAsArrayBuffer(file);
    });
  };

  inputFileExists() {
    const inputFile = this.inputFile;
    return !!(
      inputFile &&
      inputFile instanceof Blob &&
      inputFile.size &&
      inputFile.type
    );
  }

  /**
   * use worker to encode audio
   * @param {Blob} inputFile
   * @return {Promise<ArrayBuffer>}
   */
  convertInputFileToArrayBuffer() {
    if (!this.inputFileExists()) {
      throw new Error("Input File has not been set");
    }
    return this.readFileAsBufferArray(this.inputFile);
  }

  /**
   * @param {String} command
   */
  runCommand = command => {
    if (typeof command !== "string" || !command.length) {
      throw new Error("command should be string and not empty");
    }
    this.convertInputFileToArrayBuffer().then(arrayBuffer => {
      while (!this.workerIsReady) {}
      const filename = "video.webm";
      const inputCommand = `-i ${filename} ${command}`;
      this.worker.postMessage({
        type: "command",
        arguments: inputCommand.split(" "),
        files: [
          {
            data: new Uint8Array(arrayBuffer),
            name: filename
          }
        ]
      });
    });
  };

  /**
   * @param {String | Array<String>} message
   * @return {void}
   */
  log = message =>
    Array.isArray(message)
      ? console.log.call(null, message)
      : console.log(message);

  /**
   * @param {Blob} file
   * @return {Boolean}
   */
  isVideo = file => {
    const fileType = file.type;
    return (
      file instanceof Blob &&
      (fileType.includes("video") || fileType.includes("audio"))
    );
  };
}
