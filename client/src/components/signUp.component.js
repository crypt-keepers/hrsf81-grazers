module.exports = {
  bindings: {
    signUp: '<',
  },
  controller($http, $scope) {
    this.user = 'Test';
    this.conferences = [{ name: 'test conference', id: 1 }, { name: 'test2 conference', id: 2 }];
    this.roles = [{ name: 'organizer', id: 1 }, { name: 'staff', id: 2 }, { name: 'attendee', id: 3 }];
    this.jobs = [{ name: 'volunteers', id: 1 }, { name: 'greeters', id: 2 }, { name: 'attendee', id: 3 }];

    this.loadConferences = () => {
      console.log('loading conferences');
    };

    this.loadRoles = () => {
      console.log('loading roles');
    };

    $scope.form = {
      firstname: '',
      lastname: '',
      password: '',
      conference: '',
      role: '',
      email: '',
    };
    this.handleClick = () => {
      $scope.form.conference = JSON.parse($scope.form.conference).name;
      // FIXME: Need to include staff/organizer role and job
      $scope.form.role = JSON.parse($scope.form.role).name;
      $scope.form.job = JSON.parse($scope.form.job).name;
      $http.post('/user', $scope.form)
        .then(response => response.data)
        .then((data) => {
          const userData = Object.assign(
            {},
            $scope.form,
            { id: data.userId, group_id: data.groupId }
          );
          this.signUp(userData);
        })
        .catch((err) => {
          // TODO: This email is already taken, try again.
          console.log('err is', err);
        });

    };

    // this.loadUsers = () =>
    // $http({
    //   method: 'GET',
    //   url: '/users'
    // })
    // .then(response => response.data)
    // .then((users) => {
    //   this.users = users;
    // })
    // .catch(console.error);

  },
  templateUrl: 'signUp.template.html'
};
