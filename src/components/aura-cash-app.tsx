"use client";

import { useReducer, useRef, useState } from "react";
import { AssistantScreen } from "@/components/screens/assistant-screen";
import { CompleteScreen } from "@/components/screens/complete-screen";
import { DashboardScreen } from "@/components/screens/dashboard-screen";
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

  const transition = (action: FlowAction) => {
    const nextStage =
      action.type === "SCHEDULE_DELIVERY"
        ? "assistant"
        : action.type === "CONFIRM_ORDER"
          ? "tracker"
          : action.type === "UNLOCK_CASH"
            ? "complete"
            : action.type === "CANCEL_ORDER" || action.type === "RETURN_HOME"
              ? "dashboard"
              : state.stage;

    if (nextStage !== state.stage) {
      setDirection(getTransitionDirection(prevStageRef.current, nextStage));
      prevStageRef.current = nextStage;
    }

    dispatch(action);
  };

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden bg-surface-light shadow-2xl shadow-brand-navy/10">
      <ScreenTransition stage={state.stage} direction={direction}>
        {state.stage === "dashboard" && (
          <DashboardScreen
            onScheduleDelivery={() => transition({ type: "SCHEDULE_DELIVERY" })}
          />
        )}

        {state.stage === "assistant" && (
          <AssistantScreen
            amount={state.amount}
            denomination={state.denomination}
            onAmountChange={(amount) =>
              dispatch({ type: "SET_AMOUNT", amount })
            }
            onDenominationChange={(denomination) =>
              dispatch({ type: "SET_DENOMINATION", denomination })
            }
            onConfirm={() => transition({ type: "CONFIRM_ORDER" })}
          />
        )}

        {state.stage === "tracker" && (
          <TrackerScreen
            onCancel={() => transition({ type: "CANCEL_ORDER" })}
            onUnlock={() => transition({ type: "UNLOCK_CASH" })}
          />
        )}

        {state.stage === "complete" && (
          <CompleteScreen
            amount={state.amount}
            onReturnHome={() => transition({ type: "RETURN_HOME" })}
          />
        )}
      </ScreenTransition>
    </div>
  );
}
