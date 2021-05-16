let is_auth = false;
 

let t = setInterval(function (){
	if (is_auth) {
		getTasks();
	}
}, 2000)