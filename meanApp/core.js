var app = angular.module('myApp', []);

function mainController($scope, $http) {
    $scope.formData = {};
    $scope.recipes=[];

    // when landing on the page, get all todos and show them

    
    $http.get('/recipes')
        .success(function(data) {
            $scope.recipes = data;
            console.log("Hii");
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.addRecipe = function() {
        let reqData={title:$scope.title,ingredients:$scope.ingredients,steps:$scope.steps};
        $http.post('/', reqData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another

                $scope.recipes.push(data);
               
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
$scope.title='';
$scope.ingredients='';
$scope.steps='';

    };

    // delete a todo after checking it
    $scope.deleteRecipe = function(id) {
        $http.delete('/:id' + id)
            .success(function(data) {
                $scope.recipes.re;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}
