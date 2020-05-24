export default interface SonarSource {
  sample: (bearing: number, sampleTime?: number) => number;
}
