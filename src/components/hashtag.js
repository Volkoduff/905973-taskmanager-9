import {AbstractComponent} from './abstract-component';

export class HashTag extends AbstractComponent {
  constructor(tag) {
    super();
    this._tag = tag;
  }

  getTemplate() {
    return `<span class="card__hashtag-inner">
      <input
        type="hidden"
        name="hashtag"
        value="${this._tag}"
  class="card__hashtag-hidden-input"/>
      <p class="card__hashtag-name">
      #${this._tag}
      </p>
      <button type="button" class="card__hashtag-delete">
      delete
      </button>
      </span>`;
  }
}
