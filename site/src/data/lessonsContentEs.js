export const LESSON_CONTENT_ES = {
  '0001-what-is-pwm-and-why-cars': {
    blocksBeforeDiagram: [
      {
        type: 'p',
        html: 'En los vehículos modernos, la electricidad hace mucho más que encender o apagar dispositivos. Controla con precisión la velocidad de bombas de combustible, el enfriamiento del ventilador del radiador, el brillo del tablero y la apertura de los inyectores. Para entender cómo lo logran los autos, primero veamos cómo se hacía antes.',
      },
      { type: 'h2', text: 'El Método Antiguo: Resistencias en Serie y Calor Desperdiciado' },
      {
        type: 'p',
        html: 'Antes de que las computadoras automotrices controlaran los sistemas, variar la velocidad de un componente eléctrico (como el soplador de cabina) se lograba con <strong>resistencias en serie</strong>. Para velocidad "Baja", el selector enviaba la corriente por un bloque de resistencias pesadas que limitaban el flujo y reducían el voltaje que llegaba al motor.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'La Falla Crítica de Eficiencia',
        html: 'Las resistencias controlan la velocidad convirtiendo la energía eléctrica sobrante en <strong>calor</strong>. En autos antiguos, el bloque de resistencias del soplador debía ir montado dentro del ducto de aire para enfriarse. Si el flujo de aire fallaba, las resistencias se sobrecalentaban y se quemaban, dejando el soplador funcionando únicamente en velocidad "Alta" (que las puenteaba).',
      },
      { type: 'h2', text: 'La Solución Moderna: Modulación por Ancho de Pulso (PWM)' },
      {
        type: 'p',
        html: 'Los autos modernos usan transistores de estado sólido (generalmente MOSFET) dentro de la Unidad de Control del Motor (ECU) o módulos dedicados. En lugar de frenar la corriente con resistencia, el transistor actúa como un interruptor ultrarrápido que enciende (<strong>ON</strong>) y apaga (<strong>OFF</strong>) la alimentación cientos o miles de veces por segundo.',
      },
      {
        type: 'ul',
        items: [
          '<strong>Cuando el interruptor está ON:</strong> Su resistencia es casi cero, por lo que no hay caída de voltaje significativa ni calor desperdiciado.',
          '<strong>Cuando el interruptor está OFF:</strong> No circula corriente, por lo que no se consume energía ni se genera calor.',
        ],
      },
      {
        type: 'p',
        html: 'Al variar la proporción entre tiempo encendido y tiempo apagado, el ECU controla el <strong>voltaje promedio</strong> que recibe el actuador sin desperdiciar energía en calor. Eso es la <strong>Modulación por Ancho de Pulso (PWM)</strong>.',
      },
      { type: 'h2', text: 'Parámetros Clave de una Señal PWM' },
      {
        type: 'ol',
        items: [
          '<strong>Ciclo de Trabajo (D):</strong> Porcentaje de tiempo que la señal permanece encendida en un ciclo completo. 0% es completamente apagado; 100% es encendido continuo.',
          '<strong>Período (T):</strong> Tiempo total que toma completar un ciclo ON/OFF.',
          '<strong>Frecuencia (f):</strong> Cuántos ciclos ocurren por segundo (<code>f = 1 / T</code>), medida en Hertz (Hz).',
        ],
      },
    ],
    blocksAfterDiagram: [
      {
        type: 'callout',
        tone: 'tip',
        title: 'Frecuencia vs. Percepción Humana',
        html: 'Prueba hacer clic en el botón <strong>5 Hz</strong> o bajar la frecuencia por debajo de 15 Hz en el simulador. ¿Notas cómo parpadea la lámpara y el ventilador gira a tirones? En vehículos reales, PWM opera entre <strong>100 Hz y 20 kHz</strong> para que el parpadeo sea invisible y la inercia del motor suavice por completo el giro.',
      },
    ],
    quizzes: [
      {
        question:
          'Si el ventilador de radiador de 12 V de un vehículo se controla con una señal PWM al 40% de ciclo de trabajo, ¿cuál es el voltaje promedio entregado al ventilador?',
        options: [
          { text: 'El voltaje promedio es 2.4 voltios.', correct: false },
          { text: 'El voltaje promedio es 4.8 voltios.', correct: true },
          { text: 'El voltaje promedio es 6.0 voltios.', correct: false },
          { text: 'El voltaje promedio es 9.6 voltios.', correct: false },
        ],
        explanation:
          'El voltaje promedio es igual al voltaje de la fuente (12 V) multiplicado por el ciclo de trabajo (40%): 12 × 0.40 = 4.8 V.',
      },
      {
        question:
          '¿Cuál fue la razón principal de ingeniería por la que los fabricantes reemplazaron las resistencias en serie por control PWM?',
        options: [
          { text: 'Reducir la pérdida térmica en calor y mejorar la eficiencia eléctrica.', correct: true },
          { text: 'Aumentar el voltaje máximo de la batería por encima de 12 V.', correct: false },
          { text: 'Eliminar el uso de fusibles en el sistema eléctrico.', correct: false },
          { text: 'Simplificar el circuito eliminando el cableado a tierra.', correct: false },
        ],
        explanation:
          'Las resistencias en serie queman la energía sobrante en forma de calor. Conmutar rápidamente con PWM elimina esas pérdidas térmicas y mejora drásticamente la eficiencia.',
      },
    ],
  },

  '0002-low-side-vs-high-side': {
    blocksBeforeDiagram: [
      {
        type: 'p',
        html: 'En la Lección 01 vimos cómo el ECU usa transistores como interruptores ultrarrápidos. Ahora analizaremos <strong>dónde</strong> se coloca ese interruptor dentro del circuito, cómo funciona y por qué su ubicación define los síntomas de falla y la seguridad del vehículo.',
      },
      { type: 'h2', text: 'Los Relevadores de Estado Sólido del ECU: MOSFET' },
      {
        type: 'p',
        html: 'El microcontrolador del ECU opera a 5 V o 3.3 V y solo puede entregar unos pocos miliamperes. Para controlar un ventilador de 15 A a 12 V utiliza un <strong>MOSFET</strong>:',
      },
      {
        type: 'ul',
        items: [
          '<strong>MOSFET Canal N (N-Channel):</strong> Se enciende al aplicar voltaje positivo en su Gate respecto al Source. Es económico, muy eficiente y tiene una resistencia interna mínima (<code>R_DS(on)</code>).',
          '<strong>MOSFET Canal P (P-Channel):</strong> Se enciende al bajar el voltaje del Gate respecto al Source. Es algo más costoso, pero resulta práctico para conmutar directamente el lado positivo (+12 V).',
        ],
      },
      { type: 'h2', text: 'Estrategias de Conmutación: Low-Side vs. High-Side' },
      {
        type: 'callout',
        tone: 'info',
        title: 'Control Low-Side / Lado Bajo (Configuración Estándar)',
        html: 'El transistor se ubica en el <strong>lado de tierra</strong> del actuador. El actuador recibe +12 V permanentes tras el fusible y el ECU activa un <strong>MOSFET canal N</strong> para cerrar el camino a tierra.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Control High-Side / Lado Alto (Configuración de Seguridad)',
        html: 'El transistor se ubica en el <strong>lado positivo</strong> del actuador. El actuador queda conectado permanentemente al chasis (tierra) y el ECU entrega +12 V mediante un <strong>MOSFET canal P</strong> o un driver inteligente.',
      },
      { type: 'h2', text: 'Por Qué Importa la Ubicación: Corto a Tierra' },
      {
        type: 'p',
        html: 'Como la carrocería metálica del auto es la terminal negativa (tierra), el desgaste del aislante por vibración provoca casi siempre un <strong>corto a tierra</strong>. Cambia entre Low-Side y High-Side abajo, activa el Gate e inyecta el corto para observar ambas reacciones.',
      },
    ],
    blocksAfterDiagram: [],
    quizzes: [
      {
        question:
          'Si un ventilador controlado por Low-Side sufre un corto a tierra en su cable de control contra el chasis, ¿cuál será el síntoma?',
        options: [
          { text: 'El ventilador funciona continuamente al 100% de velocidad.', correct: true },
          { text: 'El fusible del circuito se funde de inmediato.', correct: false },
          { text: 'El módulo de control se destruye instantáneamente.', correct: false },
          { text: 'El ventilador trabaja a la mitad de su potencia.', correct: false },
        ],
        explanation:
          'Al estar el motor antes del interruptor, el corto puentea el MOSFET pero la corriente sigue atravesando el bobinado del motor, que limita el amperaje y evita que el fusible se queme.',
      },
      {
        question:
          '¿Por qué los fabricantes prefieren drivers Low-Side con MOSFET canal N para la mayoría de motores automotrices?',
        options: [
          { text: 'Tienen menor resistencia interna y menor costo de fabricación.', correct: true },
          { text: 'Eliminan por completo cualquier posibilidad de cortocircuito.', correct: false },
          { text: 'Permiten operar motores con más de 24 V desde una batería de 12 V.', correct: false },
          { text: 'No requieren ningún fusible de protección.', correct: false },
        ],
        explanation:
          'Los MOSFET canal N presentan menor R_DS(on) que sus equivalentes canal P, generando menos calor y reduciendo el costo por componente.',
      },
    ],
  },

  '0003-diagnostics-multimeter-oscilloscope': {
    blocksBeforeDiagram: [
      {
        type: 'p',
        html: 'Ahora que conoces la ubicación del driver del ECU, aprenderemos a diagnosticar circuitos PWM en un vehículo real. Medir señales pulsadas de alta velocidad exige saber qué revela—y qué oculta—cada instrumento.',
      },
      { type: 'h2', text: 'El Dilema del Diagnóstico: Voltaje Promedio vs. Forma de Onda' },
      {
        type: 'p',
        html: 'En circuitos DC simples un cable está en 12 V o en 0 V. En PWM el voltaje conmuta cientos de veces por segundo, generando una trampa clásica:',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'La Trampa de Integración del Multímetro',
        html: 'Un multímetro digital (DMM) en modo Voltaje DC es demasiado lento para seguir una onda de 100 Hz o 20 kHz y muestra solo el <strong>voltaje promedio</strong>. Un ventilador sano al 50% marcará <strong>6.0 V</strong>. Ese dato sirve como verificación rápida, pero oculta fallas críticas como caídas por tierra corroída o ruido eléctrico.',
      },
      { type: 'h2', text: 'Comparando las Herramientas' },
      {
        type: 'ul',
        items: [
          '<strong>Multímetro Digital (DMM):</strong> Rápido para comprobaciones iniciales. Los modelos automotrices incluyen modos de <strong>Frecuencia (Hz)</strong> y <strong>Ciclo de Trabajo (%)</strong>.',
          '<strong>Osciloscopio:</strong> El estándar de oro en diagnóstico. Grafica voltaje contra tiempo mostrando flancos reales, amplitud pico y desplazamientos de tierra.',
        ],
      },
      { type: 'h2', text: 'Laboratorio Interactivo de Diagnóstico' },
      {
        type: 'p',
        html: 'Elige una condición de circuito, haz clic en <strong>TP1</strong>, <strong>TP2</strong> o <strong>TP3</strong> y alterna entre el Multímetro y el Osciloscopio. Pon especial atención a la falla de <strong>Tierra Corroída del ECU</strong>.',
      },
    ],
    blocksAfterDiagram: [],
    quizzes: [
      {
        question:
          'Al conectar el osciloscopio en TP2 (línea de control low-side) con el ventilador encendido, observas una onda cuadrada limpia entre 2.5 V y 12 V. ¿Cuál es la causa raíz?',
        options: [
          { text: 'El motor del ventilador está en corto interno.', correct: false },
          { text: 'Existe alta resistencia (corrosión) en la tierra después del driver del ECU.', correct: true },
          { text: 'La batería está descargada por debajo de 10 V.', correct: false },
          { text: 'El MOSFET del ECU está abierto permanentemente.', correct: false },
        ],
        explanation:
          'La resistencia por corrosión en la masa del ECU crea una caída de voltaje cuando circula corriente, elevando el nivel "bajo" de la onda desde 0 V hasta 2.5 V.',
      },
      {
        question:
          '¿Por qué un voltímetro DC marca 12.0 V en TP2 cuando un ventilador controlado por Low-Side está comandado en OFF?',
        options: [
          {
            text: 'Con el interruptor abierto no fluye corriente, por lo que no hay caída de voltaje a través del bobinado del motor.',
            correct: true,
          },
          { text: 'El ECU cambia automáticamente a modo High-Side al estar apagado.', correct: false },
          { text: 'El fusible se abrió aislando el circuito.', correct: false },
          { text: 'Los capacitores internos del ventilador mantienen 12 V almacenados.', correct: false },
        ],
        explanation:
          'Sin flujo de corriente no existe caída de tensión en el motor; por eso la línea de control sube ("pull-up") al potencial completo de batería de 12.0 V.',
      },
    ],
  },

  '0004-how-shorts-blow-fuses': {
    blocksBeforeDiagram: [
      {
        type: 'p',
        html: 'Antes vimos que un corto a tierra quema el fusible en un circuito high-side pero no en el cable de control low-side. Hoy revisaremos la física exacta—<strong>Ley de Ohm</strong> y <strong>Calentamiento Joule</strong>—que funde el filamento en milisegundos.',
      },
      { type: 'h2', text: '1. La Resistencia Limita la Corriente (Ley de Ohm)' },
      { type: 'equation', text: 'Corriente (I) = Voltaje (V) / Resistencia (R)' },
      {
        type: 'p',
        html: 'En un circuito sano, la <strong>carga</strong> (un motor de 2.0 Ω) aporta casi toda la resistencia. El cableado y el fusible suman apenas ~0.02 Ω. En un sistema de 12 V:',
      },
      { type: 'equation', text: 'I = 12 V / 2.02 Ω ≈ 5.9 A' },
      {
        type: 'p',
        html: 'Un fusible de 15 A maneja 6 A sin calentarse, manteniendo el circuito seguro.',
      },
      { type: 'h2', text: '2. Omitiendo la Carga: El Pico de 240 A' },
      {
        type: 'p',
        html: 'Si el cable de +12 V roza el chasis metálico <strong>antes</strong> del ventilador, la corriente evita los 2.0 Ω del motor. Solo queda la diminuta resistencia (~0.05 Ω) del cable y el fusible:',
      },
      { type: 'equation', tone: 'danger', text: 'I = 12 V / 0.05 Ω = 240 Amperes' },
      { type: 'h2', text: '3. Calentamiento Joule: Corriente Excesiva en Calor' },
      {
        type: 'p',
        html: 'El calor generado en el filamento del fusible crece con el <strong>cuadrado</strong> de la corriente:',
      },
      { type: 'equation', tone: 'danger', text: 'Potencia Térmica (P) = I² × R_fusible' },
      {
        type: 'ul',
        items: [
          '<strong>Carga Normal (6 A):</strong> <code>P = 6² × 0.02 Ω = 0.72 W</code> — calor mínimo que se disipa sin problema.',
          '<strong>Corto a Chasis (240 A):</strong> <code>P = 240² × 0.02 Ω = 1,152 W</code> — la potencia de un horno de microondas concentrada en una tira metálica minúscula. Se funde en milisegundos abriendo el circuito antes de que se incendie el arnés.',
        ],
      },
    ],
    blocksAfterDiagram: [
      { type: 'h2', text: 'Resumen: Por Qué un Corto Low-Side No Quema el Fusible' },
      {
        type: 'p',
        html: 'En un fallo <strong>High-Side</strong> (o antes de la carga), la resistencia colapsa a ~0.05 Ω y el fusible se funde al instante. En un cable de control <strong>Low-Side</strong>, el corto ocurre <em>después</em> del motor: los 2.0 Ω del ventilador mantienen la corriente en ~6 A, salvando el fusible pero dejando el motor encendido sin parar.',
      },
    ],
    quizzes: [
      {
        question:
          'Ante un corto a tierra que puentea un ventilador de 2 Ω, ¿qué evento físico derrite directamente el elemento del fusible?',
        options: [
          { text: 'El pico masivo de corriente produce un calentamiento Joule extremo (I² × R).', correct: true },
          { text: 'El voltaje de la batería sube repentinamente por encima de 100 V.', correct: false },
          { text: 'La resistencia total aumenta por encima del valor nominal.', correct: false },
          { text: 'La carga estática del chasis fractura el encapsulado plástico.', correct: false },
        ],
        explanation:
          'Al omitirse la resistencia de la carga, la Ley de Ohm eleva la corriente a ~240 A y el calentamiento Joule (P = I² × R) se multiplica 1,600 veces dentro del filamento.',
      },
      {
        question: '¿Por qué un corto a tierra en el cable de control Low-Side NO quema el fusible?',
        options: [
          { text: 'La resistencia interna del actuador sigue en serie y limita la corriente a niveles normales.', correct: true },
          { text: 'El interruptor del ECU bloquea toda la corriente desde la batería.', correct: false },
          { text: 'El chasis absorbe el exceso de amperaje de manera segura.', correct: false },
          { text: 'La batería reduce automáticamente su voltaje de salida.', correct: false },
        ],
        explanation:
          'Como el actuador está ubicado entre el fusible y el corto, la corriente debe pasar primero por la carga, impidiendo una sobrecorriente.',
      },
    ],
  },

  '0005-ecu-control-logic': {
    blocksBeforeDiagram: [
      {
        type: 'p',
        html: 'Un concepto fundamental: <strong>la Corriente Directa (DC) pura es simplemente una señal PWM al 100% de ciclo de trabajo y 0 Hz de frecuencia.</strong> En esta lección veremos ambos extremos, cómo el ECU calcula el ciclo de trabajo mediante sensores y por qué mantiene la frecuencia fija.',
      },
      { type: 'h2', text: '1. Los Dos Extremos: 0% y 100% de Ciclo de Trabajo' },
      {
        type: 'ul',
        items: [
          '<strong>0% de Ciclo de Trabajo:</strong> El interruptor queda abierto (0 V planos). No hay transiciones, así que la frecuencia es <strong>0 Hz</strong>.',
          '<strong>100% de Ciclo de Trabajo:</strong> El interruptor queda cerrado (12 V planos). El voltaje nunca cae a 0 V, por lo que la frecuencia es <strong>0 Hz</strong>: corriente directa continua.',
        ],
      },
      {
        type: 'p',
        html: 'Entre 1% y 99%, el ECU pulsa la salida a una <strong>Frecuencia fija</strong> ajustando únicamente el ancho del pulso.',
      },
      { type: 'h2', text: '2. Control con Retroalimentación (Lazo Cerrado)' },
      {
        type: 'p',
        html: 'El ECU nunca adivina la velocidad del ventilador: ejecuta un ciclo continuo de <strong>lazo cerrado</strong>:',
      },
      {
        type: 'ol',
        items: [
          '<strong>Entrada (Sensor):</strong> Lee el <strong>Sensor de Temperatura del Refrigerante (ECT)</strong>.',
          '<strong>Objetivo (Setpoint):</strong> Compara la lectura real con la temperatura objetivo en memoria (ej. 90°C).',
          '<strong>Cálculo de Error:</strong> Calcula la diferencia para estimar cuánta refrigeración falta.',
          '<strong>Mapa de Salida:</strong> Traduce la temperatura en ciclo de trabajo: 0% debajo de 85°C, rampa progresiva entre 85°C y 110°C, y 100% por encima de 110°C.',
        ],
      },
      { type: 'h2', text: '3. Por Qué la Frecuencia Permanece Constante' },
      {
        type: 'p',
        html: 'Los ingenieros fijan una frecuencia óptima (por ejemplo <strong>150 Hz</strong>) adaptada al motor y al MOSFET: demasiado baja produce zumbido y vibración; demasiado alta incrementa pérdidas por conmutación y calor en el transistor.',
      },
    ],
    blocksAfterDiagram: [],
    quizzes: [
      {
        question: '¿Por qué el ECU mantiene constante la frecuencia PWM mientras varía el ciclo de trabajo?',
        options: [
          {
            text: 'La frecuencia se selecciona para ser óptima para el actuador y el MOSFET, evitando ruido y calor excesivo.',
            correct: true,
          },
          { text: 'Los microcontroladores automotrices son incapaces de generar otras frecuencias.', correct: false },
          { text: 'Cambiar la frecuencia descargaría la batería de 12 V al instante.', correct: false },
          { text: 'Los sensores de temperatura solo funcionan a 60 Hz.', correct: false },
        ],
        explanation:
          'Cada actuador tiene una frecuencia portadora ideal que evita zumbidos audibles y minimiza pérdidas de conmutación; la potencia se regula únicamente cambiando el ciclo de trabajo.',
      },
      {
        question:
          '¿Qué sensor usa principalmente el ECU para calcular el ciclo de trabajo del ventilador del radiador?',
        options: [
          { text: 'El sensor de temperatura del refrigerante del motor (ECT).', correct: true },
          { text: 'El sensor de temperatura del aire de admisión (IAT).', correct: false },
          { text: 'El sensor de presión absoluta del múltiple (MAP).', correct: false },
          { text: 'El sensor de velocidad de rueda (WSS).', correct: false },
        ],
        explanation:
          'El sensor ECT informa continuamente la temperatura del refrigerante para cerrar el lazo de control térmico del ventilador.',
      },
    ],
  },

  '0006-how-low-side-switching-controls-flow': {
    blocksBeforeDiagram: [
      {
        type: 'p',
        html: 'Una duda muy común es cómo un interruptor en el <strong>lado de tierra (low-side)</strong> puede apagar un ventilador que sigue conectado a +12 V. La explicación está en la <strong>Regla del Circuito en Serie</strong> y la <strong>Analogía de la Manguera de Jardín</strong>.',
      },
      { type: 'h2', text: '1. La Regla del Lazo en Serie' },
      {
        type: 'p',
        html: 'La corriente eléctrica requiere un circuito cerrado completo. Si interrumpes el lazo en <strong>cualquier punto</strong>—al principio (high-side) o al final (low-side)—la corriente se detiene en <strong>todo</strong> el circuito al instante.',
      },
      { type: 'h2', text: '2. Analogía de la Manguera Presurizada' },
      {
        type: 'ul',
        items: [
          '<strong>Llave de Agua (Batería +12 V):</strong> Suministra presión constante (voltaje).',
          '<strong>Manguera (Cableado):</strong> Conduce el flujo a lo largo del lazo.',
          '<strong>Rueda Aspersora (Ventilador):</strong> Solo gira cuando pasa flujo por ella.',
          '<strong>Boquilla al Final (MOSFET Low-Side):</strong> Bloquea o libera la salida.',
          '<strong>Drenaje (Tierra del Chasis):</strong> Punto de salida del sistema.',
        ],
      },
      {
        type: 'p',
        html: 'Al cerrar la boquilla al <strong>final</strong> de la manguera, el agua sigue dentro bajo presión, pero al no poder salir al drenaje todo el flujo se detiene y la rueda deja de girar.',
      },
    ],
    blocksAfterDiagram: [
      { type: 'h2', text: 'Resumen: El Estado Pull-Up' },
      {
        type: 'p',
        html: 'Cuando el MOSFET low-side está abierto (OFF), el cable entre el ventilador y el MOSFET queda presurizado en <strong>+12 V</strong> a través de las bobinas del motor. En cuanto el ECU cierra el MOSFET a tierra, ese cable cae a <strong>0 V</strong> y la corriente fluye por todo el lazo.',
      },
    ],
    quizzes: [
      {
        question: 'En un circuito en serie, ¿qué pasa con la corriente cuando se abre un interruptor en el lado de tierra (low-side)?',
        options: [
          { text: 'La corriente deja de circular en todo el lazo en serie inmediatamente.', correct: true },
          { text: 'La corriente sigue entrando al motor y se acumula en el interruptor.', correct: false },
          { text: 'Los electrones fluyen en reversa hacia el borne positivo.', correct: false },
          { text: 'El voltaje en el motor se duplica a 24 V.', correct: false },
        ],
        explanation:
          'Al existir un único camino cerrado en serie, abrir cualquier punto del circuito detiene el flujo en todos los componentes.',
      },
      {
        question: 'En la analogía de la manguera, ¿qué elemento representa al MOSFET Low-Side?',
        options: [
          { text: 'La boquilla o válvula de salida al final de la manguera (después de la rueda).', correct: true },
          { text: 'La llave de paso en la pared.', correct: false },
          { text: 'La rueda aspersora.', correct: false },
          { text: 'Las paredes de goma de la manguera.', correct: false },
        ],
        explanation:
          'El MOSFET low-side está ubicado después de la carga, regulando la salida a tierra igual que una boquilla al extremo de una manguera presurizada.',
      },
    ],
  },

  '0007-time-is-the-variable': {
    blocksBeforeDiagram: [
      {
        type: 'p',
        html: 'Otro mito frecuente es pensar que el ECU abre el transistor "a medias", como si girara una perilla. En realidad, un MOSFET automotriz en PWM es estrictamente binario: <strong>está 100% ON (12 V) o 100% OFF (0 V).</strong>',
      },
      {
        type: 'p',
        html: 'Entonces, ¿cómo logra entregar 25%, 50% u 80% de potencia? La variable de control es el <strong>Tiempo</strong>.',
      },
      { type: 'h2', text: '1. Modulando el Tiempo Dentro de Cada Ciclo' },
      {
        type: 'p',
        html: 'A una frecuencia de 100 Hz, cada ciclo dura exactamente <strong>10 milisegundos</strong> (<code>T = 1 s / 100 = 10 ms</code>):',
      },
      {
        type: 'ul',
        items: [
          '<strong>10% de Ciclo de Trabajo:</strong> Cerrado <strong>1 ms</strong> (ON), abierto <strong>9 ms</strong> (OFF). El motor recibe un impulso breve y luego gira por inercia.',
          '<strong>50% de Ciclo de Trabajo:</strong> Cerrado <strong>5 ms</strong> (ON), abierto <strong>5 ms</strong> (OFF). Mitad impulso, mitad inercia.',
          '<strong>90% de Ciclo de Trabajo:</strong> Cerrado <strong>9 ms</strong> (ON), abierto <strong>1 ms</strong> (OFF). Empuje casi continuo.',
        ],
      },
      { type: 'h2', text: '2. ¿Por Qué el Motor No Tironea?' },
      {
        type: 'p',
        html: 'Porque en PWM real la conmutación ocurre cientos o miles de veces por segundo: la <strong>inercia mecánica</strong> del rotor y la <strong>inductancia</strong> de las bobinas suavizan los huecos OFF. Observa la gráfica en vivo abajo: la curva azul de velocidad suaviza los pulsos verdes binarios de 12 V.',
      },
    ],
    blocksAfterDiagram: [
      { type: 'h2', text: 'Resumen: La Potencia Está en el Tiempo' },
      {
        type: 'p',
        html: 'El ECU jamás reduce la altura de los pulsos (siempre llegan a 12 V completos); solo varía cuánto tiempo permanece cerrado el interruptor en cada período.',
      },
    ],
    quizzes: [
      {
        question: '¿Cómo varía un driver MOSFET de estado sólido la potencia promedio entregada a un motor DC?',
        options: [
          { text: 'Cambiando la proporción de tiempo ON frente a tiempo OFF en cada ciclo.', correct: true },
          { text: 'Abriendo parcialmente el MOSFET para que actúe como resistencia variable.', correct: false },
          { text: 'Bajando el voltaje de la batería a 3 V o 6 V.', correct: false },
          { text: 'Invirtiendo la polaridad de la corriente en cada pulso.', correct: false },
        ],
        explanation:
          'PWM regula la potencia ajustando únicamente la duración del estado ON respecto al período total mientras conmuta entre 100% ON y 100% OFF.',
      },
      {
        question: 'Si un ventilador opera al 20% de ciclo de trabajo, ¿qué hace el motor el 80% restante del tiempo?',
        options: [
          { text: 'Gira libremente por su propia inercia mecánica sin empuje eléctrico.', correct: true },
          { text: 'Consume su corriente pico de arranque.', correct: false },
          { text: 'Recibe un voltaje analógico continuo de 2.4 V.', correct: false },
          { text: 'Frena activamente con polaridad inversa.', correct: false },
        ],
        explanation:
          'Al 20% de ciclo de trabajo el interruptor está abierto el 80% del período; durante ese tiempo el rotor continúa girando suavemente por inercia.',
      },
    ],
  },

  '0008-pwm-fuel-pump-control': {
    blocksBeforeDiagram: [
      {
        type: 'p',
        html: 'En autos antiguos la bomba eléctrica de combustible trabajaba siempre al 100% mientras el motor giraba, y un regulador mecánico devolvía el sobrante al tanque. Los autos actuales usan <strong>Sistemas de Combustible Sin Retorno (PWM)</strong> para bombear exactamente lo que el motor demanda.',
      },
      { type: 'h2', text: '1. Por Qué Se Migró al Control PWM de Combustible' },
      {
        type: 'ul',
        items: [
          '<strong>Menos Emisiones EVAP:</strong> Recircular gasolina sobre el riel caliente del motor calienta el tanque y genera vapores excesivos que saturan el canister EVAP.',
          '<strong>Menor Consumo Eléctrico:</strong> Una bomba al 100% consume 8–10 A constantes del alternador; con PWM el consumo en ralentí cae drásticamente.',
          '<strong>Mayor Vida Útil:</strong> Al girar más lento en ralentí y crucero se reduce el desgaste interno de escobillas y motor.',
        ],
      },
      { type: 'h2', text: '2. Control en Lazo Cerrado de Presión del Riel' },
      {
        type: 'ol',
        items: [
          'El <strong>Sensor de Presión del Riel de Combustible (FRP)</strong> mide continuamente la presión junto a los inyectores (objetivo típico de 40–60 psi).',
          'Al pisar el acelerador los inyectores abren más y la presión cae brevemente.',
          'El PCM detecta el error y aumenta el ciclo de trabajo PWM para acelerar la bomba y recuperar la presión objetivo.',
          'Al soltar el acelerador, el PCM reduce el ciclo de trabajo manteniendo la presión estable.',
        ],
      },
      { type: 'h2', text: '3. Arquitectura de Dos Etapas: PCM → FPDM → Bomba' },
      {
        type: 'equation',
        text: 'PCM (Control 80 Hz)  →  FPDM (Etapa de Potencia)  →  Bomba (Drive 20 kHz)',
      },
      {
        type: 'p',
        html: 'Como la bomba demanda alta corriente, el PCM envía una señal de control robusta y de baja corriente a <strong>80 Hz</strong> hacia el <strong>Módulo Driver de Bomba de Combustible (FPDM)</strong>. El FPDM traduce ese ciclo de trabajo en un impulso de alta corriente a <strong>20 kHz</strong> (ultrasónico), eliminando pulsaciones de presión y ruido audible.',
      },
    ],
    blocksAfterDiagram: [
      {
        type: 'callout',
        tone: 'tip',
        title: 'Observa la Recuperación en Lazo Cerrado',
        html: 'Arrastra rápidamente el pedal del acelerador de 0% a 100% en el simulador. Verás caer momentáneamente el manómetro de presión cuando los inyectores piden más flujo, y recuperarse suavemente a la zona verde de <strong>40 psi</strong> al subir el ciclo FPDM a 85%.',
      },
    ],
    quizzes: [
      {
        question: '¿Qué gran beneficio ambiental y de eficiencia ofrece un sistema de combustible PWM sin retorno?',
        options: [
          {
            text: 'Evita calentar la gasolina del tanque por líneas de retorno, reduciendo vapores EVAP y carga al alternador.',
            correct: true,
          },
          { text: 'Elimina la necesidad de inyectores electrónicos.', correct: false },
          { text: 'Eleva la presión del riel por encima de 200 psi en ralentí.', correct: false },
          { text: 'Enciende la bomba solo al frenar el vehículo.', correct: false },
        ],
        explanation:
          'Al entregar solo el combustible necesario, se evita calentar el tanque con gasolina recirculada desde el motor, disminuyendo vapores EVAP y consumo eléctrico.',
      },
      {
        question: '¿Cómo comunica el PCM la velocidad requerida al Módulo Driver de Bomba (FPDM)?',
        options: [
          { text: 'Envía una señal PWM de baja corriente y baja frecuencia (ej. 80 Hz) con el ciclo de trabajo.', correct: true },
          { text: 'Conmuta directamente los 10 A de la bomba desde los pines del PCM.', correct: false },
          { text: 'Modifica el voltaje del alternador entre 6 V y 14 V.', correct: false },
          { text: 'Desconecta el sensor FRP al acelerar.', correct: false },
        ],
        explanation:
          'El PCM envía un comando limpio de baja corriente a 80 Hz; el FPDM realiza la conmutación de potencia a 20 kHz hacia la bomba.',
      },
    ],
  },
}
