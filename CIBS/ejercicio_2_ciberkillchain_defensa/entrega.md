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

>Análisis en tiempo real de payloads SQL en parámetros de login mediante WAF. Detección de herramientas de automatización como Hydra por patrones de intentos secuenciales rápidos.**

- Configuración para SQL Injection en Parámetros:

Reglas de Detección:
    - Palabras clave SQL:
        ```text
          SecRule ARGS:username "@pm SELECT UNION DROP INSERT UPDATE DELETE" \
          "phase:2,deny,id:1001,status:403,msg:'SQLi detected in username'"
    
          SecRule ARGS:password "@pm SELECT UNION DROP INSERT UPDATE DELETE" \
          "phase:2,deny,id:1002,status:403,msg:'SQLi detected in password'"
        ```       
    - Detección de Caracteres Especiales:
        ```text
          SecRule ARGS:username "@rx [';\\-\\-]" \
          "phase:2,deny,id:1003,status:403,msg:'SQLi special characters in username'"

          SecRule ARGS:password "@rx [';\\-\\-]" \
          "phase:2,deny,id:1004,status:403,msg:'SQLi special characters in password'"
        ```
     - Patrones de Comentarios SQL (--, #, / */):
        ```text
          SecRule ARGS "@rx (--|#|\\/\\*|\\*\\/)" \
          "phase:2,deny,id:1005,status:403,msg:'SQL comment pattern detected'"
        ```
        


> Mitigación:
> WAF con reglas específicas para SQL injection que bloqueen caracteres especiales en campos de login. Bloqueo automático de IPs después de 10 intentos fallidos de autenticación en 5 minutos.

### 2. Weaponization - Defensa
> Detección:

> Análisis de tráfico de red para detectar escaneo de puertos mediante Nmap y enumeración de directorios con Gobuster. Monitoreo de requests a rutas sensibles (.git/, /app/, /tmp/) desde mismas IPs.

> Mitigación:

>Configuración segura de servidor web para ocultar información de banners y versiones. Restricción de acceso a directorios sensibles via .htaccess con denegación explícita.

### 1. Reconnaissance - Defensa
> Detección:
>  Monitoreo de intentos de recolección de información sobre la infraestructura mediante:
> Detección de crawling automatizado en el sitio web corporativo
> Alertas por escaneos de servicios expuestos (HTTP, SSH, FTP)
> Monitoreo de consultas WHOIS desde múltiples direcciones IP
> Análisis de user-agents de herramientas de OSINT en logs web


> Mitigación:
> Red Team Interno: Contratar equipos éticos para realizar reconnaissance EXTERNO realista y descubrir qué información está expuesta
> Penetration Testing Autorizado: Realizar escaneos de puertos y enumeración de servicios DESDE INTERNET para identificar puntos ciegos
> OSINT Activo: Realizar tu propia investigación pública para encontrar información corporativa expuesta
> Bug Bounty Programs: Pagar por vulnerabilidades descubiertas éticamente por terceros
> Configuración de rate limiting en servidores DNS y web
> Ocultación de información sensible en registros WHOIS
> Hardening de banners HTTP para ocultar versiones de software



