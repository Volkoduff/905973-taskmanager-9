import {AbstractComponent} from './abstract-component';

export class SearchResult extends AbstractComponent {
  constructor() {
    super();
    // this._title = title;
    // this._count = count;
  }

  getTemplate() {
    return `<section class="result container">
  <button class="result__back">back</button>

  </section>`;
  }
}


