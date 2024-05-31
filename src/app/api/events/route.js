export async function GET(req) {
  const events = ["login", "register"];

  return new Response(JSON.stringify(events), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
