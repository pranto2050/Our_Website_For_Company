import { motion } from "framer-motion";
import { MessageSquare, Search, Lightbulb, Code, Rocket, Headphones } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Discovery",
    description: "We listen to understand your goals, challenges, and vision.",
    step: "01",
  },
  {
    icon: Search,
    title: "Research & Planning",
    description: "Deep analysis and strategic planning for optimal results.",
    step: "02",
  },
  {
    icon: Lightbulb,
    title: "Design & Prototype",
    description: "Creative concepts transformed into tangible prototypes.",
    step: "03",
  },
  {
    icon: Code,
    title: "Development",
    description: "Expert coding with clean, maintainable architecture.",
    step: "04",
  },
  {
    icon: Rocket,
    title: "Launch",
    description: "Rigorous testing followed by smooth deployment.",
    step: "05",
  },
  {
    icon: Headphones,
    title: "Support & Growth",
    description: "Ongoing maintenance and continuous improvement.",
    step: "06",
  },
];

export function ProcessSection() {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />

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
            Our Process
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            How We Deliver Excellence
          </h2>
          <p className="text-lg text-muted-foreground">
            A proven methodology that ensures every project is delivered on time, within budget, 
            and exceeds expectations.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative text-center group"
              >
                {/* Step Number */}
                <div className="relative z-10 mx-auto w-20 h-20 rounded-full bg-card border-2 border-accent/20 flex items-center justify-center mb-6 group-hover:border-accent group-hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
                    <step.icon className="w-8 h-8 text-accent group-hover:text-accent-foreground transition-colors" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center shadow-lg">
                    {step.step}
                  </span>
                </div>

                <h4 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">
                  {step.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
