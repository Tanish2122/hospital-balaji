import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Fetches the image URL for a department from Supabase by its slug.
 * Returns null if no image is set in the DB or if the fetch fails.
 * This is called server-side (in Server Components / generateStaticParams).
 */
export async function getDepartmentImageFromDB(slug: string): Promise<string | null> {
  const data = await getDepartmentDataFromDB(slug);
  return data?.image || null;
}

/**
 * Fetches the full data for a department from Supabase by its slug.
 * This is used to sync admin-managed content (images, overview, etc.) with the website.
 */
export async function getDepartmentDataFromDB(slug: string): Promise<{
  image: string | null;
  overview: string | null;
} | null> {
  try {
    console.log('[DB Sync] Fetching data for slug:', slug);
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("departments")
      .select("image, overview")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error('[DB Sync] Error fetching department:', error.message);
      return null;
    }
    
    if (!data) {
      console.warn('[DB Sync] No data found for slug:', slug);
      return null;
    }

    console.log('[DB Sync] Success! Found overview:', data.overview ? (data.overview.substring(0, 50) + '...') : 'NULL');
    return {
      image: data.image as string | null,
      overview: data.overview as string | null,
    };
  } catch (err) {
    console.error('[DB Sync] Exception:', err);
    return null;
  }
}
