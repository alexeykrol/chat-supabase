# AI Mentor - Your Career Development Assistant

> **Учебный проект**, созданный на основе оригинального [Vercel AI Chatbot](https://github.com/supabase-community/vercel-ai-chatbot). Проект демонстрирует, как можно взять любой готовый репозиторий и адаптировать его под свои нужды с минимальными изменениями.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2.31-black" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18.2.0-blue" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.1.3-blue" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Security-Hardened-green" alt="Security" />
  <img src="https://img.shields.io/badge/npm_audit-0_vulnerabilities-success" alt="No Vulnerabilities" />
</p>

## Содержание

- [О проекте](#о-проекте)
- [Технологический стек](#технологический-стек)
- [Безопасность](#безопасность)
- [Установка и запуск](#установка-и-запуск)
- [Структура проекта](#структура-проекта)
- [Функциональность](#функциональность)
- [Изменения относительно оригинала](#изменения-относительно-оригинала)
- [Лицензия](#лицензия)

## О проекте

AI Mentor - это интеллектуальный чат-бот для карьерного развития и бизнес-консалтинга, построенный на современном стеке технологий с акцентом на безопасность и производительность.

### Цель проекта

Показать процесс кастомизации существующего AI чат-бота:
- Изменение брендинга и интерфейса
- Добавление специализированного промпта
- Русификация интерфейса
- Техническая оптимизация
- **Комплексная защита от уязвимостей**

## Технологический стек

### Frontend
- **Next.js 14.2.31** - React-фреймворк с App Router
- **React 18.2.0** - UI библиотека
- **TypeScript 5.1.3** - Типизированный JavaScript
- **Tailwind CSS 3.3.2** - Utility-first CSS фреймворк
- **Radix UI** - Headless компоненты

### Backend & AI
- **Vercel AI SDK 3.4.33** - Интеграция с AI моделями
- **OpenAI GPT-4** - Языковая модель
- **Supabase** - Backend-as-a-Service
  - Authentication (GitHub OAuth)
  - PostgreSQL Database
- **Edge Runtime** - Серверные функции на краю сети

### Инструменты разработки
- **ESLint** - Линтер кода
- **Prettier** - Форматирование кода
- **React Hot Toast** - Уведомления

## Безопасность

Проект прошел комплексный аудит безопасности и защищен от распространенных уязвимостей.

### Реализованные меры безопасности

#### 1. Обновление зависимостей
- ✅ **0 критических уязвимостей** (npm audit)
- ✅ Обновлены все пакеты с известными CVE
  - `nanoid`: 4.0.2 → 5.1.6 (исправлена GHSA-mwcw-c2x4-8c55)
  - `next`: 13.4.10 → 14.2.31 (исправлены 13 критических уязвимостей)
  - `react-syntax-highlighter`: обновлен до последней версии
  - `prismjs`: принудительно обновлен через npm overrides

#### 2. HTTP Security Headers (Next.js)
Настроены защитные заголовки для всех маршрутов:

```javascript
// next.config.js
{
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
}
```

**Защита от:**
- Clickjacking (X-Frame-Options)
- MIME-sniffing (X-Content-Type-Options)
- XSS-атак (X-XSS-Protection)
- Man-in-the-Middle атак (HSTS)

#### 3. Валидация пользовательского ввода

**API Route (`/api/chat`):**
- ✅ Валидация JSON-структуры
- ✅ Проверка типов данных
- ✅ Ограничение длины сообщений (max 10,000 символов)
- ✅ Валидация формата массива сообщений

```typescript
// Пример валидации
if (!messages || !Array.isArray(messages) || messages.length === 0) {
  return new Response("Invalid messages format", { status: 400 })
}

for (const msg of messages) {
  if (msg.content.length > 10000) {
    return new Response("Message too long", { status: 400 })
  }
}
```

**Server Actions:**
- ✅ Валидация ID чатов (длина, тип)
- ✅ Проверка путей навигации
- ✅ Защита от SQL-инъекций через параметризованные запросы Supabase

**Login Form:**
- ✅ Email валидация (регулярное выражение)
- ✅ Минимальная длина пароля (6 символов)
- ✅ HTML5 атрибуты `required`, `minLength`, `autocomplete`

#### 4. Защита от XSS
- ✅ React автоматически экранирует контент
- ✅ Использование `react-markdown` без `dangerouslySetInnerHTML`
- ✅ Безопасное отображение кода через `react-syntax-highlighter`
- ✅ Отсутствие `eval()`, `Function()`, `innerHTML` в коде

#### 5. Аутентификация и авторизация
- ✅ Supabase Auth с GitHub OAuth
- ✅ Middleware для защиты маршрутов
- ✅ Проверка авторизации на уровне Server Actions
- ✅ Сессии на основе cookie с HttpOnly флагом

#### 6. Защита данных
- ✅ Безопасное хранение в Supabase PostgreSQL
- ✅ Row Level Security (RLS) на уровне БД
- ✅ Владелец чата проверяется по `user_id`
- ✅ Encrypted connections (HTTPS/TLS)

### Проверка безопасности

Запустите аудит безопасности:

```bash
npm audit
```

Ожидаемый результат:
```
found 0 vulnerabilities
```

## Установка и запуск

### Требования

- Node.js 18+
- npm или pnpm
- Supabase аккаунт
- OpenAI API ключ

### Шаги установки

1. **Клонируйте репозиторий**
   ```bash
   git clone https://github.com/your-username/chat-supabase.git
   cd chat-supabase
   ```

2. **Установите зависимости**
   ```bash
   npm install
   ```

3. **Настройте переменные окружения**

   Скопируйте `.env.example` в `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Заполните переменные:
   ```env
   # OpenAI
   OPENAI_API_KEY=sk-...

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Запустите Supabase локально** (опционально)
   ```bash
   npm install supabase --save-dev
   npx supabase start
   ```

5. **Запустите dev-сервер**
   ```bash
   npm run dev
   ```

   Приложение будет доступно на [http://localhost:3000](http://localhost:3000)

### Дополнительные команды

```bash
npm run build       # Сборка production версии
npm run start       # Запуск production сервера
npm run lint        # Проверка кода линтером
npm run lint:fix    # Автоматическое исправление линтером
npm run type-check  # Проверка TypeScript типов
```

## Структура проекта

```
chat-supabase/
├── app/                      # Next.js App Router
│   ├── actions.ts           # Server Actions (+ validation)
│   ├── api/
│   │   ├── auth/           # Аутентификация
│   │   └── chat/           # Chat API (+ input validation)
│   ├── chat/[id]/          # Страница чата
│   ├── share/[id]/         # Публичные чаты
│   ├── sign-in/            # Страница входа
│   ├── sign-up/            # Страница регистрации
│   └── layout.tsx          # Root layout (+ metadata)
├── components/              # React компоненты
│   ├── ui/                 # UI примитивы (Radix UI)
│   ├── chat.tsx            # Основной компонент чата
│   ├── chat-message.tsx    # Сообщение чата
│   ├── header.tsx          # Шапка приложения
│   ├── login-form.tsx      # Форма входа (+ validation)
│   └── ...
├── lib/                     # Утилиты и типы
│   ├── hooks/              # React hooks
│   ├── db_types.ts         # TypeScript типы для БД
│   └── utils.ts            # Вспомогательные функции
├── middleware.ts            # Next.js middleware (auth)
├── next.config.js          # Next.js конфигурация (+ security headers)
├── package.json            # Зависимости (+ overrides)
└── tsconfig.json           # TypeScript конфигурация
```

## Функциональность

### Основные возможности

- **AI Чат** - Общение с GPT-4 моделью в режиме реального времени
- **История чатов** - Сохранение и отображение предыдущих разговоров
- **Потоковая передача** - Streaming ответов от AI
- **Аутентификация** - Вход через GitHub OAuth
- **Публикация чатов** - Создание публичных ссылок на разговоры
- **Темная/светлая тема** - Переключение темы оформления
- **Адаптивный дизайн** - Оптимизация для мобильных устройств
- **Подсветка кода** - Syntax highlighting для блоков кода
- **Markdown поддержка** - Форматированный текст в сообщениях

### Предустановленные вопросы

- Как развить личный бренд?
- Как найти свою нишу в IT?
- Стратегии роста для стартапа
- Как выйти из выгорания?

## Изменения относительно оригинала

### 1. Трансформация в AI Ментор
- Изменен брендинг на "AI Ментор"
- Добавлен специализированный системный промпт
- Заменены примеры вопросов на актуальные темы

### 2. Безопасность (Основной фокус этого обновления)
- ✅ **Устранены все уязвимости** в зависимостях
- ✅ **Добавлены HTTP security headers**
- ✅ **Валидация всех пользовательских вводов**
- ✅ **Защита от XSS, CSRF, Clickjacking**
- ✅ **Безопасная конфигурация Next.js**

### 3. Улучшения API
- Миграция с `openai-edge` на OpenAI SDK v5
- Модель обновлена до GPT-4
- Улучшенная обработка ошибок
- Детальное логирование

### 4. UX/UI изменения
- Русификация интерфейса
- Новый дизайн главного экрана
- Упрощенный header
- Lucide React иконки

### 5. Технические улучшения
- Обновление Next.js до v14.2.31
- Обновление зависимостей
- Улучшенная валидация кэша
- TypeScript strict mode

## Окружение для разработки

Убедитесь, что у вас настроены:

```env
# .env.local

# OpenAI
OPENAI_API_KEY=sk-proj-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App URL (для production)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## Deploy

### Vercel (Рекомендуется)

1. Push код на GitHub
2. Импортируйте проект в [Vercel](https://vercel.com)
3. Настройте переменные окружения
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fchat-supabase)

### Supabase Setup

1. Создайте проект в [Supabase](https://supabase.com)
2. Настройте GitHub OAuth в Authentication
3. Установите Site URL в настройках Auth
4. Миграция БД применится автоматически

## Разработка

### Стек разработки

- **ESLint** - Статический анализ кода
- **Prettier** - Форматирование
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация

### Рекомендации по безопасности

При добавлении новых функций:

1. ✅ Всегда валидируйте пользовательский ввод
2. ✅ Используйте параметризованные запросы
3. ✅ Не доверяйте данным от клиента
4. ✅ Проверяйте авторизацию на сервере
5. ✅ Регулярно обновляйте зависимости
6. ✅ Запускайте `npm audit` перед каждым релизом
7. ✅ Используйте переменные окружения для секретов
8. ✅ Не коммитьте `.env` файлы

## Лицензия

Этот проект создан в учебных целях на основе MIT-лицензированного проекта Vercel AI Chatbot.

## Авторы

- Оригинальный проект: [Vercel](https://vercel.com) и [Supabase](https://supabase.com) команды
- Адаптация и улучшения безопасности: [Ваше имя]

## Благодарности

- [Vercel AI SDK](https://sdk.vercel.ai/)
- [Supabase](https://supabase.com)
- [OpenAI](https://openai.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

---

**Примечание**: Это учебный проект. Для production использования рекомендуется провести дополнительный аудит безопасности и настроить мониторинг.
