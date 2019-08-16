import {getMenuMarkup} from './components/menu';
import {getSearchMarkup} from './components/search';
import {getFilterWrapMarkup} from './components/filter-wrap';
import {getFilterMarkup} from './components/filter';
import {getBoardMarkup} from './components/board';
import {getTaskEditMarkup} from './components/task-edit';
import {getTaskMarkup} from './components/task';
import {getLoadMoreButtonMarkup} from './components/load-more-button';
import {taskFilters, tasksData} from './components/data';

const TaskConst = {
  EDIT_AMOUNT: 1,
  ADD_BY_CLICK: 8,
};

const componentRendering = (container, markup, position = `beforeend`) => {
  container.insertAdjacentHTML(position, markup);
};

const taskRender = (container, data) => {
  container.insertAdjacentHTML(`beforeend`, data
    .slice(0, TaskConst.EDIT_AMOUNT)
    .map(getTaskEditMarkup)
    .join(``)
    .concat(data
    .map(getTaskMarkup)
    .join(``)));
};
const filterRender = (container, data) => {
  container.insertAdjacentHTML(`beforeend`, data
    .map(getFilterMarkup)
    .join(``));
};

const menuContainer = document.querySelector(`.control`);
componentRendering(menuContainer, getMenuMarkup());

const mainContainer = document.querySelector(`.main`);
componentRendering(mainContainer, getSearchMarkup());
componentRendering(mainContainer, getFilterWrapMarkup());
componentRendering(mainContainer, getBoardMarkup());

const boardContainer = document.querySelector(`.board`);
componentRendering(boardContainer, getLoadMoreButtonMarkup());


const boardTasks = document.querySelector(`.board__tasks`);
taskRender(boardTasks, tasksData());

const mainFilterContainer = document.querySelector(`.main__filter`);
filterRender(mainFilterContainer, taskFilters);

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
