Images = new Mongo.Collection("image");

//ovdje overridamo insert i remove funkcije na nasoj kolekciji
Images.allow({
    insert: function(userId, doc) {
        console.log("Testing security on insert method");
        if(Meteor.user()){
            if(userId!=doc.createdBy){
                return false;
            }
            else{
                return true;
            }
        }
        else return false;
    },
    remove:function(userId, doc){
        console.log("userId = "+userId);
        console.log("doc = ");
        console.log(doc);
        if(Meteor.user()){
        	 if(userId==doc.createdBy){
                return true;
            }
            else{
                return false;
            }
        }
        else return false;
    }
    });