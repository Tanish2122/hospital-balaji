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
  name: string | null;
  meta_title: string | null;
  meta_description: string | null;
} | null> {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("departments")
      .select("image, overview, name, meta_title, meta_description")
      .eq("slug", slug)
      .single();

    if (error || !data) return null;
    
    return {
      image: data.image as string | null,
      overview: data.overview as string | null,
      name: data.name as string | null,
      meta_title: data.meta_title as string | null,
      meta_description: data.meta_description as string | null,
    };
  } catch {
    return null;
  }
}
