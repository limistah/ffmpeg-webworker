# ffmpeg-webworker

A WebWorker implementation that eases the use of ffmpeg library in the browser.

This builds upon an existing work geniusly done by the folks at
[Ffmpeg.js](https://github.com/muaz-khan/Ffmpeg.js/) and
[videoconverter.js](https://github.com/bgrins/videoconverter.js)

## Demo

[See it here](https://limistah.github.io/ffmpeg-webworker)

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

class FFMPEG extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stdOutputText: "",
      ffmpegReady: false
    };

    this.updateStdOutputText = this.updateStdOutputText.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleListCodecs = this.handleListCodecs.bind(this);
  }

  componentWillMount() {
    workerClient.on("onReady", () => this.setState({ ffmpegReady: true }));
    workerClient.on("onStdout", msg => this.updateStdOutputText(msg));
    workerClient.on("onFileReceived", msg => this.updateStdOutputText(msg));
    workerClient.on("onDone", data => {
      this.updateStdOutputText("Command Completed, check the console");
      console.log(data);
    });
  }

  updateStdOutputText(text) {
    this.setState({
      stdOutputText: `${this.state.stdOutputText} \n\n ${text}`
    });
  }

  handleInputChange(e) {
    this.setState({ stdOutputText: "" });

    const file = e.currentTarget.files[0];
    // Set the file for processing
    workerClient.inputFile = file;
    // Run a valid ffmpeg command
    workerClient.runCommand("-ss 00:00:05 -c copy -t 12 sliced-output.mp4");
  }

  Input({ onChange }) {
    return (
      <input type="file" accept="audio/*,video/*" onChange={e => onChange(e)} />
    );
  }

  StdOutput({ text, ffmpegReady }) {
    return (
      <pre>
        {ffmpegReady ? "FFMPEG is ready" : "Loading FFMPEG"}
        {text}
      </pre>
    );
  }

  handleListCodecs(e) {
    e.preventDefault();
    this.setState({ stdOutputText: "" });
    // Run a valid ffmpeg command
    workerClient.runCommand("-codecs");
  }

  render() {
    return (
      <div>
        {<this.Input onChange={this.handleInputChange} />}
        <button onClick={this.handleListCodecs}>List Codecs</button>
        <this.StdOutput
          text={this.state.stdOutputText}
          ffmpegReady={this.state.ffmpegReady}
        />
      </div>
    );
  }
}

<FFMPEG />;
```

## Docs

The default export from the library is a standard NodeJS event emitter client
would listen to and dispatch events based on interactions with an already loaded
ffmpeg webworker Javascript library inside of a webworker.

It supports the following properties:

### workerClient.on : void

Receives an event from the ffmpeg webworker. Below are the supported commands:

- _onReady_: The webworker has loaded ffmpeg successfully.
- _onStdout_: Listens to standard ffmpeg-js message outputs.
- _onStart_: Command has been received and started.
- _onDone_: Command has been completed. Receives the data from ffmpeg as the
  first parameter.
- _onFileReceived_: Input file has been set on the client.

### workerClient.inputFile : File

The file that ffmpeg-webworker would be working with on issue of command.

### workerClient.worker : WebWorker

An instance of the web worker that has ffmpeg-js loaded in it.

### workerClient.readFileAsBufferArray (file: File) : ArrayBuffer

Converts the passed file to a file buffer array.

### workerClient.inputFileExists : boolean

Detects if the inputFile has been passed in correctly.

### workerClient.convertInputFileToArrayBuffer (file: File) : ArrayBuffer

Converts already set input file in the library to Buffer Array for processing

### workerClient.runCommand (command: String, totalMemory = 33554432: Number) : void

Accepts a valid ffmpeg command to be run against the input file

### workerClient.log (message: String [, String []]) : void

Logs messages to standard console.

This is the default exported property of the module. It ease the interaction
with the already initialized and loaded ffmpeg webworker Javascript library.

Other exported modules are:

### FFMPEGWebworker

The official web worker implementation that makes easier the loading of
ffmpeg-js and running command in a worker.

### FFMPEGWebworkerClient

Official listener for FFMPEGWebworker.

```js static
import { FFMPEGWebworkerClient } from "ffmpeg-webworker";

const webworkerClient = new FFMPEGWebworkerClient();

// The above is same as
// import webworkerClient from "ffmpeg-webworker";

webworkerClient.on("ready", () => {
  console.log("FFMPEG has been loaded, and can receive commands");
});
```

## Release Notes

1.0.0

- Supports all ffmpeg codecs

Initial Release:

- Setup for the library
- Only supports lib H246

## Contributions

Github issues can be used to log bug reports, suggestions and improvements

You can fork, then send a pull request.

Thank you...

## License

MIT

## Credits

This library has been made possible with the awesome work by folks at
[Ffmpeg.js](https://github.com/muaz-khan/Ffmpeg.js/)
