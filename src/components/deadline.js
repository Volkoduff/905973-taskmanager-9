import {AbstractComponent} from './abstract-component';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";
import moment from "moment";

export class Deadline extends AbstractComponent {
  constructor(dueDate) {
    super();
    this._dueDate = dueDate;
    this.init();
  }

  init() {
    flatpickr(this.getElement().querySelector(`.card__date`), {
      altInput: true,
      altFormat: `j F`,
      allowInput: false,
      defaultDate: this.dueDate,
    });
  }

  _dateCheck() {
    let date = moment(this._dueDate).format(`D MMMM`);
    if (this._dueDate === null || ``) {
      date = moment().format(`D MMMM`);
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
