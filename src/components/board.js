import {AbstractComponent} from './abstract-component';

export class Board extends AbstractComponent {
  getTemplate() {
    return `<section class="board container"></section>`;
  }
}
