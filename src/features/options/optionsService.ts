import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  type QuerySnapshot,
  type DocumentData
} from "firebase/firestore";
import { db } from "../../lib/firebase/config";
import type { ExpenseCategory, LabelDefinition } from "../../types/domain";

const labelsCollection = collection(db, "labels-4.0");
const expensesCollection = collection(db, "expenses-4.0");

function mapLabels(snapshot: QuerySnapshot<DocumentData>) {
  return snapshot.docs.map((doc) => doc.data() as LabelDefinition);
}

function mapExpenses(snapshot: QuerySnapshot<DocumentData>) {
  return snapshot.docs.map((doc) => doc.data() as ExpenseCategory);
}

export async function getLabelDefinitions() {
  const snapshot = await getDocs(query(labelsCollection, orderBy("label")));
  return mapLabels(snapshot);
}

export async function getExpenseCategories() {
  const snapshot = await getDocs(query(expensesCollection, orderBy("label")));
  return mapExpenses(snapshot);
}

export function subscribeToExpenseCategories(
  callback: (categories: ExpenseCategory[]) => void
) {
  return onSnapshot(query(expensesCollection, orderBy("label")), (snapshot) => {
    callback(mapExpenses(snapshot));
  });
}

export function subscribeToLabelDefinitions(
  callback: (labels: LabelDefinition[]) => void
) {
  return onSnapshot(query(labelsCollection, orderBy("label")), (snapshot) => {
    callback(mapLabels(snapshot));
  });
}
