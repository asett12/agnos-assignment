"use client";

import { supabase } from "./supabaseClient";
import { PatientRealtimePayload } from "./types";

const CHANNEL_NAME = "patient_updates";

const sendChannel = supabase.channel(CHANNEL_NAME, {
  config: { broadcast: { self: true } },
});

sendChannel.subscribe();

export async function sendPatientUpdate(payload: PatientRealtimePayload) {
  try {
    await sendChannel.send({
      type: "broadcast",
      event: "patient:update",
      payload,
    });
  } catch (err) {
      console.error("Unexpected error sending patient update:", err);
  }
}


export function subscribeToPatientUpdates(
  handler: (payload: PatientRealtimePayload) => void
): () => void {
  const listenChannel = supabase.channel(CHANNEL_NAME, {
    config: { broadcast: { self: true } },
  });

  listenChannel.on(
    "broadcast",
    { event: "patient:update" },
    (event: { payload: any }) => handler(event.payload as PatientRealtimePayload)
  );

  listenChannel.subscribe();

  return () => {
    supabase.removeChannel(listenChannel);
  };
}
