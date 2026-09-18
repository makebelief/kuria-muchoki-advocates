export function GET() {
  return Response.json(
    { status: 'ok', service: 'kuria-muchoki-advocates' },
    { headers: { 'cache-control': 'no-store, max-age=0' } }
  );
}
