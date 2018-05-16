const mongoCollections = require("../config/mongoCollections");
var uuid = require('node-uuid');

const recipes = mongoCollections.recipes;

let exportedMethods = {
    // This is a fun new syntax that was brought forth in ES6, where we can define
    // methods on an object with this shorthand!

   
    addRecipes(title,ingredients,steps) {
 if (!title) 
            return Promise.reject("You must provide a title for recipe");
        
        if (!ingredients ) 
            return Promise.reject("You must provide ingredients");

            if (!steps) 
            return Promise.reject("You must provide steps for recipe");
                return recipes().then((recipesCollection) => {
            let newRecipe ={
                _id:uuid(),
                title: title,
                ingredients: ingredients,
                steps: steps,
                comments: []
            };
            return recipesCollection
                .insertOne(newRecipe)
                .then((newInsertInformation) => {
                    return newInsertInformation.insertedId;
                })
                .then((newId) => {
                    console.log("inserted");
                    return module.exports.getRecipe(newId);
                });
        }).catch((e)=>{
console.log(e);
        });
        

       
    },
    getAllRecipes(){
        return recipes().then((recipesCollection)=>{

            console.log(recipesCollection.find({}).toArray());
return recipesCollection.find({}).toArray();        }
        )}
    ,getRecipe(id) {
        if (!id) 
            return Promise.reject("You must provide an id to search for");
        
        return recipes().then((recipesCollection) => {
            return recipesCollection.findOne({_id: id});
        });
    },

updateRecipe(id, updatedRecipe) {
if (!id) 
            return Promise.reject("You must provide an id ");
        
  

        return recipes().then((recipesCollection) => {
            let updatedRecipeData = {};

            if (updatedRecipe.title) {
                updatedRecipeData.title = updatedRecipe.title;
            }

            if (updatedRecipe.ingredients) {
                updatedRecipeData.ingredients = updatedRecipe.ingredients;
            }

            if (updatedRecipe.steps) {
                updatedRecipeData.steps = updatedRecipe.steps;
            }


             if (updatedRecipe.comments) {
                updatedRecipeData.comments = updatedRecipe.comments;
                
            }

            let updateCommand = {
                $set: updatedRecipeData
            };

            return recipesCollection.updateOne({
                _id: id
            }, updateCommand).then((result) => {
                return module.exports.getRecipe(id);
            }).catch((e)=>{console.log(e);});
        });
    },
    removeRecipe(id){

if (!id) 
            return Promise.reject("You must provide an id to search for");
        return recipes().then((recipeCollection) => {
            return recipeCollection
                .remove({_id:id})
                .then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        throw(`Could not delete task with id of ${id}`)
                    }
                    else
                    console.log('Successfully deleted task');
                });
        });
    

 
    },
    addComments(recipeId,poster,comment) {
 if (!recipeId) 
 
            return Promise.reject("You must provide a recipe");
        
        if (!poster ) 
            return Promise.reject("You must provide a poster for comment");

            if (!comment) 
            return Promise.reject("You must provide a comment");
            let newComment ={
                _id:uuid(),
                poster: poster,
                comment: comment,

            };
           
    
     return module.exports.getRecipe(recipeId).then((Recipe)=>{

Recipe.comments.push(newComment);
return Recipe;
     }).then((newRecipe)=>{
return module.exports.updateRecipe(recipeId,newRecipe)   ;


})            
                .then(() => {
                    return module.exports.getRecipe(recipeId);
                }).catch((e)=>{console.log(e);});
  



     // com["comments"].push(newComment);
       
    },
    getAllComments(recipeId){
if (!recipeId) 
            return Promise.reject("You must provide an id");
        
  

         return recipes().then((recipesCollection) => {
            return recipesCollection.findOne({_id: recipeId}).then((resultRecipe)=>{
                newObject={"_id":recipeId,"title":resultRecipe.title,"comments":resultRecipe.comments};
            return newObject;

            });
         })}
    ,getComment(commentId) {
        if (!commentId) 
            return Promise.reject("You must provide an id to search for");
     return recipes().then((collection)=>{
return collection.findOne({"comments._id":commentId}).then((collection)=>{
    return collection.title;

}).then((title)=>{
return collection.findOne({"comments._id":commentId},{"comments.$":1}).then((newCollection)=>{
  

newObject={"_id":newCollection.comments[0]._id,"recipeId":newCollection._id,
"recipeTitle":title,"poster":newCollection.comments[0].poster,
"comment":newCollection.comments[0].comment};
return newObject;


})
});

     });
     
    },

updateComment(commentId, recipeId,updatedComment) {
 if (!commentId) 
            return Promise.reject("You must provide an id to search for");
             if (!recipeId) 
            return Promise.reject("You must provide an id to search for");

        return recipes().then((recipesCollection) => {
            let updatedCommentData = {};

            if (updatedComment.poster) {
                updatedCommentData.poster = updatedComment.poster;
            }

            if (updatedComment.comment) {
                updatedCommentData.comment = updatedComment.comment;
            }

            

            let updateCommand = {
                $set: updatedCommentData
            };


           return recipesCollection.update({_id:recipeId,
                "comments._id": commentId
            }, {"$set":{"comments.$":{"_id":commentId,"poster":updatedComment.poster,"comment":
        updatedComment.comment}}}).then((result) => {
                return this.getComment(commentId);
            }).catch((e)=>{console.log(e);});
        });
       
    },
    removeComment(id){

if (!id) 


            return Promise.reject("You must provide an id to search for");
        return recipes().then((recipeCollection) => {
            return recipeCollection.update(
  { },
  { $pull: { comments: { _id: id } } }
)
                .then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        throw(`Could not delete task with id of ${id}`)
                    }
                    else
                    console.log('Successfully deleted task');
                });
        });
    

 
    }


    
}
module.exports = exportedMethods;


