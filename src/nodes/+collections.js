import { Pure } from "@design-express/fabrica";
import { collection as _collection, onSnapshot } from "firebase/firestore";

export class collection extends Pure {
  static path = "Firebase/collection";
  static title = "new collection";
  static description = "";
  constructor() {
    super();
    this.addInput("firestore|doc", "object");
    this.addInput("collection name", "string");
    this.addInput("id", "string");
    this.addOutput("collection", "object");
  }

  onExecute() {
    const _db = this.getInputData(1);
    const _colName = this.getInputData(2);

    if (
      !_colName ||
      _colName === "" ||
      !_db
      //   ||!(["firestore-lite", "firestore"].indexOf(_db.type) > -1)
    )
      return;

    this.setOutputData(1, _collection(_db, _colName));
  }
}

export class observerCollection {
  static path = "Firebase/collection";
  static title = "observer";
  static description = "";

  constructor() {
    this.unsubscribe = undefined;
    this.addInput("collection", "object");
    this.addOutput("onAdded", -1);
    this.addOutput("onModified", -1);
    this.addOutput("onRemoved", -1);
    this.addOutput("data", "");
    this.mapFunc = {
      added: () => this.triggerSlot(0),
      modified: () => this.triggerSlot(1),
      removed: () => this.triggerSlot(2),
    };
    // this.addOutput("onDeletedDoc", -1);
    // this.addOutput("data", "");
  }

  async onExecute() {
    if (typeof this.unsubscribe === "function") {
      this.unsubscribe();
      this.unsubscribe = undefined;
    }
    this.unsubscribe = onSnapshot(this.getInputData(0), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const _func = this.mapFunc[change.type];
        if (typeof _func === "function") {
          this.setOutputData(3, change.doc.data());
          _func();
        }
      });
    });
  }
  onRemoved() {
    if (typeof this.unsubscribe === "function") {
      this.unsubscribe();
      this.unsubscribe = undefined;
    }
  }
}
