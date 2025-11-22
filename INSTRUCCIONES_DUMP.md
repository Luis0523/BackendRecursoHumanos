# Instrucciones para crear y subir el dump

## 1. Crear el dump de la base de datos local
```bash
mysqldump -u root -p gestion_talento_humano > dump_gestion_talento_humano.sql
```

## 2. Subir el dump a Railway
```bash
mysql -h ballast.proxy.rlwy.net -u root -pGGJbIcKcuZyBTSESjnAMDDzgZyUqOGlG --port 50517 railway < dump_gestion_talento_humano.sql
```

IMPORTANTE: La base de datos en Railway se llama "railway", no "gestion_talento_humano"

## 3. Actualizar variables de entorno en Railway
Asegúrate de tener estas variables en Railway:

```
DB_HOST=ballast.proxy.rlwy.net
DB_PORT=50517
DB_USER=root
DB_PASSWORD=GGJbIcKcuZyBTSESjnAMDDzgZyUqOGlG
DB_NAME=railway
DB_DIALECT=mysql
```
