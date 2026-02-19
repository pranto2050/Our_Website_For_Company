import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Lightbulb, 
  Shield, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const founders = [
  { name: "Alex Thompson", role: "CEO & Founder", initial: "AT" },
  { name: "Brian Mitchell", role: "CTO", initial: "BM" },
  { name: "Chris Anderson", role: "Head of Design", initial: "CA" },
  { name: "Daniel Roberts", role: "Head of Development", initial: "DR" },
  { name: "Edward Wilson", role: "Head of Operations", initial: "EW" },
];

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We embrace new technologies and creative solutions to stay ahead.",
  },
  {
    icon: Shield,
    title: "Integrity",
    description: "Transparency and honesty are at the core of everything we do.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We work closely with clients as true partners in their success.",
  },
  {
    icon: Heart,
    title: "Excellence",
    description: "We never settle for less than exceptional quality in our deliverables.",
  },
];

const milestones = [
  { year: "2016", event: "ABIT Solutions founded by 5 friends" },
  { year: "2018", event: "Expanded to 25+ team members" },
  { year: "2020", event: "Launched global remote operations" },
  { year: "2022", event: "Reached 500+ satisfied clients" },
  { year: "2024", event: "Celebrating 8 years of excellence" },
];

export default function About() {
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
                About Us
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                We Build Digital <span className="text-accent">Experiences</span> That Matter
              </h1>
              <p className="text-lg text-primary-foreground/80 max-w-2xl">
                Founded by five passionate friends in 2016, ABIT Solutions has grown into a 
                trusted technology partner for businesses worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                  Our Story
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  From Friends to Industry Leaders
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    ABIT Solutions was born from a shared vision among five friends who believed 
                    that technology should be accessible, beautiful, and impactful. What started 
                    in a small home office has grown into a globally recognized IT services company.
                  </p>
                  <p>
                    Our journey has been fueled by an unwavering commitment to client success and 
                    a passion for innovation. We've helped hundreds of businesses transform their 
                    digital presence and streamline their operations.
                  </p>
                  <p>
                    Today, we operate as a fully remote team, serving clients across the globe 
                    while maintaining the collaborative spirit and dedication that defined our 
                    early days.
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-secondary/30 rounded-2xl p-8">
                <h3 className="text-xl font-semibold mb-6">Our Journey</h3>
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div key={milestone.year} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                          <span className="font-bold text-accent">{milestone.year}</span>
                        </div>
                        {index < milestones.length - 1 && (
                          <div className="w-0.5 h-full bg-accent/20 mt-2" />
                        )}
                      </div>
                      <div className="pt-3">
                        <p className="font-medium">{milestone.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="section-padding bg-secondary/30">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="service-card">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  To be the world's most trusted technology partner, empowering businesses 
                  of all sizes to thrive in the digital age through innovative solutions 
                  and exceptional service.
                </p>
              </div>

              <div className="service-card">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To deliver transformative digital solutions that drive measurable results, 
                  built on a foundation of trust, transparency, and technical excellence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                Core Values
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                The Principles That Guide Us
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div key={value.title} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3">{value.title}</h4>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section id="team" className="section-padding bg-secondary/30">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                Leadership
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Meet Our Founders
              </h2>
              <p className="text-muted-foreground">
                Five friends united by a passion for technology and a vision to create something extraordinary.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {founders.map((founder) => (
                <div key={founder.name} className="text-center">
                  <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-accent">{founder.initial}</span>
                  </div>
                  <h4 className="font-semibold">{founder.name}</h4>
                  <p className="text-sm text-muted-foreground">{founder.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why We Exist */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                  Our Purpose
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Why We Exist
                </h2>
                <p className="text-muted-foreground mb-8">
                  We believe every business deserves access to world-class technology solutions. 
                  Our purpose is to bridge the gap between complex technology and practical 
                  business outcomes.
                </p>
                
                <ul className="space-y-4">
                  {[
                    "Make premium technology accessible to all businesses",
                    "Simplify digital transformation with expert guidance",
                    "Build lasting partnerships, not just projects",
                    "Deliver measurable impact on business growth",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-accent shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-3xl p-8 md:p-12">
                <h3 className="text-2xl font-bold mb-4">Future Goals</h3>
                <p className="text-muted-foreground mb-6">
                  As we look ahead, we're committed to expanding our impact while staying true 
                  to our founding principles. Our goals include:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    Expand our global team to 100+ experts
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    Launch an academy for emerging tech talent
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    Develop proprietary tools for client success
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    Achieve carbon-neutral operations by 2025
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-secondary/30">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Work With Us?
              </h2>
              <p className="text-muted-foreground mb-8">
                Join hundreds of satisfied clients who have transformed their businesses with our help.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="accent" size="lg" asChild>
                  <Link to="/contact">
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/services">View Services</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
