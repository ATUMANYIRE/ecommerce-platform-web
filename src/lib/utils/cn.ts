export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | Record<string, boolean | null | undefined>
  | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  for (const input of inputs) {
    if (!input && input !== 0) continue;
    if (typeof input === "string") {
      out.push(input);
    } else if (Array.isArray(input)) {
      out.push(cn(...input));
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) out.push(key);
      }
    } else {
      out.push(String(input));
    }
  }
  return out.join(" ");
}
