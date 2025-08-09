import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Send, Bot, User, Loader2, MessageSquare, Lightbulb } from 'lucide-react'

const ChatbotInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Xin chào! Tôi là chatbot hỗ trợ onboarding. Tôi có thể giúp bạn:\n\n🎯 Tạo lộ trình onboarding cá nhân hóa\n📧 Tạo nội dung tự động (email, tóm tắt, câu hỏi)\n🔍 Trích xuất thông tin từ tài liệu\n❓ Trả lời câu hỏi về chính sách công ty\n\nHãy thử hỏi "help" để xem hướng dẫn chi tiết!',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const endOfMessagesRef = useRef(null)

  const suggestedQuestions = [
    "Tạo lộ trình cho developer",
    "Chính sách nghỉ phép như thế nào?",
    "Tạo email chào mừng",
    "Xử lý CV",
    "help"
  ]

  // Auto scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const sendMessage = async (message = inputValue) => {
    if (!message.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('http://127.0.0.1:5001/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: message }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.response || 'Xin lỗi, tôi không thể xử lý yêu cầu này lúc này.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Xin lỗi, có lỗi xảy ra khi kết nối với server. Vui lòng thử lại sau.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatMessage = (content) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  return (
    <div className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <span>Chatbot AI Hỗ trợ Onboarding</span>
        </CardTitle>
        <CardDescription>
          Hỏi đáp thông minh về chính sách, quy trình và các chức năng mới
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
        {/* Suggested Questions */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <Lightbulb className="h-4 w-4" />
            <span>Gợi ý câu hỏi:</span>
          </div>
          {suggestedQuestions.map((question, index) => (
            <Badge
              key={index}
              variant="outline"
              className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
              onClick={() => sendMessage(question)}
            >
              {question}
            </Badge>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === 'bot' && (
                        <Bot className="h-4 w-4 mt-1 text-blue-600" />
                      )}
                      {message.type === 'user' && (
                        <User className="h-4 w-4 mt-1 text-white" />
                      )}
                      <div className="flex-1">
                        <div className="text-sm font-medium mb-1">
                          {message.type === 'bot' ? 'Chatbot' : 'Bạn'}
                        </div>
                        <div className="text-sm leading-relaxed">
                          {formatMessage(message.content)}
                        </div>
                        <div className={`text-xs mt-2 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString('vi-VN')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-blue-600" />
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        <span className="text-sm text-gray-600">Đang xử lý...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Điểm đánh dấu cuối tin nhắn */}
              <div ref={endOfMessagesRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Input */}
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập câu hỏi của bạn..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => sendMessage()}
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </div>
  )
}

export default ChatbotInterface
