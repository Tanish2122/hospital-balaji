export function generateId(prefix: 'EMG' | 'APT'): string {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}
