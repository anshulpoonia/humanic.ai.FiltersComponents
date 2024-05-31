import { NextResponse } from "next/server";

const eventsValues = {
  login: ["loginwith", "notloging"],
  register: ["registered", "notregistered"],
};

export async function GET(req, context) {
  const eventName = context.params.eventName; // Use default value {} to avoid TypeError
  if (!eventName || !eventsValues[eventName]) {
    return NextResponse.json({ error: "Attribute not found" });
  }

  return NextResponse.json({ [eventName]: eventsValues[eventName] });
}
