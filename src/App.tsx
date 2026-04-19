import { useEffect, useMemo, useState, type CSSProperties } from "react";

export default function App() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  // -------- Video loader (tries several paths) --------
  useEffect(() => {
    let isActive = true;
    const candidates = ["/1.mp4", "1.mp4"];
    let currentVideo: HTMLVideoElement | null = null;

    const tryCandidate = (index: number) => {
      if (!isActive) return;
      if (index >= candidates.length) {
        setVideoSrc(null);
        return;
      }

      const candidate = candidates[index];
      const video = document.createElement("video");
      currentVideo = video;
      video.preload = "metadata";
      video.muted = true;
      video.playsInline = true;

      const cleanup = () => {
        video.removeEventListener("loadeddata", handleLoaded);
        video.removeEventListener("error", handleError);
      };

      const handleLoaded = () => {
        cleanup();
        if (isActive) setVideoSrc(candidate);
      };

      const handleError = () => {
        cleanup();
        tryCandidate(index + 1);
      };

      video.addEventListener("loadeddata", handleLoaded);
      video.addEventListener("error", handleError);
      video.src = candidate;
      video.load();
    };

    tryCandidate(0);

    return () => {
      isActive = false;
      if (currentVideo) {
        currentVideo.pause();
        currentVideo.removeAttribute("src");
        currentVideo.load();
      }
    };
  }, []);

  // -------- Scroll progress for depth effect --------
  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const raw = pageHeight > 0 ? window.scrollY / pageHeight : 0;
      setScrollProgress(Math.max(0, Math.min(1, raw)));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // -------- Content data (unchanged) --------
  const packages = [
    {
      name: "Фокус",
      subtitle: "Для тих, кому потрібен сильний, але більш спокійний формат супроводу.",
      price: "€1200 / 90 днів",
      features: [
        "4 сесії протягом 90 днів",
        "Короткі підсумки після зустрічей",
        "Легка підтримка між сесіями",
      ],
      highlighted: false,
    },
    {
      name: "Опора",
      subtitle:
        "Основний формат для тих, хто хоче повноцінну роботу над ясністю, фокусом, внутрішньою опорою і рішеннями.",
      price: "€1650 / 90 днів",
      features: [
        "6 сесій протягом 90 днів",
        "Підсумок після кожної сесії",
        "Підтримка між сесіями у робочі дні",
        "Проміжна ревізія фокусу",
        "Фінальна ревізія прогресу",
      ],
      highlighted: true,
      badge: "Найчастіше обирають",
    },
    {
      name: "Приватний супровід",
      subtitle:
        "Для фаундерів, підприємців і клієнтів із вищим рівнем складності та навантаження, яким потрібен щільніший формат стратегічної підтримки.",
      price: "€2400 / 90 днів",
      features: [
        "6 сесій протягом 90 днів",
        "Пріоритетна підтримка між сесіями",
        "Короткі decision check-ins",
        "Одна додаткова коротка сесія за потреби",
        "Глибший рівень стратегічного супроводу",
      ],
      highlighted: false,
    },
  ];

  const audience = [
    {
      title: "Підприємці",
      text: "Для тих, хто будує свій напрям і хоче більше ясності, фокусу та стратегічної структури в русі.",
    },
    {
      title: "Фаундери та стартапери",
      text: "Для тих, хто живе в невизначеності, постійних рішеннях і ранньому рості та потребує сильного thinking partner.",
    },
    {
      title: "Власники невеликих бізнесів",
      text: "Для тих, у кого бізнес уже є, але він досі занадто залежить від особистого перевантаження, реактивних рішень або нестачі системності.",
    },
    {
      title: "Сильні експерти",
      text: "Для тих, хто готовий до нового рівня і хоче рухатися туди не через надрив, а через ясність, глибину і більш усвідомлений ритм.",
    },
  ];

  const problems = [
    "Коли немає реального простору подумати з кимось на рівних",
    "Коли стратегія існує фрагментами, але ще не має чіткої робочої форми",
    "Коли щоденний операційний шум постійно краде фокус від більшої картини",
    "Коли важливі рішення висять і непомітно забирають енергію",
    "Коли бізнес або практика рухаються, але поки не системно",
    "Коли внутрішня опора стає нестабільною під тиском або невизначеністю",
    "Коли хочеться амбітного руху без побудови всього через постійний надрив",
  ];

  const testimonials = [
    "Після роботи з Ксенією в мене стало значно менше внутрішнього шуму і значно більше ясності щодо того, що насправді важливо.",
    "Для мене це було не просто про коучинг. Це було про внутрішню опору, сильніші рішення і більш спокійний рух уперед.",
    "Найбільше відгукнулося поєднання глибини, структури і відчуття, що мені не потрібно продавлювати все через постійний тиск.",
  ];

  const faqs = [
    {
      q: "Чи можна почати лише з однієї зустрічі?",
      a: "Так. Для цього і створена стратегічна сесія — як сфокусований одноразовий простір для ясності, напрямку і сильного наступного кроку.",
    },
    {
      q: "Чим стратегічна сесія відрізняється від звичайної консультації?",
      a: "Це структурований простір для стратегічного мислення. Мета не просто поговорити, а побачити реальну ситуацію ясніше і сформувати робочі наступні кроки.",
    },
    {
      q: "Чи обов'язково після цього йти в 90-денний формат?",
      a: "Ні. Але якщо у вашій ситуації є глибший перехід, вища складність або потреба в стійкому русі, 90-денний формат зазвичай дає значно сильніший результат.",
    },
    {
      q: "Чи твій підхід є evidence-based?",
      a: "Так. Моя робота спирається на стандарти ICF, психологію праці та управління, а також на постійно оновлювані evidence-based інсайти на перетині нейронауки та когнітивної психології.",
    },
  ];

  // -------- Scroll-derived visuals (reference-zip model) --------
  // Upper glow fades out as user scrolls down
  const upperGlowOpacity = Math.max(0, 1 - scrollProgress * 2.3);
  // Deep abyss overlay strengthens as user scrolls down
  const deepOverlayOpacity = Math.min(scrollProgress * 0.55, 0.55);
  // Header becomes opaque + blurred after slight scroll
  const headerScrolled = scrollProgress > 0.015;

  const bgStyle: CSSProperties = useMemo(
    () => ({
      background:
        "linear-gradient(to bottom, #DDF7F8 0%, #8FE4EC 8%, #29C4D8 18%, #148AA6 28%, #0B5E7A 40%, #07374E 55%, #06273B 70%, #031827 85%, #020E17 100%)",
    }),
    [],
  );

  const bgAccentsStyle: CSSProperties = useMemo(
    () => ({
      background: [
        "radial-gradient(ellipse 80% 40% at 50% 5%, rgba(141,228,236,0.28) 0%, transparent 70%)",
        "radial-gradient(ellipse 60% 30% at 25% 20%, rgba(84,215,230,0.14) 0%, transparent 60%)",
        "radial-gradient(ellipse 55% 55% at 75% 55%, rgba(6,39,59,0.55) 0%, transparent 80%)",
        "radial-gradient(ellipse 90% 55% at 50% 92%, rgba(2,14,23,0.85) 0%, transparent 100%)",
      ].join(", "),
    }),
    [],
  );

  const upperGlowStyle: CSSProperties = {
    background:
      "radial-gradient(ellipse 100% 60% at 50% -5%, rgba(141,228,236,0.22) 0%, transparent 65%)",
    opacity: upperGlowOpacity,
    transition: "opacity 0.1s linear",
  };

  const depthOverlayStyle: CSSProperties = {
    background: `linear-gradient(to bottom, transparent 0%, rgba(2,14,23,${deepOverlayOpacity}) 100%)`,
    transition: "opacity 0.1s linear",
  };

  const grainStyle: CSSProperties = {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
    backgroundRepeat: "repeat",
    backgroundSize: "220px 220px",
    opacity: 0.035,
  };

  const heroAmbientGlow: CSSProperties = {
    background:
      "radial-gradient(circle at center, rgba(84,215,230,0.25), transparent 55%)",
  };

  const videoAmbientStyle: CSSProperties = {
    background: [
      "radial-gradient(circle at 50% 14%, rgba(141,228,236,0.22), transparent 24%)",
      "radial-gradient(circle at 50% 48%, rgba(41,196,216,0.15), transparent 34%)",
      "radial-gradient(circle at 50% 86%, rgba(3,24,39,0.95), rgba(2,14,23,1))",
    ].join(", "),
  };

  const headerStyle: CSSProperties = {
    background: headerScrolled ? "rgba(3, 24, 39, 0.82)" : "transparent",
    backdropFilter: headerScrolled ? "blur(20px)" : "none",
    WebkitBackdropFilter: headerScrolled ? "blur(20px)" : "none",
    borderBottom: headerScrolled
      ? "1px solid rgba(143,228,236,0.08)"
      : "1px solid transparent",
  };

  // -------- Form handler --------
  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("sending");
    const data = new FormData(e.currentTarget);
    const payload = {
      name: data.get("name")?.toString() ?? "",
      contact: data.get("contact")?.toString() ?? "",
      who: data.get("who")?.toString() ?? "",
      need: data.get("need")?.toString() ?? "",
      result: data.get("result")?.toString() ?? "",
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("send failed");
      setFormStatus("ok");
      (e.currentTarget as HTMLFormElement).reset();
    } catch {
      setFormStatus("err");
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden text-[#DDF7F8]" style={{ backgroundColor: "#020E17" }}>
      {/* -------- DEPTH BACKGROUND STACK (fixed, reference model) -------- */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -4, ...bgStyle }} />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -3, ...bgAccentsStyle }} />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -2, ...grainStyle }} />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1, ...upperGlowStyle }} />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1, ...depthOverlayStyle }} />

      {/* -------- HEADER -------- */}
      <header className="sticky top-0 z-50 transition-all duration-500" style={headerStyle}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#home" className="flex items-center gap-3 no-underline group">
            <div className="relative w-8 h-8">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="16,2 28,12 24,30 8,30 4,12" fill="none" stroke="rgba(84,215,230,0.85)" strokeWidth="1.2" />
                <polygon points="16,2 28,12 16,8" fill="rgba(84,215,230,0.14)" />
                <polygon points="16,2 4,12 16,8" fill="rgba(41,196,216,0.12)" />
                <line x1="16" y1="8" x2="28" y2="12" stroke="rgba(84,215,230,0.35)" strokeWidth="0.8" />
                <line x1="16" y1="8" x2="4" y2="12" stroke="rgba(84,215,230,0.35)" strokeWidth="0.8" />
                <line x1="16" y1="8" x2="16" y2="30" stroke="rgba(84,215,230,0.22)" strokeWidth="0.8" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-light tracking-[0.22em] text-[#DDF7F8]">MINT</span>
              <span className="text-[9px] font-light tracking-[0.28em] text-[#8FE4EC]/60 mt-0.5">COACHING</span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-7 uppercase">
            <a href="#home" className="nav-link">Головна</a>
            <a href="#about" className="nav-link">Про мене</a>
            <a href="#strategic-session" className="nav-link">Стратегічна сесія</a>
            <a href="#coaching" className="nav-link">90-денний супровід</a>
            <a href="#contact" className="nav-link">Контакт</a>
            <a href="#for-coaches" className="nav-link" style={{ color: "rgba(84,215,230,0.5)", fontSize: "0.72rem" }}>
              For coaches & experts
            </a>
          </nav>

          <a
            href="#strategic-session"
            className="hidden lg:inline-flex btn-primary rounded-full px-5 py-2.5 text-xs font-medium tracking-wider"
          >
            Записатися
          </a>
        </div>
      </header>

      {/* -------- MAIN -------- */}
      <main className="relative" style={{ zIndex: 2 }}>
        {/* ======== HOME / HERO ======== */}
        <section id="home" className="relative pb-24 pt-10 md:pb-32 md:pt-16">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center rounded-full px-4 py-2 text-xs tracking-[0.18em] backdrop-blur-xl"
                style={{
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "rgba(143,228,236,0.22)",
                  background: "rgba(84,215,230,0.06)",
                  color: "rgba(221,247,248,0.88)",
                }}>
                Ksenia Naraievska · Executive Coach · ICF
              </div>
              <h1 className="font-display max-w-4xl text-4xl font-light leading-[1.02] tracking-[-0.02em] text-white md:text-6xl lg:text-7xl text-glow">
                Ясність для глибшого мислення.
                <br />
                <span style={{ color: "#8FE4EC", fontStyle: "italic" }}>Напрямок для стратегічної дії.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 md:text-xl" style={{ color: "rgba(221,247,248,0.8)" }}>
                Стратегічний коучинг для фаундерів, підприємців, власників невеликих бізнесів і сильних експертів, яким потрібен простір, щоб мислити ясніше, приймати робочі рішення і рухатися вперед із більшим фокусом, внутрішньою опорою та стратегічним напрямком.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a href="#strategic-session" className="btn-primary inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-medium">
                  Записатися на стратегічну сесію
                </a>
                <a href="#packages" className="btn-secondary inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-medium">
                  Подати запит на супровід
                </a>
              </div>
              <div className="mt-6 text-sm" style={{ color: "rgba(143,228,236,0.68)" }}>
                Think deeper. Act strategically.
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 scale-110 rounded-[2rem] blur-3xl" style={heroAmbientGlow} />
              <div
                className="relative rounded-[2.2rem] p-3 md:p-4 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-[3px]"
                style={{
                  border: "1px solid rgba(143,228,236,0.18)",
                  background: "rgba(11,94,122,0.14)",
                }}
              >
                <div
                  className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[1.8rem] md:aspect-[5/6]"
                  style={{ background: "#031827" }}
                >
                  <div className="absolute inset-0" style={videoAmbientStyle} />
                  {videoSrc ? (
                    <video
                      className="relative z-10 h-full w-full object-cover opacity-95 mix-blend-screen"
                      autoPlay
                      muted
                      loop
                      playsInline
                      src={videoSrc}
                    />
                  ) : (
                    <div className="relative z-10 flex h-full w-full items-center justify-center px-8 text-center">
                      <div>
                        <div className="mx-auto h-24 w-24 rounded-full"
                          style={{ border: "1px solid rgba(143,228,236,0.2)", background: "rgba(84,215,230,0.06)" }} />
                        <p className="mt-6 text-sm uppercase tracking-[0.22em]" style={{ color: "rgba(143,228,236,0.62)" }}>
                          Hero video placeholder
                        </p>
                        <p className="mx-auto mt-3 max-w-sm text-sm leading-6" style={{ color: "rgba(221,247,248,0.52)" }}>
                          Покладіть файл <code>1.mp4</code> у папку <code>public/</code>.
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#031827] via-[#031827]/55 to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#031827] via-[#031827]/75 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======== ABOUT INTRO (Human + strategic) ======== */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <div className="glass-card rounded-[2rem] px-8 py-10 md:px-12 md:py-14">
              <p className="section-eyebrow">Human + strategic</p>
              <h2 className="font-display mt-4 max-w-4xl text-3xl font-light tracking-[-0.02em] text-white md:text-5xl">
                Мене зазвичай залучають тоді, коли потрібно одночасно бачити і людський, і стратегічний бік роботи.
              </h2>
              <div className="mt-8 grid gap-10 text-lg leading-8 md:grid-cols-2" style={{ color: "rgba(221,247,248,0.82)" }}>
                <p>
                  Те, що я часто приношу в роботу – це здатність помічати патерни, які не завжди очевидні з першого погляду, ставити правильні запитання і переводити невизначеність у ясні, робочі рішення.
                </p>
                <p>
                  Це може бути фаундер, який формує новий напрям, підприємець, що втрачає фокус у щоденному русі, або сильний експерт, якому потрібен реальний простір подумати перед наступним кроком.
                </p>
              </div>
              <p className="mt-8 max-w-4xl text-lg leading-8 text-[#EEFBFC] md:text-xl">
                Тут робота не про тиск заради тиску. Вона про глибше мислення, стратегічну ясність і більш зібраний спосіб рухатися вперед.
              </p>
            </div>
          </div>
        </section>

        {/* ======== AUDIENCE ======== */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-3xl">
              <p className="section-eyebrow">Для кого</p>
              <h2 className="font-display mt-4 text-3xl font-light tracking-[-0.02em] text-white md:text-5xl">
                Для людей, які будують щось реальне
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {audience.map((item) => (
                <div key={item.title} className="glass-card rounded-[1.75rem] p-7">
                  <h3 className="text-xl font-medium text-white">{item.title}</h3>
                  <p className="mt-4 leading-7" style={{ color: "rgba(221,247,248,0.76)" }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======== PROBLEMS ======== */}
        <section className="py-16 md:py-24">
          <div className="mx-auto grid max-w-7xl items-start gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="section-eyebrow">З чим я допомагаю</p>
              <h2 className="font-display mt-4 text-3xl font-light tracking-[-0.02em] text-white md:text-5xl">
                Від невизначеності до робочого напрямку
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {problems.map((item) => (
                <div key={item} className="glass-card-subtle rounded-3xl px-5 py-5 leading-7" style={{ color: "rgba(238,251,252,0.85)" }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======== RESULTS / WHAT CHANGES ======== */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="glass-card rounded-[2rem] p-8 md:p-12">
              <p className="section-eyebrow">Що змінюється</p>
              <h2 className="font-display mt-4 text-3xl font-light tracking-[-0.02em] text-white md:text-5xl">
                Більше ясності. Сильніші рішення. Більш зібраний рух уперед.
              </h2>
              <div className="mt-8 grid gap-6 text-lg leading-8 md:grid-cols-2" style={{ color: "rgba(221,247,248,0.82)" }}>
                <p>
                  У спільній роботі складність стає легшою для утримання. Патерни стають видимішими. Різниця між шумом і тим, що насправді важливо, стає чіткішою.
                </p>
                <p>
                  Ви рухаєтесь із більшим фокусом, більшою внутрішньою опорою і сильнішим стратегічним напрямком – без потреби будувати все через постійний тиск.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======== STRATEGIC SESSION ======== */}
        <section id="strategic-session" className="py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl items-stretch gap-8 px-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="glass-card rounded-[2rem] p-8 md:p-10">
              <p className="section-eyebrow">Стратегічна сесія</p>
              <h2 className="font-display mt-4 text-3xl font-light tracking-[-0.02em] text-white md:text-5xl">
                Сфокусований простір, щоб думати глибше і бачити ясніше
              </h2>
              <p className="mt-6 text-lg leading-8" style={{ color: "rgba(221,247,248,0.82)" }}>
                Разова глибока зустріч, щоб винести все з голови назовні, ясніше побачити ситуацію і визначити найважливіший фокус на наступний етап.
              </p>
              <p className="mt-6 leading-8 text-[#EEFBFC]">
                Це не вступний дзвінок і не casual conversation. Це структурований простір для стратегічного мислення в той момент, коли вам потрібні ясність, напрямок і зовнішній розум, який допоможе перевести складність у наступні кроки.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm" style={{ color: "rgba(143,228,236,0.7)" }}>Вартість</div>
                  <div className="font-display text-3xl font-light text-white">€100</div>
                </div>
                <a href="#contact" className="btn-primary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium">
                  Записатися
                </a>
              </div>
            </div>
            <div className="glass-card-subtle rounded-[2rem] p-8 md:p-10">
              <h3 className="font-display text-2xl font-light tracking-[-0.02em] text-white md:text-3xl">
                Що відбувається всередині сесії
              </h3>
              <div className="mt-8 space-y-4 text-lg leading-8" style={{ color: "rgba(221,247,248,0.82)" }}>
                <div>– Ми розпаковуємо реальну ситуацію під поверхнею</div>
                <div>– Відділяємо сигнали від шуму</div>
                <div>– Визначаємо, що насправді створює напругу або блокує рух</div>
                <div>– Формуємо 2–3 ключові зони фокусу</div>
                <div>– Складаємо ясний наступний крок або робочий напрямок</div>
              </div>
              <div className="mt-10 glass-card-dark rounded-[1.5rem] p-6 leading-8" style={{ color: "rgba(238,251,252,0.88)" }}>
                Включено: анкета до сесії, 75 хвилин глибокої роботи, короткий письмовий підсумок після зустрічі.
              </div>
            </div>
          </div>
        </section>

        {/* ======== 90-DAY COACHING INTRO ======== */}
        <section id="coaching" className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <p className="section-eyebrow">Основний формат</p>
            <h2 className="font-display mt-4 text-3xl font-light tracking-[-0.02em] text-white md:text-5xl">
              90-денний супровід
            </h2>
            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 md:text-xl" style={{ color: "rgba(221,247,248,0.82)" }}>
              Мій основний формат для людей, яким потрібен не лише інсайт, а більш стійка зміна в тому, як вони мислять, приймають рішення і рухаються вперед.
            </p>
            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-[#EEFBFC]">
              За 90 днів робота встигає перейти від рефлексії до реальних змін. Ми не лише розбираємося в тому, що перевантажує чи розфокусовує, а вибудовуємо ясніші рішення, кращий фокус, сильнішу внутрішню опору і більш робочий напрямок.
            </p>
          </div>
        </section>

        {/* ======== PACKAGES ======== */}
        <section id="packages" className="py-10 md:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="section-eyebrow">Формати</p>
                <h2 className="font-display mt-4 text-3xl font-light tracking-[-0.02em] text-white md:text-5xl">
                  Пакети 90-денного супроводу
                </h2>
              </div>
            </div>
            <div className="grid items-stretch gap-6 xl:grid-cols-3">
              {packages.map((pkg) => {
                const className = pkg.highlighted
                  ? "glass-card-featured rounded-[2rem] p-8 md:p-9 scale-[1.01]"
                  : "glass-card rounded-[2rem] p-8 md:p-9";

                return (
                  <div key={pkg.name} className={className}>
                    <div className="min-h-[28px]">
                      {pkg.badge ? <span className="tag-badge">{pkg.badge}</span> : null}
                    </div>
                    <h3 className="mt-4 text-2xl font-medium text-white">{pkg.name}</h3>
                    <p className="mt-4 leading-7" style={{ color: "rgba(221,247,248,0.76)" }}>{pkg.subtitle}</p>
                    <div className="font-display mt-6 text-3xl font-light text-white">{pkg.price}</div>
                    <div className="mt-6 h-px" style={{ background: "rgba(143,228,236,0.12)" }} />
                    <ul className="mt-6 space-y-3 leading-7" style={{ color: "rgba(238,251,252,0.86)" }}>
                      {pkg.features.map((feature) => (
                        <li key={feature}>– {feature}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ======== HOW IT WORKS ======== */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="glass-card rounded-[2rem] p-8 md:p-12">
              <p className="section-eyebrow">Процес</p>
              <h2 className="font-display mt-4 text-3xl font-light tracking-[-0.02em] text-white md:text-5xl">
                Як розгортається робота
              </h2>
              <div className="mt-10 grid gap-5 md:grid-cols-4">
                {[
                  ["Стратегічна ясність", "Починаємо зі стратегічної сесії або первинного запиту і створюємо достатньо простору, щоб побачити ситуацію ясніше."],
                  ["Робочий фокус", "Потім визначаємо головний напрямок, ключові рішення і те, де ваша реальна увага зараз потрібна найбільше."],
                  ["Стійкий рух", "У форматі супроводу працюємо з рішеннями, внутрішньою опорою, ритмом, пріоритетами і більш зібраним рухом уперед."],
                  ["Інтеграція", "Мета не лише в інсайті, а в більш стійкому способі мислити, вирішувати і рухатися в реальному житті."],
                ].map(([title, text]) => (
                  <div key={title} className="glass-card-subtle rounded-[1.5rem] p-6">
                    <h3 className="text-lg font-medium text-white">{title}</h3>
                    <p className="mt-3 leading-7" style={{ color: "rgba(221,247,248,0.78)" }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ======== ABOUT ME ======== */}
        <section id="about" className="py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="section-eyebrow">Про мене</p>
              <h2 className="font-display mt-4 text-3xl font-light tracking-[-0.02em] text-white md:text-5xl">
                Ксенія Нараєвська
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-8" style={{ color: "rgba(221,247,248,0.82)" }}>
              <p>
                Понад 10 років я працюю в просторах, де природно перетинаються людський і стратегічний виміри роботи – HR, IT recruitment, leadership support, executive coaching, team development і побудова нових напрямків.
              </p>
              <p>
                Мій бекграунд поєднує вищу освіту з психології праці та управління з коучингом, grounded in ICF standards, а також evidence-based підходами на перетині нейронауки та когнітивної психології.
              </p>
              <p>
                Я схильна помічати патерни, які не завжди очевидні з першого погляду, ставити правильні запитання і переводити невизначеність у ясність та конкретні наступні кроки. Особливо мені близькі фаундери, підприємці та експерти, які будують щось реальне і хочуть робити це з більшою глибиною, структурою та внутрішньою опорою.
              </p>
            </div>
          </div>
        </section>

        {/* ======== TESTIMONIALS ======== */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="section-eyebrow">Відгуки</p>
                <h2 className="font-display mt-4 text-3xl font-light tracking-[-0.02em] text-white md:text-5xl">
                  Що помічають клієнти
                </h2>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((item, idx) => (
                <div key={idx} className="glass-card rounded-[1.8rem] p-7">
                  <div className="font-display text-5xl leading-none" style={{ color: "#8FE4EC" }}>"</div>
                  <p className="mt-4 leading-8" style={{ color: "rgba(238,251,252,0.86)" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======== FAQ ======== */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <p className="section-eyebrow">FAQ</p>
            <h2 className="font-display mt-4 text-3xl font-light tracking-[-0.02em] text-white md:text-5xl">
              Поширені запитання
            </h2>
            <div className="mt-10 space-y-4">
              {faqs.map((item) => (
                <details key={item.q} className="glass-card-subtle group rounded-[1.5rem] p-6 open:bg-[rgba(11,94,122,0.2)]">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-lg font-medium text-white">
                    {item.q}
                    <span className="text-xl transition-transform group-open:rotate-45" style={{ color: "#8FE4EC" }}>+</span>
                  </summary>
                  <p className="mt-4 leading-8" style={{ color: "rgba(221,247,248,0.78)" }}>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ======== FOR COACHES & EXPERTS ======== */}
        <section id="for-coaches" className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="glass-card-dark rounded-[2rem] p-8 md:p-12">
              <div className="max-w-3xl">
                <p className="section-eyebrow">For coaches & experts</p>
                <h2 className="font-display mt-4 text-3xl font-light tracking-[-0.02em] text-white md:text-5xl">
                  Окремий напрям для коучів, консультантів і експертів
                </h2>
                <p className="mt-6 text-lg leading-8" style={{ color: "rgba(221,247,248,0.82)" }}>
                  Це окремий напрям моєї роботи для коучів, консультантів і експертів, яким потрібна підтримка з AI-інструментами, структурою workflow, асистентами, матеріалами, гайдами або новими продуктовими напрямками.
                </p>
              </div>
              <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="glass-card-subtle rounded-[1.7rem] p-7">
                  <h3 className="text-xl font-medium text-white">Що можливо</h3>
                  <ul className="mt-5 space-y-3 leading-7" style={{ color: "rgba(238,251,252,0.86)" }}>
                    <li>– Індивідуальна консультація</li>
                    <li>– Воркшопи</li>
                    <li>– Налаштування AI-асистента</li>
                    <li>– Допомога зі структурою workflow</li>
                    <li>– Гайди, шаблони, матеріали</li>
                    <li>– Практична логіка використання ChatGPT та інших інструментів під ваші реальні задачі</li>
                  </ul>
                </div>
                <form onSubmit={onSubmitForm} className="glass-card rounded-[1.7rem] p-7 space-y-4">
                  <input name="name" required className="form-field" placeholder="Ім'я" />
                  <input name="contact" required className="form-field" placeholder="Email / Telegram" />
                  <input name="who" className="form-field" placeholder="Хто ви і чим займаєтесь" />
                  <textarea name="need" rows={4} className="form-field resize-none" placeholder="Що саме вам потрібно" />
                  <textarea name="result" rows={4} className="form-field resize-none" placeholder="Який результат хочете отримати" />
                  <button
                    type="submit"
                    disabled={formStatus === "sending"}
                    className="btn-primary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium w-full sm:w-auto"
                  >
                    {formStatus === "sending" ? "Відправляється..." : "Надіслати запит"}
                  </button>
                  {formStatus === "ok" && (
                    <p className="text-sm" style={{ color: "#8FE4EC" }}>
                      Дякую. Ваш запит отримано — я зв'яжуся з вами найближчим часом.
                    </p>
                  )}
                  {formStatus === "err" && (
                    <p className="text-sm" style={{ color: "#F2A4A4" }}>
                      Не вдалося надіслати запит. Спробуйте ще раз або напишіть мені напряму в Telegram.
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ======== CONTACT / FINAL CTA ======== */}
        <section id="contact" className="py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <div className="glass-card rounded-[2rem] px-8 py-12 md:px-12 md:py-16">
              <p className="section-eyebrow">Direction</p>
              <h2 className="font-display mt-4 text-3xl font-light tracking-[-0.02em] text-white md:text-5xl text-glow">
                Think deeper.
                <br />
                <span style={{ color: "#8FE4EC", fontStyle: "italic" }}>Act strategically.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-8" style={{ color: "rgba(221,247,248,0.82)" }}>
                Іноді однієї сильної розмови достатньо, щоб складність стала яснішою. А іноді реальний зсув створює саме супровід, у якому мислення, рішення і напрямок з часом стають сильнішими.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <a href="#strategic-session" className="btn-primary inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-medium">
                  Записатися на стратегічну сесію
                </a>
                <a href="#for-coaches" className="btn-secondary inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-medium">
                  Подати запит на супровід
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* -------- FOOTER -------- */}
      <footer className="relative border-t" style={{ zIndex: 2, borderColor: "rgba(143,228,236,0.08)", background: "rgba(3,24,39,0.55)", backdropFilter: "blur(16px)" }}>
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
          <div>
            <div className="text-sm font-medium uppercase tracking-[0.26em] text-[#DDF7F8]">Mint Coaching</div>
            <div className="mt-3 text-sm" style={{ color: "rgba(210,242,245,0.66)" }}>Think deeper. Act strategically.</div>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-sm" style={{ color: "rgba(230,251,252,0.74)" }}>
            <a href="#contact" className="transition-colors hover:text-white">Email</a>
            <a href="#contact" className="transition-colors hover:text-white">Telegram</a>
            <a href="#contact" className="transition-colors hover:text-white">LinkedIn</a>
            <a href="#contact" className="transition-colors hover:text-white">Instagram</a>
            <a href="#for-coaches" className="transition-colors hover:text-white" style={{ color: "rgba(210,242,245,0.6)" }}>
              For coaches & experts
            </a>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 pb-6 text-xs" style={{ color: "rgba(210,242,245,0.4)" }}>
          © 2026 Kseniia Naraievska. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
