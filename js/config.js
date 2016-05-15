var config = {
	firebaseURL: 'https://slacka.firebaseio.com/'
};


var firebase = new Firebase(config.firebaseURL);
var firebaseChild = firebase.child("messages");
var firebaseUsers = firebase.child("users");


