-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum types
create type user_role as enum ('landlord', 'tenant', 'admin');
create type property_type as enum ('apartment', 'house', 'commercial', 'land');
create type maintenance_status as enum ('pending', 'in_progress', 'completed', 'cancelled');
create type payment_status as enum ('pending', 'paid', 'overdue', 'cancelled');
create type document_type as enum ('lease', 'invoice', 'maintenance', 'other');

-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade,
  name text not null,
  role user_role not null,
  phone text,
  address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Create properties table
create table properties (
  id uuid default uuid_generate_v4() primary key,
  landlord_id uuid references profiles(id) not null,
  name text not null,
  description text,
  address text not null,
  type property_type not null,
  bedrooms integer,
  bathrooms integer,
  area_sqft integer,
  rent_amount decimal(10,2) not null,
  deposit_amount decimal(10,2) not null,
  is_available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create tenants table
create table tenants (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references properties(id) not null,
  profile_id uuid references profiles(id) not null,
  lease_start_date date not null,
  lease_end_date date not null,
  rent_amount decimal(10,2) not null,
  deposit_amount decimal(10,2) not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create maintenance_requests table
create table maintenance_requests (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references properties(id) not null,
  tenant_id uuid references profiles(id) not null,
  title text not null,
  description text not null,
  status maintenance_status default 'pending',
  priority text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create payments table
create table payments (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references profiles(id) not null,
  property_id uuid references properties(id) not null,
  amount decimal(10,2) not null,
  payment_date date not null,
  due_date date not null,
  status payment_status default 'pending',
  payment_method text not null,
  reference_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create documents table
create table documents (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references properties(id),
  tenant_id uuid references profiles(id),
  type document_type not null,
  title text not null,
  file_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create notifications table
create table notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  title text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table properties enable row level security;
alter table tenants enable row level security;
alter table maintenance_requests enable row level security;
alter table payments enable row level security;
alter table documents enable row level security;
alter table notifications enable row level security;

-- Create policies
create policy "Users can view their own profile"
  on profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

create policy "Landlords can view their properties"
  on properties for select
  using ( auth.uid() = landlord_id );

create policy "Landlords can manage their properties"
  on properties for all
  using ( auth.uid() = landlord_id );

create policy "Tenants can view their properties"
  on properties for select
  using ( id in (
    select property_id from tenants where profile_id = auth.uid()
  ));

create policy "Tenants can view their maintenance requests"
  on maintenance_requests for select
  using ( tenant_id = auth.uid() );

create policy "Landlords can view maintenance requests for their properties"
  on maintenance_requests for select
  using ( property_id in (
    select id from properties where landlord_id = auth.uid()
  ));

create policy "Users can view their payments"
  on payments for select
  using ( tenant_id = auth.uid() );

create policy "Landlords can view payments for their properties"
  on payments for select
  using ( property_id in (
    select id from properties where landlord_id = auth.uid()
  ));

create policy "Users can view their documents"
  on documents for select
  using ( tenant_id = auth.uid() );

create policy "Landlords can view documents for their properties"
  on documents for select
  using ( property_id in (
    select id from properties where landlord_id = auth.uid()
  ));

create policy "Users can view their notifications"
  on notifications for select
  using ( user_id = auth.uid() );

-- Create indexes
create index idx_properties_landlord on properties(landlord_id);
create index idx_tenants_property on tenants(property_id);
create index idx_tenants_profile on tenants(profile_id);
create index idx_maintenance_property on maintenance_requests(property_id);
create index idx_maintenance_tenant on maintenance_requests(tenant_id);
create index idx_payments_tenant on payments(tenant_id);
create index idx_payments_property on payments(property_id);
create index idx_documents_property on documents(property_id);
create index idx_documents_tenant on documents(tenant_id);
create index idx_notifications_user on notifications(user_id); 