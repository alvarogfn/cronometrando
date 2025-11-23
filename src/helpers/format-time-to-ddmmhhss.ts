import { format } from "date-fns";

export function formatTimeToDDMMHHSS(time: number) {
  return format(new Date(time), "dd/MM HH:mm:ss");
}
