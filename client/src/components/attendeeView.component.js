module.exports = {
  bindings: {
    user: '<'
  },
  controller(groups) {
    // TODO: Remove hardcoding when there is proper event creation and management
    this.eventId = 1;
    this.$onInit = function init() {
      groups.getGroup(this.user.id)
        .then((group) => {
          console.log('group is', group);
          this.group = group;
        })
        .catch(console.error);
    };
  },
  templateUrl: 'attendeeView.template.html'
};
