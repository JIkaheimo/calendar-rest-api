const applyYearFilter = (aggr, queriedYear) => {
  // Retrieve year from the saved date.

  aggr
    .addFields({
      year: { $year: '$date' }
    })

    // Match with the given year.
    .match({ year: queriedYear });
};

const applyMonthFilter = (aggr, queriedMonth) => {
  // Retrieve month from the saved date.

  aggr
    .addFields({
      month: { $month: '$date' }
    })

    // Match with the given month.
    .match({ month: queriedMonth });
};

const applyDayFilter = (aggr, queriedDate) => {
  // Retrieve day from the saved date.

  aggr
    .addFields({
      day: { $dayOfMonth: '$date' }
    })

    // Match with the given date
    .match({ day: queriedDate });
};

const applyTimeFilter = (aggr, hour, minute) => {
  // Retrieve hours and minutes from the saved date.

  aggr
    // Get the starting hour and minute.
    .addFields({
      startingHour: { $hour: { date: '$date' } },
      startingMinute: { $minute: '$date' }
    })

    // Match with the given hours and minutes.
    .match({
      $and: [{ startingHour: hour }, { startingMinute: minute }]
    });
};

const applyNameFilter = (aggr, name) => {
  // Get case-insensitive names.

  name = name.toLowerCase();
  aggr
    .addFields({ lowerName: { $toLower: '$name' } })
    .match({ lowerName: { $regex: '.*' + name + '.*' } });
};

module.exports = {
  applyNameFilter,
  applyYearFilter,
  applyMonthFilter,
  applyDayFilter,
  applyTimeFilter
};
