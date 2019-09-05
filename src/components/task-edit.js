import {AbstractComponent} from './abstract-component';
import {Colors} from './data';
import {Deadline} from "./deadline";
import {RepeatDays} from "./repeat-days";
import {HashTag} from "./hashtag";
import {render, unrender} from "./utils";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";
import moment from "moment";

const HASHTAG_MAX_LENGTH = 20;

export class TaskEdit extends AbstractComponent {
  constructor({description, tags, color, dueDate, repeatingDays, isFavorite, isArchive}, index, tasks) {
    super();
    this._tags = tags;
    this._tasks = tasks;
    this._color = color;
    this._description = description;
    this._dueDate = dueDate;
    this._repeatingDays = repeatingDays;
    this._isFavorite = isFavorite;
    this._isArchive = isArchive;
    this._id = index;
    this.init();
  }

  init() {
    if (this.getElement().querySelector(`.card__date`)) {
      flatpickr(this.getElement().querySelector(`.card__date`), {
        altInput: true,
        altFormat: `j F`,
        allowInput: false,
        defaultDate: this._tasks.dueDate,
      });
    }
  }

  _repeatingDaysCheck() {
    let result = false;
    if (typeof this._repeatingDays === `object`) {
      for (const key in this._repeatingDays) {
        if (this._repeatingDays[key] === true) {
          result = true;
          break;
        }
      }
    }
    return result;
  }

  onClickToggleRepeatDays() {
    this._repeatStatus = this.getElement().querySelector(`.card__repeat-status`);
    switch (this._repeatStatus.textContent.toLowerCase().trim()) {
      case `yes`:
        this._repeatStatus.textContent = `no`;
        const repeatDays = this.getElement()
          .querySelector(`.card__repeat-days`);
        unrender(repeatDays);
        this.dueDate = ``;
        break;
      case `no`:
        this._repeatStatus.textContent = `yes`;
        this._repeatDays = new RepeatDays(this._repeatingDays, this._id);
        const datesWrap = this.getElement()
          .querySelector(`.card__dates`);
        render(datesWrap, this._repeatDays.getElement());
        break;
    }
  }

  onEnterHashTagRender(evt) {
    if (evt.key === `Enter` && evt.target.nodeName === `INPUT`) {
      evt.preventDefault();
      const hashTagInput = this.getElement()
        .querySelector(`.card__hashtag-input`);
      if (hashTagInput.value !== `` && hashTagInput.value.length < HASHTAG_MAX_LENGTH) {
        this._tags.add(hashTagInput.value);
        const hashTag = new HashTag(hashTagInput.value);
        hashTag.getElement().addEventListener(`click`, () => {
          unrender(hashTag.getElement());
        });
        const hashTagWrap = this.getElement().querySelector(`.card__hashtag-list`);
        render(hashTagWrap, hashTag.getElement());
        hashTagInput.value = ``;
      }
    }
  }

  onClickToggleDate() {
    this._dateStatus = this.getElement().querySelector(`.card__date-status`);
    switch (this._dateStatus.textContent.toLowerCase().trim()) {
      case `yes`:
        this._dateStatus.textContent = `no`;
        const deadline = this.getElement()
          .querySelector(`.card__date-deadline`);
        deadline.querySelector(`.card__date`).value = ``;
        unrender(deadline);
        // this.dueDate = moment().format(`D MMMM`);
        break;
      case `no`:
        this._dateStatus.textContent = `yes`;
        this._deadline = new Deadline(this._dueDate);
        const elementBeforeDeadline = this.getElement()
          .querySelector(`.card__date-deadline-toggle`);
        render(elementBeforeDeadline, this._deadline.getTemplate(), `afterend`);
        break;
    }
  }

  _onChangeColor(evt) {
    const elementClasses = this.getElement().classList;
    elementClasses.remove(`card--${this._color}`);
    this._color = evt.target.value;
    elementClasses.add(`card--${evt.target.value}`);
  }

  getTemplate() {
    return `<article class="card card--edit card--${this._color} ${Object.keys(this._repeatingDays).some((day) => this._repeatingDays[day]) ? `card--repeat` : ``}">
  <form class="card__form" method="get">
    <div class="card__inner">
      <div class="card__control">
        <button type="button" class="card__btn card__btn--archive ${this._isArchive ? `` : `card__btn--disabled`} ">
          archive
        </button>
        <button
          type="button"
          class="card__btn card__btn--favorites ${this._isFavorite ? `` : `card__btn--disabled`} ">
          favorites
        </button>
      </div>

      <div class="card__color-bar">
        <svg class="card__color-bar-wave" width="100%" height="10">
          <use xlink:href="#wave"></use>
        </svg>
      </div>

      <div class="card__textarea-wrap">
        <label>
          <textarea
            class="card__text"
            placeholder="Start typing your text here..."
            name="text"
          >${this._description}</textarea>
        </label>
      </div>
      <div class="card__settings">
        <div class="card__details">
          <div class="card__dates">
${this._dueDate === null ?
    `<button class="card__date-deadline-toggle" type="button">
              date: <span class="card__date-status">no</span>
            </button>` :
    `<button class="card__date-deadline-toggle" type="button">
              date: <span class="card__date-status">yes</span>
            </button>
            <fieldset class="card__date-deadline">
              <label class="card__input-deadline-wrap">
                <input
                  class="card__date"
                  type="text"
                  placeholder=""
                  name="date"
                  value="${moment(this._dueDate).format(`D MMMM`)}"
                />
              </label>
            </fieldset>`}
            <button class="card__repeat-toggle" type="button">
              repeat:<span class="card__repeat-status">${this._repeatingDaysCheck() ? `yes` : `no`}</span>
            </button>
            <fieldset class="card__repeat-days">
              <div class="card__repeat-days-inner">
              ${this._repeatingDaysCheck() ? Object.keys(this._repeatingDays).map((day) =>`<input
              class="visually-hidden card__repeat-day-input"
              type="checkbox"
              id="repeat-${day}-${this._id}"
              name="repeat"
              value="${day}"
              ${this._repeatingDays[day] ? `checked` : ``}
              >
            <label class="card__repeat-day" for="repeat-${day}-${this._id}"
              >${day}</label
            >`).join(``) : `` }
              </div>
            </fieldset>
          </div>

          <div class="card__hashtag">
            <div class="card__hashtag-list">
            ${Array.from(this._tags).map((tag) =>`<span class="card__hashtag-inner">
                <input
                  type="hidden"
                  name="hashtag"
                  value="${tag}"
                  class="card__hashtag-hidden-input"
                />
                <p class="card__hashtag-name">
                  #${tag}
                </p>
                <button type="button" class="card__hashtag-delete">
                  delete
                </button>
              </span>`).join(``)}

            </div>

            <label>
              <input
                type="text"
                class="card__hashtag-input"
                name="hashtag-input"
                placeholder="Type new hashtag here"
              />
            </label>
          </div>
        </div>

        <div class="card__colors-inner">
          <h3 class="card__colors-title">Color</h3>
          <div class="card__colors-wrap">
          ${Colors.map((el) =>
    ` <input
               type="radio"
               id="color-${el}-${this._id}"
               class="card__color-input card__color-input--${el} visually-hidden"
               name="color"
               value="${el}"
               ${this._color === el ? `checked` : ``}
             />
             <label
               for="color-${el}-${this._id}"
               class="card__color card__color--${el}"
               >${el}</label
             >`).join(``)}
          </div>
        </div>
      </div>

      <div class="card__status-btns">
        <button class="card__save" type="submit">save</button>
        <button class="card__delete" type="button">delete</button>
      </div>
    </div>
  </form>
</article>`;
  }

}
