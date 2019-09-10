import {AbstractComponent} from './abstract-component';

export class SearchResultGroup extends AbstractComponent {
  constructor() {
    super();
    // this._title = title;
    // this._count = count;
  }

  getTemplate() {
    return `<section class="result__group">
          <div class="result__cards">
          </div>
        </section>`;
  }
}
