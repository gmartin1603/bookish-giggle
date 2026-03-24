import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReportList } from "../components/reports/ReportList";
import { SectionCard } from "../components/ui/SectionCard";
import { subscribeToReports } from "../features/reports/reportService";
import type { LegacyReportDocument } from "../types/domain";

export function DashboardPage() {
  const [reports, setReports] = useState<LegacyReportDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToReports((nextReports) => {
      setReports(nextReports);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Track reports without fighting the form.</h1>
          <p className="muted-copy">
            This view preserves the legacy `reports`, `labels-4.0`, and `expenses-4.0` collections while giving them a modern shell.
          </p>
        </div>
        <div className="hero-actions">
          <Link className="button" to="/reports/new">
            Create report
          </Link>
          <Link className="button button-secondary" to="/settings">
            Review settings
          </Link>
        </div>
      </section>

      <SectionCard
        title="Recent reports"
        description="Open any saved report to review or continue editing it."
      >
        <ReportList reports={reports} loading={loading} />
      </SectionCard>
    </div>
  );
}
