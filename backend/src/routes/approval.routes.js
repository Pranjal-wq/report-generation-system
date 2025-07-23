import express from 'express';
import { AdminController } from '../controllers/admin/Admin.controller.js';
import asyncWrap from '../utils/asyncWrap.js';

const approvalRoutes = express.Router();
const adminController = new AdminController();

// Session Management Routes

// Endpoint for creating a session request
// Only department admins can access this endpoint
approvalRoutes.post('/session/request', asyncWrap(async (req, res, next) => {
    try {
        const result = await adminController.approvalService.createSessionRequest({
            departmentId: req.body.departmentId,
            branchShortForm: req.body.branchShortForm,
            session: req.body.session,
            requestedBy: req.body.requestedBy || 'unknown', // Use requestedBy from body or default
            notes: req.body.notes
        });
        res.status(200).json(result);
    } catch (error) {
        next(error); // Properly forward to error handler
    }
}));

// Endpoint for getting session approval requests
// Only super admins and department admins can access this endpoint
approvalRoutes.get('/session/requests', asyncWrap(async (req, res, next) => {
    try {
        const result = await adminController.getSessionApprovalRequests(req, res);
        if (!result) return next(new Error('Failed to get session requests'));
    } catch (error) {
        next(error);
    }
}));

// Endpoint for processing session requests
// Only super admins can access this endpoint
approvalRoutes.put('/session/process', asyncWrap(async (req, res, next) => {
    try {
        const result = await adminController.processSessionRequest(req, res);
        if (!result) return next(new Error('Failed to process session request'));
    } catch (error) {
        next(error);
    }
}));

// Endpoint for updating the readStatus of a session request to 'viewed'
approvalRoutes.put('/session/read-status/:requestId', asyncWrap(async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const result = await adminController.approvalService.updateSessionRequestReadStatus(requestId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}));

// Endpoint for bulk updating the readStatus of multiple session requests to 'viewed'
approvalRoutes.put('/session/bulk-read-status', asyncWrap(async (req, res, next) => {
    try {
        const { requestIds } = req.body;
        const result = await adminController.approvalService.bulkUpdateSessionRequestsReadStatus(requestIds);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}));

// Branch Management Routes

// Endpoint for creating a branch request
approvalRoutes.post('/branch/request', asyncWrap(async (req, res, next) => {
    try {
        const result = await adminController.approvalService.createBranchRequest({
            departmentId: req.body.departmentId,
            branch: req.body.branch,
            requestedBy: req.body.requestedBy || 'unknown', // Same approach as session
            notes: req.body.notes
        });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}));

// Endpoint for getting branch approval requests
approvalRoutes.get('/branch/requests', asyncWrap(async (req, res, next) => {
    try {
        const result = await adminController.getBranchApprovalRequests(req, res);
        if (!result) return next(new Error('Failed to get branch requests'));
    } catch (error) {
        next(error);
    }
}));

// Endpoint for processing branch requests
approvalRoutes.put('/branch/process', asyncWrap(async (req, res, next) => {
    try {
        const result = await adminController.processBranchRequest(req, res);
        if (!result) return next(new Error('Failed to process branch request'));
    } catch (error) {
        next(error);
    }
}));

// Endpoint for updating the readStatus of a branch request to 'viewed'
approvalRoutes.put('/branch/read-status/:requestId', asyncWrap(async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const result = await adminController.approvalService.updateBranchRequestReadStatus(requestId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}));

// Endpoint for bulk updating the readStatus of multiple branch requests to 'viewed'
approvalRoutes.put('/branch/bulk-read-status', asyncWrap(async (req, res, next) => {
    try {
        const { requestIds } = req.body;
        const result = await adminController.approvalService.bulkUpdateBranchRequestsReadStatus(requestIds);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}));

// Semester Management Routes

// Endpoint for enabling semesters
approvalRoutes.post('/semester/enable', asyncWrap(async (req, res, next) => {
    try {
        const result = await adminController.enableSemester(req, res);
        if (!result) return next(new Error('Failed to enable semester'));
    } catch (error) {
        next(error);
    }
}));

// Endpoint for getting active semester
approvalRoutes.get('/semester/active', asyncWrap(async (req, res, next) => {
    try {
        const result = await adminController.getActiveSemester(req, res);
        if (!result) return next(new Error('Failed to get active semester'));
    } catch (error) {
        next(error);
    }
}));

export default approvalRoutes;