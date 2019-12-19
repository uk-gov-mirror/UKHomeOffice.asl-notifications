# asl-notifications

## Development config

For default development config using `asl-conductor` create the following `.env` file:

```
LOG_LEVEL=info
PORT=8087
DATABASE_NAME=asl
DATABASE_HOST=localhost
DATABASE_USERNAME=postgres
EMAILER_SERVICE=http://localhost:8084
PUBLIC_UI=http://localhost:8080
```

Then `npm run dev`.

## Additional config

* `DATABASE_PASSWORD`
* `DATABASE_PORT`
