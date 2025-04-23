import xss from 'xss';

// Función para sanitizar entradas (SQLi + XSS)
export function sanitize(input) {
  if (typeof input === 'string') {
    return xss(input).trim()
      .replace(/--/g, '')              // Elimina comentarios SQL
      .replace(/;/g, '')               // Evita múltiples consultas
      .replace(/xp_cmdshell/gi, '')    // Bloquea ejecución de comandos
      .replace(/\\/g, '')              // Evita caracteres de escape
      .replace(/'/g, '')
      .replace(/"/g, '');

  }

  if (Array.isArray(input)) {
    return input.map(sanitize);
  }

  if (typeof input === 'object' && input !== null) {
    for (const key in input) {
      input[key] = sanitize(input[key]); // Recursividad
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


