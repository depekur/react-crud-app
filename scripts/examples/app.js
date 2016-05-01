(function ($) {

function superGrid(){
	$('.content').wookmark({
		autoResize: true, 
		offset: 20 
	});
}

function getHome() {
	$.ajax({
	   type: "POST",
	   url: "action.php",
	   data: { home: true}, 
	   dataType: 'json',
	   success: function(data) {
	   	
	   	for (var i = 0; i < data.length; i++) {
				var item = data[i];
				var $taskActive = $('.task-active').clone().toggleClass('death').toggleClass('task-active');

	      	$taskActive.find('.task-title').text(item.title);
	      	$taskActive.find('.task-data').text(item.message);
	      	$taskActive.find('.task-delete').data('id', item.id);
	      	$taskActive.find('.task-meta').text(item.time);

	      	$taskActive.appendTo(".content");	        
	      }

	      superGrid();
	  }
	});
	return false;
}


getHome();


/*
*	по клику на кнопку добавляем таску
* 	
*/

$( "html" ).on('submit', '.task-form', function(event ) {
	var data, json, html;
	var $form = $( this );
	
	event.preventDefault();
	data = $form.serialize();

	$.ajax({
      type: "POST",
      url: "action.php",
      data: data, 
      dataType: 'json',
      success: function(data) {        
         data = data[0];
         var $taskActive = $('.task-active').clone().toggleClass('death').toggleClass('task-active');

      	$taskActive.find('.task-title').text(data.title);
      	$taskActive.find('.task-data').text(data.message);
      	$taskActive.find('.task-delete').data('id', data.id);
      	$taskActive.find('.task-meta').text(data.time);

      	$taskActive.prependTo(".content");

         $form.find('input[type="text"]').val('');
         $form.find('textarea').val('');

         superGrid();
     }
   });

 	return false;	
});


/*
*	по клику на корзинку добавляем текущую таску в архив
* 	
*/
$("html").on('click', '.task-delete', function(event) {
	event.preventDefault();
	var $link = $( this );
	var del = $link.data('id');

	$.ajax({
	type: "POST",
	url: "action.php",
	data: { del: del}, 
	success: function(data) {
		$link.parent().remove();
		superGrid();
		}
	});
	return false;
});


/*
*	выдаем архив
* 	
*/
$("html").on('click', '.task-arh', function(event) {
	event.preventDefault();
	$.ajax({
		type: "POST",
		url: "action.php",
		data: { arh: true }, 
		dataType: 'json',
		success: function(data) {
			$(".content").children().remove();
			$('.task-form').toggleClass('death');
			$('.archive').toggleClass('death');
			$('.task-arh').toggleClass('death');
			$('.task-go-home').toggleClass('death');		
			

			for (var i = 0; i < data.length; i++) {
				var item = data[i];
				var $taskArchive = $('.task-archive').clone().toggleClass('death').toggleClass('task-archive');

				$taskArchive.find('.task-title').text(item.title);
	      	$taskArchive.find('.task-data').text(item.message);
	      	$taskArchive.find('.task-meta').text('Start: '+item.time);
	      	$taskArchive.find('.task-meta-end').text('End: '+item.finish);

	      	$taskArchive.appendTo(".content");  
			}
			superGrid();

		}

	});
	return false;

});


/*
*	убираем архив и выдаем домашнюю страницу
* 	
*/
$("html").on('click', '.task-go-home', function(event) {
	event.preventDefault();
	$(".content").children().remove();
	$('.task-form').toggleClass('death');
	$('.archive').toggleClass('death');
	$('.task-arh').toggleClass('death');
	$('.task-go-home').toggleClass('death');

	getHome();
	return false;
});


})(jQuery);