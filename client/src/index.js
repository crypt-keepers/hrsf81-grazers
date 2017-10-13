const angular = require('angular');
require('angular-animate');
require('angular-aria');
require('angular-messages');
require('angular-material');

angular.module('eventHUD', ['ngRoute', 'ngMaterial'])
  .config(($routeProvider, $locationProvider) => {
    $routeProvider
      .when('/', {
        template: '<sign-in sign-in="$resolve.signIn" sign-up="$resolve.signUp"></sign-in>',
        resolve: {
          signIn: signin => signin.submit(),
          signUp: signin => signin.signUpRedirect()
        }
      })
      .when('/signup', {
        template: '<sign-up sign-up="$resolve.signUp"></sign-up>',
        resolve: {
          signUp: signin => signin.signUp()
        }
      })
      .when('/organizer', {
        template: '<manage-event user="$resolve.user"></manage-event>',
        resolve: {
          user: signin => signin.getUser()
        }
      })
      .when('/staff', {
        template: '<staff-view user="$resolve.user"></staff-view>',
        resolve: {
          user: signin => signin.getUser()
        }
      })
      .when('/attendee', {
        template: '<attendee-view user="$resolve.user"></attendee-view>',
        resolve: {
          user: signin => signin.getUser()
        }
      })
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });

require('./components');
require('./services');
