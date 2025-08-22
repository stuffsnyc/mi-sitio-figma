import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MapPin, Calendar, Palette, Award } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=600&fit=crop&crop=face"
              alt="Santiago Camiro"
              className="w-full rounded-lg aspect-[4/5] object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="mb-6">About Santiago Camiro</h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Contemporary poster designer specializing in visual communication and impactful 
              graphic design. My work bridges the gap between artistic expression and commercial 
              application, creating posters that inform, inspire, and captivate audiences.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                <span>Based in Barcelona, Spain</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="w-5 h-5" />
                <span>Designer since 2018</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Palette className="w-5 h-5" />
                <span>Poster Design & Visual Communication</span>
              </div>
            </div>
            <Button className="w-fit">
              Contact for Collaborations
            </Button>
          </div>
        </div>

        {/* Artistic Philosophy */}
        <div className="mb-16">
          <h2 className="mb-8">Design Philosophy</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-3">Clear Communication</h3>
              <p className="text-sm text-muted-foreground">
                Every poster delivers its message with clarity and impact, ensuring the intended communication reaches its audience effectively.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-3">Design Innovation</h3>
              <p className="text-sm text-muted-foreground">
                Combining traditional poster design principles with cutting-edge digital techniques to create memorable visual experiences.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-3">Cultural Connection</h3>
              <p className="text-sm text-muted-foreground">
                Drawing inspiration from diverse cultural experiences and global artistic traditions, especially Mediterranean influences.
              </p>
            </div>
          </div>
        </div>

        {/* Journey */}
        <div className="mb-16">
          <h2 className="mb-8">Design Journey</h2>
          <div className="space-y-8">
            <div className="border-l-2 border-primary/20 pl-6 pb-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">2024</Badge>
                <h3>Poster Revolution</h3>
              </div>
              <p className="text-muted-foreground">
                Launched Santiago.Posters as an independent design studio, focusing on the intersection 
                of visual communication and artistic expression. This period marks a commitment to 
                impactful, purpose-driven poster design.
              </p>
            </div>
            <div className="border-l-2 border-primary/20 pl-6 pb-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">2022-2023</Badge>
                <h3>Mixed Media Exploration</h3>
              </div>
              <p className="text-muted-foreground">
                Developed signature techniques combining oil painting with digital elements, 
                creating works that challenge the boundaries between physical and virtual art spaces.
              </p>
            </div>
            <div className="border-l-2 border-primary/20 pl-6 pb-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">2018-2021</Badge>
                <h3>Foundation Years</h3>
              </div>
              <p className="text-muted-foreground">
                Established artistic practice with focus on contemporary themes, developing a unique 
                voice in the independent art scene through extensive experimentation and study.
              </p>
            </div>
          </div>
        </div>

        {/* Skills & Mediums */}
        <div>
          <h2 className="mb-8">Skills & Techniques</h2>
          <div className="flex flex-wrap gap-3">
            {[
              'Typography', 'Layout Design', 'Color Theory', 'Digital Illustration', 'Print Design',
              'Screen Printing', 'Offset Printing', 'Digital Art', 'Concept Development',
              'Visual Identity', 'Brand Design', 'Event Posters', 'Art Direction', 'Visual Communication'
            ].map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}