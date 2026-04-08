import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Leaf, BarChart3, Users, Smartphone, ArrowRight, CheckCircle } from "lucide-react";
import teaPlantation from "@/assets/tea-plantation.jpg";

const features = [
  {
    icon: BarChart3,
    title: "Real-Time Harvest Tracking",
    description: "Monitor tea harvest quantities across all fields with live dashboards and trend analytics.",
  },
  {
    icon: Users,
    title: "Multi-Role Management",
    description: "Dedicated views for Super Admins, Admins, Field Owners, and Field Workers — each tailored to their workflow.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Data Entry",
    description: "Field workers can log harvests directly from the field with an intuitive, touch-friendly interface.",
  },
];

const benefits = [
  "Eliminate paper-based record keeping",
  "Track harvest productivity per field",
  "Manage users and assign roles easily",
  "View harvest trends over time with charts",
  "Secure, role-based access for every user",
];

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-card/95 backdrop-blur-sm border-b shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className={`h-6 w-6 ${scrolled ? "text-primary" : "text-white"}`} />
            <span className={`font-bold text-xl tracking-tight ${scrolled ? "text-foreground" : "text-white"}`}>THDMS</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className={scrolled ? "" : "text-white hover:text-white/80 hover:bg-white/10"} asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[500px]">
        <img
          src={teaPlantation}
          alt="Tea plantation background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="max-w-6xl mx-auto px-4 py-24 md:py-36 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-4 py-1.5 text-sm text-muted-foreground mb-6">
              <Leaf className="h-3.5 w-3.5 text-primary" />
              Tea Harvest Digital Management
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              Digitize your{" "}
              <span className="text-primary">tea harvest</span>{" "}
              operations
            </h1>
            <p className="text-lg md:text-xl text-white mb-8 leading-relaxed max-w-lg">
              A modern platform for Rwandan tea cooperatives to track harvests, manage fields, and empower every worker — from the field to the boardroom.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="text-base px-8" asChild>
                <Link to="/register">
                  Start for free <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 bg-card/80" asChild>
                <Link to="/login">Log in to dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28 border-t bg-card">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to manage tea harvests
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Built for Rwandan tea cooperatives with tools for every role in the value chain.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border bg-background p-8 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-28 border-t">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why cooperatives choose THDMS
              </h2>
              <ul className="space-y-4">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border bg-card p-10 text-center">
              <div className="text-5xl font-bold text-primary mb-2">5</div>
              <p className="text-muted-foreground mb-6">Fields actively tracked</p>
              <div className="text-5xl font-bold text-primary mb-2">15</div>
              <p className="text-muted-foreground mb-6">Harvest records this week</p>
              <div className="text-5xl font-bold text-primary mb-2">10</div>
              <p className="text-muted-foreground">Team members onboarded</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t bg-primary/5">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to go digital?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            Join cooperatives across Rwanda already using THDMS to streamline their operations.
          </p>
          <Button size="lg" className="text-base px-10" asChild>
            <Link to="/register">
              Create your account <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-primary text-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-white" />
            <span>THDMS — Tea Harvest Digital Management System</span>
          </div>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
