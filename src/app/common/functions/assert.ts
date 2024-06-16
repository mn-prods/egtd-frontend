export const assert = <T = unknown>(expr: unknown, message: string) => {
  if (!Boolean(expr)) {
    throw new Error(message || 'unknown assertion error');
  }
};
