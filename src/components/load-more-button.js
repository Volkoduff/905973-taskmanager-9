import {AbstractComponent} from './abstract-component';

export class LoadButton extends AbstractComponent {
  getTemplate() {
    return `<button class="load-more" type="button">load more</button>`;
  }
}
