"use client";

import { PatientRealtimePayload } from "./types";

const CHANNEL_NAME = "patient-form-realtime";

export type RealtimeCallback = (payload: PatientRealtimePayload) => void;

function createRealtimeChannel() {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
    return null;
  }
  return new BroadcastChannel(CHANNEL_NAME);
}

export function sendPatientUpdate(payload: PatientRealtimePayload) {
  const channel = createRealtimeChannel();
  if (!channel) return;
  channel.postMessage(payload);
}

export function subscribeToPatientUpdates(callback: RealtimeCallback) {
  const channel = createRealtimeChannel();
  if (!channel) return () => {};

  const handler = (event: MessageEvent<PatientRealtimePayload>) => {
    callback(event.data);
  };

  channel.addEventListener("message", handler);

  return () => {
    channel.removeEventListener("message", handler);
    channel.close();
  };
}
