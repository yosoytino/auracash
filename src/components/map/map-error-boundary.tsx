"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { MapFallback } from "@/components/map/map-fallback";

type MapErrorBoundaryProps = {
  children: ReactNode;
  progress: number;
  hasArrived: boolean;
};

type MapErrorBoundaryState = {
  hasError: boolean;
};

export class MapErrorBoundary extends Component<
  MapErrorBoundaryProps,
  MapErrorBoundaryState
> {
  state: MapErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): MapErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Delivery map failed to render:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <MapFallback
          progress={this.props.progress}
          hasArrived={this.props.hasArrived}
        />
      );
    }

    return this.props.children;
  }
}
