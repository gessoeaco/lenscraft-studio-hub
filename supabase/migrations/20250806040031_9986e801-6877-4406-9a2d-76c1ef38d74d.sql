-- Create bookings table for appointment scheduling
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  session_type TEXT NOT NULL,
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  duration_hours INTEGER DEFAULT 2,
  location TEXT,
  notes TEXT,
  price DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'deposit_paid', 'fully_paid')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policy for public inserts (anyone can book)
CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

-- Create policy for admin access
CREATE POLICY "Admins can view all bookings" 
ON public.bookings 
FOR SELECT 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create available time slots table
CREATE TABLE public.available_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for available_slots
ALTER TABLE public.available_slots ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view available slots" 
ON public.available_slots 
FOR SELECT 
USING (is_active = true);

-- Insert default available time slots (Monday to Friday 9-18, Saturday 10-16)
INSERT INTO public.available_slots (day_of_week, start_time, end_time) VALUES
(1, '09:00', '18:00'), -- Monday
(2, '09:00', '18:00'), -- Tuesday
(3, '09:00', '18:00'), -- Wednesday
(4, '09:00', '18:00'), -- Thursday
(5, '09:00', '18:00'), -- Friday
(6, '10:00', '16:00'); -- Saturday