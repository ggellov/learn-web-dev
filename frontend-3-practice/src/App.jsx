// App — страница «Выбор даты и времени».
// Здесь живёт всё состояние; дочерние компоненты только рисуют
// то, что им передали, и сообщают о кликах через колбэки.
import { useState } from "react";
import "./styles/booking.css";
import Header from "./components/Header.jsx";
import BookingSteps from "./components/BookingSteps.jsx";
import Calendar from "./components/Calendar.jsx";
import TimeSlots from "./components/TimeSlots.jsx";
import BookingBottomBar from "./components/BookingBottomBar.jsx";
import Footer from "./components/Footer.jsx";
import { getToday } from "./utils/date";
import { getSlotsForDay, findNearestFreeDate } from "./data/slots";

const TODAY = getToday();

// По умолчанию — сегодня, а если сегодня всё занято — ближайший свободный день.
const DEFAULT_DAY = findNearestFreeDate(TODAY) || TODAY;

function App() {
  const [currentMonth, setCurrentMonth] = useState(DEFAULT_DAY.month);
  const [currentYear, setCurrentYear] = useState(DEFAULT_DAY.year);
  const [selectedDay, setSelectedDay] = useState(DEFAULT_DAY);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState(() => getSlotsForDay(DEFAULT_DAY));
  const [isSaved, setIsSaved] = useState(false);

  function selectDate(date) {
    setSelectedDay(date);
    setSelectedTime(null); // время другого дня здесь недействительно
    setSlots(getSlotsForDay(date));
    setIsSaved(false);
  }

  function handleDayClick(day) {
    selectDate({ day, month: currentMonth, year: currentYear });
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

  const nearestDate = findNearestFreeDate({
    day: selectedDay.day + 1,
    month: selectedDay.month,
    year: selectedDay.year,
  });

  function handleShowNearest() {
    if (!nearestDate) return;
    setCurrentMonth(nearestDate.month);
    setCurrentYear(nearestDate.year);
    selectDate(nearestDate);
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

  return (
    <div className="page">
      <Header />
      <BookingSteps currentStep={3} />

      <main className="booking">
        <div className="booking__heading">
          <a className="booking__back" href="#">← Назад</a>
          <h1 className="booking__title">Выберите дату и время</h1>
        </div>

        <div className="booking__picker">
          <Calendar
            year={currentYear}
            month={currentMonth}
            selectedDay={selectedDay}
            today={TODAY}
            onDayClick={handleDayClick}
            onPrevMonth={() => changeMonth(-1)}
            onNextMonth={() => changeMonth(1)}
          />
          <TimeSlots
            date={selectedDay}
            slots={slots}
            selectedTime={selectedTime}
            nearestDate={nearestDate}
            onSlotClick={handleSlotClick}
            onShowNearest={handleShowNearest}
          />
        </div>

        <BookingBottomBar
          date={selectedDay}
          selectedTime={selectedTime}
          isSaved={isSaved}
          onNext={handleNext}
        />
      </main>

      <Footer />
    </div>
  );
}

export default App;
