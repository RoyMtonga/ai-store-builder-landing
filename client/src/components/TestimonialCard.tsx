import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
      <CardContent className="p-6">
        <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
            {testimonial.avatar}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{testimonial.name}</p>
            <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}