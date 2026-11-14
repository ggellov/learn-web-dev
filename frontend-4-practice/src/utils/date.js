// Чистые функции для работы с датами.
// Не зависят ни от React, ни от DOM — те же, что в нативной версии.

export const MONTHS_NOMINATIVE = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

export const MONTHS_GENITIVE = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

// Порядок как у getDay(): 0 — воскресенье.
export const DAYS_OF_WEEK = [
  "Воскресенье", "Понедельник", "Вторник", "Среда",
  "Четверг", "Пятница", "Суббота",
];

// «Сегодня» без времени: { day, month, year }, месяц 0-индексный.
export function getToday() {
  const now = new Date();
  return { day: now.getDate(), month: now.getMonth(), year: now.getFullYear() };
}

// Сравнивает две даты { day, month, year }: -1 — раньше, 0 — равны, 1 — позже.
export function compareDates(date1, date2) {
  const d1 = new Date(date1.year, date1.month, date1.day);
  const d2 = new Date(date2.year, date2.month, date2.day);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

// Можно ли выбрать день: не раньше сегодняшнего.
export function isDateSelectable(day, month, year, today) {
  return compareDates({ day, month, year }, today) >= 0;
}

// Сетка календаря: массив недель по 7 ячеек { day, otherMonth }.
export function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, otherMonth: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, otherMonth: false });
  }
  const totalCells = Math.ceil(cells.length / 7) * 7;
  let nextDay = 1;
  while (cells.length < totalCells) {
    cells.push({ day: nextDay, otherMonth: true });
    nextDay++;
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

// «Пятница, 13 ноября 2026»
export function formatDate(date) {
  const weekday = DAYS_OF_WEEK[new Date(date.year, date.month, date.day).getDay()];
  return `${weekday}, ${date.day} ${MONTHS_GENITIVE[date.month]} ${date.year}`;
}
