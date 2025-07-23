import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BranchManagement from './adminComponents/branch/BranchManagement';

const BranchService: React.FC = () => {
    return (
        <div>
            <BranchManagement />
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default BranchService;