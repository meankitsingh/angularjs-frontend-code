"use strict";

var app = angular.module("app", []);

// event service
app.service("eventService", function () {
  const DEMO_EVENTS = [
    { value: 100, time: moment() },
    { value: 155, time: moment() },
    { value: 83, time: moment() },
    { value: 211, time: moment().subtract(1, "day") },
    { value: 138, time: moment().subtract(1, "day") },
    { value: 55, time: moment().subtract(1, "day") },
    { value: 183, time: moment().subtract(2, "day") },
    { value: 103, time: moment().subtract(2, "day") },
    { value: 98, time: moment().subtract(3, "day") },
  ];
  // filter data based on range
  function filterRange(arr, a, b) {
    return arr.filter((item) => a <= item.value && item.value <= b);
  }
  // get Event info based on date
  this.getEvent = function (date) {
    // filter all the data based on date
    const filterData = DEMO_EVENTS.filter(function (item) {
      return moment(item.time.format()).isSame(date.format());
    });

    if (filterData && filterData.length > 0) {
      // calculate average blood sugar
      const averageBloodSugar = Math.floor(
        filterData
          .map(function (item) {
            return item.value;
          })
          .reduce(function (a, b) {
            return a + b;
          }) / filterData.length
      );

      // calculate event range percent
      const eventRangePercent = Math.floor(
        (filterRange(filterData, 70, 180).length / filterData.length) * 100
      );

      return {
        totalEvents: filterData.length,
        averageBloodSugar: averageBloodSugar,
        rangePercent: eventRangePercent,
      };
    }
    return null;
  };
});

app.controller("appController", function ($scope, eventService) {
  var ctrl = this;

  $scope.currentPeriod = moment();
  $scope.currentDayEvent = eventService.getEvent($scope.currentPeriod);
  $scope.prevDayEvent = eventService.getEvent($scope.currentPeriod);

  $scope.displayFormatDate = function () {
    return $scope.currentPeriod.format("ddd, D MMM YYYY");
  };

  $scope.next = function () {
    $scope.currentPeriod = $scope.currentPeriod.add(1, "day");
    $scope.currentDayEvent = eventService.getEvent($scope.currentPeriod);
    $scope.prevDayEvent = eventService.getEvent($scope.currentPeriod);
  };

  $scope.prev = function () {
    $scope.currentPeriod = $scope.currentPeriod.subtract(1, "day");
    $scope.currentDayEvent = eventService.getEvent($scope.currentPeriod);
    $scope.prevDayEvent = eventService.getEvent($scope.currentPeriod);
  };
});
