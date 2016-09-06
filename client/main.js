Router.configure({
	layoutTemplate:"ApplicationLayout"
});

Router.route('/', function () {
  this.render('welcome',{
  	to:"main"
  });
});

Router.route('/images',function(){
	this.render("navbar",{
		to:"navbar"
	});
	this.render("image",{
		to:"main"
	});
});

Router.route('/image/:_id',function(){
	this.render("navbar",{
		to:"navbar"
	});
	this.render("singleImage",{
		to:"main",
		data: function(){
			return Images.findOne({_id:this.params._id});
		}
	});
});




//hardcoded img data
 var img_Data =
        [{
            img_src: "keno.png",
            img_alt: "Nema slike jarane1"
        }, {
            img_src: "earth.jpg",
            img_alt: "Nema slike jarane2"
        }, {
            img_src: "heart.jpg",
            img_alt: "Nema slike jarane3"
        }];

//Ovdje hvatamo scroll event preko jquerya i pratimo kad dodjemo do dna i loadamo jos 4 slike
    $(window).scroll(function(event){
    	var scrollPosition = $(this).scrollTop();
        if (scrollPosition >= $(document).height() - $(window).height()-200) {
        	console.log("Trenutno: "+scrollPosition);
        	console.log("Razlika: "+($(document).height() - $(window).height()));
        	Session.set("imgNumber",Session.get("imgNumber")+4);
        }

    });

//session set je setovanje nekog parametra kojeg cemo koristiti kasnije u kodu
//to je ustvari key value par
    Session.set("imgNumber",8);

//ovdje koristimo funkciju config iz account paketa koji smo instalirali i setujemo
//da za registrovanje ukljucimo i username i mail, ne samo mail koji je defualt
    Accounts.ui.config({
    	passwordSignupFields:"USERNAME_AND_EMAIL"
    });

//ovo su helperi u kojima se definisu podaci koji se koriste u teplateu
//to je slicno kao $scope u angular contorleru
    Template.image.helpers({
        slike1: img_Data
    });

    Template.image.helpers({
        slike: function(){
        	if(Session.get("userFilter")){
        		return Images.find({createdBy:Session.get("userFilter")},{sort:{rating:-1}});
        	}
        	else{
 				//koristimo find metodu, daj sve, sortiraj po necemmu, i ogranici broj 
        		return Images.find({},{sort:{createdOn:-1,rating:-1}, limit: Session.get("imgNumber")});
        	}
        },
        getUser:function(user_id){
        	//findOne iz meteor.usersa jer imamo onaj package
        	var user = Meteor.users.findOne({_id:user_id});
        	if(user){
        		return user.username;
        	}
        	else{
        		return "anon";
        	}
        },
        filter_enabled: function(){
        	if(Session.get("userFilter")){
        		return Session.get("userFilter");
        	}
        	else return false;
        },
        name : function(){
        	return Session.get("userFilter");
        },
        username: function(){
        	return Meteor.user().username;
        }      
    });

    Template.body.helpers({
    	username:function(){
    		console.log(Meteor.user());
    		if(Meteor.user()){
				return Meteor.user().username;
    		}
    		else{
    			return "Anonymous user";
    		}
    	}
    });

    console.log("Ja sam client!");
    console.log("Client kaze: Broj slika = "+Images.find().count());

//ovdje definisemo evente, treba nam tip eventa i klasa taga na koji se odnosi
    Template.image.events({
        'click .js-image': function(event) {
            console.log(event.target);
        },
        'click .js-img-delete': function(event) {
            var image_id = this._id;
            console.log("ID slike koji je generisao Mongo: " + image_id);
            $("#" + image_id).hide('slow', function() {
                Images.remove({
                    '_id': image_id
                });
            });
        },
        'click .js-star-img': function(event) {
        	//ovo nam daje sam rating star (broj)
        	var rating = $(event.currentTarget).data("userrating");
             console.log(rating);
             //ovo nam daje id zvijezde odnosno id slike na koju je data
             console.log($(event.currentTarget).attr("id"));
             //ili jednostavnije
             var imageId = this.id;
             console.log(imageId);
             //update slike, tj dodavanje ratinga
             Images.update({_id:imageId},
             			   { $set: {rating:rating}});

        },
        'click .js-add-image':function(event){
        	$("#img_modal").modal("show");
        },
        'click .js-set-image-filter':function(event){
        	Session.set("userFilter",this.createdBy);
        },
        'click .js-remove-filter':function(event){
        	Session.set("userFilter",undefined);
        }
    });

    Template.image_add_form.events({
    	'submit .js-add-image':function(event){
    		var img_src = event.target.img_src.value;
    		var img_alt = event.target.img_alt.value;
    		console.log("SRC: "+img_src+", ALT: "+img_alt);
    		if(Meteor.user()){
    		Images.insert({
    			img_src:img_src,
    			img_alt:img_alt,
    			createdOn: new Date(),
    			createdBy: Meteor.user()._id
    		});
    	}

    		$("#img_modal").modal("hide");
    		event.target.img_src.value="";
    		event.target.img_alt.value="";
    		 event.preventDefault();

    	}
    });
