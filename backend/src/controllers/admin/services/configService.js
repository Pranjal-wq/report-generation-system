// This file has been removed as requested

import { getDB } from "../../../config/mongodb.js";
import { ApplicationError } from "../../../errorHandle/error.js";

class ConfigService {
    constructor() {
        this.collection = 'Config';
        this.configType = 'activeSemester';
    }

    /**
     * Get the complete semester configuration
     * @returns {Object} - Complete semester configuration
     */
    async getSemesterConfig() {
        const db = await getDB();
        const config = await db.collection(this.collection).findOne({ configType: this.configType });
        
        if (!config) {
            throw new ApplicationError("Semester configuration not found", 404);
        }

        return {
            status: "success",
            data: config
        };
    }

    /**
     * Get the currently active semester
     * @returns {Object} - Active semester information
     */
    async getActiveSemester() {
        const db = await getDB();
        const config = await db.collection(this.collection).findOne({ configType: this.configType });
        
        if (!config) {
            throw new ApplicationError("Semester configuration not found", 404);
        }

        const activeSemester = config.sessions?.find(session => session.isActive === true);
        
        if (!activeSemester) {
            throw new ApplicationError("No active semester found", 404);
        }

        return {
            status: "success",
            data: {
                configType: config.configType,
                institute: config.institute,
                academicYear: config.academicYear,
                activeSemester: activeSemester
            }
        };
    }

    /**
     * Update the active semester
     * @param {string} semesterType - 'Odd' or 'Even'
     * @param {Object} semesterData - Optional semester data to update
     * @returns {Object} - Update result
     */
    async updateActiveSemester(semesterType, semesterData = {}) {
        const db = await getDB();
        console.log("The semester type : ",semesterType);
        if (!['Odd', 'Even','odd','even'].includes(semesterType)) {
            throw new ApplicationError("Semester type must be 'Odd' or 'Even'", 400);
        }

        const config = await db.collection(this.collection).findOne({ configType: this.configType });
        
        if (!config) {
            throw new ApplicationError("Semester configuration not found", 404);
        }

        // Find the semester to activate
        const semesterIndex = config.sessions.findIndex(
            session => session.semesterType.toLowerCase() === semesterType.toLowerCase()
        );
        
        if (semesterIndex === -1) {
            throw new ApplicationError(`${semesterType} semester not found in configuration`, 404);
        }

        // Update all sessions to set isActive = false, then set the target semester to active
        const updateOperations = [];

        // First, deactivate all semesters
        updateOperations.push({
            updateMany: {
                filter: { configType: this.configType },
                update: { $set: { "sessions.$[].isActive": false } }
            }
        });

        // Prepare update data for the target semester
        const updateFields = {
            [`sessions.${semesterIndex}.isActive`]: true,
            [`sessions.${semesterIndex}.updatedAt`]: new Date()
        };

        // Add optional fields if provided
        if (semesterData.startDate) {
            updateFields[`sessions.${semesterIndex}.startDate`] = new Date(semesterData.startDate);
        }
        if (semesterData.endDate) {
            updateFields[`sessions.${semesterIndex}.endDate`] = new Date(semesterData.endDate);
        }

        // Then activate the target semester
        updateOperations.push({
            updateOne: {
                filter: { configType: this.configType },
                update: { $set: updateFields }
            }
        });

        // Execute the operations
        await db.collection(this.collection).updateOne(
            { configType: this.configType },
            { $set: { "sessions.$[].isActive": false } }
        );

        const result = await db.collection(this.collection).updateOne(
            { configType: this.configType },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            throw new ApplicationError("Failed to update active semester", 500);
        }

        return {
            status: "success",
            message: `${semesterType} semester activated successfully`,
            activeSemester: semesterType
        };
    }

    /**
     * Update academic year
     * @param {string} academicYear - New academic year (format: YYYY-YYYY)
     * @returns {Object} - Update result
     */
    async updateAcademicYear(academicYear) {
        const db = await getDB();
        
        // Validate academic year format (YYYY-YYYY)
        const academicYearRegex = /^\d{4}-\d{4}$/;
        if (!academicYearRegex.test(academicYear)) {
            throw new ApplicationError("Academic year format should be YYYY-YYYY", 400);
        }

        const result = await db.collection(this.collection).updateOne(
            { configType: this.configType },
            { 
                $set: { 
                    academicYear: academicYear,
                    updatedAt: new Date()
                } 
            }
        );

        if (result.matchedCount === 0) {
            throw new ApplicationError("Semester configuration not found", 404);
        }

        return {
            status: "success",
            message: "Academic year updated successfully",
            academicYear: academicYear
        };
    }

    /**
     * Update semester dates
     * @param {string} semesterType - 'Odd' or 'Even'
     * @param {Object} dateData - Object containing startDate and/or endDate
     * @returns {Object} - Update result
     */
    async updateSemesterDates(semesterType, dateData) {
        const db = await getDB();
        
        if (!['Odd', 'Even'].includes(semesterType)) {
            throw new ApplicationError("Semester type must be 'Odd' or 'Even'", 400);
        }

        if (!dateData.startDate && !dateData.endDate) {
            throw new ApplicationError("At least one date (startDate or endDate) is required", 400);
        }

        const config = await db.collection(this.collection).findOne({ configType: this.configType });
        
        if (!config) {
            throw new ApplicationError("Semester configuration not found", 404);
        }

        const semesterIndex = config.sessions.findIndex(session => session.semesterType === semesterType);
        
        if (semesterIndex === -1) {
            throw new ApplicationError(`${semesterType} semester not found in configuration`, 404);
        }

        const updateFields = {
            [`sessions.${semesterIndex}.updatedAt`]: new Date()
        };

        if (dateData.startDate) {
            updateFields[`sessions.${semesterIndex}.startDate`] = new Date(dateData.startDate);
        }
        if (dateData.endDate) {
            updateFields[`sessions.${semesterIndex}.endDate`] = new Date(dateData.endDate);
        }

        const result = await db.collection(this.collection).updateOne(
            { configType: this.configType },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            throw new ApplicationError("Failed to update semester dates", 500);
        }

        return {
            status: "success",
            message: `${semesterType} semester dates updated successfully`,
            updatedFields: Object.keys(dateData)
        };
    }

    /**
     * Update institute name
     * @param {string} instituteName - New institute name
     * @returns {Object} - Update result
     */
    async updateInstitute(instituteName) {
        const db = await getDB();
        
        if (!instituteName || typeof instituteName !== 'string') {
            throw new ApplicationError("Institute name is required and must be a string", 400);
        }

        const result = await db.collection(this.collection).updateOne(
            { configType: this.configType },
            { 
                $set: { 
                    institute: instituteName.trim(),
                    updatedAt: new Date()
                } 
            }
        );

        if (result.matchedCount === 0) {
            throw new ApplicationError("Semester configuration not found", 404);
        }

        return {
            status: "success",
            message: "Institute name updated successfully",
            institute: instituteName.trim()
        };
    }
}

export { ConfigService };