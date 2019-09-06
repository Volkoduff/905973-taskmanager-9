import {TaskList} from './../task-list';
import {Board} from './../board';
import {Sort} from './../sort';
import {LoadButton} from './../load-more-button';
import {NoTask} from './../no-tasks';
import {render, unrender} from './../utils';
import {TaskController} from "./task-controller";
const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
};

const TaskControllerMode = Mode;

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
    this._loadButton = new LoadButton();
    this._sort = new Sort();
    this._noTaskText = new NoTask();
    this._indexOfNextTaskRender = 0;
    this._isButtonRendered = false;
    this._creatingTask = null;
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

  hide() {
    this._board.getElement().classList.add(`visually-hidden`);
  }

  show() {
    this._board.getElement().classList.remove(`visually-hidden`);
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

  _onDataChange(newData, oldData, isCreating) {
    if (!isCreating) {
      this._creatingTask = isCreating;
    }

    const index = this._tasks.findIndex((task) => task === oldData);
    if (newData === null && index !== -1) {
      this._tasks = [...this._tasks.slice(0, index), ...this._tasks.slice(index + 1)];
      this._showedTasks = Math.min(this._showedTasks, this._tasks.length);
    } else if (oldData === null) {
      this._creatingTask = null;
      this._tasks = [newData, ...this._tasks];
    } else {
      this._tasks[index] = newData;
    }
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

  _renderTask(task, index) {
    const taskController = new TaskController(this._taskList, task, index, this._onDataChange, this._onChangeView, this._onTaskDelete, TaskControllerMode.DEFAULT);
    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }
    const defaultTask = {
      description: `Task description`,
      dueDate: new Date(),
      tags: new Set(),
      color: [],
      repeatingDays: {
        'mo': false,
        'tu': false,
        'we': false,
        'th': false,
        'fr': false,
        'sa': false,
        'su': false,
      },
      isFavorite: false,
      isArchive: false,
    };
    this._creatingTask = new TaskController(this._taskList, defaultTask, null, this._onDataChange, this._onChangeView, this._onTaskDelete, TaskControllerMode.ADDING, this._creatingTask);
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
