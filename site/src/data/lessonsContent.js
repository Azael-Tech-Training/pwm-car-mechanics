import { LESSON_CONTENT_ES } from './lessonsContentEs.js'

export const LESSON_CONTENT = {
  '0001-what-is-pwm-and-why-cars': {
    blocksBeforeDiagram: [
      {
        type: 'p',
        html: 'In modern vehicles, electricity does far more than turn devices simply "on" or "off." It precisely controls the speed of fuel pumps, the cooling rate of radiator fans, the brightness of instrument clusters, and the positioning of fuel injectors. To understand how cars achieve this, we must first look at where they started.',
      },
      { type: 'h2', text: 'The Old Way: Resistor Packs & Dissipated Heat' },
      {
        type: 'p',
        html: 'Before modern computers controlled cars, varying the speed of an electric component (like a cabin blower fan) was done using <strong>series resistors</strong>. If you wanted the blower fan to run at "Low" speed, the switch routed current through a bank of heavy resistors that restricted flow and dropped the voltage reaching the fan motor.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'The Critical Efficiency Flaw',
        html: 'Resistors control speed by converting unwanted electrical energy into <strong>heat</strong>. In older cars, cabin blower resistor packs had to be mounted directly inside the ventilation duct so incoming air could cool them. If airflow dropped, the resistors overheated and burned out, leaving the blower functional only on "High" speed (which bypassed the resistors entirely).',
      },
      { type: 'h2', text: 'The Modern Way: Pulse Width Modulation (PWM)' },
      {
        type: 'p',
        html: 'Modern vehicles use solid-state transistors (typically MOSFETs) inside the Engine Control Unit (ECU) or dedicated driver modules to vary power. Instead of inserting resistive restriction into the circuit, the transistor acts as an ultra-fast switch, turning the supply fully <strong>ON</strong> and fully <strong>OFF</strong> hundreds or thousands of times per second.',
      },
      {
        type: 'ul',
        items: [
          '<strong>When the switch is ON:</strong> Resistance is near zero, meaning virtually no voltage drop across the switch and minimal heat generated.',
          '<strong>When the switch is OFF:</strong> No current flows, meaning zero energy is consumed and zero heat is generated.',
        ],
      },
      {
        type: 'p',
        html: 'By varying the ratio of "on-time" to "off-time," the ECU controls the <strong>average voltage</strong> received by the actuator without wasting power as heat. This is <strong>Pulse Width Modulation (PWM)</strong>.',
      },
      { type: 'h2', text: 'Key Parameters of a PWM Signal' },
      {
        type: 'ol',
        items: [
          '<strong>Duty Cycle (D):</strong> The percentage of time the signal is ON during one complete cycle. 0% is fully off; 100% is fully on.',
          '<strong>Period (T):</strong> The total time required to complete one ON/OFF cycle.',
          '<strong>Frequency (f):</strong> How many cycles occur per second (<code>f = 1 / T</code>), measured in Hertz (Hz).',
        ],
      },
    ],
    blocksAfterDiagram: [
      {
        type: 'callout',
        tone: 'tip',
        title: 'Frequency vs. Human Perception',
        html: 'Try clicking the <strong>5 Hz</strong> preset or dragging Frequency below 15 Hz in the simulator above. Notice how the bulb flickers and the fan pulses unevenly? In real vehicles, PWM runs between <strong>100 Hz and 20 kHz</strong>, keeping switching completely invisible to human eyes and letting motor inertia smooth the rotation.',
      },
    ],
    quizzes: [
      {
        question:
          "If a vehicle's 12-volt radiator fan is controlled by a PWM signal with a 40% duty cycle, what is the average voltage delivered to the fan?",
        options: [
          { text: 'The average voltage is 2.4 volts.', correct: false },
          { text: 'The average voltage is 4.8 volts.', correct: true },
          { text: 'The average voltage is 6.0 volts.', correct: false },
          { text: 'The average voltage is 9.6 volts.', correct: false },
        ],
        explanation:
          'Average voltage equals source voltage (12 V) multiplied by the duty cycle (40%): 12 × 0.40 = 4.8 V.',
      },
      {
        question:
          'What was the primary engineering reason car manufacturers replaced series resistors with PWM control for blowers and fans?',
        options: [
          { text: 'To reduce thermal energy waste and boost electrical efficiency.', correct: true },
          { text: 'To lower manufacturing costs and simplify system layouts.', correct: false },
          { text: 'To increase maximum output voltage above 12 volts.', correct: false },
          { text: 'To eliminate the need for fuses in automotive circuits.', correct: false },
        ],
        explanation:
          'Series resistors burn excess electrical energy as heat. Switching rapidly with PWM eliminates resistive thermal losses and dramatically improves efficiency.',
      },
    ],
  },

  '0002-low-side-vs-high-side': {
    blocksBeforeDiagram: [
      {
        type: 'p',
        html: 'In Lesson 01, we saw how the Engine Control Unit (ECU) uses transistors as high-speed switches to modulate power to actuators. Next, we examine <strong>where</strong> that transistor switch sits in the circuit, how it operates internally, and why placement dictates vehicle safety and fault symptoms.',
      },
      { type: 'h2', text: "The ECU's Solid-State Relays: MOSFETs" },
      {
        type: 'p',
        html: 'An ECU microcontroller operates at 5 V or 3.3 V and can only source a few milliamperes. To switch a radiator cooling fan drawing 15 A at 12 V, the ECU drives a <strong>MOSFET</strong> (Metal-Oxide-Semiconductor Field-Effect Transistor):',
      },
      {
        type: 'ul',
        items: [
          '<strong>N-Channel MOSFET:</strong> Turns ON when a positive voltage is applied to its Gate relative to Source. Highly efficient, affordable, and has very low on-resistance (<code>R_DS(on)</code>).',
          '<strong>P-Channel MOSFET:</strong> Turns ON when Gate voltage is pulled low relative to Source. Slightly higher resistance and cost, but simplifies switching the +12 V power rail directly.',
        ],
      },
      { type: 'h2', text: 'Switching Strategies: Low-Side vs. High-Side' },
      {
        type: 'callout',
        tone: 'info',
        title: 'Low-Side Switching (Standard Config)',
        html: 'The transistor switch is placed on the <strong>ground side</strong> of the actuator. The actuator is fed +12 V continuously through a fuse; to energize it, the ECU drives an <strong>N-channel MOSFET</strong> that completes the path to chassis ground.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'High-Side Switching (Safety Config)',
        html: 'The transistor switch is placed on the <strong>power side</strong> of the actuator. The actuator is tied permanently to chassis ground; the ECU closes a <strong>P-channel MOSFET</strong> or Smart High-Side Driver to deliver +12 V.',
      },
      { type: 'h2', text: 'Why Location Matters: The Short-to-Ground Fault' },
      {
        type: 'p',
        html: 'Because a car’s metal chassis acts as battery negative (ground), rubbed harness insulation most often creates a <strong>short-to-ground</strong>. Toggle between Low-Side and High-Side below, turn the Gate ON/OFF, and inject a short-to-ground fault to watch how both topologies react.',
      },
    ],
    blocksAfterDiagram: [],
    quizzes: [
      {
        question:
          'If a low-side controlled cooling fan has its control wire pinched and shorted to the metal chassis, what will be the symptom?',
        options: [
          { text: 'The cooling fan runs constantly at full speed.', correct: true },
          { text: 'The circuit fuse immediately blows and melts.', correct: false },
          { text: 'The control module is permanently destroyed.', correct: false },
          { text: 'The fan operates only at half efficiency.', correct: false },
        ],
        explanation:
          'Because the fan motor sits before the switch, a ground short on the control wire bypasses the switch while current still flows through the motor windings. Motor resistance limits current so the fuse stays intact, but the fan runs continuously.',
      },
      {
        question:
          'Why do automotive manufacturers prefer N-channel MOSFET low-side drivers over high-side configurations for most motors?',
        options: [
          { text: 'They exhibit lower internal resistance and reduce production costs.', correct: true },
          { text: 'They generate less electromagnetic noise and simplify wire routing.', correct: false },
          { text: 'They automatically prevent any short-to-ground faults.', correct: false },
          { text: 'They allow higher battery voltages than 12 V.', correct: false },
        ],
        explanation:
          'N-channel MOSFETs have significantly lower R_DS(on) than equivalent P-channel devices, generating less heat and costing less per silicon die.',
      },
    ],
  },

  '0003-diagnostics-multimeter-oscilloscope': {
    blocksBeforeDiagram: [
      {
        type: 'p',
        html: 'Now that you understand where the ECU driver sits in a low-side circuit, let’s learn how to diagnose PWM circuits on a real vehicle. Troubleshooting high-speed pulsed lines requires choosing the right instrument and knowing what each measurement hides—or reveals.',
      },
      { type: 'h2', text: 'The Diagnostic Dilemma: Average vs. Peak Voltage' },
      {
        type: 'p',
        html: 'In simple DC circuits (like a classic incandescent headlight), a wire is either steady 12 V or steady 0 V. In a PWM circuit, the voltage switches hundreds of times per second, creating a classic diagnostic trap:',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'The Multimeter Integration Trap',
        html: 'A Digital Multimeter (DMM) in DC Volts mode is too slow to track a 100 Hz or 20 kHz square wave—instead it displays the <strong>time-averaged voltage</strong>. A healthy low-side fan at 50% duty reads <strong>6.0 V</strong>. While handy for a sanity check, a DC average hides corroded ground offsets, signal noise, and intermittent dropouts.',
      },
      { type: 'h2', text: 'Comparing the Tools' },
      {
        type: 'ul',
        items: [
          '<strong>Digital Multimeter (DMM):</strong> Fast for initial checks. Better automotive meters include <strong>Frequency (Hz)</strong> and <strong>Duty Cycle (%)</strong> modes to read PWM commands directly.',
          '<strong>Oscilloscope:</strong> The diagnostic gold standard. Plots voltage over time so you can inspect pulse edges, peak amplitudes, and bad-ground voltage offsets in real time.',
        ],
      },
      { type: 'h2', text: 'Interactive Diagnostic Lab' },
      {
        type: 'p',
        html: 'Select a circuit condition below, click <strong>TP1</strong>, <strong>TP2</strong>, or <strong>TP3</strong> on the schematic, and switch between the Multimeter and the Oscilloscope. Pay special attention to the <strong>Corroded ECU Ground</strong> fault!',
      },
    ],
    blocksAfterDiagram: [],
    quizzes: [
      {
        question:
          'You connect an oscilloscope to TP2 (the control line) on a low-side switched cooling fan. When commanded ON, you see a crisp square wave switching between 2.5 V and 12 V. What is the root cause?',
        options: [
          { text: 'The fan motor is internally shorted, drawing excessive current.', correct: false },
          { text: 'There is high resistance (corrosion) on the ground circuit after the ECU driver.', correct: true },
          { text: 'The battery voltage has dropped below specification.', correct: false },
          { text: 'The N-channel MOSFET inside the ECU is shorted open.', correct: false },
        ],
        explanation:
          'High resistance in the ECU ground path creates a voltage drop whenever current flows through the closed MOSFET, lifting the "low" floor of the square wave from 0 V up to 2.5 V.',
      },
      {
        question:
          'Why does a standard DC voltmeter read 12.0 V at TP2 (the control line) when a low-side fan is commanded OFF?',
        options: [
          {
            text: 'The open driver switch stops current flow, eliminating any voltage drop across the motor coils.',
            correct: true,
          },
          { text: 'The ECU driver switches to high-side mode when idle.', correct: false },
          { text: 'The fuse has blown, isolating the circuit from ground.', correct: false },
          { text: 'Internal safety capacitors inside the fan hold a 12 V charge.', correct: false },
        ],
        explanation:
          'With the low-side switch open, zero current flows through the fan coils—so there is zero voltage drop across them. The control wire therefore "pulls up" to full 12.0 V battery potential.',
      },
    ],
  },

  '0004-how-shorts-blow-fuses': {
    blocksBeforeDiagram: [
      {
        type: 'p',
        html: 'We saw earlier that a short-to-ground blows the fuse in a high-side circuit but leaves the fuse intact in a low-side control-wire short. Today we examine the exact physics—<strong>Ohm’s Law</strong> and <strong>Joule Heating</strong>—that melt a fuse link in milliseconds.',
      },
      { type: 'h2', text: '1. Resistance Limits Current (Ohm’s Law)' },
      { type: 'equation', text: 'Current (I) = Voltage (V) / Resistance (R)' },
      {
        type: 'p',
        html: 'In a healthy circuit, the <strong>load</strong> (a 2.0 Ω fan motor) provides almost all of the resistance. The copper harness and fuse link add only ~0.02 Ω. On a 12 V system:',
      },
      { type: 'equation', text: 'I = 12 V / 2.02 Ω ≈ 5.9 A' },
      {
        type: 'p',
        html: 'A 15 A fuse handles 6 A effortlessly without heating up, keeping the circuit safe.',
      },
      { type: 'h2', text: '2. Bypassing the Load: The 240 A Surge' },
      {
        type: 'p',
        html: 'If the +12 V wire rubs through to the metal chassis <strong>before</strong> the fan motor, current bypasses the 2.0 Ω load completely. Only the tiny ~0.05 Ω resistance of the fuse and wire remains:',
      },
      { type: 'equation', tone: 'danger', text: 'I = 12 V / 0.05 Ω = 240 Amperes!' },
      { type: 'h2', text: '3. Joule Heating: Turning Excess Current Into Heat' },
      {
        type: 'p',
        html: 'Heat generated inside the fuse link scales with the <strong>square</strong> of current:',
      },
      { type: 'equation', tone: 'danger', text: 'Power (Heat) = I² × R_fuse' },
      {
        type: 'ul',
        items: [
          '<strong>Normal Load (6 A):</strong> <code>P = 6² × 0.02 Ω = 0.72 W</code> — tiny heat, easily dissipated into the plastic body.',
          '<strong>Chassis Short (240 A):</strong> <code>P = 240² × 0.02 Ω = 1,152 W</code> — microwave-level heat concentrated into a metal strip smaller than a fingernail! It melts open in milliseconds, creating an air gap before the wiring harness can catch fire.',
        ],
      },
    ],
    blocksAfterDiagram: [
      { type: 'h2', text: 'Summary: Why Low-Side Shorts Don’t Blow Fuses' },
      {
        type: 'p',
        html: 'In a <strong>High-Side</strong> fault (or any short before the load), resistance collapses to ~0.05 Ω and the fuse melts instantly. In a <strong>Low-Side</strong> control-wire fault, the short happens <em>after</em> the load—so the motor’s 2.0 Ω winding still caps current at ~6 A. The fuse survives, and the motor stays stuck ON.',
      },
    ],
    quizzes: [
      {
        question:
          'Under a short-to-ground fault that bypasses a 2 Ω fan motor, what directly causes the fuse element to melt?',
        options: [
          { text: 'The massive current spike generates extreme I²R Joule heating inside the link.', correct: true },
          { text: 'Battery voltage surges well above 12 volts.', correct: false },
          { text: 'Circuit resistance rises above nominal ohm ratings.', correct: false },
          { text: 'Static charge from the chassis shatters the fuse casing.', correct: false },
        ],
        explanation:
          'Ohm’s Law drives current up to ~240 A when load resistance is bypassed, and Joule heating (P = I² × R) spikes by a factor of 1,600× inside the fuse strip.',
      },
      {
        question: 'Why does a low-side control-wire short to ground NOT blow the circuit fuse?',
        options: [
          { text: 'The actuator’s internal resistance remains in series and limits current to normal levels.', correct: true },
          { text: 'The ECU switch stays open and blocks current from leaving the battery.', correct: false },
          { text: 'The metal chassis absorbs excess current safely.', correct: false },
          { text: 'The battery automatically throttles output power during a fault.', correct: false },
        ],
        explanation:
          'Because the load sits between the fuse and the shorted control wire, current must still pass through the load’s resistance, preventing an over-current surge.',
      },
    ],
  },

  '0005-ecu-control-logic': {
    blocksBeforeDiagram: [
      {
        type: 'p',
        html: 'Here is a foundational insight: <strong>pure Direct Current (DC) is simply a PWM signal running at 100% duty cycle and 0 Hz frequency.</strong> In this lesson, we explore both extremes, how the ECU calculates duty cycle using sensor feedback, and why switching frequency remains fixed.',
      },
      { type: 'h2', text: '1. The Two Extremes: 0% and 100% Duty Cycle' },
      {
        type: 'ul',
        items: [
          '<strong>0% Duty Cycle:</strong> The switch is permanently open (flat 0 V). No transitions occur, so frequency is <strong>0 Hz</strong>.',
          '<strong>100% Duty Cycle:</strong> The switch is permanently closed (flat 12 V). The voltage never drops low, so frequency is <strong>0 Hz</strong>—pure continuous DC.',
        ],
      },
      {
        type: 'p',
        html: 'Between 1% and 99%, the ECU pulses the output at a fixed <strong>Frequency</strong> and varies only the pulse width.',
      },
      { type: 'h2', text: '2. Closed-Loop Feedback Control' },
      {
        type: 'p',
        html: 'The ECU never guesses fan speed—it runs a continuous <strong>Closed-Loop Feedback</strong> cycle:',
      },
      {
        type: 'ol',
        items: [
          '<strong>Input (Sensor):</strong> Reads the <strong>Engine Coolant Temperature (ECT)</strong> sensor.',
          '<strong>Setpoint (Target):</strong> Compares actual temperature against its stored target (e.g. 90°C).',
          '<strong>Error Calculation:</strong> Subtracts target from actual temperature to determine cooling demand.',
          '<strong>Map Lookup (Output):</strong> Translates temperature into duty cycle—0% under 85°C, ramping smoothly through 90–105°C, up to 100% above 110°C.',
        ],
      },
      { type: 'h2', text: '3. Why Frequency Stays Constant' },
      {
        type: 'p',
        html: 'Engineers pick one optimal carrier frequency (e.g. <strong>150 Hz</strong>) tailored to the motor and MOSFET: too low causes audible humming and vibration; too high increases MOSFET switching heat. Once selected, frequency stays locked and only duty cycle changes.',
      },
    ],
    blocksAfterDiagram: [],
    quizzes: [
      {
        question: 'Why is the PWM switching frequency kept constant while the duty cycle varies?',
        options: [
          {
            text: 'The frequency is tuned to the actuator and MOSFET to balance smooth operation, low noise, and low switching heat.',
            correct: true,
          },
          { text: 'Automotive microcontrollers are physically unable to output different frequencies.', correct: false },
          { text: 'Changing frequency would drain the 12 V battery immediately.', correct: false },
          { text: 'Sensors can only read data when frequency is locked to 60 Hz.', correct: false },
        ],
        explanation:
          'Each actuator and driver stage has an optimal switching frequency that avoids audible whine while minimizing MOSFET switching losses. Power is varied purely via duty cycle.',
      },
      {
        question:
          'Which sensor input does an ECU primarily use to calculate the radiator cooling fan’s PWM duty cycle?',
        options: [
          { text: 'The Engine Coolant Temperature (ECT) sensor.', correct: true },
          { text: 'The Intake Air Temperature (IAT) sensor.', correct: false },
          { text: 'The Manifold Absolute Pressure (MAP) sensor.', correct: false },
          { text: 'The Wheel Speed Sensor (WSS).', correct: false },
        ],
        explanation:
          'The ECT sensor feeds live coolant temperature back to the ECU, closing the thermal control loop for the radiator fan.',
      },
    ],
  },

  '0006-how-low-side-switching-controls-flow': {
    blocksBeforeDiagram: [
      {
        type: 'p',
        html: 'A classic stumbling block is wondering how a switch on the <strong>ground side (low-side)</strong> can shut off a fan that is still wired directly to +12 V. Shouldn’t current keep flowing into the fan? The answer lies in the <strong>Series Loop Rule</strong> and the <strong>Garden Hose Analogy</strong>.',
      },
      { type: 'h2', text: '1. The Series Loop Rule' },
      {
        type: 'p',
        html: 'Electrical current is the circulation of charge around a complete closed loop. If you break that loop <strong>anywhere</strong>—at the positive supply (high-side) or at the ground exit (low-side)—current stops flowing <strong>everywhere</strong> in the series path immediately.',
      },
      { type: 'h2', text: '2. The Pressurized Garden Hose Analogy' },
      {
        type: 'ul',
        items: [
          '<strong>Spigot (Battery +12 V):</strong> Supplies constant pressure (voltage).',
          '<strong>Hose (Wiring):</strong> Carries flow along the loop.',
          '<strong>Sprinkler Wheel (Fan Load):</strong> Spins only when water moves through it.',
          '<strong>End Nozzle Valve (Low-Side MOSFET):</strong> Blocks or releases water at the exit.',
          '<strong>Drain (Chassis Ground):</strong> Where water leaves the system.',
        ],
      },
      {
        type: 'p',
        html: 'When you close the nozzle at the <strong>end</strong> of a pressurized hose, water still sits inside the hose under full pressure—but because it cannot exit to the drain, zero water flows and the sprinkler wheel stops completely.',
      },
    ],
    blocksAfterDiagram: [
      { type: 'h2', text: 'Summary: The Pull-Up State' },
      {
        type: 'p',
        html: 'When a low-side MOSFET is open (OFF), the control wire between the fan and the MOSFET stays pressurized at <strong>+12 V</strong> through the motor coils—just like trapped water pressure ahead of a closed hose nozzle. The instant the ECU closes the MOSFET to ground, that wire drops to <strong>0 V</strong> and current flows through the loop.',
      },
    ],
    quizzes: [
      {
        question: 'In a series circuit, what happens to current flow when a ground-side (low-side) switch opens?',
        options: [
          { text: 'Current ceases flowing through the entire series loop immediately.', correct: true },
          { text: 'Current keeps flowing into the load and piles up at the switch.', correct: false },
          { text: 'Electrons reverse direction back toward the positive battery post.', correct: false },
          { text: 'Voltage spikes above battery potential across the fan.', correct: false },
        ],
        explanation:
          'Because a series circuit has only one loop path, breaking it at any point halts current flow everywhere in the circuit.',
      },
      {
        question: 'In the garden hose analogy, which component corresponds to the low-side MOSFET switch?',
        options: [
          { text: 'The nozzle valve at the exit end of the hose (after the sprinkler wheel).', correct: true },
          { text: 'The wall faucet before the hose.', correct: false },
          { text: 'The sprinkler wheel itself.', correct: false },
          { text: 'The rubber hose wall.', correct: false },
        ],
        explanation:
          'A low-side MOSFET sits downstream of the load, regulating exit flow to ground exactly like a trigger nozzle at the end of a pressurized hose.',
      },
    ],
  },

  '0007-time-is-the-variable': {
    blocksBeforeDiagram: [
      {
        type: 'p',
        html: 'Another common misconception is that the ECU varies duty cycle by opening a transistor "partway," like cracking a faucet. In reality, an automotive PWM MOSFET is strictly binary: <strong>it is either 100% ON (12 V) or 100% OFF (0 V).</strong>',
      },
      {
        type: 'p',
        html: 'So how does a strictly binary switch deliver 25%, 50%, or 80% motor power? The variable is <strong>Time</strong>.',
      },
      { type: 'h2', text: '1. Modulating Time Within Every Cycle' },
      {
        type: 'p',
        html: 'At a 100 Hz switching frequency, each complete cycle lasts exactly <strong>10 milliseconds</strong> (<code>T = 1 s / 100 = 10 ms</code>):',
      },
      {
        type: 'ul',
        items: [
          '<strong>10% Duty Cycle:</strong> Switch closed for <strong>1 ms</strong> (ON), open for <strong>9 ms</strong> (OFF). The motor gets a brief push, then coasts.',
          '<strong>50% Duty Cycle:</strong> Switch closed for <strong>5 ms</strong> (ON), open for <strong>5 ms</strong> (OFF). Equal push and coast.',
          '<strong>90% Duty Cycle:</strong> Switch closed for <strong>9 ms</strong> (ON), open for <strong>1 ms</strong> (OFF). Almost continuous drive.',
        ],
      },
      { type: 'h2', text: '2. Why Doesn’t the Motor Stutter?' },
      {
        type: 'p',
        html: 'Because real automotive PWM switches hundreds or thousands of times per second, the rotor’s <strong>mechanical inertia</strong> and the coil’s <strong>electrical inductance</strong> bridge every OFF interval. Watch the live scrolling trace below—try both Manual Tap Mode and 1 Hz Auto Mode to see the blue inertia curve smooth out the green binary pulses!',
      },
    ],
    blocksAfterDiagram: [
      { type: 'h2', text: 'Summary: Power Is in the Timing' },
      {
        type: 'p',
        html: 'The ECU never lowers the peak pulse voltage—every pulse still hits full 12 V. By controlling the ratio of ON duration to OFF duration, it achieves smooth, cool, high-efficiency speed regulation.',
      },
    ],
    quizzes: [
      {
        question: 'How does a solid-state ECU MOSFET driver vary the average power delivered to a DC motor?',
        options: [
          { text: 'It changes the relative ON duration vs. OFF duration within each cycle.', correct: true },
          { text: 'It partially turns on the MOSFET to act as a variable resistor.', correct: false },
          { text: 'It reduces battery voltage down to 3 V or 6 V.', correct: false },
          { text: 'It reverses current polarity on every second pulse.', correct: false },
        ],
        explanation:
          'PWM varies power strictly by adjusting the proportion of ON time to total cycle period while switching cleanly between fully ON and fully OFF.',
      },
      {
        question: 'If a cooling fan runs at a 20% duty cycle, what is the motor doing 80% of the time?',
        options: [
          { text: 'Coasting smoothly on its own mechanical momentum with no electrical push.', correct: true },
          { text: 'Drawing peak starting current from the battery.', correct: false },
          { text: 'Receiving a steady 2.4 V analog supply.', correct: false },
          { text: 'Actively braking against reverse battery polarity.', correct: false },
        ],
        explanation:
          'At 20% duty, the MOSFET is open for 80% of every period—during that interval the fan coasts smoothly on rotational inertia.',
      },
    ],
  },

  '0008-pwm-fuel-pump-control': {
    blocksBeforeDiagram: [
      {
        type: 'p',
        html: 'In older vehicles, the electric fuel pump ran flat-out at 100% speed whenever the engine was running, while a mechanical regulator sent unused fuel back to the tank through a return pipe. Modern vehicles use <strong>Returnless PWM Fuel Systems</strong> to pump only the fuel the engine actually needs.',
      },
      { type: 'h2', text: '1. Why Automakers Switched to PWM Fuel Control' },
      {
        type: 'ul',
        items: [
          '<strong>Lower EVAP Emissions:</strong> Recirculating fuel across a hot engine rail heats the tank and creates excess gasoline vapor that overloads the EVAP charcoal canister.',
          '<strong>Lower Electrical Drain:</strong> Running a pump at 100% draws 8–10 A continuously from the alternator; PWM cuts idle current dramatically.',
          '<strong>Longer Pump Life:</strong> Running slower at idle and cruise reduces brush and commutator wear.',
        ],
      },
      { type: 'h2', text: '2. Closed-Loop Fuel Rail Pressure Control' },
      {
        type: 'ol',
        items: [
          'The <strong>Fuel Rail Pressure (FRP) Sensor</strong> continuously measures pressure right at the injector rail (typically targeting 40–60 psi).',
          'Pressing the accelerator opens the injectors wider, causing a brief dip in rail pressure.',
          'The PCM detects the pressure error and raises the commanded PWM duty cycle so the pump speeds up and restores target pressure.',
          'Lifting off the throttle closes the injectors; the PCM lowers duty cycle to hold pressure rock-steady.',
        ],
      },
      { type: 'h2', text: '3. Two-Stage Architecture: PCM → FPDM → Pump' },
      {
        type: 'equation',
        text: 'PCM (80 Hz Control)  →  FPDM (Power Stage)  →  Fuel Pump (20 kHz Drive)',
      },
      {
        type: 'p',
        html: 'Because fuel pumps draw high current, the PCM sends a robust, low-current <strong>80 Hz</strong> duty-cycle command to a dedicated <strong>Fuel Pump Driver Module (FPDM)</strong>. The FPDM translates that command into a high-current, ultrasonic <strong>20 kHz</strong> PWM output—eliminating pressure ripples and keeping motor whine above human hearing.',
      },
    ],
    blocksAfterDiagram: [
      {
        type: 'callout',
        tone: 'tip',
        title: 'Watch the Closed-Loop Recovery',
        html: 'Drag the Accelerator Pedal slider quickly from 0% to 100% above. Watch the Fuel Rail Pressure gauge dip momentarily as the injectors demand more fuel, then watch the closed-loop controller recover right back into the green <strong>40 psi</strong> target band as FPDM duty climbs to 85%!',
      },
    ],
    quizzes: [
      {
        question: 'What major emissions and efficiency benefit does a returnless PWM fuel system deliver?',
        options: [
          { text: 'It avoids heating tank fuel via hot return lines, cutting EVAP vapor formation and alternator load.', correct: true },
          { text: 'It eliminates the need for fuel injectors on the intake manifold.', correct: false },
          { text: 'It increases fuel rail pressure above 200 psi at idle.', correct: false },
          { text: 'It runs the fuel pump only while the vehicle is braking.', correct: false },
        ],
        explanation:
          'By pumping only the volume demanded by the engine, returnless PWM systems prevent fuel from circulating over the hot engine rail and back to the tank, lowering vapor pressure and electrical draw.',
      },
      {
        question: 'How does the PCM communicate fuel pump speed requests to the Fuel Pump Driver Module (FPDM)?',
        options: [
          { text: 'It sends a low-current, low-frequency (e.g. 80 Hz) PWM duty-cycle command signal.', correct: true },
          { text: 'It switches the full 10 A pump motor current directly through PCM pins.', correct: false },
          { text: 'It changes battery alternator voltage between 6 V and 14 V.', correct: false },
          { text: 'It disconnects the fuel rail pressure sensor during acceleration.', correct: false },
        ],
        explanation:
          'The PCM sends a clean low-current 80 Hz duty-cycle command; the FPDM handles high-current switching at 20 kHz to drive the pump smoothly.',
      },
    ],
  },
}

export function getLessonContent(slug, lang = 'es') {
  if (lang === 'es' && LESSON_CONTENT_ES[slug]) {
    return LESSON_CONTENT_ES[slug]
  }
  return LESSON_CONTENT[slug] || LESSON_CONTENT_ES[slug] || null
}
