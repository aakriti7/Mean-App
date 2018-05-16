const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const data = require("./data");
const recipesData = data.recipes;
app.use('/', express.static(__dirname + '/'));
app.use(bodyParser.json());

app.get("/recipes/:id", (req, res) => {
    recipesData.getRecipe(req.params.id).then((post) => {
        res.render('index.html');
    }).catch(() => {
        res.status(404).json({ error: "Recipe not found" });
    });
});



app.get("/recipes", (req, res) => {
    recipesData.getAllRecipes().then((recipeList) => {
      res.send(recipeList);
      
    }).catch((e) => {
        res.status(500).json({ error: e });
    });
});

app.post("/", (req, res) => {
    let recipeBody = req.body;
console.log(recipeBody.title);
    recipesData.addRecipes(recipeBody.title, recipeBody.ingredients,recipeBody.steps)
        .then((newRecipe) => {
            res.send(newRecipe);
           
        }).catch((e) => {
            res.status(500).json({ error: e });
        });
});

app.put("/:id", (req, res) => {
    let updatedData = req.body;

    let getRecipe = recipesData.getRecipe(req.params.id);

    getRecipe.then(() => {
        return recipesData.updateRecipe(req.params.id, updatedData)
            .then((updatedRecipe) => {
                res.json(updatedRecipe);
            }).catch((e) => {
                res.status(500).json({ error: e });
            });
    }).catch((e) => {
console.log(e);
        res.status(404).json({ error: "Recipe not found" });
    });

});

app.delete("/:id", (req, res) => {
    let getRecipe = recipesData.getRecipe(req.params.id);

    getRecipe.then(() => {
        return recipesData.removeRecipe(req.params.id)
            .then(() => {
                res.sendStatus(200);
            }).catch((e) => {
                res.status(500).json({ error: e });
            });
    }).catch(() => {
        res.status(404).json({ error: "Recipe not found" });
    });
});


app.get('*', function(req, res) {
		res.sendFile(__dirname+'/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});









    app.listen(3000, function() {
  console.log('listening on 3000')
});