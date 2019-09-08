import {TaskController, Mode as TaskControllerMode} from './../controllers/task-controller';

import {NoTask} from "../no-tasks";

export class TaskListController {
  constructor(container, onDataChange, onTaskDelete, sort) {
    this._container = container;
    this._onDataChangeMain = onDataChange;
    this._onTaskDelete = onTaskDelete;
    this._creatingTask = null;
    this._subscriptions = [];
    this._sort = sort;
    this._noTaskText = new NoTask();
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  setTasks(tasks) {
    this._subscriptions = [];
    this._container.innerHTML = ``;
    if (tasks === null) {
      this._onTaskDelete();
    } else if (tasks !== undefined) {
      tasks.forEach((task, it) => this._renderTask(task, it));
    }
  }

  addTasks(tasks) {
    tasks.forEach((task, it) => this._renderTask(task, it));
    tasks.concat(tasks);
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
    this._creatingTask = new TaskController(this._container, defaultTask, null, this._onDataChange, this._onChangeView, this._onTaskDelete, TaskControllerMode.ADDING);
  }

  _renderTask(task, index) {
    const taskController = new TaskController(this._container, task, index, this._onDataChange, this._onChangeView, this._onTaskDelete, TaskControllerMode.DEFAULT);
    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onDataChange(newData, oldData, isCreating) {
    this._creatingTask = isCreating;
    this._onDataChangeMain(newData, oldData);
  }
}
