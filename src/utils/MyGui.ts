import { GUI } from 'dat.gui';

class MyGui {
  private _gui: GUI;

  get gui(): GUI {
    if (!this._gui) {
      this._gui = new GUI();
    }

    return this._gui;
  }

  dispose() {
    this.gui.__controllers.forEach((oneController) => {
      this.gui.remove(oneController);
    });
  }
}

export default new MyGui();
