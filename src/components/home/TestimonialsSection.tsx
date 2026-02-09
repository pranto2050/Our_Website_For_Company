import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "CEO, TechStart Inc",
    content: "ABIT Solutions transformed our online presence completely. Their team delivered a stunning website that increased our conversions by 150%. The attention to detail and professionalism exceeded all expectations.",
    rating: 5,
    avatar: "SJ",
    project: "E-commerce Platform",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Founder, GrowthLabs",
    content: "Working with ABIT was a game-changer for our startup. They built our entire platform from scratch and the quality was exceptional. Their support team is incredibly responsive and helpful.",
    rating: 5,
    avatar: "MC",
    project: "SaaS Development",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Marketing Director, Nexus Corp",
    content: "The SEO and digital marketing services from ABIT Solutions helped us rank #1 for our key terms. Our organic traffic increased by 300% in just 6 months. Highly recommended!",
    rating: 5,
    avatar: "ER",
    project: "SEO & Marketing",
  },
  {
    id: 4,
    name: "David Park",
    role: "CTO, InnovateTech",
    content: "The custom software solution ABIT developed streamlined our operations significantly. Their technical expertise and understanding of our business needs was impressive.",
    rating: 5,
    avatar: "DP",
    project: "Custom Software",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="section-padding bg-secondary/30 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            What Our Clients Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Don't just take our word for it. Here's what our satisfied clients have to say about working with us.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Testimonial */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="glass-card p-8 md:p-12 text-center"
              >
                <Quote className="w-12 h-12 text-accent/30 mx-auto mb-6" />
                
                <p className="text-lg md:text-xl text-foreground mb-8 leading-relaxed">
                  "{testimonials[currentIndex].content}"
                </p>

                {/* Rating */}
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                  ))}
                </div>

                {/* Project Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium mb-6">
                  {testimonials[currentIndex].project}
                </div>

                {/* Author */}
                <div className="flex items-center justify-center gap-4">
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center"
                  >
                    <span className="text-lg font-semibold text-accent">
                      {testimonials[currentIndex].avatar}
                    </span>
                  </motion.div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-muted-foreground">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              
              {/* Dots */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-accent w-8"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2.5"
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Client Logos */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-20 pt-12 border-t border-border"
        >
          <p className="text-center text-muted-foreground mb-8 text-sm font-medium uppercase tracking-wider">
            Trusted by Leading Companies Worldwide
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {["TechStart", "GrowthLabs", "Nexus Corp", "InnovateTech", "Digital Wave", "CloudScale", "DataPrime", "NetSphere"].map((client) => (
              <div
                key={client}
                className="flex items-center gap-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <span className="font-bold text-sm">{client.slice(0, 2)}</span>
                </div>
                <span className="font-semibold hidden sm:block">{client}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
