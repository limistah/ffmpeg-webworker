import WebworkerClient from "./FFMPEGWebWorkerClient";
import Webworker from "./FFMPEGWebWorker";

export const FFMPEGWebworker = Webworker;
export const FFMPEGWebworkerClient = WebworkerClient;
let workerClient = WebworkerClient;
if (window && window.Blob) {
  workerClient = new WebworkerClient();
}
export default workerClient;
