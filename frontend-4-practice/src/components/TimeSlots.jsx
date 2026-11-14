// Слоты времени на выбранный день.
// Три состояния запроса: загрузка, ошибка, данные.
import { MONTHS_GENITIVE } from "../utils/date";

// Пропсы:
//   date         — выбранная дата { day, month, year }
//   slots        — массив { time, available } (пока грузится — пустой)
//   isLoading    — слоты ещё грузятся
//   error        — текст ошибки или null
//   selectedTime — выбранное время ("14:00") или null
//   onSlotClick  — вызывается со строкой времени
//   onRetry      — повторить запрос слотов
function TimeSlots({ date, slots, isLoading, error, selectedTime, onSlotClick, onRetry }) {
  const title = `Время на ${date.day} ${MONTHS_GENITIVE[date.month]}`;

  let content;

  if (isLoading) {
    content = <p className="time-slots__message">Загрузка слотов…</p>;
  } else if (error) {
    content = (
      <div className="time-slots__empty time-slots__empty--error">
        <p className="time-slots__empty-title">Не удалось загрузить время</p>
        <p className="time-slots__empty-text">{error}. Проверьте соединение и попробуйте ещё раз.</p>
        <button className="button" type="button" onClick={onRetry}>
          Повторить
        </button>
      </div>
    );
  } else if (!slots.some((slot) => slot.available)) {
    content = (
      <div className="time-slots__empty">
        <p className="time-slots__empty-title">Свободного времени нет</p>
        <p className="time-slots__empty-text">В этот день у мастера всё занято. Выберите другой день.</p>
      </div>
    );
  } else {
    content = (
      <div className="time-slots__grid">
        {slots.map((slot) => {
          if (!slot.available) {
            return (
              <button className="time-slot time-slot--busy" type="button" disabled key={slot.time}>
                <span className="time-slot__time">{slot.time}</span>
                <span className="time-slot__status">Занято</span>
              </button>
            );
          }

          const isSelected = slot.time === selectedTime;
          return (
            <button
              className={"time-slot" + (isSelected ? " time-slot--selected" : "")}
              type="button"
              aria-pressed={isSelected}
              key={slot.time}
              onClick={() => onSlotClick(slot.time)}
            >
              <span className="time-slot__time">{slot.time}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <section className="time-slots" aria-labelledby="slots-title" aria-busy={isLoading}>
      <h2 className="time-slots__title" id="slots-title">{title}</h2>
      {content}
    </section>
  );
}

export default TimeSlots;
