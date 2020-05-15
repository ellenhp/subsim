// area = 1, stddev = 1;
export function normalDistribution(x: number) {
  return Math.pow(Math.E, -Math.pow(x, 2) / 2) / Math.sqrt(2 * Math.PI);
}
