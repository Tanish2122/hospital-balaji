-- Create a settings table for site-wide configuration
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view public settings
CREATE POLICY "Public settings are viewable by everyone" 
ON public.site_settings FOR SELECT 
USING (true);

-- Policy: Only admins can manage settings
CREATE POLICY "Admins can manage settings" 
ON public.site_settings FOR ALL 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.doctors 
        WHERE auth_id = auth.uid() AND role = 'admin'
    )
);

-- Insert a default placeholder for instagram feed
INSERT INTO public.site_settings (key, value)
VALUES ('social_feed', '{"instagram_url": "", "type": "static"}')
ON CONFLICT (key) DO NOTHING;
