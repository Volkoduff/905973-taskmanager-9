import {getMenuMarkup} from './components/menu';
import {getSearchMarkup} from './components/search';
import {getFilterMarkup} from './components/filter';
import {getBoardMarkup} from './components/board';
import {getTaskEditMarkup} from './components/task-edit';
import {getTaskMarkup} from './components/task';
import {getLoadMoreButtonMarkup} from './components/load-more-button';
import {getTaskData, taskFilters} from './components/data';

const TaskConst = {
  EDIT_AMOUNT: 1,
  ALL: 23,
  ADD_BY_CLICK: 8,
};

const componentRendering = (container, markup, position = `beforeend`) => {
  container.insertAdjacentHTML(position, markup);
};

const counterForFilter = (filters, tasks) => {
  for (const el of filters) {
    el.count = tasks.filter(el.filter).length;
  }
};

const taskRender = (container, editCardAmount, tasksAmount) => {
  const tasks = Array.from({length: tasksAmount}, getTaskData);
  const editTask = Array.from({length: editCardAmount}, getTaskData);
  container.insertAdjacentHTML(`beforeend`, editTask
    .map(getTaskEditMarkup)
    .join(``)
    .concat(tasks
    .map(getTaskMarkup)
    .join(``)));
  counterForFilter(taskFilters, tasks);
};

const menuContainer = document.querySelector(`.control`);
componentRendering(menuContainer, getMenuMarkup());

const mainContainer = document.querySelector(`.main`);
componentRendering(mainContainer, getSearchMarkup());
componentRendering(mainContainer, getBoardMarkup());

const boardContainer = document.querySelector(`.board`);
componentRendering(boardContainer, getLoadMoreButtonMarkup());

const boardTasks = document.querySelector(`.board__tasks`);
taskRender(boardTasks, TaskConst.EDIT_AMOUNT, TaskConst.ALL);
componentRendering(boardContainer, getFilterMarkup(taskFilters), `beforebegin`);

const tasks = () => Array.from(document.querySelectorAll(`article`));
const loadButtonElement = document.querySelector(`.load-more`);

const hideButton = () => {
  loadButtonElement.style.display = `none`;
};
const displayButton = () => {
  loadButtonElement.style.display = `block`;
};

const hideExtraTasks = (amount) => {
  Array.from(tasks())
    .slice(amount)
    .forEach((el) => {
      el.style.display = `none`;
    });
};

const tasksToLoad = () => tasks()
  .filter((el, index) =>
    el.style.display === `none` && index >= TaskConst.ADD_BY_CLICK);

const toogleButton = () =>
  tasksToLoad().length > 0 ? displayButton() : hideButton();

const addExtraTasks = () => {
  tasksToLoad(TaskConst.ADD_BY_CLICK)
    .slice(0, TaskConst.ADD_BY_CLICK)
    .map((it) => {
      it.style.display = `block`;
    });
};

if (tasks().length > TaskConst.ADD_BY_CLICK) {
  hideExtraTasks(TaskConst.ADD_BY_CLICK);
}

loadButtonElement.addEventListener(`click`, () => {
  addExtraTasks();
  toogleButton();
});
