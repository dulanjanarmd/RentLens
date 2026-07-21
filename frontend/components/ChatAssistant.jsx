import { useState, useRef, useEffect } from 'react'
import { Send, X, MessageCircle, Loader } from 'lucide-react'

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hello! I'm your RentLens assistant. I can help you find properties, answer questions about neighborhoods, and provide rental advice. How can I help you today?",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const responses = {
    'find properties': "I can help you search for properties! You can:\n• Use the Listings page to browse all properties\n• Try the Map Search to explore by location\n• Use the Budget Tool to find properties within your budget\n• Set up filters for your ideal home",
    'neighborhoods': "Sri Lanka has great rental markets in:\n• Colombo - city center, business district\n• Kandy - cultural heritage, cooler climate\n• Galle - coastal living, relaxed pace\n• Negombo - beach area, resort vibes\n• Jaffna - historic city, affordable\n\nEach has unique characteristics and price ranges.",
    'budget': "The Budget Tool helps you find properties based on your financial constraints. It considers:\n• Your monthly budget\n• Preferred number of bedrooms\n• Location preferences\n• Current market prices\n\nWould you like me to guide you through the Budget Tool?",
    'comparison': "You can compare up to 4 properties side-by-side to:\n• Check prices and features\n• Compare location ratings\n• Review community complaints\n• Calculate rent value score\n\nUse the Compare tab to get started!",
    'complaints': "The complaint system helps you:\n• See what current/former tenants report\n• Identify common issues (water, power, noise, etc.)\n• Make informed decisions\n• Understand neighborhood concerns\n\nLower complaint count usually means better property management.",
    'rental value': "The Rental Value Score (RVS) rates properties from 0-100:\n• 80+ = Excellent value\n• 70-79 = Good value\n• 60-69 = Average value\n• <60 = Below average\n\nIt considers price, location, facilities, and reviews.",
    'help': "I can help with:\n• Finding properties\n• Understanding neighborhoods\n• Budget recommendations\n• Property comparisons\n• Complaint information\n• Rental value scores\n• General rental advice\n\nJust ask me anything!",
  }

  const generateResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()

    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerMessage.includes(keyword)) {
        return response
      }
    }

    const defaultResponses = [
      "That's a great question! I can help you navigate the rental market. Try asking about properties, neighborhoods, budgets, or comparisons.",
      "I understand! For more detailed information, you might want to explore our different tools - Listings, Map Search, Budget Tool, or Dashboard.",
      "Thanks for that query. If you need help with specific rental topics like neighborhoods or comparisons, just let me know!",
      "I'm here to help! Ask me about finding properties, neighborhoods, budgets, or any rental-related questions.",
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: generateResponse(input),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsLoading(false)
    }, 600)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Widget */}
      {isOpen ? (
        <div className="fixed bottom-4 right-4 w-96 max-w-full bg-card border border-border rounded-xl shadow-2xl flex flex-col z-50 h-96 md:h-auto">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">SmartRental Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary/90 p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-secondary/50 text-foreground rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary/50 text-foreground px-4 py-2 rounded-lg rounded-bl-none flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="input-field flex-1 text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Floating Button */
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center z-40"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </>
  )
}
