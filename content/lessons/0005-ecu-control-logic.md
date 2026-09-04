---
title: "Lesson 5: ECU Control Logic"
description: "How the Engine Control Unit generates and manages PWM signals"
difficulty: "advanced"
time: "PT40M"
---

# Lesson 5: ECU Control Logic

The Engine Control Unit (ECU) is the brain that generates and manages all PWM signals in modern vehicles. This lesson explores the internal logic and algorithms that drive PWM control systems.

## ECU PWM Generation Architecture

### Microcontroller Timers/Counters

Most ECUs use built-in timer/counter peripherals to generate PWM signals. Key components:

- **Prescaler**: Divides the system clock to achieve desired PWM frequency range
- **Counter**: Counts from 0 to a period value (period register)
- **Compare Register**: Determines the duty cycle compare value
- **Output Compare**: Automatically toggles the PWM output line when counter matches compare value

### Frequency Calculation

```
f_PWM = f_system_clock / (prescaler × (period + 1))
```

**Example**: 16 MHz system clock, prescaler = 1, period = 999:
```
f_PWM = 16,000,000 / (1 × 1000) = 16,000 Hz (16 kHz)
```

### Duty Cycle Calculation

```
Duty Cycle (%) = (compare_value / period) × 100
```

**Example**: period = 1000, compare_value = 400:
```
Duty Cycle = (400 / 1000) × 100 = 40%
```

## Control Algorithms

### Duty Cycle Mapping

The ECU maps sensor inputs to duty cycle values using lookup tables:

| Sensor Input | Mapped Duty Cycle | Purpose |
|-------------|------------------|---------|
| Throttle position | 10-30% | Idle to part-throttle operation |
| Engine temperature | 5-25% | Cold start enrichment, warm-up phases |
| Air conditioning request | 20-100% | A/C compressor clutch control |
| Electric fan request | 10-100% | Radiator fan speed control |
| Idle air control | 20-80% | Maintain stable idle speed |

### Lookup Table Interpolation

ECU firmware uses linear interpolation between lookup table entries for smooth transitions:

```
duty_cycle = duty_low + (sensor_value - sensor_low) × (duty_high - duty_low) / (sensor_high - sensor_low)
```

This prevents abrupt PWM changes that could cause vehicle jerking or emissions issues.

## Protection Algorithms

### Overcurrent Protection

The ECU monitors current sense inputs and can reduce or disable PWM output if current exceeds safe limits:

1. **Current threshold**: Comparable sense voltage to reference
2. **Response time**: Typically 1-10ms depending on application
3. **Recovery mode**: Gradual duty cycle restoration after fault clearance

### Thermal Protection

- Temperature sensors on MOSFET drivers
- Reduced PWM frequency during high-load conditions
- Complete shutdown if temperature thresholds exceeded

## Communication Protocols

### CAN Bus PWM Commands

Modern vehicles transmit PWM commands over Controller Area Network (CAN) bus:

- **Standard CAN (11-bit ID)**: Basic engine functions
- **Extended CAN (29-bit ID)**: Advanced chassis and body functions
- **Frame rate**: 1-10 ms per message (100-1000 Hz update rate)
- **Data payload**: Typically 2-8 bytes containing duty cycle command

### Diagnostic Trouble Codes (DTCs)

PWM-related DTCs include:

- **P0560**: System voltage
- **P0622**: Generator field control circuit
- **P1685**: ECM-PCM power relay de-energized
- **PWM-specific**: Duty cycle out of range, frequency error, open/short circuits

## Firmware Updates

### Over-the-Air (OTA) Updates

Modern ECUs support OTA firmware updates that can:

- Change PWM frequency/duty cycle parameters
- Update control algorithms
- Fix protection threshold bugs
- Add new feature sets

**Safety considerations**: Dual-bank firmware storage, checksum verification, gradual rollout to prevent bricking vehicles.

## Summary

| Component | Function |
|-----------|----------|
| **Timer/Counter** | Generates PWM waveform base |
| **Compare Register** | Sets duty cycle value |
| **Lookup Tables** | Maps inputs to duty cycles |
| **CAN Bus** | Distributes commands between ECUs |
| **DTCs** | Flags PWM-related faults |
| **OTA Updates** | Remotely updates control logic |

**Key Takeaway**: The ECU uses timer/counter peripherals with compare registers to generate precise PWM signals, mapped from sensor inputs via lookup tables, with built-in protection algorithms and communication over CAN bus for coordinated vehicle-wide control.