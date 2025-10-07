import { UseChatHelpers } from 'ai/react'
import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PRESET_QUESTIONS = [
  'Чему учиться в эпоху ИИ?',
  'Чему учить детей?',
  'Какие профессии выживут?',
  'Мне больше 50, что мне делать?',
  'Как создать пассивный доход?',
  'Секреты продуктивности?',
  'Как побороть прокрастинацию?',
  'Инвестиции для новичков?'
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  const handlePresetQuestion = (question: string) => {
    setInput(question)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-4 sm:py-8 px-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Ментор</h1>
        <p className="text-gray-600 text-sm max-w-md">
          Задайте вопрос или выберите один из популярных вопросов ниже
        </p>
      </div>

      {/* Preset Question Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-w-4xl w-full">
        {PRESET_QUESTIONS.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => handlePresetQuestion(question)}
            className="flex items-center justify-center p-2 sm:p-3 lg:p-4 h-auto min-h-[50px] sm:min-h-[60px] text-xs sm:text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
            <span className="text-center leading-tight">{question}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
