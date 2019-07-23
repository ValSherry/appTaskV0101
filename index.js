const formidable = require("formidable");
const readStream = require('./lib/read_stream');
const { uploadFile } = require('./lib/upload');
const path = require('path');

let strictJSONReg = /^[\x20\x09\x0a\x0d]*(\[|\{)/;
// Подключение к БД
const { Client } = require('pg')
// параметры для подключения
const connection = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Postgres',
  database: 'db'
});

let jsonTypes = [
  'application/json'
];

let formTypes = [
  'application/x-www-form-urlencoded'
];

let textTypes = [
  'text/plain'
];


//
function bodyParser(opts = {}) {
  return async function(ctx, next) {
	// Проверка пароля и поиск задач  
    if (!ctx.request.body && ctx.method === 'POST' && ctx.url === '/verification') {
      let body = await readStream(ctx.request.req);
      let result = body;
      if (ctx.request.is(formTypes)) {
		[result1, result2, result3] = await parseQueryStr(body);
		 
	  } else if (ctx.request.is(jsonTypes)) {
        if (strictJSONReg.test(body)) {
          try {
            result = JSON.parse(body);
          } catch (err) {
            ctx.throw(500, err);
          }
        }
      } else if (ctx.request.is(textTypes)) {
        result = body;
      }
      // Возвращаем результаты проверки пароля и поиска задач
	  
      reply = result1;
	  tasks = result2;
	  login = result3;
	
  	// Регистрация нового пользователя
	} else if (!ctx.request.body && ctx.method === 'POST' && ctx.url === '/registration') {
      let body1 = await readStream(ctx.request.req);
	  let result4 = await addUser(body1);
	  reply = result4;
	// Запись новой задачи
	} else if (!ctx.request.body && ctx.method === 'POST' && ctx.url === '/newtask') {
	  // Считываем поля для добавления
      let form = new formidable.IncomingForm();
	  let k = await new Promise((reslove,reject) => {
	    form.parse(ctx.req,function(err,fields){
		  if (err) {
            reject(err)
          } else {
		    reslove(fields.file)
		  }
	    });
      });
	  // Добавляем запись в базу данных 
      let result7 =	await new Promise((resolve, reject) => {  
		setTimeout(()=>{
		  let rezadd = newtask (k,f1,f2)
		  resolve(rezadd);
		},3000);
	  })	
	  reply = result7	
	// Записываем изображение в папку uploads/img 
	} else if (!ctx.request.body && ctx.method === 'POST' && ctx.url === '/fileimg') {
	  let result1 = { success: false }
      let serverFilePath = path.join( __dirname, 'uploads' )
	  result1 = await uploadFile( ctx, {
	    fileType: 'img',
        path: serverFilePath
      })  
	  flimg = result1.filename;
	  f1 = 1;
    // Записываем документ в папку uploads/doc
	} else if (!ctx.request.body && ctx.method === 'POST' && ctx.url === '/filea') {
	  let result1 = { success: false }
      let serverFilePath = path.join( __dirname, './uploads' )
      result1 = await uploadFile( ctx, {
	    fileType: 'doc',
        path: serverFilePath
      })  
	  fla = result1.filename;
	  f2 = 1;
	// Загружаем данные для страниц из базы данных
 	} else if ( ctx.url === '/verification1') {
	  tasks = await getTaskX(login);  
    } else if ( ctx.url === '/verification2') {
	  tasks = await getTaskX(login);  
    }
	await next();
  }
}

// АВТОРИЗАЦИЯ
// Выделяем введеные логин и пароль
async function parseQueryStr(queryStr,) {
  let queryData = {};
  let queryStrList = queryStr.split('&');
  let itemList = queryStrList[0].split('=');
  let nm = decodeURIComponent(itemList[1]);
  let itemList1 = queryStrList[1].split('=');
  let pass = decodeURIComponent(itemList1[1]);
  // Вызываем функцию проверки пароля
  let result = await getDataX(nm,pass);
  // Вызываем функцию поиска задач в базе данных
  tasks = await getTaskX(nm);
  // Возвращаем: результат операции, список задач из БД, имя пользователя
  //console.log(result, tasks, nm);
  return [result, tasks, nm];
}

// Проверка пароля
async function getDataX(a,b) {
  let dataList = await selectAllData()
  for (i = 0; i < dataList.rowCount; ++i){
	let n = dataList.rows[i].username.trim();
    let p = dataList.rows[i].pass.trim();
    if (((n === a) && (p === b) && (a !== ''))){
      otv = 'Пароль введен верно';
	  break;
    } else {
	  otv = 'Пароль введен неверно';
	}
  }
  return otv;
}

// Запрос данных из таблицы пользователи
async function selectAllData() {
  let sql = 'SELECT * FROM users'
  let dataList = await query( sql )
  return dataList
}

// Формирование списка пользователей 
let query = function( sql, values ) {
  return new Promise(( resolve, reject ) => {
    connection.connect(
      connection.query(sql, values, ( err, rows) => {
		if ( err ) {
          reject( err );
		} else {
          resolve( rows );
		}
      })
    );
  });
}

// Формирование списка задач 
async function getTaskX(a) {
  let taskList = await tableData()
  let list = new Array();
  let j = 0;
    for (i = 0; i < taskList.rowCount; ++i){
	  n = taskList.rows[i].username.trim();
	  if  (n === a){
	    list[j] = new Array();
		list[j][0] = taskList.rows[i].task.trim()+'&|'
		list[j][1] = taskList.rows[i].a.trim()+'&|'
		list[j][2] = taskList.rows[i].img.trim()+'&|'
		list[j][3] = taskList.rows[i].task.trim()+'&|'
		list[j][4] = taskList.rows[i].taskname.trim()+'&|'
		list[j][5] = taskList.rows[i].datestart+'&|'
		list[j][6] = taskList.rows[i].yes2+'&|'
		list[j][7] = ';';
		j++;
	  }
    }
  return list;
}


// РЕГИСТРАЦИЯ 
// Регистрация пользователя
async function addUser(a) {
  
  queryStrList = a.split('&');

  // Вычленяем логин
  nm = queryStrList[0].split('=');
  username=decodeURIComponent(nm[1]);

  // Вычленяем пароль
  ps=queryStrList[1].split('=');
  pass=decodeURIComponent(ps[1]);

  // Вводим допустимые значения
  p = /^[a-zA-Z0-9]+$/;

  // Флаги проверки
  f1 = 0;
  f2 = 0;

  // Проверяем имя пользователя 
  let dataList = await selectAllData()
 
     if (username.length < 6) { 
        otv = 'Слишком короткое имя ' + username;
	  } else if (username.length > 20) { 
        otv = 'Слишком длинное имя ' + username;
      } else if (p.test(username)) {
		for (i = 0; i < dataList.rowCount; ++i) {
	      n=dataList.rows[i].username.trim();
          if (username === n){
	        otv = 'Пользователь ' + username + ' уже есть в базе данных';
			f1 = 0; 
	        break;
          } else {
			otv = 'Хороший логин ' + username;
            f1 = 1; 
		  }
		  }
	  } else {
	    otv = 'Недопустимые символы в имени ' + username; 
      }
	  
  // Проверяем пароль 
  if (pass.length < 6) { 
    otv = otv +  '. Слишком короткий пароль';
  } else if (pass.length > 20) { 
    otv = '. Слишком длинный пароль';
  } else if (p.test(pass)) {
	otv = otv + '. Хороший пароль'; 
	f2=1;
  } else {
	otv = otv + '. Недопустимые символы в пароле'; 	 
  }

  // Регистрируем пользователя в базе данных
  if ((f1 === 1) && (f2 === 1)) {
    const values = [username, pass];
    const sql = 'INSERT INTO users (username, pass) VALUES ($1, $2)';
    connection.query(sql, values, (err, res) => {
      if(err) {
      //  console.log(err);
	    otv = otv + '. Повторите ввод.';
      } else { 
	    // При удачной записи вернуть положительный ответ
	   // console.log(otv);
		otv = otv + '. Пользователь добавлен.';
      }
    });
  } 

  return otv;
}

// ФОРМИРОВАНИЕ СПИСКА ЗАДАЧИ
// Запрос задач
async function tableData() {
  let sql = 'SELECT username, task, a, img, taskname, datestart, yes2 FROM tasks_user';
  let taskList = await query2( sql );//++++++++++++
 
  return taskList
}

// Формирование списка задач 
let query2 = function( sql, values ) {
  return new Promise(( resolve, reject ) => {
    connection.query(sql, values, ( err, rows) => {
      if ( err ) {
        reject( err );
	  } else {
        resolve( rows );
      }
    });
  });
}

// ДОБАВЛЕНИЕ ЗАДАЧИ
// Добавление новой задачи в базу данных
async function newtask (k,f1,f2) {
  // Проверяем записаны ли файлы
  if ((f1 === 1) && (f2 === 1)) {
	// Заменяем имена файлов 
    k = JSON.parse(k);	
    k.a=fla;
    k.img=flimg;
    k = JSON.stringify(k);
    // Вызываем функцию формирующую пареметры записи
	result5 = addTask(k); 
	reply=result5;
	f1 = 0;
	f2 = 0;
  }
  else {result5 = "error";}
  // Возвращаем результат записи в базу данных
  return result5;
}

// Формируем параметры записи
async function addTask(a) {
const values = [JSON.parse(a).username, JSON.parse(a).taskname, JSON.parse(a).task, JSON.parse(a).datestart,  
	            JSON.parse(a).yes2, JSON.parse(a).a, JSON.parse(a).img]
const sql = 'INSERT INTO tasks_user (username, taskname, task, datestart, yes2, a, img) VALUES ($1, $2, $3, $4, $5, $6, $7)';
// Вызываем функцию записывающую задачу в дазу данных	
let RezTaskAdd = await query3( sql, values ); 
return RezTaskAdd;
}

// Запись задачи в базу данных
let query3 = function( sql, values ) {
  return new Promise(( resolve, reject ) => {	
    connection.query(sql, values, (err, res) => {
      if(err) {
        reject(err.detail);
      } else { 
	    resolve(res.command);
      }
	});
  });
}

module.exports = bodyParser;