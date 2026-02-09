import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { 
  Search, 
  FileText, 
  MessageCircle, 
  HelpCircle,
  BookOpen,
  LifeBuoy,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const supportCategories = [
  {
    icon: FileText,
    title: "Documentation",
    description: "Browse our comprehensive guides and tutorials",
    href: "#docs",
  },
  {
    icon: HelpCircle,
    title: "FAQs",
    description: "Find answers to commonly asked questions",
    href: "#faqs",
  },
  {
    icon: MessageCircle,
    title: "Submit Ticket",
    description: "Get help from our support team",
    href: "#submit-ticket",
  },
  {
    icon: LifeBuoy,
    title: "Live Chat",
    description: "Chat with us in real-time",
    href: "#live-chat",
  },
];

const knowledgeBase = [
  {
    category: "Getting Started",
    articles: [
      "How to onboard as a new client",
      "Understanding your dashboard",
      "Setting up your first project",
      "Payment and billing overview",
    ],
  },
  {
    category: "Project Management",
    articles: [
      "Tracking project progress",
      "Communicating with your team",
      "Requesting changes or revisions",
      "Approving deliverables",
    ],
  },
  {
    category: "Technical Support",
    articles: [
      "Troubleshooting common issues",
      "Browser compatibility",
      "Performance optimization tips",
      "Security best practices",
    ],
  },
];

const faqs = [
  {
    question: "How do I get started with ABIT Solutions?",
    answer: "Getting started is easy! Simply contact us through our contact form or schedule a consultation. We'll discuss your project requirements, provide a detailed proposal, and once approved, we'll begin the development process.",
  },
  {
    question: "What is your typical project timeline?",
    answer: "Project timelines vary based on scope and complexity. A simple website might take 2-4 weeks, while complex applications can take 2-6 months. We provide detailed timelines during the proposal phase.",
  },
  {
    question: "Do you provide ongoing support after project completion?",
    answer: "Yes! We offer comprehensive post-launch support packages including maintenance, updates, bug fixes, and 24/7 technical support. We're committed to your long-term success.",
  },
  {
    question: "What technologies do you work with?",
    answer: "We work with a wide range of modern technologies including React, Next.js, Node.js, Python, Java, Kotlin for Android, and various cloud platforms. We select the best stack for each project's needs.",
  },
  {
    question: "How do you handle project communication?",
    answer: "We use a combination of project management tools, regular video calls, and our client portal for seamless communication. You'll have a dedicated project manager as your primary point of contact.",
  },
  {
    question: "What is your payment structure?",
    answer: "We typically work with a milestone-based payment structure. This usually includes an initial deposit, progress payments at key milestones, and final payment upon project completion.",
  },
];

export default function Support() {
  return (
    <div className="min-h-screen">
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
                Support Center
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                How Can We <span className="text-accent">Help</span> You?
              </h1>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Search our knowledge base or browse categories to find the answers you need.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for help articles..."
                  className="pl-12 h-14 text-lg bg-card border-border"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Support Categories */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportCategories.map((category) => (
                <a
                  key={category.title}
                  href={category.href}
                  className="service-card group text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent transition-colors">
                    <category.icon className="w-7 h-7 text-accent group-hover:text-accent-foreground transition-colors" />
                  </div>
                  <h3 className="font-semibold mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Knowledge Base */}
        <section id="docs" className="section-padding bg-secondary/30">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-7 h-7 text-accent" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Knowledge Base</h2>
              <p className="text-muted-foreground">
                Browse our collection of guides and tutorials to get the most out of our services.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {knowledgeBase.map((section) => (
                <div key={section.category} className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="font-semibold text-lg mb-4">{section.category}</h3>
                  <ul className="space-y-3">
                    {section.articles.map((article) => (
                      <li key={article}>
                        <a
                          href="#"
                          className="flex items-center justify-between text-muted-foreground hover:text-accent transition-colors group"
                        >
                          <span className="text-sm">{article}</span>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section id="faqs" className="section-padding bg-background">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                <p className="text-muted-foreground">
                  Find quick answers to the most common questions about our services.
                </p>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-card rounded-xl border border-border px-6"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <span className="text-left font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Submit Ticket CTA */}
        <section id="submit-ticket" className="section-padding bg-secondary/30">
          <div className="container-custom">
            <div className="bg-card rounded-2xl p-8 md:p-12 border border-border text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
              <p className="text-muted-foreground mb-8">
                Can't find what you're looking for? Submit a support ticket and our team 
                will get back to you within 24 hours.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="accent" size="lg" asChild>
                  <Link to="/contact">
                    Submit a Ticket
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/login">Client Login</Link>
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
