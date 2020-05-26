// area = 1, stddev = 1;
export function normalDistribution(x: number) {
  return Math.pow(Math.E, -Math.pow(x, 2) / 2) / Math.sqrt(2 * Math.PI);
}

/* Dead simple hash function, suitable for vesselid salt */
export function simpleHash(str: string): number {
  let hash = 0;
  if (this.length == 0) {
    return hash;
  }
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
