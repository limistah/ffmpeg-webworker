var workerFile = function workerFile() {
  var workerPath = "https://cdn.rawgit.com/bgrins/videoconverter.js/master/build/ffmpeg-all-codecs.js";
  importScripts(workerPath);
  var now = Date.now;

  function print(text) {
    postMessage({
      type: "stdout",
      data: text
    });
  }

  onmessage = function onmessage(event) {
    var message = event.data;

    if (message.type === "command") {
      var Module = {
        print: print,
        printErr: print,
        files: message.files || [],
        arguments: message.arguments || [],
        TOTAL_MEMORY: message.totalMemory || null
      };
      postMessage({
        type: "start",
        data: Module.arguments.join(" ")
      });
      postMessage({
        type: "stdout",
        data: "Received command: " + Module.arguments.join(" ") + (Module.TOTAL_MEMORY ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")
      });
      var time = now();
      var result = ffmpeg_run(Module);
      var totalTime = now() - time;
      postMessage({
        type: "stdout",
        data: "Finished processing (took " + totalTime + "ms)"
      });
      postMessage({
        type: "done",
        data: result,
        time: totalTime
      });
    }
  };

  postMessage({
    type: "ready"
  });
};

export default workerFile;