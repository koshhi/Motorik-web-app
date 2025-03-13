import { useState, useEffect } from 'react';

const roundTimeToNearestHalfHour = () => {
  const now = new Date();
  const minutes = now.getMinutes();
  if (minutes > 0 && minutes <= 30) {
    now.setMinutes(30);
  } else {
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
  }
  now.setSeconds(0);
  return now.toTimeString().slice(0, 5);
};

const adjustEndTime = (startTime) => {
  const [hours, minutes] = startTime.split(':');
  const endTime = new Date();
  endTime.setHours(parseInt(hours, 10) + 1);
  endTime.setMinutes(parseInt(minutes, 10));
  return endTime.toTimeString().slice(0, 5);
};

const useDateTimeSync = (initialStartTime) => {
  const initialTime = initialStartTime || roundTimeToNearestHalfHour();
  const [startTime, setStartTime] = useState(initialTime);
  const [endTime, setEndTime] = useState(() => adjustEndTime(initialTime));
  const [startDay, setStartDay] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDay, setEndDay] = useState(() => new Date().toISOString().split('T')[0]);
  const [isEndDayChanged, setIsEndDayChanged] = useState(false);
  const [isEndTimeChanged, setIsEndTimeChanged] = useState(false);

  useEffect(() => {
    if (!isEndDayChanged && endDay !== startDay) {
      setEndDay(startDay);
    } else if (new Date(endDay) < new Date(startDay)) {
      setEndDay(startDay);
      setIsEndDayChanged(false);
    }
  }, [startDay, endDay, isEndDayChanged]);

  useEffect(() => {
    const startDT = new Date(`${startDay}T${startTime}`);
    const endDT = new Date(`${endDay}T${endTime}`);
    if (!isEndTimeChanged) {
      setEndTime(adjustEndTime(startTime));
    } else if (endDT <= startDT) {
      setEndTime(adjustEndTime(startTime));
      setIsEndTimeChanged(false);
    }
  }, [startTime, startDay, endDay, isEndTimeChanged, endTime]);

  return {
    startDay,
    setStartDay,
    endDay,
    setEndDay,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    setIsEndDayChanged,
    setIsEndTimeChanged
  };
};

export default useDateTimeSync;
