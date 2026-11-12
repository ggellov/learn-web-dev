// Нижняя панель: что выбрано и кнопка «Далее».
import { formatDate } from "../utils/date";

// Пропсы:
//   date         — выбранная дата { day, month, year }
//   selectedTime — выбранное время или null
//   isSaved      — выбор уже сохранён кнопкой «Далее»
//   onNext       — клик по кнопке «Далее»
function BookingBottomBar({ date, selectedTime, isSaved, onNext }) {
  const dateText = formatDate(date);

  return (
    <div className="booking__footer">
      <div className="booking__summary">
        <p className="booking__services">Марина · Стрижка + борода, камуфляж седины · 90 мин</p>
        <p className={"booking__datetime" + (selectedTime ? "" : " booking__datetime--empty")}>
          {selectedTime ? `${dateText} • ${selectedTime}` : `${dateText} • выберите время`}
        </p>
      </div>
      <button className="button" type="button" disabled={!selectedTime} onClick={onNext}>
        {isSaved ? "Время сохранено ✓" : "Далее: контакты"}
      </button>
    </div>
  );
}

export default BookingBottomBar;
