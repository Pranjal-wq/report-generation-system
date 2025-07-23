import { getDB } from "../../../config/mongodb.js";
import { ApplicationError } from "../../../errorHandle/error.js";
import { ObjectId } from "mongodb";


class SubjectService{
     constructor()
     {
        this.collection="Subject";
        this.department="Departments";

     }

    async addSubject(subjectData) {
        const db = await getDB();
        const subjectCollection = db.collection(this.collection);
        const departmentCollection = db.collection(this.department);
        let subjectsAdded = [];
        let subjectErrors = [];

        if (!Array.isArray(subjectData)) {
            throw new ApplicationError("Input must be an array of subject data", 400);
        }

        for (let i = 0; i < subjectData.length; i++) {
            let { subjectCode, subjectName, department, isElective } = subjectData[i];

            try {
                if (!subjectCode || !subjectName || !department || isElective === undefined || isElective === null) {
                    throw new ApplicationError("Please Provide All the Required Data (subjectCode, subjectName, department, isElective)!", 400);
                }

                const departmentExists = await departmentCollection.findOne({ cn : department });
                if (!departmentExists) {
                    throw new ApplicationError(`Department '${department}' does not exist.`, 404);
                }

                const existingSubject = await subjectCollection.findOne({
                    $or: [
                        { subjectCode: subjectCode },
                        { subjectName: subjectName, department: department } // Subject name should be unique within a department
                    ]
                });

                if (existingSubject) {
                    let takenFields = [];
                    if (existingSubject.subjectCode === subjectCode) {
                        takenFields.push(`Subject Code '${subjectCode}'`);
                    }
                    if (existingSubject.subjectName === subjectName && existingSubject.department === department) {
                        takenFields.push(`Subject Name '${subjectName}' in department '${department}'`);
                    }
                    
                    const errorMessage = `${takenFields.join(' and ')} ${takenFields.length > 1 ? 'are' : 'is'} already taken.`;
                    subjectErrors.push({
                        subjectCode: subjectCode,
                        subjectName: subjectName,
                        department: department,
                        error: errorMessage
                    });
                    continue;
                }
                
                // Ensure isElective is a boolean
                let isElectiveBool = false;
                if (typeof isElective === 'string') {
                    isElectiveBool = isElective.toLowerCase() === 'true';
                } else if (typeof isElective === 'boolean') {
                    isElectiveBool = isElective;
                }


                const newSubject = {
                    subjectCode,
                    subjectName,
                    department,
                    isElective: isElectiveBool,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                const result = await subjectCollection.insertOne(newSubject);
                subjectsAdded.push({
                    _id: result.insertedId,
                    subjectCode: newSubject.subjectCode,
                    subjectName: newSubject.subjectName,
                    department: newSubject.department,
                });

            } catch (error) {
                subjectErrors.push({
                    subjectCode: subjectCode,
                    subjectName: subjectName,
                    department: department,
                    error: error.message
                });
            }
        }

        return {
            success: subjectsAdded,
            errors: subjectErrors
        };
    }

    async getSubject(filter) {
        const { department, subjectCode, subjectName, isElective } = filter;
        const db = await getDB();
        const subjectCollection = db.collection(this.collection);

        const query = {};
        if (department) query.department = department;
        if (subjectCode) query.subjectCode = subjectCode;
        if (subjectName) query.subjectName = { $regex: subjectName, $options: "i" }; // Case-insensitive search for name
        if (isElective !== undefined) {
             // Ensure isElective is a boolean for querying
            let isElectiveBool = false;
            if (typeof isElective === 'string') {
                isElectiveBool = isElective.toLowerCase() === 'true';
            } else if (typeof isElective === 'boolean') {
                isElectiveBool = isElective;
            }
            query.isElective = isElectiveBool;
        }


        const result = await subjectCollection.find(query).toArray();
        return result;
    }

    async updateSubject(subjectUpdateData) {
        const db = await getDB();
        const { id, toModify } = subjectUpdateData;
        const subjectCollection = db.collection(this.collection);
        const departmentCollection = db.collection(this.department);

        if (!id || !toModify) {
            throw new ApplicationError("ID and modification data are required", 400);
        }

        if (!ObjectId.isValid(id)) {
            throw new ApplicationError("Invalid subject ID format", 400);
        }

        const subjectToUpdate = await subjectCollection.findOne({ _id: new ObjectId(id) });
        if (!subjectToUpdate) {
            throw new ApplicationError("Subject not found", 404);
        }

        // Check department existence if it's being updated
        if (toModify.department && toModify.department !== subjectToUpdate.department) {
            const departmentExists = await departmentCollection.findOne({ department: toModify.department });
            if (!departmentExists) {
                throw new ApplicationError(`Department '${toModify.department}' does not exist.`, 404);
            }
        }
        
        // Check for duplicate subjectCode or subjectName (within the same department)
        const orConditions = [];
        if (toModify.subjectCode && toModify.subjectCode !== subjectToUpdate.subjectCode) {
            orConditions.push({ subjectCode: toModify.subjectCode });
        }
        
        const checkDepartment = toModify.department || subjectToUpdate.department;
        if (toModify.subjectName && toModify.subjectName !== subjectToUpdate.subjectName) {
             orConditions.push({ subjectName: toModify.subjectName, department: checkDepartment });
        }


        if (orConditions.length > 0) {
            const existingSubject = await subjectCollection.findOne({
                _id: { $ne: new ObjectId(id) }, // Exclude the current subject
                $or: orConditions
            });

            if (existingSubject) {
                let takenFields = [];
                if (toModify.subjectCode && existingSubject.subjectCode === toModify.subjectCode) {
                    takenFields.push(`Subject Code '${toModify.subjectCode}'`);
                }
                if (toModify.subjectName && existingSubject.subjectName === toModify.subjectName && existingSubject.department === checkDepartment) {
                    takenFields.push(`Subject Name '${toModify.subjectName}' in department '${checkDepartment}'`);
                }
                if (takenFields.length > 0) {
                     throw new ApplicationError(`${takenFields.join(' and ')} ${takenFields.length > 1 ? 'are' : 'is'} already taken.`, 409);
                }
            }
        }
        
        if (toModify.isElective !== undefined && toModify.isElective !== null) {
            if (typeof toModify.isElective === 'string') {
                toModify.isElective = toModify.isElective.toLowerCase() === 'true';
            } else if (typeof toModify.isElective !== 'boolean') {
                throw new ApplicationError("isElective must be a boolean or string 'true'/'false'", 400);
            }
        }


        toModify.updatedAt = new Date();

        const result = await subjectCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: toModify }
        );

        if (result.matchedCount === 0) {
            // This case should ideally be caught by the findOne check earlier
            throw new ApplicationError("Subject not found during update", 404);
        }

        return { modified: result.modifiedCount > 0 };
    }

   async getDeptWiseSubjects()
   {
    
   }

}



export default SubjectService