import { Button } from "@/components/ui/button";
import { Calendar, Users, FileText, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="gradient-hero min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <div className="text-left space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary animate-glow" />
            <span className="text-sm font-medium text-accent-foreground">Modern Event Planning</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
            Plan Events That{" "}
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              People Remember
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-xl">
            Because perfect events don't happen by accident. Streamline your planning with powerful tools for vendors, guests, and timelines.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/dashboard">
              <Button variant="hero" size="lg">
                Get Started Free
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-8 border-t border-border/50">
            <div>
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Events Planned</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>

        {/* Right Content - Feature Preview */}
        <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="gradient-card rounded-2xl shadow-lg p-8 border border-border/50">
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-accent rounded-lg hover:shadow-md transition-smooth cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground">Event Scheduling</h3>
                  <p className="text-sm text-muted-foreground">Plan timelines & manage activities</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-accent rounded-lg hover:shadow-md transition-smooth cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground">Guest Management</h3>
                  <p className="text-sm text-muted-foreground">Track RSVPs & manage lists</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-accent rounded-lg hover:shadow-md transition-smooth cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-primary-light/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary-light" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground">Vendor Coordination</h3>
                  <p className="text-sm text-muted-foreground">Compare & manage vendors</p>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full shadow-glow font-semibold text-sm">
              ✨ All-in-One
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
