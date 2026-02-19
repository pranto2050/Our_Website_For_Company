import { motion } from "framer-motion";
import { Shield, Zap, Users, Award, Clock, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Trusted & Secure",
    description: "Enterprise-grade security protocols protect your data and intellectual property.",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Agile methodology ensures quick turnaround without compromising quality.",
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Our skilled professionals bring years of industry experience to every project.",
  },
  {
    icon: Award,
    title: "Quality First",
    description: "Rigorous testing and review processes guarantee exceptional deliverables.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock assistance ensures your systems are always running smoothly.",
  },
  {
    icon: HeartHandshake,
    title: "Client-Centric",
    description: "Your success is our priority. We build lasting partnerships, not just projects.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-secondary/30 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Your Success Is Our <span className="gradient-text">Mission</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              At ABIT Solutions, we combine technical excellence with a deep understanding 
              of your business needs. Our commitment to innovation and quality has made us 
              a trusted partner for businesses worldwide.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.slice(0, 4).map((feature, index) => (
                <motion.div 
                  key={feature.title} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex gap-4 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-accent group-hover:text-accent-foreground transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 group-hover:text-accent transition-colors">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Feature Cards */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className={`service-card group ${index % 2 === 1 ? 'sm:mt-8' : ''}`}
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-accent group-hover:text-accent-foreground transition-colors" />
                </div>
                <h4 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">{feature.title}</h4>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
