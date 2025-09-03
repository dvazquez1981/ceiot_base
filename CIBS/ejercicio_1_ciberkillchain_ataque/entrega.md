# Ejercicio CiberKillChain - Ataque

## Alumno  
Diego Anibal Vazquez  

## Sistema víctima
- Sistema de control de asistencia https://siper.vialidad.gob.ar/go/login 

## Objetivo
- Obtener información de la base de datos de los empleados: info privada y de indole laboral
- Posibilidad de insertar mas dias de licencia ordinaria
- Agregar dias de licencia médica
- Cambiar categoría del empleado
- Si se puede incidir sobre el sistema de haberes, direccionar todos los haberes a una sola cuenta.
  

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


