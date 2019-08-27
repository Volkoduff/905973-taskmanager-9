import {TaskList} from './../task-list';
import {TaskEdit} from './../task-edit';
import {Board} from './../board';
import {Sort} from './../sort';
import {LoadButton} from './../load-more-button';
import {Task} from './../task';
import {NoTask} from './../no-tasks';
import {render, unrender} from './../utils';

const TaskConst = {
  EDIT_AMOUNT: 1,
  ADD_BY_CLICK: 8,
  DISPLAY_FIRST_TASKS: 8,
};

export class BoardController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._board = new Board();
    this._taskList = new TaskList();
    this._sort = new Sort();
    this._loadButton = new LoadButton();
    this._noTaskText = new NoTask();
    this._indexOfNextTaskRender = 0;
    this._isButtonRendered = false;
  }

  init() {
    render(this._container, this._board.getElement());

    if (this._tasks.length) {
      render(this._board.getElement(), this._sort.getElement());
      render(this._board.getElement(), this._taskList.getElement());
      this._tasks
        .filter((mockTask, it) => it < TaskConst.DISPLAY_FIRST_TASKS)
        .forEach((mockTask, it) => this._renderTask(mockTask, it));
    } else {
      this._renderNoTaskText();
    }

    if (this._tasks.length > TaskConst.ADD_BY_CLICK) {
      this._indexOfNextTaskRender += TaskConst.DISPLAY_FIRST_TASKS;
      this._renderLoadButton();
    }

    this._sort.getElement()
      .addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  _renderButtonIfNotRendered() {
    if (!this._isButtonRendered) {
      this._renderLoadButton();
    }
  }

  _ifTooMuchTasks() {
    return this._indexOfNextTaskRender >= TaskConst.DISPLAY_FIRST_TASKS;
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `A`) {
      return;
    }
    this._taskList.getElement().innerHTML = ``;

    switch (evt.target.dataset.sortType) {
      case `date-up`:
        if (this._ifTooMuchTasks) {
          this._tasks
            .sort((a, b) => a.dueDate - b.dueDate)
            .filter((mockTask, it) => TaskConst.DISPLAY_FIRST_TASKS > it)
            .forEach((mockTask, it) => this._renderTask(mockTask, it));
          this._indexOfNextTaskRender = TaskConst.DISPLAY_FIRST_TASKS;
          this._renderButtonIfNotRendered();
        } else {
          this._tasks
            .sort((a, b) => a.dueDate - b.dueDate)
            .forEach((mockTask, it) => this._renderTask(mockTask, it));
        }
        break;
      case `date-down`:
        if (this._ifTooMuchTasks) {
          this._tasks
            .sort((a, b) => b.dueDate - a.dueDate)
            .filter((mockTask, it) => TaskConst.DISPLAY_FIRST_TASKS > it)
            .forEach((mockTask, it) => this._renderTask(mockTask, it));
          this._indexOfNextTaskRender = TaskConst.DISPLAY_FIRST_TASKS;
          this._renderButtonIfNotRendered();
        } else {
          this._tasks
            .sort((a, b) => b.dueDate - a.dueDate)
            .forEach((mockTask, it) => this._renderTask(mockTask, it));
        }
        break;
      case `default`:
        if (this._ifTooMuchTasks) {
          this._tasks.sort((a, b) => {
            if (a.description < b.description) {
              return -1;
            } else if (a.description > b.description) {
              return 1;
            } else {
              return 0;
            }
          }).filter((mockTask, it) => TaskConst.DISPLAY_FIRST_TASKS > it)
            .forEach((mockTask, it) => this._renderTask(mockTask, it));
          this._indexOfNextTaskRender = TaskConst.DISPLAY_FIRST_TASKS;
          this._renderButtonIfNotRendered();
        } else {
          this._tasks.sort((a, b) => {
            if (a.description < b.description) {
              return -1;
            } else if (a.description > b.description) {
              return 1;
            } else {
              return 0;
            }
          }).forEach((mockTask, it) => this._renderTask(mockTask, it));
        }
        break;
    }
  }

  _clearBoard() {
    unrender(this._taskList.getElement());
    unrender(this._sort.getElement());
  }

  _renderNoTaskText() {
    render(this._board.getElement(), this._noTaskText.getElement());
  }

  _renderLoadButton() {
    const loadButton = new LoadButton();

    loadButton.getElement()
      .addEventListener(`click`, () => {
        this._tasks
          .filter((task, it) => it >= this._indexOfNextTaskRender && it < this._indexOfNextTaskRender + TaskConst.ADD_BY_CLICK)
          .forEach((mockTask, it) => this._renderTask(mockTask, it));
        this._indexOfNextTaskRender += TaskConst.ADD_BY_CLICK;
        if (this._indexOfNextTaskRender > this._tasks.length) {
          unrender(loadButton.getElement());
          this._isButtonRendered = false;
        }
      });
    render(this._board.getElement(), loadButton.getElement());
    this._isButtonRendered = true;
  }

  _renderTask(task, index) {
    const taskComponent = new Task(task);
    const taskEditComponent = new TaskEdit(task, index);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape`) {
        this._taskList.getElement().replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    taskComponent.getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, () => {
        this._taskList.getElement().replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    taskEditComponent.getElement()
      .querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    taskEditComponent.getElement()
      .querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    taskEditComponent.getElement().querySelector(`.card__delete`)
      .addEventListener(`click`, () => {
        unrender(taskEditComponent.getElement());
        taskEditComponent.removeElement();
        if (!this._taskList.getElement().children.length) {
          this._clearBoard();
          this._renderNoTaskText();
        }
      });

    taskEditComponent.getElement()
      .querySelector(`.card__form`)
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();
        this._taskList.getElement().replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    render(this._taskList.getElement(), taskComponent.getElement());
  }

}
