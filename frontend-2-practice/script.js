// Страница «Выбор даты и времени» — запись в барбершоп.
// Нативный JavaScript, без фреймворков.


// ============================================================
// 1. ДАННЫЕ
// ============================================================

// «Сегодня» берём из системной даты, без времени.
const now = new Date();
const TODAY = {
  day: now.getDate(),
  month: now.getMonth(), // 0 — январь
  year: now.getFullYear(),
};

// Время работы мастера: одинаковая сетка слотов на каждый день.
const SLOT_TIMES = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

// Занятость захардкожена правилами, чтобы у разных дней были разные слоты.
// Формат слота: { time: "10:00", available: true }.
function getSlotsForDay(date) {
  // В эти дни у мастера всё занято — показываем пустое состояние.
  const isFullyBooked = (date.day + date.month) % 9 === 0;

  return SLOT_TIMES.map(function (time, index) {
    const isBusy = isFullyBooked || (date.day * 3 + date.month + index) % 4 === 0;
    return { time: time, available: !isBusy };
  });
}


// ============================================================
// 2. СОСТОЯНИЕ
// ============================================================

const state = {
  currentMonth: TODAY.month, // какой месяц показан в календаре
  currentYear: TODAY.year,
  selectedDate: null, // { day, month, year }
  selectedTime: null, // "14:00"
  slots: [],
};


// ============================================================
// 3. ЧИСТЫЕ ФУНКЦИИ
// ============================================================

const MONTHS_NOMINATIVE = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

const MONTHS_GENITIVE = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

// Порядок как у getDay(): 0 — воскресенье.
const DAYS_OF_WEEK = [
  "Воскресенье", "Понедельник", "Вторник", "Среда",
  "Четверг", "Пятница", "Суббота",
];

// Сравнивает две даты { day, month, year }: -1 — раньше, 0 — равны, 1 — позже.
function compareDates(date1, date2) {
  const d1 = new Date(date1.year, date1.month, date1.day);
  const d2 = new Date(date2.year, date2.month, date2.day);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

// Можно ли выбрать день: не раньше сегодняшнего.
function isDateSelectable(day, month, year, today) {
  return compareDates({ day: day, month: month, year: year }, today) >= 0;
}

// Сетка календаря: массив недель по 7 ячеек { day, otherMonth }.
function buildCalendarGrid(year, month) {
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
function formatDate(date) {
  const weekday = DAYS_OF_WEEK[new Date(date.year, date.month, date.day).getDay()];
  return weekday + ", " + date.day + " " + MONTHS_GENITIVE[date.month] + " " + date.year;
}

// Первый день, начиная с date, у которого есть свободное время (ищем на 60 дней вперёд).
function findNearestFreeDate(date) {
  for (let i = 0; i < 60; i++) {
    const d = new Date(date.year, date.month, date.day + i);
    const candidate = { day: d.getDate(), month: d.getMonth(), year: d.getFullYear() };
    const hasFreeSlot = getSlotsForDay(candidate).some(function (slot) {
      return slot.available;
    });
    if (hasFreeSlot) return candidate;
  }
  return null;
}


// ============================================================
// 4. ОТРИСОВКА И ОБРАБОТЧИКИ
// ============================================================

const monthTitle = document.querySelector(".calendar__month");
const daysContainer = document.querySelector(".calendar__days");
const slotsTitle = document.querySelector(".time-slots__title");
const slotsContainer = document.querySelector(".time-slots__grid");
const dateTimeText = document.querySelector(".booking__datetime");
const nextButton = document.querySelector(".booking__next");

function isSelectedDay(day, month, year) {
  const selected = state.selectedDate;
  return selected !== null &&
    selected.day === day && selected.month === month && selected.year === year;
}

function renderCalendar() {
  const month = state.currentMonth;
  const year = state.currentYear;
  monthTitle.textContent = MONTHS_NOMINATIVE[month] + " " + year;

  const weeks = buildCalendarGrid(year, month);
  let html = "";

  weeks.forEach(function (week) {
    week.forEach(function (cell) {
      const selectable = !cell.otherMonth && isDateSelectable(cell.day, month, year, TODAY);
      let classes = "calendar__day";

      if (!selectable) {
        classes += " calendar__day--disabled";
        html += `<button class="${classes}" type="button" disabled>${cell.day}</button>`;
        return;
      }

      const selected = isSelectedDay(cell.day, month, year);
      if (selected) classes += " calendar__day--selected";
      if (compareDates({ day: cell.day, month: month, year: year }, TODAY) === 0) {
        classes += " calendar__day--today";
      }

      html += `<button class="${classes}" type="button" data-day="${cell.day}" aria-pressed="${selected}">${cell.day}</button>`;
    });
  });

  daysContainer.innerHTML = html;

  // Старые кнопки удалились вместе со старым HTML — вешаем обработчики заново.
  daysContainer.querySelectorAll(".calendar__day[data-day]").forEach(function (button) {
    button.addEventListener("click", onDayClick);
  });
}

function onDayClick(event) {
  const day = parseInt(event.currentTarget.dataset.day, 10);
  selectDate({ day: day, month: state.currentMonth, year: state.currentYear });
}

function selectDate(date) {
  state.selectedDate = date;
  state.selectedTime = null; // время другого дня здесь недействительно
  state.slots = getSlotsForDay(date);

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

function renderTimeSlots() {
  const date = state.selectedDate;
  slotsTitle.textContent = "Время на " + date.day + " " + MONTHS_GENITIVE[date.month];

  const hasFreeSlot = state.slots.some(function (slot) {
    return slot.available;
  });

  if (!hasFreeSlot) {
    renderNoSlots(date);
    return;
  }

  let html = "";
  state.slots.forEach(function (slot) {
    let classes = "time-slot";

    if (!slot.available) {
      classes += " time-slot--busy";
      html += `<button class="${classes}" type="button" disabled>
        <span class="time-slot__time">${slot.time}</span>
        <span class="time-slot__status">Занято</span>
      </button>`;
      return;
    }

    const selected = slot.time === state.selectedTime;
    if (selected) classes += " time-slot--selected";

    html += `<button class="${classes}" type="button" data-time="${slot.time}" aria-pressed="${selected}">
      <span class="time-slot__time">${slot.time}</span>
    </button>`;
  });

  slotsContainer.classList.remove("time-slots__grid--empty");
  slotsContainer.innerHTML = html;

  slotsContainer.querySelectorAll(".time-slot[data-time]").forEach(function (button) {
    button.addEventListener("click", onTimeSlotClick);
  });
}

// Альтернативный сценарий: в выбранный день свободного времени нет.
function renderNoSlots(date) {
  const nearest = findNearestFreeDate({ day: date.day + 1, month: date.month, year: date.year });
  const nearestText = nearest
    ? `Ближайший свободный день — ${formatDate(nearest).toLowerCase()}.`
    : "Попробуйте выбрать другой месяц.";

  slotsContainer.classList.add("time-slots__grid--empty");
  slotsContainer.innerHTML = `
    <div class="time-slots__empty">
      <p class="time-slots__empty-title">Свободного времени нет</p>
      <p class="time-slots__empty-text">В этот день у мастера всё занято. ${nearestText}</p>
      ${nearest ? '<button class="button time-slots__nearest" type="button">Показать ближайший день</button>' : ""}
    </div>`;

  const nearestButton = slotsContainer.querySelector(".time-slots__nearest");
  if (nearestButton) {
    nearestButton.addEventListener("click", function () {
      state.currentMonth = nearest.month;
      state.currentYear = nearest.year;
      selectDate(nearest);
    });
  }
}

function onTimeSlotClick(event) {
  state.selectedTime = event.currentTarget.dataset.time;
  renderTimeSlots();
  updateBottomBar();
}

// «Пятница, 13 ноября 2026 • 14:00»
function updateBottomBar() {
  nextButton.textContent = "Далее: контакты";
  const dateText = formatDate(state.selectedDate);

  if (state.selectedTime) {
    dateTimeText.textContent = dateText + " • " + state.selectedTime;
    dateTimeText.classList.remove("booking__datetime--empty");
    nextButton.disabled = false;
  } else {
    dateTimeText.textContent = dateText + " • выберите время";
    dateTimeText.classList.add("booking__datetime--empty");
    nextButton.disabled = true;
  }
}

function changeMonth(step) {
  // new Date сам перейдёт через декабрь/январь и поменяет год.
  const date = new Date(state.currentYear, state.currentMonth + step, 1);
  state.currentMonth = date.getMonth();
  state.currentYear = date.getFullYear();
  renderCalendar();
}

function setupMonthNavigation() {
  document.querySelector(".calendar__arrow--prev").addEventListener("click", function () {
    changeMonth(-1);
  });
  document.querySelector(".calendar__arrow--next").addEventListener("click", function () {
    changeMonth(1);
  });
}

function setupNextButton() {
  nextButton.addEventListener("click", function () {
    if (!state.selectedTime) return;

    // Страницы контактов пока нет — сохраняем выбор для следующего шага.
    try {
      localStorage.setItem("booking", JSON.stringify({
        date: state.selectedDate,
        time: state.selectedTime,
      }));
    } catch (error) {
      // Хранилище может быть недоступно — для этой страницы это не критично.
    }
    nextButton.textContent = "Время сохранено ✓";
  });
}


// ============================================================
// 5. ИНИЦИАЛИЗАЦИЯ
// ============================================================

function init() {
  // По умолчанию — сегодня, а если сегодня всё занято — ближайший свободный день.
  const defaultDate = findNearestFreeDate(TODAY) || TODAY;
  state.currentMonth = defaultDate.month;
  state.currentYear = defaultDate.year;

  setupMonthNavigation();
  setupNextButton();
  selectDate(defaultDate);
}

document.addEventListener("DOMContentLoaded", init);
