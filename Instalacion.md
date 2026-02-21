# Pasos para poder ejercutar el programa

## Aclaracion
> De ahora en adelante los comandos se mostraran con PNPM, para englobar los manejadores de paquetes. 

### Dependecias
En las rutas TP-DSW-2025-Moratti-Soto-Cossia-Bertuccelli\ y TP-DSW-2025-Moratti-Soto-Cossia-Bertuccelli\Frontend\conectar\ **ejecutar** 

```
pnpm install
```

### .ENV
Crear el archivo *.env* en la ruta TP-DSW-2025-Moratti-Soto-Cossia-Bertuccelli\ e insertar el siguiente codigo:

```
DB_URL=mysql://avnadmin:AVNS_9ouRLRmAWGj4H3MEoRJ@conectar-conectar.i.aivencloud.com:26772/defaultdb?ssl-mode=REQUIRED
DB_USER=avnadmin
DB_PASS=AVNS_9ouRLRmAWGj4H3MEoRJ
DB_HOST=conectar-conectar.i.aivencloud.com
DB_PORT=26772
DB_NAME=defaultdb
CA_PATH=./docs/ca.pem
MP_ACCESS_TOKEN=APP_USR-462668344377533-011720-8d9514ed9fb2ecbacc3f084c1260f5fc-3141372906
```

### Ejecucion 
Por ultimo ejecutar en paralelo pnpm start:prod en la ruta TP-DSW-2025-Moratti-Soto-Cossia-Bertuccelli\ y pnpm dev en TP-DSW-2025-Moratti-Soto-Cossia-Bertuccelli\Frontend\conectar\

**El programa ya debería estar en funcionamiento.**
