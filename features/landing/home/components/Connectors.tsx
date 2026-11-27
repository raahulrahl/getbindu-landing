import { FileCheck, Mail, MessageCircle } from "lucide-react";

export function WorkflowChannels() {
  return (
    <section className="band-dark sec workflow-channels" id="connections" aria-labelledby="connections-h">
      <div className="container connector-row">
        <h2 id="connections-h" className="connector-heading">Filing and supplier channels</h2>
        <ul className="connector-channels" role="list">
          <li><a href="/eudr"><FileCheck size={24} strokeWidth={1.65} aria-hidden="true" />EU TRACES</a></li>
          <li><span><MessageCircle size={24} strokeWidth={1.65} aria-hidden="true" />WhatsApp</span></li>
          <li><span><Mail size={24} strokeWidth={1.65} aria-hidden="true" />Email</span></li>
        </ul>
      </div>
    </section>
  );
}
