import {AbstractComponent} from './abstract-component';

export class Deadline extends AbstractComponent {
  constructor({dueDate}) {
    super();
    this._dueDate = dueDate;
  }

  getTemplate() {
    return `<fieldset class="card__date-deadline">
              <label class="card__input-deadline-wrap">
                <input
                  class="card__date"
                  type="text"
                  placeholder=""
                  name="date"
                  value="${new Date(this._dueDate)}"
                />
              </label>
            </fieldset>`;
  }
}
