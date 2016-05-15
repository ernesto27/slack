
// Custom filters
Vue.filter('timeFromNow', function (value) {
		return moment(value).fromNow()
});

new Vue({
	el: 'body',

	data:{
		message: '',
		messages: [],
		users: [],
		urlRegex: /(https?:\/\/[^\s]+)/gi
	},

	created: function(){
		var that = this;
		// Get messages and show on list
		firebaseChild.on('child_added', function(childSnapshot, prevChildKey){
			//console.log(childSnapshot.val());
			that.messages.push(childSnapshot.val());
		});

	
		// Check auth 
		userGoogle.checkLogin();

		// Get users logged - show on sidebar
		firebaseUsers.on('child_added', function(snapshot){
			that.users.push(snapshot.val());
		});


	},

	methods:{
		addMessage: function(){	
			var resp = this.existsLinkOnMessage();
			if(resp){
				this.renderLinkOnMessage(resp);

			}

			firebaseChild.push({
				text: this.message,
				username: userGoogle.username,
				profileImage: userGoogle.profileImage,
				date: Firebase.ServerValue.TIMESTAMP
			});		

			this.message = '';
		},


		existsLinkOnMessage: function(urlRegex){
			var resp = this.urlRegex.exec(this.message);
			return resp;
		},

		renderLinkOnMessage: function(resp){
			var extension = resp[0].split('.').pop();
			var imagesExt = ["jpg", "jpge", "png", "file"];
			if(imagesExt.indexOf(extension) != -1){
				console.log("is and image");
				this.message = this.message.replace(this.urlRegex, '<br><img src="$1" width="200" height="200" /><br>');
			}else{
				// Default link
				this.message = this.message.replace(this.urlRegex, '<br><a href="$1" target="_blank">$1</a><br>');

			}			
		},

		doLogin: function(){
			userGoogle.doLogin();
		}

	}
});























