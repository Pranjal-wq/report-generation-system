import { getDB } from "../../../config/mongodb.js";
import { ApplicationError } from "../../../errorHandle/error.js";
import { ObjectId } from "mongodb";

/**
 * Time Table service provides the features of viewing the timetables of the faculties according to the departments 
 * API enpoints 
 *   - getTimetable,UpdateTimetable
 * Validations - While adding the particular subject to the timetable of the faculty validate it 
 * Dependencies - If a subject gets added to the timetable of a faculty then corresponding attendance record must be created in the attendance collection 
 * 
 */
class TimetableService {
    constructor() {
        this.collection = "TimeTable",
            this.attendance = "Attendance",
            this.faculty = "User",
            this.subjects = "Subject"
    }
    /**
     * Gets the timetable for a specific faculty member
     * @param {Object} data - The request data containing ownerId
     * @param {string} data.ownerId - The faculty member's ID
     * @returns {Promise<Object>} The timetable data with ownerId and timetable
     * @throws {ApplicationError} When faculty ID is missing or timetable not found
     */
    async getTimetable(data) {
        // Validate ownerId from input data
        if (!data || !data.ownerId) {
            throw new ApplicationError("Faculty ID is needed", 400);
        }
        const ownerId = new ObjectId(data.ownerId); // Convert to ObjectId after validation

        console.log(ownerId);
        //Now Obtain the fauclty time table from the tiime table collectiomn
        const db = await getDB();
        const timetableArray = await db.collection(this.collection).find({ ownerId: ownerId }).toArray();

        // Correctly check if timetable was found
        if (!timetableArray || timetableArray.length === 0) {
            console.log("Wait ! Time Table Not Found for ownerId:", data.ownerId);
            throw new ApplicationError("Time Table Not Found", 404);
        }

        const timetableDocument = timetableArray[0];

        // Ensure the TimeTable field (capital T) exists in the document
        if (!timetableDocument.TimeTable) {
            console.log("TimeTable field missing in the document for ownerId:", data.ownerId);
            throw new ApplicationError("Time Table data is malformed or missing in the record", 404);
        }

        // Use the correct field name "TimeTable"
        let result = { ownerId: ownerId.toString(), timetable: timetableDocument.TimeTable };
        return result;

    }    async UpdateTimeTable(data) {
        let { ownerId, timetable } = data;
       
        console.log("This is the timetable : ",timetable,"\n");
        if (!ownerId) {
            throw new ApplicationError("Faculty ID is required", 400);
        }
        const db = await getDB();
        const ownerIdAsObjectId = new ObjectId(ownerId); // Use a distinct variable name for the ObjectId
        console.log("This is the ownerId : " , ownerIdAsObjectId,"\n");

        // Process timetable to ensure subject _id values are ObjectIds
        const processedTimetable = {};
        for (const [day, daySchedule] of Object.entries(timetable)) {
            if (Array.isArray(daySchedule)) {
                processedTimetable[day] = daySchedule.map(slot => {
                    if (slot.subject && slot.subject._id) {
                        // Convert subject _id to ObjectId if it's not already
                        const subjectId = slot.subject._id.$oid || slot.subject._id;
                        return {
                            ...slot,
                            subject: {
                                ...slot.subject,
                                _id: new ObjectId(subjectId)
                            }
                        };
                    }
                    return slot;
                });
            } else {
                processedTimetable[day] = daySchedule;
            }
        }

        // Update the timetable
        // Ensure we are updating the 'TimeTable' field (uppercase T) to be consistent with getTimetable
        // First find the document to check if it exists
        const existingDocument = await db.collection(this.collection)
            .findOne({ ownerId: ownerIdAsObjectId });
        
        if (!existingDocument) {
            throw new ApplicationError("Time Table Not Found for the given ownerId", 404);
        }
        
        // Then perform the update with processed timetable
        const updateResult = await db.collection(this.collection)
            .updateOne(
            { ownerId: ownerIdAsObjectId },
            { $set: { TimeTable: processedTimetable } }
            );        
        if (updateResult.matchedCount === 0) {
            throw new ApplicationError("Time Table Not Found for the given ownerId, update failed.", 404);
        }
          // Get the updated document to return
        const updatedDocument = await db.collection(this.collection)
            .findOne({ ownerId: ownerIdAsObjectId });

        // Extract all unique subjects from the 'processedTimetable' (which has ObjectId converted)
        const subjectsInTimetable = new Set();
        const subjectDetails = new Map();

        Object.values(processedTimetable).forEach(daySchedule => {
            if (Array.isArray(daySchedule)) {
                daySchedule.forEach(slot => {
                    if (slot.subject && slot.subject._id) {                        // Since we already converted to ObjectId above, extract the string representation
                        const subjectId = slot.subject._id.toString();
                        subjectsInTimetable.add(subjectId);
                        subjectDetails.set(subjectId, {
                            subjectId: slot.subject._id, // Already an ObjectId
                            section: slot.section,
                            session: slot.session,
                            semester: slot.semester,
                            branch: slot.branch,
                            course: slot.course
                        });
                    }
                });
            }
        });

        // Check existing attendance records for this owner
        const existingAttendance = await db.collection(this.attendance)
            .find({ ownerId: ownerIdAsObjectId }) // Use ownerIdAsObjectId for querying
            .toArray();

        const existingSubjectIds = new Set(
            existingAttendance.map(record => record.subjectId.toString())
        );

        // Create attendance records for subjects that don't have them
        const newAttendanceRecords = [];
        for (const [subjectId, details] of subjectDetails) {
            if (!existingSubjectIds.has(subjectId)) {
                newAttendanceRecords.push({
                    ownerId: ownerIdAsObjectId.toString(), // Use ownerIdAsObjectId here
                    subjectId: details.subjectId.toString(),
                    section: details.section,
                    session: details.session,
                    semester: details.semester,
                    branch: details.branch,
                    course: details.course,
                    attendance: [],
                    isMarked: []
                });
            }        }

        // Insert new attendance records if any
        if (newAttendanceRecords.length > 0) {
            await db.collection(this.attendance).insertMany(newAttendanceRecords);
        }

        return updatedDocument;
   }

    async getDepartmentWiseSubjects() {
        const db = await getDB();
        const pipeline = [
            {
                "$group": {
                    "_id": "$department",
                    "subjects": {
                        "$push": {
                            "_id": "$_id",
                            "subjectCode": "$subjectCode",
                            "subjectName": "$subjectName",
                            "isElective": "$isElective"
                        }
                    }
                }
            }
        ];
        const result = await db.collection(this.subjects).aggregate(pipeline).toArray();
        if (!result || result.length === 0) {
            throw new ApplicationError("No department-wise subjects found", 404);
        }
        return result;
    }
    /**
     * Deletes a subject from the timetable of a specific faculty member for a given day.
     * @param {Object} data - The request data containing ownerId, day, subjectId
     * @param {string} data.ownerId - The faculty member's ID
     * @param {string} data.day - The day from which to delete the subject
     * @param {string} data.subjectId - The subject ID to delete
     * @returns {Promise<Object>} The updated timetable data
     * @throws {ApplicationError} When inputs are missing or deletion fails
     */
    async deleteSubject(data) {
        const { ownerId, day, subjectId } = data;
        if (!ownerId || !day || !subjectId) {
            throw new ApplicationError("ownerId, day and subjectId are required", 400);
        }
        const db = await getDB();
        const ownerObjId = new ObjectId(ownerId);
        const subjObjId = new ObjectId(subjectId);

        // Verify timetable exists for owner
        const existingDoc = await db.collection(this.collection)
            .findOne({ ownerId: ownerObjId });
        if (!existingDoc) {
            throw new ApplicationError("Time Table not found for the given ownerId", 404);
        }
        // Verify the day schedule exists
        if (!existingDoc.TimeTable || !Array.isArray(existingDoc.TimeTable[day])) {
            throw new ApplicationError(`No schedule found for day: ${day}`, 404);
        }
        // Remove the subject from the specified day's array
        const updateResult = await db.collection(this.collection)
            .updateOne(
                { ownerId: ownerObjId },
                { $pull: { [`TimeTable.${day}`]: { "subject._id": subjObjId } } }
            );
        if (updateResult.matchedCount === 0) {
            throw new ApplicationError("Time Table not found for the given ownerId", 404);
        }
        if (updateResult.modifiedCount === 0) {
            throw new ApplicationError("Subject not found in the timetable for the given day", 404);
        }
        // Return the updated timetable
        const updatedDoc = await db.collection(this.collection)
            .findOne({ ownerId: ownerObjId });
        return { ownerId: ownerId, timetable: updatedDoc.TimeTable };
    }
}

export default TimetableService;