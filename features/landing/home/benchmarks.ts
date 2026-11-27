export const benchmarkAxes = {
  time: { label: "Review time (min)", min: 0, max: 60, ticks: [0, 15, 30, 45, 60] },
  completeness: { label: "Evidence completeness (%)", min: 60, max: 100, ticks: [60, 70, 80, 90, 100] },
};

export const benchmarkSeries = {
  A: "Example workflow A",
  B: "Example workflow B",
};

export type BenchmarkRun = {
  id: string;
  series: keyof typeof benchmarkSeries;
  minutes: number;
  completeness: number;
};

type BenchmarkDataset = {
  id: string;
  label: string;
  sample: string;
  methodology: string;
  testingDates: string;
  runs: BenchmarkRun[];
};

// Replace the sample values and evaluation notes together when measured data is available.
export const benchmarkDatasets: [BenchmarkDataset, ...BenchmarkDataset[]] = [
  {
    id: "eudr",
    label: "EUDR",
    sample: "Fictional coffee and cocoa shipments with sample supplier records and plot references.",
    methodology: "Compare workflows using the same shipments. Record review time and the share of evidence fields completed at handoff.",
    testingDates: "Pending real benchmark runs.",
    runs: [
      { id: "A1", series: "A", minutes: 12, completeness: 92 },
      { id: "A2", series: "A", minutes: 25, completeness: 85 },
      { id: "A3", series: "A", minutes: 42, completeness: 98 },
      { id: "B1", series: "B", minutes: 16, completeness: 72 },
      { id: "B2", series: "B", minutes: 36, completeness: 76 },
      { id: "B3", series: "B", minutes: 53, completeness: 89 },
    ],
  },
  {
    id: "cbam",
    label: "CBAM",
    sample: "Fictional steel and aluminium import records with sample supplier and emissions files.",
    methodology: "Give each workflow the same set of supplier files. Record review time and the share of evidence fields completed at handoff.",
    testingDates: "Pending real benchmark runs.",
    runs: [
      { id: "A1", series: "A", minutes: 13, completeness: 88 },
      { id: "A2", series: "A", minutes: 29, completeness: 96 },
      { id: "A3", series: "A", minutes: 46, completeness: 83 },
      { id: "B1", series: "B", minutes: 20, completeness: 71 },
      { id: "B2", series: "B", minutes: 37, completeness: 76 },
      { id: "B3", series: "B", minutes: 54, completeness: 93 },
    ],
  },
  {
    id: "dpp",
    label: "Product passports",
    sample: "Fictional textile product records with sample material, supplier, and traceability fields.",
    methodology: "Prepare the same product records in each workflow. Record review time and the share of evidence fields completed at handoff.",
    testingDates: "Pending real benchmark runs.",
    runs: [
      { id: "A1", series: "A", minutes: 10, completeness: 95 },
      { id: "A2", series: "A", minutes: 24, completeness: 82 },
      { id: "A3", series: "A", minutes: 43, completeness: 97 },
      { id: "B1", series: "B", minutes: 16, completeness: 70 },
      { id: "B2", series: "B", minutes: 37, completeness: 75 },
      { id: "B3", series: "B", minutes: 55, completeness: 87 },
    ],
  },
];
