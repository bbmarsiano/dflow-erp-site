import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface MathCaptchaProps {
  onChange: (isValid: boolean) => void;
  language: 'en' | 'bg';
}

export function MathCaptcha({ onChange, language }: MathCaptchaProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  const generateNumbers = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setNum1(n1);
    setNum2(n2);
    setUserAnswer('');
    setIsCorrect(false);
    onChange(false);
  };

  useEffect(() => {
    generateNumbers();
  }, []);

  const handleAnswerChange = (value: string) => {
    setUserAnswer(value);
    const correctAnswer = num1 + num2;
    const isValid = parseInt(value) === correctAnswer;
    setIsCorrect(isValid);
    onChange(isValid);
  };

  const labels = {
    en: {
      question: 'What is',
      refresh: 'Refresh question',
      placeholder: 'Enter answer'
    },
    bg: {
      question: 'Колко е',
      refresh: 'Обнови въпроса',
      placeholder: 'Въведете отговор'
    }
  };

  const text = labels[language];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {text.question} {num1} + {num2}?
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            userAnswer && (isCorrect ? 'border-green-500' : 'border-red-500')
          }`}
          placeholder={text.placeholder}
          required
        />
        <button
          type="button"
          onClick={generateNumbers}
          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          title={text.refresh}
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
      {userAnswer && !isCorrect && (
        <p className="text-xs text-red-600">
          {language === 'bg' ? 'Грешен отговор' : 'Incorrect answer'}
        </p>
      )}
      {isCorrect && (
        <p className="text-xs text-green-600">
          {language === 'bg' ? 'Верен отговор!' : 'Correct answer!'}
        </p>
      )}
    </div>
  );
}
