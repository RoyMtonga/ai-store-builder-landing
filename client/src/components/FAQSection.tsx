import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "Do I need coding experience to use AppBuild?",
    answer: "Not at all! AppBuild is designed for everyone. Our drag-and-drop interface makes it easy for anyone to create professional applications without writing a single line of code."
  },
  {
    question: "Can I customize the design of my applications?",
    answer: "Absolutely! You have full control over the design with hundreds of templates, customizable themes, and the ability to upload your own assets and branding."
  },
  {
    question: "What kind of applications can I build?",
    answer: "You can build a wide variety of applications including business dashboards, e-commerce sites, portfolio websites, booking systems, and much more. If you can imagine it, you can build it."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes! Our Starter plan is completely free forever with up to 3 projects. You can upgrade to Pro or Enterprise plans anytime as your needs grow."
  },
  {
    question: "How do I get support if I need help?",
    answer: "We offer multiple support channels including our knowledge base, community forums, email support, and for Pro/Enterprise users, priority support with faster response times."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions 🤔
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Got questions? We've got answers. Here are the most common questions about AppBuild.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <Card key={index} className="border-none shadow-lg transition-all duration-200 hover:shadow-xl">
            <CardHeader className="cursor-pointer" onClick={() => toggleFAQ(index)}>
              <CardTitle className="flex justify-between items-center text-left">
                <span>{faq.question}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-6 w-6 p-0"
                  aria-label={openIndex === index ? 'Collapse answer' : 'Expand answer'}
                >
                  <span className={`transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}>
                    ⌄
                  </span>
                </Button>
              </CardTitle>
            </CardHeader>
            {openIndex === index && (
              <CardContent className="pt-0 pb-6">
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">Still have questions?</p>
        <Button variant="outline" className="hover:bg-gray-50 transition-all">
          Contact Support 📧
        </Button>
      </div>
    </section>
  );
}