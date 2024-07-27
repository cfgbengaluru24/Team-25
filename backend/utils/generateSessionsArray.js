function generateSessionsApplied() {
  const sessions = [];
  const currentDate = new Date();
  for (let i = 0; i < 30; i++) {
    const sessionDate = new Date(currentDate);
    sessionDate.setUTCDate(currentDate.getUTCDate() + i);
    sessionDate.setUTCHours(0, 0, 0, 0);
    sessions.push({
      date: sessionDate.toISOString().split("T")[0],
    });
  }
  return sessions;
}

export default generateSessionsApplied;
