---
title: "Lesson 6: Low-Side Switching Controls Flow"
description: "How low-side PWM switching controls fluid and air flow in vehicles"
difficulty: "intermediate"
time: "PT45M"
---

# Lesson 6: Low-Side Switching Controls Flow

Low-side PWM switching is the most common method for controlling fluid and air flow in modern vehicles. This lesson explores how duty cycle and frequency translate to actuator movement.

## Actuator Types Controlled by Low-Side PWM

### 1. Cabin Blower Fan

The most widespread application of low-side PWM in vehicles.

- **Frequency range**: 100 Hz – 500 Hz
- **Typical duty cycle**: 0-100% (0% = off, 100% = max speed)
- **Control principle**: Varying average voltage changes fan torque
- **Typical application**: HVAC system blower motor

**PWM Effect on Fan Speed**:

| Duty Cycle | Perceived Speed | Notes |
|------------|-----------------|-------|
| 0% | Off | No current to motor |
| 25% | Low | Reduced average voltage |
| 50% | Medium | Half voltage average |
| 75% | High | Three-quarter voltage |
| 100% | Maximum | Full battery voltage |

### 2. Radiator Cooling Fan

High-current fan control for engine cooling.

- **Frequency range**: 100 Hz – 300 Hz
- **Typical duty cycle**: Variable based on engine temperature
- **Control principle**: PWM drives high-current MOSFET in fan driver module
- **Typical application**: Engine cooling system

**Temperature-Based Duty Cycle**:

| Engine Temp | Duty Cycle | Fan Behavior |
|-------------|------------|--------------|
| < 80°C | 0-10% | Fan off or very low |
| 80-90°C | 10-40% | Intermittent operation |
| 90-100°C | 40-70% | Continuous moderate speed |
| > 100°C | 70-100% | Maximum cooling |

### 3. Electronic Fuel Pump

Precision fuel delivery control.

- **Frequency range**: 100 Hz – 20 kHz (wide range)
- **Typical duty cycle**: Maps to desired fuel flow rate
- **Control principle**: Duty cycle directly proportional to fuel volume
- **Typical application**: Electric fuel pump in fuel tank

**Duty Cycle vs Fuel Flow**:

| Duty Cycle | Fuel Flow Approximation |
|------------|------------------------|
| 10% | Idle/minimal flow |
| 30% | Cruising flow |
| 50% | Half flow rate |
| 70% | High flow overtaking |
| 90-100% | Maximum flow emergency |

### 4. EVAP Purge Solenoid

Fuel vapor recovery system control.

- **Frequency range**: 10 Hz – 30 Hz (low frequency)
- **Typical duty cycle**: Controls vapor flow volume
- **Control principle**: Slow switching to regulate gasoline vapor flow to engine
- **Typical application**: Evaporative emission control (EVAP) system

**Low-Frequency PWM Behavior**:

- At 2-5 Hz, the light bulb/flicker becomes visible
- Human perception of on/off intervals
- Cars use 10-30 Hz to remain invisible to perception
- Integrates vapor flow over multiple cycles

## Low-Side Switching Advantages for Flow Control

### Cost-Effective Implementation

- Single transistor (MOSFET) per actuator
- Simple drive circuitry (ECU GPIO pin sufficient)
- No additional high-voltage driver circuitry needed
- Bill of Materials (BOM) cost: $0.50-$2.00 per channel

### Easy Current Sensing

- Shunt resistor placement between transistor and ground
- Microcontroller ADC reads voltage drop for overcurrent protection
- Enables closed-loop current control

### Thermal Management

- Transistor turns "on" (near-zero resistance): Minimal heat generated
- Transistor turns "off" (zero current): Zero heat generated
- No continuous power waste like resistor-based control

### Diagnostic Accessibility

- Current sensing via shunt resistor enables real-time monitoring
- Open-load detection (no current flow when expected)
- Short-to-ground detection (current limited by load resistance)

## Comparison: Low-Side vs High-Side for Flow Applications

| Aspect | Low-Side | High-Side |
|--------|----------|-----------|
| **Cost** | $0.50-$2.00 | $2.00-$5.00 |
| **Complexity** | Simple (GPIO sufficient) | Requires high-side driver IC |
| **Safety (off state)** | Load energized to ground | Load grounded (safer) |
| **Current Sensing** | Easy (shunt to ground) | Difficult (sense high-side node) |
| **Fault Protection** | Fuse may not blow (load in series) | Fuse blows immediately |
| **Typical Use** | Fans, pumps, solenoids | High-power switches, battery |

## Summary: Flow Control Applications

| Actuator | Frequency | Typical Duty | Primary Benefit |
|----------|-----------|--------------|-----------------|
| Cabin Blower | 100-500 Hz | 0-100% | Cost-effective speed control |
| Radiator Fan | 100-300 Hz | Variable | Engine protection |
| Fuel Pump | 100 Hz-20 kHz | 10-100% | Precise flow metering |
| EVAP Purge | 10-30 Hz | Variable | Emission control |

**Key Takeaway**: Low-side PWM switching is the dominant method for flow control in vehicles due to its cost-effectiveness, ease of current sensing, and sufficient performance for fan, pump, and solenoid applications. The ECU adjusts duty cycle to meet thermal management, emission, and performance requirements.

**Key Parameters**:
- **Cabin Blower**: 100-500 Hz, 0-100% duty
- **Radiator Fan**: 100-300 Hz, temp-dependent duty
- **Fuel Pump**: 100 Hz-20 kHz, flow-proportional duty
- **EVAP Purge**: 10-30 Hz, flow-regulating duty