# asl-notifications

## Development config

For default development config using `asl-conductor` create the following `.env` file:

```
PORT=8087
DATABASE_NAME=asl
DATABASE_HOST=localhost
DATABASE_USERNAME=postgres
EMAILER_SERVICE=http://localhost:8084
```

Then `npm run dev`.
