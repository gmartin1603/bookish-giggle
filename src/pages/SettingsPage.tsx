import { useEffect, useState } from "react";
import { SectionCard } from "../components/ui/SectionCard";
import {
  subscribeToExpenseCategories,
  subscribeToLabelDefinitions
} from "../features/options/optionsService";
import type { ExpenseCategory, LabelDefinition } from "../types/domain";

export function SettingsPage() {
  const [labels, setLabels] = useState<LabelDefinition[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);

  useEffect(() => {
    const unsubscribeLabels = subscribeToLabelDefinitions(setLabels);
    const unsubscribeCategories = subscribeToExpenseCategories(setCategories);

    return () => {
      unsubscribeLabels();
      unsubscribeCategories();
    };
  }, []);

  return (
    <div className="page-stack">
      <section className="hero-panel compact-hero">
        <div>
          <p className="eyebrow">Settings</p>
          <h1>Current taxonomy, preserved.</h1>
          <p className="muted-copy">
            This page reads directly from the legacy `labels-4.0` and `expenses-4.0` collections so you can verify the preserved structure while the editor is being rebuilt.
          </p>
        </div>
      </section>

      <SectionCard title="Heading fields" description="Selectable report header values from Firestore.">
        <div className="token-grid">
          {labels.map((label) => (
            <article key={label.id} className="token-card">
              <h3>{label.label}</h3>
              <p className="muted-copy">Key: {label.id}</p>
              <div className="token-list">
                {label.options.map((option) => (
                  <span key={option} className="token-pill">
                    {option}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Expense categories" description="Categories, items, and units from Firestore.">
        <div className="token-grid">
          {categories.map((category) => (
            <article key={category.id} className="token-card">
              <h3>{category.label}</h3>
              <p className="muted-copy">Key: {category.id}</p>
              <div className="token-list">
                {category.options.map((option) => (
                  <span key={option} className="token-pill">
                    {option}
                  </span>
                ))}
              </div>
              <div className="token-list subdued-list">
                {(category.units ?? []).map((unit) => (
                  <span key={unit} className="token-pill token-pill-soft">
                    {unit}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
