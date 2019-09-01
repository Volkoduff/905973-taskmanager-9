import {AbstractComponent} from './abstract-component';

export class RepeatDays extends AbstractComponent {
  constructor({repeatingDays, id}) {
    super();
    this._repeatingDays = repeatingDays;
    this._id = id;
  }

  getTemplate() {
    return `<fieldset class="card__repeat-days">
              <div class="card__repeat-days-inner">
              ${Object.keys(this._repeatingDays).map((day) =>`<input
              class="visually-hidden card__repeat-day-input"
              type="checkbox"
              id="repeat-${day}-${this._id}"
              name="repeat"
              value="${day}"
              ${this._repeatingDays[day] ? `checked` : ``}
              >
            <label class="card__repeat-day" for="repeat-${day}-${this._id}"
              >${day}</label
            >`).join(``)}
              </div>
            </fieldset>`;
  }
}
