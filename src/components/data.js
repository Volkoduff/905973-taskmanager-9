export const getTaskData = () => ({
  description: [
    `Изучить теорию`,
    `Сделать домашку`,
    `Пройти интенсив на соточку`,
  ][Math.floor(Math.random() * 3)],
  dueDate: Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
  tags: new Set([
    `homework`,
    `theory`,
    `practice`,
    `intensive`,
    `keks`,
    `task`,
    `learning`,
  ]),
  repeatingDays: {
    'mo': false,
    'tu': Boolean(Math.round(Math.random())),
    'we': false,
    'th': false,
    'fr': false,
    'sa': false,
    'su': false,
  },
  color: [
    `black`,
    `yellow`,
    `blue`,
    `green`,
    `pink`,
  ][Math.floor(Math.random() * 5)],
  isFavorite: Boolean(Math.round(Math.random())),
  isArchive: Boolean(Math.round(Math.random())),
});

export const filter = [{
  title: `All`,
  get count() {
    const tasks = document.querySelectorAll(`article`);
    return tasks.length;
  },
}, {
  title: `OVERDUE`,
  count: 0,
}, {
  title: `TODAY`,
  count: 0,
}, {
  title: `FAVORITES`,
  get count() {
    let counter = 0;
    Array.from(document.querySelectorAll(`article`))
      .map((el) => el.querySelector(`.card__btn--favorites`).classList.contains(`card__btn--disabled`) ? counter : counter++);
    return counter;
  }
}, {
  title: `REPEATING`,
  get count() {
    let counter = 0;
    Array.from(document.querySelectorAll(`article`))
      .map((el) => el.classList.contains(`card--repeat`) ? counter++ : counter);
    return counter;
  }
}, {
  title: `TAGS`,
  count: Math.floor(Math.random() * 7),
}, {
  title: `ARCHIVE`,
  get count() {
    let counter = 0;
    Array.from(document.querySelectorAll(`article`))
      .map((el) => el.querySelector(`.card__btn--archive`).classList.contains(`card__btn--disabled`) ? counter : counter++);
    return counter;
  }
}];
