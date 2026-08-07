export type FlowStage = "dashboard" | "assistant" | "tracker" | "complete";

export type BillDenomination = 5 | 10 | 20;

export type FlowState = {
  stage: FlowStage;
  amount: number;
  denomination: BillDenomination;
};

export type FlowAction =
  | { type: "SCHEDULE_DELIVERY" }
  | { type: "SET_AMOUNT"; amount: number }
  | { type: "SET_DENOMINATION"; denomination: BillDenomination }
  | { type: "CONFIRM_ORDER" }
  | { type: "CANCEL_ORDER" }
  | { type: "UNLOCK_CASH" }
  | { type: "RETURN_HOME" };

export const DELIVERY_ADDRESS = "142 Elmwood Dr";
export const AVAILABLE_BALANCE = 9665.03;
export const PRESET_AMOUNTS = [50, 75, 100] as const;

export const initialFlowState: FlowState = {
  stage: "dashboard",
  amount: 100,
  denomination: 20,
};

export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "SCHEDULE_DELIVERY":
      return { ...state, stage: "assistant" };
    case "SET_AMOUNT":
      return { ...state, amount: action.amount };
    case "SET_DENOMINATION":
      return { ...state, denomination: action.denomination };
    case "CONFIRM_ORDER":
      return { ...state, stage: "tracker" };
    case "CANCEL_ORDER":
      return { ...initialFlowState };
    case "UNLOCK_CASH":
      return { ...state, stage: "complete" };
    case "RETURN_HOME":
      return { ...initialFlowState };
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
