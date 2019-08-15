import {getMenuMarkup} from './components/menu';
import {getSearchMarkup} from './components/search';
import {getFilterMarkup} from './components/filter';
import {getBoardMarkup} from './components/board';
import {getTaskEditMarkup} from './components/task-edit';
import {getTaskMarkup} from './components/task';
import {getLoadMoreButtonMarkup} from './components/load-more-button';
import {getTaskData, filter} from './components/data';

const taskConst = {
  ALL: 22,
  ADD_BY_CLICK: 8,
};

const componentRendering = (container, markup, position = `beforeend`) => {
  container.insertAdjacentHTML(position, markup);
};
const taskRender = (container, tasksAmount) => {
  container.insertAdjacentHTML(`beforeend`, new Array(tasksAmount)
    .fill(``)
    .map(getTaskData)
    .splice(0, 1)
    .map(getTaskEditMarkup)
    .join(``)
  );
  container.insertAdjacentHTML(`beforeend`, new Array(tasksAmount)
    .fill(``)
    .slice(1)
    .map(getTaskData)
    .map(getTaskMarkup)
    .join(``)
  );
};

const menuContainer = document.querySelector(`.control`);
componentRendering(menuContainer, getMenuMarkup());

const mainContainer = document.querySelector(`.main`);
componentRendering(mainContainer, getSearchMarkup());
componentRendering(mainContainer, getBoardMarkup());

const boardContainer = document.querySelector(`.board`);
componentRendering(boardContainer, getLoadMoreButtonMarkup());

const boardTasks = document.querySelector(`.board__tasks`);
taskRender(boardTasks, taskConst.ALL);
componentRendering(boardContainer, getFilterMarkup(filter), `beforebegin`);

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
    el.style.display === `none` && index >= taskConst.ADD_BY_CLICK);

const toogleButton = () =>
  tasksToLoad().length > 0 ? displayButton() : hideButton();

const addExtraTasks = () => {
  tasksToLoad(taskConst.ADD_BY_CLICK)
    .slice(0, taskConst.ADD_BY_CLICK)
    .map((it) => {
      it.style.display = `block`;
    });
};

if (tasks().length > taskConst.ADD_BY_CLICK) {
  hideExtraTasks(taskConst.ADD_BY_CLICK);
}

loadButtonElement.addEventListener(`click`, () => {
  addExtraTasks();
  toogleButton();
});
