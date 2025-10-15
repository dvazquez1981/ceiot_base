# Ejercicio CiberKillChain - Defensa

## Alumno
Ing. Diego Anibal Vazquez

## Resolución

### 7. Actions on Objectives - Defensa
> Detección:
> Monitoreo de consultas SQL inusuales en la base de datos que realicen UPDATE masivos, cambios en CBU o modificaciones de salarios. Alertas por transacciones bancarias
> que modifican múltiples CBU simultáneamente desde la misma sesión.

Se configuran alertas para:
- Consultas UPDATE que afecten más de 10 registros simultáneamente
- Modificaciones en campos críticos: CBU, salario, categoría_laboral, dias_licencia
- Transacciones que combinen múltiples tablas (empleados + datos_bancarios + licencias)
- Cambios realizados fuera del horario laboral estándar (8:00-18:00 hs)
- Sesiones de base de datos que ejecuten consultas con sintaxis inusual o procedimientos almacenados no autorizados
- UEBA (User and Entity Behavior Analytics) para establecer una línea base de lo que es "normal" para cada usuario de la BD. Un contador que normalmente actualiza 5 registros/día un usuario y de repente actualiza 500 es una alerta más precisa

> Mitigación:
> Implementar el principio de mínimo privilegio en la base de datos, donde el usuario de aplicación solo tenga permisos SELECT/INSERT. Requerir aprobación dual mediante
> workflow separado para modificaciones salariales y cambios de datos bancarios críticos.

- Usuario de aplicación web: solo permisos SELECT e INSERT en tablas específicas
- Usuario de reporting: solo permisos SELECT
- Segregación de Entornos: El usuario de la aplicación web no debería tener acceso directo a las tablas de producción. Un patrón seguro es utilizar una capa de API o servicios web que abstraigan las operaciones de base de datos.
- Creación de stored procedures aprobados para modificaciones.
- Workflow de aprobación dual para cambios críticos:
    - Modificaciones salariales > 10% requieren aprobación de RRHH + Finanzas
    - Cambios de CBU requieren verificación por sistema externo (email)
    - justes masivos de licencias necesitan autorización del área de Personal.
- Implementación de tablas de auditoría independientes que registren: usuario, IP, query completa, timestamp y resultado
- Las tablas de auditoría deben escribirse en una base de datos separada y configurarse como inmutables para que un atacante no pueda borrar sus huellas

### 6. Command & Control - Defensa

> Detección:
> En esta fase, los atacantes establecen un canal de comunicación encubierto con el sistema comprometido para mantener el acceso, robar datos y ejecutar comandos de forma remota . La defensa se centra en detectar estas comunicaciones anómalas y bloquear los mecanismos utilizados.
 - Análisis de Rutas y Comportamientos Web Anómalos
   - Monitoreo de requests HTTP a directorios no-web como /tmp/uploads/, /var/tmp/
   - Detección de archivos PHP ejecutándose fuera de directorios de aplicación legítimos
 - Detección de Ejecución de Comandos Remotos
   - Monitoreo de funciones system(), exec(), shell_exec() desde contexto web
   - Análisis de procesos que ejecuten comandos del sistema iniciados desde servidor web
   - Detección de web shells
 - Análisis de Cifrado Personalizado
   - Identificación de patrones de comunicación con cifrado AES detectable en tráfico HTTP

> Mitigación:
 - Listas Blancas Estrictas de Aplicaciones
    - Control de ejecución en servidores web mediante listas blancas de directorios permitidos
    - Restricción de funciones PHP peligrosas: system(), exec(), shell_exec(), passthru()
    - Configuración de permisos que impidan escritura y ejecución en /tmp/, /uploads/

 - Hardening de Servicios Web
    - Configuración de servidores web para bloquear ejecución en directorios temporales
    - Implementación de WAF con reglas específicas para detección de web shells
 
 - Segmentación de Red: Aísle los servidores web en una DMZ (Zona Desmilitarizada) con reglas de firewall estrictas que limiten la comunicación con la red interna, especialmente con la base de datos.

### 5. Installation - Defensa
> Detección:
> Monitoreo de integridad de archivos mediante checksums para detectar creación/modificación en directorios como /tmp/uploads/. Alertas por creación de archivos PHP en directorios no autorizados.

> Mitigación:
 - Monitoreo de Integridad
     - Sistemas de detección de cambios en archivos del servidor web
     - Alertas por creación de nuevos archivos PHP en ubicaciones no autorizadas
     - Auditoría continua de permisos y configuraciones de seguridad
 - Directorios de Subida Seguros: Si se permiten uploads, almacénelos en un directorio fuera del root del servidor web.
   
### 4. Exploitation - Defensa
> Detección:
> Logs de autenticación que muestren patrones de SQL injection en el campo de usuario. Alertas por bypass de reCAPTCHA y autenticaciones exitosas inmediatamente después de intentos con payloads SQL.

> Mitigación:
- Implementar prepared statements con parámetros bindeados en todo el código de autenticación. Rate limiting agresivo (bloqueo por 30 minutos) después de 5 intentos fallidos de login desde misma IP.

- Control de Versiones y Parches: explotación aprovecha vulnerabilidades conocidas. Gestión de parches para el sistema operativo, el servidor web (Apache) y el lenguaje (PHP)  para cerrar ventanas de explotación.

### 3. Delivery - Defensa

> Detección

> Análisis en tiempo real de payloads SQL en parámetros de login mediante WAF. Detección de herramientas de automatización como Hydra por patrones de intentos secuenciales rápidos.

- Configuración para SQL Injection en Parámetros:

    Reglas de Detección:
    - Palabras clave SQL en login:
         - SELECT UNION DROP INSERT UPDATE DELETE
    - Detección de Caracteres Especiales en login :
         - ;\\-\\
    - Patrones de comentarios SQL:
        - --, #, / */
    - Detección de Herramientas Automatizadas:
     ```text
      SecRule REQUEST_HEADERS:User-Agent "@pm sqlmap hydra" \
     "phase:1,deny,id:1006,status:403,msg:'Automated tool detected'"
            
     SecRule ARGS "@rx (benchmark|sleep|pg_sleep|waitfor delay)" \
      "phase:2,deny,id:1007,status:403,msg:'Time-based SQLi detected'"
      
     ```
    - Reglas de umbral (Rate Limiting):
     ```text
     SecRule IP:FAILED_LOGIN_COUNT "@gt 10" \
     "phase:2,deny,id:1008,status:403,msg:'Too many failed logins'"
     ```
       
> Mitigación:
> WAF con reglas específicas para SQL injection que bloqueen caracteres especiales en campos de login. Bloqueo automático de IPs después de 10 intentos fallidos de autenticación en 5 minutos.
  ```text
  # Bloqueo de caracteres SQL en login
  SecRule ARGS:username "!@rx ^[a-zA-Z0-9_@.-]+$" \
  "phase:2,deny,id:2001,status:403,msg:'Invalid characters in username'"
            
  SecRule ARGS:password "!@rx ^[\\x20-\\x7E]+$" \
  "phase:2,deny,id:2002,status:403,msg:'Invalid characters in password'"
            

 # Rate limiting y bloqueo automático
   SecRule REQUEST_FILENAME "@streq /login" \
             "phase:2,pass,id:2003,nolog,setvar:ip.failed_login_count=+1,expirevar:ip.failed_login_count=300"
           
 SecRule IP:FAILED_LOGIN_COUNT "@gt 10" \
                "phase:2,deny,id:2004,status:403,msg:'IP blocked for excessive failed logins',setvar:ip.blocked=1,expirevar:ip.blocked=1800"
             
  ```
### 2. Weaponization - Defensa
> Detección:

> Análisis de tráfico de red para detectar escaneo de puertos mediante Nmap y enumeración de directorios con Gobuster. Monitoreo de requests a rutas sensibles (.git/, /app/, /tmp/) desde mismas IPs.
-  Detección de Escaneo de Puertos: uitlizando herramientas como Suricata. detecta patrones de escaneo de puertos con herramientas como Nmap
 ```text
   alert tcp any any -> any any (msg:"Nmap TCP Scan"; \
   flow:established; detection_filter:track by_src, count 50, seconds 60;)
  ```
- Detección de Enumeración de Directorios
  ModSecurity con OWASP CR, detecta intentos de enumeración con Gobuster/Dirb en patrones de fuerza bruta en URLs y acceso a rutas sensibles (.git/, /app/, /tmp/)


> Mitigación:

> Configuración segura de servidor web para ocultar información de banners y versiones. Restricción de acceso a directorios sensibles via .htaccess con denegación explícita.


- Restricción de Acceso a Directorios Sensibles
  en .htaccess (Apache):
  ```text
  # Bloquear acceso a directorios sensibles
  <FilesMatch "^\.git">
         Order allow,deny
            Deny from all
   </FilesMatch>
        
   <Directory "/app">
            Require all denied
   </Directory>
  ```
### 1. Reconnaissance - Defensa
> Detección:
> Detección de crawling automatizado: Análisis de patrones de requests y user-agents
 - Frecuencia y Volumen Anormal: múltiples requests por segundo desde una misma IP
 - Patrones Secuenciales de URLs: crawling automatizado, acceso secuencial a páginas en corto tiempo.
 - Cadena de texto que identifica el navegador, sistema operativo y herramienta utilizada para hacer la request
     - legitimos:
        ```text
         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
         "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15"
       ```
     - sospechosos:
        ```text
            "theHarvester/3.2.0" → Herramienta de recolección de emails
            "Maltego/4.3.0" → Software de inteligencia
            "Shodan/1.0" → Scanner de servicios expuestos
            "python-requests/2.25.1" → Script automatizado
            "Go-http-client/1.1" → Cliente HTTP genérico
        ```  
     - bots:
       ```text
       "masscan/1.3" → Escáner de puertos
       "nmap/7.80" → Herramienta de escaneo        
       "Gobuster/3.1.0" → Enumerador de directorios
       ```

 - Correlación de eventos: agregación de logs de múltiples fuentes para detectar reconnaissance

> Mitigación:
> 
> Con herramientas: 
- Rate limiting: Bloqueo de escaneos automatizados
- Ocultación de información: Modificación de banners HTTP
- Protección contra crawling: Reglas avanzadas contra bots

> Programas Complementarios:
- con recursos monetarios:
   - Red Team Interno, contratar equipos éticos para realizar reconnaissance EXTERNO realista y descubrir qué información está expuesta antes que los atacantes
   - Bug Bounty Programs: pagar por vulnerabilidades descubiertas éticamente por terceros, incentivando la reportación responsable
- Penetration Testing Autorizado: Realizar escaneos de puertos y enumeración de servicios DESDE INTERNET para identificar puntos ciegos en la infraestructura  

- OSINT Activo: realizar tu propia investigación pública periódica para encontrar información corporativa expuesta en internet







