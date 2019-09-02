import {Task} from './../task';
import {TaskEdit} from './../task-edit';
import {render, unrender} from "../utils";

export class TaskController {
  constructor(container, tasks, index, onDataChange, onChangeView, onTaskDelete) {
    this._container = container;
    this._tasks = tasks;
    this._index = index;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._onTaskDelete = onTaskDelete;
    this._taskView = new Task(tasks);
    this._taskEdit = new TaskEdit(this._tasks, this._index);
    this.create();
  }

  create() {
    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape`) {
        this._container.getElement().replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._taskEdit.getElement()
      .querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, () => this._taskEdit._onClickToggleDate());

    this._taskEdit.getElement()
      .querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, () => this._taskEdit._onClickToggleRepeatDays());

    this._taskView.getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, () => {
        this._onChangeView();
        this._container.getElement().replaceChild(this._taskEdit.getElement(), this._taskView.getElement());
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
        unrender(this._taskEdit.getElement());
        this._taskEdit.removeElement();
        if (!this._container.getElement().children.length) {
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
      document.addEventListener(`keydown`, (evt) => this._taskEdit._onEnterHashTagRender(evt));
    });

    this._hashTagInput.addEventListener(`blur`, () => {
      document.removeEventListener(`keydown`, (evt) => this._taskEdit._onEnterHashTagRender(evt));
    });

    const onSubmit = (evt) => {
      evt.preventDefault();
      const formData = new FormData(this._taskEdit.getElement().querySelector(`.card__form`));
      formData.getAll(`textarea`);
      const entry = {
        description: formData.get(`text`),
        color: formData.get(`color`),
        tags: new Set(formData.getAll(`hashtag`)),
        dueDate: formData.get(`date`),
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
      this._onDataChange(entry, this._tasks);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    this._taskEdit.getElement()
      .querySelector(`.card__form`)
      .addEventListener(`submit`, onSubmit);
    render(this._container.getElement(), this._taskView.getElement());

    this._taskEdit.getElement()
      .querySelectorAll(`.card__color-input`)
      .forEach((el) => el
        .addEventListener(`change`, (evt) => this._taskEdit._onChangeColor(evt))
      );
  }

  setDefaultView() {
    if (this._container.getElement().contains(this._taskEdit.getElement())) {
      this._container.getElement().replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
    }
  }

}
