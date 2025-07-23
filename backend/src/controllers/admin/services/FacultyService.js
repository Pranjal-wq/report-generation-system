import { getDB } from "../../../config/mongodb.js";
import { ApplicationError } from "../../../errorHandle/error.js";
import { ObjectId } from "mongodb";
// import TimeTable from "../../../models/TimeTable.model.js";
import bcrypt from "bcryptjs";



/**
 * Service class for handling Faculty CRUD operations
 */
class FacultyService {
    constructor() {
        this.collection = "User";
        this.timetable = "TimeTable";
        this.departments = "Departments";
    }

    async addFaculty(facultyData) {
        const db = await getDB();
        const facultyCollection = await db.collection(this.collection);
        let facultyAdded = [];
        let facultyErrors = [];

        if (!Array.isArray(facultyData)) {
            console.log("Input Must be of the Array Format");
            throw new ApplicationError("Input must be an array of faculty data", 400);
        }

        for (let i = 0; i < facultyData.length; i++) {
            let { empCode, abbreviation, department, email, phone, password, name, role } = facultyData[i];
            let about = "Available";

            try {
                if (!empCode || !abbreviation || !department || !email || !password || !name) {
                    throw new ApplicationError("Please Provide All the Required Data!", 400);
                }

                const existingFaculty = await facultyCollection.findOne({
                    $or: [
                        { empCode: empCode },
                        { abbreviation: abbreviation },
                        { email: email }
                    ]
                });

                if (existingFaculty) {
                    let takenFields = [];
                    if (existingFaculty.empCode === empCode) {
                        takenFields.push(`Employee Code '${empCode}'`);
                    }
                    if (existingFaculty.email === email) {
                        takenFields.push(`Email '${email}'`);
                    }
                    if (existingFaculty.abbreviation === abbreviation) {
                        takenFields.push(`Abbreviation '${abbreviation}'`);
                    }

                    const errorMessage = `${takenFields.join(', ')} ${takenFields.length > 1 ? 'are' : 'is'} already taken`;
                    
                    facultyErrors.push({
                        name: name,
                        email: email,
                        employeeCode: empCode,
                        abbreviation: abbreviation,
                        error: errorMessage
                    });
                    continue;
                }

                const hashedPassword = await bcrypt.hash(password, 15);

                const newFaculty = {
                    name,
                    empCode,
                    abbreviation,
                    department,
                    email,
                    phone,
                    about,
                    password: hashedPassword,
                    role: role || "faculty",
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                const result = await facultyCollection.insertOne(newFaculty);
                
                // Create and insert a default timetable for the newly added faculty
                const TimeTableCollection = await db.collection(this.timetable);
                const defaultTimeTable = {
                    ownerId: result.insertedId,
                    TimeTable: {
                        "1": [], "2": [], "3": [], "4": [], "5": [], "6": [], "7": []
                    },
                    assignedToMe: { "1": [], "2": [], "3": [], "4": [], "5": [], "6": [], "7": [] },
                    meAssignedToOther: { "1": [], "2": [], "3": [], "4": [], "5": [], "6": [], "7": [] },
                    request: [],
                    meRequestedOther: []
                };

                await TimeTableCollection.insertOne(defaultTimeTable);

                facultyAdded.push({
                    name: newFaculty.name,
                    email: newFaculty.email,
                    employeeCode: newFaculty.empCode,
                    abbreviation: newFaculty.abbreviation,
                });

            } catch (error) {
                facultyErrors.push({
                    name: name,
                    email: email,
                    employeeCode: empCode,
                    abbreviation: abbreviation,
                    error: error.message
                });
            }
        }

        return {
            success: facultyAdded,
            errors: facultyErrors
        };
    }

    async getFaculty(filter) {
        const { department, name, employeeCode, role } = filter;
        const db = await getDB();
        const facultyCollection = await db.collection(this.collection);

        // build query only with provided fields
        const query = {};
        if (department) query.department = department;
        if (name) query.name = name;
        if (employeeCode) query.empCode = employeeCode;
        if (role) query.role = role;

        // execute and return array of matches
        const result = await facultyCollection.find(query).toArray();

        
        return result;
    }

    async updateFaculty(facultyData) {
        const db = await getDB();
        const { id, toModify } = facultyData;
        const facultyCollection = await db.collection(this.collection);
        
        if (!id || !toModify) {
            throw new ApplicationError("ID and modification data are required", 400);
        }

        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            throw new ApplicationError("Invalid faculty ID format", 400);
        }

        // Hash password if it's being updated
        if (toModify.password) {
            toModify.password = await bcrypt.hash(toModify.password, 15);
        }

        // Add updatedAt timestamp
        toModify.updatedAt = new Date();

        const result = await facultyCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: toModify }
        );

        if (result.matchedCount === 0) {
            throw new ApplicationError("Faculty not found", 404);
        }

        return { modified: result.modifiedCount > 0 };
    }



    






}

export default FacultyService;