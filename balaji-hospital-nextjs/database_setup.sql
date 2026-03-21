-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Departments / Services
create table public.departments (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    slug text not null unique,
    description text,
    icon_image_url text,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Doctors
create table public.doctors (
    id uuid default uuid_generate_v4() primary key,
    department_id uuid references public.departments(id) on delete set null,
    name text not null,
    slug text not null unique,
    qualification text,
    experience_years integer,
    designation text,
    bio text,
    image_url text,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Appointments
create table public.appointments (
    id uuid default uuid_generate_v4() primary key,
    patient_name text not null,
    email text,
    phone text not null,
    whatsapp text,
    doctor_id uuid references public.doctors(id) on delete set null,
    department_id uuid references public.departments(id) on delete set null,
    appointment_date date not null,
    appointment_time time without time zone,
    status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
    reason text,
    whatsapp_sent_at timestamp with time zone,
    whatsapp_status text,
    whatsapp_message_id text,
    whatsapp_error text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Emergencies (New for the improved Appointment System)
create table public.emergencies (
    id uuid default uuid_generate_v4() primary key,
    patient_name text not null,
    phone text not null,
    whatsapp text,
    description text not null,
    report_url text, -- For uploaded medical reports
    status text default 'pending' check (status in ('pending', 'contacted', 'resolved')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Contact Forms
create table public.contact_forms (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    phone text,
    email text,
    subject text,
    message text,
    is_read boolean default false,
    whatsapp_sent_at timestamp with time zone,
    whatsapp_status text,
    whatsapp_message_id text,
    whatsapp_error text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Blogs / Articles
create table public.blogs (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    slug text not null unique,
    excerpt text,
    content text not null,
    featured_image_url text,
    published_at timestamp with time zone,
    is_published boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Testimonials
create table public.testimonials (
    id uuid default uuid_generate_v4() primary key,
    patient_name text not null,
    content text not null,
    rating integer check (rating >= 1 and rating <= 5),
    image_url text,
    is_approved boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Media / Gallery
create table public.gallery (
    id uuid default uuid_generate_v4() primary key,
    url text not null,
    alt_text text not null,
    category text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add performance indexes for faster querying
create index idx_doctors_department on public.doctors(department_id);
create index idx_appointments_doctor on public.appointments(doctor_id);
create index idx_appointments_date on public.appointments(appointment_date);
create index idx_blogs_slug on public.blogs(slug);
create index idx_departments_slug on public.departments(slug);
create index idx_gallery_category on public.gallery(category);

-- 1. Enable RLS on all tables
alter table public.departments enable row level security;
alter table public.doctors enable row level security;
alter table public.appointments enable row level security;
alter table public.emergencies enable row level security;
alter table public.contact_forms enable row level security;
alter table public.blogs enable row level security;
alter table public.testimonials enable row level security;
alter table public.gallery enable row level security;

-- 2. Public READ Access Policies (Everyone can view these)
create policy "Public read access for active departments" on public.departments for select using (is_active = true);
create policy "Public read access for active doctors" on public.doctors for select using (is_active = true);
create policy "Public read access for published blogs" on public.blogs for select using (is_published = true);
create policy "Public read access for approved testimonials" on public.testimonials for select using (is_approved = true);
create policy "Public read access for gallery" on public.gallery for select using (true);

-- 3. Public INSERT Access Policies (Anyone can submit forms, but nobody can read them from the frontend)
create policy "Anyone can insert appointments" on public.appointments for insert with check (true);
create policy "Anyone can insert emergencies" on public.emergencies for insert with check (true);
create policy "Anyone can insert contact forms" on public.contact_forms for insert with check (true);
