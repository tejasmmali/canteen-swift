-- Drop any remaining permissive update policies
DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;
DROP POLICY IF EXISTS "No direct updates" ON public.orders;

-- Create a strict policy that blocks all direct updates
-- Updates can only happen via edge functions using service role
CREATE POLICY "Block direct updates"
ON public.orders FOR UPDATE
USING (false)
WITH CHECK (false);