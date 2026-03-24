import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { cancelNextFrame, requestNextFrame } from "../../lib/utils/browser";
import { createId } from "../../lib/utils/ids";
import type { ExpenseCategory, ExpenseLineItem } from "../../types/domain";

interface ExpenseComposerProps {
  categories: ExpenseCategory[];
  categoryId?: string;
  onAdd: (categoryId: string, item: ExpenseLineItem) => void;
  onCancel?: () => void;
  onSubmitted?: () => void;
  submitLabel?: string;
  autoFocusField?: boolean;
}

interface FormState {
  categoryId: string;
  itemName: string;
  unit: string;
  qty: string;
  price: string;
}

const initialState: FormState = {
  categoryId: "",
  itemName: "",
  unit: "",
  qty: "",
  price: ""
};

export function ExpenseComposer({
  categories,
  categoryId,
  onAdd,
  onCancel,
  onSubmitted,
  submitLabel = "Add line item",
  autoFocusField = false
}: ExpenseComposerProps) {
  const defaultUnit = categoryId
    ? categories.find((category) => category.id === categoryId)?.units?.[0] ?? ""
    : "";

  const [form, setForm] = useState<FormState>({
    ...initialState,
    categoryId: categoryId ?? "",
    unit: defaultUnit
  });
  const categorySelectRef = useRef<HTMLSelectElement | null>(null);
  const itemSelectRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    setForm({
      ...initialState,
      categoryId: categoryId ?? "",
      unit: defaultUnit
    });
  }, [categoryId, defaultUnit]);

  useEffect(() => {
    if (!autoFocusField) {
      return;
    }

    const target = categoryId ? itemSelectRef.current : categorySelectRef.current;

    if (!target) {
      return;
    }

    const frame = requestNextFrame(() => {
      target.focus();
    });

    return () => cancelNextFrame(frame);
  }, [autoFocusField, categoryId]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === form.categoryId),
    [categories, form.categoryId]
  );

  const availableUnits = selectedCategory?.units ?? [];
  const availableOptions = selectedCategory?.options ?? [];
  const canSubmit =
    Boolean(form.categoryId) &&
    Boolean(form.itemName) &&
    Boolean(form.unit) &&
    Number(form.qty) > 0 &&
    Number(form.price) > 0;

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleCategoryChange(nextCategoryId: string) {
    const nextCategory = categories.find((category) => category.id === nextCategoryId);
    updateField("categoryId", nextCategoryId);
    updateField("itemName", "");
    updateField("unit", nextCategory?.units?.[0] ?? "");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedCategory || !canSubmit) {
      return;
    }

    onAdd(selectedCategory.id, {
      id: createId(),
      name: form.itemName,
      price: Number(form.price),
      qty: Number(form.qty),
      unit: form.unit,
      arr: selectedCategory.id
    });

    setForm({
      ...initialState,
      categoryId: selectedCategory.id
    });

    onSubmitted?.();
  }

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      {!categoryId ? (
        <label>
          Expense category
          <select
            ref={categorySelectRef}
            value={form.categoryId}
            onChange={(event) => handleCategoryChange(event.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label>
        Expense item
        <select
          ref={itemSelectRef}
          value={form.itemName}
          onChange={(event) => updateField("itemName", event.target.value)}
          disabled={!selectedCategory}
        >
          <option value="">Select an item</option>
          {availableOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label>
        Unit
        <select
          value={form.unit}
          onChange={(event) => updateField("unit", event.target.value)}
          disabled={!selectedCategory}
        >
          <option value="">Select a unit</option>
          {availableUnits.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </label>

      <div className="field-row">
        <label>
          Quantity
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.qty}
            onChange={(event) => updateField("qty", event.target.value)}
          />
        </label>
        <label>
          Price per unit
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(event) => updateField("price", event.target.value)}
          />
        </label>
      </div>

      <div className="composer-actions">
        {onCancel ? (
          <button className="button button-ghost" type="button" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
        <button className="button" type="submit" disabled={!canSubmit}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
