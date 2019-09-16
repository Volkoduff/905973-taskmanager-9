import {TaskList} from './../task-list';
import {Board} from './../board';
import {Sort} from './../sort';
import {Filter} from './../filter';
// import {FilterWrap} from './../filter-wrap';
import {LoadButton} from './../load-more-button';
import {NoTask} from './../no-tasks';
import {render, unrender} from './../utils';
import {TaskListController} from "./task-list-controller";

const TaskConst = {
  EDIT_AMOUNT: 1,
  ADD_BY_CLICK: 8,
  TASKS_TO_DISPLAY: 8,
};

export class BoardController {
  constructor(container) {
    this._container = container;
    this._tasks = [];
    this._board = new Board();
    this._taskList = new TaskList();
    this._filter = new Filter();
    this._loadButton = new LoadButton();
    this._sort = new Sort();
    this._noTaskText = new NoTask();
    this._showedTasks = 0;
    this._isButtonRendered = false;
    this._taskListController = new TaskListController(this._taskList.getElement(), this._onDataChange.bind(this), this._onTaskDelete, this._sort);
    this.init();
  }

  init() {
    render(this._container, this._board.getElement());
    this._renderBoard();


  }

  hide() {
    this._board.getElement().classList.add(`visually-hidden`);
  }

  show(tasks) {
    this._tasks = tasks;
    this._setTasks(this._tasks);
    this._board.getElement().classList.remove(`visually-hidden`);
  }

  _setTasks(tasks) {
    if (!tasks.length) {
      render(this._container, this._noTaskText.getElement());
    }
    this._tasks = tasks;
    this._renderBoard();
  }

  _renderBoard() {
    unrender(this._loadButton.getElement());
    this._loadButton.removeElement();
    if (this._tasks.length) {
      render(this._board.getElement(), this._sort.getElement());
      render(this._board.getElement(), this._taskList.getElement());
      this._taskListController.setTasks(this._tasks.slice(0, TaskConst.TASKS_TO_DISPLAY));
    } else {
      this._taskListController.setTasks(null);
    }

    if (this._tasks.length > TaskConst.TASKS_TO_DISPLAY) {
      this._showedTasks = TaskConst.TASKS_TO_DISPLAY;
      this._renderLoadButton();
    }
    this._sort.getElement()
      .addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  _onTaskDelete() {
    unrender(this._sort.getElement());
    this._sort.removeElement();
    render(this._container, this._noTaskText.getElement());
  }

  _onDataChange(newData, oldData) {
    const index = this._tasks.findIndex((task) => task === oldData);
    if (newData === null && index !== -1) {
      this._tasks = [...this._tasks.slice(0, index), ...this._tasks.slice(index + 1)];
      this._showedTasks = Math.min(this._showedTasks, this._tasks.length);
    } else if (oldData === null) {
      this._tasks = [newData, ...this._tasks];
    } else {
      this._tasks[index] = newData;
    }
    this._renderBoard();
    this._reRenderFilter();
  }

  _reRenderFilter() {
    unrender(document.querySelector(`.main__filter`));
    unrender(this._filter.getElement());
    this._filter.removeElement();

    this._filter.init(this._tasks);
    render(this._board.getElement(), this._filter.getElement(), `beforebegin`);
  }
  _renderButtonIfNotRendered() {
    if (!this._isButtonRendered) {
      this._showedTasks = this._tasks.slice(0, TaskConst.TASKS_TO_DISPLAY).length;
      this._showedTasks = TaskConst.TASKS_TO_DISPLAY;
      this._renderLoadButton();
    }
  }

  _ifTooMuchTasks() {
    return this._showedTasks >= TaskConst.TASKS_TO_DISPLAY;
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
          this._taskListController.setTasks(this._tasks
            .sort((a, b) => a.dueDate - b.dueDate)
            .slice(0, TaskConst.TASKS_TO_DISPLAY));
          this._renderButtonIfNotRendered();
        } else {
          this._taskListController.setTasks(this._tasks
            .sort((a, b) => a.dueDate - b.dueDate));
        }
        break;
      case `date-down`:
        if (this._ifTooMuchTasks) {
          this._taskListController.setTasks(this._tasks
            .sort((a, b) => b.dueDate - a.dueDate)
            .slice(0, TaskConst.TASKS_TO_DISPLAY));
          this._renderButtonIfNotRendered();
        } else {
          this._taskListController.setTasks(this._tasks
            .sort((a, b) => b.dueDate - a.dueDate));
        }
        break;
      case `default`:
        if (this._ifTooMuchTasks) {
          this._taskListController.setTasks(this._tasks
            .sort((a, b) => {
              if (a.description < b.description) {
                return -1;
              }
              if (a.description > b.description) {
                return 1;
              }
              return 0;
            }).slice(0, TaskConst.TASKS_TO_DISPLAY));
          this._renderButtonIfNotRendered();
        } else {
          this._taskListController.setTasks(this._tasks
            .sort((a, b) => {
              if (a.description < b.description) {
                return -1;
              }
              if (a.description > b.description) {
                return 1;
              }
              return 0;
            }));
        }
        break;
    }
  }

  createTask() {
    this._taskListController.createTask();
  }

  _renderLoadButton() {
    this._loadButton = new LoadButton();
    this._loadButton.getElement()
      .addEventListener(`click`, () => {
        this._taskListController.addTasks(this._tasks.slice(this._showedTasks));
        this._showedTasks += this._tasks.slice(this._showedTasks).length;
        if (this._showedTasks >= this._tasks.length) {
          unrender(this._loadButton.getElement());
          this._loadButton.removeElement();
          this._isButtonRendered = false;
        }
      });
    render(this._board.getElement(), this._loadButton.getElement());
    this._isButtonRendered = true;
  }

  get tasks() {
    return this._tasks;
  }

}
