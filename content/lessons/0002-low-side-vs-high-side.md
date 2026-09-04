---
title: "Lesson 2: Low-Side vs High-Side Switching"
description: "Understanding transistor switch configurations in PWM motor control"
difficulty: "intermediate"
time: "PT30M"
---

# Lesson 2: Low-Side vs High-Side Switching

Understanding transistor switch configurations is fundamental to PWM motor control. The difference between low-side and high-side switching determines how current flows through the load and affects system design, fault conditions, and efficiency.

## Low-Side Switching

In low-side switching, the transistor (typically a MOSFET) is placed between the load and ground (chassis). When the transistor closes, current flows from the battery, through the load, and through the transistor to ground.

### Advantages

- **Simpler drive circuitry**: The control signal is referenced to ground, making it easier for the ECU to switch
- **Shunt resistor placement**: Easy to place a current-sensing resistor for overcurrent detection
- **Fault protection**: If the transistor fails "on," the load is shorted to ground (blows fuse, protects load)

### Disadvantages

- **Load remains energized**: Even when off, the load has voltage across it (potential shock hazard during maintenance)
- **Limited voltage headroom**: The transistor must withstand the full supply voltage plus load-induced spikes

## High-Side Switching

In high-side switching, the transistor is placed between the battery and the load. When the transistor closes, current flows from the battery, through the transistor, through the load, and to ground.

### Advantages

- **Load grounded when off**: Safety advantage - the load is at ground potential when switched off
- **Full voltage control**:
<tool_call>
<function=bash>
<parameter=command>
ls -la /home/arturoruiz/PROYECTOS/pwm-car-mechanics