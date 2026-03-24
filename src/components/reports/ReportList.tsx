import { Link } from "react-router-dom";
import { formatCurrency } from "../../lib/utils/calculations";
import type { LegacyReportDocument } from "../../types/domain";

interface ReportListProps {
  reports: LegacyReportDocument[];
  loading: boolean;
}

export function ReportList({ reports, loading }: ReportListProps) {
  if (loading) {
    return <p className="empty-state">Loading reports...</p>;
  }

  if (!reports.length) {
    return <p className="empty-state">No reports yet. Create the first one to get started.</p>;
  }

  return (
    <div className="report-grid">
      {reports.map((report) => (
        <article key={report.docId} className="report-card">
          <div>
            <p className="report-card-kicker">{report.year}</p>
            <h3>{report.landLord}</h3>
            <p>{report.crop}</p>
          </div>
          <div className="report-card-footer">
            <strong>{formatCurrency(report.total)}</strong>
            <Link className="button button-secondary" to={`/reports/${encodeURIComponent(report.docId)}/edit`}>
              Open
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
