import {Task} from './../task';
import {TaskEdit} from './../task-edit';
import {HashTag} from './../hashtag';
import {Deadline} from './../deadline';
import {RepeatDays} from './../repeat-days';

import {render, unrender} from "../utils";

const HASHTAG_MAX_LENGTH = 20;

export class TaskController {
  constructor(container, tasks, index, onDataChange, onChangeView, onTaskDelete) {
    this._container = container;
    this._tasks = tasks;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._onTaskDelete = onTaskDelete;
    this._taskView = new Task(tasks);
    this._taskEdit = new TaskEdit(tasks, index);
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
      .addEventListener(`click`, () => {
        this._dateStatus = this._taskEdit.getElement().querySelector(`.card__date-status`);
        switch (this._dateStatus.textContent.toLowerCase().trim()) {
          case `yes`:
            this._dateStatus.textContent = `no`;
            const deadline = this._taskEdit.getElement()
              .querySelector(`.card__date-deadline`);
            deadline.querySelector(`.card__date`).value = ``;
            unrender(deadline);
            this._tasks.dueDate = ``;
            break;
          case `no`:
            this._dateStatus.textContent = `yes`;
            this._deadline = new Deadline(this._tasks);
            const elementBeforeDeadline = this._taskEdit.getElement()
              .querySelector(`.card__date-deadline-toggle`);
            render(elementBeforeDeadline, this._deadline.getTemplate(), `afterend`);
            break;
        }
      });

    this._taskEdit.getElement()
      .querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, () => {
        this._repeatStatus = this._taskEdit.getElement().querySelector(`.card__repeat-status`);
        switch (this._repeatStatus.textContent.toLowerCase().trim()) {
          case `yes`:
            this._repeatStatus.textContent = `no`;
            const repeatDays = this._taskEdit.getElement()
              .querySelector(`.card__repeat-days`);
            unrender(repeatDays);
            this._tasks.dueDate = ``;
            break;
          case `no`:
            this._repeatStatus.textContent = `yes`;
            this._repeatDays = new RepeatDays(this._tasks);
            const datesWrap = this._taskEdit.getElement().querySelector(`.card__dates`);
            render(datesWrap, this._repeatDays.getElement());
            break;
        }
      });

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

    [...this._taskEdit.getElement().querySelectorAll(`.card__hashtag-delete`)]
      .forEach((el) => el.addEventListener(`click`, () => {
        unrender(el.parentElement);
      }));

    this._hashTagInput = this._taskEdit.getElement()
      .querySelector(`.card__hashtag-input`);

    const onEnterHashTagRender = (evt) => {
      if (evt.key === `Enter` && evt.target.nodeName === `INPUT`) {
        evt.preventDefault();
        const hashTagInput = this._hashTagInput;
        if (hashTagInput.value !== `` && hashTagInput.value.length < HASHTAG_MAX_LENGTH) {
          this._renderHashTagFromInput(hashTagInput);
        }
      }
    };

    this._hashTagInput.addEventListener(`focus`, () => {
      document.addEventListener(`keydown`, onEnterHashTagRender);
    });

    this._hashTagInput.addEventListener(`blur`, () => {
      document.removeEventListener(`keydown`, onEnterHashTagRender);
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
  }

  _renderHashTagFromInput(element) {
    this._taskEdit._tags.add(element.value);
    const hashTag = new HashTag(element.value);
    hashTag.getElement().addEventListener(`click`, () => {
      unrender(hashTag.getElement());
    });
    const hashTagWrap = this._taskEdit.getElement().querySelector(`.card__hashtag-list`);
    render(hashTagWrap, hashTag.getElement());
    element.value = ``;
  }

  setDefaultView() {
    if (this._container.getElement().contains(this._taskEdit.getElement())) {
      this._container.getElement().replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
    }
  }

}
