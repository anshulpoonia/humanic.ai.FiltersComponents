// app/api/attributes/route.js

export async function GET(req) {
  const attributes = ["country", "name", "email"];
  

  return new Response(JSON.stringify(attributes), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
