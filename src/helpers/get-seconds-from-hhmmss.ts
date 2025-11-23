export function getSecondsFromHHMMSS(value: string) {
  const digits = value.split(":");

  const [hours, minutes, seconds] = digits.map(Number);

  return hours * 60 * 60 + minutes * 60 + seconds;
}

// 24 horas = 24 * 60 minutos = 24 * 60 * 60 segundos
