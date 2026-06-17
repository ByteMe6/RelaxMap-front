# RelaxMap

Делись и открывай места для отдыха на интерактивной карте.

**[Демо](https://byteme6.github.io/RelaxMap-front/)** · [English](./README.md)

## Возможности

- Интерактивная карта с маркерами локаций (Leaflet)
- Просмотр, добавление и редактирование локаций с фото
- Отзывы на локации
- Аккаунты и профили пользователей
- Анимации (AOS) и карусель изображений (Swiper)
- Сохранение состояния авторизации через Redux

## Стек

| | |
|---|---|
| Язык | TypeScript |
| Фреймворк | React 19, React Router 7 |
| Состояние | Redux Toolkit, redux-persist |
| Карта | Leaflet, react-leaflet |
| Формы | Formik |
| Стили | SCSS, normalize.css |
| HTTP | Axios |
| Инструменты | Vite 7, GitHub Pages |

## Установка

```bash
git clone https://github.com/ByteMe6/RelaxMap-front
cd RelaxMap-front
npm install
npm run dev
```

Чтобы подключить локальный бекенд, отредактируй `src/backendHost.ts`:

```ts
export const host: string = "http://localhost:8080";
```

## Репозитории

- [Фронтенд](https://github.com/ByteMe6/RelaxMap-front)
- [Бекенд](https://github.com/ByteMe6/RelaxMap-back)

## Разработчики

<a href="https://github.com/ByteMe6/RelaxMap-front/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ByteMe6/RelaxMap-front" />
</a>
