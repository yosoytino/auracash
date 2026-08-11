"use client";

import { useReducer, useRef, useState } from "react";
import { getBank } from "@/lib/bank-config";
import { AssistantScreen } from "@/components/screens/assistant-screen";
import { BankHomeScreen } from "@/components/screens/bank-home-screen";
import { CancelledScreen } from "@/components/screens/cancelled-screen";
import { CompleteScreen } from "@/components/screens/complete-screen";
import { TrackerScreen } from "@/components/screens/tracker-screen";
import {
  getTransitionDirection,
  ScreenTransition,
  type TransitionDirection,
} from "@/components/ui/screen-transition";
import {
  flowReducer,
  initialFlowState,
  type FlowAction,
  type FlowStage,
} from "@/lib/flow-state";

export function AuraCashApp() {
  const [state, dispatch] = useReducer(flowReducer, initialFlowState);
  const prevStageRef = useRef<FlowStage>(state.stage);
  const [direction, setDirection] = useState<TransitionDirection>("forward");
  const bank = getBank(state.bankId);

  const transition = (action: FlowAction) => {
    const nextStage =
      action.type === "LAUNCH_AURACASH" || action.type === "SCHEDULE_DELIVERY"
        ? "assistant"
        : action.type === "CONFIRM_ORDER"
          ? "tracker"
          : action.type === "UNLOCK_CASH"
            ? "complete"
            : action.type === "CANCEL_ORDER" ||
                action.type === "STOP_FOR_HAZARD"
              ? "cancelled"
              : action.type === "RETURN_HOME"
                ? "bank_home"
                : action.type === "SET_BANK"
                  ? "bank_home"
                  : state.stage;

    if (nextStage !== state.stage) {
      setDirection(getTransitionDirection(prevStageRef.current, nextStage));
      prevStageRef.current = nextStage;
    }

    dispatch(action);
  };

  const inAuraCashFlow = state.stage !== "bank_home";
  const isDarkStage = state.stage === "cancelled";

  return (
    <div
      className={[
        "relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden shadow-2xl",
        isDarkStage
          ? "bg-brand-navy shadow-brand-navy/20"
          : inAuraCashFlow
            ? "bg-surface-light shadow-brand-navy/10"
            : "shadow-black/10",
      ].join(" ")}
    >
      <ScreenTransition stage={state.stage} direction={direction}>
        {state.stage === "bank_home" && (
          <BankHomeScreen
            bank={bank}
            onScheduleCash={() => transition({ type: "LAUNCH_AURACASH" })}
            onSwitchBank={(bankId) => transition({ type: "SET_BANK", bankId })}
          />
        )}

        {state.stage === "assistant" && (
          <AssistantScreen
            bank={bank}
            amount={state.amount}
            denomination={state.denomination}
            onAmountChange={(amount) =>
              dispatch({ type: "SET_AMOUNT", amount })
            }
            onDenominationChange={(denomination) =>
              dispatch({ type: "SET_DENOMINATION", denomination })
            }
            onConfirm={() => transition({ type: "CONFIRM_ORDER" })}
            onBack={() => transition({ type: "RETURN_HOME" })}
          />
        )}

        {state.stage === "tracker" && (
          <TrackerScreen
            bank={bank}
            onConfirmCancel={() => transition({ type: "CANCEL_ORDER" })}
            onHazardStop={() => transition({ type: "STOP_FOR_HAZARD" })}
            onUnlock={() => transition({ type: "UNLOCK_CASH" })}
          />
        )}

        {state.stage === "complete" && (
          <CompleteScreen
            bank={bank}
            amount={state.amount}
            onReturnHome={() => transition({ type: "RETURN_HOME" })}
          />
        )}

        {state.stage === "cancelled" &&
          state.cancellationRef &&
          state.cancelledAt &&
          state.cancellationReason && (
            <CancelledScreen
              bank={bank}
              amount={state.amount}
              denomination={state.denomination}
              cancellationRef={state.cancellationRef}
              cancelledAt={state.cancelledAt}
              reason={state.cancellationReason}
              onReturnHome={() => transition({ type: "RETURN_HOME" })}
            />
          )}
      </ScreenTransition>
    </div>
  );
}
