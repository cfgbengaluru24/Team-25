function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function calculateCartesianDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = degreesToRadians(lat1);
  const φ2 = degreesToRadians(lat2);
  const Δφ = degreesToRadians(lat2 - lat1);
  const Δλ = degreesToRadians(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance;
}

function getDistance(x1, y1, x2, y2) {
  const distance = calculateCartesianDistance(y1, x1, y2, x2);
  return distance;
}

export default getDistance;
