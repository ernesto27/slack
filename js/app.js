var firebase = new Firebase(config.firebaseURL);
		var firebaseChild = firebase.child("messages");

		// Custom filters
		Vue.filter('timeFromNow', function (value) {
  			return moment(value).fromNow()
		})

		new Vue({
			el: 'body',

			data:{
				message: '',
				messages: []
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
					var message = this.message;
					var urlRegex = /(https?:\/\/[^\s]+)/gi;
					// Get link from text
					var resp = urlRegex.exec(this.message);
					if(resp){
						console.log(resp[0]);
						// Check if is an image
						// Get extension
						var extension = resp[0].split('.').pop();
						var imagesExt = ["jpg", "jpge", "png", "file"];
						if(imagesExt.indexOf(extension) != -1){
							console.log("Is a valid image");
							message = message.replace(urlRegex, '<br><img src="$1" width="200" height="200" /><br>');
						}
					}

					console.log(message);
					//return;	
					firebaseChild.push({
						text: message,
						date: Firebase.ServerValue.TIMESTAMP
					});		
				}
			}
		});