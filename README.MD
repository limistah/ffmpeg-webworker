# ffmpeg-webworker

A WebWorker implementation that eases the use of ffmpeg library in the browser.

## Installation

```bash
npm install --save ffmpeg-webworker
```

or:

```bash
yarn add ffmpeg-webworker
```

## Usage

```js
import workerClient from "ffmpeg-webworker";
import React from "react";

workerClient.on("onReady", () => console.log("Ready"));
workerClient.on("onStdout", msg => console.log("StdOut: ", msg));
workerClient.on("onFileReceived", msg => console.log("File Received"));
workerClient.on("onDone", data => console.log("Command Done: ", data));

const handleInputChange = React.useCallback(async e => {
  const file = e.currentTarget.files[0];
  // Set the file for processing
  workerClient.inputFile = file;
  // Run a valid ffmpeg command
  workerClient.runCommand("-ss 00:00:05 -c copy -t 12 sliced-output.mp4");
});
const Input = () => {
  return (
    <input type="file" accept="audio/*,video/*" onChange={handleInputChange} />
  );
};
<Input />;
```

```js static
import workerClient from "ffmpeg-webworker";
import React from "react";

workerClient.on("onReady", () => console.log("Ready"));
workerClient.on("onStdout", msg => console.log("StdOut: ", msg));
workerClient.on("onFileReceived", msg => console.log("File Received"));
workerClient.on("onDone", data => console.log("Command Done: ", data));

const handleInputChange = React.useCallback(async e => {
  const file = e.currentTarget.files[0];
  // Set the file for processing
  workerClient.inputFile = file;
  // Run a valid ffmpeg command
  workerClient.runCommand("-ss 00:00:05 -c copy -t 12 sliced-output.mp4");
});
const Input = () => {
  return (
    <input type="file" accept="audio/*,video/*" onChange={handleInputChange} />
  );
};
<Input />;
```

## License

MIT

## Credits

This library has been made possible with the awesome work by folks at
[Ffmpeg.js](https://github.com/muaz-khan/Ffmpeg.js/)
