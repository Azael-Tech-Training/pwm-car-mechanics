---
title: "Lesson 7: Time Is the Variable"
description: "How time variables affect PWM signal analysis and diagnostics"
difficulty: "advanced"
time: "PT40M"
---

# Lesson 7: Time Is the Variable

Time is the critical variable that connects PWM frequency, period, duty cycle, and real-world actuator response. This lesson explores how time-based analysis is essential for effective diagnostics.

## Time-Based PWM Metrics

### Period (T) and Frequency (f) Relationship

The fundamental relationship between period and frequency:

```
f = 1 / T
```

Where:
- **f** = frequency in Hertz (cycles per second)
- **T** = period in seconds (time for one complete cycle)

### Common Automotive PWM Periods

| Frequency | Period | Application |
|-----------|--------|-------------|
| 10 Hz | 100 ms | EVAP purge solenoid |
| 100 Hz | 10 ms | Cabin blower fan start |
| 500 Hz | 2 ms | Radiator fan moderate speed |
| 1 kHz | 1 ms | Electronic throttle body |
| 5 kHz | 200 µs | Precision motor control |
| 10 kHz | 100 µs | High-frequency switching |
| 20 kHz | 50 µs | Ultrasonic cleaning, some injectors |

### Period Measurement Challenges

**Using a Multimeter**:

- Most DMMs can measure frequency, then display period
- Resolution limited to about 0.1 Hz accuracy
- May struggle on noisy or intermittent signals

**Using an Oscilloscope**:

- Timebase setting directly shows period
- X10 probes extend voltage range but affect time measurement
- Cursors provide precise period measurement

## Time-Averaged vs Instantaneous Values

### Duty Cycle Time Integration

The average voltage over one complete period:

```
V_avg = V_source × (t_ON / T)
```

Where:
- **t_ON** = time the signal is HIGH within one period
- **T** = total period time
- **V_source** = battery/Supply voltage

**Example**: 12V battery, 40% duty cycle, 10ms period:
- t_ON = 40% × 10ms = 4ms
- t_OFF = 60% × 10ms = 6ms
- V_avg = 12V × 0.40 = 4.8V (regardless of frequency)

### Why Frequency Matters (Even Though V_avg Doesn't Change)

**Low Frequency Effects** (10-100 Hz):

- Visible flickering on indicator lights
- Motor pulsation felt in fans
- Audible humming or switching noise
- Thermal cycling of components

**High Frequency Effects** (10 kHz-20 kHz):

- Smoothing effect on motor rotation
- Invisible to human perception (persistence of vision)
- Reduced acoustic noise
- Lower EMI/radio interference risk

## Time-Domain Diagnostic Techniques

### Oscilloscope Timebase Settings

Proper timebase selection is critical for viewing PWM signals:

| Signal Frequency | Recommended Timebase | Cycles Visible |
|-----------------|---------------------|----------------|
| 10 Hz | 50 ms/div | 5+ complete cycles |
| 100 Hz | 10 ms/div | 10 complete cycles |
| 1 kHz | 1 ms/div | 1 complete cycle + transitions |
| 10 kHz | 100 µs/div | Detailed waveform |
| 20 kHz | 50 µs/div | High-frequency detail |

### Trigger Setup for Stable Display

1. **Select DC coupling** for 12V automotive PWM
2. **Trigger type**: "Auto" or "Repeat" (most reliable)
3. **Trigger slope**: "Rising Edge" (most common)
4. **Trigger level**: Approximately half the signal amplitude
   - For 12V signal: Set at ~6V
   - For 5V signal: Set at ~2.5V

### Measuring Duty Cycle from Oscilloscope

1. Set timebase to show at least 1 complete cycle
2. Identify t_ON (voltage HIGH duration) and t_OFF (voltage LOW duration)
3. Calculate: Duty Cycle = (t_ON / (t_ON + t_OFF)) × 100
4. Or use built-in "duty cycle" measurement function if available

## Real-World Time Variables

### Temperature Dependence

PWM parameters can change with operating temperature:

| Parameter | Cold Start (< 20°C) | Operating Temp (80-100°C) | Hot Soak (> 100°C) |
|-----------|--------------------|---------------------------|--------------------|
| **Frequency | May decrease | Stable | Stable or slightly increased |
| **Duty Cycle** | Fixed by map | May adjust for thermal protection | May reduce for cooling |
| **Period** | Manufacturer default | Within tolerance (±10%) | Within tolerance (±10%) |
| **Jitter** | May be higher | Stable | Stable |

### Voltage Dependence

- **Battery voltage fluctuations** affect absolute voltage but not duty cycle percentage
- ECU typically references duty cycle to battery voltage for consistency
- Low voltage conditions may cause duty cycle reduction to protect system

### Load Dependence

- **Resistive loads**: Current proportional to duty cycle (Ohm's Law)
- **Inductive loads** (motors, solenoids): Current ramps over time, not instantaneous
- ** capacitive loads**: Current leads voltage, phase angle considerations

## Time-Based Diagnostics Workflow

### Step 1: Capture the Waveform

1. Connect oscilloscope probe to PWM signal line
2. Set appropriate timebase (see table above)
3. Set trigger for stable display
4. Capture at least 2-3 complete cycles

### Step 2: Measure Period and Frequency

1. Measure period (T) using cursors or built-in measurement
2. Calculate frequency: f = 1/T
3. Compare to expected values (see Common Automotive PWM Periods table)

### Step 3: Measure Duty Cycle

1. Measure t_ON (HIGH time) and t_OFF (LOW time)
2. Calculate: Duty Cycle = (t_ON / T) × 100
3. Compare to expected values for the component and condition

### Step 4: Analyze Waveform Shape

1. Look for abnormalities:
   - **Jitter**: Uneven timing between cycles
   - **Glitches**: Short voltage spikes or drops
   - **Offset**: DC component shift from expected
   - **Noise**: High-frequency riding on the signal

### Step 5: Compare Healthy vs Faulted

| Normal Pattern | Fault Pattern | Likely Issue |
|---------------|--------------|--------------|
| Stable frequency, consistent duty | Frequency drifting | Lost control wire, ECU fault |
| Clean square waves | Rounded edges, spikes | Driver transistor weakening |
| Duty cycle matches command | Duty cycle stuck | Stuck-at fault in ECU logic |
| Frequency present, no duty variation | Frequency present, DC offset | Shunt resistor open, sensor fault |

## Time Verification Using Multimeter

### Frequency Measurement

1. Set DMM to Hz mode
2. Connect probes to PWM signal and ground
3. Read frequency display
4. Calculate period: T = 1/f

**Example**: DMM reads 100 Hz → T = 1/100 = 10 ms

### Duty Cycle Measurement (Advanced DMMs)

1. Set DMM to % duty cycle mode (not all multimeters have this)
2. Connect probes same as frequency measurement
3. Read duty cycle percentage directly
4. If no dedicated mode, use voltage measurement method:
   - Measure V_avg
   - Duty Cycle = V_avg / V_source × 100
   - Example: 4.8V average on 12V system = 40% duty

## Summary: Time Variable Relationships

| Metric | Formula | Typical Range | Diagnostic Use |
|--------|---------|---------------|----------------|
| **Frequency** | f = 1/T | 10 Hz – 20 kHz | Component identification |
| **Period** | T = 1/f | 50 µs – 100 ms | Timing issue detection |
| **Duty Cycle** | (t_ON / T) × 100 | 0% – 100% | Commanded vs actual comparison |
| **Average Voltage** | V_avg = V_source × Duty% | V_source × 0% to V_source | Power delivery verification |

**Key Takeaway**: Time variables (period, frequency, duty cycle) are interconnected and essential for PWM diagnostics. The same average voltage can be achieved with different frequency/duty combinations, but the time-domain behavior affects component heating, noise, and perception. Proper oscilloscope setup and measurement technique is critical for accurate diagnostics.

**Key Parameters**:
- **Period-Frequency**: f = 1/T (inverse relationship)
- **Duty Cycle**: (t_ON / T) × 100
- **Average Voltage**: V_source × Duty%
- **Critical Frequency**: > 20 kHz for invisible switching
- **Diagnostic Frequency Range**: 10 Hz – 1 kHz (most common measurements)