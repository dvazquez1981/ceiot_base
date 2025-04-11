#!/bin/bash

id="$1"
t="$2"
h="$3"
p="$4"

# Asegurar que los valores se pasan correctamente
json=$(jq -n --arg id "$(printf '%s' "$id")" \
             --arg t "$(printf '%s' "$t")" \
             --arg h "$(printf '%s' "$h")" \
              --arg p "$(printf '%s' "$p")" \
      '{id: $id, t: $t, h: $h, p: $p}')

# Mostrar JSON antes de enviarlo
echo "JSON generado: $json"

# Enviar con `curl`
curl -X POST http://localhost:8080/measurement \
     -H "Content-Type: application/json" \
     -d "$json"

