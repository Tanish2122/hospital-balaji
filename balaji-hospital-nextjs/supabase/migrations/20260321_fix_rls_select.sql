-- Enable SELECT access for everyone to allow the count logic to work
-- Note: In a production app, you might want to restrict this further
CREATE POLICY "Anyone can read appointments" ON public.appointments FOR SELECT USING (true);
