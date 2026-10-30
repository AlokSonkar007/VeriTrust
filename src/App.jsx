import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, AlertCircle, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight,
  Bell, BookOpen, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, ClipboardCheck, Clock3, Download, Eye, FileCheck2, FileImage,
  FileSearch, FileText, Filter, FolderOpen, Gauge, Menu, MoreHorizontal, Plus,
  RefreshCw, Search, Settings, ShieldCheck, ShieldAlert, SlidersHorizontal,
  Upload, UserRound, Users, X, XCircle, Building2, CalendarDays, History,
  MessageSquare, ExternalLink, LockKeyhole, Info, ScanSearch
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from "recharts";

const applicationSeed = [
  { id: "VT-2026-0148", institution: "Northfield Institute of Technology", short: "NIT Northfield", type: "Extension of Approval", submitted: "24 Oct 2026", status: "Under Review", reviewer: "Ananya Verma", documents: 18, verified: 15, findings: 2 },
  { id: "VT-2026-0147", institution: "Riverview College of Engineering", short: "Riverview College", type: "New Institution", submitted: "23 Oct 2026", status: "Action Required", reviewer: "Rahul Mehta", documents: 14, verified: 9, findings: 4 },
  { id: "VT-2026-0146", institution: "Meridian School of Applied Sciences", short: "Meridian School", type: "Increase in Intake", submitted: "22 Oct 2026", status: "Verified", reviewer: "Priya Nair", documents: 21, verified: 21, findings: 0 },
  { id: "VT-2026-0145", institution: "Eastgate Technical University", short: "Eastgate University", type: "Extension of Approval", submitted: "21 Oct 2026", status: "Processing", reviewer: "Ananya Verma", documents: 17, verified: 12, findings: 1 },
  { id: "VT-2026-0144", institution: "Pioneer College of Technology", short: "Pioneer College", type: "New Institution", submitted: "20 Oct 2026", status: "Submitted", reviewer: "Unassigned", documents: 12, verified: 0, findings: 0 },
  { id: "VT-2026-0143", institution: "Crescent Institute of Engineering", short: "Crescent Institute", type: "Change in Site", submitted: "18 Oct 2026", status: "Action Required", reviewer: "Rahul Mehta", documents: 16, verified: 11, findings: 3 },
  { id: "VT-2026-0142", institution: "Westbridge College of Technology", short: "Westbridge College", type: "Extension of Approval", submitted: "17 Oct 2026", status: "Verified", reviewer: "Priya Nair", documents: 19, verified: 19, findings: 0 },
  { id: "VT-2026-0141", institution: "Summit Institute of Innovation", short: "Summit Institute", type: "Increase in Intake", submitted: "15 Oct 2026", status: "Draft", reviewer: "Unassigned", documents: 7, verified: 0, findings: 0 }
];

const documentSeed = [
  { id: "DOC-9812", name: "Institution Registration Certificate.pdf", category: "Institutional", institution: "Northfield Institute of Technology", appId: "VT-2026-0148", uploaded: "24 Oct 2026", size: "1.8 MB", status: "Verified", pages: 4, expiry: "18 Mar 2028" },
  { id: "DOC-9813", name: "Faculty Position Statement.pdf", category: "Faculty", institution: "Northfield Institute of Technology", appId: "VT-2026-0148", uploaded: "24 Oct 2026", size: "2.4 MB", status: "Review", pages: 12, expiry: "—" },
  { id: "DOC-9808", name: "Building Safety Certificate.pdf", category: "Infrastructure", institution: "Riverview College of Engineering", appId: "VT-2026-0147", uploaded: "23 Oct 2026", size: "960 KB", status: "Expired", pages: 3, expiry: "30 Sep 2026" },
  { id: "DOC-9809", name: "Land Ownership Deed.pdf", category: "Land & Building", institution: "Riverview College of Engineering", appId: "VT-2026-0147", uploaded: "23 Oct 2026", size: "3.1 MB", status: "Verified", pages: 18, expiry: "—" },
  { id: "DOC-9801", name: "Audited Financial Statement FY25.pdf", category: "Financial", institution: "Meridian School of Applied Sciences", appId: "VT-2026-0146", uploaded: "22 Oct 2026", size: "1.2 MB", status: "Verified", pages: 9, expiry: "—" },
  { id: "DOC-9798", name: "Fire Safety Compliance Certificate.pdf", category: "Infrastructure", institution: "Eastgate Technical University", appId: "VT-2026-0145", uploaded: "21 Oct 2026", size: "740 KB", status: "Review", pages: 2, expiry: "11 Dec 2026" },
  { id: "DOC-9794", name: "Faculty Qualification Records.pdf", category: "Faculty", institution: "Crescent Institute of Engineering", appId: "VT-2026-0143", uploaded: "18 Oct 2026", size: "4.6 MB", status: "Review", pages: 26, expiry: "—" }
];

const findingSeed = [
  { id: "F-2048", severity: "High", title: "Faculty strength mismatch", document: "Faculty Position Statement.pdf", page: 6, field: "Total faculty count", detected: "42", expected: "48", rule: "AICTE-FAC-04", explanation: "The faculty count declared in the application does not match the supporting faculty position statement. Six positions need reviewer confirmation.", state: "Open" },
  { id: "F-2049", severity: "Medium", title: "Certificate nearing expiry", document: "Fire Safety Compliance Certificate.pdf", page: 1, field: "Valid until", detected: "11 Dec 2026", expected: "Valid for review period", rule: "AICTE-INF-02", explanation: "The certificate remains valid today but is close to expiry. Confirm that it covers the relevant approval period.", state: "Open" },
  { id: "F-2050", severity: "Low", title: "Institution name formatting differs", document: "Institution Registration Certificate.pdf", page: 1, field: "Institution name", detected: "Northfield Inst. of Technology", expected: "Northfield Institute of Technology", rule: "AICTE-ORG-01", explanation: "The extracted name appears to be an abbreviated form. A reviewer should confirm that both records refer to the same institution.", state: "Open" }
];

const ruleSeed = [
  { id: "AICTE-ORG-01", name: "Institution identity consistency", category: "Institutional", description: "Institution name and registration identifiers should remain consistent across submitted records.", condition: "Compare institution name and registration ID across application and registration documents.", severity: "High", status: "Active", updated: "18 Oct 2026" },
  { id: "AICTE-FAC-04", name: "Faculty strength validation", category: "Faculty", description: "Declared faculty strength should match the supporting faculty position statement.", condition: "Declared faculty count must equal the count of eligible faculty records.", severity: "High", status: "Active", updated: "16 Oct 2026" },
  { id: "AICTE-INF-02", name: "Safety certificate validity", category: "Infrastructure", description: "Safety certificates should be valid for the applicable review period.", condition: "Certificate expiry date must fall after the review-period end date.", severity: "Medium", status: "Active", updated: "12 Oct 2026" },
  { id: "AICTE-FIN-03", name: "Audited statement completeness", category: "Financial", description: "Required audited financial statements should be present for each applicable financial year.", condition: "Confirm required audit years and auditor details are present.", severity: "Medium", status: "Active", updated: "10 Oct 2026" },
  { id: "AICTE-DOC-07", name: "Document signature presence", category: "Documentation", description: "Documents requiring authorization should contain a visible signature or digital signature marker.", condition: "Check signature region and record presence for reviewer confirmation.", severity: "Low", status: "Paused", updated: "08 Oct 2026" }
];

const activitySeed = [
  { id: 1, actor: "Verification engine", action: "Flagged a faculty strength mismatch", appId: "VT-2026-0148", time: "Today, 10:42 AM", kind: "system" },
  { id: 2, actor: "Ananya Verma", action: "Marked registration certificate as reviewed", appId: "VT-2026-0148", time: "Today, 10:18 AM", kind: "human" },
  { id: 3, actor: "Rahul Mehta", action: "Requested clarification on safety certificate", appId: "VT-2026-0147", time: "Today, 09:54 AM", kind: "human" },
  { id: 4, actor: "Verification engine", action: "Completed document extraction", appId: "VT-2026-0145", time: "Yesterday, 04:22 PM", kind: "system" },
  { id: 5, actor: "Priya Nair", action: "Finalized application verification", appId: "VT-2026-0146", time: "Yesterday, 02:16 PM", kind: "human" }
];

const processingData = [
  { name: "Submitted", value: 18, color: "#9eabb9" },
  { name: "In review", value: 26, color: "#5e8db7" },
  { name: "Flagged", value: 9, color: "#d2a04d" },
  { name: "Verified", value: 47, color: "#6c9b81" }
];

const trendData = [
  { day: "20 Oct", submitted: 9, verified: 5 },
  { day: "21 Oct", submitted: 13, verified: 8 },
  { day: "22 Oct", submitted: 11, verified: 9 },
  { day: "23 Oct", submitted: 17, verified: 12 },
  { day: "24 Oct", submitted: 14, verified: 11 },
  { day: "25 Oct", submitted: 19, verified: 15 },
  { day: "26 Oct", submitted: 16, verified: 14 }
];

const navigation = [
  { id: "overview", label: "Overview", icon: Gauge },
  { id: "applications", label: "Applications", icon: ClipboardCheck, count: "24" },
  { id: "documents", label: "Document repository", icon: FolderOpen },
  { id: "verification", label: "Verification centre", icon: ScanSearch },
  { id: "rules", label: "Compliance rules", icon: BookOpen },
  { id: "reports", label: "Reports", icon: Activity },
  { id: "audit", label: "Audit trail", icon: History }
];

const cx = (...parts) => parts.filter(Boolean).join(" ");
const today = () => new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const makeId = (prefix) => prefix + "-" + Math.floor(1000 + Math.random() * 9000);

function useStoredState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* local storage may be unavailable */ }
  }, [key, value]);
  return [value, setValue];
}

function Status({ value }) {
  const cls = value === "Verified" ? "verified" :
    value === "Action Required" || value === "Expired" || value === "Rejected" ? "action" :
    value === "Under Review" || value === "Review" ? "review" :
    value === "Processing" ? "processing" : value === "Draft" ? "draft" :
    value === "Submitted" ? "submitted" : "submitted";
  return <span className={"status " + cls}>{value}</span>;
}

function Severity({ value }) {
  return <span className={"severity " + String(value || "").toLowerCase()}>{value} priority</span>;
}

function Button({ children, onClick, variant = "default", size = "", icon: Icon, disabled = false, className = "", type = "button", form }) {
  return <button type={type} form={form} disabled={disabled} onClick={onClick} className={cx("btn", variant === "primary" && "btn-primary", variant === "quiet" && "btn-quiet", variant === "danger" && "btn-danger", size === "sm" && "btn-sm", className)}>
    {Icon && <Icon size={14} strokeWidth={1.8} />}{children}
  </button>;
}

function Panel({ title, subtitle, action, children, className = "" }) {
  return <section className={cx("panel", className)}>
    {(title || action) && <div className="panel-head"><div>{title && <div className="panel-title">{title}</div>}{subtitle && <div className="panel-subtitle">{subtitle}</div>}</div>{action}</div>}
    {children}
  </section>;
}

function PageHeading({ eyebrow = "VERITRUST WORKSPACE", title, description, actions }) {
  return <div className="page-heading">
    <div><div className="eyebrow">{eyebrow}</div><h1 className="page-title">{title}</h1>{description && <p className="page-description">{description}</p>}</div>
    {actions && <div className="heading-actions">{actions}</div>}
  </div>;
}

function Kpi({ label, value, note, change, icon: Icon, trend = "up" }) {
  return <div className="panel kpi">
    <div className="kpi-top"><span>{label}</span><span className="kpi-icon"><Icon size={15} /></span></div>
    <div className="kpi-value">{value}</div>
    <div className="kpi-foot"><span className={trend === "warn" ? "trend-warn" : "trend-up"}>{change}</span><span>{note}</span></div>
  </div>;
}

function ApplicationTable({ rows, onOpen, onAssign, compact = false }) {
  return <div className="data-table-wrap"><table className="data-table">
    <thead><tr><th>Application</th><th>Institution</th><th>Application type</th><th>Submitted</th><th>Status</th><th>Reviewer</th><th></th></tr></thead>
    <tbody>{rows.length ? rows.map((app) => <tr key={app.id}>
      <td><button className="text-link id-text" onClick={() => onOpen(app.id)}>{app.id}</button></td>
      <td><span className="cell-primary">{app.institution}</span></td>
      <td>{app.type}</td><td>{app.submitted}</td><td><Status value={app.status} /></td>
      <td>{onAssign ? <select className="select" style={{ fontSize: "10px", padding: "5px 7px", minWidth: 120 }} value={app.reviewer} onChange={(e) => onAssign(app.id, e.target.value)}><option>Ananya Verma</option><option>Rahul Mehta</option><option>Priya Nair</option><option>Unassigned</option></select> : app.reviewer}</td><td><button className="table-action" title="Open application" onClick={() => onOpen(app.id)}><ArrowRight size={15} /></button></td>
    </tr>) : <tr><td colSpan="7"><div className="empty-state">No applications match these filters.</div></td></tr>}</tbody>
  </table></div>;
}

function ActivityFeed({ items }) {
  return <div className="activity-list">{items.slice(0, 5).map((item) => <div className="activity-row" key={item.id}>
    <span className="activity-dot" style={{ background: item.kind === "system" ? "#7e9fbd" : "#78a48a" }} />
    <div><div className="activity-copy"><strong>{item.actor}</strong> {item.action} <span className="id-text">{item.appId}</span></div><div className="activity-time">{item.time}</div></div>
  </div>)}</div>;
}

function OverviewPage({ applications, activity, onOpen, onNavigate, onNew }) {
  const recent = applications.slice(0, 5);
  return <>
    <PageHeading title="Good morning, Ananya" description="Here’s the latest compliance activity across your institution portfolio."
      actions={<><Button icon={Download} onClick={() => onNavigate("reports")}>Export overview</Button><Button variant="primary" icon={Plus} onClick={onNew}>New application</Button></>} />
    <div className="grid kpi-grid">
      <Kpi label="Total applications" value="248" change="+12.8%" note="vs. previous month" icon={ClipboardCheck} />
      <Kpi label="Pending verification" value="36" change="8 due this week" note="across 14 institutions" icon={Clock3} trend="warn" />
      <Kpi label="Verified applications" value="184" change="+8.4%" note="vs. previous month" icon={CheckCircle2} />
      <Kpi label="Requiring attention" value="28" change="6 high priority" note="review recommended" icon={AlertTriangle} trend="warn" />
    </div>
    <div className="grid content-grid">
      <Panel title="Application processing" subtitle="Portfolio status distribution · Current cycle" action={<button className="text-link" onClick={() => onNavigate("applications")}>View applications <ArrowRight size={12} /></button>}>
        <div className="panel-body" style={{ display: "grid", gridTemplateColumns: "minmax(180px,.85fr) minmax(180px,1.15fr)", alignItems: "center", gap: 12 }}>
          <div style={{ height: 208, position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={processingData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={80} paddingAngle={3} stroke="none">{processingData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
            <div style={{ position: "absolute", inset: 0, display: "grid", placeContent: "center", textAlign: "center", pointerEvents: "none" }}><strong style={{ fontSize: 25, color: "#2b394b" }}>248</strong><span className="tiny muted">Applications</span></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            {processingData.map((d) => <div key={d.name}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 10, color: "#778496" }}><span style={{ display: "flex", alignItems: "center", gap: 7 }}><i className="legend-swatch" style={{ background: d.color }} />{d.name}</span><strong style={{ color: "#37465a" }}>{d.value}%</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: d.value + "%", background: d.color }} /></div></div>)}
            <div className="small muted" style={{ lineHeight: 1.5, paddingTop: 2 }}>Status figures are sample portfolio data for this prototype.</div>
          </div>
        </div>
      </Panel>
      <Panel title="Needs your attention" subtitle="Items that may need reviewer action" action={<button className="text-link" onClick={() => onNavigate("applications")}>See all</button>}>
        <div className="panel-body"><div className="attention-list">
          <div className="attention-item"><div className="attn-icon red"><AlertCircle size={14} /></div><div style={{ flex: 1 }}><div className="attn-title">Expired building safety certificate</div><div className="attn-detail">Riverview College · VT-2026-0147</div></div><span className="pill">High</span></div>
          <div className="attention-item"><div className="attn-icon"><Users size={14} /></div><div style={{ flex: 1 }}><div className="attn-title">Faculty strength mismatch</div><div className="attn-detail">Northfield Institute · VT-2026-0148</div></div><span className="pill">High</span></div>
          <div className="attention-item"><div className="attn-icon"><FileSearch size={14} /></div><div style={{ flex: 1 }}><div className="attn-title">Institution name requires confirmation</div><div className="attn-detail">Northfield Institute · VT-2026-0148</div></div><span className="pill">Low</span></div>
          <div className="attention-item"><div className="attn-icon"><Clock3 size={14} /></div><div style={{ flex: 1 }}><div className="attn-title">Clarification response pending</div><div className="attn-detail">Crescent Institute · VT-2026-0143</div></div><span className="pill">Medium</span></div>
        </div></div>
      </Panel>
    </div>
    <div className="grid content-grid">
      <Panel title="Recent applications" subtitle="Latest submissions across your review queue" action={<button className="text-link" onClick={() => onNavigate("applications")}>All applications <ArrowRight size={12} /></button>}>
        <ApplicationTable rows={recent} onOpen={onOpen} compact />
      </Panel>
      <Panel title="Recent activity" subtitle="Latest reviewer and system events" action={<button className="text-link" onClick={() => onNavigate("audit")}>Audit trail</button>}>
        <div className="panel-body"><ActivityFeed items={activity} /></div>
      </Panel>
    </div>
  </>;
}

function ApplicationsPage({ applications, onOpen, onNew, onAssign, initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState("All statuses");
  const [kind, setKind] = useState("All types");
  const [sort, setSort] = useState("Newest first");
  const filtered = useMemo(() => {
    let rows = applications.filter((a) => (a.id + " " + a.institution + " " + a.reviewer).toLowerCase().includes(query.toLowerCase()));
    if (status !== "All statuses") rows = rows.filter((a) => a.status === status);
    if (kind !== "All types") rows = rows.filter((a) => a.type === kind);
    if (sort === "Oldest first") rows = [...rows].reverse();
    return rows;
  }, [applications, query, status, kind, sort]);
  return <>
    <PageHeading title="Applications" description="Manage institutional submissions and reviewer assignments."
      actions={<Button variant="primary" icon={Plus} onClick={onNew}>New application</Button>} />
    <div className="toolbar">
      <div className="searchbox"><Search size={14} /><input className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search ID, institution or reviewer..." /></div>
      <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}><option>All statuses</option>{["Draft", "Submitted", "Processing", "Under Review", "Action Required", "Verified", "Rejected"].map((x) => <option key={x}>{x}</option>)}</select>
      <select className="select" value={kind} onChange={(e) => setKind(e.target.value)}><option>All types</option>{["Extension of Approval", "New Institution", "Increase in Intake", "Change in Site"].map((x) => <option key={x}>{x}</option>)}</select>
      <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}><option>Newest first</option><option>Oldest first</option></select>
      <span className="muted small" style={{ marginLeft: "auto" }}>{filtered.length} records</span>
    </div>
    <Panel><ApplicationTable rows={filtered} onOpen={onOpen} onAssign={onAssign} /></Panel>
    <div className="small muted" style={{ marginTop: 12 }}>Showing sample application records. Create a new application to add a record to this browser session.</div>
  </>;
}

function ApplicationWorkspace({ app, documents, onBack, onNavigate, onAudit, onStatus, onToast }) {
  const [tab, setTab] = useState("Documents");
  const [selectedDoc, setSelectedDoc] = useState(documents.find((d) => d.appId === app.id) || documents[0]);
  const [comments, setComments] = useState("");
  const [reviewed, setReviewed] = useState([]);
  const [findingStates, setFindingStates] = useState({});
  const [confirmAction, setConfirmAction] = useState(false);
  const appFindings = findingSeed.filter((f) => app.id === "VT-2026-0148" || app.id === "VT-2026-0147" || app.id === "VT-2026-0143").slice(0, app.id === "VT-2026-0148" ? 3 : 2);
  const appDocs = documents.filter((d) => d.appId === app.id);
  const setFinding = (id, value) => {
    setFindingStates((s) => ({ ...s, [id]: value }));
    onAudit("Finding " + value.toLowerCase(), app.id, "Reviewer " + value.toLowerCase() + " finding " + id);
    onToast("Finding " + value.toLowerCase() + ".");
  };
  const submitComment = () => {
    if (!comments.trim()) return;
    onAudit("Reviewer comment added", app.id, comments.trim());
    setComments("");
    onToast("Reviewer comment added to the audit trail.");
  };
  return <>
    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
      <button className="btn btn-quiet btn-sm" onClick={onBack}><ChevronLeft size={14} /> Applications</button><span className="muted tiny">/</span><span className="id-text small">{app.id}</span>
    </div>
    <PageHeading eyebrow="APPLICATION REVIEW WORKSPACE" title={app.institution} description={app.id + " · " + app.type + " · Submitted " + app.submitted}
      actions={<><Status value={app.status} /><Button onClick={() => onNavigate("audit")} icon={History}>View audit trail</Button><Button variant="primary" icon={CheckCircle2} onClick={() => setConfirmAction(true)}>Finalize review</Button></>} />
    <div className="grid" style={{ gridTemplateColumns: "repeat(4,minmax(0,1fr))", marginBottom: 15 }}>
      <div className="panel" style={{ padding: 14 }}><div className="small muted">Assigned reviewer</div><div className="cell-primary" style={{ marginTop: 7 }}>{app.reviewer}</div></div>
      <div className="panel" style={{ padding: 14 }}><div className="small muted">Documents received</div><div className="metric-inline" style={{ marginTop: 5 }}><strong>{appDocs.length || app.documents}</strong><span>documents</span></div></div>
      <div className="panel" style={{ padding: 14 }}><div className="small muted">Documents reviewed</div><div className="metric-inline" style={{ marginTop: 5 }}><strong>{Math.max(app.verified, reviewed.length)}</strong><span>of {app.documents}</span></div></div>
      <div className="panel" style={{ padding: 14 }}><div className="small muted">Open findings</div><div className="metric-inline" style={{ marginTop: 5 }}><strong>{appFindings.filter((f) => !(findingStates[f.id] === "Accepted" || findingStates[f.id] === "Dismissed")).length}</strong><span>need attention</span></div></div>
    </div>
    <div className="notice" style={{ marginBottom: 14 }}><Info size={14} /> Automated extraction and checks shown here are simulated prototype data. Flags are prompts for human review, not proof of non-compliance or fraud.</div>
    <div className="detail-grid">
      <div>
        <Panel title="Application evidence" subtitle="Documents submitted with this application" action={<Button size="sm" icon={Upload} onClick={() => onNavigate("documents")}>Add document</Button>}>
          <div className="panel-body">
            <div className="page-tabs">{["Documents", "Findings", "Reviewer notes"].map((t) => <button className={cx("page-tab", tab === t && "active")} onClick={() => setTab(t)} key={t}>{t}</button>)}</div>
            {tab === "Documents" && <div>
              {appDocs.length ? appDocs.map((doc) => <div className="doc-row" key={doc.id}>
                <div className="file-icon"><FileText size={16} /></div><div style={{ minWidth: 0, flex: 1 }}><div className="doc-name">{doc.name}</div><div className="doc-meta">{doc.id} · {doc.pages} pages · {doc.size}</div></div>
                <div className="doc-status"><Status value={doc.status === "Expired" ? "Action Required" : doc.status === "Review" ? "Under Review" : "Verified"} /></div>
                <button className="table-action" title="Preview document" onClick={() => setSelectedDoc(doc)}><Eye size={15} /></button>
              </div>) : <div className="empty-state">No documents have been attached to this sample application.</div>}
              <div style={{ marginTop: 14 }}><div className="small muted" style={{ marginBottom: 7 }}>Review completion</div><div className="progress-track"><div className="progress-fill" style={{ width: Math.round((app.verified / Math.max(app.documents, 1)) * 100) + "%" }} /></div><div className="small muted" style={{ marginTop: 6 }}>{app.verified} of {app.documents} documents reviewed</div></div>
            </div>}
            {tab === "Findings" && <div>{appFindings.map((f) => <div className="finding-card" key={f.id}>
              <div className="finding-head"><span className="id-text tiny">{f.id}</span><Severity value={f.severity} /></div><div className="finding-title">{f.title}</div><div className="finding-text">{f.explanation}</div><div className="evidence-line"><FileText size={12} /> {f.document} · Page {f.page} · {f.field}</div>
              <div style={{ display: "flex", gap: 7, marginTop: 10 }}><Button size="sm" variant="primary" onClick={() => setFinding(f.id, "Accepted")} disabled={findingStates[f.id] === "Accepted"}><Check size={12} /> Accept</Button><Button size="sm" onClick={() => setFinding(f.id, "Dismissed")} disabled={findingStates[f.id] === "Dismissed"}><X size={12} /> Dismiss</Button><span className="small muted" style={{ alignSelf: "center" }}>{findingStates[f.id] || f.state}</span></div>
            </div>)}</div>}
            {tab === "Reviewer notes" && <div><div className="field"><label>Add an internal reviewer note</label><textarea className="textarea" value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Record the rationale, follow-up required or context for the next reviewer..." /></div><div style={{ display: "flex", justifyContent: "flex-end", marginTop: 9 }}><Button variant="primary" size="sm" icon={MessageSquare} onClick={submitComment}>Save note</Button></div><div className="notice" style={{ marginTop: 14 }}><LockKeyhole size={13} /> Notes are recorded in this prototype's local audit history.</div></div>}
          </div>
        </Panel>
        <Panel title="Selected document" subtitle={selectedDoc ? selectedDoc.name : "Choose a document to inspect"} className="" >
          <div className="panel-body">
            <div className="preview-sheet">
              <div className="preview-brand"><ShieldCheck size={15} /> {selectedDoc ? selectedDoc.institution : "VeriTrust evidence preview"}</div>
              <div className="preview-title">{selectedDoc ? selectedDoc.name.replace(".pdf", "") : "Document preview"}</div>
              <div className="small muted" style={{ textAlign: "center" }}>Illustrative PDF preview · Page 1 of {selectedDoc?.pages || "—"}</div>
              <div style={{ margin: "20px auto", maxWidth: 390 }}>
                <div className="preview-line" /><div className="preview-line short" /><div className="preview-line" />
                <div className="preview-highlight">Evidence reference: extracted field values shown for reviewer inspection.</div>
                <div className="preview-line" /><div className="preview-line short" /><div className="preview-line" />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}><span className="small muted">{selectedDoc ? selectedDoc.id + " · " + selectedDoc.size : "No document selected"}</span><Button size="sm" icon={ExternalLink} onClick={() => onToast("Preview is a mock representation in this frontend prototype.")}>Open preview</Button></div>
          </div>
        </Panel>
      </div>
      <div>
        <Panel title="Verification findings" subtitle="Evidence-linked items flagged for reviewer attention">
          <div className="panel-body">
            {appFindings.slice(0, 3).map((f) => <div className="finding-card" key={f.id}>
              <div className="finding-head"><Severity value={f.severity} /><span className="id-text tiny">{f.id}</span></div>
              <div className="finding-title">{f.title}</div><div className="finding-text">{f.explanation}</div>
              <div className="evidence-line"><FileSearch size={12} /> Page {f.page} · {f.field} · Rule {f.rule}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 9 }}><Button size="sm" onClick={() => { setSelectedDoc(appDocs.find((d) => d.name === f.document) || appDocs[0]); setTab("Documents"); }}>View evidence</Button><span className="small muted" style={{ alignSelf: "center" }}>{findingStates[f.id] || f.state}</span></div>
            </div>)}
            {!appFindings.length && <div className="empty-state">No open findings.</div>}
          </div>
        </Panel>
        <Panel title="Reviewer decision" subtitle="Human review remains the final authority">
          <div className="panel-body">
            <div className="notice"><ShieldAlert size={14} /> Review all flagged evidence and required documents before finalizing an application.</div>
            <div style={{ display: "grid", gap: 8, marginTop: 13 }}>
              <Button className="btn-block" onClick={() => { onAudit("Documents marked reviewed", app.id, "Reviewer marked the current evidence set reviewed"); onToast("Review progress recorded."); }}> <CheckCircle2 size={13} /> Mark documents reviewed</Button>
              <Button className="btn-block" onClick={() => { onAudit("Clarification requested", app.id, "Reviewer requested additional institutional clarification"); onStatus(app.id, "Action Required"); onToast("Application marked as requiring action."); }}><MessageSquare size={13} /> Request clarification</Button>
              <Button className="btn-block" variant="primary" onClick={() => setConfirmAction(true)}><ClipboardCheck size={13} /> Finalize review</Button>
            </div>
          </div>
        </Panel>
      </div>
    </div>
    {confirmAction && <Modal title="Finalize application review" onClose={() => setConfirmAction(false)} footer={<><Button onClick={() => setConfirmAction(false)}>Cancel</Button><Button variant="primary" onClick={() => { onStatus(app.id, "Verified"); onAudit("Application marked verified", app.id, "Final reviewer decision recorded"); onToast("Application marked as verified."); setConfirmAction(false); }}>Confirm verification</Button></>}>
      <div className="notice"><Info size={14} /> This action records a human reviewer decision. Confirm that the required checks and supporting evidence have been reviewed.</div>
      <p className="small muted" style={{ lineHeight: 1.6, marginTop: 13 }}>Application <strong>{app.id}</strong> · {app.institution}</p>
    </Modal>}
  </>;
}

function RepositoryPage({ documents, onUpload, onToast }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [drag, setDrag] = useState(false);
  const fileRef = useRef(null);
  const filtered = documents.filter((d) => (d.name + " " + d.institution + " " + d.appId).toLowerCase().includes(query.toLowerCase()) && (category === "All categories" || d.category === category));
  const handleFiles = (files) => {
    if (!files || !files.length) return;
    onUpload(Array.from(files));
    if (files.length) onToast(files.length + " file" + (files.length > 1 ? "s" : "") + " added to the repository.");
  };
  return <>
    <PageHeading title="Document repository" description="A centralized record of institutional documents and supporting evidence."
      actions={<Button variant="primary" icon={Upload} onClick={() => fileRef.current?.click()}>Upload documents</Button>} />
    <input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.jpeg" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
    <div className={cx("upload-zone", drag && "drag")} onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}>
      <Upload size={23} /><div className="upload-title">Drop documents here, or <button className="text-link" onClick={() => fileRef.current?.click()}>browse files</button></div><div className="upload-help">PDF, PNG or JPG · Files remain in this browser prototype only</div>
    </div>
    <div className="grid kpi-grid" style={{ marginTop: 14 }}>
      <Kpi label="Stored documents" value={documents.length.toString()} change="+3" note="this week" icon={FolderOpen} />
      <Kpi label="Verified" value={documents.filter((d) => d.status === "Verified").length.toString()} change="—" note="reviewed records" icon={FileCheck2} />
      <Kpi label="Needs review" value={documents.filter((d) => d.status !== "Verified").length.toString()} change="3 priority" note="including expiry checks" icon={AlertCircle} trend="warn" />
      <Kpi label="Institutions" value="5" change="active" note="with stored documents" icon={Building2} />
    </div>
    <div className="toolbar" style={{ marginTop: 18 }}>
      <div className="searchbox"><Search size={14} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search documents or institution..." /></div>
      <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}><option>All categories</option>{["Institutional", "Faculty", "Infrastructure", "Land & Building", "Financial"].map((x) => <option key={x}>{x}</option>)}</select>
      <span className="small muted" style={{ marginLeft: "auto" }}>{filtered.length} documents</span>
    </div>
    <Panel title="All documents" subtitle="Uploaded institutional records">
      <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Document</th><th>Institution</th><th>Category</th><th>Uploaded</th><th>Expiry</th><th>Status</th><th></th></tr></thead>
        <tbody>{filtered.map((d) => <tr key={d.id}><td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="file-icon" style={{ width: 26, height: 29 }}><FileText size={14} /></span><span><span className="cell-primary">{d.name}</span><span className="cell-secondary">{d.id} · {d.size}</span></span></div></td><td>{d.institution}</td><td><span className="pill">{d.category}</span></td><td>{d.uploaded}</td><td>{d.expiry}</td><td><Status value={d.status === "Expired" ? "Action Required" : d.status === "Review" ? "Under Review" : "Verified"} /></td><td><button className="table-action" title="Details" onClick={() => onToast("Document details are available in the associated application workspace.")}><MoreHorizontal size={15} /></button></td></tr>)}
        {!filtered.length && <tr><td colSpan="7"><div className="empty-state">No documents found.</div></td></tr>}</tbody>
      </table></div>
    </Panel>
  </>;
}

function VerificationPage({ applications, onAudit, onToast }) {
  const [selected, setSelected] = useState(applications[0]?.id || "");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearInterval(timer.current), []);
  const stages = ["Document intake", "OCR & extraction", "Rule-based checks", "Cross-document match", "Anomaly review", "Risk assessment", "Human review"];
  const run = () => {
    clearInterval(timer.current);
    setRunning(true); setComplete(false); setProgress(0);
    timer.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer.current); setRunning(false); setComplete(true);
          onAudit("Verification simulation completed", selected, "Prototype verification workflow completed with sample findings");
          onToast("Verification simulation completed.");
          return 100;
        }
        return Math.min(100, p + 16);
      });
    }, 360);
  };
  return <>
    <PageHeading title="Verification centre" description="Run a structured review pipeline and inspect its evidence-backed outputs." actions={<span className="pill">Prototype simulation</span>} />
    <div className="notice" style={{ marginBottom: 15 }}><Info size={14} /> This workspace demonstrates the intended workflow using predefined sample results. It does not connect to a live OCR engine, AI model or regulatory data source.</div>
    <Panel title="Verification workflow" subtitle="Seven stages from document intake to human review">
      <div className="panel-body">
        <div className="workflow">{stages.map((s, i) => <div className={cx("workflow-step", progress >= (i + 1) * 14.2 ? "done" : progress > i * 14.2 && running ? "current" : i === 0 && !complete ? "current" : "")} key={s}>
          {i !== 6 && <span className="workflow-line" />}
          <div className="workflow-node">{progress >= (i + 1) * 14.2 ? <Check size={14} /> : i + 1}</div><div className="workflow-label">{s}</div>
        </div>)}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24 }}>
          <div style={{ flex: 1 }}><div className="progress-track"><div className="progress-fill" style={{ width: progress + "%" }} /></div></div><strong className="small" style={{ color: "#52647a", minWidth: 32 }}>{progress}%</strong>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 15, flexWrap: "wrap" }}>
          <select className="select" value={selected} onChange={(e) => setSelected(e.target.value)} style={{ minWidth: 260 }}><option value="">Select an application</option>{applications.map((a) => <option value={a.id} key={a.id}>{a.id} · {a.short}</option>)}</select>
          <Button variant="primary" icon={running ? RefreshCw : ScanSearch} onClick={run} disabled={!selected || running}>{running ? "Running checks..." : "Run verification"}</Button>
          {complete && <span className="small" style={{ color: "#438766", fontWeight: 700 }}><CheckCircle2 size={13} style={{ verticalAlign: "middle" }} /> Simulation complete</span>}
        </div>
      </div>
    </Panel>
    <div className="grid" style={{ gridTemplateColumns: "repeat(3,minmax(0,1fr))", marginTop: 14 }}>
      <Kpi label="Documents processed" value={progress ? "18" : "—"} change={progress ? "Complete" : "Awaiting run"} note="OCR intake stage" icon={FileText} />
      <Kpi label="Fields extracted" value={progress ? "246" : "—"} change={progress ? "Sample result" : "Awaiting run"} note="structured fields" icon={ScanSearch} />
      <Kpi label="Items to review" value={progress ? "4" : "—"} change={progress ? "2 high priority" : "Awaiting run"} note="human confirmation" icon={AlertTriangle} trend="warn" />
    </div>
    <div className="grid content-grid" style={{ marginTop: 14 }}>
      <Panel title="Validation checks" subtitle="Illustrative categories and validation coverage">
        <div className="panel-body">
          {[
            ["Completeness checks", "Required documents, mandatory fields and missing information", "18 / 20", "#6c9b81"],
            ["Validity checks", "Expiry dates, date ranges and signature presence", "14 / 16", "#5e8db7"],
            ["Cross-document checks", "Names, registration identifiers, faculty and dates", "21 / 24", "#d0a04c"],
            ["Anomaly indicators", "Unusual image patterns and possible document alterations", "3 / 4", "#8a91a4"]
          ].map((x) => <div key={x[0]} style={{ marginBottom: 17 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><strong className="small" style={{ color: "#46566b" }}>{x[0]}</strong><span className="small muted">{progress ? x[2] : "Not run"}</span></div><div className="small muted" style={{ marginBottom: 7 }}>{x[1]}</div><div className="progress-track"><div className="progress-fill" style={{ width: progress ? (parseInt(x[2], 10) / parseInt(x[2].split(" / ")[1], 10) * 100) + "%" : "0%", background: x[3] }} /></div></div>)}
        </div>
      </Panel>
      <Panel title="Sample verification findings" subtitle="Evidence requiring human confirmation">
        <div className="panel-body">
          <div className="finding-card"><div className="finding-head"><Severity value="High" /><span className="id-text tiny">F-2048</span></div><div className="finding-title">Faculty strength mismatch</div><div className="finding-text">Declared faculty count differs from supporting faculty records.</div><div className="evidence-line"><FileSearch size={12} /> Faculty Position Statement · Page 6</div></div>
          <div className="finding-card"><div className="finding-head"><Severity value="Medium" /><span className="id-text tiny">F-2049</span></div><div className="finding-title">Certificate nearing expiry</div><div className="finding-text">Safety certificate may not cover the complete review period.</div><div className="evidence-line"><FileText size={12} /> Fire Safety Certificate · Page 1</div></div>
          <div className="small muted" style={{ marginTop: 10 }}>Finding examples are shown for demonstration even before running the simulation.</div>
        </div>
      </Panel>
    </div>
  </>;
}

function RulesPage({ rules, setRules, onAudit, onToast }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", category: "Institutional", description: "", condition: "", severity: "Medium" });
  const filtered = rules.filter((r) => (r.id + " " + r.name + " " + r.description).toLowerCase().includes(query.toLowerCase()) && (category === "All categories" || r.category === category));
  const startNew = () => { setEditing("new"); setForm({ name: "", category: "Institutional", description: "", condition: "", severity: "Medium" }); };
  const startEdit = (r) => { setEditing(r.id); setForm({ name: r.name, category: r.category, description: r.description, condition: r.condition, severity: r.severity }); };
  const save = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.condition.trim()) return;
    if (editing === "new") {
      const item = { ...form, id: makeId("RULE"), status: "Active", updated: today() };
      setRules((old) => [item, ...old]); onAudit("Compliance rule created", "—", item.id + " · " + item.name);
    } else {
      setRules((old) => old.map((r) => r.id === editing ? { ...r, ...form, updated: today() } : r)); onAudit("Compliance rule updated", "—", editing + " · " + form.name);
    }
    setEditing(null); onToast("Compliance rule saved.");
  };
  const toggle = (r) => { const next = r.status === "Active" ? "Paused" : "Active"; setRules((old) => old.map((x) => x.id === r.id ? { ...x, status: next } : x)); onAudit("Compliance rule " + next.toLowerCase(), "—", r.id + " · " + r.name); onToast("Rule " + next.toLowerCase() + "."); };
  return <>
    <PageHeading title="Compliance rules" description="Manage configurable validation criteria used during institutional application review." actions={<Button variant="primary" icon={Plus} onClick={startNew}>Create rule</Button>} />
    <div className="grid" style={{ gridTemplateColumns: "repeat(3,minmax(0,1fr))", marginBottom: 15 }}>
      <Kpi label="Total rules" value={rules.length.toString()} change="Configured" note="across all categories" icon={BookOpen} />
      <Kpi label="Active rules" value={rules.filter((r) => r.status === "Active").length.toString()} change="Enabled" note="included in checks" icon={CheckCircle2} />
      <Kpi label="Paused rules" value={rules.filter((r) => r.status !== "Active").length.toString()} change="Not applied" note="review before enabling" icon={Clock3} trend="warn" />
    </div>
    <div className="toolbar"><div className="searchbox"><Search size={14} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search rule ID or name..." /></div><select className="select" value={category} onChange={(e) => setCategory(e.target.value)}><option>All categories</option>{["Institutional", "Faculty", "Infrastructure", "Financial", "Documentation"].map((c) => <option key={c}>{c}</option>)}</select><span className="small muted" style={{ marginLeft: "auto" }}>{filtered.length} rules</span></div>
    <Panel title="Rule library" subtitle="Rules are configurable examples; validate against current official handbook before operational use.">
      <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Rule</th><th>Category</th><th>Validation criteria</th><th>Severity</th><th>Updated</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{filtered.map((r) => <tr key={r.id}><td><span className="id-text">{r.id}</span><span className="cell-secondary">{r.name}</span></td><td>{r.category}</td><td style={{ whiteSpace: "normal", minWidth: 250 }}>{r.condition}</td><td><Severity value={r.severity} /></td><td>{r.updated}</td><td><span className={cx("status", r.status === "Active" ? "verified" : "draft")}>{r.status}</span></td><td><div style={{ display: "flex", gap: 4 }}><Button size="sm" onClick={() => startEdit(r)}>Edit</Button><Button size="sm" onClick={() => toggle(r)}>{r.status === "Active" ? "Pause" : "Enable"}</Button></div></td></tr>)}</tbody>
      </table></div>
    </Panel>
    {editing && <Modal title={editing === "new" ? "Create compliance rule" : "Edit compliance rule"} onClose={() => setEditing(null)} footer={<><Button onClick={() => setEditing(null)}>Cancel</Button><Button variant="primary" type="submit" form="rule-form">Save rule</Button></>}>
      <form id="rule-form" onSubmit={save}><div className="form-grid">
        <div className="field span-2"><label>Rule name *</label><input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Faculty strength validation" /></div>
        <div className="field"><label>Category</label><select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{["Institutional", "Faculty", "Infrastructure", "Financial", "Documentation"].map((c) => <option key={c}>{c}</option>)}</select></div>
        <div className="field"><label>Severity</label><select className="select" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>{["High", "Medium", "Low"].map((x) => <option key={x}>{x}</option>)}</select></div>
        <div className="field span-2"><label>Description</label><textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What does this rule validate?" /></div>
        <div className="field span-2"><label>Validation condition *</label><textarea className="textarea" required value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} placeholder="Describe the validation criteria..." /></div>
      </div></form>
    </Modal>}
  </>;
}

function ReportsPage({ applications, onToast }) {
  const [period, setPeriod] = useState("Current cycle");
  const download = () => {
    const rows = [["Application ID", "Institution", "Type", "Status", "Reviewer", "Submitted"], ...applications.map((a) => [a.id, a.institution, a.type, a.status, a.reviewer, a.submitted])];
    const csv = rows.map((row) => row.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a"); a.href = url; a.download = "veritrust-application-report.csv"; a.click(); URL.revokeObjectURL(url);
    onToast("CSV report downloaded.");
  };
  return <>
    <PageHeading title="Reports" description="Monitor verification throughput, compliance outcomes and review activity." actions={<><select className="select" value={period} onChange={(e) => setPeriod(e.target.value)}><option>Current cycle</option><option>Last 30 days</option><option>Last 7 days</option></select><Button variant="primary" icon={Download} onClick={download}>Download report</Button></>} />
    <div className="grid kpi-grid">
      <Kpi label="Applications reviewed" value="184" change="+8.4%" note="compared with prior cycle" icon={ClipboardCheck} />
      <Kpi label="Average review time" value="3.2 days" change="-0.6 days" note="faster than previous cycle" icon={Clock3} />
      <Kpi label="Findings resolved" value="92%" change="+4.1%" note="of reviewer-confirmed findings" icon={CheckCircle2} />
      <Kpi label="Documents checked" value="3,482" change="+16.2%" note="sample reporting metric" icon={FileText} />
    </div>
    <div className="grid content-grid">
      <Panel title="Submission and verification trend" subtitle={period + " · Daily sample volume"}>
        <div className="panel-body"><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trendData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}><defs><linearGradient id="submissions" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6c96ba" stopOpacity={.2} /><stop offset="100%" stopColor="#6c96ba" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#eef1f4" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="day" tick={{ fill: "#98a3b1", fontSize: 9 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: "#98a3b1", fontSize: 9 }} axisLine={false} tickLine={false} /><Tooltip /><Area type="monotone" dataKey="submitted" name="Submitted" stroke="#6c96ba" fill="url(#submissions)" strokeWidth={2} /><Area type="monotone" dataKey="verified" name="Verified" stroke="#79a58d" fill="transparent" strokeWidth={2} /></AreaChart></ResponsiveContainer></div></div>
      </Panel>
      <Panel title="Compliance outcomes" subtitle="Distribution of sampled verification outcomes">
        <div className="panel-body"><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={[{ name: "Complete", count: 68 }, { name: "Minor gaps", count: 21 }, { name: "Major gaps", count: 11 }]} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}><CartesianGrid stroke="#eef1f4" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" tick={{ fill: "#98a3b1", fontSize: 9 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: "#98a3b1", fontSize: 9 }} axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="count" fill="#6b91b4" radius={[4, 4, 0, 0]} barSize={34} /></BarChart></ResponsiveContainer></div></div>
      </Panel>
    </div>
    <Panel title="Report preview" subtitle="Application-level verification summary">
      <div className="panel-body"><div className="report-sheet">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #e8edf2", paddingBottom: 14 }}><div><div className="eyebrow" style={{ marginBottom: 5 }}>VERITRUST · REVIEW SUMMARY</div><h2>Institutional application report</h2><div className="small muted" style={{ marginTop: 5 }}>Generated {today()} · {period}</div></div><div className="brand-mark"><ShieldCheck size={20} /></div></div>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 18 }}><div><div className="tiny muted">APPLICATIONS IN SAMPLE</div><div className="metric-inline"><strong>{applications.length}</strong><span>records</span></div></div><div><div className="tiny muted">VERIFIED APPLICATIONS</div><div className="metric-inline"><strong>{applications.filter((a) => a.status === "Verified").length}</strong><span>records</span></div></div></div>
        <table className="report-table"><thead><tr><th>Institution</th><th>Application ID</th><th>Review status</th></tr></thead><tbody>{applications.slice(0, 5).map((a) => <tr key={a.id}><td>{a.institution}</td><td>{a.id}</td><td>{a.status}</td></tr>)}</tbody></table>
        <div className="notice" style={{ marginTop: 16 }}><Info size={13} /> Illustrative report data. Final regulatory decisions must be based on verified source documents and reviewer assessment.</div>
      </div></div>
    </Panel>
  </>;
}

function AuditPage({ activity }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("All actors");
  const [period, setPeriod] = useState("All time");
  const filtered = activity.filter((a) => (a.actor + " " + a.action + " " + a.appId + " " + a.detail).toLowerCase().includes(query.toLowerCase()) && (kind === "All actors" || (kind === "System" ? a.kind === "system" : a.kind === "human")) && (period === "All time" || (period === "Today" ? a.time.startsWith("Today") : a.time.startsWith("Today") || a.time.startsWith("Yesterday")));
  return <>
    <PageHeading title="Audit trail" description="A chronological record of reviewer actions and automated workflow events." actions={<span className="pill"><LockKeyhole size={11} /> Read-only event history</span>} />
    <div className="notice" style={{ marginBottom: 15 }}><Info size={14} /> Audit events in this prototype are stored in browser local storage. This is not a tamper-proof production audit log.</div>
    <div className="toolbar"><div className="searchbox"><Search size={14} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events, users or application IDs..." /></div><select className="select" value={kind} onChange={(e) => setKind(e.target.value)}><option>All actors</option><option>Human</option><option>System</option></select><select className="select" value={period} onChange={(e) => setPeriod(e.target.value)} onBlur={() => {}}><option>All time</option><option>Today</option><option>This week</option></select><span className="small muted" style={{ marginLeft: "auto" }}>{filtered.length} events</span></div>
    <Panel title="Activity history" subtitle="Newest events appear first">
      <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Timestamp</th><th>Actor</th><th>Action</th><th>Application</th><th>Event detail</th><th>Source</th></tr></thead>
        <tbody>{filtered.map((a) => <tr key={a.id}><td>{a.time}</td><td><span className="cell-primary">{a.actor}</span></td><td>{a.action}</td><td><span className="id-text">{a.appId}</span></td><td style={{ whiteSpace: "normal", minWidth: 180 }}>{a.detail || "—"}</td><td><span className="pill">{a.kind === "system" ? "System event" : "Reviewer action"}</span></td></tr>)}
          {!filtered.length && <tr><td colSpan="6"><div className="empty-state">No matching audit events.</div></td></tr>}
        </tbody></table></div>
    </Panel>
  </>;
}

function Modal({ title, children, footer, onClose }) {
  return <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="modal" role="dialog" aria-modal="true"><div className="modal-head"><div className="modal-title">{title}</div><button className="icon-button" onClick={onClose}><X size={15} /></button></div><div className="modal-body">{children}</div>{footer && <div className="modal-foot">{footer}</div>}</div>
  </div>;
}

function App() {
  const [applications, setApplications] = useStoredState("veritrust-applications", applicationSeed);
  const [documents, setDocuments] = useStoredState("veritrust-documents", documentSeed);
  const [rules, setRules] = useStoredState("veritrust-rules", ruleSeed);
  const [activity, setActivity] = useStoredState("veritrust-audit", activitySeed);
  const [activePage, setActivePage] = useState("overview");
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [newApp, setNewApp] = useState({ institution: "", type: "Extension of Approval", reviewer: "Ananya Verma" });

  const notify = (message) => {
    const id = Date.now() + Math.random();
    setToasts((old) => [...old, { id, message }]);
    setTimeout(() => setToasts((old) => old.filter((t) => t.id !== id)), 3200);
  };
  const addAudit = (action, appId, detail, kind = "human") => {
    const entry = { id: Date.now() + Math.random(), actor: kind === "system" ? "Verification engine" : "Ananya Verma", action, appId: appId || "—", detail: detail || "", time: "Today, " + new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), kind };
    setActivity((old) => [entry, ...old]);
  };
  const openApplication = (id) => { setSelectedAppId(id); setActivePage("application"); setMobileOpen(false); };
  const updateStatus = (id, status) => setApplications((old) => old.map((a) => a.id === id ? { ...a, status } : a));
  const assignReviewer = (id, reviewer) => { setApplications((old) => old.map((a) => a.id === id ? { ...a, reviewer } : a)); addAudit("Reviewer assignment updated", id, "Assigned reviewer: " + reviewer); notify("Reviewer assignment updated."); };
  const createApplication = (e) => {
    e.preventDefault();
    if (!newApp.institution.trim()) return;
    const id = "VT-2026-" + String(149 + applications.length).padStart(4, "0");
    const app = { id, institution: newApp.institution.trim(), short: newApp.institution.trim(), type: newApp.type, submitted: today(), status: "Submitted", reviewer: newApp.reviewer, documents: 0, verified: 0, findings: 0 };
    setApplications((old) => [app, ...old]); addAudit("Application created", id, "New institutional application created in prototype"); setNewApp({ institution: "", type: "Extension of Approval", reviewer: "Ananya Verma" }); setModal(""); notify("New application created."); openApplication(id);
  };
  const uploadDocuments = (files) => {
    const added = files.map((file) => ({ id: makeId("DOC"), name: file.name, category: file.type.startsWith("image/") ? "Documentation" : "Institutional", institution: "New upload · Unassigned", appId: "Unassigned", uploaded: today(), size: file.size > 1024 * 1024 ? (file.size / 1024 / 1024).toFixed(1) + " MB" : Math.max(1, Math.round(file.size / 1024)) + " KB", status: "Review", pages: "—", expiry: "—" }));
    setDocuments((old) => [...added, ...old]); added.forEach((d) => addAudit("Document uploaded", "—", d.name));
  };
  const nav = (page) => { setActivePage(page); setSelectedAppId(null); setMobileOpen(false); };
  const selectedApp = applications.find((a) => a.id === selectedAppId);

  const pageTitle = activePage === "overview" ? "Overview" : activePage === "application" ? "Application review" : (navigation.find((n) => n.id === activePage)?.label || "Overview");
  const submitGlobalSearch = (e) => {
    if (e.key === "Enter") { nav("applications"); notify("Search applications using the filters below."); }
  };

  return <div className="app-shell">
    <aside className={cx("sidebar", mobileOpen && "open")}>
      <div className="brand"><div className="brand-mark"><ShieldCheck size={21} strokeWidth={2.2} /></div><div><div className="brand-name">VeriTrust</div><div className="brand-sub">Compliance workspace</div></div></div>
      <div className="nav-label">Workspace</div>
      <nav className="nav-list">{navigation.map((item) => {
        const Icon = item.icon;
        return <button key={item.id} className={cx("nav-item", activePage === item.id && "active")} onClick={() => nav(item.id)}><Icon size={16} strokeWidth={1.8} /><span>{item.label}</span>{item.count && <span className="nav-count">{item.count}</span>}</button>;
      })}</nav>
      <div className="sidebar-spacer" />
      <div className="nav-label">Support</div>
      <button className="nav-item" onClick={() => notify("Support centre is represented by this prototype navigation item.")}><CircleHelp size={16} />Help & support</button>
      <button className="nav-item" onClick={() => notify("Workspace settings are not connected in this prototype.")}><Settings size={16} />Settings</button>
      <div className="sidebar-divider" />
      <div className="profile-mini"><div className="avatar">AV</div><div style={{ flex: 1 }}><div className="profile-name">Ananya Verma</div><div className="profile-role">Regulatory reviewer</div></div><MoreHorizontal size={16} color="#9aa4b2" /></div>
    </aside>
    <div className={cx("mobile-overlay", mobileOpen && "show")} onClick={() => setMobileOpen(false)} />
    <div className="main-shell">
      <header className="topbar">
        <div className="top-left"><button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)}><Menu size={17} /></button><span className="crumb">Workspace</span><ChevronRight size={12} color="#b5bdc7" /><span className="crumb-current">{pageTitle}</span></div>
        <div className="top-right">
          <div className="searchbox"><Search size={14} /><input value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} onKeyDown={submitGlobalSearch} placeholder="Search anything..." /></div>
          <select className="scope-select" defaultValue="AICTE review cell"><option>AICTE review cell</option><option>All institutions</option></select>
          <div style={{ position: "relative" }}><button className="icon-button" onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={15} /><i className="notification-dot" /></button>
            {notificationsOpen && <div className="panel" style={{ position: "absolute", right: 0, top: 42, width: 275, zIndex: 50, padding: 14 }}><div className="panel-title">Notifications</div><div className="attention-item" style={{ marginTop: 10 }}><div className="attn-icon red"><AlertCircle size={13} /></div><div><div className="attn-title">2 high-priority findings</div><div className="attn-detail">Applications need reviewer attention.</div></div></div><div className="attention-item"><div className="attn-icon"><Clock3 size={13} /></div><div><div className="attn-title">Review queue updated</div><div className="attn-detail">4 new records assigned today.</div></div></div><Button size="sm" className="btn-block" onClick={() => { setNotificationsOpen(false); nav("applications"); }}>Open review queue</Button></div>}
          </div>
          <div className="avatar">AV</div>
        </div>
      </header>
      <main className="page-wrap">
        {activePage === "overview" && <OverviewPage applications={applications} activity={activity} onOpen={openApplication} onNavigate={nav} onNew={() => setModal("new-app")} />}
        {activePage === "applications" && <ApplicationsPage applications={applications} onOpen={openApplication} onNew={() => setModal("new-app")} onAssign={assignReviewer} initialQuery={globalSearch} />}
        {activePage === "application" && selectedApp && <ApplicationWorkspace app={selectedApp} documents={documents} onBack={() => nav("applications")} onNavigate={nav} onAudit={addAudit} onStatus={updateStatus} onToast={notify} />}
        {activePage === "application" && !selectedApp && <div className="empty-state"><strong>Application not found</strong><Button onClick={() => nav("applications")}>Back to applications</Button></div>}
        {activePage === "documents" && <RepositoryPage documents={documents} onUpload={uploadDocuments} onToast={notify} />}
        {activePage === "verification" && <VerificationPage applications={applications} onAudit={(a, id, d) => addAudit(a, id, d, "system")} onToast={notify} />}
        {activePage === "rules" && <RulesPage rules={rules} setRules={setRules} onAudit={addAudit} onToast={notify} />}
        {activePage === "reports" && <ReportsPage applications={applications} onToast={notify} />}
        {activePage === "audit" && <AuditPage activity={activity} />}
      </main>
    </div>
    {modal === "new-app" && <Modal title="Create institutional application" onClose={() => setModal("")} footer={<><Button onClick={() => setModal("")}>Cancel</Button><Button variant="primary" type="submit" form="new-app-form">Create application</Button></>}>
      <form id="new-app-form" onSubmit={createApplication}><div className="form-grid">
        <div className="field span-2"><label>Institution name *</label><input className="input" autoFocus required value={newApp.institution} onChange={(e) => setNewApp({ ...newApp, institution: e.target.value })} placeholder="Enter registered institution name" /></div>
        <div className="field span-2"><label>Application type</label><select className="select" value={newApp.type} onChange={(e) => setNewApp({ ...newApp, type: e.target.value })}>{["Extension of Approval", "New Institution", "Increase in Intake", "Change in Site"].map((x) => <option key={x}>{x}</option>)}</select></div>
        <div className="field span-2"><label>Assign reviewer</label><select className="select" value={newApp.reviewer} onChange={(e) => setNewApp({ ...newApp, reviewer: e.target.value })}>{["Ananya Verma", "Rahul Mehta", "Priya Nair", "Unassigned"].map((x) => <option key={x}>{x}</option>)}</select></div>
      </div></form>
    </Modal>}
    <div className="toast-stack">{toasts.map((t) => <div className="toast" key={t.id}><CheckCircle2 size={15} />{t.message}</div>)}</div>
  </div>;
}

export default App;
