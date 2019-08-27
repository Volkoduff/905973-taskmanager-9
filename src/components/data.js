const MAX_TAGS = 3;
const TASKS_AMOUNT = 10;

export const Colors = [`black`,
  `yellow`,
  `blue`,
  `green`,
  `pink`,
];

const TagNames = [
  `homework`,
  `theory`,
  `practice`,
  `intensive`,
  `keks`,
  `task`,
  `learning`,
];
const TaskTitles = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`,
];
const RandomFn = {
  getRandom: () => Math.random().toString().slice(3, 8),
  getRandomElementFromArray: (array) => array[Math.floor(Math.random() * array.length)],
  getSeveralRandomElementsFromArray: (array) => array.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * MAX_TAGS + 1)),
  getRandomWeekTime: () => 1 + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
  getRandomBoolean: () => Boolean(Math.round(Math.random())),
  getRandomWeekDayMarker: (task) => Object.keys(task.repeatingDays).some((day) => task.repeatingDays[day])
};

const counterForFilter = (filters, tasks) => {
  for (const el of filters) {
    el.count = tasks.filter(el.filter).length;
  }
};

export const getTaskData = () => ({
  description: RandomFn.getRandomElementFromArray(TaskTitles),
  dueDate: Date.now() + RandomFn.getRandomWeekTime(),
  tags: new Set(RandomFn.getSeveralRandomElementsFromArray(TagNames)),
  repeatingDays: {
    'mo': false,
    'tu': RandomFn.getRandomBoolean(),
    'we': false,
    'th': false,
    'fr': false,
    'sa': RandomFn.getRandomBoolean(),
    'su': false,
  },
  color: RandomFn.getRandomElementFromArray(Colors),
  isFavorite: RandomFn.getRandomBoolean(),
  isArchive: RandomFn.getRandomBoolean(),
});

export const taskFilters = [{
  title: `All`,
  filter: () => true,
}, {
  title: `OVERDUE`,
  filter: () => false,
  count: 0,
}, {
  title: `TODAY`,
  filter: () => false,
  count: 0,
}, {
  title: `FAVORITES`,
  filter: (task) => task.isFavorite,
}, {
  title: `REPEATING`,
  filter: (task) => RandomFn.getRandomWeekDayMarker(task)
}, {
  title: `ARCHIVE`,
  filter: (task) => task.isArchive,
}, {
  title: `TAGS`,
  filter: () => RandomFn.getRandomBoolean(),
}];

export const tasksData = () => Array.from({length: TASKS_AMOUNT}, getTaskData);
counterForFilter(taskFilters, tasksData());
