import "server-only"
import { StreamingTextResponse } from "ai"
import OpenAI from "openai"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/lib/db_types"
import { auth } from "@/auth"
import { nanoid } from "@/lib/utils"
import { revalidatePath } from "next/cache"

export const runtime = "edge"

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  })

  // Input validation
  let body
  try {
    body = await req.json()
  } catch (error) {
    return new Response("Invalid JSON", { status: 400 })
  }

  const { messages, previewToken, id } = body

  // Validate messages array
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response("Invalid messages format", { status: 400 })
  }

  // Validate each message
  for (const msg of messages) {
    if (!msg.role || !msg.content) {
      return new Response("Invalid message structure", { status: 400 })
    }
    if (typeof msg.content !== 'string') {
      return new Response("Message content must be a string", { status: 400 })
    }
    // Limit message length to prevent abuse
    if (msg.content.length > 10000) {
      return new Response("Message too long (max 10000 characters)", { status: 400 })
    }
  }

  const userId = (await auth({ cookieStore }))?.user.id

  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const openaiClient = previewToken ? new OpenAI({ apiKey: previewToken }) : client

  // Add AI Mentor system prompt
  const systemPrompt = {
    role: "system",
    content: `Ты AI Ментор - мудрый советчик и коуч по развитию карьеры, личности и бизнеса. 

Твоя роль:
- Помогай людям развиваться профессионально и личностно
- Отвечай мудро, конкретно и вдохновляюще
- Давай практические советы и пошаговые планы
- Мотивируй и поддерживай в сложных ситуациях

Стиль общения:
- Дружелюбный, но профессиональный
- Структурированные ответы с четкими пунктами
- Примеры и аналогии для лучшего понимания
- Вопросы для размышления в конце ответа

Отвечай на русском языке, будь практичным и полезным.`
  }

  const messagesWithSystem = [systemPrompt, ...messages]

  const stream = await openaiClient.chat.completions.create({
    model: "gpt-4",
    messages: messagesWithSystem,
    stream: true,
  })

  let fullResponse = ''
  const encoder = new TextEncoder()
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          // Handle streaming chunks from chat.completions
          if (chunk.choices[0]?.delta?.content) {
            const content = chunk.choices[0].delta.content
            fullResponse += content
            // Send each chunk as it arrives
            controller.enqueue(encoder.encode(content))
          }
        }
        
        // Save to database when streaming is complete
        console.log('Saving to database...')
        console.log('userId:', userId)
        console.log('fullResponse:', fullResponse.substring(0, 100))
        
        const title = messages[0].content.substring(0, 100)
        const chatId = id ?? nanoid()
        const createdAt = Date.now()
        const path = `/chat/${chatId}`
        const payload = {
          id: chatId,
          title,
          userId,
          createdAt,
          path,
          messages: [...messages, { role: "assistant", content: fullResponse }],
        }
        
        console.log('Payload:', JSON.stringify(payload, null, 2))
        
        try {
          const result = await (supabase as any).from("chats").upsert({
            id: chatId,
            user_id: userId,
            payload
          })
          console.log('Database result:', result)
          if (result.error) {
            console.error('Database error:', result.error)
          } else {
            // Revalidate the homepage to update sidebar
            revalidatePath('/')
          }
        } catch (error) {
          console.error('Save error:', error)
        }
        
        controller.close()
      } catch (error) {
        controller.error(error)
      }
    }
  })

  return new StreamingTextResponse(readableStream)
}