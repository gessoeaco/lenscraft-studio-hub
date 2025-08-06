import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Star
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  session_type: string;
  session_date: string;
  session_time: string;
  duration_hours: number;
  location: string;
  notes: string;
  status: string;
  created_at: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  session_type: string;
  message: string;
  budget_range: string;
  event_date: string;
  location: string;
  status: string;
  created_at: string;
}

interface Testimonial {
  id: string;
  client_name: string;
  session_type: string;
  rating: number;
  testimonial: string;
  is_approved: boolean;
  created_at: string;
}

const AdminPanel = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      // Fetch contacts
      const { data: contactsData } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      // Fetch testimonials
      const { data: testimonialsData } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      setBookings(bookingsData || []);
      setContacts(contactsData || []);
      setTestimonials(testimonialsData || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados administrativos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        )
      );

      toast({
        title: "Status atualizado",
        description: "O status do agendamento foi atualizado com sucesso."
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive"
      });
    }
  };

  const updateContactStatus = async (contactId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ status: newStatus })
        .eq('id', contactId);

      if (error) throw error;

      setContacts(prev => 
        prev.map(contact => 
          contact.id === contactId 
            ? { ...contact, status: newStatus }
            : contact
        )
      );

      toast({
        title: "Status atualizado",
        description: "O status do contacto foi atualizado com sucesso."
      });
    } catch (error) {
      console.error('Error updating contact status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive"
      });
    }
  };

  const approveTestimonial = async (testimonialId: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_approved: true })
        .eq('id', testimonialId);

      if (error) throw error;

      setTestimonials(prev => 
        prev.map(testimonial => 
          testimonial.id === testimonialId 
            ? { ...testimonial, is_approved: true }
            : testimonial
        )
      );

      toast({
        title: "Testemunho aprovado",
        description: "O testemunho foi aprovado e será exibido no site."
      });
    } catch (error) {
      console.error('Error approving testimonial:', error);
      toast({
        title: "Erro",
        description: "Não foi possível aprovar o testemunho.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pendente", icon: AlertCircle },
      confirmed: { color: "bg-green-100 text-green-800", label: "Confirmado", icon: CheckCircle },
      completed: { color: "bg-blue-100 text-blue-800", label: "Concluído", icon: CheckCircle },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelado", icon: XCircle },
      new: { color: "bg-gray-100 text-gray-800", label: "Novo", icon: AlertCircle },
      contacted: { color: "bg-blue-100 text-blue-800", label: "Contactado", icon: CheckCircle },
      proposal_sent: { color: "bg-purple-100 text-purple-800", label: "Proposta Enviada", icon: Mail },
      closed: { color: "bg-green-100 text-green-800", label: "Fechado", icon: CheckCircle },
      declined: { color: "bg-red-100 text-red-800", label: "Recusado", icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">
            Painel Administrativo
          </h1>
          <p className="text-muted-foreground">
            Gerir agendamentos, contactos e testemunhos
          </p>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Agendamentos ({bookings.length})
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contactos ({contacts.length})
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Testemunhos ({testimonials.length})
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            {bookings.length === 0 ? (
              <Card className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum agendamento encontrado.</p>
              </Card>
            ) : (
              bookings.map((booking) => (
                <Card key={booking.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-primary">
                        {booking.client_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {booking.session_type}
                      </p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(booking.session_date)}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {booking.session_time} ({booking.duration_hours}h)
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {booking.client_email}
                    </div>
                    {booking.client_phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {booking.client_phone}
                      </div>
                    )}
                  </div>

                  {booking.location && (
                    <div className="flex items-center gap-2 text-sm mb-4">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {booking.location}
                    </div>
                  )}

                  {booking.notes && (
                    <div className="bg-muted p-3 rounded mb-4">
                      <p className="text-sm">{booking.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        >
                          Confirmar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        >
                          Cancelar
                        </Button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateBookingStatus(booking.id, 'completed')}
                      >
                        Marcar como Concluído
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-4">
            {contacts.length === 0 ? (
              <Card className="p-8 text-center">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum contacto encontrado.</p>
              </Card>
            ) : (
              contacts.map((contact) => (
                <Card key={contact.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-primary">
                        {contact.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {contact.session_type}
                      </p>
                    </div>
                    {getStatusBadge(contact.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {contact.email}
                    </div>
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {contact.phone}
                      </div>
                    )}
                    {contact.budget_range && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Orçamento:</span>
                        {contact.budget_range}
                      </div>
                    )}
                  </div>

                  <div className="bg-muted p-3 rounded mb-4">
                    <p className="text-sm">{contact.message}</p>
                  </div>

                  <div className="flex gap-2">
                    {contact.status === 'new' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateContactStatus(contact.id, 'contacted')}
                        >
                          Marcar como Contactado
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateContactStatus(contact.id, 'proposal_sent')}
                        >
                          Proposta Enviada
                        </Button>
                      </>
                    )}
                    {(contact.status === 'contacted' || contact.status === 'proposal_sent') && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateContactStatus(contact.id, 'closed')}
                        >
                          Fechar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateContactStatus(contact.id, 'declined')}
                        >
                          Recusado
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="space-y-4">
            {testimonials.length === 0 ? (
              <Card className="p-8 text-center">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum testemunho encontrado.</p>
              </Card>
            ) : (
              testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-primary">
                        {testimonial.client_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.session_type} • {testimonial.rating}/5 ⭐
                      </p>
                    </div>
                    <Badge className={testimonial.is_approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {testimonial.is_approved ? "Aprovado" : "Pendente"}
                    </Badge>
                  </div>

                  <div className="bg-muted p-3 rounded mb-4">
                    <p className="text-sm italic">"{testimonial.testimonial}"</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(testimonial.created_at)}
                    </span>
                    {!testimonial.is_approved && (
                      <Button
                        size="sm"
                        onClick={() => approveTestimonial(testimonial.id)}
                      >
                        Aprovar
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;