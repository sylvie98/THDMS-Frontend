export type UserRole = "super_admin" | "admin" | "field_owner" | "field_worker";

export interface User {
  id: string;
  fullName: string;
  username: string;
  role: UserRole;
}

export interface Field {
  id: string;
  name: string;
  location: string;
  ownerId?: string;
}

export interface Harvest {
  id: string;
  fieldId: string;
  date: string;
  quantity: number;
  workerId: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  field_owner: "Field Owner",
  field_worker: "Field Worker",
};

export const users: User[] = [
  { id: "u1", fullName: "Jean Baptiste Mugisha", username: "jbmugisha", role: "super_admin" },
  { id: "u2", fullName: "Claire Uwimana", username: "cuwimana", role: "admin" },
  { id: "u3", fullName: "Patrick Habimana", username: "phabimana", role: "admin" },
  { id: "u4", fullName: "Grace Mukamana", username: "gmukamana", role: "field_owner" },
  { id: "u5", fullName: "Emmanuel Ndayisaba", username: "endayisaba", role: "field_owner" },
  { id: "u6", fullName: "Diane Uwase", username: "duwase", role: "field_worker" },
  { id: "u7", fullName: "Claude Niyonzima", username: "cniyonzima", role: "field_worker" },
  { id: "u8", fullName: "Alice Ingabire", username: "aingabire", role: "field_worker" },
  { id: "u9", fullName: "Joseph Tuyishime", username: "jtuyishime", role: "field_worker" },
  { id: "u10", fullName: "Marie Nyiraneza", username: "mnyiraneza", role: "field_worker" },
];

export const fields: Field[] = [
  { id: "f1", name: "Nyungwe Highland Plot", location: "Nyungwe, Southern Province", ownerId: "u4" },
  { id: "f2", name: "Gisovu Valley Estate", location: "Gisovu, Western Province", ownerId: "u4" },
  { id: "f3", name: "Mulindi Green Terrace", location: "Mulindi, Northern Province", ownerId: "u5" },
  { id: "f4", name: "Kitabi Sunrise Field", location: "Kitabi, Southern Province", ownerId: "u5" },
  { id: "f5", name: "Rubavu Lakeside Garden", location: "Rubavu, Western Province", ownerId: "u4" },
];

const today = new Date();
const dayMs = 86400000;

function dateStr(daysAgo: number) {
  return new Date(today.getTime() - daysAgo * dayMs).toISOString().split("T")[0];
}

export const harvests: Harvest[] = [
  { id: "h1", fieldId: "f1", date: dateStr(0), quantity: 32.5, workerId: "u6" },
  { id: "h2", fieldId: "f1", date: dateStr(1), quantity: 28.75, workerId: "u7" },
  { id: "h3", fieldId: "f2", date: dateStr(1), quantity: 45.0, workerId: "u6" },
  { id: "h4", fieldId: "f2", date: dateStr(2), quantity: 38.25, workerId: "u8" },
  { id: "h5", fieldId: "f3", date: dateStr(2), quantity: 22.0, workerId: "u9" },
  { id: "h6", fieldId: "f3", date: dateStr(3), quantity: 19.5, workerId: "u10" },
  { id: "h7", fieldId: "f4", date: dateStr(3), quantity: 55.0, workerId: "u9" },
  { id: "h8", fieldId: "f4", date: dateStr(4), quantity: 41.75, workerId: "u10" },
  { id: "h9", fieldId: "f5", date: dateStr(5), quantity: 30.0, workerId: "u7" },
  { id: "h10", fieldId: "f5", date: dateStr(6), quantity: 27.5, workerId: "u8" },
  { id: "h11", fieldId: "f1", date: dateStr(4), quantity: 35.0, workerId: "u6" },
  { id: "h12", fieldId: "f2", date: dateStr(5), quantity: 42.25, workerId: "u7" },
  { id: "h13", fieldId: "f3", date: dateStr(6), quantity: 18.0, workerId: "u9" },
  { id: "h14", fieldId: "f1", date: dateStr(3), quantity: 29.0, workerId: "u8" },
  { id: "h15", fieldId: "f4", date: dateStr(1), quantity: 48.5, workerId: "u10" },
];

export function getFieldName(fieldId: string) {
  return fields.find((f) => f.id === fieldId)?.name ?? "Unknown";
}

export function getUserName(userId: string) {
  return users.find((u) => u.id === userId)?.fullName ?? "Unknown";
}
