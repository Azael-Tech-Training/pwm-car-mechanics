---
title: "Reference: PWM Basics & Diagnostics Cheat Sheet"
description: "Quick-reference guide for equations, common component frequencies, and diagnostic measurements on modern automotive PWM circuits"
difficulty: "reference"
time: "PT15M"
---

# Reference: PWM Basics & Diagnostics Cheat Sheet

Quick-reference guide for equations, common component frequencies, and diagnostic measurements on modern automotive PWM circuits.

## Core Equations

| Equation | Description | Variables |
|----------|-------------|-----------|
| **Duty Cycle** | D = (T_on / T) × 100 | D = duty cycle %<br>T_on = ON time<br>T = total period |
| **Frequency** | f = 1 / T | f = frequency (Hz)<br>T = period (s) |
| **Average Voltage** | V_avg = V_src × D | V_avg = average voltage<br>V_src = source voltage<br>D = duty cycle (decimal) |
| **Period from Frequency** | T = 1 / f | T = period (s)<br>f = frequency (Hz) |

## Common Automotive PWM Frequencies

| Component | Typical Frequency | Switching Strategy |
|-----------|------------------|---------------------|
| **Cabin Blower Fan** | 100 Hz – 500 Hz | Low-Side PWM (duty cycle varies speed) |
| **Radiator Cooling Fan** | 100 Hz – 300 Hz | Low-Side or High-Side PWM (high current driver) |
| **Electronic Fuel Pump** | 100 Hz – 20 kHz | Fuel pump driver module (FPDM) regulated speed |
| **EVAP Purge Solenoid** | 10 Hz – 30 Hz | Slow switching to regulate gasoline vapor flow |
| **Electronic Throttle Body** | 1 kHz – 5 kHz | Dual-direction H-bridge for precise motor positioning |
| **Fuel Injectors** | Dynamic (with Engine RPM) | Pulse width dictates fuel volume directly |

## Diagnostic Measurement Checklist

### Using a Digital Multimeter (DMM)

| Measurement | Mode | Procedure | Interpretation |
|------------|------|-----------|----------------|
| **DC Voltage** | VDC | Measure $V_{avg}$ at signal line to ground | $V_{avg}$ = 6V on 12V system ≈ 50% duty cycle |
| **Duty Cycle (%)** | Hz/%** | Connect black probe to ground, back-pin signal with red probe, select % mode | Direct duty cycle reading |
| **Frequency** | Hz | Same probe connection, select Hz mode | Verifies signal stability; 0 Hz or erratic = lost control wire or bad driver |

### Using an Oscilloscope (PicoScope/etc.)

| Measurement | Setup | Interpretation |
|------------|-------|----------------|
| **Channel Setup** | DC coupling, vertical scale ±20V (12V systems) or 0–10V (5V sensors) | Proper scale prevents clipping or inadequate resolution |
| **Timebase Setup** | For 100 Hz signal: 10 ms/div (one cycle = 10 ms) | View 5–10 complete pulses for analysis |
| **Trigger** | "Auto" or "Repeat" trigger, threshold at ~half signal peak (e.g., 6V for 12V) | Stable display for accurate measurements |
| **Duty Cycle Measurement** | Measure $t_{ON}$ and $t_{OFF}$ using cursors | $Duty Cycle = (t_{ON} / (t_{ON} + t_{OFF})) × 100$ |
| **Frequency Measurement** | Measure period $T$ using cursors, then $f = 1/T$ | Verify frequency stability, compare to expected values |

## Table: Diagnostic Scenarios

| Scenario | Multimeter Reading | Oscilloscope Waveform | Likely Cause |
|----------|-------------------|----------------------|--------------|
| **Normal Operation** | Frequency present, duty cycle matches command | Clean square wave, stable frequency | System operating as designed |
| **Open Load** | 0 Hz, 0V average | No waveform visible | Broken circuit, disconnected wire, blown fuse |
| **Short-to-Ground (Low-Side)** | Low resistance, high current | Continuous DC, no switching | Pump/motor shorted to ground after switch |
| **Short-to-Ground (High-Side)** | Fuse blows immediately | No waveform (switch opens before load) | Switch/before-load short, immediate fuse blow |
| **Duty Cycle Stuck** | Fixed voltage, no variation with command | Fixed duty cycle, no response to changes | ECU software fault, stuck switch, broken feedback |
| **Frequency Drifting** | Erratic Hz reading, fluctuating | Period varies cycle-to-cycle | Lost control wire, ECU fault, EMI interference |
| **Excessive Noise** | Noisy voltage reading | Square wave with spikes/ringing | EMI, inadequate grounding, failing driver |

## Summary Tables

### PWM Signal Parameters by Component

| Component | Frequency | Typical Duty | Key Metric |
|-----------|-----------|--------------|------------|
| Cabin Blower | 100-500 Hz | 0-100% | Fan speed |
| Radiator Fan | 100-300 Hz | Variable (temp-dependent) | Cooling capacity |
| Fuel Pump | 100 Hz-20 kHz | 10-100% | Fuel flow rate |
| EVAP Purge | 10-30 Hz | Variable (engine demand) | Emission control |
| Throttle Body | 1-5 kHz | Variable (position) | Air intake control |
| Fuel Injectors | Dynamic (RPM-dependent) | Very short pulses (1-3 ms) | Fuel metering |

### Measurement Tool Comparison

| Aspect | Digital Multimeter | Oscilloscope |
|--------|-------------------|--------------|
| **Measurement Cost** | $20–$200 | $100–$2,000+ |
| **Setup Time** | 30 seconds | 2-3 minutes |
| **Resolution** | Limited (0.1 Hz, ~1% duty) | High (preset cursors, fine measurement) |
| **Detail Shown** | Single numerical value | Full waveform including noise, glitches, timing |
| **Best For** | Quick sanity checks, verification | Root cause analysis, complex faults |
| **Typical Automotive Use** | Initial diagnostics, verification | Detailed fault diagnosis |

## Quick Reference Formulas

```
Duty Cycle (%) = (t_ON / T) × 100
Frequency (Hz) = 1 / Period (s)
Average Voltage (V) = Source Voltage × (Duty Cycle / 100)
Period (s) = 1 / Frequency (Hz)
t_ON = (Duty Cycle / 100) × Period
t_OFF = Period - t_ON
```

## Equipment Selection Guide

| Budget | Recommended Multimeter | Recommended Oscilloscope |
|--------|----------------------|-------------------------|
| **Under $50** | Basic VDC, Hz measurement | Basic 2-channel, 10MHz+ |
| **$50-$150** | True RMS, duty cycle % | Mid-range 2-4 channel, 20-50MHz |
| **$150-$500** | Auto-ranging, min/max storage | Advanced 4-channel, 50-100MHz, persistence |
| **$500+** | Professional RMS, temperature, capacitance | Professional 4-8 channel, 100MHz+, advanced triggering |

## Key Takeaways

1. **Duty cycle controls power**: Percentage of ON time determines average voltage/power delivered
2. **Frequency affects behavior**: Low frequency = visible switching, high frequency = smoothed operation
3. **Same voltage, different frequencies**: 50% duty at 100 Hz and 10 kHz both deliver 50% average voltage, but behavior differs
4. **Oscilloscope is essential**: For detailed diagnostics, waveform analysis, and fault identification
5. **DMM is sufficient**: For quick verification, frequency measurement, and average voltage checks
6. **Always check both sides**: Measure at ECU output AND component input to identify where fault occurs

**Reference Document**: Keep this sheet open in a browser tab during your garage diagnostic sessions or custom electronic designs.