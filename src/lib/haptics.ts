export type HapticPattern =
  | "light"
  | "medium"
  | "heavy"
  | "success"
  | "warning"
  | "error"
  | "selection";

const PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 8,
  medium: 16,
  heavy: 28,
  selection: 12,
  success: [10, 40, 18],
  warning: [18, 36, 18],
  error: [28, 48, 28, 48, 28],
};

export function triggerHaptic(pattern: HapticPattern = "light"): void {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) {
    return;
  }

  try {
    navigator.vibrate(PATTERNS[pattern]);
  } catch {
    // Vibration blocked or unsupported — visual feedback still applies.
  }
}

export function withHaptic<T extends (...args: never[]) => void>(
  handler: T | undefined,
  pattern: HapticPattern = "light",
): T | undefined {
  if (!handler) return undefined;

  return ((...args: Parameters<T>) => {
    triggerHaptic(pattern);
    handler(...args);
  }) as T;
}
