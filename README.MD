# ffmpeg-webworker

Initialize imported web worker files with ease

## Installation

```bash
npm install --save ffmpeg-webworker
```

or:

```bash
yarn add ffmpeg-webworker
```

## Usage

```js static
// workerFile.js
const worker = function() {
  postMessage({ type: "ready" });
  // File to import will be downloaded, ensure that the path is relative to the server address
  const scriptPath = "https://archive.org/download/ffmpeg_asm/ffmpeg_asm.js";
  importScripts(scriptPath);
  onmessage = function(event) {
    postMessage({ type: "stdout", data: {} });
  };
};
export default worker;
```

```js static
import WorkerFile from "ffmpeg-webworker";
import workerFile from "./workerFile";

const worker = new WorkerFile(workerFile);
worker.onmessage = function(e) {
  // ...
  console.log(e);
};
```

## License

MIT
