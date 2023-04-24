import { Pure } from "@design-express/fabrica";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export class Firebase extends Pure {
  static path = "Firebase";
  static title = "App";
  static description = "";

  constructor() {
    super();
    this.addInput("config", "object");
    this.addOutput("app", "object");
    this.addOutput("firestore", "object");
  }

  onExecute() {
    const _config = this.getInputData(1);

    if (
      _config === undefined ||
      _config.apiKey === undefined ||
      _config.authDomain === undefined ||
      _config.projectId === undefined ||
      _config.storageBucket === undefined ||
      _config.messagingSenderId === undefined ||
      _config.appId === undefined ||
      _config.measurementId === undefined
    ) {
      return;
    }

    const _app = initializeApp(_config);
    this.setOutputData(1, _app);
    this.setOutputData(2, getFirestore(this._app));
  }
}
