import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ExpenseComposer } from "../components/reports/ExpenseComposer";
import { ReportPreview } from "../components/reports/ReportPreview";
import { Modal } from "../components/ui/Modal";
import { SectionCard } from "../components/ui/SectionCard";
import {
  getExpenseCategories,
  getLabelDefinitions
} from "../features/options/optionsService";
import {
  createEmptyDraft,
  getReportByDocId,
  mapReportToDraft,
  saveReport
} from "../features/reports/reportService";
import { calculateReportTotal } from "../lib/utils/calculations";
import type {
  ExpenseCategory,
  ExpenseLineItem,
  LabelDefinition,
  ReportDraft
} from "../types/domain";

interface ReportEditorPageProps {
  mode: "create" | "edit";
}

const headerFields = ["landLord", "crop", "year"] as const;
type HeaderField = (typeof headerFields)[number];

function isHeaderField(value: string): value is HeaderField {
  return headerFields.includes(value as HeaderField);
}

export function ReportEditorPage({ mode }: ReportEditorPageProps) {
  const navigate = useNavigate();
  const { reportDocId } = useParams();
  const [labels, setLabels] = useState<LabelDefinition[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [draft, setDraft] = useState<ReportDraft | null>(null);
  const [sourceDocId, setSourceDocId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const lastAddTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    async function loadEditor() {
      setLoading(true);
      setError(null);

      try {
        const [labelData, categoryData] = await Promise.all([
          getLabelDefinitions(),
          getExpenseCategories()
        ]);

        setLabels(labelData);
        setCategories(categoryData);

        if (mode === "edit" && reportDocId) {
          const decodedDocId = decodeURIComponent(reportDocId);
          const report = await getReportByDocId(decodedDocId);

          if (!report) {
            throw new Error("That report could not be found.");
          }

          setDraft(mapReportToDraft(report, categoryData));
          setSourceDocId(report.docId);
        } else {
          setDraft(createEmptyDraft(categoryData));
          setSourceDocId(undefined);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load report editor.");
      } finally {
        setLoading(false);
      }
    }

    void loadEditor();
  }, [mode, reportDocId]);

  const total = useMemo(() => (draft ? calculateReportTotal(draft) : 0), [draft]);
  const activeCategory = useMemo(
    () => categories.find((category) => category.id === activeCategoryId) ?? null,
    [activeCategoryId, categories]
  );

  function updateHeaderField(field: HeaderField, value: string) {
    setDraft((current) => (current ? { ...current, [field]: value } : current));
  }

  function addLineItem(categoryId: string, item: ExpenseLineItem) {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        itemsByCategory: {
          ...current.itemsByCategory,
          [categoryId]: [...(current.itemsByCategory[categoryId] ?? []), item]
        }
      };
    });
  }

  function removeLineItem(categoryId: string, itemId: string) {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        itemsByCategory: {
          ...current.itemsByCategory,
          [categoryId]: (current.itemsByCategory[categoryId] ?? []).filter(
            (item) => item.id !== itemId
          )
        }
      };
    });
  }

  function handleOpenAddItem(categoryId: string, trigger: HTMLButtonElement) {
    lastAddTriggerRef.current = trigger;
    setActiveCategoryId(categoryId);
  }

  function handleCloseAddItem() {
    setActiveCategoryId(null);

    window.requestAnimationFrame(() => {
      lastAddTriggerRef.current?.focus();
    });
  }

  async function handleSave() {
    if (!draft) {
      return;
    }

    if (!draft.landLord || !draft.crop || !draft.year) {
      setError("Choose a landlord, crop, and year before saving.");
      return;
    }

    setStatus("Saving report...");
    setError(null);

    try {
      const savedDocId = await saveReport(draft, categories, sourceDocId);
      setSourceDocId(savedDocId);
      setStatus("Report saved.");

      if (mode === "create") {
        navigate(`/reports/${encodeURIComponent(savedDocId)}/edit`, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save report.");
      setStatus(null);
    }
  }

  function handleReset() {
    if (draft) {
      setDraft(createEmptyDraft(categories));
      setSourceDocId(undefined);
      setActiveCategoryId(null);
      setStatus(null);
      setError(null);
    }
  }

  if (loading) {
    return <p className="empty-state">Loading editor...</p>;
  }

  if (error && !draft) {
    return <p className="form-error">{error}</p>;
  }

  if (!draft) {
    return null;
  }

  return (
    <div className="page-stack">
      <section className="hero-panel compact-hero">
        <div>
          <p className="eyebrow">{mode === "create" ? "New report" : "Edit report"}</p>
          <h1>{mode === "create" ? "Build a report" : "Continue a saved report"}</h1>
          <p className="muted-copy">
            Totals are calculated automatically and saved back into the existing legacy `reports` collection.
          </p>
        </div>
        <div className="hero-actions">
          <button className="button" type="button" onClick={() => void handleSave()}>
            Save report
          </button>
          <button className="button button-secondary" type="button" onClick={handleReset}>
            Clear draft
          </button>
          <button className="button button-ghost" type="button" onClick={() => window.print()}>
            Print
          </button>
        </div>
      </section>

      <div className="editor-grid">
        <div className="page-stack">
          <SectionCard
            title="Report details"
            description="Choose the saved heading values that already exist in `labels-4.0`."
          >
            <div className="field-grid">
              {labels.map((label) => {
                if (!isHeaderField(label.id)) {
                  return null;
                }

                const field = label.id;

                return (
                  <label key={label.id}>
                    {label.label}
                    <select
                      value={draft[field]}
                      onChange={(event) => updateHeaderField(field, event.target.value)}
                    >
                      <option value="">Choose an option</option>
                      {label.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                );
              })}
            </div>
          </SectionCard>

          {status ? <p className="form-success">{status}</p> : null}
          {error ? <p className="form-error">{error}</p> : null}
        </div>

        <SectionCard title="Preview" description="Review grouped expenses and live totals before saving.">
          <ReportPreview
            categories={categories}
            draft={draft}
            total={total}
            onAddRequest={handleOpenAddItem}
            onRemove={removeLineItem}
          />
        </SectionCard>
      </div>

      {activeCategory ? (
        <Modal
          title={`Add ${activeCategory.label} line item`}
          description="Choose the saved expense option, unit, quantity, and price for this section."
          onClose={handleCloseAddItem}
        >
          <ExpenseComposer
            categories={categories}
            categoryId={activeCategory.id}
            onAdd={addLineItem}
            onCancel={handleCloseAddItem}
            onSubmitted={handleCloseAddItem}
            autoFocusField
          />
        </Modal>
      ) : null}
    </div>
  );
}
