# Сервер обс буститулзов

## Требования
- Node v.18+ (https://nodejs.org)

## Установка (через дист)
- Скачайте релизную версию и распакуйте
- Откройте консоль в этой директории и введите `npm i`. После установки пакетов, введите `npm run start`
- В первый раз сервер вылетит и попросит токен бусти.
- Зайдите в инкогнито на boosty.to и выполните вход.
- Перезагрузите страницу (F5 или что-то)
- В консоли браузера на этой же странице выполните следующий код:
```javascript
(() => {
  const authData = JSON.parse(localStorage.auth)
  console.log(JSON.stringify({
    uuid: localStorage._clientId,
    ...authData,
    expiresAt: +authData.expiresAt,
    isEmptyUser: 0,
    redirectAppId: "web",
    username: "!ENTER_YOUR_USERNAME!",
  }, undefined, 4))
})()
```
- Получится что-то типа того:

![image](https://github.com/njajkes/boosty-obs-tools-localserver/assets/67927925/b4cee751-6951-46c1-9343-ea09191d373d)

Это надо скопировать и **записать в storage.json**, педварительно заменив !ENTER_YOUR_USERNAME! на свой ник на платформе. В папке уже будет storage.example.json, в котором будет храниться похожая схема - используйте его как ориентир.

- Ещё раз введите команду `npm run start`. Если ничего не вылетело, установка завершена.

## Настройка обс
- 

## Запуск
- Введите `npm run start`

