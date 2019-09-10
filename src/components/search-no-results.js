import {AbstractComponent} from './abstract-component';

export class SearchNoResults extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<p class="result__empty">no matches found...</p>`;
  }
}


