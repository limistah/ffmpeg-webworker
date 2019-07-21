import WorkerFile from "webworker-file";
import workerFile from "./worker";

let worker = new WorkerFile(workerFile);

const log = message =>
  Array.isArray(message)
    ? console.log.call(null, message)
    : console.log(message);

const isVideo = file => {
  const fileType = file.type;
  return (
    file instanceof Blob &&
    (fileType.includes("video") || fileType.includes("audio"))
  );
};

/**
 * use worker to encode audio
 * @param {Blob} inputFile
 * @param {string} type
 * @return {Promise<Blob>}
 */
const runCommand = (inputFile, command) => {
  return new Promise((resolve, reject) => {
    if (!isVideo) {
      reject("Input file is expected to be an audio or a video");
    }
  });
};

/**
 * use worker to encode audio
 * @param {Blob} videoBlob
 * @param {string} type
 * @return {Promise<Blob>}
 */
export const encode = videoBlob => {
  const log = msg => console.info(msg);
  return new Promise((resolve, reject) => {
    let aab;
    let buffersReady;
    let workerReady;
    let posted;
    let fileReader = new FileReader();
    fileReader.onload = function() {
      aab = this.result;
      postMessage();
    };
    fileReader.readAsArrayBuffer(videoBlob);

    worker.onmessage = function(event) {
      let message = event.data;
      if (message.type == "ready") {
        log("ffmpeg-asm.js</a> file has been loaded.");
        workerReady = true;
        if (buffersReady) postMessage();
      } else if (message.type == "stdout") {
        log(message.data);
      } else if (message.type == "start") {
        log("file received ffmpeg command.");
      } else if (message.type == "done") {
        const result = message.data[0];
        // log(JSON.stringify(result));
        const blob = new File([result.data], "test.mp4", {
          type: "video/mp4"
        });
        // log(blob);
        resolve(blob);
      }
    };
    const postMessage = function() {
      posted = true;
      worker.postMessage({
        type: "command",
        arguments: "-i video.webm -ss 00:00:05 -c copy -t 12 sliced-output.mp4".split(
          " "
        ),
        files: [
          {
            data: new Uint8Array(aab),
            name: "video.webm"
          }
        ]
      });
    };
  });
};
