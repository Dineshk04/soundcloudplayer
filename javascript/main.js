/* 1.search*/

var ui = {};

ui.enterpress=function(){

	var key = document.querySelector(".js-search");
	key.addEventListener('keyup',function(e){
		var input=document.querySelector("input").value;

		if(e.which===13){
			cleanContainer();
			SoundcloudApi.getTrack(input);
		}
	});
	console.log(key);
};
ui.enterpress();

ui.searchclick=function(){
	var key = document.querySelector(".search");
	key.addEventListener('click',function(){
		
		var input=document.querySelector("input").value;
		cleanContainer();
		SoundcloudApi.getTrack(input);
	});
};
ui.searchclick();


/* 2.query soundcloud api*/


var SoundcloudApi={};

SoundcloudApi.init = function(){

	SC.initialize({
    client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
	});
};

SoundcloudApi.init();

SoundcloudApi.getTrack = function(inputvalue){ 
// find all sounds of buskers licensed under 'creative commons share alike'
	
	SC.get('/tracks', {
	  q: inputvalue
	}).then(function(tracks) {
	  console.log(tracks);
	  SoundcloudApi.rendertracks(tracks);
	});
};

function cleanContainer() {

 var container = document.querySelector(".js-search-results");

 container.innerHTML = "";

}

/* 3.display the card*/

SoundcloudApi.rendertracks = function(tracks){

	tracks.forEach(function(track){
		//card
		var card = document.createElement('div');
		card.classList.add("card");

		//image
		var image = document.createElement("div");
		image.classList.add("image");

		var image_img = document.createElement("img");
		image_img.classList.add("image_img");
		image_img.src = track.artwork_url || 'https://placekitten.com/100/100';

		image.appendChild(image_img);

		//content
		var content = document.createElement("div");
		content.classList.add("content");

		var header = document.createElement("div");
		header.classList.add("header");
		header.innerHTML = '<a href="'+ track.permalink_url + 'target="_blank">'+ track.title +'</a>';
		
		content.appendChild(header);

		//button
		var button = document.createElement("div");
		button.classList.add("ui", "bottom", "attached", "button", "js-button");

		var icon = document.createElement("i");
		icon.classList.add("add", "icon");
		button.appendChild(icon);

		var buttontext = document.createElement("span");
		buttontext.innerHTML = 'Add to playlist';
		button.appendChild(buttontext);

		button.addEventListener('click',function(){
			SoundcloudApi.getembed(track.permalink_url);
		});

		card.appendChild(image);
		card.appendChild(content);
		card.appendChild(button);

		var searchresults = document.querySelector('.js-search-results');
		searchresults.appendChild(card);

	});
};





/* 4.add to playlist*/
SoundcloudApi.getembed = function(trackurl){
	SC.oEmbed(trackurl, { 
		auto_play: true 
	}).then(function(embed) {
	  console.log('oEmbed response: ', embed);

	  var sidebar = document.querySelector('.js-playlist');
	  //sidebar.innerHTML = embed.html;

	  var box = document.createElement('div');
	  box.innerHTML = embed.html;

	  sidebar.insertBefore(box, sidebar.firstChild);

	  localStorage.setItem("key",sidebar.innerHTML);

	});
}

var sidebar = document.querySelector(".js-playlist");
sidebar.innerHTML = localStorage.getItem("key");
