import { formatCurrency } from "../../lib/utils/calculations";
import type { ExpenseCategory, ReportDraft } from "../../types/domain";

interface ReportPreviewProps {
  categories: ExpenseCategory[];
  draft: ReportDraft;
  total: number;
  onAddRequest: (categoryId: string, trigger: HTMLButtonElement) => void;
  onRemove: (categoryId: string, itemId: string) => void;
}

export function ReportPreview({ categories, draft, total, onAddRequest, onRemove }: ReportPreviewProps) {
  const populatedCategoryCount = categories.filter(
    (category) => (draft.itemsByCategory[category.id] ?? []).length > 0
  ).length;

  return (
    <div className="report-preview">
      <div className="report-preview-header">
        <h2>Expense report</h2>
        <div className="preview-report-meta">
          <p>
            <span>Landlord</span>
            <strong>{draft.landLord || "-"}</strong>
          </p>
          <p>
            <span>Crop</span>
            <strong>{draft.crop || "-"}</strong>
          </p>
          <p>
            <span>Year</span>
            <strong>{draft.year || "-"}</strong>
          </p>
          <p>
            <span>Sections</span>
            <strong>{populatedCategoryCount}</strong>
          </p>
        </div>
      </div>

      {categories.map((category) => {
        const items = draft.itemsByCategory[category.id] ?? [];

        return (
          <section
            key={category.id}
            className={`preview-group${items.length ? "" : " preview-group-empty"}`}
          >
            <div className="preview-group-header">
              <div className="preview-group-summary">
                <h3>{category.label}</h3>
                <p className="preview-group-meta">
                  {items.length
                    ? `${items.length} ${items.length === 1 ? "line item" : "line items"}`
                    : "No line items yet"}
                </p>
              </div>
              <div className="preview-group-actions">
                <button
                  className="icon-button preview-add-trigger"
                  type="button"
                  aria-label={`Add line item to ${category.label}`}
                  aria-haspopup="dialog"
                  onClick={(event) => onAddRequest(category.id, event.currentTarget)}
                >
                  +
                </button>
              </div>
            </div>

            {items.length ? (
              <div className="preview-rows">
                <div className="preview-row preview-row-head" aria-hidden="true">
                  <span>Item</span>
                  <span>Quantity</span>
                  <span>Rate</span>
                  <span>Amount</span>
                </div>
                {items.map((item) => (
                  <article key={item.id} className="preview-row">
                    <div className="preview-row-main">
                      <strong>{item.name}</strong>
                    </div>
                    <p className="preview-row-detail">
                      {item.qty} {item.unit}
                    </p>
                    <p className="preview-row-detail">{formatCurrency(item.price)}</p>
                    <div className="preview-row-actions">
                      <strong>{formatCurrency(item.qty * item.price)}</strong>
                      <button
                        className="button button-danger"
                        type="button"
                        onClick={() => onRemove(category.id, item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-state">Use the plus button to add the first line item in this section.</p>
            )}
          </section>
        );
      })}

      <footer className="preview-total">
        <span>Total billed</span>
        <strong>{formatCurrency(total)}</strong>
      </footer>
    </div>
  );
}
