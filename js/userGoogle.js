var userGoogle = {
	username: '',
	profileImage: '',

	checkLogin: function(){
		var authData = firebase.getAuth();
		if (authData) {
		  this.username     = authData.google.displayName;
		  this.profileImage = authData.google.profileImageURL;
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
		    	that.username     = authData.google.displayName;
		    	that.profileImage = authData.google.profileImageURL;
		  	}
		});
	}
};