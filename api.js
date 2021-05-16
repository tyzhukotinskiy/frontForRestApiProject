function login (username, password) {
	$.ajax({
	   url: 'http://localhost:3909/api/login',
	   type: 'POST',
	   contentType: 'application/json',
	   data: JSON.stringify({
		    "name": username,
		    "password": password,
		}),
	   success: function (result) {

	   		localStorage.setItem('token', result.data.token);
	   		is_auth = true;

	       getTasks();
	       login_page.style.display = 'none';
	       realtime_todo_list.style.display = 'flex';
	   },
	   error: function (error) {
				alert('Failed auth');
	   }
	});
}

function getTasks () {
	$.ajax({
	   url: 'http://localhost:3909/api/tasks',
	   type: 'GET',
	   contentType: 'application/json',
	   headers: {"Authorization": "Bearer " + localStorage.getItem('token')},
	   success: function (result) {
	   		todo_list.innerHTML = '';
	   		let tr = '';
	   		for (i = 0; i < result.data.length; i++) {
	   			tr += 	'<tr data-id="'+result.data[i].id+'" class="'+((result.data[i].is_complete)?'completed':'')+'">  ' + 
	   					'<td class="task_name">' + result.data[i].name + '</td>' +
	   					'<td><button class="updateButton">V</button></td>' +
	   					'<td><button class="deleteButton" '+((result.data[i].is_complete)?'':'disabled')+'>X</button></td>' +
	   			'</tr>';
	   		}
	   		todo_list.innerHTML = tr;

	   		let updateButtons = $('.updateButton');
	   		for (i = 0; i < updateButtons.length; i++) {
	   			updateButtons[i].onclick = function (e) {
	   				let taskRow = $(this).closest('tr');
	   				completeTask(taskRow.attr('data-id'), taskRow.find('.task_name').text());
	   			}
	   		}

	   		let deleteButtons = $('.deleteButton');
	   		for (i = 0; i < deleteButtons.length; i++) {
	   			deleteButtons[i].onclick = function (e) {
	   				let taskRow = $(this).closest('tr');
	   				deleteTask(taskRow.attr('data-id'));
	   			}
	   		}
	   },
	   error: function (error) {
				alert('Failed auth');
	   }
	});
}

function addTask (name) {
	$.ajax({
	   url: 'http://localhost:3909/api/tasks/',
	   type: 'POST',
	   contentType: 'application/json',
	   data: JSON.stringify({
		    "name": name,
		    "is_complete": 0,
		}),
	   headers: {"Authorization": "Bearer " + localStorage.getItem('token')},
	   success: function (result) {
	   		new_task_name.value = '';

	   		tr = 	'<tr data-id="'+result.data.id+'" class="">  ' + 
	   					'<td class="task_name">' + result.data.name + '</td>' +
	   					'<td><button class="updateButton">V</button></td>' +
	   					'<td><button class="deleteButton" disabled>X</button></td>' +
	   			'</tr>';


	   		todo_list.innerHTML += tr;

   			let updateButtons = $('.updateButton');
	   		for (i = 0; i < updateButtons.length; i++) {
	   			updateButtons[i].onclick = function (e) {
	   				let taskRow = $(this).closest('tr');
	   				completeTask(taskRow.attr('data-id'), taskRow.find('.task_name').text());
	   			}
	   		}

	   		let deleteButtons = $('.deleteButton');
	   		for (i = 0; i < deleteButtons.length; i++) {
	   			deleteButtons[i].onclick = function (e) {
	   				let taskRow = $(this).closest('tr');
	   				deleteTask(taskRow.attr('data-id'));
	   			}
	   		}
	   },
	   error: function (error) {
				alert('Failed auth');					
	   }
	});
}

function completeTask (id, name) {
	$.ajax({
	   url: 'http://localhost:3909/api/tasks/'+id,
	   type: 'PUT',
	   contentType: 'application/json',
	   data: JSON.stringify({
		    "name": name,
		    "is_complete": 1,
		}),
	   headers: {"Authorization": "Bearer " + localStorage.getItem('token')},
	   success: function (result) {
	   		$('[data-id='+id+']').addClass('completed');
	   		$('[data-id='+id+']').find('.deleteButton').attr('disabled', false);
	   },
	   error: function (error) {
				alert('Failed auth');					
	   }
	});
}

function deleteTask (id) {
	$.ajax({
	   url: 'http://localhost:3909/api/tasks/'+id,
	   type: 'DELETE',
	   contentType: 'application/json',
	   headers: {"Authorization": "Bearer " + localStorage.getItem('token')},
	   success: function (result) {
	   		$('[data-id='+id+']').remove();
	   },
	   error: function (error) {
				alert('Failed auth');					
	   }
	});
}