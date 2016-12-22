(function() {
    'use strict';
    var app = angular.module('pokedexApp', [
        'mgcrea.ngStrap',
        'ngAnimate',
        'ngSanitize',
        "ui.router",
        "ngResource"
    ]);

    app.config(function($stateProvider, $locationProvider, $urlRouterProvider) {

        // $locationProvider.html5Mode({
        //   enabled: true,
        //   requireBase: false
        // })
        // .hashPrefix("!");


        $urlRouterProvider.otherwise('/pokemons');

        $stateProvider
            .state('pokemons', {
                resolve: {
                    fetchPokemonsList: ["DataService", function(DataService) {
                            return DataService.getPokemonsList(6);
                        }]
                        // fetchUsers: ["DataService", function(DataService) {
                        //     return DataService.getUsers();
                        // }]
                },
                url: '/pokemons',
                templateUrl: 'views/pokemonsListView.html',
                controller: 'pokemonsListController'
            })
            .state('pokemons/favorite', {
                resolve: {
                    // fetchUsers: ["DataService", function(DataService) {
                    //     return DataService.getUsers();
                    // }]
                },
                url: '/pokemons/favorite',
                // templateUrl: 'views/usersView.html',
                // controller: 'UsersController'
            });

    });

    // Data Service
    app.service("DataService", ['$http', function($http) {

        // Interface
        var serviceBase = 'http://pokeapi.co/api/v1/pokemon/?limit='
        var Service = {
            pokemonsListData: null,
            pokemonsFavoriteListData: null
        };


        // Timeshit API
        // Get timeshit
        Service.getPokemonsList = function(limit) {
            // if (Service.pokemonsListData == null) {
              console.log(limit);
                return $http.get(serviceBase + limit).success(function(data) {
                    Service.pokemonsListData = data;
                    return data
                });
            // }
        };

        // Users API


        return Service;
    }]);

    var pokemonsListController = function(DataService, $scope) {
        $scope.contentLoaded = false;
        $scope.pokemonsList = DataService.pokemonsListData.objects;
        $scope.limit = 6;
        $scope.contentLoaded = true
        var pokemons = $scope.pokemonsList;
        pokemons = pokemons.map(buildPokemon);


        function buildPokemon(pokemon) {
            var partes = pokemon.resource_uri.split('/');
            var id = partes[partes.length - 2];
            pokemon.id = parseInt(id);
            var name = '';
            if (!pokemon.name) {
                name = pokemon.to.toLowerCase();
            } else {
                name = pokemon.name.toLowerCase();
            }
            pokemon.img = "https://img.pokemondb.net/sprites/black-white/normal/" + name + ".png"
            return pokemon;
        }

        $scope.loadMore = function () {
          console.info("Loading");
          $scope.limit += 6;
          console.info($scope.limit);
          DataService.getPokemonsList($scope.limit);
          // console.table(DataService.pokemonsListData.objects);
          $scope.pokemonsList = DataService.pokemonsListData.objects;
          var pokemons = $scope.pokemonsList;
          pokemons = pokemons.map(buildPokemon);
        }

        // console.table($scope.pokemonsList);

    }



    app.controller('pokemonsListController', pokemonsListController);
    pokemonsListController.$inject = ['DataService', '$scope'];

})();

// angular.module('pokedexApp', ['mgcrea.ngStrap']);
