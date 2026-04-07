import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Fetches the image URL for a department from Supabase by its slug.
 * Returns null if no image is set in the DB or if the fetch fails.
 * This is called server-side (in Server Components / generateStaticParams).
 */
export async function getDepartmentImageFromDB(slug: string): Promise<string | null> {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("departments")
      .select("image")
      .eq("slug", slug)
      .single();

    if (error || !data?.image) return null;
    return data.image as string;
  } catch {
    return null;
  }
}
