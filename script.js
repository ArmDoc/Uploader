var area = document.querySelector('.page__area');
var files = []

var uploadesFiles = 0;
var current = 0;
var step = 3;

var url = 'http://192.168.0.107/'

document.querySelector('.page__input').addEventListener('click', function() {
	document.querySelector('.page__file').click();
});

document.querySelector('.page__file').addEventListener('change', function(event) {
	var selectedFiles = event.target.files;
	for(var i = 0; i < selectedFiles.length; ++i) {
		files.push(selectedFiles[i]);
	}
	drawItems();
});

document.querySelector('.page__upload').addEventListener('click', function() {
	if(!files.length) {
		alert('No files')
	} 
	uploadesFiles = 0;
	uploadFiles();
});

area.addEventListener('drop', function(event) {
	event.preventDefault();
	for(var i=0; i<event.dataTransfer.files.length; ++i){
		if(event.dataTransfer.items[i].kind == 'file') {
			files.push(event.dataTransfer.items[i].getAsFile());
		}
	}
	drawItems()
});

area.addEventListener('dragover', function(event) {
	area.classList.add('page__uploadActive');
	event.preventDefault();
});

area.addEventListener('dragleave', function() {
	area.classList.remove('page__uploadActive');
});

function drawItems() {
	var list = document.querySelector('.list');
	list.innerHTML = ''
	files.forEach(function(file , index){
		var listItem = document.createElement('span');
			listItem.classList.add('list__item');
			listItem.setAttribute('data-id', index);
			list.append(listItem);

		var itemNumber = document.createElement('span');
			itemNumber.classList.add('item__number');
			itemNumber.innerText = (index + 1);
			listItem.append(itemNumber);

		var itemWrapper = document.createElement('span');
			itemWrapper.classList.add('item__wrapper');
			listItem.append(itemWrapper);

		var itemName = document.createElement('span');
			itemName.classList.add('item__name');
			itemName.innerText = file.name
			itemWrapper.append(itemName);

		var itemProgress = document.createElement('progress');
			itemProgress.classList.add('item__progress');
			itemProgress.setAttribute ('max', 100);
			itemWrapper.append(itemProgress);

		var itemPercent = document.createElement('span');
			itemPercent.classList.add('item__percent');
			itemPercent.innerText = '0%'
			listItem.append(itemPercent);
	})
}

function uploadFiles() {
	for(var i = current; i < current + step; ++i) {
		if(files[i] != undefined) {
			var form = new FormData;
			form.append('file', files[i]);
			var xhr = new XMLHttpRequest;
			xhr.upload.index = i;
			xhr.upload.onprogress = function(event) {
				var item = document.querySelector('.list__item[data-id="' + event.target.index + '"]');
				var percent = Math.floor(event.loaded / event.total * 100);
				item.querySelector('.item__percent').innerText = percent + '%'
				item.querySelector('.item__progress').value = percent
			}
			xhr.upload.onloadend = function() {
				uploadesFiles++
				if(uploadesFiles % step===0) {
					current += step
					uploadFiles()
				}
			}
			xhr.open('POST', url);
			xhr.send(form);
		}
	}
}
