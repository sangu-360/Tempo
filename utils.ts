// Fix: Populating utils.ts with a utility function for ID generation.
// This resolves the "Cannot find name 'full'" error.

// A simple utility to generate a unique-enough ID for this demo app.
// In a real app, you would use a more robust library like `uuid`.
export const generateId = (prefix: string): string => {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
};

// Fix: Add 'cn' utility function to resolve "has no exported member 'cn'" error.
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
