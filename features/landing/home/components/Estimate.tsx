import { createContext, useCallback, useContext, useId, useMemo, useState, type ReactNode } from "react";
import { DEMO_URL, cta, eudrRates, pricing } from "../content";
import { BtnLabel, Dialog } from "./bits";

const eur = (value: number) => "€" + value.toLocaleString("en-GB");

export function EudrEstimator({ compact = false }: { compact?: boolean }) {
  const { filings, setFilings, extendedRetention, setExtendedRetention } = useEstimate();
  const id = useId();
  const C = pricing.calc;
  const perFiling = eudrRates.filing + (extendedRetention ? eudrRates.keepTen : eudrRates.keepFive);
  const workspace = eudrRates.workspaceMonthly * 12;
  const subtotal = filings * perFiling;

  return (
    <div className={compact ? "calc calc-compact" : "calc"}>
      <label className="calc-row" htmlFor={id}>
        <span className="bh-eyebrow">{C.filings}</span>
        <span className="num calc-n" aria-hidden="true">{filings}</span>
      </label>
      <input id={id} type="range" min={1} max={200} value={filings}
        onChange={event => setFilings(event.currentTarget.valueAsNumber)}
        style={{ ["--fill" as string]: `${((filings - 1) / 199) * 100}%` }} />
      {compact ? (
        <p className="calc-basis">{extendedRetention ? "10" : "5"} years of record retention and 12 months of workspace access</p>
      ) : (
        <>
          <fieldset className="calc-keep">
            <legend className="bh-eyebrow">{C.keep}</legend>
            <label className={extendedRetention ? "opt" : "opt is-on"}><input type="radio" name={id} checked={!extendedRetention} onChange={() => setExtendedRetention(false)} />{C.keep5}</label>
            <label className={extendedRetention ? "opt is-on" : "opt"}><input type="radio" name={id} checked={extendedRetention} onChange={() => setExtendedRetention(true)} />{C.keep10}</label>
          </fieldset>
          <dl className="calc-lines">
            <div><dt>{filings} {C.lineFilings} × {eur(perFiling)}</dt><dd className="num">{eur(subtotal)}</dd></div>
            <div><dt>{C.lineWorkspace}</dt><dd className="num">{eur(workspace)}</dd></div>
          </dl>
        </>
      )}
      <div className="calc-total" aria-live="polite">
        <span className="bh-eyebrow">{C.total}</span>
        <span className="num num-key calc-sum">{eur(subtotal + workspace)}</span>
        <span className="t-caption t-muted">{C.vat}</span>
      </div>
      {!compact && <a className="btn bh-btn-primary calc-book" href={DEMO_URL} target="_blank" rel="noopener noreferrer"><BtnLabel>{cta.popupBook}</BtnLabel></a>}
    </div>
  );
}

type Estimate = {
  show: (opener: HTMLElement) => void;
  filings: number;
  setFilings: (count: number) => void;
  extendedRetention: boolean;
  setExtendedRetention: (enabled: boolean) => void;
};

const EstimateCtx = createContext<Estimate | null>(null);

export function EstimateProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [opener, setOpener] = useState<HTMLElement | null>(null);
  const [filings, setFilings] = useState(24);
  const [extendedRetention, setExtendedRetention] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const show = useCallback((el: HTMLElement) => { setOpener(el); setOpen(true); }, []);
  const value = useMemo(() => ({ show, filings, setFilings, extendedRetention, setExtendedRetention }), [show, filings, extendedRetention]);

  return (
    <EstimateCtx.Provider value={value}>
      {children}
      <Dialog id="calc" open={open} onClose={close} opener={opener} title={pricing.calc.title} label={pricing.calc.label}><EudrEstimator /></Dialog>
    </EstimateCtx.Provider>
  );
}

export function useEstimate() {
  const estimate = useContext(EstimateCtx);
  if (!estimate) throw new Error("Missing estimate provider");
  return estimate;
}
