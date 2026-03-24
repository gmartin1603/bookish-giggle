import type { ExpenseLineItem, ReportDraft } from "../../types/domain";

export function calculateLineItemTotal(item: ExpenseLineItem) {
  return item.price * item.qty;
}

export function calculateItemsTotal(items: ExpenseLineItem[]) {
  return items.reduce((sum, item) => sum + calculateLineItemTotal(item), 0);
}

export function calculateReportTotal(draft: ReportDraft) {
  return Object.values(draft.itemsByCategory).reduce(
    (sum, items) => sum + calculateItemsTotal(items),
    0
  );
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}
