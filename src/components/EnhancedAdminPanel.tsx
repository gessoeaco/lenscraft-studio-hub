import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { 
  Settings, 
  Calendar as CalendarIcon, 
  MessageSquare, 
  Image, 
  FileText,
  Users,
  Mail,
  Star,
  Clock,
  MapPin,
  Camera
} from "lucide-react";

const EnhancedAdminPanel = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [portfolioSessions, setPortfolioSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { settings, updateSetting } = useSiteSettings();

  // Form states for new content
  const [newBlogPost, setNewBlogPost] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "behind-scenes",
    tags: "",
    featured_image: ""
  });

  const [newPortfolioSession, setNewPortfolioSession] = useState({
    title: "",
    slug: "",
    category: "Casais",
    description: "",
    session_date: "",
    location: "",
    cover_image: ""
  });

  const [newBooking, setNewBooking] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    session_type: "",
    session_date: "",
    session_time: "",
    duration_hours: 2 as number | string,
    price: "",
    location: "",
    notes: "",
    status: "pending",
    payment_status: "unpaid"
  });

  const [editBooking, setEditBooking] = useState<any | null>(null);
  const [editContact, setEditContact] = useState<any | null>(null);
  const [editTestimonial, setEditTestimonial] = useState<any | null>(null);
  const [editPost, setEditPost] = useState<any | null>(null);
  const [editSession, setEditSession] = useState<any | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [bookingsRes, contactsRes, testimonialsRes, blogRes, portfolioRes] = await Promise.all([
        supabase.from("bookings").select("*").order("created_at", { ascending: false }),
        supabase.from("contacts").select("*").order("created_at", { ascending: false }),
        supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
        supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
        supabase.from("portfolio_sessions").select("*").order("created_at", { ascending: false })
      ]);

      setBookings(bookingsRes.data || []);
      setContacts(contactsRes.data || []);
      setTestimonials(testimonialsRes.data || []);
      setBlogPosts(blogRes.data || []);
      setPortfolioSessions(portfolioRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (contactId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("contacts")
        .update({ status: newStatus })
        .eq("id", contactId);

      if (error) throw error;

      setContacts(prev => prev.map((contact: any) => 
        contact.id === contactId ? { ...contact, status: newStatus } : contact
      ));

      toast({
        title: "Status atualizado",
        description: "Status do contato foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Error updating contact status:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status do contato.",
        variant: "destructive",
      });
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", bookingId);

      if (error) throw error;

      setBookings(prev => prev.map((booking: any) => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      ));

      toast({
        title: "Status atualizado",
        description: "Status da reserva foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status da reserva.",
        variant: "destructive",
      });
    }
  };

  const approveTestimonial = async (testimonialId: string) => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .update({ is_approved: true })
        .eq("id", testimonialId);

      if (error) throw error;

      setTestimonials(prev => prev.map((testimonial: any) => 
        testimonial.id === testimonialId ? { ...testimonial, is_approved: true } : testimonial
      ));

      toast({
        title: "Testemunho aprovado",
        description: "Testemunho foi aprovado e será exibido no site.",
      });
    } catch (error) {
      console.error("Error approving testimonial:", error);
      toast({
        title: "Erro",
        description: "Erro ao aprovar testemunho.",
        variant: "destructive",
      });
    }
  };

  const createBlogPost = async () => {
    try {
      const slug = newBlogPost.slug || newBlogPost.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const { error } = await supabase
        .from("blog_posts")
        .insert({
          ...newBlogPost,
          slug,
          tags: newBlogPost.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          is_published: true,
          publish_date: new Date().toISOString()
        });

      if (error) throw error;

      setNewBlogPost({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "behind-scenes",
        tags: "",
        featured_image: ""
      });

      fetchAllData();
      
      toast({
        title: "Post criado",
        description: "Post do blog foi criado com sucesso.",
      });
    } catch (error) {
      console.error("Error creating blog post:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar post do blog.",
        variant: "destructive",
      });
    }
  };

  const createPortfolioSession = async () => {
    try {
      const slug = newPortfolioSession.slug || newPortfolioSession.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const { error } = await supabase
        .from("portfolio_sessions")
        .insert({
          ...newPortfolioSession,
          slug,
          session_date: newPortfolioSession.session_date || null
        });

      if (error) throw error;

      setNewPortfolioSession({
        title: "",
        slug: "",
        category: "Casais",
        description: "",
        session_date: "",
        location: "",
        cover_image: ""
      });

      fetchAllData();
      
      toast({
        title: "Sessão criada",
        description: "Sessão de portfólio foi criada com sucesso.",
      });
    } catch (error) {
      console.error("Error creating portfolio session:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar sessão de portfólio.",
        variant: "destructive",
      });
    }
  };

  const createBooking = async () => {
    try {
      const payload = {
        client_name: newBooking.client_name,
        client_email: newBooking.client_email,
        client_phone: newBooking.client_phone || null,
        session_type: newBooking.session_type,
        session_date: newBooking.session_date,
        session_time: newBooking.session_time,
        duration_hours: Number(newBooking.duration_hours) || 2,
        price: newBooking.price ? Number(newBooking.price) : null,
        location: newBooking.location || null,
        notes: newBooking.notes || null,
        status: newBooking.status,
        payment_status: newBooking.payment_status,
      };

      const { error } = await supabase.from("bookings").insert(payload);
      if (error) throw error;

      setNewBooking({
        client_name: "",
        client_email: "",
        client_phone: "",
        session_type: "",
        session_date: "",
        session_time: "",
        duration_hours: 2,
        price: "",
        location: "",
        notes: "",
        status: "pending",
        payment_status: "unpaid",
      });

      await fetchAllData();
      toast({ title: "Agendamento criado", description: "Novo agendamento foi adicionado." });
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({ title: "Erro", description: "Não foi possível criar o agendamento.", variant: "destructive" });
    }
  };

  const saveBookingEdits = async () => {
    if (!editBooking) return;
    try {
      const id = editBooking.id;
      const { error } = await supabase
        .from("bookings")
        .update({
          client_name: editBooking.client_name,
          client_email: editBooking.client_email,
          client_phone: editBooking.client_phone,
          session_type: editBooking.session_type,
          session_date: editBooking.session_date,
          session_time: editBooking.session_time,
          duration_hours: Number(editBooking.duration_hours) || 2,
          price: editBooking.price !== null && editBooking.price !== undefined ? Number(editBooking.price) : null,
          location: editBooking.location,
          notes: editBooking.notes,
          status: editBooking.status,
          payment_status: editBooking.payment_status,
        })
        .eq("id", id);

      if (error) throw error;
      setEditBooking(null);
      await fetchAllData();
      toast({ title: "Agendamento atualizado", description: "As alterações foram salvas." });
    } catch (error) {
      console.error("Error updating booking:", error);
      toast({ title: "Erro", description: "Não foi possível salvar as alterações.", variant: "destructive" });
    }
  };

  const saveContactEdits = async () => {
    if (!editContact) return;
    try {
      const id = editContact.id;
      const { error } = await supabase
        .from("contacts")
        .update({
          name: editContact.name,
          email: editContact.email,
          phone: editContact.phone,
          session_type: editContact.session_type,
          status: editContact.status,
          message: editContact.message,
          location: editContact.location,
          event_date: editContact.event_date || null,
          budget_range: editContact.budget_range || null,
        })
        .eq("id", id);

      if (error) throw error;
      setEditContact(null);
      await fetchAllData();
      toast({ title: "Contato atualizado", description: "As alterações foram salvas." });
    } catch (error) {
      console.error("Error updating contact:", error);
      toast({ title: "Erro", description: "Não foi possível salvar as alterações.", variant: "destructive" });
    }
  };

  const saveTestimonialEdits = async () => {
    if (!editTestimonial) return;
    try {
      const id = editTestimonial.id;
      const { error } = await supabase
        .from("testimonials")
        .update({
          client_name: editTestimonial.client_name,
          client_email: editTestimonial.client_email,
          session_type: editTestimonial.session_type,
          testimonial: editTestimonial.testimonial,
          rating: editTestimonial.rating ? Number(editTestimonial.rating) : null,
          is_approved: !!editTestimonial.is_approved,
          is_featured: !!editTestimonial.is_featured,
        })
        .eq("id", id);

      if (error) throw error;
      setEditTestimonial(null);
      await fetchAllData();
      toast({ title: "Testemunho atualizado", description: "As alterações foram salvas." });
    } catch (error) {
      console.error("Error updating testimonial:", error);
      toast({ title: "Erro", description: "Não foi possível salvar as alterações.", variant: "destructive" });
    }
  };

  const savePostEdits = async () => {
    if (!editPost) return;
    try {
      const id = editPost.id;
      const { error } = await supabase
        .from("blog_posts")
        .update({
          title: editPost.title,
          slug: editPost.slug,
          excerpt: editPost.excerpt,
          content: editPost.content,
          category: editPost.category,
          featured_image: editPost.featured_image,
          is_published: !!editPost.is_published,
        })
        .eq("id", id);

      if (error) throw error;
      setEditPost(null);
      await fetchAllData();
      toast({ title: "Post atualizado", description: "As alterações foram salvas." });
    } catch (error) {
      console.error("Error updating post:", error);
      toast({ title: "Erro", description: "Não foi possível salvar as alterações.", variant: "destructive" });
    }
  };

  const saveSessionEdits = async () => {
    if (!editSession) return;
    try {
      const id = editSession.id;
      const { error } = await supabase
        .from("portfolio_sessions")
        .update({
          title: editSession.title,
          slug: editSession.slug,
          category: editSession.category,
          description: editSession.description,
          session_date: editSession.session_date || null,
          location: editSession.location,
          cover_image: editSession.cover_image,
          is_published: !!editSession.is_published,
          is_featured: !!editSession.is_featured,
        })
        .eq("id", id);

      if (error) throw error;
      setEditSession(null);
      await fetchAllData();
      toast({ title: "Sessão atualizada", description: "As alterações foram salvas." });
    } catch (error) {
      console.error("Error updating session:", error);
      toast({ title: "Erro", description: "Não foi possível salvar as alterações.", variant: "destructive" });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-gradient animate-slide-up">Painel Administrativo</h1>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 shadow-elegant animate-scale-in">
          <TabsTrigger value="dashboard" className="transition-all duration-200 hover:scale-105">Dashboard</TabsTrigger>
          <TabsTrigger value="bookings" className="transition-all duration-200 hover:scale-105">Agendamentos</TabsTrigger>
          <TabsTrigger value="contacts" className="transition-all duration-200 hover:scale-105">Contatos</TabsTrigger>
          <TabsTrigger value="testimonials" className="transition-all duration-200 hover:scale-105">Testemunhos</TabsTrigger>
          <TabsTrigger value="blog" className="transition-all duration-200 hover:scale-105">Blog</TabsTrigger>
          <TabsTrigger value="portfolio" className="transition-all duration-200 hover:scale-105">Portfólio</TabsTrigger>
          <TabsTrigger value="settings" className="transition-all duration-200 hover:scale-105">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Agendamentos Pendentes</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bookings.filter((b: any) => b.status === 'pending').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mensagens Novas</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {contacts.filter((c: any) => c.status === 'new').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Testemunhos Pendentes</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {testimonials.filter((t: any) => !t.is_approved).length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Posts do Blog</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{blogPosts.length}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendário</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contacts.slice(0, 5).map((contact: any) => (
                    <div key={contact.id} className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(contact.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos</CardTitle>
              <CardDescription>Gerencie todos os agendamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Novo Agendamento */}
                <Card className="shadow-elegant hover-zoom">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      Novo Agendamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div>
                      <Label>Nome</Label>
                      <Input value={newBooking.client_name} onChange={(e) => setNewBooking(v => ({...v, client_name: e.target.value}))} />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={newBooking.client_email} onChange={(e) => setNewBooking(v => ({...v, client_email: e.target.value}))} />
                    </div>
                    <div>
                      <Label>Telefone</Label>
                      <Input value={newBooking.client_phone} onChange={(e) => setNewBooking(v => ({...v, client_phone: e.target.value}))} />
                    </div>
                    <div>
                      <Label>Tipo de Sessão</Label>
                      <Input value={newBooking.session_type} onChange={(e) => setNewBooking(v => ({...v, session_type: e.target.value}))} />
                    </div>
                    <div>
                      <Label>Data</Label>
                      <Input type="date" value={newBooking.session_date} onChange={(e) => setNewBooking(v => ({...v, session_date: e.target.value}))} />
                    </div>
                    <div>
                      <Label>Hora</Label>
                      <Input type="time" value={newBooking.session_time} onChange={(e) => setNewBooking(v => ({...v, session_time: e.target.value}))} />
                    </div>
                    <div>
                      <Label>Duração (h)</Label>
                      <Input type="number" value={newBooking.duration_hours as any} onChange={(e) => setNewBooking(v => ({...v, duration_hours: e.target.value}))} />
                    </div>
                    <div>
                      <Label>Preço</Label>
                      <Input type="number" step="0.01" value={newBooking.price} onChange={(e) => setNewBooking(v => ({...v, price: e.target.value}))} />
                    </div>
                    <div>
                      <Label>Local</Label>
                      <Input value={newBooking.location} onChange={(e) => setNewBooking(v => ({...v, location: e.target.value}))} />
                    </div>
                    <div className="md:col-span-3">
                      <Label>Notas</Label>
                      <Textarea value={newBooking.notes} onChange={(e) => setNewBooking(v => ({...v, notes: e.target.value}))} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" onClick={createBooking} className="transition-all duration-200 hover:scale-105">
                      Adicionar Agendamento
                    </Button>
                  </div>
                  </CardContent>
                </Card>

                {bookings.map((booking: any, index: any) => (
                  <Card key={booking.id} className="shadow-elegant hover-zoom animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{booking.client_name}</h3>
                        <p className="text-sm text-muted-foreground">{booking.client_email}</p>
                        <p className="text-sm">{booking.session_type}</p>
                      </div>
                      <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {booking.session_date} às {booking.session_time}
                      </div>
                      {booking.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {booking.location}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        size="sm" 
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        disabled={booking.status === 'confirmed'}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        Confirmar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => setEditBooking(booking)}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        Editar
                      </Button>
                    </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Dialogo Edição Agendamento */}
                <Dialog open={!!editBooking} onOpenChange={(open) => { if (!open) setEditBooking(null); }}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Agendamento</DialogTitle>
                    </DialogHeader>
                    {editBooking && (
                      <div className="grid md:grid-cols-3 gap-3">
                        <div>
                          <Label>Nome</Label>
                          <Input value={editBooking.client_name || ''} onChange={(e) => setEditBooking((v:any) => ({...v, client_name: e.target.value}))} />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input value={editBooking.client_email || ''} onChange={(e) => setEditBooking((v:any) => ({...v, client_email: e.target.value}))} />
                        </div>
                        <div>
                          <Label>Telefone</Label>
                          <Input value={editBooking.client_phone || ''} onChange={(e) => setEditBooking((v:any) => ({...v, client_phone: e.target.value}))} />
                        </div>
                        <div>
                          <Label>Tipo de Sessão</Label>
                          <Input value={editBooking.session_type || ''} onChange={(e) => setEditBooking((v:any) => ({...v, session_type: e.target.value}))} />
                        </div>
                        <div>
                          <Label>Data</Label>
                          <Input type="date" value={editBooking.session_date || ''} onChange={(e) => setEditBooking((v:any) => ({...v, session_date: e.target.value}))} />
                        </div>
                        <div>
                          <Label>Hora</Label>
                          <Input type="time" value={editBooking.session_time || ''} onChange={(e) => setEditBooking((v:any) => ({...v, session_time: e.target.value}))} />
                        </div>
                        <div>
                          <Label>Duração (h)</Label>
                          <Input type="number" value={editBooking.duration_hours || 2} onChange={(e) => setEditBooking((v:any) => ({...v, duration_hours: e.target.value}))} />
                        </div>
                        <div>
                          <Label>Preço</Label>
                          <Input type="number" step="0.01" value={editBooking.price ?? ''} onChange={(e) => setEditBooking((v:any) => ({...v, price: e.target.value}))} />
                        </div>
                        <div>
                          <Label>Status</Label>
                          <Input value={editBooking.status || ''} onChange={(e) => setEditBooking((v:any) => ({...v, status: e.target.value}))} />
                        </div>
                        <div>
                          <Label>Pagamento</Label>
                          <Input value={editBooking.payment_status || ''} onChange={(e) => setEditBooking((v:any) => ({...v, payment_status: e.target.value}))} />
                        </div>
                        <div className="md:col-span-3">
                          <Label>Notas</Label>
                          <Textarea value={editBooking.notes || ''} onChange={(e) => setEditBooking((v:any) => ({...v, notes: e.target.value}))} />
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="secondary" onClick={() => setEditBooking(null)}>Cancelar</Button>
                      <Button onClick={saveBookingEdits}>Salvar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="animate-fade-in">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Mensagens de Contato
              </CardTitle>
              <CardDescription>Gerencie todas as mensagens recebidas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contacts.map((contact: any, index: any) => (
                  <Card key={contact.id} className="shadow-elegant hover-zoom animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground">{contact.email}</p>
                        {contact.phone && <p className="text-sm">{contact.phone}</p>}
                      </div>
                      <Badge variant={contact.status === 'responded' ? 'default' : 'secondary'}>
                        {contact.status}
                      </Badge>
                    </div>
                    <p className="text-sm mb-3">{contact.message}</p>
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        size="sm" 
                        onClick={() => updateContactStatus(contact.id, 'responded')}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        Marcar como Respondido
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => setEditContact(contact)}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        Editar
                      </Button>
                    </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Dialogo Edição Contato */}
                <Dialog open={!!editContact} onOpenChange={(open) => { if (!open) setEditContact(null); }}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Contato</DialogTitle>
                    </DialogHeader>
                    {editContact && (
                      <div className="grid md:grid-cols-3 gap-3">
                        <div>
                          <Label>Nome</Label>
                          <Input value={editContact.name || ''} onChange={(e) => setEditContact((v:any) => ({...v, name: e.target.value}))} />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input value={editContact.email || ''} onChange={(e) => setEditContact((v:any) => ({...v, email: e.target.value}))} />
                        </div>
                        <div>
                          <Label>Telefone</Label>
                          <Input value={editContact.phone || ''} onChange={(e) => setEditContact((v:any) => ({...v, phone: e.target.value}))} />
                        </div>
                        <div>
                          <Label>Tipo de Sessão</Label>
                          <Input value={editContact.session_type || ''} onChange={(e) => setEditContact((v:any) => ({...v, session_type: e.target.value}))} />
                        </div>
                        <div>
                          <Label>Status</Label>
                          <Input value={editContact.status || ''} onChange={(e) => setEditContact((v:any) => ({...v, status: e.target.value}))} />
                        </div>
                        <div className="md:col-span-3">
                          <Label>Mensagem</Label>
                          <Textarea value={editContact.message || ''} onChange={(e) => setEditContact((v:any) => ({...v, message: e.target.value}))} />
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="secondary" onClick={() => setEditContact(null)}>Cancelar</Button>
                      <Button onClick={saveContactEdits}>Salvar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials" className="animate-fade-in">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Testemunhos
              </CardTitle>
              <CardDescription>Aprove testemunhos para exibição no site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testimonials.map((testimonial: any, index: any) => (
                  <Card key={testimonial.id} className="shadow-elegant hover-zoom animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{testimonial.client_name}</h3>
                        {testimonial.session_type && (
                          <p className="text-sm text-muted-foreground">{testimonial.session_type}</p>
                        )}
                      </div>
                      <Badge variant={testimonial.is_approved ? 'default' : 'secondary'}>
                        {testimonial.is_approved ? 'Aprovado' : 'Pendente'}
                      </Badge>
                    </div>
                    <p className="text-sm mb-3">"{testimonial.testimonial}"</p>
                    <div className="flex gap-2 flex-wrap">
                      {!testimonial.is_approved && (
                        <Button 
                          size="sm" 
                          onClick={() => approveTestimonial(testimonial.id)}
                          className="transition-all duration-200 hover:scale-105"
                        >
                          Aprovar
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => setEditTestimonial(testimonial)}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        Editar
                      </Button>
                    </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Dialogo Edição Testemunho */}
                <Dialog open={!!editTestimonial} onOpenChange={(open) => { if (!open) setEditTestimonial(null); }}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Testemunho</DialogTitle>
                    </DialogHeader>
                    {editTestimonial && (
                      <div className="grid md:grid-cols-3 gap-3">
                        <div>
                          <Label>Nome</Label>
                          <Input value={editTestimonial.client_name || ''} onChange={(e) => setEditTestimonial((v:any) => ({...v, client_name: e.target.value}))} />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input value={editTestimonial.client_email || ''} onChange={(e) => setEditTestimonial((v:any) => ({...v, client_email: e.target.value}))} />
                        </div>
                        <div>
                          <Label>Tipo de Sessão</Label>
                          <Input value={editTestimonial.session_type || ''} onChange={(e) => setEditTestimonial((v:any) => ({...v, session_type: e.target.value}))} />
                        </div>
                        <div className="md:col-span-3">
                          <Label>Depoimento</Label>
                          <Textarea value={editTestimonial.testimonial || ''} onChange={(e) => setEditTestimonial((v:any) => ({...v, testimonial: e.target.value}))} />
                        </div>
                        <div>
                          <Label>Nota</Label>
                          <Input type="number" min={1} max={5} value={editTestimonial.rating ?? ''} onChange={(e) => setEditTestimonial((v:any) => ({...v, rating: e.target.value}))} />
                        </div>
                        <div>
                          <Label>Aprovado</Label>
                          <Input type="checkbox" checked={!!editTestimonial.is_approved} onChange={(e) => setEditTestimonial((v:any) => ({...v, is_approved: e.target.checked}))} />
                        </div>
                        <div>
                          <Label>Destaque</Label>
                          <Input type="checkbox" checked={!!editTestimonial.is_featured} onChange={(e) => setEditTestimonial((v:any) => ({...v, is_featured: e.target.checked}))} />
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="secondary" onClick={() => setEditTestimonial(null)}>Cancelar</Button>
                      <Button onClick={saveTestimonialEdits}>Salvar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blog">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Criar Novo Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="blog-title">Título</Label>
                    <Input
                      id="blog-title"
                      value={newBlogPost.title}
                      onChange={(e) => setNewBlogPost(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="blog-slug">Slug (URL)</Label>
                    <Input
                      id="blog-slug"
                      value={newBlogPost.slug}
                      onChange={(e) => setNewBlogPost(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="Deixe vazio para gerar automaticamente"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="blog-excerpt">Resumo</Label>
                  <Textarea
                    id="blog-excerpt"
                    value={newBlogPost.excerpt}
                    onChange={(e) => setNewBlogPost(prev => ({ ...prev, excerpt: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="blog-content">Conteúdo</Label>
                  <Textarea
                    id="blog-content"
                    value={newBlogPost.content}
                    onChange={(e) => setNewBlogPost(prev => ({ ...prev, content: e.target.value }))}
                    rows={8}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="blog-tags">Tags (separadas por vírgula)</Label>
                    <Input
                      id="blog-tags"
                      value={newBlogPost.tags}
                      onChange={(e) => setNewBlogPost(prev => ({ ...prev, tags: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="blog-image">URL da Imagem</Label>
                    <Input
                      id="blog-image"
                      value={newBlogPost.featured_image}
                      onChange={(e) => setNewBlogPost(prev => ({ ...prev, featured_image: e.target.value }))}
                    />
                  </div>
                </div>

                <Button onClick={createBlogPost}>Criar Post</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Posts Existentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blogPosts.map((post: any) => (
                    <div key={post.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{post.title}</h3>
                          <p className="text-sm text-muted-foreground">{post.category}</p>
                          <p className="text-sm">{formatDate(post.created_at)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={post.is_published ? 'default' : 'secondary'}>
                            {post.is_published ? 'Publicado' : 'Rascunho'}
                          </Badge>
                          <Button size="sm" variant="secondary" onClick={() => setEditPost(post)}>Editar</Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Dialogo Edição Post */}
                  <Dialog open={!!editPost} onOpenChange={(open) => { if (!open) setEditPost(null); }}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Post</DialogTitle>
                      </DialogHeader>
                      {editPost && (
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <Label>Título</Label>
                            <Input value={editPost.title || ''} onChange={(e) => setEditPost((v:any) => ({...v, title: e.target.value}))} />
                          </div>
                          <div>
                            <Label>Slug</Label>
                            <Input value={editPost.slug || ''} onChange={(e) => setEditPost((v:any) => ({...v, slug: e.target.value}))} />
                          </div>
                          <div className="md:col-span-2">
                            <Label>Resumo</Label>
                            <Textarea value={editPost.excerpt || ''} onChange={(e) => setEditPost((v:any) => ({...v, excerpt: e.target.value}))} />
                          </div>
                          <div className="md:col-span-2">
                            <Label>Conteúdo</Label>
                            <Textarea rows={8} value={editPost.content || ''} onChange={(e) => setEditPost((v:any) => ({...v, content: e.target.value}))} />
                          </div>
                          <div>
                            <Label>Categoria</Label>
                            <Input value={editPost.category || ''} onChange={(e) => setEditPost((v:any) => ({...v, category: e.target.value}))} />
                          </div>
                          <div>
                            <Label>Imagem</Label>
                            <Input value={editPost.featured_image || ''} onChange={(e) => setEditPost((v:any) => ({...v, featured_image: e.target.value}))} />
                          </div>
                          <div>
                            <Label>Publicado</Label>
                            <Input type="checkbox" checked={!!editPost.is_published} onChange={(e) => setEditPost((v:any) => ({...v, is_published: e.target.checked}))} />
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button variant="secondary" onClick={() => setEditPost(null)}>Cancelar</Button>
                        <Button onClick={savePostEdits}>Salvar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="portfolio">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Criar Nova Sessão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="portfolio-title">Título</Label>
                    <Input
                      id="portfolio-title"
                      value={newPortfolioSession.title}
                      onChange={(e) => setNewPortfolioSession(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="portfolio-category">Categoria</Label>
                    <select
                      id="portfolio-category"
                      value={newPortfolioSession.category}
                      onChange={(e) => setNewPortfolioSession(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Casais">Casais</option>
                      <option value="Maternidade">Maternidade</option>
                      <option value="Família">Família</option>
                      <option value="Individual">Individual</option>
                      <option value="Corporativo">Corporativo</option>
                      <option value="Eventos">Eventos</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="portfolio-description">Descrição</Label>
                  <Textarea
                    id="portfolio-description"
                    value={newPortfolioSession.description}
                    onChange={(e) => setNewPortfolioSession(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="portfolio-date">Data da Sessão</Label>
                    <Input
                      id="portfolio-date"
                      type="date"
                      value={newPortfolioSession.session_date}
                      onChange={(e) => setNewPortfolioSession(prev => ({ ...prev, session_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="portfolio-location">Local</Label>
                    <Input
                      id="portfolio-location"
                      value={newPortfolioSession.location}
                      onChange={(e) => setNewPortfolioSession(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="portfolio-cover">URL da Capa</Label>
                    <Input
                      id="portfolio-cover"
                      value={newPortfolioSession.cover_image}
                      onChange={(e) => setNewPortfolioSession(prev => ({ ...prev, cover_image: e.target.value }))}
                    />
                  </div>
                </div>

                <Button onClick={createPortfolioSession}>Criar Sessão</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sessões Existentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioSessions.map((session: any) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{session.title}</h3>
                          <p className="text-sm text-muted-foreground">{session.category}</p>
                          {session.session_date && (
                            <p className="text-sm">{formatDate(session.session_date)}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={session.is_published ? 'default' : 'secondary'}>
                            {session.is_published ? 'Publicado' : 'Rascunho'}
                          </Badge>
                          <Button size="sm" variant="secondary" onClick={() => setEditSession(session)}>Editar</Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Dialogo Edição Sessão */}
                  <Dialog open={!!editSession} onOpenChange={(open) => { if (!open) setEditSession(null); }}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Sessão</DialogTitle>
                      </DialogHeader>
                      {editSession && (
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <Label>Título</Label>
                            <Input value={editSession.title || ''} onChange={(e) => setEditSession((v:any) => ({...v, title: e.target.value}))} />
                          </div>
                          <div>
                            <Label>Slug</Label>
                            <Input value={editSession.slug || ''} onChange={(e) => setEditSession((v:any) => ({...v, slug: e.target.value}))} />
                          </div>
                          <div>
                            <Label>Categoria</Label>
                            <Input value={editSession.category || ''} onChange={(e) => setEditSession((v:any) => ({...v, category: e.target.value}))} />
                          </div>
                          <div>
                            <Label>Local</Label>
                            <Input value={editSession.location || ''} onChange={(e) => setEditSession((v:any) => ({...v, location: e.target.value}))} />
                          </div>
                          <div>
                            <Label>Data</Label>
                            <Input type="date" value={editSession.session_date || ''} onChange={(e) => setEditSession((v:any) => ({...v, session_date: e.target.value}))} />
                          </div>
                          <div className="md:col-span-2">
                            <Label>Descrição</Label>
                            <Textarea value={editSession.description || ''} onChange={(e) => setEditSession((v:any) => ({...v, description: e.target.value}))} />
                          </div>
                          <div className="md:col-span-2">
                            <Label>Imagem de Capa</Label>
                            <Input value={editSession.cover_image || ''} onChange={(e) => setEditSession((v:any) => ({...v, cover_image: e.target.value}))} />
                          </div>
                          <div>
                            <Label>Publicado</Label>
                            <Input type="checkbox" checked={!!editSession.is_published} onChange={(e) => setEditSession((v:any) => ({...v, is_published: e.target.checked}))} />
                          </div>
                          <div>
                            <Label>Destaque</Label>
                            <Input type="checkbox" checked={!!editSession.is_featured} onChange={(e) => setEditSession((v:any) => ({...v, is_featured: e.target.checked}))} />
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button variant="secondary" onClick={() => setEditSession(null)}>Cancelar</Button>
                        <Button onClick={saveSessionEdits}>Salvar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Site</CardTitle>
              <CardDescription>Configure textos e links do site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hero-title">Título Principal</Label>
                  <Input
                    id="hero-title"
                    value={settings.hero_title || ""}
                    onChange={(e) => updateSetting("hero_title", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="hero-subtitle">Subtítulo</Label>
                  <Input
                    id="hero-subtitle"
                    value={settings.hero_subtitle || ""}
                    onChange={(e) => updateSetting("hero_subtitle", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="contact-title">Título da Seção de Contato</Label>
                  <Input
                    id="contact-title"
                    value={settings.contact_title || ""}
                    onChange={(e) => updateSetting("contact_title", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="contact-description">Descrição da Seção de Contato</Label>
                  <Textarea
                    id="contact-description"
                    value={settings.contact_description || ""}
                    onChange={(e) => updateSetting("contact_description", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Links das Redes Sociais</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={settings.social_links?.instagram || ""}
                        onChange={(e) => updateSetting("social_links", {
                          ...settings.social_links,
                          instagram: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        value={settings.social_links?.facebook || ""}
                        onChange={(e) => updateSetting("social_links", {
                          ...settings.social_links,
                          facebook: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        value={settings.social_links?.whatsapp || ""}
                        onChange={(e) => updateSetting("social_links", {
                          ...settings.social_links,
                          whatsapp: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={settings.social_links?.email || ""}
                        onChange={(e) => updateSetting("social_links", {
                          ...settings.social_links,
                          email: e.target.value
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAdminPanel;