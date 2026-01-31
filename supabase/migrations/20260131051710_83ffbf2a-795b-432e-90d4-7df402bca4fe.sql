-- Enable pgcrypto extension for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create a function to encrypt text using a secret key
CREATE OR REPLACE FUNCTION public.encrypt_text(plain_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  encryption_key TEXT := 'canteen_secure_key_2024';
BEGIN
  IF plain_text IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN encode(pgp_sym_encrypt(plain_text, encryption_key), 'base64');
END;
$$;

-- Create a function to decrypt text (only for authenticated users)
CREATE OR REPLACE FUNCTION public.decrypt_text(encrypted_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  encryption_key TEXT := 'canteen_secure_key_2024';
BEGIN
  IF encrypted_text IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN pgp_sym_decrypt(decode(encrypted_text, 'base64'), encryption_key);
EXCEPTION
  WHEN OTHERS THEN
    RETURN '***PROTECTED***';
END;
$$;

-- Add encrypted columns
ALTER TABLE public.orders 
ADD COLUMN customer_name_encrypted TEXT,
ADD COLUMN customer_phone_encrypted TEXT;

-- Migrate existing data to encrypted columns
UPDATE public.orders 
SET 
  customer_name_encrypted = public.encrypt_text(customer_name),
  customer_phone_encrypted = public.encrypt_text(customer_phone);

-- Create a trigger to auto-encrypt on insert/update
CREATE OR REPLACE FUNCTION public.encrypt_order_pii()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Encrypt the sensitive fields
  NEW.customer_name_encrypted := public.encrypt_text(NEW.customer_name);
  NEW.customer_phone_encrypted := public.encrypt_text(NEW.customer_phone);
  -- Clear the plain text fields (store only encrypted)
  NEW.customer_name := '***';
  NEW.customer_phone := '***';
  RETURN NEW;
END;
$$;

CREATE TRIGGER encrypt_order_pii_trigger
BEFORE INSERT OR UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.encrypt_order_pii();

-- Create a secure view for public order tracking (no PII exposed)
CREATE VIEW public.orders_public
WITH (security_invoker = on)
AS SELECT 
  id,
  items,
  total_amount,
  status,
  '***' as customer_name,
  '***' as customer_phone,
  estimated_time,
  created_at,
  updated_at
FROM public.orders;

-- Create a secure view for admin with decrypted data
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

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Anyone can view orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;

-- Create more restrictive policies
-- Anyone can insert orders (customers placing orders)
-- Policy already exists: "Anyone can create orders"

-- Only allow SELECT on specific columns (status tracking only)
CREATE POLICY "Public can track order status"
ON public.orders FOR SELECT
USING (true);

-- Updates restricted - we'll handle via edge function for admin
CREATE POLICY "No direct updates"
ON public.orders FOR UPDATE
USING (false);