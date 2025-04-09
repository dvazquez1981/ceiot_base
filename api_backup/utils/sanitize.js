import xss from 'xss';

// Función para sanitizar entradas (SQLi + XSS)
export function sanitize(input) {
    if (typeof input === 'string') {
      return xss(input).trim() // 🚀 Evita SQL Injection y XSS
            .replace(/--/g, '') // Elimina comentarios SQL
            .replace(/;/g, '') // Evita múltiples consultas
            .replace(/xp_cmdshell/gi, '') // Bloquea ejecución de comandos
            .replace(/\\/g, ''); // Evita caracteres de escape en SQL
    }
    
    if (typeof input === 'object' && input !== null) {
      for (const key in input) {
          input[key] = sanitize(input[key]); // Recursividad para objetos anidados
      }
    }

    return input;
}


export function sanitizeMiddlewareInput(req, res, next) {
  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);

  next();
}

// Middleware para sanitizar respuestas
export function sanitizeMiddlewareOutput(req, res, next) {
  const originalJson = res.json;
  const originalSend = res.send;

  // Interceptamos res.json()
  res.json = function (data) {
      arguments[0] = sanitize(data); // Sanitiza antes de enviar
      return originalJson.apply(res, arguments);
  };

  // Interceptamos res.send()
  res.send = function (data) {
      if (typeof data === 'string') {
          arguments[0] = sanitize(data);
      }
      return originalSend.apply(res, arguments);
  };

  next();
}