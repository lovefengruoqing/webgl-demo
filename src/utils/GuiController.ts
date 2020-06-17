import { GUI } from 'dat.gui';

export default {

  get gui(): GUI {
    if (!this._gui) {
      this._gui = new GUI();
    }

    return this._gui;
  },
};
