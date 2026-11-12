// Календарь: заголовок месяца, стрелки и сетка дней.
// Сам ничего не хранит — всё получает от App через пропсы.
import {
  MONTHS_NOMINATIVE,
  buildCalendarGrid,
  compareDates,
  isDateSelectable,
} from "../utils/date";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

// Пропсы:
//   year, month   — показанный месяц (month 0-индексный)
//   selectedDay   — выбранная дата { day, month, year } или null
//   today         — сегодняшняя дата { day, month, year }
//   onDayClick    — вызывается с числом месяца
//   onPrevMonth, onNextMonth — листание месяцев
function Calendar({ year, month, selectedDay, today, onDayClick, onPrevMonth, onNextMonth }) {
  const weeks = buildCalendarGrid(year, month);

  return (
    <section className="calendar" aria-labelledby="calendar-title">
      <div className="calendar__header">
        <h2 className="calendar__month" id="calendar-title">
          {MONTHS_NOMINATIVE[month]} {year}
        </h2>
        <div className="calendar__controls">
          <button className="calendar__arrow" type="button" aria-label="Предыдущий месяц" onClick={onPrevMonth}>
            <svg className="calendar__arrow-icon" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M8.75 3.5 5.25 7l3.5 3.5" />
            </svg>
          </button>
          <button className="calendar__arrow" type="button" aria-label="Следующий месяц" onClick={onNextMonth}>
            <svg className="calendar__arrow-icon" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M5.25 3.5 8.75 7l-3.5 3.5" />
            </svg>
          </button>
        </div>
      </div>

      <ul className="calendar__weekdays" aria-hidden="true">
        {WEEKDAYS.map((weekday) => (
          <li className="calendar__weekday" key={weekday}>{weekday}</li>
        ))}
      </ul>

      <div className="calendar__days">
        {weeks.map((week, weekIndex) =>
          week.map((cell, cellIndex) => {
            const key = weekIndex * 7 + cellIndex;
            const selectable = !cell.otherMonth && isDateSelectable(cell.day, month, year, today);

            if (!selectable) {
              return (
                <button className="calendar__day calendar__day--disabled" type="button" disabled key={key}>
                  {cell.day}
                </button>
              );
            }

            const cellDate = { day: cell.day, month, year };
            const isSelected = selectedDay !== null && compareDates(cellDate, selectedDay) === 0;
            const isToday = compareDates(cellDate, today) === 0;

            let className = "calendar__day";
            if (isSelected) className += " calendar__day--selected";
            if (isToday) className += " calendar__day--today";

            return (
              <button
                className={className}
                type="button"
                aria-pressed={isSelected}
                key={key}
                onClick={() => onDayClick(cell.day)}
              >
                {cell.day}
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}

export default Calendar;
