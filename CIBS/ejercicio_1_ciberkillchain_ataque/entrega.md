# Ejercicio CiberKillChain - Ataque

## Alumno  
Diego Anibal Vazquez  

## Sistema víctima
- Sistema de control de asistencia https://siper.vialidad.gob.ar/go/login 

## Objetivo
- Exfiltración de información sensible de empleados (datos personales y laborales) con valor económico en el mercado clandestino y riesgo de uso para fraudes financieros - Alteración de registros de licencias ordinarias, incrementando días para tomar licencias y vender esta posibilidad.
- Inyección de licencias médicas falsas, con impacto directo en la liquidación de haberes y aumento de gastos laborales injustificados.
- Cambio de categoría del empleado, afectando la escala salarial y ocasionando un desbalance económico en la nómina.
- Manipulación del sistema de haberes, redireccionando pagos hacia una única cuenta para apropiación ilícita de fondos.

  

## Reconnaissance

- T1595 – Active Scanning
- T1592 – Gather Victim Identity Information

## Weaponization
- T1059 – Command and Scripting Interpreter
- WE-89 – SQL Injection


## Delivery
- T1190 – Exploit Public-Facing Application
- T1078 – Valid Accounts

## Exploitation
- T1190 – Exploit Public-Facing Application

## Command & Control
- T1071 – Application Layer Protocol
## Actions on Objectives
- TA0009 – Collection
- TA0010 – Exfiltration


