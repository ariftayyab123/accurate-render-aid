ALTER TABLE public.workspaces
  ADD COLUMN IF NOT EXISTS tax_scheme text NOT NULL DEFAULT 'gst_5_no_itc',
  ADD COLUMN IF NOT EXISTS discount_funding_share numeric NOT NULL DEFAULT 1;