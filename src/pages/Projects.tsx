import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { OrderModal } from "@/components/projects/OrderModal";
import {
  ExternalLink,
  ShoppingCart,
  Sparkles,
  Code,
  Smartphone,
  Globe,
  Palette,
  BarChart3,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  service_type: string;
  status: string;
  tier: string;
  total_amount: number;
  features: string[];
}

// Sample showcase projects (these would typically come from a separate table)
const showcaseProjects: Project[] = [
  {
    id: "showcase-1",
    title: "E-Commerce Platform",
    description: "A fully-featured online shopping platform with payment integration, inventory management, and customer analytics dashboard.",
    image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    service_type: "Web Development",
    status: "completed",
    tier: "premium",
    total_amount: 5000,
    features: ["Payment Gateway", "Admin Dashboard", "Mobile Responsive", "SEO Optimized"],
  },
  {
    id: "showcase-2",
    title: "Healthcare Mobile App",
    description: "Patient management system with appointment scheduling, telemedicine features, and secure health record storage.",
    image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
    service_type: "Mobile Development",
    status: "completed",
    tier: "premium",
    total_amount: 8000,
    features: ["Real-time Chat", "Video Calls", "Push Notifications", "HIPAA Compliant"],
  },
  {
    id: "showcase-3",
    title: "Corporate Website",
    description: "Modern corporate website with CMS integration, multilingual support, and lead generation features.",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    service_type: "Web Design",
    status: "completed",
    tier: "normal",
    total_amount: 2500,
    features: ["CMS Integration", "Contact Forms", "Blog System", "Analytics"],
  },
  {
    id: "showcase-4",
    title: "Restaurant Ordering System",
    description: "Complete digital ordering solution with menu management, online payments, and kitchen display system.",
    image_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
    service_type: "Software Development",
    status: "completed",
    tier: "normal",
    total_amount: 4000,
    features: ["Online Ordering", "Table Reservations", "Loyalty Program", "Kitchen Display"],
  },
  {
    id: "showcase-5",
    title: "Fitness Tracking App",
    description: "Personal fitness companion with workout tracking, nutrition planning, and social features.",
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    service_type: "Mobile Development",
    status: "completed",
    tier: "basic",
    total_amount: 3000,
    features: ["Workout Plans", "Progress Tracking", "Social Feed", "Apple Health Integration"],
  },
  {
    id: "showcase-6",
    title: "Real Estate Portal",
    description: "Property listing platform with virtual tours, mortgage calculator, and agent management system.",
    image_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
    service_type: "Web Development",
    status: "completed",
    tier: "premium",
    total_amount: 7000,
    features: ["Virtual Tours", "Map Integration", "Lead Management", "MLS Integration"],
  },
];

const serviceIcons: Record<string, React.ElementType> = {
  "Web Development": Code,
  "Mobile Development": Smartphone,
  "Web Design": Globe,
  "Software Development": Sparkles,
  "UI/UX Design": Palette,
  "Digital Marketing": BarChart3,
};

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleOrder = (project: Project) => {
    setSelectedProject(project);
    setIsOrderModalOpen(true);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "premium":
        return "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0";
      case "normal":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0";
      default:
        return "bg-gradient-to-r from-slate-500 to-slate-600 text-white border-0";
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          <div className="container-custom relative">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20">
                Our Portfolio
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our Completed Projects
              </h1>
              <p className="text-lg text-white/80">
                Explore our portfolio of successful projects. Each project showcases our commitment 
                to quality and innovation. Ready to start your own? Place an order today!
              </p>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-20 bg-background">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {showcaseProjects.map((project) => {
                const ServiceIcon = serviceIcons[project.service_type] || Code;

                return (
                  <Card
                    key={project.id}
                    className="group overflow-hidden border-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <Badge
                        className={`absolute top-4 right-4 ${getTierColor(project.tier)} capitalize`}
                      >
                        {project.tier}
                      </Badge>
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                          <ServiceIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white text-sm font-medium">
                          {project.service_type}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.features.slice(0, 3).map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {project.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.features.length - 3} more
                          </Badge>
                        )}
                      </div>

                      {/* Price */}
                      <div className="mb-6">
                        <span className="text-sm text-muted-foreground">Starting from</span>
                        <p className="text-2xl font-bold text-accent">
                          ${project.total_amount.toLocaleString()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1 group/btn"
                          onClick={() =>
                            window.open(`https://demo.example.com/${project.id}`, "_blank")
                          }
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Live Demo
                        </Button>
                        <Button
                          className="flex-1 bg-gradient-to-r from-accent to-primary hover:opacity-90"
                          onClick={() => handleOrder(project)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Order Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-12 border border-border">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Have a Custom Project in Mind?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                  Don't see exactly what you need? We specialize in custom solutions tailored 
                  to your unique requirements. Let's discuss your vision!
                </p>
                <Button size="lg" className="px-8" asChild>
                  <a href="/contact">Get Custom Quote</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <OrderModal
        project={selectedProject}
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          setSelectedProject(null);
        }}
      />
    </div>
  );
};

export default Projects;
