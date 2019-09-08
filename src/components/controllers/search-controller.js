import {render, unrender} from './../utils';
import {SearchResultInfo} from './../search-result-info';
import {TaskListController} from "./task-list-controller";
import {SearchResultGroup} from "./../result-group";
import {SearchResult} from "./../search-result";


export class SearchController {
  constructor(container, search, onBackButtonClick, onDataChange) {
    this._container = container;
    this._search = search;
    this._onDataChangeMain = onDataChange;
    this._onBackButtonClick = onBackButtonClick;
    this._tasks = [];
    this._searchResultInfo = new SearchResultInfo({});
    this._searchResultGroup = new SearchResultGroup({});
    this._searchResult = new SearchResult();
    this._taskListController = new TaskListController(this._searchResultGroup.getElement().querySelector(`.result__cards`), this._onDataChange.bind(this));
    this._init();
  }

  _init() {
    this.hide();
    render(this._container, this._searchResult.getElement());
    render(this._searchResult.getElement(), this._searchResultGroup.getElement());

    render(this._searchResultGroup.getElement(), this._searchResultInfo.getElement());

    this._searchResult.getElement().querySelector(`.result__back`)
      .addEventListener(`click`, () => {
        this._search.getElement().querySelector(`input`).value = ``;
        this._onBackButtonClick();
      });
    this._search.getElement().querySelector(`input`)
      .addEventListener(`keyup`, (evt) => {
        const {value} = evt.target;
        const tasks = this._tasks.filter((task) => {
          return task.description.includes(value);
        });

        this._showSearchResult(value, tasks);
      });
  }

  hide() {
    this._searchResult.getElement().classList.add(`visually-hidden`);
  }

  show(tasks) {
    this._tasks = tasks;
    if (this._searchResult.getElement().classList.contains(`visually-hidden`)) {
      this._showSearchResult(``, this._tasks);
      this._searchResult.getElement().classList.remove(`visually-hidden`);
    }
  }

  _showSearchResult(text, tasks) {
    if (this._searchResultInfo) {
      unrender(this._searchResultInfo.getElement());
      this._searchResultInfo.removeElement();
    }

    this._searchResultInfo = new SearchResultInfo({title: text, count: tasks.length});

    render(this._searchResultGroup.getElement(), this._searchResultInfo.getElement(), `afterbegin`);
    this._taskListController.setTasks(tasks);
  }

  _onDataChange(newData, oldData) {
    this._onDataChangeMain(newData, oldData);
    this._onBackButtonClick();
  }
}
