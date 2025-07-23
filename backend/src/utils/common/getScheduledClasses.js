import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

// function getWeekday(weekday) {
//   const weekdays = {
//     monday: 1,
//     tuesday: 2,
//     wednesday: 3,
//     thursday: 4,
//     friday: 5,
//     saturday: 6,
//   };
//   return weekdays[weekday.toLowerCase()] || 0;
// }

export const getScheduledClasses = async (
  ownerId,
  subjectId,
  startDate,
  presentDate
) => {
 
  const startDateObj = new Date(startDate);
  const presentDateObj = new Date(presentDate);

  const db = getDB();

  console.log(ownerId.toString(), subjectId);

  const attendance = await db
    .collection("Attendance")
    .find({
      ownerId: ownerId.toString(),
      subjectId: subjectId,
    })
    .toArray();

  if (!attendance || attendance.length === 0) {
    console.error("Attendance Record not found for this subjectId and ownerId","Error in the GetScheduledClasses function");
    return 0;
  }

  let result = 0;

  attendance.forEach((record) => {
    if (record.attendance && Array.isArray(record.attendance)) {
      record.attendance.forEach((entry) => {
        const dateObj = new Date(entry.date);

        
        if (dateObj >= startDateObj && dateObj <= presentDateObj) {
          result++;
        }
      });
    }
  });

  return result;
};
