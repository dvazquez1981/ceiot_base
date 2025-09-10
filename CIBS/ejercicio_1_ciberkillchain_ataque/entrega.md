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
  
- Escaneo activo detallado:

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
  - Análisis de los Resultados del Escaneo:
  
     Puerto 22/tcp (SSH): OpenSSH 8.2p1 Ubuntu 4ubuntu0.13 (Ubuntu Linux). Esta versión de OpenSSH es relativamente reciente y bien mantenida, buscar vulnerabilidades específicas (CVE-2020-15778) o probar fuerza bruta si hay credenciales débiles.

     Puerto 80/tcp (HTTP): Servicio OpenResty que redirige a HTTPS. Indica que el tráfico HTTP se fuerza a HTTPS, por lo que el enfoque debe estar en el puerto 443.

     Puerto 443/tcp (HTTPS): Servicio OpenResty con un certificado SSL válido para exp-e.vialidad.gob.ar y *.vialidad.gob.ar. La aplicación web principal parece estar aquí.

     Sistema Operativo: Linux 4.15 - 5.6 (basado en la detección de OS).

     rDNS: La IP 10.8.34.189 resuelve a desa-backend-redeterminacion.vialidad.gob.ar, lo que sugiere que podría ser un entorno de desarrollo o testing, lo que podría implicar medidas de seguridad más laxas

 - Uso Gobuster para realizar escaneo de directorios y archivos en servidores web mediante fuerza bruta
   gobuster dir -u https://siper.vialidad.gob.ar -w /snap/seclists/1214/Discovery/Web-Content/common.txt -t 50 -k
   ```text
   ===============================================================
    Gobuster v3.5
    by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
    ===============================================================
    [+] Url:                     https://siper.vialidad.gob.ar
    [+] Method:                  GET
    [+] Threads:                 50
    [+] Wordlist:                /snap/seclists/1214/Discovery/Web-Content/common.txt
    [+] Negative Status codes:   404
    [+] User Agent:              gobuster/3.5
    [+] Timeout:                 10s
    ===============================================================
    2025/09/10 14:34:12 Starting gobuster in directory enumeration mode
    ===============================================================
    /.git/HEAD            (Status: 403) [Size: 349]
    /.git/config          (Status: 403) [Size: 349]
    /.git/index           (Status: 403) [Size: 349]
    /.hta                 (Status: 403) [Size: 287]
    /.gitignore           (Status: 403) [Size: 287]
    /.git                 (Status: 403) [Size: 349]
    /.git/logs/           (Status: 403) [Size: 349]
    /.htaccess            (Status: 403) [Size: 287]
    /.htpasswd            (Status: 403) [Size: 287]
    /app                  (Status: 301) [Size: 330] [--> https://siper.vialidad.gob.ar/app/]
    /cgi-bin/             (Status: 403) [Size: 287]
    /go                   (Status: 301) [Size: 329] [--> https://siper.vialidad.gob.ar/go/]
    /index.php            (Status: 200) [Size: 384]
    /javascript           (Status: 301) [Size: 337] [--> https://siper.vialidad.gob.ar/javascript/]
    /manifest             (Status: 200) [Size: 495]
    /manual               (Status: 301) [Size: 333] [--> https://siper.vialidad.gob.ar/manual/]
    /server-status        (Status: 403) [Size: 287]
    /sw                   (Status: 200) [Size: 2292]
    /tmp                  (Status: 301) [Size: 330] [--> https://siper.vialidad.gob.ar/tmp/]
    Progress: 4595 / 4750 (96.74%)
    ===============================================================
    2025/09/10 14:34:23 Finished
    ===============================================================
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


