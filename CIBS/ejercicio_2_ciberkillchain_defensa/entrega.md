# Ejercicio CiberKillChain - Defensa

## Alumno
Ing. Diego Anibal Vazquez
## Enunciado


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

> Mitigación:
> Implementar el principio de mínimo privilegio en la base de datos, donde el usuario de aplicación solo tenga permisos SELECT/INSERT. Requerir aprobación dual mediante
> workflow separado para modificaciones salariales y cambios de datos bancarios críticos.

- Usuario de aplicación web: solo permisos SELECT e INSERT en tablas específicas
- Usuario de reporting: solo permisos SELECT
- Creación de stored procedures aprobados para modificaciones.
- Workflow de aprobación dual para cambios críticos:
    - Modificaciones salariales > 10% requieren aprobación de RRHH + Finanzas
    - Cambios de CBU requieren verificación por sistema externo (email)
    - justes masivos de licencias necesitan autorización del área de Personal.
- Implementación de tablas de auditoría independientes que registren: usuario, IP, query completa, timestamp y resultado






6. Command & Control - Defensa
Detección:

Análisis de tráfico HTTPS inusual hacia rutas no estándar (/tmp/uploads/). Detección de patrones de comunicación cifrada con timing consistente (beaconing cada 60 segundos) y tamaños de respuesta similares.

Mitigación:

Lista blanca estricta de rutas y archivos ejecutables en el servidor web. Implementar inspección SSL/TLS con DLP para detectar exfiltración de datos sensibles en respuestas HTTP.

5. Installation - Defensa
Detección:

Monitoreo de integridad de archivos mediante checksums para detectar creación/modificación en directorios como /tmp/uploads/. Alertas por creación de archivos PHP en directorios no autorizados.

Mitigación:

Configurar SELinux/AppArmor para restringir ejecución en directorios temporales. Implementar WAF con firmas específicas para detección de webshells conocidos.

4. Exploitation - Defensa
Detección:

Logs de autenticación que muestren patrones de SQL injection en el campo de usuario. Alertas por bypass de reCAPTCHA y autenticaciones exitosas inmediatamente después de intentos con payloads SQL.

Mitigación:

Implementar prepared statements con parámetros bindeados en todo el código de autenticación. Rate limiting agresivo (bloqueo por 30 minutos) después de 5 intentos fallidos de login desde misma IP.

3. Delivery - Defensa
Detección:

Análisis en tiempo real de payloads SQL en parámetros de login mediante WAF. Detección de herramientas de automatización como Hydra por patrones de intentos secuenciales rápidos.

Mitigación:

WAF con reglas específicas para SQL injection que bloqueen caracteres especiales en campos de login. Bloqueo automático de IPs después de 10 intentos fallidos de autenticación en 5 minutos.

2. Weaponization - Defensa
Detección:

Análisis de tráfico de red para detectar escaneo de puertos mediante Nmap y enumeración de directorios con Gobuster. Monitoreo de requests a rutas sensibles (.git/, /app/, /tmp/) desde mismas IPs.

Mitigación:

Configuración segura de servidor web para ocultar información de banners y versiones. Restricción de acceso a directorios sensibles via .htaccess con denegación explícita.

1. Reconnaissance - Defensa
Detección:

Logs de escaneos Nmap/Gobuster identificados por volumen de requests y patrones de User-Agent específicos. Monitoreo de acceso a archivos de configuración y directorios ocultos desde IPs externas.

Mitigación:

Rate limiting estricto por IP (max 100 requests/minuto) para prevenir escaneos automatizados. Configuración de servidor para no revelar información de versión en headers HTTP.

Medidas de Defensa Prioritarias (Recursos Limitados)
1. Crítica - SQL Injection
Detección: Reglas WAF para patrones SQL en parámetros de login como ' OR '1'='1
Mitigación: Migración inmediata a prepared statements en endpoint app-index-x.php

2. Alta - Autenticación Débil
Detección: Monitoreo de intentos fallidos de login con usuarios válidos como 'admin'
Mitigación: Implementación de MFA y bloqueo temporal de IPs tras 5 intentos fallidos

3. Media - Exposición de Información
Detección: Alertas por acceso a rutas sensibles como /.git/HEAD o /app/api/
Mitigación: Hardening de configuración web con directivas de denegación explícita

4. Baja - Comando y Control
Detección: Análisis de tráfico a rutas no estándar como /tmp/uploads/shell.php
Mitigación: Lista blanca de directorios ejecutables en configuración de servidor web

