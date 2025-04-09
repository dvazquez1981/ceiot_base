#!/bin/bash

id="$1"
t="$2"
h="$3"

# Asegurar que los valores se pasan correctamente
json=$(jq -n --arg id "$(printf '%s' "$id")" \
             --arg t "$(printf '%s' "$t")" \
             --arg h "$(printf '%s' "$h")" \
      '{id: $id, t: $t, h: $h}')

# Mostrar JSON antes de enviarlo
echo "JSON generado: $json"

# Enviar con `curl`
curl -X POST http://localhost:8080/measurement \
     -H "Content-Type: application/json" \
     -d "$json"

