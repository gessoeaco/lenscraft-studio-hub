import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, User, Mail, Phone, MapPin, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BookingModalProps {
  children: React.ReactNode;
  selectedSessionType?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const BookingModal = ({ children, selectedSessionType = "" }: BookingModalProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    sessionType: selectedSessionType,
    sessionDate: "",
    sessionTime: "",
    location: "",
    notes: "",
    durationHours: "2"
  });

  // Generate time slots based on available hours
  const generateTimeSlots = (startHour: number, endHour: number, duration: number = 2) => {
    const slots: TimeSlot[] = [];
    for (let hour = startHour; hour <= endHour - duration; hour += duration) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      slots.push({ time: timeString, available: true });
    }
    return slots;
  };

  // Check availability for selected date
  const checkAvailability = async (date: string) => {
    if (!date) return;
    
    setLoadingSlots(true);
    try {
      const selectedDateObj = new Date(date);
      const dayOfWeek = selectedDateObj.getDay();
      
      // Get available slots for this day of week
      const { data: availableHours } = await supabase
        .from('available_slots')
        .select('start_time, end_time')
        .eq('day_of_week', dayOfWeek)
        .eq('is_active', true)
        .single();

      if (!availableHours) {
        setAvailableSlots([]);
        return;
      }

      // Generate slots based on available hours
      const startHour = parseInt(availableHours.start_time.split(':')[0]);
      const endHour = parseInt(availableHours.end_time.split(':')[0]);
      const duration = parseInt(formData.durationHours);
      
      let slots = generateTimeSlots(startHour, endHour, duration);

      // Check existing bookings for this date
      const { data: existingBookings } = await supabase
        .from('bookings')
        .select('session_time, duration_hours')
        .eq('session_date', date)
        .in('status', ['pending', 'confirmed']);

      if (existingBookings) {
        existingBookings.forEach(booking => {
          const bookingHour = parseInt(booking.session_time.split(':')[0]);
          const bookingDuration = booking.duration_hours || 2;
          
          slots = slots.map(slot => {
            const slotHour = parseInt(slot.time.split(':')[0]);
            // Mark slot as unavailable if it conflicts with existing booking
            if (slotHour >= bookingHour && slotHour < bookingHour + bookingDuration) {
              return { ...slot, available: false };
            }
            return slot;
          });
        });
      }

      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      checkAvailability(selectedDate);
    }
  }, [selectedDate, formData.durationHours]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'sessionDate') {
      setSelectedDate(value);
      setFormData(prev => ({ ...prev, sessionTime: "" })); // Reset time when date changes
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Allow booking from tomorrow
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // Allow booking up to 3 months ahead
    return maxDate.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('bookings')
        .insert([{
          client_name: formData.clientName,
          client_email: formData.clientEmail,
          client_phone: formData.clientPhone || null,
          session_type: formData.sessionType,
          session_date: formData.sessionDate,
          session_time: formData.sessionTime,
          duration_hours: parseInt(formData.durationHours),
          location: formData.location || null,
          notes: formData.notes || null
        }]);

      if (error) throw error;

      toast({
        title: "Agendamento realizado com sucesso!",
        description: "Receberás uma confirmação por email em breve. Obrigado!",
      });

      // Reset form and close modal
      setFormData({
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        sessionType: selectedSessionType,
        sessionDate: "",
        sessionTime: "",
        location: "",
        notes: "",
        durationHours: "2"
      });
      setSelectedDate("");
      setAvailableSlots([]);
      setIsOpen(false);

    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: "Erro ao agendar sessão",
        description: "Tenta novamente ou contacta-nos directamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-primary flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Agendar Sessão
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information */}
          <Card className="p-6 border-border/50">
            <h3 className="text-lg font-serif font-semibold text-primary mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName" className="text-sm font-medium">
                  Nome Completo *
                </Label>
                <Input 
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  placeholder="O teu nome completo"
                  className="mt-2"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <Label htmlFor="clientEmail" className="text-sm font-medium">
                  Email *
                </Label>
                <Input 
                  id="clientEmail"
                  name="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  placeholder="exemplo@email.com"
                  className="mt-2"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="clientPhone" className="text-sm font-medium">
                  Telefone / WhatsApp
                </Label>
                <Input 
                  id="clientPhone"
                  name="clientPhone"
                  type="tel"
                  value={formData.clientPhone}
                  onChange={handleInputChange}
                  placeholder="+351 xxx xxx xxx"
                  className="mt-2"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </Card>

          {/* Session Details */}
          <Card className="p-6 border-border/50">
            <h3 className="text-lg font-serif font-semibold text-primary mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Detalhes da Sessão
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sessionType" className="text-sm font-medium">
                  Tipo de Sessão *
                </Label>
                <Select
                  value={formData.sessionType}
                  onValueChange={(value) => handleSelectChange(value, "sessionType")}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Escolhe o tipo de sessão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casamento">Casamento</SelectItem>
                    <SelectItem value="familia">Família</SelectItem>
                    <SelectItem value="gestante">Gestante</SelectItem>
                    <SelectItem value="batizado">Batizado</SelectItem>
                    <SelectItem value="corporativo">Corporativo</SelectItem>
                    <SelectItem value="reels">Reels & Redes Sociais</SelectItem>
                    <SelectItem value="ensaio">Ensaio Pessoal</SelectItem>
                    <SelectItem value="mini-sessao">Mini Sessão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="durationHours" className="text-sm font-medium">
                  Duração *
                </Label>
                <Select
                  value={formData.durationHours}
                  onValueChange={(value) => handleSelectChange(value, "durationHours")}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hora</SelectItem>
                    <SelectItem value="2">2 horas</SelectItem>
                    <SelectItem value="3">3 horas</SelectItem>
                    <SelectItem value="4">4 horas</SelectItem>
                    <SelectItem value="6">6 horas</SelectItem>
                    <SelectItem value="8">8 horas (dia completo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="sessionDate" className="text-sm font-medium">
                  Data Preferida *
                </Label>
                <Input 
                  id="sessionDate"
                  name="sessionDate"
                  type="date"
                  value={formData.sessionDate}
                  onChange={handleInputChange}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="mt-2"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <Label htmlFor="sessionTime" className="text-sm font-medium">
                  Hora Preferida *
                </Label>
                {selectedDate ? (
                  loadingSlots ? (
                    <div className="mt-2 p-3 border rounded-md flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">A verificar disponibilidade...</span>
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <Select
                      value={formData.sessionTime}
                      onValueChange={(value) => handleSelectChange(value, "sessionTime")}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Escolhe um horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSlots.map((slot) => (
                          <SelectItem 
                            key={slot.time} 
                            value={slot.time} 
                            disabled={!slot.available}
                            className={!slot.available ? "opacity-50" : ""}
                          >
                            {slot.time} {!slot.available && "(Ocupado)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-2 p-3 border rounded-md text-sm text-muted-foreground">
                      Sem horários disponíveis para esta data
                    </div>
                  )
                ) : (
                  <div className="mt-2 p-3 border rounded-md text-sm text-muted-foreground">
                    Seleciona uma data primeiro
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Local Preferido
                </Label>
                <Input 
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Estúdio, exterior, domicílio..."
                  className="mt-2"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </Card>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="notes" className="text-sm font-medium">
              Notas Adicionais
            </Label>
            <Textarea 
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Alguma observação especial, referências, ou pedidos específicos..."
              className="mt-2 min-h-[100px]"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.sessionTime || !formData.sessionDate}
              className="hover-zoom shadow-elegant"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  A agendar...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Confirmar Agendamento
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;