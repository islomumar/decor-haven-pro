import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const phoneNumber = '998901234567';
  const message = encodeURIComponent("Assalomu alaykum! Men mebel haqida ma'lumot olmoqchiman.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
      aria-label="Contact via WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
