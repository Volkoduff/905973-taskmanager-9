import {TaskList} from './../task-list';
import {Board} from './../board';
import {Sort} from './../sort';
import {LoadButton} from './../load-more-button';
import {NoTask} from './../no-tasks';
import {render, unrender} from './../utils';
import {TaskController} from "./task-controller";

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

    this._subscriptions = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
    this._onTaskDelete = this._onTaskDelete.bind(this);
  }

  init() {
    render(this._container, this._board.getElement());
    if (!this._tasks.length) {
      this._renderNoTaskText();
    } else {
      this._renderBoard();
    }
  }

  _unRenderBoard() {
    unrender(this._loadButton.getElement());
    this._indexOfNextTaskRender = 0;
    unrender(this._taskList.getElement());
    this._taskList.removeElement();
  }

  _renderBoard() {
    this._unRenderBoard();
    if (this._tasks.length) {
      render(this._board.getElement(), this._sort.getElement());
      this._tasks
        .filter((mockTask, it) => it < TaskConst.DISPLAY_FIRST_TASKS)
        .forEach((mockTask, it) => this._renderTask(mockTask, it));
      render(this._board.getElement(), this._taskList.getElement());
    }
    if (this._tasks.length > TaskConst.ADD_BY_CLICK) {
      this._indexOfNextTaskRender += TaskConst.DISPLAY_FIRST_TASKS;
      this._renderLoadButton();
    }
    this._sort.getElement()
      .addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  _renderNoTaskText() {
    render(this._board.getElement(), this._noTaskText.getElement());
  }

  _renderTask(task, index) {
    const taskController = new TaskController(this._taskList, task, index, this._onDataChange, this._onChangeView, this._onTaskDelete);
    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  _onTaskDelete() {
    unrender(this._taskList.getElement());
    this._taskList.removeElement();
    unrender(this._sort.getElement());
    this._sort.removeElement();
    this._renderNoTaskText();
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onDataChange(newData, oldData) {

    this._tasks[this._tasks.findIndex((it) => it === oldData)] = newData;
    this._renderBoard(this._tasks);
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
            }
            if (a.description > b.description) {
              return 1;
            }
            return 0;
          }).filter((mockTask, it) => TaskConst.DISPLAY_FIRST_TASKS > it)
            .forEach((mockTask, it) => this._renderTask(mockTask, it));
          this._indexOfNextTaskRender = TaskConst.DISPLAY_FIRST_TASKS;
          this._renderButtonIfNotRendered();
        } else {
          this._tasks.sort((a, b) => {
            if (a.description < b.description) {
              return -1;
            }
            if (a.description > b.description) {
              return 1;
            }
            return 0;
          }).forEach((mockTask, it) => this._renderTask(mockTask, it));
        }
        break;
    }
  }

  _renderLoadButton() {
    this._loadButton = new LoadButton();
    this._loadButton.getElement()
      .addEventListener(`click`, () => {
        this._tasks
          .filter((task, it) => it >= this._indexOfNextTaskRender && it < this._indexOfNextTaskRender + TaskConst.ADD_BY_CLICK)
          .forEach((mockTask, it) => this._renderTask(mockTask, it));
        this._indexOfNextTaskRender += TaskConst.ADD_BY_CLICK;
        if (this._indexOfNextTaskRender > this._tasks.length) {
          unrender(this._loadButton.getElement());
          this._isButtonRendered = false;
        }
      });
    render(this._board.getElement(), this._loadButton.getElement());
    this._isButtonRendered = true;
  }

}
