'use babel';

import ImportToRequireView from './import-to-require-view';
import { CompositeDisposable } from 'atom';

export default {

  importToRequireView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.importToRequireView = new ImportToRequireView(state.importToRequireViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.importToRequireView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'import-to-require:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.importToRequireView.destroy();
  },

  serialize() {
    return {
      importToRequireViewState: this.importToRequireView.serialize()
    };
  },

  toggle() {
    console.log('ImportToRequire was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
