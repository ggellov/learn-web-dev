// Слоты времени на выбранный день.
// Если свободных слотов нет — показываем пустое состояние из макета.
import { MONTHS_GENITIVE, formatDate } from "../utils/date";
import { hasFreeSlot } from "../data/slots";

// Пропсы:
//   date          — выбранная дата { day, month, year }
//   slots         — массив { time, available }
//   selectedTime  — выбранное время ("14:00") или null
//   nearestDate   — ближайшая дата со свободным временем (для пустого состояния)
//   onSlotClick   — вызывается со строкой времени
//   onShowNearest — переход на ближайший свободный день
function TimeSlots({ date, slots, selectedTime, nearestDate, onSlotClick, onShowNearest }) {
  const title = `Время на ${date.day} ${MONTHS_GENITIVE[date.month]}`;

  if (!hasFreeSlot(slots)) {
    return (
      <section className="time-slots" aria-labelledby="slots-title">
        <h2 className="time-slots__title" id="slots-title">{title}</h2>
        <div className="time-slots__empty">
          <p className="time-slots__empty-title">Свободного времени нет</p>
          <p className="time-slots__empty-text">
            В этот день у мастера всё занято.{" "}
            {nearestDate
              ? `Ближайший свободный день — ${formatDate(nearestDate).toLowerCase()}.`
              : "Попробуйте выбрать другой месяц."}
          </p>
          {nearestDate && (
            <button className="button" type="button" onClick={onShowNearest}>
              Показать ближайший день
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="time-slots" aria-labelledby="slots-title">
      <h2 className="time-slots__title" id="slots-title">{title}</h2>
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
    </section>
  );
}

export default TimeSlots;
