import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  type DocumentData,
  type QuerySnapshot
} from "firebase/firestore";
import { db } from "../../lib/firebase/config";
import { calculateReportTotal } from "../../lib/utils/calculations";
import type {
  ExpenseCategory,
  ExpenseLineItem,
  LegacyReportData,
  LegacyReportDocument,
  ReportDraft
} from "../../types/domain";

const reportsCollection = collection(db, "reports");

function isLineItemsArray(value: unknown): value is ExpenseLineItem[] {
  return Array.isArray(value);
}

function mapReport(docId: string, data: DocumentData): LegacyReportDocument {
  return {
    docId,
    ...(data as LegacyReportData)
  };
}

function mapReports(snapshot: QuerySnapshot<DocumentData>) {
  return snapshot.docs
    .map((reportDoc) => mapReport(reportDoc.id, reportDoc.data()))
    .sort((left, right) => Number(right.id) - Number(left.id));
}

export function buildLegacyReportDocId(draft: Pick<ReportDraft, "landLord" | "crop" | "year">) {
  return `${draft.landLord} ${draft.crop} ${draft.year}`.trim();
}

export function createEmptyDraft(categories: ExpenseCategory[]): ReportDraft {
  return {
    id: crypto.randomUUID(),
    landLord: "",
    crop: "",
    year: "",
    itemsByCategory: categories.reduce<Record<string, ExpenseLineItem[]>>((acc, category) => {
      acc[category.id] = [];
      return acc;
    }, {})
  };
}

export function mapReportToDraft(
  report: LegacyReportDocument,
  categories: ExpenseCategory[]
): ReportDraft {
  const itemsByCategory = categories.reduce<Record<string, ExpenseLineItem[]>>((acc, category) => {
    const value = report[category.id];
    acc[category.id] = isLineItemsArray(value) ? value : [];
    return acc;
  }, {});

  return {
    id: report.id,
    landLord: report.landLord,
    crop: report.crop,
    year: report.year,
    itemsByCategory
  };
}

export function buildLegacyReportPayload(
  draft: ReportDraft,
  categories: ExpenseCategory[]
): LegacyReportData {
  const payload: LegacyReportData = {
    id: draft.id,
    landLord: draft.landLord,
    crop: draft.crop,
    year: draft.year,
    total: calculateReportTotal(draft)
  };

  categories.forEach((category) => {
    payload[category.id] = draft.itemsByCategory[category.id] ?? [];
  });

  return payload;
}

export async function saveReport(
  draft: ReportDraft,
  categories: ExpenseCategory[],
  existingDocId?: string
) {
  const docId = existingDocId ?? buildLegacyReportDocId(draft);
  const payload = buildLegacyReportPayload(draft, categories);
  await setDoc(doc(db, "reports", docId), payload);
  return docId;
}

export function subscribeToReports(callback: (reports: LegacyReportDocument[]) => void) {
  return onSnapshot(query(reportsCollection, orderBy("year", "desc")), (snapshot) => {
    callback(mapReports(snapshot));
  });
}

export async function getReportByDocId(docId: string) {
  const snapshot = await getDoc(doc(db, "reports", docId));

  if (!snapshot.exists()) {
    return null;
  }

  return mapReport(snapshot.id, snapshot.data());
}
