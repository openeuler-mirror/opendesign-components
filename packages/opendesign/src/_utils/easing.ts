export function easeInOutCubic(current: number, start: number, end: number, duration: number): number {
  let elapsed = end - start;
  let time = current / (duration / 2);

  if (time < 1) {
    return (elapsed / 2) * time * time * time + start;
  }

  time -= 2;
  return (elapsed / 2) * (time * time * time + 2) + start;
}
