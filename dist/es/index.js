import WebworkerClient from "./FFMPEGWebWorkerClient";
import Webworker from "./FFMPEGWebWorker";
export var FFMPEGWebworker = Webworker;
export var FFMPEGWebworkerClient = WebworkerClient;
var workerClient = WebworkerClient;

if (window && window.Blob) {
  workerClient = new WebworkerClient();
}

export default workerClient;