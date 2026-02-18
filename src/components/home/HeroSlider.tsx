import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, type Easing } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Headphones, 
  ArrowRight,
  Users,
  Briefcase,
  Award,
  Clock
} from "lucide-react";

// Import hero images
import teamMeetingImg from "@/assets/hero/team-meeting.jpg";
import teamWorkingImg from "@/assets/hero/team-working.jpg";
import awardCeremonyImg from "@/assets/hero/award-ceremony.jpg";
import foundersTeamImg from "@/assets/hero/founders-team.jpg";
import officeEnvironmentImg from "@/assets/hero/office-environment.jpg";

export interface HeroSlide {
  id: string;
  image: string;
  category: "company" | "team" | "awards";
  title: string;
  description: string;
}

const defaultSlides: HeroSlide[] = [
  {
    id: "1",
    image: foundersTeamImg,
    category: "team",
    title: "Meet Our Founders",
    description: "Five visionary friends united by a passion for technology",
  },
  {
    id: "2",
    image: teamMeetingImg,
    category: "company",
    title: "Strategic Collaboration",
    description: "Data-driven decisions powering client success",
  },
  {
    id: "3",
    image: teamWorkingImg,
    category: "team",
    title: "Expert Development Team",
    description: "Dedicated professionals delivering excellence",
  },
  {
    id: "4",
    image: awardCeremonyImg,
    category: "awards",
    title: "Award-Winning Excellence",
    description: "Recognized for innovation and outstanding service",
  },
  {
    id: "5",
    image: officeEnvironmentImg,
    category: "company",
    title: "Modern Tech Environment",
    description: "State-of-the-art facilities for cutting-edge solutions",
  },
];

const trustStats = [
  { icon: Users, value: "500+", label: "Trusted Clients" },
  { icon: Briefcase, value: "1,200+", label: "Projects Completed" },
  { icon: Award, value: "25+", label: "Awards Won" },
  { icon: Clock, value: "24/7", label: "Online Support" },
];

interface HeroSliderProps {
  slides?: HeroSlide[];
  autoPlayInterval?: number;
}

export function HeroSlider({ 
  slides = defaultSlides, 
  autoPlayInterval = 5000 
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const minSwipeDistance = 50;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(nextSlide, autoPlayInterval);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, nextSlide, autoPlayInterval]);

  // Touch handlers for swipe support
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const currentSlide = slides[currentIndex];

  return (
    <section 
      className="relative min-h-screen w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Slides */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 0, scale: 1.1 }}
          animate={{ 
            x: 0, 
            opacity: 1, 
            scale: 1,
            transition: {
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 },
              scale: { duration: 0.8 },
            }
          }}
          exit={{ 
            x: direction < 0 ? "100%" : "-100%", 
            opacity: 0, 
            scale: 0.95,
            transition: {
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
            }
          }}
          className="absolute inset-0"
        >
          {/* Image with Ken Burns effect */}
          <motion.div
            className="absolute inset-0"
            animate={{ scale: [1, 1.05] }}
            transition={{ duration: 8, ease: "linear" }}
          >
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </motion.div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-primary/30" />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center pt-20">
        <div className="container-custom">
          <div className="max-w-4xl">
            {/* Category Badge */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`badge-${currentIndex}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30 text-accent text-sm font-medium uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  {currentSlide.category === "company" && "Our Company"}
                  {currentSlide.category === "team" && "Our Team"}
                  {currentSlide.category === "awards" && "Our Achievements"}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Slide Title */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`slide-title-${currentIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-accent text-lg md:text-xl font-medium mb-4"
              >
                {currentSlide.title} — {currentSlide.description}
              </motion.p>
            </AnimatePresence>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-tight mb-6"
            >
              Building Digital Solutions That{" "}
              <span className="gradient-text">Power Real Businesses</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-primary-foreground/80 mb-10 max-w-2xl"
            >
              Web, Software, Mobile Apps, SEO & Online Support — Delivered by Experts
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-16"
            >
              <Button variant="hero" size="xl" asChild>
                <Link to="/support">
                  <Headphones className="w-5 h-5" />
                  Get Support
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/contact">
                  Contact ABIT Solutions
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Trust Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
          >
            {trustStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 p-4 rounded-xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary-foreground">{stat.value}</p>
                  <p className="text-sm text-primary-foreground/60">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-all group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-all group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={`relative h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "w-10 bg-accent" 
                : "w-2 bg-primary-foreground/30 hover:bg-primary-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentIndex && (
              <motion.div
                className="absolute inset-0 rounded-full bg-accent"
                layoutId="activeSlide"
              />
            )}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-foreground/10 z-20">
        <motion.div
          key={currentIndex}
          className="h-full bg-accent"
          initial={{ width: "0%" }}
          animate={{ width: isPaused ? undefined : "100%" }}
          transition={{ duration: autoPlayInterval / 1000, ease: "linear" }}
        />
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 right-8 z-20 hidden md:flex items-center gap-2 text-primary-foreground/60 font-medium">
        <span className="text-2xl text-accent">{String(currentIndex + 1).padStart(2, "0")}</span>
        <span>/</span>
        <span>{String(slides.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}
