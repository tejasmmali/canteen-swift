-- Update the encrypt trigger since we removed the original columns
DROP TRIGGER IF EXISTS encrypt_order_pii_trigger ON public.orders;
DROP FUNCTION IF EXISTS public.encrypt_order_pii();

-- Create new trigger that works with encrypted columns only
CREATE OR REPLACE FUNCTION public.encrypt_order_pii()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If encrypted columns are not set but we have temp values in NEW, encrypt them
  -- This handles the case where insert provides customer_name_encrypted directly
  IF NEW.customer_name_encrypted IS NOT NULL AND 
     LEFT(NEW.customer_name_encrypted, 1) != 'j' THEN -- 'j' is first char of base64 encrypted data
    NEW.customer_name_encrypted := public.encrypt_text(NEW.customer_name_encrypted);
  END IF;
  IF NEW.customer_phone_encrypted IS NOT NULL AND 
     LEFT(NEW.customer_phone_encrypted, 1) != 'j' THEN
    NEW.customer_phone_encrypted := public.encrypt_text(NEW.customer_phone_encrypted);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER encrypt_order_pii_trigger
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.encrypt_order_pii();