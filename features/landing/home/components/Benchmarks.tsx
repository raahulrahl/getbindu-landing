import { useRef, useState, type KeyboardEvent } from "react";
import { benchmarkAxes, benchmarkDatasets, benchmarkSeries, type BenchmarkRun } from "../benchmarks";
import { DEMO_URL, cta } from "../content";
import { BtnLabel } from "./bits";

const { time, completeness } = benchmarkAxes;

function position(value: number, axis: { min: number; max: number }) {
  return `${100 * (value - axis.min) / (axis.max - axis.min)}%`;
}

function BenchmarkPlot({ runs }: { runs: BenchmarkRun[] }) {
  return (
    <figure className="bench-figure" aria-hidden="true">
      <div className="bench-plot">
        <span className="bench-axis-y">{completeness.label}</span>
        <div className="bench-field">
          {completeness.ticks.map(tick => (
            <span className="bench-tick-y" key={tick} style={{ bottom: position(tick, completeness) }}>{tick}</span>
          ))}
          {time.ticks.map(tick => (
            <span className="bench-tick-x" key={tick} style={{ left: position(tick, time) }}>{tick}</span>
          ))}
          {runs.map(run => (
            <div
              className="bench-point"
              key={run.id}
              data-series={run.series}
              data-align={run.minutes > (time.min + time.max) / 2 ? "end" : "start"}
              style={{ left: position(run.minutes, time), bottom: position(run.completeness, completeness) }}
            >
              <span className="bench-marker" />
              <div className="bench-point-label">
                <strong>{run.id}</strong>
                <span>{run.minutes} min · {run.completeness}%</span>
              </div>
            </div>
          ))}
        </div>
        <span className="bench-axis-x">{time.label}</span>
      </div>
      <figcaption className="bench-legend">
        {Object.entries(benchmarkSeries).map(([series, label]) => (
          <span key={series} data-series={series}><i className="bench-marker" />{label}</span>
        ))}
      </figcaption>
    </figure>
  );
}

export function Benchmarks() {
  const [active, setActive] = useState(0);
  const [showData, setShowData] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dataset = benchmarkDatasets[active] ?? benchmarkDatasets[0];

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const count = benchmarkDatasets.length;
    const next = event.key === "ArrowRight" ? (active + 1) % count
      : event.key === "ArrowLeft" ? (active + count - 1) % count
      : event.key === "Home" ? 0 : event.key === "End" ? count - 1 : -1;
    if (next < 0) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section className="band-dark sec bench" id="benchmarks" aria-labelledby="benchmarks-h">
      <div className="container bench-intro">
        <h2 id="benchmarks-h" className="t-display-lg" data-own>Trade compliance benchmarks</h2>
        <p className="bench-lead">Compare review time and evidence completeness across sample trade workflows.</p>
        <div className="bench-actions">
          <a className="btn bh-btn-primary" href={DEMO_URL} target="_blank" rel="noopener noreferrer">
            <BtnLabel>{cta.demoShort}</BtnLabel>
          </a>
          <button
            type="button"
            className="btn btn-secondary"
            aria-controls="benchmarks-data"
            aria-expanded={showData}
            onClick={() => setShowData(!showData)}
          >
            {showData ? "Show chart" : "View sample data"}
          </button>
        </div>
      </div>
      <div className="container bench-body">
        <div className="bench-tabs" role="tablist" aria-label="Benchmark datasets" onKeyDown={onKeyDown}>
          {benchmarkDatasets.map((item, index) => (
            <button
              key={item.id}
              ref={el => { tabRefs.current[index] = el; }}
              type="button"
              role="tab"
              id={`benchmarks-tab-${item.id}`}
              aria-controls="benchmarks-panel"
              aria-selected={active === index}
              tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div
          className="bench-chart"
          id="benchmarks-panel"
          role="tabpanel"
          aria-labelledby={`benchmarks-tab-${dataset.id}`}
          tabIndex={0}
        >
          <p className="bench-sample">Illustrative data</p>
          {!showData && <BenchmarkPlot runs={dataset.runs} />}
          <div className={showData ? "bench-data" : "sr"} id="benchmarks-data">
            <table>
              <caption>{dataset.label} sample data</caption>
              <thead>
                <tr><th scope="col">Run</th><th scope="col">Workflow</th><th scope="col">{time.label}</th><th scope="col">{completeness.label}</th></tr>
              </thead>
              <tbody>
                {dataset.runs.map(run => (
                  <tr key={run.id}>
                    <th scope="row">{run.id}</th>
                    <td>{benchmarkSeries[run.series]}</td>
                    <td>{run.minutes}</td>
                    <td>{run.completeness}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <aside className="bench-notes" aria-label="Evaluation notes">
          <dl>
            <div><dt>Dataset</dt><dd>{dataset.sample}</dd></div>
            <div><dt>Evaluation methodology</dt><dd>{dataset.methodology}</dd></div>
            <div><dt>Testing dates</dt><dd>{dataset.testingDates}</dd></div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
