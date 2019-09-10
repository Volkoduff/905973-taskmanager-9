import {render, unrender} from './../utils';
import {SearchResultInfo} from './../search-result-info';
import {TaskListController} from "./task-list-controller";
import {SearchResultGroup} from "./../result-group";
import {SearchResult} from "./../search-result";
import {SearchNoResults} from "./../search-no-results";
import moment from "moment";

const SEARCH_LETTERS_QUANTITY = 3;

export class SearchController {
  constructor(container, search, onBackButtonClick, onDataChange) {
    this._container = container;
    this._search = search;
    this._onDataChangeMain = onDataChange;
    this._onBackButtonClick = onBackButtonClick;
    this._tasks = [];
    this._isNoResultRendered = false;
    this._searchResultInfo = new SearchResultInfo({});
    this._searchNoResults = new SearchNoResults();
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
    this._renderNoResults(this._getResultCards());

    this._searchResult.getElement().querySelector(`.result__back`) // Очистка формы по Back
      .addEventListener(`click`, () => {
        this._search.getElement().querySelector(`input`).value = ``;
        this._onBackButtonClick();
      });
    this._search.getElement().querySelector(`input`)
      .addEventListener(`keyup`, (evt) => {
        const {value} = evt.target;
        if (value.length < SEARCH_LETTERS_QUANTITY) {
          return;
        }
        if (value[0].toLowerCase() === `d`) {
          this._filteredTasks = this._tasks.filter((task) => {
            const dateMask = `d${moment(task.dueDate).format(`DD.MM.YYYY`).slice(0, value.length - 1)}`;
            return dateMask === value;
          });
        } else if (value[0] === `#`) {
          this._filteredTasks = this._tasks.filter((task) => task.tags.has(value.slice(1, value.length)));
        } else {
          this._filteredTasks = this._tasks.filter((task) => {
            return task.description.toLowerCase().includes(value.toLowerCase());
          });
        }
        if (this._filteredTasks.length) {
          this._showSearchResult(value, this._filteredTasks);
          this._showResultCards();
          this._unRenderNoResults();
          this._isNoResultRendered = false;
        } else {
          this._showResultCards();
          this._showSearchResult(value, []);
        }
      });
  }

  _getResultCards() {
    return this._searchResultGroup.getElement().querySelector(`.result__cards`);
  }

  _hideResultCards() {
    if (!this._getResultCards().classList.contains(`visually-hidden`)) {
      this._getResultCards().classList.add(`visually-hidden`);
    }
  }

  _showResultCards() {
    if (this._getResultCards().classList.contains(`visually-hidden`)) {
      this._getResultCards().classList.remove(`visually-hidden`);
    }
  }

  _unRenderNoResults() {
    this._searchResultGroup.getElement().querySelector(`.result__empty`).classList.add(`visually-hidden`);
  }

  _renderNoResults(container) {
    if (!this._isNoResultRendered) {
      render(container, this._searchNoResults.getTemplate(), `beforebegin`);
      this._isNoResultRendered = true;
    }
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
    this._search.getElement().querySelector(`input`).value = ``;
    this._onBackButtonClick();
  }
}
