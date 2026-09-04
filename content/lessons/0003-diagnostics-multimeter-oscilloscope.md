---
title: "Lesson 3: Diagnostics with Multimeter & Oscilloscope"
description: "Measuring PWM signals with diagnostic tools"
difficulty: "intermediate"
time: "PT60M"
---

# Lesson 3: Diagnostics with Multimeter & Oscilloscope

Accurate diagnostics require the right tools for the job. This lesson covers measuring PWM signals with both basic and advanced diagnostic equipment.

## Digital Multimeter (DMM) Measurements

The multimeter is the most accessible tool for quick PWM diagnostics.

### DC Voltage Mode

Measures the average voltage ($V_{avg}$). Excellent for sanity checks.

- If a 12V supply reads 6V on a fan, the duty cycle is likely ~50%
- Set multimeter to VDC mode
- Connect red probe to signal line, black probe to ground

### Duty Cycle (%) Mode

Select DMM to Hz/% mode for direct duty cycle reading.

- Connect black probe to known good ground
- Back-pin the signal line with the red probe
- Select % mode to read commanded value

### Frequency (Hz) Mode

Verifies signal stability.

- A reading of 0 Hz or erratic shifting suggests a lost control wire or bad driver
- Set to Hz mode, connect probes same as DC voltage mode

## Oscilloscope (PicoScope/etc.) Measurements

The oscilloscope provides detailed waveform visualization for in-depth analysis.

### Channel Setup

- Set to **DC coupling** for 12V systems
- Vertical voltage scale: ±20V or 0–20V for automotive systems
- For 5V sensors, set to 0–10V scale

### Timebase Setup

- For a 100 Hz signal, one cycle is 10ms
- Use 5ms/div or 10ms/div timebase to view 5–10 complete pulses

### Trigger Setup

- Select **standard "Auto"** or **"Repeat"** trigger
- Set trigger threshold to roughly half the signal's peak height (e.g., 6V for 12V signal)
- Use **"Rising Edge"** trigger type

## Comparison: DMM vs Oscilloscope

| Aspect | Digital Multimeter | Oscilloscope |
|--------|-------------------|--------------|
| **Measurement Type** | Average voltage, frequency, duty cycle | Full waveform visualization |
| **Speed** | Quick sanity checks (seconds) | Detailed analysis (minutes) |
| **Detail** | Single numerical value | Waveform shape, noise, glitches |
| **Cost** | $20–$200 | $100–$2,000+ |
| **Best Use Case** | Initial diagnostics, verification | Root cause analysis, complex faults |