// Индикатор шагов записи. currentStep — номер текущего шага (с 1).
import { Fragment } from "react";

const STEPS = ["Мастер", "Услуги", "Дата и время", "Контакты", "Подтверждение"];

function BookingSteps({ currentStep }) {
  return (
    <nav className="booking-steps" aria-label="Шаги записи">
      <ol className="booking-steps__list">
        {STEPS.map((label, index) => {
          const number = index + 1;
          const isDone = number < currentStep;
          const isCurrent = number === currentStep;

          let itemClass = "booking-steps__item";
          if (isDone) itemClass += " booking-steps__item--done";
          if (isCurrent) itemClass += " booking-steps__item--current";

          return (
            <Fragment key={label}>
              <li className={itemClass} aria-current={isCurrent ? "step" : undefined}>
                <span className="booking-steps__number">{isDone ? "✓" : number}</span>
                <span className="booking-steps__label">{label}</span>
              </li>
              {number < STEPS.length && (
                <li
                  className={"booking-steps__line" + (isDone ? " booking-steps__line--done" : "")}
                  aria-hidden="true"
                ></li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

export default BookingSteps;
