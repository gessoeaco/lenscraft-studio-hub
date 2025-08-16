-- Safe, idempotent policies creation (only if missing)
-- Bookings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bookings' AND policyname = 'Admins can view all bookings'
  ) THEN
    CREATE POLICY "Admins can view all bookings"
    ON public.bookings
    FOR SELECT
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bookings' AND policyname = 'Admins can update bookings'
  ) THEN
    CREATE POLICY "Admins can update bookings"
    ON public.bookings
    FOR UPDATE
    USING (true)
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bookings' AND policyname = 'Anyone can create bookings'
  ) THEN
    CREATE POLICY "Anyone can create bookings"
    ON public.bookings
    FOR INSERT
    WITH CHECK (true);
  END IF;
END $$;

-- Contacts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contacts' AND policyname = 'Admins can view all contacts'
  ) THEN
    CREATE POLICY "Admins can view all contacts"
    ON public.contacts
    FOR SELECT
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contacts' AND policyname = 'Admins can update contacts'
  ) THEN
    CREATE POLICY "Admins can update contacts"
    ON public.contacts
    FOR UPDATE
    USING (true)
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contacts' AND policyname = 'Anyone can submit contact forms'
  ) THEN
    CREATE POLICY "Anyone can submit contact forms"
    ON public.contacts
    FOR INSERT
    WITH CHECK (true);
  END IF;
END $$;

-- Testimonials
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'testimonials' AND policyname = 'Admins can update testimonials'
  ) THEN
    CREATE POLICY "Admins can update testimonials"
    ON public.testimonials
    FOR UPDATE
    USING (true)
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'testimonials' AND policyname = 'Anyone can submit testimonials'
  ) THEN
    CREATE POLICY "Anyone can submit testimonials"
    ON public.testimonials
    FOR INSERT
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'testimonials' AND policyname = 'Anyone can view approved testimonials'
  ) THEN
    CREATE POLICY "Anyone can view approved testimonials"
    ON public.testimonials
    FOR SELECT
    USING (is_approved = true);
  END IF;
END $$;

-- Blog posts manage + published read (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'blog_posts' AND policyname = 'Admins can manage blog posts'
  ) THEN
    CREATE POLICY "Admins can manage blog posts"
    ON public.blog_posts
    FOR ALL
    USING (true)
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'blog_posts' AND policyname = 'Anyone can view published blog posts'
  ) THEN
    CREATE POLICY "Anyone can view published blog posts"
    ON public.blog_posts
    FOR SELECT
    USING (is_published = true AND publish_date <= now());
  END IF;
END $$;

-- Portfolio sessions/images manage + public read (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'portfolio_sessions' AND policyname = 'Admins can manage portfolio sessions'
  ) THEN
    CREATE POLICY "Admins can manage portfolio sessions"
    ON public.portfolio_sessions
    FOR ALL
    USING (true)
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'portfolio_sessions' AND policyname = 'Anyone can view published portfolio sessions'
  ) THEN
    CREATE POLICY "Anyone can view published portfolio sessions"
    ON public.portfolio_sessions
    FOR SELECT
    USING (is_published = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'portfolio_images' AND policyname = 'Admins can manage portfolio images'
  ) THEN
    CREATE POLICY "Admins can manage portfolio images"
    ON public.portfolio_images
    FOR ALL
    USING (true)
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'portfolio_images' AND policyname = 'Anyone can view portfolio images'
  ) THEN
    CREATE POLICY "Anyone can view portfolio images"
    ON public.portfolio_images
    FOR SELECT
    USING (EXISTS (
      SELECT 1 FROM public.portfolio_sessions ps
      WHERE ps.id = portfolio_images.session_id AND ps.is_published = true
    ));
  END IF;
END $$;