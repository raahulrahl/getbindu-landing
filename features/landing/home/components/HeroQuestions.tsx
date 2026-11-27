import { ArrowUp, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { regulationQuestions, type RegulationQuestion } from "../regulation-questions";

export function HeroQuestions() {
  const [question, setQuestion] = useState("What is CBAM?");
  const [answers, setAnswers] = useState<RegulationQuestion[] | null>(null);

  function ask(value: string) {
    const query = value.trim();
    if (!query) return;
    setQuestion(query);
    setAnswers(regulationQuestions.filter((topic) => topic.match.test(query)));
  }

  return (
    <section className="hero-guide" aria-labelledby="hero-guide-heading">
      <h2 id="hero-guide-heading" className="sr" data-own>Ask about EU trade rules</h2>
      <div className="hero-guide-topics" role="group" aria-label="Suggested regulations">
        {regulationQuestions.map((topic) => (
          <button key={topic.id} type="button" className="btn" aria-pressed={answers?.includes(topic) ?? false}
            onClick={() => ask(topic.question)}>{topic.label}</button>
        ))}
      </div>
      <form className="hero-question" onSubmit={(event) => { event.preventDefault(); ask(question); }}>
        <label htmlFor="hero-regulation-question" className="sr">Question about an EU regulation</label>
        <input id="hero-regulation-question" value={question} onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask about an EU regulation" type="text" autoComplete="off" maxLength={180} required />
        <button type="submit" className="btn bh-btn-primary">Ask <ArrowUp size={14} aria-hidden="true" /></button>
      </form>
      <div className="hero-guide-results" aria-live="polite">
        {answers?.length === 0 && <p>Choose a regulation above for a quick overview.</p>}
        {answers?.map((topic) => (
          <article key={topic.id} className="hero-guide-answer">
            <h3>{topic.title}</h3>
            <p>{topic.answer}</p>
            <div className="hero-guide-links">
              {topic.href && <a href={topic.href}>Read more about {topic.label}</a>}
              <a href={topic.source} target="_blank" rel="noopener noreferrer">
                {topic.href ? "EU source" : "European Commission guidance"} <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
