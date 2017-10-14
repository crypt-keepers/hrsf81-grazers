function signIn($location) {
  this.user = null;

  this.getUser = () => this.user;

  this.submit = () => (
    (user, signupRedirect) => {
      if (signupRedirect) {
        $location.path('/signup');
      } else {
        this.user = user;
        $location.path(`/${this.user.role}`);
      }
    }
  );

  this.signUpRedirect = () => (
    () => {
      $location.path('/signup');
    }
  );

  this.createEventRedirect = () => (
    (user) => {
      this.user = user;
      $location.path('/organizer');
    }
  );

  this.signUp = () =>
    (userData) => {
      this.user = userData;
      if (this.user.role !== 'organizer') {
        $location.path(`/${this.user.role}`);
      } else {
        $location.path('/create');
      }
    };
}

module.exports = signIn;
