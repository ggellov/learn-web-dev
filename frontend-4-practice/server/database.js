// «База данных» барбершопа — пока обычный JS-объект.
//
// Содержит только то, что нужно странице календаря:
//   - today — «сегодня» по мнению сервера;
//   - slotsEvenDay / slotsOddDay — два набора слотов мастера,
//     чтобы на клиенте было видно: при смене дня данные разные.
//
// Формат слота: { time: "10:00", available: true }.

// «Сегодня» берём из часов сервера в момент запуска.
// Месяц 0-индексный, как в new Date().
const now = new Date();

export const database = {
  today: { day: now.getDate(), month: now.getMonth(), year: now.getFullYear() },

  // Чётные дни (2, 4, 6, ...): заняты 11:00 и 15:00.
  slotsEvenDay: [
    { time: "10:00", available: true },
    { time: "11:00", available: false },
    { time: "12:00", available: true },
    { time: "13:00", available: true },
    { time: "14:00", available: true },
    { time: "15:00", available: false },
    { time: "16:00", available: true },
    { time: "17:00", available: true },
  ],

  // Нечётные дни (1, 3, 5, ...): заняты 13:00 и 17:00 — как в макете.
  slotsOddDay: [
    { time: "10:00", available: true },
    { time: "11:00", available: true },
    { time: "12:00", available: true },
    { time: "13:00", available: false },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: true },
    { time: "17:00", available: false },
  ],
};
