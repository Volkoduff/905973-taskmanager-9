import {AbstractComponent} from './abstract-component';

export class Filter extends AbstractComponent {
  constructor(filter) {
    super();
    this._filter = filter;
  }

  getTemplate() {
    return `<section class="main__filter filter container">
${this._filter.map((input) => `<input
      type="radio"
      id="filter__all"
      class="filter__input visually-hidden"
      name="filter"
      checked
      ${input.count === 0 ? `disabled` : ``}
    />
    <label for="filter__all" class="filter__label">
   ${input.title}
    <span class="filter__all-count">${input.count}</span></label>`).join(``)}
  </section>`;
  }
}
