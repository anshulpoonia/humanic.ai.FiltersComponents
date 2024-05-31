import { NextResponse } from "next/server";

const attributeValues = {
  country: ["India", "United States", "Canada"],
  name: ["Alice", "Bob", "Charlie"],
  email:[]
  // Accept user to add email (not pre-defined choices)
};

export async function GET(req, context) {
  const { attributeName } = context.params;

  if (!attributeName) {
    return NextResponse.json({ error: "Attribute name is required" }, { status: 400 });
  }

  const values = attributeValues[attributeName];

  if (!values) {
    return NextResponse.json({ error: `Attribute '${attributeName}' not found` }, { status: 404 });
  }

  return NextResponse.json({ [attributeName]: values });
}
