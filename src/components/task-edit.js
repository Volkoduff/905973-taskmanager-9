import {createElement} from './utils';

import {Colors} from './data';

export class TaskEdit {
  constructor({description, tags, color, colors, dueDate, repeatingDays, isFavorite, isArchive}, index) {
    this._description = description;
    this._tags = tags;
    this._color = color;
    this._colors = colors;
    this._dueDate = dueDate;
    this._repeatingDays = repeatingDays;
    this._isFavorite = isFavorite;
    this._isArchive = isArchive;
    this._element = null;
    this._id = index;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
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
            <button class="card__date-deadline-toggle" type="button">
              date: <span class="card__date-status">yes</span>
            </button>

            <fieldset class="card__date-deadline">
              <label class="card__input-deadline-wrap">
                <input
                  class="card__date"
                  type="text"
                  placeholder=""
                  name="date"
                  value="23 September 11:15 PM"
                />
              </label>
            </fieldset>

            <button class="card__repeat-toggle" type="button">
              repeat:<span class="card__repeat-status">yes</span>
            </button>
            <fieldset class="card__repeat-days">
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
            </fieldset>
          </div>

          <div class="card__hashtag">
            <div class="card__hashtag-list">
              <span class="card__hashtag-inner">
                <input
                  type="hidden"
                  name="hashtag"
                  value="repeat"
                  class="card__hashtag-hidden-input"
                />
                <p class="card__hashtag-name">
                  #repeat
                </p>
                <button type="button" class="card__hashtag-delete">
                  delete
                </button>
              </span>

              <span class="card__hashtag-inner">
                <input
                  type="hidden"
                  name="hashtag"
                  value="repeat"
                  class="card__hashtag-hidden-input"
                />
                <p class="card__hashtag-name">
                  #cinema
                </p>
                <button type="button" class="card__hashtag-delete">
                  delete
                </button>
              </span>

              <span class="card__hashtag-inner">
                <input
                  type="hidden"
                  name="hashtag"
                  value="repeat"
                  class="card__hashtag-hidden-input"
                />
                <p class="card__hashtag-name">
                  #entertaiment
                </p>
                <button type="button" class="card__hashtag-delete">
                  delete
                </button>
              </span>
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
             >`
  ).join(``)}

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
