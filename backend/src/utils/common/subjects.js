import express from 'express';
import { getDB } from '../config/mongodb.js';

const router = express.Router();

router.post('/getSubjects', async (req, res) => {
    const { branch, session, section } = req.body;
    console.log("Request body:", req.body);
    try {
        const db = getDB();
        const sectionData = await db.collection('SectionFacultyMap').findOne({
            department: branch,
            batch: session,
            section,
        });

        if (!sectionData || !sectionData.map) {
            console.log("No subjects found for the given section");
            return res.json({ subjects: [] });
        }

        const subjects = sectionData.map.map((subject) => ({
            subCode: subject.subCode,
            subjectName: subject.subjectName,
            subjectId: subject.subjectId,
            ownerId: subject.ownerId,
        }));
        console.log(subjects, "Subjects found for the given section");
        res.json({ subjects });
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ error: 'Failed to fetch subjects' });
    }
});

export default router;
