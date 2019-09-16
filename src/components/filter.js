import {AbstractComponent} from './abstract-component';
import {taskFilters} from './data';


export class Filter extends AbstractComponent {
  constructor() {
    super();
    this._taskFilters = taskFilters;
  }

  init(tasks) {
    this._taskFilters = taskFilters;
    this._counterForFilter(this._taskFilters, tasks);
  }

  _counterForFilter(filters, tasks) {
    for (const el of filters) {
      el.count = tasks.filter(el.filter).length;
    }
  }

  getTemplate() {
    return `<section class="main__filter filter container">
${this._taskFilters.map((input) => `<input
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
