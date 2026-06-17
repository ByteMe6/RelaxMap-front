# RelaxMap

Share and discover relaxing travel destinations on an interactive map.

**[Live Demo](https://byteme6.github.io/RelaxMap-front/)** · [Русский](./README.ru.md)

## Features

- Interactive map with location pins (Leaflet)
- Browse, add, and edit locations with photos
- Leave reviews on locations
- User accounts and profiles
- Smooth animations (AOS) and image carousel (Swiper)
- Persistent auth state via Redux

## Tech Stack

| | |
|---|---|
| Language | TypeScript |
| Framework | React 19, React Router 7 |
| State | Redux Toolkit, redux-persist |
| Map | Leaflet, react-leaflet |
| Forms | Formik |
| Styling | SCSS, normalize.css |
| HTTP | Axios |
| Tooling | Vite 7, GitHub Pages |

## Setup

```bash
git clone https://github.com/ByteMe6/RelaxMap-front
cd RelaxMap-front
npm install
npm run dev
```

To point at a local backend, edit `src/backendHost.ts`:

```ts
export const host: string = "http://localhost:8080";
```

## Repos

- [Frontend](https://github.com/ByteMe6/RelaxMap-front)
- [Backend](https://github.com/ByteMe6/RelaxMap-back)

## Developers

<a href="https://github.com/ByteMe6/RelaxMap-front/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ByteMe6/RelaxMap-front" />
</a>
