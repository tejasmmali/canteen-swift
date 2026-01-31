-- Drop the views first since we need to modify the underlying table
DROP VIEW IF EXISTS public.orders_public;
DROP VIEW IF EXISTS public.orders_admin;

-- Remove the original unencrypted columns from the orders table
-- (they now only contain '***' due to the trigger, but removing them prevents confusion)
ALTER TABLE public.orders DROP COLUMN IF EXISTS customer_name;
ALTER TABLE public.orders DROP COLUMN IF EXISTS customer_phone;

-- Recreate the public view without sensitive data
CREATE VIEW public.orders_public
WITH (security_invoker = on)
AS SELECT 
  id,
  items,
  total_amount,
  status,
  estimated_time,
  created_at,
  updated_at
FROM public.orders;

-- Recreate the admin view with decrypted data
CREATE VIEW public.orders_admin
WITH (security_invoker = on)
AS SELECT 
  id,
  items,
  total_amount,
  status,
  public.decrypt_text(customer_name_encrypted) as customer_name,
  public.decrypt_text(customer_phone_encrypted) as customer_phone,
  estimated_time,
  created_at,
  updated_at
FROM public.orders;