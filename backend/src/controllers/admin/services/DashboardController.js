import { getDB } from '../../../config/mongodb.js';
import { ObjectId } from 'mongodb';
import { ApplicationError } from '../../../errorHandle/error.js';
import dotenv from 'dotenv';
dotenv.config();
class DashboardController {
    constructor() {
        this.departments = "Departments";
        this.faculty = "User";
        this.students = "Student";
        this.subjects = "Subject";
        this.sessions = "SessionApprovalRequests";
        this.timetable = "TimeTable";
        this.config = "Config";
        this.branchRequests = "BranchApprovalRequests";
        this.attendance = "Attendance";
        this.semConfig = process.env.SEM_CONFIG;
        
        // Cache for stats to improve performance
        this.statsCache = {
            timestamp: 0,
            data: null,
            ttl: 5 * 60 * 1000 // 5 minutes cache TTL
        };
    }    // Get dashboard stats for the main admin (super_admin)
    async getDashboardStats(req, res) {
        const db = await getDB();
        // Use a constant cacheKey instead of user-specific caching
        const cacheKey = 'dashboard_stats';
        
        try {
            // Check if we have valid cached data
            const now = Date.now();
            if (this.statsCache.data && (now - this.statsCache.timestamp < this.statsCache.ttl)) {
                const cachedStats = this.statsCache.data[cacheKey];
                if (cachedStats) {
                    return res.status(200).json({
                        status: "success",
                        data: cachedStats,
                        fromCache: true
                    });
                }
            }            // Get stats for main admin only
            const stats = await this.getSuperAdminStats(db);

            // Get active semester
            const activeSemester = await this.getActiveSemester(db);
            
            // Handle the new activeSemester format (object with semesterType, startDate, endDate)
            if (activeSemester && typeof activeSemester === 'object') {
                stats.summary.activeSemester = {
                    type: activeSemester.semesterType || 'None',
                    startDate: activeSemester.startDate,
                    endDate: activeSemester.endDate
                };
            } else {
                stats.summary.activeSemester = activeSemester || 'None';
            }
            
            // Add timestamp to stats
            stats.timestamp = new Date().toISOString();
              // Store in cache
            if (!this.statsCache.data) {
                this.statsCache.data = {};
            }
            this.statsCache.data[cacheKey] = stats;
            this.statsCache.timestamp = now;            return res.status(200).json({
                status: "success",
                data: stats,
                fromCache: false
            });

        } catch (error) {
            console.error("Dashboard stats error:", error);
            throw new ApplicationError(error.message || "Failed to fetch dashboard stats", error.statusCode || 500);
        }
    }
      // Get stats for super admin (all departments)
    async getSuperAdminStats(db) {
        try {
            // Get departments count and details
            const departments = await db.collection(this.departments).find({}).toArray();
            
            // Calculate aggregate stats
            let totalBranches = 0;
            let totalCourses = new Set();
            
            departments.forEach(dept => {
                // Count branches
                const branchCount = dept.branches?.length || 0;
                totalBranches += branchCount;
                
                // Collect course names for unique count
                if (dept.courses && dept.courses.length > 0) {
                    dept.courses.forEach(course => {
                        totalCourses.add(course.name);
                    });
                }
            });

            // Get other counts
            const facultyCount = await db.collection(this.faculty).countDocuments({});
            const studentCount = await db.collection(this.students).countDocuments({});
            const subjectCount = await db.collection(this.subjects).countDocuments({});
            // const sessionCount = await db.collection(this.sessions).countDocuments({ status: 'approved' });
            // const timetableCount = await db.collection(this.timetable).countDocuments({});
            const attendanceCount = await db.collection(this.attendance).countDocuments({});
            
            // Get pending requests count only
            const pendingRequests = await this.getPendingRequestsCount(db);
             
            // Return only the summary data
            return {
                summary: {
                    departments: departments.length,
                    branches: totalBranches,
                    courses: totalCourses.size,
                    faculty: facultyCount,
                    subjects: subjectCount,
                    students: studentCount,
                    // sessions: sessionCount,
                    // timetables: timetableCount,
                    attendance: attendanceCount,
                    pendingRequests,
                    
                }
            };
        } catch (error) {
            console.error("Error in getSuperAdminStats:", error);
            throw new ApplicationError("Failed to get super admin stats", 500);
        }
    }    // Get count of pending requests (for main admin - all departments)
    async getPendingRequestsCount(db) {
        try {
            const sessionRequests = await db.collection('SessionApprovalRequests')
                .countDocuments({ status: 'pending' });

            const branchRequests = await db.collection('BranchApprovalRequests')
                .countDocuments({ status: 'pending' });

            return sessionRequests + branchRequests;
        } catch (error) {
            console.error("Error in getPendingRequestsCount:", error);            
            return 0; // Return 0 in case of error to prevent dashboard from breaking
        }
    }    // Get active semester
    async getActiveSemester(db) {
        try {
            const config = await db.collection(this.config)
                .findOne({ configType: this.semConfig });
            
            // Handle new format with sessions array
            if (config && config.sessions && Array.isArray(config.sessions)) {
                // Find the active session in the array
                const activeSession = config.sessions.find(session => session.isActive === true);
                
                if (activeSession) {
                    return {
                        semesterType: activeSession.semesterType,
                        startDate: activeSession.startDate,
                        endDate: activeSession.endDate
                    };
                }
                
                // If no active session found, return the first session (fallback to Odd)
                if (config.sessions.length > 0) {
                    return {
                        semesterType: config.sessions[0].semesterType,
                        startDate: config.sessions[0].startDate,
                        endDate: config.sessions[0].endDate
                    };
                }
            }
            
            // Fallback to old format for backward compatibility
            return config?.semesterType || null;
        } catch (error) {
            console.error("Error in getActiveSemester:", error);
            return null;
        }
    }
}

export default DashboardController;