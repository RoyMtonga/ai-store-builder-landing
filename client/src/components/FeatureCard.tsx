import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

export function FeatureCard({ feature, index }: FeatureCardProps) {
  return (
    <Card 
      className="border-none shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardHeader>
        <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 transition-transform hover:scale-110`}>
          <span className="text-2xl" role="img" aria-label={feature.title}>
            {feature.icon}
          </span>
        </div>
        <CardTitle>{feature.title}</CardTitle>
        <CardDescription>
          {feature.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}