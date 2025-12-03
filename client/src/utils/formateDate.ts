export const formateDate = (dateStr: string) => {
  const date = new Date(dateStr);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

/**
 * Форматирует ISO дату в читаемый формат
 * @param isoDate - ISO формат (2025-12-02T11:38:02.468Z)
 * @param locale - язык локализации (по умолчанию 'en-US')
 * @returns Форматированная дата (Feb 12, 2025 15:38)
 */
export const formatDateWithHour = (
  isoDate: string | Date,
  locale: string = 'en-US'
): string => {
  const date = typeof isoDate === 'string' ? new Date(isoDate) : isoDate;

  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};
