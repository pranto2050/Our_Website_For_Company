import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Globe, 
  Code2, 
  Smartphone, 
  TrendingUp, 
  Palette, 
  Layers, 
  Headphones,
  ArrowRight,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Palette,
    title: "Website Design",
    description: "Stunning, user-centric designs that captivate your audience and drive conversions.",
    href: "/services#web-design",
    color: "from-pink-500/20 to-rose-500/20",
  },
  {
    icon: Code2,
    title: "Web Development",
    description: "Robust, scalable web applications built with cutting-edge technologies.",
    href: "/services#web-development",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Cpu,
    title: "Software Development",
    description: "Custom software solutions tailored to your unique business requirements.",
    href: "/services#software-development",
    color: "from-violet-500/20 to-purple-500/20",
  },
  {
    icon: Smartphone,
    title: "Android Development",
    description: "Native Android apps that deliver exceptional user experiences.",
    href: "/services#android-development",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: TrendingUp,
    title: "Digital Marketing & SEO",
    description: "Data-driven strategies to boost your online presence and rankings.",
    href: "/services#digital-marketing",
    color: "from-orange-500/20 to-amber-500/20",
  },
  {
    icon: Layers,
    title: "UI/UX Design",
    description: "Intuitive interfaces that delight users and enhance engagement.",
    href: "/services#ui-ux-design",
    color: "from-cyan-500/20 to-teal-500/20",
  },
  {
    icon: Globe,
    title: "Graphic Design",
    description: "Creative visual solutions that strengthen your brand identity.",
    href: "/services#graphic-design",
    color: "from-red-500/20 to-pink-500/20",
  },
  {
    icon: Headphones,
    title: "Technical Support",
    description: "24/7 expert support to keep your systems running smoothly.",
    href: "/services#technical-support",
    color: "from-indigo-500/20 to-blue-500/20",
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

export function ServicesSection() {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

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
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Comprehensive Digital Solutions
          </h2>
          <p className="text-lg text-muted-foreground">
            From concept to deployment, we provide end-to-end services to transform your digital vision into reality.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="bg-card border border-border rounded-xl p-6 transition-all duration-300 shadow-md hover:shadow-lg h-full cursor-default"
            >              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-5 transition-all duration-300">
                  <service.icon className="w-7 h-7 text-accent transition-colors" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 hover:text-accent transition-colors cursor-default">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground mb-4">
                  {service.description}
                </p>
                <Link 
                  to={service.href}
                  className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all duration-300 cursor-pointer"
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button variant="accent" size="lg" asChild>
            <Link to="/services">
              View All Services
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
