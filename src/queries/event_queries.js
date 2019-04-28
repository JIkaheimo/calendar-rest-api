const applyYearFilter = (aggr, queriedYear) => {
  // Retrieve year from the saved date
  aggr.addFields({
    year: { $year: '$date' }
  });

  // Match with the given year
  aggr.match({ year: queriedYear });
};

const applyMonthFilter = (aggr, queriedMonth) => {
  // Retrieve month from the saved date
  aggr.addFields({
    month: { $month: '$date' }
  });

  // Match with the given month
  aggr.match({ month: queriedMonth });
};

const applyDayFilter = (aggr, queriedDate) => {
  // Retrieve day from the saved date
  aggr.addFields({
    day: { $dayOfMonth: '$date' }
  });

  // Match with the given date
  aggr.match({ day: queriedDate });
};

const applyTimeFilter = (aggr, hour, minute) => {
  // Retrieve hours and minutes from the saved date.
  aggr
    .addFields({
      startingHour: { $hour: { date: '$date' } },
      startingMinute: { $minute: '$date' }
    })
    .match({
      $and: [
        {
          startingHour: hour
        },
        { startingMinute: minute }
      ]
    });
};

/*
    .addFields({
      endingHour: { $add: ['$startingHour', '$durationInHours'] }
    })
    */
/*
  .match({
    $and: [
      {
        startingHour: { $lte: time.hour() }
      },
      {
        endingHour: { $gte: time.hour() }
      }
    ]
  });
  */

module.exports = {
  applyYearFilter,
  applyMonthFilter,
  applyDayFilter,
  applyTimeFilter
};
