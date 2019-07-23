// О программе
$(function() {
  $("#dialog2").dialog({
	buttons: [{text: "OK", click: function() {$(this).dialog("close")}}],
	title: "О программе", 
	autoOpen: false,
  });
});	

function about(){
 $( "#dialog2" ).dialog("open");
}

// Скролл
$(window).load(function(){
  var winHeight = $(document).height();
  var step = 4;
  var timeToScroll = winHeight/step;
  $('.scrolltop').on('click', function(){
    $('html, body').animate({
      scrollTop: 0
    }, timeToScroll);
  });
});

// Форматирование даты
function changeDate(newDate){
  //Форматируем дату - сперва разбиваем 
  let arrTaskDate = newDate.split(' ');
  // Переводим месяц
  let arrMonthEN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  let arrMonthRU = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  let idMonth = arrMonthEN.indexOf(arrTaskDate[1]); 
  let Month = arrMonthRU[idMonth];
  // Переводим дни недели
  let arrDayEN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  let arrDayRU = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
  let arrDayRUtrim = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  let idDay = arrDayEN.indexOf(arrTaskDate[0]); 
  let Day = arrDayRUtrim[idDay];
  //Потом нужное склеиваем 
  let TaskDateEN = arrTaskDate[2] + ' ' + arrTaskDate[1] + ' ' + arrTaskDate[3] + ' ' + arrTaskDate[0];
  let TaskDateRU = arrTaskDate[2] + ' ' +  Month  + ' ' + arrTaskDate[3] + ' ' + Day ;
  return TaskDateRU;
}

// ДОБАВИТЬ ЗАДАЧУ
function addTask(name) {
  // Отмечаем выбранный пункт меню
  menu1.className = "link";
  menu2.className = "link";
  menu3.className = "active";
  // Устанавливаем класс страницы
  result_multi.className = "article-holder-add";
  // Создаем наполнение страницы
  html = '<article>' +
         '<div><h2>Добавление задачи</h2></div>'+
         '<div class="secondary"><div class="label">Пользователь:</div> <div><input type="text" name="username" id="username" value="'+name+'" readonly /></div></div>' +
	     '<div class="secondary"><div class="label">Название:</div> <div><input name="taskname" id="taskname" required pattern="[^~]{1,40}"></div></div>' +
	     '<div class="secondary"><div class="label">Описание:</div> <div><input type="text" name="task" id="task" required pattern="[^~]{1,140}"/></div></div>' +
	     '<div class="secondary"><div class="label">Дата:</div> <div><input type="date" name="datestart" id="datestart" required /></div></div>'  +
	     '<div class="secondary1"><div>Маркер выполнения:</div> <div><input type="checkbox" name="yes2" id="yes2" required /></div></div>' + 
	     '<div class="secondary1"><div>Документ (doc | docx | txt):</div></div>' +
	     '<div class="secondary1"><div><input type="file" name="a" id="a" required /></div></div>' +
	     '<div class="secondary1"><div>Изображение (png | jpg | gif):</div></div>' +
	     '<div class="secondary1"><div><input type="file" name="img" id="img" required /></div></div>' +
	     '<div class="secondary1"><button type="submit" id="verify" class="button" onclick="mess();">Сохранить</button> <br/></div>'+
	     '</article>'+
         '<article>' +
	     '<div><h2>Добавление задачи</h2></div>'+
	     '<span></span>' +
	     '<div class="secondary"><button type="submit" id="btaddtask" class="button1" onclick="addtask();">Подтвердить</button> <br/></div>'+
	     '<div class="secondary"><button type="submit" id="btcanceltask" class="button1" onclick="canceltask();">Отменить</button> <br/></div>'+
	     '</article>';
  // Выводим контент
  document.getElementById('result_multi').innerHTML = html;	
}

//ЗАДАЧИ СПИСКОМ
function addTable(list) {
  // Отмечаем выбранный пункт меню
  menu1.className = "link";
  menu2.className = "active";
  menu3.className = "link";
  // Устанавливаем класс страницы
  result_multi.className="article-holder-tb";
  let html = ' ';
  // Разбиваем текст на строки с задачами
  let arr = list.split(';');
  for (let i = 0; i < arr.length-1; i++) {
   // Убираем лишние запятые в начале строки
   if (arr[i][0] == ',' ){
     list2 = arr[i].substr(1) 
   } else { 
     list2 = arr[i]
   }
   // Разбиваем строки с задачами на поля
   let arrX = list2.split('&|,');
   // Проверяем выполнена ли задача
   let checked = "";
     if (arrX[6] === "true") {
	   checked = "checked"
	 }
   // Изменяем дату
   let TaskDate = changeDate(arrX[5]);
   html = html + 
          '<article>' +
              '<div class ="rec">'  +
 		          '<div class ="image"><img src= ' + '"./uploads/img/'+arrX[2] + '" alt=' + arrX[4] + ' ></div>' +
		          '<div><input type="checkbox"'+ checked +' disabled="disabled" ></div>' +  
		          '<div class ="title"> ' + arrX[4] + '</div>' +
                  '<div class="content">' + arrX[0] + '</div>' +
                  '<div class ="doc">' + arrX[1] + '</div>' +
                  '<div class ="date">' + TaskDate + '</div>'  +
		      '</div>' +
          '</article>';
  }
  // Выводим контент
  document.getElementById('result_multi').innerHTML = html;	
}

// ЗАДАЧИ БЛАНКАМИ
function addBlank(list) {
  // Отмечаем выбранный пункт меню
  menu1.className = "active";
  menu2.className = "link";
  menu3.className = "link";
  // Устанавливаем класс страницы
  result_multi.className = "article-holder";
  let html = ' ';
  // Разбиваем текст на строки с задачами
  let arr = list.split(';');
  for (let i = 0; i < arr.length-1; i++) {
    // Убираем лишние запятые в начале строки
    if (arr[i][0] == ',' ){
      list2=arr[i].substr(1) 
    } else { 
	  list2=arr[i]
	}
    // Разбиваем строки с задачами на поля
    let arrX = list2.split('&|,');
    // Проверяем выполнена ли задача
    let checked = "";
    if (arrX[6] === "true") {
	  checked = "checked"
	}
    // Изменяем дату
    let TaskDate = changeDate(arrX[5]);
    html = html + 
	       '<article>' +
		       '<div class="secondary">' + 
                   '<img src= ' + '"./uploads/img/'+arrX[2] + '" alt=' + arrX[4] + '>' +
		           '<input type="checkbox" class="yes" '+ checked +' disabled="disabled" >' +  
		       '</div>' +
               '<div class="details">' +
                   '<h2>' + arrX[4] + '</h2>' +
                   '<p>' + arrX[0] + '</p>' +
               '</div>' +
               '<div class="secondary">' +
                   '<span class="views">' + arrX[1] + '</span>' +
                   '<span class="date">' + TaskDate + '</span>'  +
		       '</div>' +
           '</article>';
  }
  // Выводим контент
  document.getElementById('result_multi').innerHTML = html;	
}
