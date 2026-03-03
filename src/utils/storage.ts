const DRUGS_KEY = "app.drugs";

export function loadDrugs() {
  try {
    return JSON.parse(localStorage.getItem(DRUGS_KEY) ?? "[]");
  } catch {
    return [];
  }
}
export function saveDrugs(drugs: { id: number; title: string }[]) {
  localStorage.setItem(DRUGS_KEY, JSON.stringify(drugs));
}
