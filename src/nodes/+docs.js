import { Pure } from "@design-express/fabrica";
import {
  collection as _collection,
  doc as _doc,
  getDoc as _getDoc,
  onSnapshot,
  updateDoc as _updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

export class doc extends Pure {
  static path = "Firebase/doc";
  static title = "doc";
  static description = "";
  constructor() {
    super();
    this.addInput("firestore|doc", "object");
    this.addInput("collection name", "string");
    this.addInput("id", "string");
    this.addOutput("doc", "object");
    this.addOutput("id", "string");
  }

  onExecute() {
    let _docRef;
    const _db = this.getInputData(1);
    const _colName = this.getInputData(2);
    const _id = (this.getInputData(3) ?? "").trim();

    if (
      !_colName ||
      _colName === "" ||
      !_db
      //   ||!(["firestore-lite", "firestore"].indexOf(_db.type) > -1)
    )
      return;

    if (_id === "") _docRef = _doc(_collection(_db, _colName));
    else _docRef = _doc(_db, _colName, _id);
    this.setOutputData(1, _docRef);
    this.setOutputData(2, _docRef.id);
  }
}

export class insertDoc extends Pure {
  static path = "Firebase/doc";
  static title = "insert";
  static description = "";

  constructor() {
    super();
    this.addInput("doc", "object");
    this.addInput("data", "");
    this.addOutput("doc", "object");
  }

  async onExecute() {
    const _doc = this.getInputData(1);
    await setDoc(_doc, this.getInputData(2));
    this.setOutputData(1, _doc);
  }
}

export class updateDoc extends Pure {
  static path = "Firebase/doc";
  static title = "update";
  static description = "";
  constructor() {
    super();
    this.addInput("doc", "object");
    this.addInput("data", "");
    this.addOutput("doc", "object");
  }

  async onExecute() {
    const _doc = this.getInputData(1);
    await _updateDoc(_doc, this.getInputData(2));
    this.setOutputData(1, _doc);
  }
}

export class getDoc extends Pure {
  static path = "Firebase/doc";
  static title = "get";
  static description = "";
  constructor() {
    super();
    this.addInput("doc", "object");
    this.addOutput("doc", "object");
    this.addOutput("data", "");
  }

  async onExecute() {
    const _doc = this.getInputData(1);
    this.setOutputData(1, _doc);
    const docSnap = await _getDoc(_doc);
    if (docSnap.exists()) {
      this.setOutputData(2, docSnap.data());
    } else {
      this.setOutputData(2, null);
    }
  }
}

export class delDoc extends Pure {
  static path = "Firebase/doc";
  static title = "delete";
  static description = "";
  constructor() {
    super();
    this.addInput("doc", "object");
  }

  async onExecute() {
    const _doc = this.getInputData(1);
    await deleteDoc(_doc);
  }
}

export class observerDoc {
  static path = "Firebase/doc";
  static title = "observer";
  static description = "";

  constructor() {
    this.unsubscribe = undefined;
    this.addInput("doc", "object");
    this.addOutput("onChange", -1);
    this.addOutput("data", "");
  }

  async onExecute() {
    if (typeof this.unsubscribe === "function") {
      this.unsubscribe();
      this.unsubscribe = undefined;
    }
    this.unsubscribe = onSnapshot(this.getInputData(0), (snapshot) => {
      const data = snapshot.data();
      this.setOutputData(1, data);
      this.triggerSlot(0);
    });
  }

  onRemoved() {
    if (typeof this.unsubscribe === "function") {
      this.unsubscribe();
      this.unsubscribe = undefined;
    }
  }
}
