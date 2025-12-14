// 工具函数
function formatDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function buildCalendarData(currentDate, records) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];

  // 添加前面的空白天数
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // 添加当月的天数
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = formatDate(new Date(year, month, i));
    const dayRecords = records.filter(r => {
      const recordDate = r.consumeDate || r.date;
      return recordDate === dateStr;
    });

    const totalPrice = dayRecords.reduce((sum, record) => {
      return sum + (record.price || 0);
    }, 0);

    const brandGroups = dayRecords.reduce((groups, record) => {
      const brandId = record.brandId;
      const brandName = record.brandName || record.brand;
      const brandLogo = record.brandLogo || '/default-brand-icon.png';

      if (!groups[brandId]) {
        groups[brandId] = {
          id: brandId,
          name: brandName,
          logo: brandLogo,
          count: 0
        };
      }
      groups[brandId].count++;
      return groups;
    }, {});

    days.push({
      day: i,
      date: dateStr,
      records: dayRecords,
      count: dayRecords.length,
      amount: totalPrice,
      hasConsumption: dayRecords.length > 0,
      brandGroups: Object.values(brandGroups)
    });
  }

  return days;
}

module.exports = {
  formatDate,
  getDaysInMonth,
  getFirstDayOfMonth,
  buildCalendarData
};

