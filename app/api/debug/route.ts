export async function GET() {
  return Response.json({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    clerk: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  });
}
