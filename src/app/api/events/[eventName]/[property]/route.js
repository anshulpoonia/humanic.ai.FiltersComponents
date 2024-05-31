import { NextResponse } from "next/server";

const property = {
  loginwith: ["twitter", "facebook"],
  notloging: ["google", "gmail"],
  registered:['google', 'gmail'],
  notregistered:['twitter', 'facebook']
};

export async function GET(req, context) {
  const propertyName = context.params.property; // Use default value {} to avoid TypeError
  if (!propertyName || !property[propertyName]) {
    return NextResponse.json({ error: "Attribute not found" });
  }

  return NextResponse.json({ [propertyName]: property[propertyName] });
}
