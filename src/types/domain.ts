export interface LabelDefinition {
  id: "landLord" | "crop" | "year" | string;
  label: string;
  options: string[];
}

export interface ExpenseCategory {
  id: string;
  label: string;
  options: string[];
  units?: string[];
}

export interface ExpenseLineItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  unit: string;
  arr: string;
}

export interface LegacyReportData {
  id: string;
  landLord: string;
  crop: string;
  year: string;
  total: number;
  seedList?: ExpenseLineItem[];
  chemList?: ExpenseLineItem[];
  fertList?: ExpenseLineItem[];
  truckingList?: ExpenseLineItem[];
  fuelList?: ExpenseLineItem[];
  insList?: ExpenseLineItem[];
  misc?: ExpenseLineItem[];
  [key: string]: string | number | ExpenseLineItem[] | undefined;
}

export interface LegacyReportDocument extends LegacyReportData {
  docId: string;
}

export interface ReportDraft {
  id: string;
  landLord: string;
  crop: string;
  year: string;
  itemsByCategory: Record<string, ExpenseLineItem[]>;
}

export interface AuthUser {
  uid: string;
  email: string | null;
}
