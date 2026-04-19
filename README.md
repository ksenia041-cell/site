# Mint Coaching

Сайт Ксенії Нараєвської — стратегічний коучинг.
Побудований на **React + Vite + Tailwind**, готовий до деплою на **Vercel** (GitHub → auto-deploy).
Форма з розділу «For coaches & experts» надсилає запити у ваш **Telegram** через serverless-функцію `/api/contact`.

---

## 🗂️ Структура

```
mint-coaching/
├── api/
│   └── contact.ts          ← бекенд (serverless): форма → Telegram
├── public/
│   ├── favicon.svg
│   └── 1.mp4               ← сюди покладіть hero-відео
├── src/
│   ├── App.tsx             ← головний компонент (вся верстка)
│   ├── index.css           ← палітра, glass-стилі, кнопки
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vercel.json
└── vite.config.ts
```

---

## 🛠️ Що треба встановити один раз

1. **Node.js 18+** — завантажити з <https://nodejs.org> (версія «LTS»).
2. **Git** — <https://git-scm.com/downloads>.
3. Акаунт на **GitHub** — <https://github.com/signup>.
4. Акаунт на **Vercel** — <https://vercel.com/signup> (можна зайти через GitHub, це найпростіше).

---

## 🚀 Покрокова інструкція

### Крок 1. Запустити проект локально (перевірити, що все працює)

Відкрийте термінал у папці з проектом і виконайте:

```bash
npm install
npm run dev
```

Відкриється <http://localhost:5173> — ви побачите сайт. Якщо щось не так — зупиніть процес (Ctrl+C) і напишіть мені, що саме.

### Крок 2. Покласти відео

Файл `1.mp4` (hero loop-об'єкт) покладіть у папку `public/`.
Без нього замість відео буде placeholder з надписом «Hero video placeholder» — сайт не зламається, але відео не буде.

### Крок 3. Створити репозиторій на GitHub

1. Зайдіть на <https://github.com/new>.
2. Назва: наприклад, `mint-coaching` (або як захочете).
3. Нічого більше не міняйте (не треба додавати README чи .gitignore — вони вже є).
4. Натисніть **Create repository**.
5. GitHub покаже інструкцію — вам потрібен блок «…or push an existing repository from the command line».

У терміналі, у папці проекту:

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/ВАШЛОГІН/mint-coaching.git
git push -u origin main
```

(рядок з `git remote add` скопіюйте з GitHub — там ваш правильний URL)

### Крок 4. Задеплоїти на Vercel

1. Зайдіть на <https://vercel.com/new>.
2. Натисніть **Import** поряд з вашим репозиторієм `mint-coaching`.
   - Якщо Vercel не бачить репозиторій — клацніть «Adjust GitHub App Permissions» і додайте доступ.
3. На екрані налаштувань **нічого не міняйте** — Vercel автоматично визначить Vite.
4. Натисніть **Deploy**.
5. Через 1–2 хвилини з'явиться URL виду `mint-coaching-xyz.vercel.app`. Готово — сайт онлайн.

### Крок 5. Налаштувати Telegram-бекенд для форми

Це потрібно, щоб запити з форми «For coaches & experts» приходили вам у Telegram.

**5a. Створити бота:**

1. Відкрийте Telegram → знайдіть `@BotFather`.
2. Напишіть `/newbot`, далі дайте ім'я (наприклад, `Mint Coaching Inbox`) і username (має закінчуватись на `_bot`, наприклад `mint_coaching_inbox_bot`).
3. BotFather надішле вам **token** — рядок виду `1234567890:ABC-DEFghijklmnop...`. **Збережіть його.**

**5b. Дізнатись свій Telegram chat ID:**

1. Знайдіть `@userinfobot` у Telegram і напишіть йому `/start`.
2. Він відповість вашим ID — число виду `123456789`. **Збережіть його.**

**5c. ⚠️ Важливо: напишіть першому своєму боту:**

Знайдіть вашого нового бота (за username, який ви йому дали) і напишіть йому `/start` або просто «привіт». Без цього Telegram не дозволить боту написати вам.

**5d. Додати токен і ID у Vercel:**

1. <https://vercel.com/dashboard> → ваш проект → **Settings** → **Environment Variables**.
2. Додайте дві змінні (натисніть **Add** для кожної):
   - `TELEGRAM_BOT_TOKEN` = (токен від BotFather)
   - `TELEGRAM_CHAT_ID` = (ваш ID від userinfobot)
   - Відмітьте всі три оточення: Production, Preview, Development.
3. **Важливо**: після додавання змінних треба задеплоїти наново.
   Перейдіть у **Deployments** → натисніть `⋯` біля останнього деплою → **Redeploy**.

**5e. Перевірити:**

Відкрийте ваш сайт → промотайте до розділу «For coaches & experts» → заповніть форму → натисніть «Надіслати запит». Ви маєте отримати повідомлення в Telegram від вашого бота.

---

## 🌐 Підключити власний домен (опціонально)

1. Vercel Dashboard → ваш проект → **Settings** → **Domains** → **Add**.
2. Введіть домен, наприклад `mintcoaching.com` і `www.mintcoaching.com`.
3. Vercel покаже 1–2 DNS-записи (A / CNAME). Додайте їх у панелі свого реєстратора домену.
4. Через 5–60 хвилин домен запрацює з HTTPS (Vercel сам видасть SSL-сертифікат).

---

## 📝 Як вносити зміни пізніше

Правило просте: **все, що ви пушите на GitHub → автоматично деплоїться на Vercel**.

1. Відкрийте файл, змініть що треба, збережіть.
2. У терміналі (у папці проекту):
   ```bash
   git add .
   git commit -m "короткий опис зміни"
   git push
   ```
3. Через ~1 хвилину зміни онлайн.

### Що де редагувати

- **Тексти, заголовки, ціни, FAQ, пакети** — у файлі `src/App.tsx`.
  Шукайте масиви `packages`, `audience`, `problems`, `testimonials`, `faqs` — вони на початку файлу.
- **Кольори, градієнти, glass-ефекти, стиль кнопок** — у `src/index.css`.
- **Hero-відео** — файл `public/1.mp4` (просто замініть).
- **Favicon** — `public/favicon.svg`.
- **SEO / мета-теги** — у `index.html` (блок `<meta>` у `<head>`).

---

## 🔧 Траблшутінг

**Форма повертає помилку.**
Перевірте, що:
- у Vercel додані обидві env-змінні (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`);
- ви зробили **Redeploy** після додавання змінних;
- ви написали боту `/start` хоч раз;
- у логах Vercel (Dashboard → проект → Logs) немає помилок.

**Відео не грає.**
- Файл має бути саме `1.mp4` і лежати в папці `public/` (не в `src/`).
- Формат — H.264 MP4 (найсумісніший). Якщо у вас `.mov` або інший — сконвертуйте.
- Розмір — бажано до 5 МБ, інакше сайт повільно відкриватиметься.

**`npm install` падає з помилкою.**
Переконайтесь, що у вас Node.js версії 18+. Перевірити: `node -v`.

---

## 📦 Команди

```bash
npm run dev       # запуск на http://localhost:5173
npm run build     # зібрати production-версію в папку dist/
npm run preview   # переглянути зібрану версію локально
```

---

© 2026 Kseniia Naraievska
