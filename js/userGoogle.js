var userGoogle = {
	id: null,
	username: '',
	profileImage: '',


	checkLogin: function(){
		var authData = firebase.getAuth();
		if (authData) {
			this.id     = authData.google.id;
		  	this.username     = authData.google.displayName;
		  	this.profileImage = authData.google.profileImageURL;
			return true;
		} else {
			console.log("Redirect to login page");
		}
	},

	doLogin: function(){
		var that = this;
		firebase.authWithOAuthPopup("google", function(error, authData) {
			if (error) {
		    	console.log("Login Failed!", error);
		  	} else {
		    	console.log("Authenticated successfully with payload:", authData);
		    	that.id     	  = authData.google.id;
		    	that.username     = authData.google.displayName;
		    	that.profileImage = authData.google.profileImageURL;


		    	// Check if users exists
		    	var userExists = false;
		    	firebaseUsers.once('value', function(snapshot){
		    		var users = snapshot.val();
		    		snapshot.forEach(function(user) {
						if(that.id == user.val().id){
							userExists = true;
							return ;
						}
					});

					// Save user on firebase.
			    	if(!userExists){
				    	firebaseUsers.push({
				    		id: that.id,
				    		username: that.username,
				    		profileImage: that.profileImage
				    	}, function(err){
				    		if(!err) console.log("Success save user");
				    	});
			    	}

			    	router.go('/home');
		    	});

		    	
		  	}
		});
	},

	logout: function(){
		firebase.unauth();
	}



};