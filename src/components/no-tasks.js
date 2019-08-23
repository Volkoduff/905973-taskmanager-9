import {createElement} from './utils';

export class NoTask {
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  getTemplate() {
    return `<p class="board__no-tasks">
          Congratulations, all tasks were completed! To create a new click on
          «add new task» button.
        </p>`;

  }
}
