import WebworkerClient from "./FFMPEGWebWorkerClient";
import Webworker from "./FFMPEGWebWorker";
export var FFMPEGWebworker = Webworker;
export var FFMPEGWebworkerClient = WebworkerClient;
var workerClient = {
  on: function on() {},
  emit: function emit() {}
};

var _window = global || window;

if (_window && _window.Blob) {
  workerClient = new WebworkerClient();
}

export default workerClient;