# Fudo

Frontend de una red social acotada: feed de posts, detalle y comentarios anidados.

## Desarrollo

```bash
npm ci
npm run dev
```

La API es [MockAPI](https://665de6d7e88051d60408c32d.mockapi.io). Copiá `.env.example` a `.env` si querés cambiar la URL.

## Tests

```bash
npm run test:run
```

## Docker

```bash
docker build -t fudo .
docker run --rm -p 8080:80 fudo
```

## GitHub Pages

El deploy corre con Actions al pushear a `main`. En el repo: **Settings → Pages → Source → GitHub Actions**.

La app queda en `https://manumental32.github.io/fudo-challenge/`.
