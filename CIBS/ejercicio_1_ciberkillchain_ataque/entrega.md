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

### T1595 – Active Scanning
- Objetivo: identificar el rango de direcciones IP, dominios o subdominios de la organización.

    nmap -sS -p- siper.vialidad.gob.ar

- Resultado scaneo:
  

    ```text
        nmap -sS -p- siper.vialidad.gob.ar

        Starting Nmap 7.93 ( https://nmap.org ) at 2025-09-10 10:35 -03
        Nmap scan report for siper.vialidad.gob.ar (10.8.34.189)
        Host is up (0.031s latency).
        Not shown: 65532 closed tcp ports (reset)
        PORT    STATE SERVICE
        22/tcp  open  ssh
        80/tcp  open  http
        443/tcp open  https

        Nmap done: 1 IP address (1 host up) scanned in 90.90 seconds
    ```

    El resultado muestra los siguientes puertos abiertos:

    22/tcp (SSH): acceso remoto al servidor.

    80/tcp (HTTP): servicio web sin cifrar.

    443/tcp (HTTPS): servicio web principal con cifrado TLS.

    Con esta información, determino que el ataque puede orientarse al servicio web de login (80/443) mediante inyección SQL, y dejo como alternativa probar credenciales débiles en SSH.
- escaneo activo detallado:

  ```text
  nmap -sV -sC -O -p 22,80,443 siper.vialidad.gob.ar

  Starting Nmap 7.93 ( https://nmap.org ) at 2025-09-10 11:23 -03    
  Nmap scan report for siper.vialidad.gob.ar (10.8.34.189)
  Host is up (0.0060s latency).
  rDNS record for 10.8.34.189: desa-backend-redeterminacion.vialidad.gob.ar

  PORT    STATE SERVICE  VERSION
  22/tcp  open  ssh      OpenSSH 8.2p1 Ubuntu 4ubuntu0.13 (Ubuntu Linux; protocol 2.0)
  |   ssh-hostkey: 
  |   3072 56be6a235c4080e3c5c0e8750198778c (RSA)  
  |   256 a2f031bb3a2a6a347d4f3a8eab47976a (ECDSA)
  |_  256 0106c66debd94365064032e9c64c8503 (ED25519)  
  80/tcp  open  http     OpenResty web app server
  |_http-server-header: openresty
  |_http-title: Did not follow redirect to https://siper.vialidad.gob.ar/
  443/tcp open  ssl/http OpenResty web app server
  |_http-server-header: openresty
  |_http-title: Site doesn't have a title (text/html; charset=UTF-8).
  | ssl-cert: Subject: commonName=exp-e.vialidad.gob.ar/organizationName=DIRECCION NACIONAL DE VIALIDAD/stateOrProvinceName=Ciudad Aut\xC3\xB3noma de Buenos Aires/countryName=AR
  | Subject Alternative Name: DNS:exp-e.vialidad.gob.ar, DNS:*.vialidad.gob.ar, DNS:vialidad.gob.ar
  | Not valid before: 2024-10-28T00:00:00
  |_Not valid after:  2025-11-28T23:59:59
   Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
   Device type: general purpose 
   Running: Linux 4.X|5.X
   OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5
   OS details: Linux 4.15 - 5.6
   Network Distance: 3 hops
   Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

   OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
   Nmap done: 1 IP address (1 host up) scanned in 20.72 seconds
   ```
  

### T1592 – Gather Victim Identity Information

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


