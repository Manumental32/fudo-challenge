const formatter = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const relative = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

export function formatDate(value: string): string {
  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    return value;
  }

  const deltaSeconds = Math.round((timestamp - Date.now()) / 1000);
  const abs = Math.abs(deltaSeconds);

  if (abs < 60) {
    return relative.format(deltaSeconds, 'second');
  }

  if (abs < 3600) {
    return relative.format(Math.round(deltaSeconds / 60), 'minute');
  }

  if (abs < 86400) {
    return relative.format(Math.round(deltaSeconds / 3600), 'hour');
  }

  if (abs < 86400 * 30) {
    return relative.format(Math.round(deltaSeconds / 86400), 'day');
  }

  return formatter.format(new Date(timestamp));
}
