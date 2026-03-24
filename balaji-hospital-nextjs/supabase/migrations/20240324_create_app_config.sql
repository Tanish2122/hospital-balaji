-- Create a general-purpose config table for key-value settings
CREATE TABLE IF NOT EXISTS public.app_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view public configs
DROP POLICY IF EXISTS "Public configs are viewable by everyone" ON public.app_config;
CREATE POLICY "Public configs are viewable by everyone" 
ON public.app_config FOR SELECT 
USING (true);

-- Policy: Only admins can manage configs
DROP POLICY IF EXISTS "Admins can manage config" ON public.app_config;
CREATE POLICY "Admins can manage config" 
ON public.app_config FOR ALL 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.doctors 
        WHERE auth_id = auth.uid() 
        AND (role = 'admin' OR is_admin = true)
    )
);

-- Initialize social_feed config
INSERT INTO public.app_config (key, value)
VALUES ('social_feed', '{"instagram_url": "", "instagram_live": false, "youtube_url": "", "youtube_live": false, "facebook_url": "", "facebook_live": false}')
ON CONFLICT (key) DO NOTHING;

-- Grant permissions
GRANT SELECT ON public.app_config TO anon, authenticated;
GRANT ALL ON public.app_config TO authenticated;
