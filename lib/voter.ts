// Browser-only helpers: an anonymous id per device (stands in for accounts) and a saved display name.
const VOTER_KEY = "fridgesnap:voter-id";
const NAME_KEY = "fridgesnap:display-name";
 
export function getVoterId(): string {
  try {
    let id = localStorage.getItem(VOTER_KEY);
    if (!id) {
      id = `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(VOTER_KEY, id);
    }
    return id;
  } catch {
    return "anonymous";
  }
}
 
export function getDisplayName(): string {
  try {
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}
 
export function setDisplayName(name: string) {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {}
}