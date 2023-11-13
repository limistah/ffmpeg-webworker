const workerFile = () => {
  const workerPath =
    "https://raw.githubusercontent.com/bgrins/videoconverter.js/master/build/ffmpeg-all-codecs.js";

  importScripts(workerPath);
  const now = Date.now;
  function print(text) {
    postMessage({ type: "stdout", data: text });
  }
  onmessage = function(event) {
    const message = event.data;
    if (message.type === "command") {
      const Module = {
        print: print,
        printErr: print,
        files: message.files || [],
        arguments: message.arguments || [],
        TOTAL_MEMORY: message.totalMemory || 33554432
      };
      postMessage({ type: "start", data: Module.arguments.join(" ") });
      postMessage({
        type: "stdout",
        data:
          "Received command: " +
          Module.arguments.join(" ") +
          (Module.TOTAL_MEMORY
            ? ".  Processing with " + Module.TOTAL_MEMORY + " bits."
            : "")
      });
      const time = now();
      const result = ffmpeg_run(Module);
      const totalTime = now() - time;
      postMessage({
        type: "stdout",
        data: "Finished processing (took " + totalTime + "ms)"
      });
      postMessage({ type: "done", data: result, time: totalTime });
    }
  };
  postMessage({ type: "ready" });
};

export default workerFile;
