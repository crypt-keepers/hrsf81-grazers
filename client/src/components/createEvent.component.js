module.exports = {
  bindings: {
    user: '<',
    redirect: '<',
  },

  controller($http, $scope) {
    $scope.startDate = new Date();
    $scope.endDate = new Date();
    this.groups = [];

    $scope.form = {
      name: '',
      group: '',
      location: '',
    };

    this.addGroup = () => {
      this.groups.push($scope.form.group);
      $scope.form.group = '';
    };

    this.handleEventClick = () => {
      const obj = {
        start_date: $scope.startDate.toString(),
        end_date: $scope.endDate.toString(),
        location: $scope.form.location,
        groups: this.groups,
        organizer_id: this.user.id,
        name: $scope.form.name,
      };

      $http.post('/event', obj)
        .then(response => response.data)
        .then((data) => {
          this.user.event = data.name;
          this.user.event_id = data.event_id;
          this.user.eventStart = obj.start_date;
          this.user.eventEnd = obj.end_date;
          this.redirect(this.user);
        })
        .catch((err) => {
          throw err;
        });
    };
  },
  templateUrl: 'createEvent.template.html'
};
