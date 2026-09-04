---
title: "Lesson 8: PWM Fuel Pump Control"
description: "Precision fuel delivery via PWM-controlled electric fuel pumps"
difficulty: "intermediate"
time: "PT50M"
---

# Lesson 8: PWM Fuel Pump Control

PWM-controlled electric fuel pumps use duty cycle to precisely regulate fuel flow rate to the engine. This lesson explores the principles, applications, and diagnostics of fuel pump PWM control.

## Fuel Pump PWM Fundamentals

### How PWM Controls Fuel Flow

The electric fuel pump in modern vehicles is controlled via PWM to vary fuel delivery without varying supply voltage:

```
Fuel Flow ∝ Duty Cycle
```

- **10% duty**: Minimum flow (idle/low demand)
- **50% duty**: Half flow rate (cruising)
- **90-100% duty**: Maximum flow (wide-open throttle, acceleration)

### PWM Frequency for Fuel Pumps

- **Typical range**: 100 Hz – 20 kHz
- **Why wide range?**:
  - **Low frequency** (100-500 Hz): Simple driver circuitry, audible noise possible
  - **Medium frequency** (1-10 kHz): Good balance of noise and efficiency
  - **High frequency** (10-20 kHz): Minimal audible noise, smoother flow

**Frequency Selection Factors**:

| Factor | Low Frequency (100-500 Hz) | High Frequency (10-20 kHz) |
|--------|---------------------------|------------------------------|
| **Audible Noise** | Possible humming/pulsing | Minimal, above human hearing |
| **Component Stress** | Higher thermal cycling | More continuous heating |
| **Flow Smoothness** | Pulsating flow | Smoother, more consistent |
| **Circuit Complexity** | Simple MOSFET driver | Requires higher-speed driver |
| **Cost** | Lower ($0.50-$2.00) | Higher ($2.00-$5.00) |

### Duty Cycle vs Engine Demand

| Engine Condition | Required Duty Cycle | Fuel Demand Rationale |
|-----------------|---------------------|-----------------------|
| **Idle** | 10-20% | Minimal fuel needed, low RPM |
| **Cruising** | 30-50% | Steady-state power requirement |
| **Acceleration** | 70-90% | Increased power demand |
| **Wide-Open Throttle** | 90-100% | Maximum power, maximum fuel flow |
| **Deceleration** | 5-10% | Fuel cut-off or minimal idle |
| **Cold Start** | 20-40% | Enrichment for starting, warm-up |

## Fuel Pump Driver Module (FPDM)

### External Driver Circuitry

Most fuel pumps require a driver module between the ECU and the pump motor:

```
ECU GPIO → FPDM Input → H-Bridge/MOSFET → Fuel Pump Motor → Ground
```

### FPDM Functions

1. **Current Amplification**: ECU GPIO is weak (≤ 20mA); FPDM drives pump (≤ 25A typical)
2. **Voltage Translation**: ECU (5-12V) → Pump (12-48V typical)
3. **Protection**: Overcurrent shutdown, thermal protection, undervoltage lockout
4. **Diagnostics**: Current sense feedback to ECU via CAN or dedicated line

### Common FPDM Topologies

| Topology | Description | Advantages | Disadvantages |
|----------|-------------|------------|---------------|
| **Low-Side Switch** | MOSFET between pump and ground | Simple, low cost | Limited voltage headroom |
| **High-Side Switch** | MOSFET between battery and pump | Load grounded when off | More complex drive circuitry |
| **H-Bridge** | Four switches for bidirectional control | Regenerative braking possible | Most complex, highest cost |
| **PWM Dimmable** | Linear current regulation | Smooth speed variation | Less efficient than switching |

## Diagnostic Procedures

### Using a Multimeter

#### Frequency Measurement

1. Set DMM to Hz mode
2. Back-pin the PWM signal line with red probe
3. Connect black probe to known good ground
4. Read frequency display

**Expected Values**:
- Most fuel pumps: 100 Hz – 5 kHz
- Some high-precision: up to 20 kHz
- Unusual values: potential ECU or FPDM fault

#### Average Voltage Measurement

1. Set DMM to VDC mode
2. Measure at FPDM input (ECU side) or output (pump side)
3. Read average voltage

**Calculation**:
```
Duty Cycle = (V_avg / V_source) × 100
```

**Example**: 12V source, DMM reads 7.2V average → Duty Cycle = (7.2/12) × 100 = 60%

#### Resistance Measurement (KoEO - Key On Engine Off)

1. Set DMM to Ω mode
2. Disconnect fuel pump connector (if safely accessible)
3. Measure resistance across pump terminals
4. Compare to specification (typically 2-5Ω for most automotive pumps)

**Note**: Cannot measure resistance with KOEO if pump is internally grounded through ECU.

### Using an Oscilloscope

#### Waveform Analysis

1. Connect probe to PWM signal line (ECU side or FPDM input)
2. Set timebase: 1 ms/div to 10 ms/div (depending on frequency)
3. Set trigger: Rising edge, auto/repeat
4. Set voltage scale: 2V/div or 5V/div (depending on signal amplitude)

#### Expected Waveform Characteristics

| Characteristic | Healthy Pump | Faulty Pump |
|--------------|--------------|-------------|
| **Waveform Shape** | Clean square waves | Rounded edges, spikes |
| **Frequency** | Stable, within spec | Drifting, erratic |
| **Duty Cycle** | Matches command | Stuck, limited range |
| **Amplitude** | Full V_source (12V or 5V) | Reduced, clipped |
| **Noise Level** | Low background noise | High noise, interference |
| **DC Offset** | Near 0V (symmetrical) | Significant offset |

#### Current Monitoring (with Clamp Meter)

1. Clamp current probe around fuel pump power line
2. Observe current during PWM switching
3. Compare current vs duty cycle expectation

**Healthy Pattern**: Current increases smoothly with duty cycle
**Fault Pattern**: Current saturates, doesn't increase with duty, or has abnormal spikes

## Common Fault Conditions

### 1. Open-Load Fault

- **Symptom**: No fuel pressure, pump doesn't run
- **DMM Reading**: 0V at pump, 0 Hz or no frequency
- **Oscilloscope**: No waveform visible
- **Cause**: Broken pump winding, disconnected wire, blown fuse

### 2. Short-to-Ground Fault

- **Symptom**: Fuse blows immediately, pump runs continuously (low-side) or not at all (high-side)
- **DMM Reading**: Low resistance at pump, excessive current
- **Oscilloscope**: Continuous DC, no PWM switching
- **Cause**: Pump insulation failure, chafed wire, connector damage

### 3. Duty Cycle Stuck

- **Symptom**: Fuel pressure doesn't vary with engine demand
- **DMM Reading**: Fixed voltage/percentage, doesn't change
- **Oscilloscope**: Fixed duty cycle, no variation with engine state
- **Cause**: ECU software fault, FPDM hardware failure, broken sensor feedback loop

### 4. Frequency Out of Range

- **Symptom**: Unusual noise, pump overheating, inconsistent flow
- **DMM Reading**: Frequency outside expected range (100 Hz – 20 kHz)
- **Oscilloscope**: Unusual waveform, unexpected frequency
- **Cause**: ECU parameter change, FPDM firmware issue, EMI interference

### 5. Intermittent Connection

- **Symptom**: Fuel pressure fluctuates, pump turns on/off unpredictably
- **DMM Reading**: Intermittent frequency/duty cycle readings
- **Oscilloscope**: Signal drops out, reconnects unpredictably
- **Cause**: Corroded connector, chafed wire, loose ground

## Diagnostic Workflow

### Step 1: Preliminary Checks

1. **Verify fuel pump fuse**: Check integrity, correct rating
2. **Check pump power supply**: 12V at pump connector (KOEO)
3. **Check ground connection**: Good ground at pump mount location
4. **Listen for pump sound**: Humming indicates attempt to run

### Step 2: Electrical Signal Measurement

1. **Measure frequency**: At ECU PWM output and FPDM input
2. **Measure duty cycle**: At same points, compare to expected
3. **Measure voltage**: At pump terminals (should be ~12V KOEO)
4. **Compare**: ECU side vs FPDM input (should be identical)

### Step 3: Component Testing

1. **Swap known-good FPDM**: Eliminate driver module as variable
2. **Swap known-good pump**: Eliminate pump as variable
3. **Monitor current**: During operation, watch for overcurrent
4. **Thermal check**: Feel for abnormal heating during operation

### Step 4: ECU Diagnosis

1. **Check for DTCs**: Use scan tool for fuel pump related codes
2. **Monitor live data**: Watch PID values for fuel demand vs actual
3. **Command test**: Use scan tool to command pump on/off at various duties
4. **Verify communication**: CAN bus messages intact (if applicable)

## Summary: Fuel Pump PWM Parameters

| Parameter | Typical Range | Diagnostic Significance |
|-----------|--------------|------------------------|
| **Frequency** | 100 Hz – 20 kHz | Component identification, driver capability |
| **Duty Cycle** | 0% – 100% | Fuel flow command, engine demand mapping |
| **Idle Duty** | 10-20% | Minimum flow at low RPM |
| **WOT Duty** | 90-100% | Maximum power, acceleration |
| **Frequency Affects** | Audible noise, flow smoothness | Driver selection, NVH considerations |
| **Duty Affects** | Fuel volume, air-fuel ratio | Performance, emissions, driveability |

**Key Takeaway**: PWM fuel pump control enables precise fuel delivery regulation without varying supply voltage. The ECU maps engine operating conditions to duty cycle commands, typically 10-100% range, with frequencies 100 Hz – 20 kHz depending on noise and efficiency requirements. Proper diagnostics involve measuring frequency, duty cycle, and voltage at multiple points in the control chain (ECU → FPDM → pump).

**Key Parameters**:
- **Frequency Range**: 100 Hz – 20 kHz (application-dependent)
- **Idle Duty Cycle**: 10-20% (minimum flow)
- **WOT Duty Cycle**: 90-100% (maximum flow)
- **Typical FPDM Current**: 20-25A (switching capability)
- **Diagnostic Points**: ECU output, FPDM input, pump terminals