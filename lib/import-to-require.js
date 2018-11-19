"use babel";

import { CompositeDisposable } from "atom";

export default {
  subscriptions: null,

  activate() {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    // Register command that toggles this view
    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        "import-to-require:toggle": () => this.toggle()
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {
    console.log("Import-to-require was toggled!");
    const editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      const selection = editor.getSelectedText();
      const returnedString = `TOT${selection}TOT`;
      editor.insertText(returnedString);
    }
  }
};
