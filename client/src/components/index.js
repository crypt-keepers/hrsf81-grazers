const angular = require('angular');

angular.module('eventHUD').component('app', require('./app.component'));
angular.module('eventHUD').component('signIn', require('./signIn.component'));
angular.module('eventHUD').component('signUp', require('./signUp.component'));
angular.module('eventHUD').component('controlPanel', require('./controlPanel.component'));
angular.module('eventHUD').component('controlPanelItem', require('./controlPanelItem.component'));
angular.module('eventHUD').component('manageEvent', require('./manageEvent.component'));
angular.module('eventHUD').component('staffView', require('./staffView.component'));
angular.module('eventHUD').component('attendeeView', require('./attendeeView.component'));
angular.module('eventHUD').component('eventBroadcast', require('./eventBroadcast.component'));
angular.module('eventHUD').component('messageSend', require('./messageSend.component'));
angular.module('eventHUD').component('messageDisplay', require('./messageDisplay.component'));
angular.module('eventHUD').component('manageGroup', require('./manageGroup.component'));
angular.module('eventHUD').component('eventInformation', require('./eventInformation.component'));
angular.module('eventHUD').component('scheduleDisplay', require('./scheduleDisplay.component'));
angular.module('eventHUD').component('activityCreate', require('./activityCreate.component'));
