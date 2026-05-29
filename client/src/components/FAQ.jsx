import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-[#2a2a3e] transition-all duration-300">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none group"
      >
        <span className="font-semibold text-gray-800 dark:text-gray-100 group-hover:text-[#5B7062] dark:group-hover:text-[#A7BDAF] transition-colors pr-4">
          {question}
        </span>
        <div className={`p-1.5 rounded-full bg-gray-50 dark:bg-gray-800 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#8FA697]/10 text-[#5B7062]' : 'text-gray-400'}`}>
          <ChevronDown size={18} />
        </div>
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-5 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
          {answer}
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const { t } = useTranslation();

  const faqs = [
    {
      question: t('faqPage.q1'),
      answer: t('faqPage.a1')
    },
    {
      question: t('faqPage.q2'),
      answer: t('faqPage.a2')
    },
    {
      question: t('faqPage.q3'),
      answer: t('faqPage.a3')
    },
    {
      question: t('faqPage.q4'),
      answer: t('faqPage.a4')
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{t('faqPage.title')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('faqPage.subtitle')}</p>
      </div>

      <div className="flex flex-col gap-4">
        {faqs.map((faq, index) => (
          <FAQItem 
            key={index} 
            question={faq.question} 
            answer={faq.answer} 
            isOpen={openIndex === index}
            onClick={() => toggleAccordion(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FAQ;
