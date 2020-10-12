"use strict";

var app = angular.module("app", []);

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
  // get Event info
  this.getEvent = function (date) {
    const filterData = DEMO_EVENTS.filter(function (item) {
      return moment(item.time.format()).isSame(date.format());
    });

    if (filterData && filterData.length > 0) {
      // get average blood sugar
      const averageBloodSugar = Math.floor(
        filterData
          .map(function (item) {
            return item.value;
          })
          .reduce(function (a, b) {
            return a + b;
          }) / filterData.length
      );

      // get event range percent
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

  // get period
  const getPeriod = function (currentDate,prevDate) {
    $scope.currentPeriod = currentDate;
    $scope.currentDayEvent = eventService.getEvent(currentDate);
    $scope.prevDayEvent = eventService.getEvent(prevDate);
  };

  getPeriod(moment(),moment().subtract(1, "day"));

  $scope.nextDay = function () {    
    const date=moment($scope.currentPeriod.format()).add(1, "day");
    const prevDay=$scope.currentPeriod;  
    getPeriod(date,prevDay);
  };

  $scope.prevDay = function () {
    const date=moment($scope.currentPeriod.format()).subtract(1, "day");
    const prevDay=moment($scope.currentPeriod.format()).subtract(2, "day");
    getPeriod(date,prevDay);

  };


  
});
