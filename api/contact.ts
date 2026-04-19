// Vercel serverless function that forwards form submissions to Telegram.
// Env vars required (set in Vercel → Settings → Environment Variables):
//   TELEGRAM_BOT_TOKEN  — token from @BotFather
//   TELEGRAM_CHAT_ID    — your Telegram user ID (from @userinfobot)

export const config = {
  runtime: "edge",
};

type ContactPayload = {
  name?: string;
  contact?: string;
  who?: string;
  need?: string;
  result?: string;
};

export default async function handler(req: Request): Promise<Response> {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return json({ ok: false, error: "method_not_allowed" }, 405);
  }

  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return json({ ok: false, error: "bad_json" }, 400);
  }

  // Minimal validation
  const name = (body.name || "").toString().trim();
  const contact = (body.contact || "").toString().trim();
  if (!name || !contact) {
    return json({ ok: false, error: "missing_fields" }, 400);
  }
  if (name.length > 200 || contact.length > 200) {
    return json({ ok: false, error: "too_long" }, 400);
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram env vars missing");
    return json({ ok: false, error: "server_not_configured" }, 500);
  }

  const who = (body.who || "").toString().trim().slice(0, 500);
  const need = (body.need || "").toString().trim().slice(0, 2000);
  const result = (body.result || "").toString().trim().slice(0, 2000);

  const text =
    `🌊 *Новий запит з Mint Coaching*\n\n` +
    `*Ім'я:* ${escapeMd(name)}\n` +
    `*Контакт:* ${escapeMd(contact)}\n` +
    (who ? `\n*Хто / чим займається:*\n${escapeMd(who)}\n` : "") +
    (need ? `\n*Що потрібно:*\n${escapeMd(need)}\n` : "") +
    (result ? `\n*Бажаний результат:*\n${escapeMd(result)}\n` : "");

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        }),
      },
    );

    if (!tgRes.ok) {
      const t = await tgRes.text();
      console.error("Telegram API error:", tgRes.status, t);
      return json({ ok: false, error: "telegram_failed" }, 502);
    }

    return json({ ok: true }, 200);
  } catch (err) {
    console.error("Network error to Telegram:", err);
    return json({ ok: false, error: "network_error" }, 502);
  }
}

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

// Escape Telegram Markdown special chars
function escapeMd(s: string): string {
  return s.replace(/([_*`\[\]])/g, "\\$1");
}
