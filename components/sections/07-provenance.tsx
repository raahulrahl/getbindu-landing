/* Mirrors parallel.ai section 7 "Production-grade trust": provenance and
   confidence attached to every output. pad 80/80. */
const ROWS = [
  ["What it is and how much", "Commercial invoice", "Checked"],
  ["Who supplied it", "Supplier declaration", "Checked"],
  ["Where it was made", "Plot geolocation", "Checked"],
  ["When the land was cleared", "Forest cover data", "Checked"],
];

export function Provenance() {
  return (
    <section className="section rule-top">
      <div className="rail">
        <h2>Every check cites the rule it came from</h2>
        <p className="prose-measure mt-4 text-grey-700">
          A filing is only worth what it can prove. Each line in the record carries the
          document it came from and the article it satisfies, so an auditor can follow it
          back without asking you.
        </p>
        <a href="/docs" className="btn btn-tertiary mt-6">Read the docs</a>
      </div>

      <div className="panel hairline">
        <div className="card overflow-hidden">
          <div className="border-b border-grey-300 px-5 py-4">
            <p className="eyebrow">Compliance record · example</p>
          </div>
          <table className="table">
            <thead>
              <tr><th>Requirement</th><th>Evidence</th><th>State</th></tr>
            </thead>
            <tbody>
              {ROWS.map(([req, ev, st]) => (
                <tr key={req}>
                  <td>{req}</td>
                  <td className="num">{ev}</td>
                  <td>
                    <span className="status"><span className="status-dot" aria-hidden />{st}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <span className="status"><span className="status-dot" aria-hidden />4 of 4 checks pass</span>
            <span className="font-mono text-[13px] text-grey-700">Reference issued to customs</span>
          </div>
        </div>
      </div>
    </section>
  );
}
