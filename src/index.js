export default class WebWorker {
  constructor(worker) {
    if (typeof worker !== "function") {
      throw new Error("File content must export a function");
    }
    const code = worker.toString();
    const blob = new Blob(["(" + code + ")()"], {
      type: "application/javascript"
    });
    return new Worker(URL.createObjectURL(blob));
  }
}
