import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  isPopular: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
  onButtonClick: (planName: string) => void;
}

export function PricingCard({ plan, onButtonClick }: PricingCardProps) {
  return (
    <Card 
      className={`border-none shadow-lg transition-all duration-300 card-hover ${
        plan.isPopular ? 'shadow-xl ring-2 ring-blue-600 transform scale-105' : ''
      }`}
    >
      <CardHeader>
        {plan.isPopular && (
          <Badge className="mx-auto mb-2 bg-blue-600" aria-label="Most popular plan">
            Most Popular
          </Badge>
        )}
        <CardTitle className="text-center">{plan.name}</CardTitle>
        <div className="text-center">
          <span className="text-3xl font-bold">{plan.price}</span>
          <p className="text-gray-600">{plan.period}</p>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-6" role="list">
          {plan.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-center">
              <span className="text-green-500 mr-2" role="img" aria-label="Included">
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
        <Button 
          className={`w-full transition-all focus-visible ${
            plan.isPopular 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
              : ''
          }`}
          variant={plan.isPopular ? 'default' : 'outline'}
          onClick={() => onButtonClick(plan.name.toLowerCase())}
          aria-label={`Select ${plan.name} plan`}
        >
          {plan.buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}