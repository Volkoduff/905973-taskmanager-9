import {AbstractComponent} from './abstract-component';
// import {render, unrender} from './utils';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";
import moment from "moment";
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export class Statistic extends AbstractComponent {
  constructor() {
    super();
    this.tasks = [];
    this._isReapeated = false;
  }

  init(tasks) {
    this.tasks = tasks;
    this._getCurrentWeekDates();
    this._taskLabels = this._getDueDates();
    this.dateLabels = this._taskLabels;

    this._flatpikrInit();

    this.getElement().querySelector(`.statistic__period-input`)
      .addEventListener(`change`, (evt) => {
        this._onChangeStat(evt);
      });

    this._setLabelsLengthToMarkUp();
    this._getCharts();
  }

  _getCharts() {
    document.querySelector(`.statistic__line-graphic`).classList.remove(`visually-hidden`);
    const daysCtx = document.querySelector(`.statistic__days`);
    document.querySelector(`.statistic__tags-wrap`).classList.remove(`visually-hidden`);
    const tagsCtx = document.querySelector(`.statistic__tags`);
    document.querySelector(`.statistic__colors-wrap`).classList.remove(`visually-hidden`);
    const colorsCtx = document.querySelector(`.statistic__colors`);

    this.daysChart = new Chart(daysCtx, {
      plugins: [ChartDataLabels],
      type: `line`,
      data: {
        labels: this._getDates(this.dateLabels),
        datasets: [{
          data: this._getDateQuantity(this.dateLabels),
          backgroundColor: `transparent`,
          borderColor: `#000000`,
          borderWidth: 1,
          lineTension: 0,
          pointRadius: 12,
          pointHoverRadius: 13,
          pointBackgroundColor: `#000000`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 12
            },
            color: `#ffffff`
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              display: false
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            ticks: {
              fontStyle: `bold`,
              fontColor: `#000000`
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }]
        },
        legend: {
          display: false
        },
        layout: {
          padding: {
            top: 15
          }
        },
        tooltips: {
          enabled: false
        }
      }
    });
    this.tagsChart = new Chart(tagsCtx, {
      plugins: [ChartDataLabels],
      type: `pie`,
      data: {
        labels: [`#watchstreams`, `#relaxation`, `#coding`, `#sleep`, `#watermelonpies`],
        datasets: [{
          data: [20, 15, 10, 5, 2],
          backgroundColor: [`#ff3cb9`, `#ffe125`, `#0c5cdd`, `#000000`, `#31b55c`]
        }]
      },
      options: {
        plugins: {
          datalabels: {
            display: false
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const allData = data.datasets[tooltipItem.datasetIndex].data;
              const tooltipData = allData[tooltipItem.index];
              const total = allData.reduce((acc, it) => acc + parseFloat(it));
              const tooltipPercentage = Math.round((tooltipData / total) * 100);
              return `${tooltipData} TASKS — ${tooltipPercentage}%`;
            }
          },
          displayColors: false,
          backgroundColor: `#ffffff`,
          bodyFontColor: `#000000`,
          borderColor: `#000000`,
          borderWidth: 1,
          cornerRadius: 0,
          xPadding: 15,
          yPadding: 15
        },
        title: {
          display: true,
          text: `DONE BY: TAGS`,
          fontSize: 16,
          fontColor: `#000000`
        },
        legend: {
          position: `left`,
          labels: {
            boxWidth: 15,
            padding: 25,
            fontStyle: 500,
            fontColor: `#000000`,
            fontSize: 13
          }
        }
      }
    });
    this.colorsChart = new Chart(colorsCtx, {
      plugins: [ChartDataLabels],
      type: `pie`,
      data: {
        labels: [`#pink`, `#yellow`, `#blue`, `#black`, `#green`],
        datasets: [{
          data: [5, 25, 15, 10, 30],
          backgroundColor: [`#ff3cb9`, `#ffe125`, `#0c5cdd`, `#000000`, `#31b55c`]
        }]
      },
      options: {
        plugins: {
          datalabels: {
            display: false
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const allData = data.datasets[tooltipItem.datasetIndex].data;
              const tooltipData = allData[tooltipItem.index];
              const total = allData.reduce((acc, it) => acc + parseFloat(it));
              const tooltipPercentage = Math.round((tooltipData / total) * 100);
              return `${tooltipData} TASKS — ${tooltipPercentage}%`;
            }
          },
          displayColors: false,
          backgroundColor: `#ffffff`,
          bodyFontColor: `#000000`,
          borderColor: `#000000`,
          borderWidth: 1,
          cornerRadius: 0,
          xPadding: 15,
          yPadding: 15
        },
        title: {
          display: true,
          text: `DONE BY: COLORS`,
          fontSize: 16,
          fontColor: `#000000`
        },
        legend: {
          position: `left`,
          labels: {
            boxWidth: 15,
            padding: 25,
            fontStyle: 500,
            fontColor: `#000000`,
            fontSize: 13
          }
        }
      }
    });
  }

  _getOneDateFilter(value) {
    const date = moment(value).format(`DD MMM`);
    this.dateLabels = this._taskLabels.filter((el) => el.date === date);
  }

  _getPeriodDatesFilter(value) {
    const dates = value.split(` to `);
    const periodStart = moment(dates[0]).format(`DD MMM`);
    const periodEnd = moment(dates[1]).format(`DD MMM`);
    this.dateLabels = this._taskLabels.filter((el) => el.date <= periodEnd && el.date >= periodStart);
  }

  _onChangeStat(evt) {
    const value = evt.target.value;
    if (value.length < 11) {
      this._getOneDateFilter(value);
    } else {
      this._getPeriodDatesFilter(value);
    }
    this._setLabelsLengthToMarkUp();

    this._getCharts();
  }

  _setLabelsLengthToMarkUp() {
    this.getElement().querySelector(`.statistic__task-found`)
      .textContent = this.dateLabels.length;
  }

  _getDates(labels) {
    this._dates = [];
    labels.map((el) => this._dates.push(el.date));
    return this._dates;
  }
  _getDateQuantity(labels) {
    this._dateQuantity = [];
    labels.map((el) => this._dateQuantity.push(el.count));
    return this._dateQuantity;
  }

  _getDueDates() {
    this.dateLabels = [];
    this._deadline = {
      counter() {
        this.count++;
      }
    };

    this.tasks
      .sort((a, b) => a.dueDate - b.dueDate)
      .forEach((task) => {
        this.currentDate = moment(task.dueDate).format(`DD MMM`);
        this._increaseCountIfRepeated();
        if (!this._isReapeated) {
          this._getNewDateInDates();
        }
      });
    this._isReapeated = false;
    return this.dateLabels;
  }

  _getNewDateInDates() {
    const newDeadline = Object.create(this._deadline);
    newDeadline.date = this.currentDate;
    newDeadline.count = 1;
    this.dateLabels.push(newDeadline);
  }

  _increaseCountIfRepeated() {
    for (let dateLabel of this.dateLabels) {
      if (dateLabel.date === this.currentDate) {
        dateLabel.counter();
        this._isReapeated = true;
        break;
      } else {
        this._isReapeated = false;
      }
    }
  }

  _getCurrentWeekDates() {
    const current = new Date();
    const weekstart = current.getDate() - current.getDay() + 1;
    const weekend = weekstart + 6;
    this._lastDayOfTheWeek = moment(current.setDate(weekstart)).format(`YYYY-MM-DD`);
    this._firstDayOfTheWeek = moment(current.setDate(weekend)).format(`YYYY-MM-DD`);
  }

  _flatpikrInit() {
    flatpickr(this.getElement().querySelector(`.statistic__period-input`), {
      altInput: true,
      altFormat: `j F`,
      mode: `range`,
      allowInput: false,
      defaultDate: [`${this._lastDayOfTheWeek}`, `${this._firstDayOfTheWeek}`],
    });
  }

  hide() {
    this.getElement().classList.add(`visually-hidden`);
  }


  getTemplate() {
    return `<section class="statistic container">
        <div class="statistic__line">
          <div class="statistic__period">
            <h2 class="statistic__period-title">Task Activity DIAGRAM</h2>

            <div class="statistic-input-wrap">
              <input
                class="statistic__period-input"
                type="text"
                placeholder="01 Feb - 08 Feb"
              />
            </div>

            <p class="statistic__period-result">
              In total for the specified period
              <span class="statistic__task-found">0</span> tasks were fulfilled.
            </p>
          </div>
          <div class="statistic__line-graphic visually-hidden">
            <canvas class="statistic__days" width="550" height="150"></canvas>
          </div>
        </div>

        <div class="statistic__circle">
          <div class="statistic__tags-wrap visually-hidden">
            <canvas class="statistic__tags" width="400" height="300"></canvas>
          </div>
          <div class="statistic__colors-wrap visually-hidden">
            <canvas class="statistic__colors" width="400" height="300"></canvas>
          </div>
        </div>
      </section>`;
  }
}
