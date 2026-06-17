# RelaxMap

Ділися та відкривай місця для відпочинку на інтерактивній карті.

**[Демо](https://byteme6.github.io/RelaxMap-front/)** · [English](./README.md) · [Русский](./README.ru.md)

> Бекенд може бути недоступний — додаток працює на [relaxmap.hellper.dev](https://relaxmap.hellper.dev)

## Можливості

- Інтерактивна карта з маркерами локацій (Leaflet)
- Перегляд, додавання та редагування локацій з фото
- Відгуки на локації
- Акаунти та профілі користувачів
- Анімації (AOS) і карусель зображень (Swiper)
- Збереження стану авторизації через Redux

## Стек

| | |
|---|---|
| Мова | TypeScript |
| Фреймворк | React 19, React Router 7 |
| Стан | Redux Toolkit, redux-persist |
| Карта | Leaflet, react-leaflet |
| Форми | Formik |
| Стилі | SCSS, normalize.css |
| HTTP | Axios |
| Інструменти | Vite 7, GitHub Pages |

## Встановлення

```bash
git clone https://github.com/ByteMe6/RelaxMap-front
cd RelaxMap-front
npm install
npm run dev
```

Щоб підключити локальний бекенд, відредагуй `src/backendHost.ts`:

```ts
export const host: string = "http://localhost:8080";
```

## Репозиторії

- [Фронтенд](https://github.com/ByteMe6/RelaxMap-front)
- [Бекенд](https://github.com/ByteMe6/RelaxMap-back)

## Розробники

<a href="https://github.com/ByteMe6/RelaxMap-front/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ByteMe6/RelaxMap-front" />
</a>
