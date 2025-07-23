import express from 'express';
import DashboardController from '../controllers/admin/services/DashboardController.js';
import asyncWrap from '../utils/asyncWrap.js';

const dashboardStats = express.Router();
const dashboardController = new DashboardController();

dashboardStats.get('/stats', asyncWrap(async (req, res) => {
    await dashboardController.getDashboardStats(req, res);
}));

export default dashboardStats;