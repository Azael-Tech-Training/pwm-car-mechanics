---
title: "Lesson 4: How Shorts Blow Fuses"
description: "PWM short-circuit physics and fuse operation in automotive circuits"
difficulty: "intermediate"
time: "PT35M"
---

# Lesson 4: How Shorts Blow Fuses

Understanding the physics of short circuits and fuse operation is critical for automotive diagnostics and electronic design. This lesson explains why fuses blow and how PWM affects fault conditions.

## Short Circuit Fundamentals

A short circuit occurs when current flows along an unintended path with very low resistance, bypassing the intended load.

### Ohm's Law in Faults

```
I = V / R
```

- **Normal circuit**: Typical load resistance (e.g., 2Ω for a fan) limits current to safe levels
- **Short circuit**: Resistance drops to near-zero (~0.05Ω), causing current to surge instantly

### Joule Heating

```
P = I² × R_fuse
```

Heating rate spikes exponentially with current. The power dissipated as heat in the fuse wire determines whether it melts:

- **Normal 6A load**: Generates only 0.7W of heat in a fuse - sufficient for normal operation
- **240A short-circuit current**: Generates over 1,150W - melting the fuse link in milliseconds

## Low-Side Control Short

A short-to-ground **after** the load (after the MOSFET).

- The load remains in series with the short
- Current is limited by the load's resistance
- **The fuse does NOT blow** because current is limited
- The load runs continuously, potentially overheating

## High-Side Control Short

A short-to-ground **before** the load (before the MOSFET).

- When the switch closes, current flows directly from battery to chassis ground
- The load is bypassed entirely
- **The fuse blows immediately** to prevent fire or damage
- This is the preferred configuration for safety-critical systems

## PWM-Specific Considerations

### Duty Cycle Effects on Fuse Blow Time

- **High duty cycle** (80-100%): Fuse experiences near-constant current, blows faster
- **Low duty cycle** (10-20%): Current flows in pulses, fuse may survive multiple cycles before blowing
- **50% duty cycle**: Moderate heating, blow time depends on pulse repetition rate

### Frequency Effects

- **Low frequency** (10-100 Hz): Long "off" periods allow fuse/load to cool between pulses
- **High frequency** (1 kHz-20 kHz): Continuous effective current, fuse sees nearly DC heating

## Diagnostic Applications

### Using a Multimeter

1. Measure resistance at the load - short will read near 0Ω
2. Measure current draw - short will show excessive current
3. Observe fuse behavior - continuous current without blowing indicates load-side short

### Using an Oscilloscope

1. Monitor current waveform during PWM switching
2. Observe peak current and duty cycle effects on heating
3. Compare healthy vs faulted waveforms for pattern differences

## Summary

| Configuration | Short Location | Fuse Response | Safety Impact |
|--------------|---------------|---------------|---------------|
| Low-Side | After load | Does NOT blow | Load overheating risk |
| High-Side | Before load | Blows immediately | Maximum protection |

**Key Takeaway**: High-side switching provides better short-circuit protection because the fuse blows immediately when a short occurs, preventing potential fire hazards.