import { type DateArg, toDate } from "date-fns";

export function getInitials(name: string) {
  if (!name) {
    return "X";
  }

  if (parseInt(name)) {
    return "X";
  }

  const words = name.trim().split(" ");

  if (words.length === 0) {
    return "X";
  }

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  const firstInitial = words[0].charAt(0);
  const lastInitial = words[words.length - 1].charAt(0);

  return (firstInitial + lastInitial).toUpperCase();
}

export function getTimeInSeconds<T extends Date>(date: DateArg<T>) {
  return Math.floor(toDate(date).getTime() / 1000);
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
