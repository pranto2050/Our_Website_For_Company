import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Palette, 
  Code2, 
  Cpu, 
  Smartphone, 
  TrendingUp, 
  Layers, 
  Globe, 
  Headphones,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const services = [
  {
    id: "web-design",
    icon: Palette,
    title: "Website Design",
    description: "Create stunning, user-centric designs that captivate your audience and drive conversions. We blend aesthetics with functionality to deliver memorable digital experiences.",
    tools: ["Figma", "Adobe XD", "Sketch", "InVision", "Photoshop"],
    benefits: [
      "Custom, brand-aligned designs",
      "Mobile-first responsive layouts",
      "Conversion-optimized interfaces",
      "Interactive prototypes",
    ],
    useCases: ["Corporate websites", "E-commerce stores", "Landing pages", "Web applications"],
  },
  {
    id: "web-development",
    icon: Code2,
    title: "Website Development",
    description: "Build robust, scalable web applications using cutting-edge technologies. Our full-stack expertise ensures your website performs flawlessly across all devices.",
    tools: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    benefits: [
      "Fast, optimized performance",
      "Secure architecture",
      "SEO-friendly code",
      "Easy content management",
    ],
    useCases: ["Business websites", "E-commerce platforms", "Web portals", "Custom CMS"],
  },
  {
    id: "software-development",
    icon: Cpu,
    title: "Software Development",
    description: "Custom software solutions tailored to your unique business requirements. We develop applications that streamline operations and drive efficiency.",
    tools: ["Python", "Java", "C#", ".NET", "Cloud Services"],
    benefits: [
      "Tailored to your workflow",
      "Scalable architecture",
      "Integration ready",
      "Ongoing support",
    ],
    useCases: ["ERP systems", "CRM solutions", "Inventory management", "Automation tools"],
  },
  {
    id: "android-development",
    icon: Smartphone,
    title: "Android App Development",
    description: "Native Android applications that deliver exceptional user experiences. From concept to Play Store, we handle the entire development lifecycle.",
    tools: ["Kotlin", "Java", "Android Studio", "Firebase", "REST APIs"],
    benefits: [
      "Native performance",
      "Material Design",
      "Offline capabilities",
      "Push notifications",
    ],
    useCases: ["Business apps", "E-commerce apps", "Social platforms", "Utility apps"],
  },
  {
    id: "digital-marketing",
    icon: TrendingUp,
    title: "Digital Marketing & SEO",
    description: "Data-driven strategies to boost your online presence and search rankings. We help you reach your target audience and convert visitors into customers.",
    tools: ["Google Analytics", "SEMrush", "Ahrefs", "Google Ads", "Meta Ads"],
    benefits: [
      "Increased organic traffic",
      "Higher search rankings",
      "Better conversion rates",
      "Measurable ROI",
    ],
    useCases: ["SEO campaigns", "PPC advertising", "Content marketing", "Social media marketing"],
  },
  {
    id: "ui-ux-design",
    icon: Layers,
    title: "UI/UX Design",
    description: "Intuitive interfaces that delight users and enhance engagement. We combine research, strategy, and creativity to design experiences that users love.",
    tools: ["Figma", "Maze", "Hotjar", "UserTesting", "Principle"],
    benefits: [
      "User-centered approach",
      "Data-backed decisions",
      "Reduced development costs",
      "Increased user satisfaction",
    ],
    useCases: ["App redesigns", "Product design", "Design systems", "Usability testing"],
  },
  {
    id: "graphic-design",
    icon: Globe,
    title: "Graphic Design",
    description: "Creative visual solutions that strengthen your brand identity. From logos to marketing materials, we bring your vision to life with stunning graphics.",
    tools: ["Adobe Illustrator", "Photoshop", "InDesign", "After Effects", "Canva Pro"],
    benefits: [
      "Consistent brand identity",
      "Professional quality",
      "Multi-format delivery",
      "Quick turnaround",
    ],
    useCases: ["Brand identity", "Marketing collateral", "Social media graphics", "Print design"],
  },
  {
    id: "technical-support",
    icon: Headphones,
    title: "Technical Support",
    description: "24/7 expert support to keep your systems running smoothly. Our dedicated team ensures minimal downtime and maximum productivity.",
    tools: ["Zendesk", "Jira", "Slack", "TeamViewer", "Custom Ticketing"],
    benefits: [
      "24/7 availability",
      "Fast response times",
      "Expert technicians",
      "Proactive monitoring",
    ],
    useCases: ["IT helpdesk", "System maintenance", "Troubleshooting", "Performance monitoring"],
  },
];

export default function Services() {
  return (
    <div className="min-h-screen cursor-default">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="hero-gradient pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-72 h-72 bg-accent rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/50 rounded-full blur-3xl" />
          </div>
          
          <div className="container-custom relative z-10">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium mb-6">
                Our Services
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                End-to-End Digital <span className="text-accent">Solutions</span>
              </h1>
              <p className="text-lg text-primary-foreground/80 max-w-2xl">
                From concept to deployment and beyond, we provide comprehensive services 
                to transform your digital vision into reality.
              </p>
            </div>
          </div>
        </section>

        {/* Services List */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="space-y-24">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  id={service.id}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                      <service.icon className="w-8 h-8 text-accent" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                      {service.title}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                      {service.description}
                    </p>

                    {/* Benefits */}
                    <div className="mb-8">
                      <h4 className="font-semibold mb-4">Key Benefits</h4>
                      <ul className="grid sm:grid-cols-2 gap-3">
                        {service.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-accent" />
                            <span className="text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button variant="accent" asChild>
                      <Link to="/contact">
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                    <div className="bg-secondary/50 rounded-2xl p-8">
                      {/* Tools */}
                      <div className="mb-8">
                        <h4 className="font-semibold mb-4">Tools & Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.tools.map((tool) => (
                            <span
                              key={tool}
                              className="px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Use Cases */}
                      <div>
                        <h4 className="font-semibold mb-4">Use Cases</h4>
                        <ul className="space-y-2">
                          {service.useCases.map((useCase) => (
                            <li key={useCase} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                              {useCase}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding hero-gradient relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 bg-accent rounded-full blur-3xl" />
          </div>
          
          <div className="container-custom relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help you achieve your goals. Get in touch for a free consultation.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">
                Contact Us Today
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
