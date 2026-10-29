// Reference preview has no OAuth service. Preserve the original panel's no-provider state.
export function GET() {
  return Response.json({ providers: [], dev_login: false, contact: null });
}
