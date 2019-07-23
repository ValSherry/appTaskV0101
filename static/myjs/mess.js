// ДОБАВЛЕНИЕ ЗАДАЧИ


// Вывод окна с диалогом
$(function() {
  $("#dialog").dialog({
	buttons: [{text: "OK", click: function() {$(this).dialog("close")}}],
	title: "Сообщение", 
	autoOpen: false,
  });
});

// Сохранине
function addtask(){
  // Структура для хранния передаваемых данных
  arr = {
    username: username.value,
    taskname: taskname.value,
    task: task.value,
    datestart: datestart.value,
    yes2: yes2.checked,
    a: a.value,
    img: img.value,
  };
  // Передача файлов серверу
  StartAjax(imgfile,"/fileimg");
  StartAjax(afile,"/filea");
  // Передача структуры с задачей серверу
  EndAjax(JSON.stringify(arr),"/newtask");
  // Возвращение кнопок в исходное состояние
  btaddtask.className = "button1";
  btcanceltask.className = "button1";
  verify.className = "button";
} 

// Отмена сохрания
function canceltask(){
  // Стираем сообщение
  $("span").html('');
  //  Возвращение кнопок в исходное состояние
  btaddtask.className = "button1";
  btcanceltask.className = "button1";
  verify.className = "button";
} 

// Проверка введенных данных
function mess() {
  // Структура для хранния передаваемых данных
  let arr = {
    username: username.value,
    taskname: taskname.value,
    task: task.value,
    datestart: datestart.value,
    yes2: yes2.checked,
    a: a.value,
    img: img.value,
  };
  // Запоминаем файлы для передачи
  imgfile = $('#img').prop('files')[0];
  afile = $('#a').prop('files')[0];
  // Фильтры для проверки
  ptask = /^[^~]{1,140}$/i;
  ptaskname = /^[^~]{1,40}$/i; 
  pa = /^([^~]{1,200})\.(doc|docx|txt)$/i;
  pimg = /^([^~]{1,200})\.(png|jpg|gif)$/i;
  pdatestart = /^[^~]{1,10}$/i;
  
  str = '<br />';
  
  // Маркер правильности введенных данных
  k = 0;

  // Проверка данных
  if (ptask.test(arr.task.trim())) {
    str = str + '<li>Правильное название задачи.</li><br />'
  } else {
	str = str + '<li><font color="red">Не правильное название задачи.</font></li><br />'; 
	k=1;
  }

  if (ptaskname.test(arr.taskname.trim())) {
	str = str+'<li>Задача введена правильно.</li><br />'
  } else {
	str = str+'<li><font color="red">Задача ввведена не правильно.</font></li><br />'; 
    k = 1;
  }

  if (pdatestart.test(arr.datestart.trim())) {
	str = str + '<li>Дата введена правильно.</li><br />'
  } else {
    str = str + '<li><font color="red">Дата введена не правильно.</font></li><br />'; 
	k = 1;
  }

  if (pimg.test(arr.img.trim())) {
	str = str + '<li>Изображение задано верно.</li><br />'
  } else {
	str = str + '<li><font color="red">Изображение задано неверно.</font></li><br />';
	k=1;
  }

  if (pa.test(arr.a.trim())) {
	str = str + '<li>Документ задан верно.</li><br />'
  } else {
	str = str + '<li><font color="red">Документ задан неверно.</font></li><br />';
	k=1;
  }

  // Если все данные введены правильно открываем кнопки для сохрания и отмены.
  if (k === 0) {
    btaddtask.className = "button";
    btcanceltask.className = "button";
    verify.className = "button1";
  } 

  // Выводим сообщение о проверке данных
  $("span").html(str);
} 

// Функция передачи файлов
function StartAjax (a,b) {
  var data = new FormData();
  data.append('file', a);
  $.ajax({
    type: 'POST',
    url: b,
    cache: false,
    data: data,
    processData: false,
    contentType: false,
    timeout: 1000,
    success: function(data){},
    complete:function(jqXHR, textStatus) {
	  if (textStatus == 'success') {} 
      if (textStatus == 'error') {
        alert('Ошибка.');
      }
    },
    error: function(xhr, type){
      alert('Тайм-аут и попробуйте еще раз 1');
    }
  });	
}

// Функция передачи текстовых данных и вывода результата
function EndAjax (a,b) {
  var data = new FormData();
  data.append('file', a);
    $.ajax({
      type: 'POST',
      url: b,
      cache: false,
      data: data,
      processData: false,
      contentType: false,
      timeout: 5000,
      success: function(data){
        $("span").html(data);
      },
      complete:function(jqXHR, textStatus) {
        if (textStatus == 'success') {
          $( "#dialog" ).dialog("open");
        } 
        if (textStatus == 'error') {
          alert('Ошибка.');
        }
	  },
      error: function(xhr, type){
        alert('Тайм-аут и попробуйте еще раз',xhr);
      }
  });	
}
