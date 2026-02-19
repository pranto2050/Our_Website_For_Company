import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "The Future of Web Development in 2026",
    excerpt: "Explore the latest trends and technologies shaping the web development landscape, from AI-powered tools to advanced frameworks.",
    category: "Technology",
    author: "ABIT Team",
    date: "Feb 1, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Building Scalable Mobile Applications",
    excerpt: "Learn the best practices for creating mobile apps that can handle millions of users while maintaining excellent performance.",
    category: "Mobile Development",
    author: "Development Team",
    date: "Jan 28, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "UI/UX Design Principles That Convert",
    excerpt: "Discover the design principles that help turn visitors into customers with strategic user experience optimization.",
    category: "Design",
    author: "Design Team",
    date: "Jan 25, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    title: "SEO Strategies for 2026",
    excerpt: "Stay ahead of the competition with cutting-edge SEO techniques that will boost your website's visibility and rankings.",
    category: "Digital Marketing",
    author: "Marketing Team",
    date: "Jan 20, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  },
  {
    id: 5,
    title: "Cloud Computing Best Practices",
    excerpt: "Optimize your cloud infrastructure for maximum efficiency, security, and cost-effectiveness with these proven strategies.",
    category: "Technology",
    author: "Tech Team",
    date: "Jan 15, 2026",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
  },
  {
    id: 6,
    title: "E-commerce Development Trends",
    excerpt: "The latest innovations in e-commerce development that are revolutionizing online shopping experiences worldwide.",
    category: "E-commerce",
    author: "ABIT Team",
    date: "Jan 10, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen cursor-default">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          <div className="container-custom relative">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20">
                Our Blog
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Insights & Updates
              </h1>
              <p className="text-lg text-white/80">
                Stay updated with the latest trends, tips, and insights from our team of experts 
                in web development, design, and digital marketing.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-20 bg-background">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="group overflow-hidden border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardHeader className="pb-3">
                    <Badge variant="outline" className="w-fit text-xs">
                      {post.category}
                    </Badge>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2 mt-2">
                      {post.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" className="w-full group/btn hover:bg-accent hover:text-accent-foreground">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Articles
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
