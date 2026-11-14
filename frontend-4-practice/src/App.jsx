// App — страница «Выбор даты и времени».
// «Сегодня» и слоты приходят с сервера через fetch (см. src/api.js).
// У каждого запроса три состояния: загрузка, ошибка, данные.
import { useEffect, useState } from "react";
import "./styles/booking.css";
import Header from "./components/Header.jsx";
import BookingSteps from "./components/BookingSteps.jsx";
import Calendar from "./components/Calendar.jsx";
import TimeSlots from "./components/TimeSlots.jsx";
import BookingBottomBar from "./components/BookingBottomBar.jsx";
import Footer from "./components/Footer.jsx";
import { fetchToday, fetchSlots } from "./api";
import { compareDates } from "./utils/date";

function App() {
  // «Сегодня» с сервера.
  const [today, setToday] = useState(null);
  const [isTodayLoading, setIsTodayLoading] = useState(true);
  const [todayError, setTodayError] = useState(null);
  const [todayRequest, setTodayRequest] = useState(0); // для кнопки «Повторить»

  // Календарь и выбор.
  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  // Слоты выбранного дня с сервера.
  const [slots, setSlots] = useState([]);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);
  const [slotsRequest, setSlotsRequest] = useState(0);

  // 1. При открытии страницы загружаем «сегодня».
  useEffect(() => {
    let isCancelled = false;

    fetchToday()
      .then((data) => {
        if (isCancelled) return;
        setToday(data);
        setCurrentMonth(data.month);
        setCurrentYear(data.year);
        setSelectedDay(data); // день по умолчанию — сегодня
        setIsSlotsLoading(true); // слоты этого дня начнут грузиться сразу
        setIsTodayLoading(false);
      })
      .catch((error) => {
        if (isCancelled) return;
        setTodayError(error.message);
        setIsTodayLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [todayRequest]);

  // 2. При смене выбранного дня загружаем его слоты.
  useEffect(() => {
    if (selectedDay === null) return;
    let isCancelled = false;

    fetchSlots(selectedDay)
      .then((data) => {
        // Защита от гонок: пользователь мог уже выбрать другой день,
        // а этот ответ пришёл позже. Такой ответ игнорируем.
        if (isCancelled || compareDates(data.date, selectedDay) !== 0) return;
        setSlots(data.slots);
        setIsSlotsLoading(false);
      })
      .catch((error) => {
        if (isCancelled) return;
        setSlotsError(error.message);
        setIsSlotsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedDay, slotsRequest]);

  function startSlotsLoading() {
    setSlots([]);
    setSlotsError(null);
    setIsSlotsLoading(true);
  }

  function handleDayClick(day) {
    const date = { day, month: currentMonth, year: currentYear };
    if (selectedDay && compareDates(date, selectedDay) === 0) return; // тот же день — не перезапрашиваем
    setSelectedDay(date);
    setSelectedTime(null); // время другого дня здесь недействительно
    setIsSaved(false);
    startSlotsLoading();
  }

  function handleSlotClick(time) {
    setSelectedTime(time);
    setIsSaved(false);
  }

  function changeMonth(step) {
    // new Date сам перейдёт через декабрь/январь и поменяет год.
    const date = new Date(currentYear, currentMonth + step, 1);
    setCurrentMonth(date.getMonth());
    setCurrentYear(date.getFullYear());
  }

  function retryToday() {
    setTodayError(null);
    setIsTodayLoading(true);
    setTodayRequest((n) => n + 1);
  }

  function retrySlots() {
    startSlotsLoading();
    setSlotsRequest((n) => n + 1);
  }

  function handleNext() {
    if (!selectedTime) return;
    // Страницы контактов пока нет — сохраняем выбор для следующего шага.
    try {
      localStorage.setItem("booking", JSON.stringify({ date: selectedDay, time: selectedTime }));
    } catch {
      // Хранилище может быть недоступно — для этой страницы это не критично.
    }
    setIsSaved(true);
  }

  let pickerContent;
  if (isTodayLoading) {
    pickerContent = <p className="booking__status">Загрузка…</p>;
  } else if (todayError) {
    pickerContent = (
      <div className="booking__status booking__status--error">
        <p className="booking__status-title">Не удалось загрузить календарь</p>
        <p className="booking__status-text">{todayError}. Проверьте соединение и попробуйте ещё раз.</p>
        <button className="button" type="button" onClick={retryToday}>
          Повторить
        </button>
      </div>
    );
  } else {
    pickerContent = (
      <>
        <div className="booking__picker">
          <Calendar
            year={currentYear}
            month={currentMonth}
            selectedDay={selectedDay}
            today={today}
            onDayClick={handleDayClick}
            onPrevMonth={() => changeMonth(-1)}
            onNextMonth={() => changeMonth(1)}
          />
          <TimeSlots
            date={selectedDay}
            slots={slots}
            isLoading={isSlotsLoading}
            error={slotsError}
            selectedTime={selectedTime}
            onSlotClick={handleSlotClick}
            onRetry={retrySlots}
          />
        </div>

        <BookingBottomBar
          date={selectedDay}
          selectedTime={selectedTime}
          isSaved={isSaved}
          onNext={handleNext}
        />
      </>
    );
  }

  return (
    <div className="page">
      <Header />
      <BookingSteps currentStep={3} />

      <main className="booking">
        <div className="booking__heading">
          <a className="booking__back" href="#">← Назад</a>
          <h1 className="booking__title">Выберите дату и время</h1>
        </div>

        {pickerContent}
      </main>

      <Footer />
    </div>
  );
}

export default App;
