import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // In a real app, this would connect to an API
    console.log('Newsletter signup:', email);
    setIsSubmitted(true);
    setEmail('');
    
    // Reset after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-md mx-auto bg-green-50 border-green-200">
        <CardContent className="p-6 text-center">
          <span className="text-2xl mb-2 block">✉️</span>
          <p className="text-green-800 font-medium">Thanks for subscribing!</p>
          <p className="text-green-600 text-sm">We'll keep you updated on new features.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-center mb-4">
          Stay Updated 📬
        </h3>
        <p className="text-gray-600 text-center mb-4 text-sm">
          Get the latest updates on new features and improvements.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" variant="default">
            Subscribe
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}