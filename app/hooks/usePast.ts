import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "../redux/store";

import {
  setActiveMonth,
  ActiveMonthT,
  ActivityT,
} from "../redux/features/strava-slice";
import moment from "moment";

export const usePast = () => {
  const athlete = useAppSelector((state) => state.stravaData.athlete);
  const activities = useAppSelector((state) => state.stravaData.activities);
  const activeMonth = useAppSelector((state) => state.stravaData.activeMonth);

  const dispatch = useDispatch<AppDispatch>();

  const changeMonth = (month: ActiveMonthT) => {
    dispatch(setActiveMonth(month));
  };

  const isWithinLast3Months = (dateString: Date) => {
    const currentDate = new Date();
    const activityDate = new Date(dateString);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

    return activityDate >= threeMonthsAgo && activityDate <= currentDate;
  };

  const filteredActivities = activities.filter((activity: ActivityT) => {
    if (activeMonth.name === null) {
      // Keep all activities if activeMonth.name is null
      return isWithinLast3Months(activity.start_date_local);
    }

    // Extract the month number from the activity's start_date_local
    const activityMonth = moment(activity.start_date_local).month() + 1; // Adding 1 because getMonth() returns 0-based index

    // Compare the month number with the activeMonth id
    return activityMonth === activeMonth.id;
  });

  const reducedActivities = filteredActivities.reduce(
    (accumulator: any, activity: any) => {
      accumulator.distance += activity.distance;
      accumulator.total_elevation_gain += activity.total_elevation_gain;
      accumulator.moving_time += activity.moving_time;
      return accumulator;
    },
    {
      name: activeMonth.name === null ? "Last 3 months" : activeMonth.name,
      distance: 0,
      total_elevation_gain: 0,
      moving_time: 0,
    }
  );

  return {
    athlete,
    activeMonth,
    changeMonth,
    filteredActivities,
    reducedActivities,
  };
};
