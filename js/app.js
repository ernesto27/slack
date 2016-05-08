var firebase = new Firebase(config.firebaseURL);
var firebaseChild = firebase.child("messages");

// Custom filters
Vue.filter('timeFromNow', function (value) {
		return moment(value).fromNow()
});

new Vue({
	el: 'body',

	data:{
		message: '',
		messages: [],
		urlRegex: /(https?:\/\/[^\s]+)/gi
	},

	created: function(){
		console.log("view is created");
		var that = this;
		// Get messages and show on list
		firebaseChild.on('child_added', function(childSnapshot, prevChildKey){
			console.log(childSnapshot.val());
			that.messages.push(childSnapshot.val());
		});
	},

	methods:{
		addMessage: function(){	
			var resp = this.existsLinkOnMessage();
			if(resp){
				// Is an image maybe?
				this.renderImageOnMessage(resp);

			}

			firebaseChild.push({
				text: this.message,
				date: Firebase.ServerValue.TIMESTAMP
			});		

			this.message = '';
		},


		existsLinkOnMessage: function(urlRegex){
			var resp = this.urlRegex.exec(this.message);
			return resp;
		},

		renderImageOnMessage: function(resp){
			var extension = resp[0].split('.').pop();
			var imagesExt = ["jpg", "jpge", "png", "file"];
			if(imagesExt.indexOf(extension) != -1){
				console.log("is and image");
				this.message = this.message.replace(this.urlRegex, '<br><img src="$1" width="200" height="200" /><br>');
			}
			
		}

	}
});























