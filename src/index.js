import WebworkerClient from "./FFMPEGWebWorkerClient";
import Webworker from "./FFMPEGWebWorker";

export const FFMPEGWebworker = Webworker;
export const FFMPEGWebworkerClient = WebworkerClient;

const workerClient = new WebworkerClient();
export default workerClient;
