-- Enable pgcrypto extension for encryption functions
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Recreate encrypt_text function to use extensions schema
CREATE OR REPLACE FUNCTION public.encrypt_text(plain_text text)
RETURNS text
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
  RETURN encode(extensions.pgp_sym_encrypt(plain_text, encryption_key), 'base64');
END;
$$;

-- Recreate decrypt_text function to use extensions schema
CREATE OR REPLACE FUNCTION public.decrypt_text(encrypted_text text)
RETURNS text
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
  RETURN extensions.pgp_sym_decrypt(decode(encrypted_text, 'base64'), encryption_key);
EXCEPTION
  WHEN OTHERS THEN
    RETURN '***PROTECTED***';
END;
$$;