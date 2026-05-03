import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import BackButton from "../../components/common/BackButton";

export default function Help() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How to book an appointment?",
      answer:
        "Go to the Teachers section, select your preferred teacher, choose available time slots, and confirm your booking."
    },
    {
      question: "How to reset my password?",
      answer:
        "Click on 'Forgot Password' on the login page, enter your registered email, and follow the reset link sent to your email."
    },
    {
      question: "Why is chat not working?",
      answer:
        "Chat is enabled only after appointment approval. Make sure your appointment status is approved."
    },
    {
      question: "How to contact admin?",
      answer:
        "Visit the Contact page or send an email to dsiconnection.project@gmail.com for assistance."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 py-16 px-6 relative">
      <BackButton title="Support Center" />

      {/* Header */}
      <div className="text-center mb-14">
        <h1 className="text-5xl font-bold text-gray-800">
          Help & <span className="text-purple-600">Support</span>
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          Find answers to common questions below.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">

        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl shadow-xl p-6 transition"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="text-purple-600" />
                <span className="font-semibold text-gray-800 text-lg">
                  {faq.question}
                </span>
              </div>
              <ChevronDown
                className={`transition-transform duration-300 ${
                  activeIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {activeIndex === index && (
              <p className="text-gray-600 mt-4 leading-relaxed">
                {faq.answer}
              </p>
            )}
          </div>
        ))}

        {/* Extra Support Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-xl p-8 mt-10 text-center">
          <h2 className="text-2xl font-semibold mb-3">
            Still need help?
          </h2>
          <p className="mb-4">
            Our support team is ready to assist you.
          </p>
          <a
            href="/contact"
            className="bg-white text-purple-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition"
          >
            Contact Support
          </a>
        </div>

      </div>
    </div>
  );
}