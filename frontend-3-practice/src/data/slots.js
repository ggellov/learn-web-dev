// Слоты мастера. Сервера пока нет — занятость захардкожена правилами,
// чтобы у разных дней были разные слоты.
// Формат слота: { time: "10:00", available: true }.

const SLOT_TIMES = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export function getSlotsForDay(date) {
  // В эти дни у мастера всё занято — показываем пустое состояние.
  const isFullyBooked = (date.day + date.month) % 9 === 0;

  return SLOT_TIMES.map((time, index) => {
    const isBusy = isFullyBooked || (date.day * 3 + date.month + index) % 4 === 0;
    return { time, available: !isBusy };
  });
}

export function hasFreeSlot(slots) {
  return slots.some((slot) => slot.available);
}

// Первый день начиная с date, у которого есть свободное время (ищем на 60 дней вперёд).
export function findNearestFreeDate(date) {
  for (let i = 0; i < 60; i++) {
    const d = new Date(date.year, date.month, date.day + i);
    const candidate = { day: d.getDate(), month: d.getMonth(), year: d.getFullYear() };
    if (hasFreeSlot(getSlotsForDay(candidate))) return candidate;
  }
  return null;
}
