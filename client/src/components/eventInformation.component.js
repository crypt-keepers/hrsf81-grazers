module.exports = {
  bindings: {
    group: '<',
    user: '<'
  },
  controller($http) {
    this.displayedSchedule = 'event';
    this.event = {};
    console.log('in event info');

    this.getSchedule = (eventId, groupId) => {
      const options = groupId
        ? { method: 'GET', url: `/schedule/${eventId}/${groupId}` }
        : { method: 'GET', url: `/schedule/${eventId}` };
      return $http(options)
        .then(response => response.data)
        .catch(console.error);
    };

    this.$onInit = function init() {
      $http({
        method: 'GET',
        url: `/event/${this.user.event_id}`
      })
        .then((response) => {
          this.event = response.data;
          this.event.startdateReadable = new Date(this.event.startdate).toDateString();
          this.event.enddateReadable = new Date(this.event.enddate).toDateString();
          return this.getSchedule(this.user.event_id);
        })
        .then((schedule) => {
          this.eventSchedule = schedule;
        })
        .catch(console.error);
    };

    this.$onChanges = (changesObj) => {
      if (changesObj.group.currentValue) {
        this.getSchedule(this.user.event_id, this.group.id)
          .then((schedule) => {
            this.groupSchedule = schedule;
            this.displayedSchedule = schedule ? 'group' : 'event';
          })
          .catch(console.error);
      }
    };

    this.showSchedule = (scheduleType) => {
      this.displayedSchedule = scheduleType;
    };
  },
  templateUrl: 'eventInformation.template.html'
};
