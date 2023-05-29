export const formatNumberToMetric = number => {
  const suffixes = ['', 'k', 'M', 'B', 'T'];
  let suffixNum;
  if (number > 1000000) {
    suffixNum = Math.floor(('' + number).length / 3);
  } else {
    suffixNum = Math.floor(('' + number).length / 4);
  }
  const shortValue = parseFloat(
    (suffixNum !== 0 ? number / Math.pow(1000, suffixNum) : number).toPrecision(
      2,
    ),
  );
  return shortValue + suffixes[suffixNum];
};

export function timeToMetric(timeString) {
  const currentTime = new Date();
  const time = new Date(timeString);
  const diffInMs = currentTime - time;

  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  if (diffInMs < msPerMinute) {
    return 'just now';
  } else if (diffInMs < msPerHour) {
    const minutesAgo = Math.round(diffInMs / msPerMinute);
    return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
  } else if (diffInMs < msPerDay) {
    const hoursAgo = Math.round(diffInMs / msPerHour);
    return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
  } else if (diffInMs < msPerMonth) {
    const daysAgo = Math.round(diffInMs / msPerDay);
    return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
  } else if (diffInMs < msPerYear) {
    const monthsAgo = Math.round(diffInMs / msPerMonth);
    return `${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;
  } else {
    const yearsAgo = Math.round(diffInMs / msPerYear);
    return `${yearsAgo} year${yearsAgo > 1 ? 's' : ''} ago`;
  }
}

export const convertSecondsToTime = totalSeconds => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const formattedTime = [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');
  return formattedTime;
};

export const convertSecondsToTimeAssume = totalSeconds => {
  if (totalSeconds < 60) {
    return `${totalSeconds} sec`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) {
    return `${hours} hrs`;
  } else {
    return `${minutes} mins`;
  }
};
