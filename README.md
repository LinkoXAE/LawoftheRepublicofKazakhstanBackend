# ZAN·BASE

ZAN·BASE — это десктопное приложение для поиска и просмотра нормативных правовых актов Республики Казахстан

## Возможности
- Поиск законов, кодексов, НПА и международных договоров по ключевым словам
- Просмотр полного текста документа с реквизитами и источником
- Работа без Node.js, в виде .exe-файла (Electron)

## Запуск и сборка

### 1. Backend

```
cd backend
npm install
npm run start:prod
```

### 2. Frontend (Electron)

```
cd frontend
npm install
npm run electron:build
```

Готовый .exe-файл появится в папке `frontend/dist/win-unpacked`.

## Требования
- Windows 10/11
- Интернет для поиска и просмотра документов

## Структура
- backend — NestJS сервер, парсинг и прокси adilet.zan.kz
- frontend — React + Electron, UI и логика приложения

## Автор
- Разработка: 2023–2025
