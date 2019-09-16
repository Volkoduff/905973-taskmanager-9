import {Task} from './../task';
import {TaskEdit} from './../task-edit';
import {render, unrender} from "../utils";
import moment from "moment";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
};

export class TaskController {
  constructor(container, tasks, index, onDataChange, onChangeView, onTaskDelete, mode, isCreatingTask) {
    this._container = container;
    this._tasks = tasks;
    this._index = index;
    this._isCreatingTask = isCreatingTask; // Убрать Везде
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._onTaskDelete = onTaskDelete;
    this._taskView = new Task(tasks);
    this._taskEdit = new TaskEdit(this._tasks, this._index, this._tasks);
    this.create(mode);
  }

  create(mode) {
    let renderPosition = `beforeend`;
    let currentView = this._taskView;
    if (mode === Mode.ADDING) {
      renderPosition = `afterbegin`;
      currentView = this._taskEdit;
    }

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        if (mode === Mode.DEFAULT) {
          if (this._container.contains(this._taskEdit.getElement())) {
            this._container.replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
          }
        } else if (mode === Mode.ADDING) {
          this._container.removeChild(currentView.getElement());
        }
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._taskEdit.getElement()
      .querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, () => this._taskEdit.onClickToggleDate());

    this._taskEdit.getElement()
      .querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, () => this._taskEdit.onClickToggleRepeatDays());

    this._taskView.getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, () => {
        this._onChangeView();
        this._container.replaceChild(this._taskEdit.getElement(), this._taskView.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement()
      .querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement()
      .querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement().querySelector(`.card__delete`)
      .addEventListener(`click`, () => {
        if (this._isCreatingTask) {
          this._isCreatingTask = null;
        }
        this._onDataChange(null, this._tasks, this._isCreatingTask);
        if (!this._container.children.length) {
          this._onTaskDelete();
        }
      });

    // Тэги
    [...this._taskEdit.getElement().querySelectorAll(`.card__hashtag-delete`)]
      .forEach((el) => el.addEventListener(`click`, () => {
        unrender(el.parentElement);
      }));

    this._hashTagInput = this._taskEdit.getElement()
      .querySelector(`.card__hashtag-input`);

    this._hashTagInput.addEventListener(`focus`, () => {
      document.addEventListener(`keydown`, (evt) => this._taskEdit.onEnterHashTagRender(evt));
    });

    this._hashTagInput.addEventListener(`blur`, () => {
      document.removeEventListener(`keydown`, (evt) => this._taskEdit.onEnterHashTagRender(evt));
    });

    [...this._taskEdit.getElement().querySelectorAll(`.card__btn`)]
      .forEach((el) => el.addEventListener(`click`, (evt) => evt.target.classList.toggle(`card__btn--disabled`)));

    const onSubmit = (evt) => {
      evt.preventDefault();
      const cardForm = this._taskEdit.getElement().querySelector(`.card__form`);
      const formData = new FormData(cardForm);
      formData.getAll(`textarea`);
      const entry = {
        description: formData.get(`text`),
        color: formData.get(`color`),
        tags: new Set(formData.getAll(`hashtag`)),
        dueDate: moment(formData.get(`date`)).valueOf(),
        repeatingDays: formData.getAll(`repeat`).reduce((acc, it) => {
          acc[it] = true;
          return acc;
        }, {
          'mo': false,
          'tu': false,
          'we': false,
          'th': false,
          'fr': false,
          'sa': false,
          'su': false,
        }),
      };
      // eslint-disable-next-line no-unused-expressions
      cardForm.querySelector(`.card__btn--favorites`)
        .classList.contains(`card__btn--disabled`) ? entry.isFavorite = false : entry.isFavorite = true;
      // eslint-disable-next-line no-unused-expressions
      cardForm.querySelector(`.card__btn--archive`)
        .classList.contains(`card__btn--disabled`) ? entry.isArchive = false : entry.isArchive = true;
      this._onDataChange(entry, mode === Mode.DEFAULT ? this._tasks : null);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    this._taskEdit.getElement()
      .querySelector(`.card__form`)
      .addEventListener(`submit`, onSubmit);
    render(this._container, currentView.getElement(), renderPosition);

    this._taskEdit.getElement()
      .querySelectorAll(`.card__color-input`)
      .forEach((el) => el
        .addEventListener(`change`, (evt) => this._taskEdit._onChangeColor(evt))
      );

  }

  setDefaultView() {
    if (this._container.contains(this._taskEdit.getElement())) {
      this._container.replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
    }
  }

}
