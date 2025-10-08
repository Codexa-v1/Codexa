import { Card } from "@/components/ui/card";
import { 
  Calendar, 
  Users, 
  FileText, 
  Download, 
  Building2, 
  Share2,
  CheckCircle2,
  Clock
} from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Vendor & Venue Management",
    description: "Manage vendor profiles, compare options, and track contracts all in one place.",
    color: "primary"
  },
  {
    icon: Users,
    title: "Guest Management",
    description: "Create guest lists, send invites, track RSVPs, and manage attendance effortlessly.",
    color: "secondary"
  },
  {
    icon: Download,
    title: "Export Center",
    description: "Export events, guest data, and schedules as PDF or CSV with one click.",
    color: "primary-light"
  },
  {
    icon: Calendar,
    title: "Event Scheduling",
    description: "Plan timelines, schedule activities, and integrate with your calendar seamlessly.",
    color: "primary"
  },
  {
    icon: FileText,
    title: "Document Management",
    description: "Upload, organize, and share event-related documents securely.",
    color: "secondary"
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share event details with stakeholders and collaborators instantly.",
    color: "primary-light"
  },
];

export const Features = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-accent-foreground">Everything You Need</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold">
            Powerful Features for{" "}
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Perfect Events
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            All the tools you need to plan, manage, and execute unforgettable events from start to finish.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="gradient-card p-6 border border-border/50 hover:shadow-lg transition-smooth hover:-translate-y-1 animate-fade-in-up cursor-pointer group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-4">
                <div className={`w-14 h-14 rounded-xl bg-${feature.color}/10 flex items-center justify-center group-hover:scale-110 transition-smooth`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}`} />
                </div>
                
                <h3 className="text-xl font-bold text-card-foreground">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <div className="inline-flex items-center gap-2 text-primary">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Get started in under 2 minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
};
