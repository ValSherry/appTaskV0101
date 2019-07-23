const Koa = require('koa');
const multer=require('koa-multer');
const views = require('koa-views');
const static = require('koa-static');
const fs = require('fs');
const path = require('path');
const body = require('./index');
const app = new Koa();

app.use(body());

//Подключаем пути
app.use(static(path.join( __dirname,  './')))
app.use(static(path.join( __dirname,  './static')))

//Подключаем ejs
app.use(views(path.join(__dirname, './view'), {extension: 'ejs'}))

// Переходы по страницам
app.use(async(ctx, next) => {
  let title = 'Задачи';
  // Переход на главную страницу
  if (ctx.url === '/') {
	// Ответы для пользователя
	let mess = '';
	// Имя текущего пользователя
    let name = '';
	// Данные из базы данных
    let list = '';
	// Строка с заголовком функции для обновления страниц
    let vi = '';	
	// Маркер доступа
	ver = 0;
	await ctx.render('index', {title, }) 
    // Переход на страницу c задачами для пользователя
  } else if (ctx.url === '/verification' && ctx.method === 'POST') {
    //Проверка пароля	
 	if (reply === 'Пароль введен верно') {
	  ver = 1;	
      mess = 'Пароль введен верно';
      list = tasks;
      name = login;
      vi = "addBlank('" + list + "')";
      await ctx.render('success', {title, list, name, mess, vi, }) 
      console.log(mess);
    // Переход на страницу с сообщением о неверном пароле
    } else {
      mess = 'Неверный логин или пароль';
      await ctx.render('unsuccess', {title, mess, }) 
      console.log(mess);
    }	
  // Переход на страницу с регистрацией пользователя
  } else if (ctx.url === '/registration') {
    await ctx.render('registration', {title, }) 
    // Переход на страницу с сообщением как прошла регистрация
    if (ctx.url === '/registration' && ctx.method === 'POST') {
	  mess = reply;  
      await ctx.render('ok', {title, mess, }) 
	}
  // Добавление задачи в базу данных 
  } else if (ctx.url === '/newtask' && ctx.method === 'POST' ){
    ctx.body = reply;
  // Запись картинки на диск
  } else if (ctx.url === '/fileimg' && ctx.method === 'POST' ){
    ctx.body = flimg;
  // Запись документа на диск
  } else if (ctx.url === '/filea' && ctx.method === 'POST' ){
    ctx.body = fla;
  // Загрузка страницы с бланками
  } else if (ctx.url === '/verification1') {
	if (ver === 1) {  
      list = tasks;
      vi = "addBlank('" + list + "')";
      await ctx.render('success', {name, vi, })
	} else {
      mess = 'Неверный логин или пароль'
      await ctx.render('unsuccess', {title, mess, }) 
    }	
  // Загрузка страницы с таблицей
  } else if (ctx.url === '/verification2'){
	if (ver === 1) { 
      list = tasks;
      vi = "addTable('" + list + "')";
      await ctx.render('success', {name, vi, })
	} else {
      mess = 'Неверный логин или пароль'
      await ctx.render('unsuccess', {title, mess, }) 
    }	
  // Ошибка
  } else {
    ctx.body = '<h1>404</h1>';
  }
  await next();
});

app.listen(3000, () => {
  console.log('Is starting at port 3000');
});

