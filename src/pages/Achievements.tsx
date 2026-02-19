import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Award, 
  Trophy, 
  Star, 
  Target, 
  Rocket,
  ArrowRight,
  CheckCircle2,
  TrendingUp
} from "lucide-react";

const awards = [
  {
    icon: Trophy,
    title: "Best IT Services Provider 2023",
    organization: "Global Tech Awards",
    year: "2023",
  },
  {
    icon: Award,
    title: "Excellence in Web Development",
    organization: "Digital Innovation Summit",
    year: "2023",
  },
  {
    icon: Star,
    title: "Top 10 Software Companies",
    organization: "Tech Review Magazine",
    year: "2022",
  },
  {
    icon: Trophy,
    title: "Customer Service Excellence",
    organization: "Business Excellence Awards",
    year: "2022",
  },
];

const certifications = [
  "ISO 27001 Certified",
  "Google Partner",
  "AWS Certified Partner",
  "Microsoft Silver Partner",
  "Meta Business Partner",
  "Clutch Top Developer",
];

const milestones = [
  {
    number: "500+",
    title: "Clients Served",
    description: "Businesses worldwide trust us",
  },
  {
    number: "1,200+",
    title: "Projects Completed",
    description: "Successfully delivered",
  },
  {
    number: "8+",
    title: "Years of Excellence",
    description: "In the industry",
  },
  {
    number: "98%",
    title: "Client Retention",
    description: "Return customers",
  },
];

const notableProjects = [
  {
    title: "Enterprise E-commerce Platform",
    client: "Fortune 500 Retailer",
    impact: "200% increase in online sales",
    tech: ["React", "Node.js", "AWS"],
  },
  {
    title: "Healthcare Management System",
    client: "Leading Hospital Chain",
    impact: "50% reduction in admin time",
    tech: ["Python", "PostgreSQL", "Docker"],
  },
  {
    title: "Fintech Mobile Application",
    client: "Digital Banking Startup",
    impact: "1M+ downloads in first year",
    tech: ["Kotlin", "Firebase", "REST APIs"],
  },
  {
    title: "AI-Powered Analytics Dashboard",
    client: "Marketing Agency",
    impact: "3x faster reporting",
    tech: ["React", "Python", "TensorFlow"],
  },
];

export default function Achievements() {
  return (
    <div className="min-h-screen cursor-default">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="hero-gradient pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-72 h-72 bg-accent rounded-full blur-3xl" />
          </div>
          
          <div className="container-custom relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium mb-6">
                Our Achievements
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                A Track Record of <span className="text-accent">Excellence</span>
              </h1>
              <p className="text-lg text-primary-foreground/80">
                Celebrating milestones, awards, and the impact we've made for our clients 
                over the years.
              </p>
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section className="py-16 bg-background">
          <div className="container-custom">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {milestones.map((milestone) => (
                <div key={milestone.title} className="text-center">
                  <p className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                    {milestone.number}
                  </p>
                  <p className="font-semibold mb-1">{milestone.title}</p>
                  <p className="text-sm text-muted-foreground">{milestone.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Awards Section */}
        <section className="section-padding bg-secondary/30">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                Recognition
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Awards & Recognition</h2>
              <p className="text-muted-foreground">
                Our commitment to excellence has been recognized by leading industry organizations.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {awards.map((award) => (
                <div
                  key={award.title}
                  className="bg-card rounded-2xl p-6 border border-border text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <award.icon className="w-8 h-8 text-accent" />
                  </div>
                  <p className="text-sm text-accent font-medium mb-2">{award.year}</p>
                  <h4 className="font-semibold mb-2">{award.title}</h4>
                  <p className="text-sm text-muted-foreground">{award.organization}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                Certifications
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Industry Certifications</h2>
              <p className="text-muted-foreground">
                We maintain the highest standards through recognized certifications and partnerships.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {certifications.map((cert) => (
                <div
                  key={cert}
                  className="flex items-center gap-2 px-6 py-3 bg-card rounded-full border border-border"
                >
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  <span className="font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Notable Projects */}
        <section className="section-padding bg-secondary/30">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                Case Studies
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Notable Projects</h2>
              <p className="text-muted-foreground">
                Highlighted projects that showcase our capabilities and impact.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {notableProjects.map((project) => (
                <div
                  key={project.title}
                  className="bg-card rounded-2xl p-8 border border-border"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-semibold mb-1">{project.title}</h4>
                      <p className="text-sm text-muted-foreground">{project.client}</p>
                    </div>
                    <Rocket className="w-6 h-6 text-accent" />
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    <span className="font-medium text-accent">{project.impact}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Create Your Success Story?
              </h2>
              <p className="text-muted-foreground mb-8">
                Join our growing list of satisfied clients and let us help you achieve your goals.
              </p>
              <Button variant="accent" size="lg" asChild>
                <Link to="/contact">
                  Start Your Project
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
