import {TaskList} from './../task-list';
import {TaskEdit} from './../task-edit';
import {Board} from './../board';
import {Sort} from './../sort';
import {render, unrender} from './../utils';
import {LoadButton} from './../load-more-button';
import {Task} from './../task';
import {NoTask} from './../no-tasks';

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
    this._savedTasksToRender = null;
  }

  init() {
    render(this._container, this._board.getElement());

    if (this._tasks().length) {
      render(this._board.getElement(), this._sort.getElement());
      render(this._board.getElement(), this._taskList.getElement());

      this._tasks()
        .filter((mockTask, it) => it < TaskConst.DISPLAY_FIRST_TASKS)
        .forEach((mockTask, it) => this._renderTask(mockTask, it));
    } else {
      this._renderNoTaskText();
    }

    if (this._tasks().length > TaskConst.ADD_BY_CLICK) {
      this._renderLoadButton();
      this._savedTasksToRender = Array.from(this._tasks()
        .filter((mockTask, it) => it >= TaskConst.DISPLAY_FIRST_TASKS));
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
        this._savedTasksToRender
        .splice(0, TaskConst.ADD_BY_CLICK)
        .forEach((mockTask, it) => this._renderTask(mockTask, it));
        if (!this._savedTasksToRender.length) {
          unrender(loadButton.getElement());
        }
      });

    render(this._board.getElement(), loadButton.getElement());
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
