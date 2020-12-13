
//Get the list of saved pages
function getList() {
	var target = document.getElementById('content');
	if (target)	target.classList.add('loading');
	fetch('api.php?action=get')
		.then(function(data) {
			data.json().then(res => {

				if (res.result == 'must_login') {
					window.location = 'about.html';
				} else {
					articles = '';
					for (var i in res) {
						var article = res[i];
						if (article.title.length > 80)
							article.title = article.title.substring(0, 75) + '...';
						else if (article.title.length == 0)
							article.title = '(No title)';
						articles += '' + 
							'<article id="item_' + article.id + '" style="' + article.image + '">' +
							'	<img src="https://www.interordi.com/tools/favicon/get/' + article.domain + '" alt="" onerror="this.src=\'images/empty.png\'" class="small" />' +
							'	<a href="' + article.url + '" class="url">' + article.title + '</a>' +
							'	<div class="text">' +
							'		' + article.details + '' +
							'	</div>' +
							'	<div class="actions">' +
							'		<a href="javascript:read(' + article.id + ')"><img src="images/glyphicons-basic-844-square-check.svg" alt="Read" /></a>' +
							'		<a href="javascript:remove(' + article.id + ')"><img src="images/glyphicons-basic-843-square-remove.svg" alt="Delete" /></a>' +
							'	</div>' +
							'</article>';
					}
					target.innerHTML = articles;
				}

				if (target)	target.classList.remove('loading');
			});
		})
		.catch(error => console.log('Error:' + error));
}


//Mark an item as read
function read(id) {
	executeAction(id, "archive");
}


//Delete an item directly
function remove(id) {
	if (confirm("Are you sure you want to delete this entry?")) {
		executeAction(id, "delete");
	}
}


//Add a page
function addAction() {
	let url = prompt('Enter the URL of a page to add');
	if (url == null || url == '')
		return;

	var target = document.getElementById('content');
	if (target)	target.classList.add('loading');
	fetch('api.php?action=add&url=' + url)
		.then(function(data) {
			data.json().then(res => {
				//FIXME: Insert the item directly instead of refreshing
				getList();
			});
		})
		.catch(error => {
			console.log('Error:' + error)
		});
}


//Execute an action
function executeAction(id, action) {
	var target = document.getElementById("item_" + id);
	if (target)	target.classList.add('loading');
	fetch('api.php?action=' + action + '&id=' + id)
		.then(function(data) {
			data.json().then(res => {
				target.remove();

				if (target)	target.classList.remove('loading');
			});
		})
		.catch(error => {
			console.log('Error:' + error)
		});
}


//Login
function login() {
	window.location = 'api.php?action=auth';
}


//Logout
function logout() {
	var target = document.getElementById('content');
	if (target)	target.classList.add('loading');
	fetch('api.php?action=logout')
		.then(function(data) {
			data.json().then(res => {
				if (target)	target.classList.remove('loading');
			});
		})
		.catch(error => console.log('Error:' + error));
}
