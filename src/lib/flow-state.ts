import type { BankId } from "@/lib/bank-config";

export type FlowStage =
  | "bank_home"
  | "dashboard"
  | "assistant"
  | "tracker"
  | "complete"
  | "cancelled";

export type BillDenomination = 5 | 10 | 20;

export type CancellationReason = "user" | "hazard";

export type FlowState = {
  stage: FlowStage;
  bankId: BankId;
  amount: number;
  denomination: BillDenomination;
  cancellationRef: string | null;
  cancelledAt: string | null;
  cancellationReason: CancellationReason | null;
};

export type FlowAction =
  | { type: "SET_BANK"; bankId: BankId }
  | { type: "LAUNCH_AURACASH" }
  | { type: "SCHEDULE_DELIVERY" }
  | { type: "SET_AMOUNT"; amount: number }
  | { type: "SET_DENOMINATION"; denomination: BillDenomination }
  | { type: "CONFIRM_ORDER" }
  | { type: "CANCEL_ORDER" }
  | { type: "STOP_FOR_HAZARD" }
  | { type: "UNLOCK_CASH" }
  | { type: "RETURN_HOME" };

export const DELIVERY_ADDRESS = "142 Elmwood Dr";
export const AVAILABLE_BALANCE = 9665.03;
export const PRESET_AMOUNTS = [50, 75, 100] as const;

export const initialFlowState: FlowState = {
  stage: "bank_home",
  bankId: "chase",
  amount: 100,
  denomination: 20,
  cancellationRef: null,
  cancelledAt: null,
  cancellationReason: null,
};

export function generateCancellationRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `AC-${suffix}`;
}

export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "SET_BANK":
      return { ...state, bankId: action.bankId, stage: "bank_home" };
    case "LAUNCH_AURACASH":
    case "SCHEDULE_DELIVERY":
      return {
        ...state,
        stage: "assistant",
        cancellationRef: null,
        cancelledAt: null,
        cancellationReason: null,
      };
    case "SET_AMOUNT":
      return { ...state, amount: action.amount };
    case "SET_DENOMINATION":
      return { ...state, denomination: action.denomination };
    case "CONFIRM_ORDER":
      return {
        ...state,
        stage: "tracker",
        cancellationRef: null,
        cancelledAt: null,
        cancellationReason: null,
      };
    case "CANCEL_ORDER":
      return {
        ...state,
        stage: "cancelled",
        cancellationRef: generateCancellationRef(),
        cancelledAt: new Date().toISOString(),
        cancellationReason: "user",
      };
    case "STOP_FOR_HAZARD":
      return {
        ...state,
        stage: "cancelled",
        cancellationRef: generateCancellationRef(),
        cancelledAt: new Date().toISOString(),
        cancellationReason: "hazard",
      };
    case "UNLOCK_CASH":
      return { ...state, stage: "complete" };
    case "RETURN_HOME":
      return { ...initialFlowState, bankId: state.bankId };
    default:
      return state;
  }
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

export function formatCancelledDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatCancelledTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}
