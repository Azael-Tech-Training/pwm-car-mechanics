export function localize(value, lang = 'es') {
  if (value && typeof value === 'object' && !Array.isArray(value) && ('es' in value || 'en' in value)) {
    return value[lang] ?? value.es ?? value.en
  }
  return value
}

export const LESSONS = [
  {
    number: '01',
    code: '0001',
    slug: '0001-what-is-pwm-and-why-cars',
    category: {
      es: 'Teoría Fundamental',
      en: 'Foundational Theory',
    },
    title: {
      es: 'PWM y la Evolución del Control Automotriz',
      en: 'PWM & The Evolution of Automotive Control',
    },
    shortTitle: {
      es: '¿Qué es PWM?',
      en: 'What is PWM?',
    },
    summary: {
      es: 'Por qué los vehículos modernos reemplazaron las resistencias en serie por conmutación MOSFET de alta velocidad, más ciclo de trabajo, período y frecuencia.',
      en: 'Why modern vehicles replaced wasteful series resistor packs with high-speed MOSFET switching, plus duty cycle, period, and frequency fundamentals.',
    },
    diagramKey: 'pwm-simulator',
    diagramName: {
      es: 'Simulador PWM Interactivo',
      en: 'Interactive PWM Simulator',
    },
    slideNumber: 3,
  },
  {
    number: '02',
    code: '0002',
    slug: '0002-low-side-vs-high-side',
    category: {
      es: 'Diseño de Circuitos',
      en: 'Circuit Design',
    },
    title: {
      es: 'Conmutación Low-Side vs. High-Side',
      en: 'Low-Side vs. High-Side Switching',
    },
    shortTitle: {
      es: 'Low-Side vs. High-Side',
      en: 'Low-Side vs. High-Side',
    },
    summary: {
      es: 'Compara drivers N-channel en el lado de tierra contra P-channel en el lado positivo y observa cómo la ubicación cambia el comportamiento ante un corto a tierra.',
      en: 'Compare N-channel ground-side drivers against P-channel power-side drivers and see why switch placement changes what happens during a short to ground.',
    },
    diagramKey: 'circuit-low-high',
    diagramName: {
      es: 'Simulador de Circuitos Low/High-Side',
      en: 'Low-Side / High-Side Circuit Simulator',
    },
    slideNumber: 8,
  },
  {
    number: '03',
    code: '0003',
    slug: '0003-diagnostics-multimeter-oscilloscope',
    category: {
      es: 'Diagnóstico y Medición',
      en: 'Diagnostics & Measurement',
    },
    title: {
      es: 'Diagnóstico PWM: Multímetro vs. Osciloscopio',
      en: 'PWM Diagnostics: Multimeter vs. Oscilloscope',
    },
    shortTitle: {
      es: 'Multímetro vs. Osciloscopio',
      en: 'Multimeter vs. Oscilloscope',
    },
    summary: {
      es: 'Evita la trampa del voltaje promedio en el multímetro. Mide en TP1, TP2 y TP3 en cinco escenarios de falla reales usando multímetro y osciloscopio.',
      en: 'Avoid the multimeter integration trap. Probe TP1, TP2, and TP3 across five real fault scenarios using both a digital multimeter and an oscilloscope.',
    },
    diagramKey: 'diagnostics-lab',
    diagramName: {
      es: 'Laboratorio Interactivo de Diagnóstico',
      en: 'Interactive Diagnostic Lab',
    },
    slideNumber: 10,
  },
  {
    number: '04',
    code: '0004',
    slug: '0004-how-shorts-blow-fuses',
    category: {
      es: 'Física Eléctrica',
      en: 'Electrical Physics',
    },
    title: {
      es: 'Cómo los Cortos a Tierra Queman Fusibles',
      en: 'How Shorts to Ground Blow Fuses',
    },
    shortTitle: {
      es: 'Cortos y Física de Fusibles',
      en: 'Shorts & Fuse Physics',
    },
    summary: {
      es: 'Sigue la Ley de Ohm y el calentamiento Joule (P = I² × R) durante un corto a chasis de 240 A para ver por qué un fusible de 15 A se funde en milisegundos.',
      en: 'Trace Ohm’s Law and Joule heating (P = I² × R) during a 240 A chassis short to see why bypassing the load melts a 15 A fuse in milliseconds.',
    },
    diagramKey: 'circuit-short',
    diagramName: {
      es: 'Simulador de Cortos y Calentamiento Joule',
      en: 'Short-Circuit & Joule Heating Simulator',
    },
    slideNumber: 13,
  },
  {
    number: '05',
    code: '0005',
    slug: '0005-ecu-control-logic',
    category: {
      es: 'Lógica de Control',
      en: 'Control Logic',
    },
    title: {
      es: 'Lógica de Control del ECU y Retroalimentación',
      en: 'ECU Control Logic and Sensor Feedback',
    },
    shortTitle: {
      es: 'Lógica en Lazo Cerrado (ECU)',
      en: 'ECU Closed-Loop Logic',
    },
    summary: {
      es: 'Observa cómo el ECU lee el sensor de temperatura del refrigerante, consulta su mapa de trabajo y mantiene la frecuencia fija en 150 Hz de 0% a 100%.',
      en: 'See how the ECU reads coolant temperature, looks up a duty-cycle map, and keeps switching frequency constant at 150 Hz across 0% to 100% drive.',
    },
    diagramKey: 'ecu-simulator',
    diagramName: {
      es: 'Simulador ECU en Lazo Cerrado',
      en: 'ECU Closed-Loop Simulator',
    },
    slideNumber: 16,
  },
  {
    number: '06',
    code: '0006',
    slug: '0006-how-low-side-switching-controls-flow',
    category: {
      es: 'Dinámica de Circuitos',
      en: 'Circuit Dynamics',
    },
    title: {
      es: 'Cómo el Control Low-Side Regula el Flujo',
      en: 'How Low-Side Switching Controls Flow',
    },
    shortTitle: {
      es: 'Dinámica de Flujo Low-Side',
      en: 'Low-Side Flow Dynamics',
    },
    summary: {
      es: 'Aclara la regla del circuito en serie comparando una manguera presurizada con un circuito de 12 V para ver por qué cerrar la salida detiene todo el flujo.',
      en: 'Clear up the series loop rule using a side-by-side pressurized garden hose and 12 V fan circuit to visualize why blocking the exit stops all flow.',
    },
    diagramKey: 'flow-comparison',
    diagramName: {
      es: 'Manguera de Jardín vs. Circuito Eléctrico',
      en: 'Garden Hose vs. Electric Circuit',
    },
    slideNumber: 19,
  },
  {
    number: '07',
    code: '0007',
    slug: '0007-time-is-the-variable',
    category: {
      es: 'Modulación de Tiempo',
      en: 'Time Modulation',
    },
    title: {
      es: 'Cómo el ECU Cambia el Ciclo de Trabajo',
      en: 'How the ECU Changes Duty Cycle',
    },
    shortTitle: {
      es: 'El Tiempo es la Variable',
      en: 'Time Is the Variable',
    },
    summary: {
      es: 'Un MOSFET es estrictamente binario (100% ON o 100% OFF). Pulsa manualmente o activa el ciclo automático para ver cómo la inercia suaviza los pulsos.',
      en: 'MOSFETs are strictly binary (100% ON or 100% OFF). Tap manually or run the ECU timer to see how mechanical inertia smooths timed pulses into steady speed.',
    },
    diagramKey: 'time-modulation',
    diagramName: {
      es: 'Simulador de Modulación de Tiempo',
      en: 'ECU Time-Modulation Simulator',
    },
    slideNumber: 21,
  },
  {
    number: '08',
    code: '0008',
    slug: '0008-pwm-fuel-pump-control',
    category: {
      es: 'Componentes Automotrices',
      en: 'Automotive Components',
    },
    title: {
      es: 'Control PWM de Bomba de Combustible (Sin Retorno)',
      en: 'PWM Fuel Pump Control (Returnless Systems)',
    },
    shortTitle: {
      es: 'Bomba de Combustible PWM',
      en: 'Returnless Fuel Pump',
    },
    summary: {
      es: 'Explora la arquitectura de dos etapas PCM (80 Hz) → FPDM (20 kHz), la regulación de presión en el riel y cómo PWM reduce vapores EVAP y consumo.',
      en: 'Explore two-stage PCM (80 Hz) → FPDM (20 kHz) fuel delivery, rail pressure feedback, and how PWM cuts EVAP vapor load and alternator draw.',
    },
    diagramKey: 'fuel-pump',
    diagramName: {
      es: 'Simulador de Bomba de Combustible PWM',
      en: 'Returnless PWM Fuel Pump Simulator',
    },
    slideNumber: 24,
  },
]

export const SHARED_DIAGRAMS = [
  {
    key: 'pwm-simulator',
    title: {
      es: 'Simulador PWM: Osciloscopio y Actuadores',
      en: 'PWM Oscilloscope & Actuator Simulator',
    },
    subtitle: {
      es: 'Ciclo de trabajo, percepción de frecuencia, voltaje promedio, ventilador y lámpara',
      en: 'Duty cycle, frequency perception, average voltage, fan & bulb response',
    },
    usedIn: {
      es: ['Lección 01', 'Presentación Diapositiva 3'],
      en: ['Lesson 01', 'Presentation Slide 3'],
    },
    lessonSlug: '0001-what-is-pwm-and-why-cars',
  },
  {
    key: 'circuit-low-high',
    title: {
      es: 'Esquema de Conmutación Low-Side vs. High-Side',
      en: 'Low-Side vs. High-Side Switching Schematic',
    },
    subtitle: {
      es: 'Cambio dinámico de topología, control de Gate MOSFET y fallas de corto a chasis',
      en: 'Dynamic topology swap, MOSFET gate control, and chassis short fault physics',
    },
    usedIn: {
      es: ['Lección 02', 'Presentación Diapositiva 8'],
      en: ['Lesson 02', 'Presentation Slide 8'],
    },
    lessonSlug: '0002-low-side-vs-high-side',
  },
  {
    key: 'diagnostics-lab',
    title: {
      es: 'Laboratorio Interactivo de Diagnóstico (DMM y Osciloscopio)',
      en: 'Interactive Diagnostic Lab (DMM & Scope)',
    },
    subtitle: {
      es: 'Puntos de prueba TP1/TP2/TP3, modos DMM, base de tiempo y trigger del osciloscopio',
      en: 'Clickable TP1/TP2/TP3 probes, DMM modes, oscilloscope timebase & trigger',
    },
    usedIn: {
      es: ['Lección 03'],
      en: ['Lesson 03'],
    },
    lessonSlug: '0003-diagnostics-multimeter-oscilloscope',
  },
  {
    key: 'circuit-short',
    title: {
      es: 'Simulador de Cortocircuitos y Calentamiento Joule',
      en: 'Short-Circuit & Joule Heating Simulator',
    },
    subtitle: {
      es: 'Resistencia en vivo, pico de falla de 240 A, disipación I²R y fusión del fusible',
      en: 'Live resistance, 240 A fault surge, I²R fuse dissipation & melt animation',
    },
    usedIn: {
      es: ['Lección 04', 'Presentación Diapositiva 13'],
      en: ['Lesson 04', 'Presentation Slide 13'],
    },
    lessonSlug: '0004-how-shorts-blow-fuses',
  },
  {
    key: 'ecu-simulator',
    title: {
      es: 'Controlador ECU en Lazo Cerrado',
      en: 'ECU Closed-Loop Feedback Controller',
    },
    subtitle: {
      es: 'Sensor de refrigerante → Mapa ECU → PWM fijo de 150 Hz → Ventilador de radiador',
      en: 'Coolant temp sensor → ECU map → fixed 150 Hz PWM → radiator fan',
    },
    usedIn: {
      es: ['Lección 05', 'Presentación Diapositiva 16'],
      en: ['Lesson 05', 'Presentation Slide 16'],
    },
    lessonSlug: '0005-ecu-control-logic',
  },
  {
    key: 'flow-comparison',
    title: {
      es: 'Manguera de Jardín vs. Circuito Low-Side',
      en: 'Garden Hose vs. Low-Side Electric Circuit',
    },
    subtitle: {
      es: 'Analogía hidráulica y eléctrica sincronizada en serie con estado pull-up de 12 V',
      en: 'Synchronized fluid & electrical series-loop analogy with pull-up state',
    },
    usedIn: {
      es: ['Lección 06', 'Presentación Diapositiva 19'],
      en: ['Lesson 06', 'Presentation Slide 19'],
    },
    lessonSlug: '0006-how-low-side-switching-controls-flow',
  },
  {
    key: 'time-modulation',
    title: {
      es: 'Modulación de Tiempo Binaria y Curva de Inercia',
      en: 'Binary Time-Modulation & Inertia Trace',
    },
    subtitle: {
      es: 'Pulsación manual o lazo ECU a 1 Hz con gráfica en vivo de 12 V vs. velocidad del motor',
      en: 'Manual tapping or 1 Hz ECU loop with live binary 12 V vs. fan speed plot',
    },
    usedIn: {
      es: ['Lección 07', 'Presentación Diapositiva 21'],
      en: ['Lesson 07', 'Presentation Slide 21'],
    },
    lessonSlug: '0007-time-is-the-variable',
  },
  {
    key: 'fuel-pump',
    title: {
      es: 'Bomba de Combustible PWM Sin Retorno (PCM → FPDM)',
      en: 'Returnless PWM Fuel Pump (PCM → FPDM)',
    },
    subtitle: {
      es: 'Manómetro con respuesta transitoria, flujo animado de combustible y señal FPDM',
      en: 'Transient rail-pressure gauge, animated fuel line & FPDM output trace',
    },
    usedIn: {
      es: ['Lección 08', 'Presentación Diapositiva 24'],
      en: ['Lesson 08', 'Presentation Slide 24'],
    },
    lessonSlug: '0008-pwm-fuel-pump-control',
  },
]

export const EXTERNAL_RESOURCES = [
  {
    title: {
      es: 'PicoScope Automotive Guided Tests — Actuadores',
      en: 'PicoScope Automotive Guided Tests — Actuators',
    },
    category: {
      es: 'Guías Técnicas',
      en: 'Guides',
    },
    url: 'https://www.picoauto.com/library/guided-tests',
    description: {
      es: 'Guías paso a paso de conexión y formas de onda de referencia para solenoides, ventiladores y bombas de combustible PWM.',
      en: 'Step-by-step hookups and waveform references for automotive solenoids, fans, and PWM fuel pumps.',
    },
  },
  {
    title: {
      es: 'Engine Performance Diagnostics — Paul Danner (ScannerDanner)',
      en: 'Engine Performance Diagnostics — Paul Danner (ScannerDanner)',
    },
    category: {
      es: 'Libro y Video',
      en: 'Book & Video',
    },
    url: 'https://www.scannerdanner.com/',
    description: {
      es: 'Referencia práctica en diagnóstico automotriz con osciloscopio, análisis de ondas y pruebas de drivers de estado sólido.',
      en: 'Deep-dive oscilloscope hookups, waveform analysis, and testing solid-state ECU drivers.',
    },
  },
  {
    title: {
      es: 'Automotive Technology — James D. Halderman',
      en: 'Automotive Technology — James D. Halderman',
    },
    category: {
      es: 'Libro de Texto',
      en: 'Textbook',
    },
    url: 'https://www.jameshalderman.com/',
    description: {
      es: 'Texto estándar de la industria sobre electricidad automotriz y cómo las ECU usan PWM para controlar actuadores.',
      en: 'Industry-standard reference on how ECUs use PWM for actuator speed and position control.',
    },
  },
  {
    title: {
      es: 'Foro Speeduino Engine Management',
      en: 'Speeduino Engine Management Forum',
    },
    category: {
      es: 'Comunidad',
      en: 'Community',
    },
    url: 'https://speeduino.com/forum/',
    description: {
      es: 'Comunidad open-source de ECU sobre programación PWM en microcontroladores, mapas y etapas de potencia.',
      en: 'Open-source ECU community covering microcontroller PWM scheduling, lookup maps, and driver stages.',
    },
  },
]
