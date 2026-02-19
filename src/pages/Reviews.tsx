import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Star, Quote, ArrowRight, CheckCircle } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "CEO",
    company: "TechStart Inc",
    content: "ABIT Solutions transformed our online presence completely. Their team delivered a stunning website that increased our conversions by 150%. The attention to detail and professionalism exceeded all expectations. They truly understood our vision and brought it to life.",
    rating: 5,
    avatar: "SJ",
    project: "E-commerce Platform Redesign",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Founder",
    company: "GrowthLabs",
    content: "Working with ABIT was a game-changer for our startup. They built our entire platform from scratch and the quality was exceptional. Their support team is incredibly responsive and helpful. We've continued working with them for all our development needs.",
    rating: 5,
    avatar: "MC",
    project: "SaaS Platform Development",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "Nexus Corp",
    content: "The SEO and digital marketing services from ABIT Solutions helped us rank #1 for our key terms. Our organic traffic increased by 300% in just 6 months. Their data-driven approach and regular reporting kept us informed every step of the way.",
    rating: 5,
    avatar: "ER",
    project: "SEO & Digital Marketing",
  },
  {
    id: 4,
    name: "David Park",
    role: "CTO",
    company: "InnovateTech",
    content: "The custom software solution ABIT developed streamlined our operations significantly. Their technical expertise and understanding of our business needs was impressive. The application has saved us countless hours and improved our team's productivity.",
    rating: 5,
    avatar: "DP",
    project: "Custom ERP System",
  },
  {
    id: 5,
    name: "Amanda Foster",
    role: "Product Manager",
    company: "Digital Wave",
    content: "The mobile app ABIT built for us has received amazing feedback from our users. The UI/UX design is intuitive and beautiful. They handled everything from concept to Play Store launch seamlessly.",
    rating: 5,
    avatar: "AF",
    project: "Android App Development",
  },
  {
    id: 6,
    name: "Robert Kim",
    role: "Operations Manager",
    company: "CloudScale",
    content: "Their technical support service has been invaluable to our company. 24/7 availability, quick response times, and expert solutions. ABIT truly treats our issues as their own priorities.",
    rating: 5,
    avatar: "RK",
    project: "Ongoing Technical Support",
  },
];

const stats = [
  { value: "98%", label: "Client Satisfaction" },
  { value: "500+", label: "Happy Clients" },
  { value: "4.9/5", label: "Average Rating" },
  { value: "95%", label: "Repeat Clients" },
];

export default function Reviews() {
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
                Customer Reviews
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Trusted by <span className="text-accent">500+</span> Clients Worldwide
              </h1>
              <p className="text-lg text-primary-foreground/80">
                Don't just take our word for it. See what our clients have to say about 
                their experience working with ABIT Solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-background border-b border-border">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-shadow"
                >
                  <Quote className="w-10 h-10 text-accent/20 mb-4" />
                  
                  <p className="text-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                    ))}
                  </div>

                  {/* Project Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium mb-6">
                    <CheckCircle className="w-3 h-3" />
                    {testimonial.project}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="font-semibold text-accent">
                        {testimonial.avatar}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-secondary/30">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Join Our Success Stories?
              </h2>
              <p className="text-muted-foreground mb-8">
                Let's discuss how we can help you achieve similar results for your business.
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
