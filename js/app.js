Vue.filter('timeFromNow', function (value) {
	return moment(value).fromNow()
});

var Home = Vue.extend({
    template: '#home-template',
    data:function(){
    	return{
    		message: '',
			messages: [],
			users: [],
			urlRegex: /(https?:\/\/[^\s]+)/gi
    	}
	},

	created: function(){
		var that = this;
		// Get messages and show on list
		firebaseChild.on('child_added', function(childSnapshot, prevChildKey){
			//console.log(childSnapshot.val());
			that.messages.push(childSnapshot.val());
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
		}
	}
})

var Login = Vue.extend({
    template: '#login-template',
    created: function(){
    		
    },
    methods:{
	    doLogin: function(){
			userGoogle.doLogin();
		}
    }
});


var oneToOneChannel = Vue.extend({
    template: '<p>Channel</p>',
    created: function(){
    		
    }
});


var App = Vue.extend({})

var router = new VueRouter()

router.map({
    '/home': {
        component: Home,
        auth: true

    },
    '/login': {
        component: Login
    },
    '/foo': {
        component: oneToOneChannel
    }
})

// Now we can start the app!
// The router will create an instance of App and mount to
// the element matching the selector #app.
router.start(App, '#page-content-wrapper');

router.beforeEach(function (transition) {
	// Check auth 
	console.log(transition)

	if(transition.to.auth && !userGoogle.checkLogin()){
		transition.redirect('/login');
		return;
	}
	transition.next();

})


// SIDEBAR ROUTER
new Vue({
	el: '#sidebar-wrapper',

	data:{
		usernameLogged: userGoogle.username,
		users: [],

	},
	created: function(){
		console.log(userGoogle)
		var that = this;
    	// Get users logged - show on sidebar
		firebaseUsers.on('child_added', function(snapshot){
			that.users.push(snapshot.val());
		});
    },

    methods: {
    	logout: function(){
    		userGoogle.logout();
    	}
    }
});






















