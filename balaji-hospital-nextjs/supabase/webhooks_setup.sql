-- Enable the pg_net extension to allow HTTP requests from PostgreSQL
create extension if not exists "pg_net";

-- 1. Create a function to call the send-whatsapp edge function
create or replace function public.handle_new_submission()
returns trigger
language plpgsql
security definer
as $$
declare
  payload jsonb;
begin
  payload := jsonb_build_object(
    'record', row_to_json(new),
    'table', tg_table_name
  );

  -- Replace <PROJECT_REF> with your actual project reference
  -- Replace <SERVICE_ROLE_KEY> with your service role key (or use net.http_post for internal calls)
  perform
    net.http_post(
      url := 'https://yroieafhxcorwitzwyjj.supabase.co/functions/v1/send-whatsapp',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := payload
    );

  return new;
end;
$$;

-- 2. Create triggers for appointments and contact_forms
create trigger on_appointment_inserted
  after insert on public.appointments
  for each row execute function public.handle_new_submission();

create trigger on_contact_form_inserted
  after insert on public.contact_forms
  for each row execute function public.handle_new_submission();
