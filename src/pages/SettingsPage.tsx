import { useEffect, useMemo, useState } from "react";
import { SectionCard } from "../components/ui/SectionCard";
import {
  saveExpenseCategory,
  saveLabelDefinition,
  subscribeToExpenseCategories,
  subscribeToLabelDefinitions
} from "../features/options/optionsService";
import type { ExpenseCategory, LabelDefinition } from "../types/domain";

type EditorTarget =
  | {
      kind: "label";
      id: string;
    }
  | {
      kind: "category";
      id: string;
    };

interface EditorFormState {
  label: string;
  optionsText: string;
  unitsText: string;
}

function formatTokenInput(values: string[]) {
  return values.join("\n");
}

function parseTokenInput(value: string) {
  return Array.from(
    new Set(
      value
        .split(/[\n,]/)
        .map((entry) => entry.trim())
        .filter(Boolean)
    )
  );
}

function createLabelFormState(label: LabelDefinition): EditorFormState {
  return {
    label: label.label,
    optionsText: formatTokenInput(label.options),
    unitsText: ""
  };
}

function createCategoryFormState(category: ExpenseCategory): EditorFormState {
  return {
    label: category.label,
    optionsText: formatTokenInput(category.options),
    unitsText: formatTokenInput(category.units ?? [])
  };
}

export function SettingsPage() {
  const [labels, setLabels] = useState<LabelDefinition[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [labelsLoading, setLabelsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [activeEditor, setActiveEditor] = useState<EditorTarget | null>(null);
  const [form, setForm] = useState<EditorFormState>({ label: "", optionsText: "", unitsText: "" });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeLabels = subscribeToLabelDefinitions((nextLabels) => {
      setLabels(nextLabels);
      setLabelsLoading(false);
    });
    const unsubscribeCategories = subscribeToExpenseCategories((nextCategories) => {
      setCategories(nextCategories);
      setCategoriesLoading(false);
    });

    return () => {
      unsubscribeLabels();
      unsubscribeCategories();
    };
  }, []);

  const overview = useMemo(() => {
    const headingOptionCount = labels.reduce((count, label) => count + label.options.length, 0);
    const expenseOptionCount = categories.reduce((count, category) => count + category.options.length, 0);
    const unitCount = categories.reduce((count, category) => count + (category.units?.length ?? 0), 0);

    return {
      headingFields: labels.length,
      headingOptionCount,
      expenseCategories: categories.length,
      expenseOptionCount,
      unitCount
    };
  }, [categories, labels]);

  const loading = labelsLoading || categoriesLoading;
  const parsedOptions = parseTokenInput(form.optionsText);
  const parsedUnits = parseTokenInput(form.unitsText);
  const canSave = form.label.trim().length > 0 && parsedOptions.length > 0 && !saving;

  function beginLabelEdit(label: LabelDefinition) {
    setActiveEditor({ kind: "label", id: label.id });
    setForm(createLabelFormState(label));
    setStatus(null);
    setError(null);
  }

  function beginCategoryEdit(category: ExpenseCategory) {
    setActiveEditor({ kind: "category", id: category.id });
    setForm(createCategoryFormState(category));
    setStatus(null);
    setError(null);
  }

  function cancelEdit() {
    setActiveEditor(null);
    setForm({ label: "", optionsText: "", unitsText: "" });
    setError(null);
  }

  function updateForm<Field extends keyof EditorFormState>(field: Field, value: EditorFormState[Field]) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function handleSave() {
    if (!activeEditor || !canSave) {
      return;
    }

    setSaving(true);
    setStatus(null);
    setError(null);

    try {
      if (activeEditor.kind === "label") {
        await saveLabelDefinition({
          id: activeEditor.id,
          label: form.label.trim(),
          options: parsedOptions
        });
      } else {
        await saveExpenseCategory({
          id: activeEditor.id,
          label: form.label.trim(),
          options: parsedOptions,
          units: parsedUnits
        });
      }

      setStatus(`Saved changes to ${form.label.trim()}.`);
      cancelEdit();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-stack">
      <section className="hero-panel settings-hero">
        <div>
          <p className="eyebrow">Settings</p>
          <h1>Keep the taxonomy clean and editable.</h1>
          <p className="muted-copy">
            Update the same legacy `labels-4.0` and `expenses-4.0` collections directly, with an editor that makes the saved structure easier to scan before you commit changes.
          </p>
          <div className="settings-overview-strip" aria-label="Settings overview">
            <span>
              <strong>{overview.headingFields}</strong> heading fields
            </span>
            <span>
              <strong>{overview.headingOptionCount}</strong> header values
            </span>
            <span>
              <strong>{overview.expenseCategories}</strong> expense groups
            </span>
            <span>
              <strong>{overview.expenseOptionCount}</strong> expense options
            </span>
            <span>
              <strong>{overview.unitCount}</strong> saved units
            </span>
          </div>
        </div>
      </section>

      {loading ? <p className="empty-state">Loading settings...</p> : null}
      {status ? <p className="form-success">{status}</p> : null}
      {error ? <p className="form-error">{error}</p> : null}

      <SectionCard
        title="Heading fields"
        description="Edit the report header collections that drive landlord, crop, year, and other saved selectors."
        actions={<span className="settings-section-count">{labels.length} fields</span>}
      >
        <div className="settings-grid">
          {labels.map((label) => {
            const isEditing = activeEditor?.kind === "label" && activeEditor.id === label.id;

            return (
              <article key={label.id} className="token-card settings-record">
                {isEditing ? (
                  <div className="stack-form settings-editor">
                    <div className="settings-record-header">
                      <div className="settings-record-meta">
                        <p className="eyebrow">Editing field</p>
                        <h3>{label.id}</h3>
                      </div>
                    </div>

                    <label>
                      Display label
                      <input
                        value={form.label}
                        onChange={(event) => updateForm("label", event.target.value)}
                        placeholder="Visible label"
                      />
                    </label>

                    <label>
                      Options
                      <textarea
                        className="settings-textarea"
                        rows={7}
                        value={form.optionsText}
                        onChange={(event) => updateForm("optionsText", event.target.value)}
                        placeholder="One option per line or comma-separated"
                      />
                    </label>

                    <p className="settings-helper">{parsedOptions.length} unique options ready to save.</p>

                    <div className="hero-actions">
                      <button className="button" type="button" onClick={() => void handleSave()} disabled={!canSave}>
                        {saving ? "Saving..." : "Save changes"}
                      </button>
                      <button className="button button-ghost" type="button" onClick={cancelEdit} disabled={saving}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="settings-record-header">
                      <div className="settings-record-meta">
                        <h3>{label.label}</h3>
                        <p className="settings-record-key">Key: {label.id}</p>
                      </div>
                      <button className="button button-secondary" type="button" onClick={() => beginLabelEdit(label)}>
                        Edit
                      </button>
                    </div>

                    <div className="settings-record-section">
                      <p className="settings-record-count">{label.options.length} saved options</p>
                      <div className="token-list">
                        {label.options.map((option) => (
                          <span key={option} className="token-pill">
                            {option}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </article>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard
        title="Expense categories"
        description="Refine the saved expense items and units that feed the report composer without changing the legacy collection shape."
        actions={<span className="settings-section-count">{categories.length} categories</span>}
      >
        <div className="settings-grid">
          {categories.map((category) => {
            const isEditing = activeEditor?.kind === "category" && activeEditor.id === category.id;
            const units = category.units ?? [];

            return (
              <article key={category.id} className="token-card settings-record">
                {isEditing ? (
                  <div className="stack-form settings-editor">
                    <div className="settings-record-header">
                      <div className="settings-record-meta">
                        <p className="eyebrow">Editing category</p>
                        <h3>{category.id}</h3>
                      </div>
                    </div>

                    <label>
                      Display label
                      <input
                        value={form.label}
                        onChange={(event) => updateForm("label", event.target.value)}
                        placeholder="Visible label"
                      />
                    </label>

                    <label>
                      Expense items
                      <textarea
                        className="settings-textarea"
                        rows={7}
                        value={form.optionsText}
                        onChange={(event) => updateForm("optionsText", event.target.value)}
                        placeholder="One item per line or comma-separated"
                      />
                    </label>

                    <label>
                      Units
                      <textarea
                        className="settings-textarea"
                        rows={4}
                        value={form.unitsText}
                        onChange={(event) => updateForm("unitsText", event.target.value)}
                        placeholder="Optional units, one per line or comma-separated"
                      />
                    </label>

                    <p className="settings-helper">
                      {parsedOptions.length} unique items and {parsedUnits.length} unique units ready to save.
                    </p>

                    <div className="hero-actions">
                      <button className="button" type="button" onClick={() => void handleSave()} disabled={!canSave}>
                        {saving ? "Saving..." : "Save changes"}
                      </button>
                      <button className="button button-ghost" type="button" onClick={cancelEdit} disabled={saving}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="settings-record-header">
                      <div className="settings-record-meta">
                        <h3>{category.label}</h3>
                        <p className="settings-record-key">Key: {category.id}</p>
                      </div>
                      <button className="button button-secondary" type="button" onClick={() => beginCategoryEdit(category)}>
                        Edit
                      </button>
                    </div>

                    <div className="settings-record-section">
                      <p className="settings-record-count">{category.options.length} saved items</p>
                      <div className="token-list">
                        {category.options.map((option) => (
                          <span key={option} className="token-pill">
                            {option}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="settings-record-section">
                      <p className="settings-record-count">{units.length} saved units</p>
                      <div className="token-list">
                        {units.length ? (
                          units.map((unit) => (
                            <span key={unit} className="token-pill token-pill-soft">
                              {unit}
                            </span>
                          ))
                        ) : (
                          <span className="settings-empty">No units saved yet.</span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </article>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
