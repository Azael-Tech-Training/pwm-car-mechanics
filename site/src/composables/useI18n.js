import { ref, computed, watchEffect } from 'vue'

const STORAGE_KEY = 'pwm-lang'

function getInitialLang() {
  if (typeof window === 'undefined') return 'es'
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'es' || saved === 'en') return saved
  } catch {
    // ignore storage errors
  }
  return 'es'
}

const lang = ref(getInitialLang())

watchEffect(() => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang.value
  }
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang.value)
    } catch {
      // ignore storage errors
    }
  }
})

export const MESSAGES = {
  es: {
    siteName: 'PWM Car Mechanics',
    nav: {
      hub: 'Inicio',
      lessons: 'Lecciones',
      diagrams: 'Diagramas',
      reference: 'Recursos',
      presentation: 'Presentación',
      ariaPrimary: 'Navegación principal',
      ariaLang: 'Seleccionar idioma',
    },
    footer: {
      tagline: 'Fuente única de verdad para teoría, diagnóstico y diagramas interactivos de PWM automotriz.',
      hub: 'Inicio',
      lessons: '8 Lecciones',
      diagrams: 'Diagramas Compartidos',
      reference: 'Recursos y Guía',
      presentation: 'Presentación Slidev ↗',
    },
    landing: {
      titleMeta: 'PWM Car Mechanics — Centro de Aprendizaje y Presentación',
      kicker: 'FUENTE ÚNICA DE VERDAD · ELECTRÓNICA AUTOMOTRIZ',
      heroPrefix: 'Domina los Sistemas ',
      heroAccent: 'PWM Automotrices',
      heroSuffix: ' — Un Solo Centro, Diagramas Compartidos.',
      heroLead:
        'Navega sin fricción entre el <strong>Sitio de Aprendizaje</strong> (8 lecciones interconectadas y guía de diagnóstico) y la <strong>Presentación Interactiva en Slidev</strong>, ambos impulsados exactamente por los mismos simuladores de circuitos y osciloscopios.',
      ctaLessons: 'Explorar Sitio de Aprendizaje (8 Lecciones) →',
      ctaPresentation: 'Abrir Presentación Slidev ↗',
      ctaDiagrams: 'Ver Diagramas Compartidos',
      pathsKicker: 'ELIGE TU EXPERIENCIA',
      pathsHeading: 'Dos Sitios, Una Sola Fuente de Verdad',
      cardSiteBadge: 'SITIO DE APRENDIZAJE',
      cardSiteCount: '8 Lecciones + Lab',
      cardSiteTitle: 'Currículo Interactivo y Lecciones Guiadas',
      cardSiteDesc:
        'Avanza paso a paso desde pérdidas en resistencias y conmutación MOSFET hasta pruebas con osciloscopio, física de fusibles, lazo cerrado en el ECU y bombas de combustible sin retorno.',
      cardSiteBullets: [
        'Navegación conectada de la Lección 01 a la Lección 08',
        'Simuladores interactivos integrados y 16 preguntas de repaso',
        'Guía de referencia y recursos de diagnóstico automotriz',
      ],
      cardSiteCta: 'Ir al Sitio de Aprendizaje →',
      cardDeckBadge: 'PRESENTACIÓN · SLIDEV',
      cardDeckCount: '27 Diapositivas',
      cardDeckTitle: 'PWM en Sistemas Automotrices (Presentación)',
      cardDeckDesc:
        'Presentación interactiva lista para exponer en vivo con revelaciones progresivas, ecuaciones matemáticas, cuestionarios para la audiencia y los mismos simuladores compartidos.',
      cardDeckBullets: [
        'Se ejecuta en /presentation/ con controles de presentador',
        'Consume los mismos componentes compartidos de @pwm/shared',
        'Barra discreta para volver al Inicio, Lecciones o Diagramas',
      ],
      cardDeckCta: 'Abrir Presentación ↗',
      cardDiagBadge: 'FUENTE ÚNICA · 8 SIMULADORES',
      cardDiagTitle: 'Galería de Diagramas Interactivos',
      cardDiagDesc:
        'Explora y prueba los 8 esquemas SVG calibrados, manómetros y osciloscopios en un solo lugar, disponibles en Español e Inglés.',
      cardRefBadge: 'RECURSOS Y REFERENCIA',
      cardRefTitle: 'Guía Rápida de PWM y Diagnóstico',
      cardRefDesc:
        'Ecuaciones esenciales, tabla de frecuencias automotrices (10 Hz–20 kHz), listas de verificación para DMM/Osciloscopio y recursos recomendados.',
      teaserKicker: 'EN VIVO DESDE @PWM/SHARED',
      teaserHeading: 'Prueba un Diagrama Compartido Aquí Mismo',
      teaserSub:
        'Este mismo componente se renderiza en la Lección 01 y en la Diapositiva 3 de la Presentación: un solo código, cero inconsistencias.',
      roadmapKicker: 'MAPA DEL CURRÍCULO',
      roadmapHeading: 'Las 8 Lecciones Interconectadas',
      roadmapBtn: 'Ver Índice Completo →',
    },
    lessonsIndex: {
      titleMeta: 'Índice de Lecciones — PWM Car Mechanics',
      breadcrumbCurrent: 'Sitio de Aprendizaje',
      kicker: 'CURRÍCULO AUTO-GUIADO · 8 LECCIONES',
      heading: 'Ruta de Aprendizaje de PWM Automotriz',
      lead: 'Cada lección está conectada en secuencia, con su propio simulador interactivo compartido desde @pwm/shared y evaluación instantánea.',
      btnStart: 'Comenzar con la Lección 01 →',
      btnRef: 'Abrir Recursos y Guía',
      btnDeck: 'Ver como Presentación ↗',
      missionKicker: 'OBJETIVOS DE APRENDIZAJE',
      missionGoals: [
        'Explicar la diferencia entre el control PWM y el control resistivo tradicional en ingeniería automotriz.',
        'Medir y diagnosticar señales PWM (ciclo de trabajo, frecuencia, caídas de tierra) con multímetro y osciloscopio.',
        'Comprender el comportamiento ante cortos a tierra y el calentamiento Joule en fusibles en topologías low-side y high-side.',
        'Leer diagramas automotrices y rastrear circuitos cerrados del ECU desde sensores hasta actuadores.',
      ],
      simPrefix: 'Simulador:',
    },
    lessonView: {
      breadcrumbLessons: 'Lecciones',
      lessonLabel: 'Lección',
      lessonUpper: 'LECCIÓN',
      cheatSheet: 'Recursos',
      slideLabel: 'Diapositiva',
      quizKicker: 'COMPROBACIÓN DE CONOCIMIENTO',
      quizHeading: 'Pon a Prueba lo Aprendido',
      prevDir: '← Anterior',
      backDir: '← Volver',
      indexLabel: 'Índice de Lecciones',
      allLessons: 'Todas las Lecciones',
      nextDir: 'Siguiente Lección →',
      doneDir: '¡Completado! →',
      openCheatSheet: 'Abrir Recursos y Guía',
      notFoundTitle: 'Lección no encontrada',
      notFoundDesc: 'Elige cualquier lección desde el índice del currículo para continuar.',
      notFoundBtn: 'Volver al Índice',
    },
    diagrams: {
      titleMeta: 'Diagramas Interactivos Compartidos — PWM Car Mechanics',
      breadcrumbCurrent: 'Diagramas Compartidos',
      kicker: 'FUENTE ÚNICA DE VERDAD · @PWM/SHARED',
      heading: 'Diagramas Interactivos de PWM Automotriz',
      lead: 'Todos los diagramas viven una sola vez en packages/pwm-shared y alimentan tanto al Sitio de Aprendizaje como a la Presentación Slidev. Cambia el idioma para comprobar su sincronización.',
      diagramPrefix: 'DIAGRAMA',
      openLesson: 'Abrir Lección →',
    },
    reference: {
      titleMeta: 'Recursos y Guía Rápida de Diagnóstico PWM — PWM Car Mechanics',
      breadcrumbCurrent: 'Recursos y Guía',
      kicker: 'DOCUMENTO DE REFERENCIA · RECURSOS DE TALLER',
      heading: 'Guía Rápida de PWM y Diagnóstico Automotriz',
      lead: 'Referencia práctica con fórmulas clave, frecuencias típicas en vehículos, física de cortocircuitos, listas de verificación para multímetro/osciloscopio y recursos externos recomendados.',
      hEquations: 'Ecuaciones Fundamentales',
      eqDuty: 'Ciclo de Trabajo (%)',
      eqFreq: 'Frecuencia (Hz)',
      eqVavg: 'Voltaje Promedio (V)',
      hShorts: 'Cortocircuitos y Física de Fusibles',
      shortsList: [
        '<strong>Ley de Ohm en fallas:</strong> <code>I = V / R</code>. Cuando un cable de +12 V hace corto a chasis antes de la carga, la resistencia cae casi a cero (<code>R ≈ 0.05 Ω</code>) y la corriente se dispara a ~240 A al instante.',
        '<strong>Calentamiento Joule:</strong> <code>P = I² × R_fusible</code>. El calor crece con el cuadrado de la corriente: un ventilador sano de 6 A disipa solo <code>0.72 W</code> en un fusible de 0.02 Ω, mientras un corto de 240 A genera <code>1,152 W</code>, fundiendo el filamento en milisegundos.',
        '<strong>Corto en control Low-Side:</strong> Un corto a tierra <em>después</em> de la carga puentea el interruptor, pero la carga sigue en serie limitando la corriente. El fusible no se quema y el actuador queda encendido continuamente.',
        '<strong>Corto en control High-Side:</strong> Un corto a tierra <em>antes</em> de la carga omite por completo su resistencia. Al cerrarse el interruptor, los +12 V van directo a tierra y el fusible se funde al instante para evitar un incendio.',
      ],
      hFreqs: 'Frecuencias PWM Comunes en Automóviles',
      thComponent: 'Componente',
      thFreq: 'Frecuencia Típica',
      thStrategy: 'Estrategia de Conmutación',
      frequencies: [
        { component: 'Soplador de Cabina', freq: '100 Hz – 500 Hz', strategy: 'PWM Low-Side (el ciclo de trabajo regula la velocidad)' },
        { component: 'Ventilador de Radiador', freq: '100 Hz – 300 Hz', strategy: 'PWM Low-Side o High-Side (driver de alta corriente)' },
        { component: 'Bomba de Combustible', freq: '80 Hz (PCM) / 20 kHz (FPDM)', strategy: 'Control en dos etapas mediante módulo FPDM' },
        { component: 'Solenoide de Purga EVAP', freq: '10 Hz – 30 Hz', strategy: 'Conmutación lenta para dosificar vapores de gasolina' },
        { component: 'Cuerpo de Aceleración (ETC)', freq: '1 kHz – 5 kHz', strategy: 'Puente H bidireccional para posicionamiento preciso' },
        { component: 'Inyectores de Combustible', freq: 'Dinámica (según RPM)', strategy: 'El ancho de pulso controla directamente el volumen inyectado' },
      ],
      hChecklist: 'Lista de Verificación para Diagnóstico',
      hDmm: 'Usando un Multímetro Digital (DMM)',
      dmmList: [
        '<strong>Modo Voltaje DC:</strong> Mide <code>V_prom</code>. Útil para una prueba rápida: leer 6.0 V en un circuito de 12 V sugiere ~50% de ciclo de trabajo, pero oculta ruido y caídas de tierra.',
        '<strong>Modo Ciclo de Trabajo (%):</strong> Selecciona <code>Hz / %</code>. Conecta la punta negra a una buena tierra de batería y pincha por detrás la línea de señal con la roja.',
        '<strong>Modo Frecuencia (Hz):</strong> Confirma estabilidad de la portadora. Una lectura de <code>0 Hz</code> indica un extremo DC (0% o 100%) o una línea de control abierta.',
      ],
      hScope: 'Usando un Osciloscopio (PicoScope / Banco)',
      scopeList: [
        '<strong>Configuración de Canal:</strong> Acoplamiento DC. Escala vertical de <code>0–20 V</code> (o <code>5 V/div</code>) para actuadores de 12 V, y <code>0–10 V</code> para lógica/sensores de 5 V.',
        '<strong>Base de Tiempo:</strong> Para una señal de 100 Hz (período de 10 ms), usa <code>2 ms/div</code> o <code>5 ms/div</code> para ver 2 a 5 ciclos nítidos en pantalla.',
        '<strong>Disparo (Trigger):</strong> Modo Auto/Repeat en flanco de subida a la mitad de la amplitud pico (<code>6.0 V</code> en sistemas de 12 V).',
      ],
      hResources: 'Recursos Externos Recomendados',
      btnBackLessons: '← Volver a Todas las Lecciones',
      btnDiagrams: 'Abrir Diagramas Interactivos',
      btnPresentation: 'Abrir Presentación ↗',
    },
  },

  en: {
    siteName: 'PWM Car Mechanics',
    nav: {
      hub: 'Hub',
      lessons: 'Lessons',
      diagrams: 'Diagrams',
      reference: 'Resources',
      presentation: 'Presentation',
      ariaPrimary: 'Primary navigation',
      ariaLang: 'Select language',
    },
    footer: {
      tagline: 'Single Source of Truth for Automotive PWM Theory, Diagnostics & Interactive Diagrams.',
      hub: 'Hub',
      lessons: '8 Lessons',
      diagrams: 'Shared Diagrams',
      reference: 'Resources & Guide',
      presentation: 'Slidev Presentation ↗',
    },
    landing: {
      titleMeta: 'PWM Car Mechanics — Interactive Learning Hub & Presentation',
      kicker: 'SINGLE SOURCE OF TRUTH · AUTOMOTIVE ELECTRONICS',
      heroPrefix: 'Master Automotive ',
      heroAccent: 'PWM Systems',
      heroSuffix: ' — One Hub, Shared Diagrams.',
      heroLead:
        'Navigate seamlessly between the self-paced <strong>Learning Site</strong> (8 interconnected lessons + diagnostic cheat sheet) and the interactive <strong>Slidev Presentation</strong>, both powered by the exact same calibrated interactive circuit and oscilloscope simulators.',
      ctaLessons: 'Start Learning Site (8 Lessons) →',
      ctaPresentation: 'Launch Slidev Presentation ↗',
      ctaDiagrams: 'Explore Shared Diagrams',
      pathsKicker: 'CHOOSE YOUR PATH',
      pathsHeading: 'Two Experiences, One Unified Core',
      cardSiteBadge: 'LEARNING SITE',
      cardSiteCount: '8 Lessons + Lab',
      cardSiteTitle: 'Interactive Curriculum & Deep-Dive Lessons',
      cardSiteDesc:
        'Work step-by-step from series resistor losses and MOSFET switching topologies to oscilloscope fault probing, Joule fuse physics, ECU closed-loop control, and returnless fuel pumps.',
      cardSiteBullets: [
        'Interconnected Lesson 01 → Lesson 08 navigation',
        'Embedded interactive bench simulators & 16 quiz checks',
        'Dedicated PWM Basics & Diagnostics Cheat Sheet',
      ],
      cardSiteCta: 'Open Learning Site →',
      cardDeckBadge: 'PRESENTATION · SLIDEV',
      cardDeckCount: '27 Slides',
      cardDeckTitle: 'PWM en Sistemas Automotrices (Slidev Deck)',
      cardDeckDesc:
        'Live presenter-ready slide deck with step-by-step click reveals, KaTeX equations, audience quizzes, and the exact same shared interactive simulators.',
      cardDeckBullets: [
        'Runs directly at /presentation/ with speaker controls',
        'Consumes the same @pwm/shared interactive components',
        'Quick navigation pill back to Hub, Lessons, and Diagrams',
      ],
      cardDeckCta: 'Launch Presentation ↗',
      cardDiagBadge: 'SINGLE SOURCE · 8 SIMULATORS',
      cardDiagTitle: 'Shared Interactive Diagrams Sandbox',
      cardDiagDesc:
        'Inspect and test all 8 calibrated SVG schematics, gauges, and oscilloscopes side-by-side in Spanish or English.',
      cardRefBadge: 'BENCH REFERENCE & RESOURCES',
      cardRefTitle: 'PWM Basics & Diagnostics Cheat Sheet',
      cardRefDesc:
        'Quick-lookup equations, typical automotive component frequencies (10 Hz–20 kHz), DMM vs. Oscilloscope checklists, and curated resources.',
      teaserKicker: 'LIVE FROM @PWM/SHARED',
      teaserHeading: 'Try a Shared Diagram Right Here',
      teaserSub:
        'This exact component renders in Lesson 01 and Slide 3 of the Presentation—one codebase, zero visual drift.',
      roadmapKicker: 'CURRICULUM MAP',
      roadmapHeading: 'All 8 Interconnected Lessons',
      roadmapBtn: 'Full Curriculum Index →',
    },
    lessonsIndex: {
      titleMeta: 'Curriculum Index — PWM Car Mechanics',
      breadcrumbCurrent: 'Learning Site',
      kicker: 'SELF-PACED CURRICULUM · 8 LESSONS',
      heading: 'Automotive PWM Learning Path',
      lead: 'Every lesson is interconnected in sequence—complete with a calibrated interactive simulator from @pwm/shared and instant knowledge-check quizzes.',
      btnStart: 'Start with Lesson 01 →',
      btnRef: 'Open Resources & Guide',
      btnDeck: 'View as Presentation ↗',
      missionKicker: 'LEARNING OBJECTIVES',
      missionGoals: [
        'Explain the difference between PWM control and resistive speed control in automotive engineering.',
        'Measure and diagnose PWM signals (duty cycle, frequency, voltage offsets) using a multimeter or oscilloscope.',
        'Understand short-to-ground fault behavior and fuse Joule heating across low-side and high-side topologies.',
        'Read automotive wiring schematics and trace ECU closed-loop drivers from sensors to actuators.',
      ],
      simPrefix: 'Simulator:',
    },
    lessonView: {
      breadcrumbLessons: 'Lessons',
      lessonLabel: 'Lesson',
      lessonUpper: 'LESSON',
      cheatSheet: 'Resources',
      slideLabel: 'Slide',
      quizKicker: 'KNOWLEDGE CHECK',
      quizHeading: 'Test Your Understanding',
      prevDir: '← Previous',
      backDir: '← Back',
      indexLabel: 'Curriculum Index',
      allLessons: 'All Lessons',
      nextDir: 'Next Lesson →',
      doneDir: 'Completed! →',
      openCheatSheet: 'Open Resources & Guide',
      notFoundTitle: 'Lesson Not Found',
      notFoundDesc: 'Choose any lesson from the curriculum index to continue.',
      notFoundBtn: 'Back to Curriculum Index',
    },
    diagrams: {
      titleMeta: 'Shared Interactive Diagrams — PWM Car Mechanics',
      breadcrumbCurrent: 'Shared Diagrams',
      kicker: 'SINGLE SOURCE OF TRUTH · @PWM/SHARED',
      heading: 'Interactive Automotive PWM Diagrams',
      lead: 'Every diagram lives once inside packages/pwm-shared and renders in both the Learning Site and the Slidev Presentation. Switch languages to verify parity.',
      diagramPrefix: 'DIAGRAM',
      openLesson: 'Open Lesson →',
    },
    reference: {
      titleMeta: 'PWM Basics & Diagnostics Cheat Sheet — PWM Car Mechanics',
      breadcrumbCurrent: 'Resources & Guide',
      kicker: 'REFERENCE DOCUMENT · BENCH RESOURCES',
      heading: 'PWM Basics & Diagnostics Cheat Sheet',
      lead: 'Quick-reference formulas, automotive component frequencies, short-circuit physics, DMM/Oscilloscope measurement checklists, and recommended resources.',
      hEquations: 'Core Equations',
      eqDuty: 'Duty Cycle (%)',
      eqFreq: 'Frequency (Hz)',
      eqVavg: 'Average Voltage (V)',
      hShorts: 'Short Circuits & Fuse Physics',
      shortsList: [
        '<strong>Ohm’s Law in Faults:</strong> <code>I = V / R</code>. When a +12 V wire shorts to chassis ground before the load, resistance drops to near-zero (<code>R ≈ 0.05 Ω</code>), causing current to surge to ~240 A instantaneously.',
        '<strong>Joule Heating:</strong> <code>P = I² × R_fuse</code>. Heating scales with the square of current: a healthy 6 A fan generates only <code>0.72 W</code> in a 0.02 Ω fuse, whereas a 240 A short generates <code>1,152 W</code>, melting the fuse strip in milliseconds.',
        '<strong>Low-Side Control Short:</strong> A short-to-ground <em>after</em> the load bypasses the switch, but the load remains in series. Current is limited safely—the fuse stays intact while the load runs continuously.',
        '<strong>High-Side Control Short:</strong> A short-to-ground <em>before</em> the load bypasses load resistance completely. Closing the switch dumps +12 V straight to ground, blowing the fuse immediately to prevent fire.',
      ],
      hFreqs: 'Common Automotive PWM Frequencies',
      thComponent: 'Component',
      thFreq: 'Typical Frequency',
      thStrategy: 'Switching Strategy',
      frequencies: [
        { component: 'Cabin Blower Fan', freq: '100 Hz – 500 Hz', strategy: 'Low-Side PWM (duty cycle varies speed)' },
        { component: 'Radiator Cooling Fan', freq: '100 Hz – 300 Hz', strategy: 'Low-Side or High-Side PWM (high-current driver)' },
        { component: 'Electronic Fuel Pump', freq: '80 Hz (PCM) / 20 kHz (FPDM)', strategy: 'Two-stage Fuel Pump Driver Module regulated speed' },
        { component: 'EVAP Purge Solenoid', freq: '10 Hz – 30 Hz', strategy: 'Slow switching to meter fuel tank vapor flow' },
        { component: 'Electronic Throttle Body', freq: '1 kHz – 5 kHz', strategy: 'Dual-direction H-bridge for precise blade positioning' },
        { component: 'Fuel Injectors', freq: 'Dynamic (with Engine RPM)', strategy: 'Low-side pulse width directly controls fuel mass' },
      ],
      hChecklist: 'Diagnostic Measurement Checklist',
      hDmm: 'Using a Digital Multimeter (DMM)',
      dmmList: [
        '<strong>DC Voltage Mode:</strong> Measures <code>V_avg</code>. Great for a quick sanity check—a 12 V supply reading 6.0 V on a PWM line suggests ~50% duty cycle, but hides noise and ground offsets.',
        '<strong>Duty Cycle (%) Mode:</strong> Set DMM to <code>Hz / %</code>. Connect black lead to a verified battery ground and back-pin the signal wire with red to read commanded duty directly.',
        '<strong>Frequency (Hz) Mode:</strong> Confirms switching carrier stability. A reading of <code>0 Hz</code> indicates either a flat DC extreme (0% / 100%) or a lost/open control line.',
      ],
      hScope: 'Using an Oscilloscope (PicoScope / Bench Scope)',
      scopeList: [
        '<strong>Channel Setup:</strong> Use DC coupling. Set vertical scale to <code>0–20 V</code> (or <code>5 V/div</code>) for 12 V actuators, and <code>0–10 V</code> for 5 V logic/sensors.',
        '<strong>Timebase Setup:</strong> For a 100 Hz signal (10 ms period), choose <code>2 ms/div</code> or <code>5 ms/div</code> to frame 2–5 crisp cycles across the screen.',
        '<strong>Trigger:</strong> Use Auto/Repeat trigger on a Rising Edge at roughly half peak amplitude (<code>6.0 V</code> for 12 V circuits).',
      ],
      hResources: 'Further Automotive Resources',
      btnBackLessons: '← Back to All Lessons',
      btnDiagrams: 'Open Interactive Diagrams',
      btnPresentation: 'Launch Presentation ↗',
    },
  },
}

export function useI18n() {
  const t = computed(() => MESSAGES[lang.value] || MESSAGES.es)

  function setLang(next) {
    if (next === 'es' || next === 'en') {
      lang.value = next
    }
  }

  function toggleLang() {
    lang.value = lang.value === 'es' ? 'en' : 'es'
  }

  return {
    lang,
    t,
    setLang,
    toggleLang,
  }
}
