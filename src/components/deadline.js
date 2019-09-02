import {AbstractComponent} from './abstract-component';

export class Deadline extends AbstractComponent {
  constructor(dueDate) {
    super();
    this._dueDate = dueDate;
  }

  _dateCheck() {
    let date = new Date(this._dueDate);
    if (this._dueDate === null || ``) {
      date = new Date(Date.now());
    }
    return date;
  }

  getTemplate() {
    return `<fieldset class="card__date-deadline">
              <label class="card__input-deadline-wrap">
                <input
                  class="card__date"
                  type="text"
                  placeholder=""
                  name="date"
                  value="${this._dateCheck()}"
                />
              </label>
            </fieldset>`;
  }
}
