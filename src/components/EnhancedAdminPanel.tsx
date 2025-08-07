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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="bookings">Agendamentos</TabsTrigger>
          <TabsTrigger value="contacts">Contatos</TabsTrigger>
          <TabsTrigger value="testimonials">Testemunhos</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
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
                {bookings.map((booking: any) => (
                  <div key={booking.id} className="border rounded-lg p-4">
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
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        disabled={booking.status === 'confirmed'}
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
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Mensagens de Contato</CardTitle>
              <CardDescription>Gerencie todas as mensagens recebidas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contacts.map((contact: any) => (
                  <div key={contact.id} className="border rounded-lg p-4">
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
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => updateContactStatus(contact.id, 'responded')}
                      >
                        Marcar como Respondido
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials">
          <Card>
            <CardHeader>
              <CardTitle>Testemunhos</CardTitle>
              <CardDescription>Aprove testemunhos para exibição no site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testimonials.map((testimonial: any) => (
                  <div key={testimonial.id} className="border rounded-lg p-4">
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
                    {!testimonial.is_approved && (
                      <Button 
                        size="sm" 
                        onClick={() => approveTestimonial(testimonial.id)}
                      >
                        Aprovar
                      </Button>
                    )}
                  </div>
                ))}
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
                        <Badge variant={post.is_published ? 'default' : 'secondary'}>
                          {post.is_published ? 'Publicado' : 'Rascunho'}
                        </Badge>
                      </div>
                    </div>
                  ))}
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
                        <Badge variant={session.is_published ? 'default' : 'secondary'}>
                          {session.is_published ? 'Publicado' : 'Rascunho'}
                        </Badge>
                      </div>
                    </div>
                  ))}
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