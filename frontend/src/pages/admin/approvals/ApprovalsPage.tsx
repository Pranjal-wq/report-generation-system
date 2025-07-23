// import React, { useState, useEffect } from 'react';
// import { Bell, Check, Clock, Eye, Filter, RefreshCw, Search, X } from 'lucide-react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // Import the API functions from admin service
// import {
//     getSessionApprovalRequests,
//     getBranchApprovalRequests,
//     markSessionRequestAsRead,
//     markBranchRequestAsRead,
//     processSessionRequest as processSession,
//     processBranchRequest as processBranch
// } from '../../../api/services/admin';

// // Interfaces for request types
// interface SessionRequest {
//     _id: string;
//     departmentId: string;
//     departmentName: string;
//     branchShortForm: string;
//     branchProgram: string;
//     session: string;
//     status: 'pending' | 'approved' | 'rejected';
//     requestedBy: string;
//     notes?: string;
//     createdAt: string;
//     processedAt?: string;
//     processedBy?: string;
//     isRead?: boolean;
// }

// interface BranchRequest {
//     _id: string;
//     departmentId: string;
//     departmentName: string;
//     branch: {
//         program: string;
//         course: string;
//         shortForm: string;
//         duration: number;
//         session: string[];
//     };
//     status: 'pending' | 'approved' | 'rejected';
//     requestedBy: string;
//     notes?: string;
//     createdAt: string;
//     processedAt?: string;
//     processedBy?: string;
//     isRead?: boolean;
// }

// const ApprovalsPage: React.FC = () => {
//     // State management
//     const [activeTab, setActiveTab] = useState<'session' | 'branch'>('session');
//     const [sessionRequests, setSessionRequests] = useState<SessionRequest[]>([]);
//     const [branchRequests, setBranchRequests] = useState<BranchRequest[]>([]);
//     const [isLoadingSession, setIsLoadingSession] = useState(false);
//     const [isLoadingBranch, setIsLoadingBranch] = useState(false);
//     const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
//     const [searchTerm, setSearchTerm] = useState('');

//     // Request detail view states
//     const [selectedSessionRequest, setSelectedSessionRequest] = useState<SessionRequest | null>(null);
//     const [selectedBranchRequest, setSelectedBranchRequest] = useState<BranchRequest | null>(null);
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [rejectionReason, setRejectionReason] = useState('');
//     const [showDetailModal, setShowDetailModal] = useState(false);

//     // Fetch session and branch requests on component mount
//     useEffect(() => {
//         fetchSessionRequests();
//         fetchBranchRequests();
//     }, []);

//     // Fetch session approval requests
//     const fetchSessionRequests = async () => {
//         setIsLoadingSession(true);
//         try {
//             const data = await getSessionApprovalRequests();

//             if (data.status === 'success') {
//                 // Add isRead property if not present
//                 const requestsWithReadStatus = data.requests.map((req: SessionRequest) => ({
//                     ...req,
//                     isRead: req.isRead || false
//                 }));
//                 setSessionRequests(requestsWithReadStatus);
//             } else {
//                 console.error('Failed to fetch session requests:', data);
//                 toast.error('Failed to fetch session requests');
//             }
//         } catch (error) {
//             console.error('Error fetching session requests:', error);
//             toast.error('Error fetching session requests');
//         } finally {
//             setIsLoadingSession(false);
//         }
//     };

//     // Fetch branch approval requests
//     const fetchBranchRequests = async () => {
//         setIsLoadingBranch(true);
//         try {
//             const data = await getBranchApprovalRequests();

//             if (data.status === 'success') {
//                 // Add isRead property if not present
//                 const requestsWithReadStatus = data.requests.map((req: BranchRequest) => ({
//                     ...req,
//                     isRead: req.isRead || false
//                 }));
//                 setBranchRequests(requestsWithReadStatus);
//             } else {
//                 console.error('Failed to fetch branch requests:', data);
//                 toast.error('Failed to fetch branch requests');
//             }
//         } catch (error) {
//             console.error('Error fetching branch requests:', error);
//             toast.error('Error fetching branch requests');
//         } finally {
//             setIsLoadingBranch(false);
//         }
//     };

//     // Update read status for session request
//     const markSessionRequestAsReadHandler = async (requestId: string) => {
//         try {
//             const response = await markSessionRequestAsRead(requestId);

//             if (response.ok) {
//                 // Update local state
//                 setSessionRequests(prevRequests =>
//                     prevRequests.map(req =>
//                         req._id === requestId ? { ...req, isRead: true } : req
//                     )
//                 );
//             }
//         } catch (error) {
//             console.error('Error marking session request as read:', error);
//         }
//     };

//     // Update read status for branch request
//     const markBranchRequestAsReadHandler = async (requestId: string) => {
//         try {
//             const response = await markBranchRequestAsRead(requestId);

//             if (response.ok) {
//                 // Update local state
//                 setBranchRequests(prevRequests =>
//                     prevRequests.map(req =>
//                         req._id === requestId ? { ...req, isRead: true } : req
//                     )
//                 );
//             }
//         } catch (error) {
//             console.error('Error marking branch request as read:', error);
//         }
//     };

//     // Process session request (approve or reject)
//     const processSessionRequest = async (requestId: string, action: 'approve' | 'reject') => {
//         setIsProcessing(true);
//         try {
//             const data = await processSession(requestId, action, action === 'reject' ? rejectionReason : undefined);

//             if (data.status === 'success') {
//                 toast.success(`Session request ${action === 'approve' ? 'approved' : 'rejected'} successfully`);

//                 // Update local state
//                 setSessionRequests(prevRequests =>
//                     prevRequests.map(req =>
//                         req._id === requestId
//                             ? {
//                                 ...req,
//                                 status: action,
//                                 processedAt: new Date().toISOString(),
//                                 processedBy: 'admin' // Assuming the current user is admin
//                             }
//                             : req
//                     )
//                 );

//                 // Close the modal and reset states
//                 setShowDetailModal(false);
//                 setSelectedSessionRequest(null);
//                 setRejectionReason('');
//             } else {
//                 toast.error(`Failed to ${action} session request`);
//             }
//         } catch (error) {
//             console.error(`Error processing session request (${action}):`, error);
//             toast.error(`Error processing session request`);
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     // Process branch request (approve or reject)
//     const processBranchRequest = async (requestId: string, action: 'approve' | 'reject') => {
//         setIsProcessing(true);
//         try {
//             const data = await processBranch(requestId, action, action === 'reject' ? rejectionReason : undefined);

//             if (data.status === 'success') {
//                 toast.success(`Branch request ${action === 'approve' ? 'approved' : 'rejected'} successfully`);

//                 // Update local state
//                 setBranchRequests(prevRequests =>
//                     prevRequests.map(req =>
//                         req._id === requestId
//                             ? {
//                                 ...req,
//                                 status: action,
//                                 processedAt: new Date().toISOString(),
//                                 processedBy: 'admin' // Assuming the current user is admin
//                             }
//                             : req
//                     )
//                 );

//                 // Close the modal and reset states
//                 setShowDetailModal(false);
//                 setSelectedBranchRequest(null);
//                 setRejectionReason('');
//             } else {
//                 toast.error(`Failed to ${action} branch request`);
//             }
//         } catch (error) {
//             console.error(`Error processing branch request (${action}):`, error);
//             toast.error(`Error processing branch request`);
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     // Handle view request details
//     const handleViewSessionRequest = (request: SessionRequest) => {
//         setSelectedSessionRequest(request);
//         setShowDetailModal(true);

//         // Mark as read if not already read
//         if (!request.isRead) {
//             markSessionRequestAsReadHandler(request._id);
//         }
//     };

//     const handleViewBranchRequest = (request: BranchRequest) => {
//         setSelectedBranchRequest(request);
//         setShowDetailModal(true);

//         // Mark as read if not already read
//         if (!request.isRead) {
//             markBranchRequestAsReadHandler(request._id);
//         }
//     };

//     // Close detail modal
//     const closeDetailModal = () => {
//         setShowDetailModal(false);
//         setSelectedSessionRequest(null);
//         setSelectedBranchRequest(null);
//         setRejectionReason('');
//     };

//     // Format date for display
//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString);
//         return date.toLocaleString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     // Filter requests based on search term and status
//     const getFilteredSessionRequests = () => {
//         return sessionRequests.filter(request => {
//             const matchesStatus = selectedStatusFilter === 'all' || request.status === selectedStatusFilter;
//             const matchesSearch =
//                 request.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 request.branchShortForm.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 request.branchProgram.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 request.session.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());

//             return matchesStatus && matchesSearch;
//         });
//     };

//     const getFilteredBranchRequests = () => {
//         return branchRequests.filter(request => {
//             const matchesStatus = selectedStatusFilter === 'all' || request.status === selectedStatusFilter;
//             const matchesSearch =
//                 request.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 request.branch.shortForm.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 request.branch.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 request.branch.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());

//             return matchesStatus && matchesSearch;
//         });
//     };

//     // Get status badge color
//     const getStatusBadgeClass = (status: string) => {
//         switch (status) {
//             case 'pending':
//                 return 'bg-yellow-100 text-yellow-800';
//             case 'approved':
//                 return 'bg-green-100 text-green-800';
//             case 'rejected':
//                 return 'bg-red-100 text-red-800';
//             default:
//                 return 'bg-gray-100 text-gray-800';
//         }
//     };

//     return (
//         <div className="p-6">
//             <h1 className="text-2xl font-bold mb-4">Approval Requests</h1>
//             <p className="text-gray-600 mb-6">
//                 Review and manage session and branch requests from department administrators.
//             </p>

//             {/* Tabs */}
//             <div className="border-b border-gray-200 mb-6">
//                 <nav className="flex space-x-8" aria-label="Tabs">
//                     <button
//                         onClick={() => setActiveTab('session')}
//                         className={`
//                             py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm
//                             ${activeTab === 'session'
//                                 ? 'border-blue-500 text-blue-600'
//                                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
//                         `}
//                     >
//                         <Clock className="mr-2 h-5 w-5" />
//                         Session Requests
//                         {sessionRequests.filter(req => req.status === 'pending').length > 0 && (
//                             <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
//                                 {sessionRequests.filter(req => req.status === 'pending').length}
//                             </span>
//                         )}
//                     </button>
//                     <button
//                         onClick={() => setActiveTab('branch')}
//                         className={`
//                             py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm
//                             ${activeTab === 'branch'
//                                 ? 'border-blue-500 text-blue-600'
//                                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
//                         `}
//                     >
//                         <Bell className="mr-2 h-5 w-5" />
//                         Branch Requests
//                         {branchRequests.filter(req => req.status === 'pending').length > 0 && (
//                             <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
//                                 {branchRequests.filter(req => req.status === 'pending').length}
//                             </span>
//                         )}
//                     </button>
//                 </nav>
//             </div>

//             {/* Search and Filter */}
//             <div className="flex flex-col md:flex-row justify-between mb-6 space-y-3 md:space-y-0">
//                 <div className="relative w-full md:w-64">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <Search className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                         type="text"
//                         className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         placeholder="Search requests..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                 </div>
//                 <div className="flex space-x-3">
//                     <div className="relative inline-block text-left">
//                         <div className="flex items-center">
//                             <Filter className="h-5 w-5 text-gray-400 mr-2" />
//                             <select
//                                 className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                                 value={selectedStatusFilter}
//                                 onChange={(e) => setSelectedStatusFilter(e.target.value)}
//                             >
//                                 <option value="all">All Status</option>
//                                 <option value="pending">Pending</option>
//                                 <option value="approved">Approved</option>
//                                 <option value="rejected">Rejected</option>
//                             </select>
//                         </div>
//                     </div>
//                     <button
//                         onClick={() => {
//                             activeTab === 'session' ? fetchSessionRequests() : fetchBranchRequests();
//                             toast.info('Refreshing requests...');
//                         }}
//                         className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                     >
//                         <RefreshCw className="h-4 w-4 mr-2" />
//                         Refresh
//                     </button>
//                 </div>
//             </div>

//             {/* Session Requests Tab */}
//             {activeTab === 'session' && (
//                 <div className="space-y-4">
//                     {isLoadingSession ? (
//                         <div className="flex justify-center items-center h-40">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                         </div>
//                     ) : getFilteredSessionRequests().length === 0 ? (
//                         <div className="bg-white shadow rounded-lg p-6 text-center">
//                             <p className="text-gray-500">No session requests found.</p>
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                             {getFilteredSessionRequests().map((request) => (
//                                 <div
//                                     key={request._id}
//                                     className={`bg-white shadow rounded-lg overflow-hidden border-l-4 
//                                         ${request.status === 'pending' ? 'border-yellow-500' :
//                                             request.status === 'approved' ? 'border-green-500' :
//                                                 'border-red-500'}
//                                         ${!request.isRead && request.status === 'pending' ? 'ring-2 ring-blue-300' : ''}
//                                     `}
//                                 >
//                                     <div className="p-5">
//                                         <div className="flex justify-between items-start mb-4">
//                                             <div>
//                                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(request.status)}`}>
//                                                     {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
//                                                 </span>
//                                                 {!request.isRead && request.status === 'pending' && (
//                                                     <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                                                         New
//                                                     </span>
//                                                 )}
//                                             </div>
//                                             <span className="text-xs text-gray-500">{formatDate(request.createdAt)}</span>
//                                         </div>

//                                         <h3 className="text-lg font-semibold text-gray-900 mb-1">
//                                             Session: {request.session}
//                                         </h3>

//                                         <p className="text-sm text-gray-500 mb-3">
//                                             Branch: {request.branchProgram} ({request.branchShortForm})
//                                         </p>

//                                         <div className="text-sm">
//                                             <p><span className="font-medium">Department:</span> {request.departmentName}</p>
//                                             <p><span className="font-medium">Requested by:</span> {request.requestedBy}</p>
//                                         </div>
//                                     </div>

//                                     <div className="bg-gray-50 px-5 py-3 text-right">
//                                         <button
//                                             onClick={() => handleViewSessionRequest(request)}
//                                             className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                                         >
//                                             <Eye className="h-4 w-4 mr-1" />
//                                             View Details
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             )}

//             {/* Branch Requests Tab */}
//             {activeTab === 'branch' && (
//                 <div className="space-y-4">
//                     {isLoadingBranch ? (
//                         <div className="flex justify-center items-center h-40">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                         </div>
//                     ) : getFilteredBranchRequests().length === 0 ? (
//                         <div className="bg-white shadow rounded-lg p-6 text-center">
//                             <p className="text-gray-500">No branch requests found.</p>
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                             {getFilteredBranchRequests().map((request) => (
//                                 <div
//                                     key={request._id}
//                                     className={`bg-white shadow rounded-lg overflow-hidden border-l-4 
//                                         ${request.status === 'pending' ? 'border-yellow-500' :
//                                             request.status === 'approved' ? 'border-green-500' :
//                                                 'border-red-500'}
//                                         ${!request.isRead && request.status === 'pending' ? 'ring-2 ring-blue-300' : ''}
//                                     `}
//                                 >
//                                     <div className="p-5">
//                                         <div className="flex justify-between items-start mb-4">
//                                             <div>
//                                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(request.status)}`}>
//                                                     {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
//                                                 </span>
//                                                 {!request.isRead && request.status === 'pending' && (
//                                                     <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                                                         New
//                                                     </span>
//                                                 )}
//                                             </div>
//                                             <span className="text-xs text-gray-500">{formatDate(request.createdAt)}</span>
//                                         </div>

//                                         <h3 className="text-lg font-semibold text-gray-900 mb-1">
//                                             {request.branch.program} ({request.branch.shortForm})
//                                         </h3>

//                                         <p className="text-sm text-gray-500 mb-3">
//                                             Course: {request.branch.course} • Duration: {request.branch.duration} years
//                                         </p>

//                                         <div className="text-sm">
//                                             <p><span className="font-medium">Department:</span> {request.departmentName}</p>
//                                             <p><span className="font-medium">Requested by:</span> {request.requestedBy}</p>
//                                             {request.branch.session && request.branch.session.length > 0 && (
//                                                 <p><span className="font-medium">Sessions:</span> {request.branch.session.join(', ')}</p>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <div className="bg-gray-50 px-5 py-3 text-right">
//                                         <button
//                                             onClick={() => handleViewBranchRequest(request)}
//                                             className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                                         >
//                                             <Eye className="h-4 w-4 mr-1" />
//                                             View Details
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             )}

//             {/* Request Detail Modal */}
//             {showDetailModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg shadow-lg max-w-xl w-full mx-4">
//                         <div className="p-6">
//                             <div className="flex justify-between items-start mb-4">
//                                 <h2 className="text-xl font-bold">
//                                     {selectedSessionRequest
//                                         ? 'Session Request Details'
//                                         : 'Branch Request Details'}
//                                 </h2>
//                                 <button
//                                     onClick={closeDetailModal}
//                                     className="text-gray-400 hover:text-gray-500"
//                                 >
//                                     <X className="h-6 w-6" />
//                                 </button>
//                             </div>

//                             {/* Session Request Details */}
//                             {selectedSessionRequest && (
//                                 <div className="space-y-4">
//                                     <div className="bg-gray-50 p-4 rounded-lg">
//                                         <div className="grid grid-cols-2 gap-4">
//                                             <div>
//                                                 <p className="text-sm text-gray-500">Department</p>
//                                                 <p className="font-medium">{selectedSessionRequest.departmentName}</p>
//                                             </div>
//                                             <div>
//                                                 <p className="text-sm text-gray-500">Branch</p>
//                                                 <p className="font-medium">{selectedSessionRequest.branchProgram} ({selectedSessionRequest.branchShortForm})</p>
//                                             </div>
//                                             <div>
//                                                 <p className="text-sm text-gray-500">Session</p>
//                                                 <p className="font-medium">{selectedSessionRequest.session}</p>
//                                             </div>
//                                             <div>
//                                                 <p className="text-sm text-gray-500">Status</p>
//                                                 <p className="font-medium">
//                                                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedSessionRequest.status)}`}>
//                                                         {selectedSessionRequest.status.charAt(0).toUpperCase() + selectedSessionRequest.status.slice(1)}
//                                                     </span>
//                                                 </p>
//                                             </div>
//                                             <div>
//                                                 <p className="text-sm text-gray-500">Requested By</p>
//                                                 <p className="font-medium">{selectedSessionRequest.requestedBy}</p>
//                                             </div>
//                                             <div>
//                                                 <p className="text-sm text-gray-500">Request Date</p>
//                                                 <p className="font-medium">{formatDate(selectedSessionRequest.createdAt)}</p>
//                                             </div>
//                                         </div>

//                                         {selectedSessionRequest.notes && (
//                                             <div className="mt-4">
//                                                 <p className="text-sm text-gray-500">Notes</p>
//                                                 <p className="font-medium">{selectedSessionRequest.notes}</p>
//                                             </div>
//                                         )}

//                                         {selectedSessionRequest.processedAt && (
//                                             <div className="mt-4 pt-4 border-t border-gray-200">
//                                                 <p className="text-sm text-gray-500">Processed Date</p>
//                                                 <p className="font-medium">{formatDate(selectedSessionRequest.processedAt)}</p>

//                                                 {selectedSessionRequest.processedBy && (
//                                                     <div className="mt-2">
//                                                         <p className="text-sm text-gray-500">Processed By</p>
//                                                         <p className="font-medium">{selectedSessionRequest.processedBy}</p>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* Action Buttons (only for pending requests) */}
//                                     {selectedSessionRequest.status === 'pending' && (
//                                         <div className="border-t border-gray-200 pt-4">
//                                             <h3 className="text-lg font-medium mb-2">Process Request</h3>

//                                             {/* Rejection Reason Input (only shown when rejecting) */}
//                                             <div className="mb-4">
//                                                 <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Reason (optional, required for rejection)
//                                                 </label>
//                                                 <textarea
//                                                     id="rejectionReason"
//                                                     rows={3}
//                                                     className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                                                     placeholder="Provide a reason for approval or rejection..."
//                                                     value={rejectionReason}
//                                                     onChange={(e) => setRejectionReason(e.target.value)}
//                                                 ></textarea>
//                                             </div>

//                                             <div className="flex justify-end space-x-3">
//                                                 <button
//                                                     onClick={() => processSessionRequest(selectedSessionRequest._id, 'reject')}
//                                                     disabled={isProcessing}
//                                                     className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
//                                                 >
//                                                     <X className="h-5 w-5 mr-1" />
//                                                     Reject
//                                                 </button>
//                                                 <button
//                                                     onClick={() => processSessionRequest(selectedSessionRequest._id, 'approve')}
//                                                     disabled={isProcessing}
//                                                     className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
//                                                 >
//                                                     <Check className="h-5 w-5 mr-1" />
//                                                     Approve
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}

//                             {/* Branch Request Details */}
//                             {selectedBranchRequest && (
//                                 <div className="space-y-4">
//                                     <div className="bg-gray-50 p-4 rounded-lg">
//                                         <div className="grid grid-cols-2 gap-4">
//                                             <div>
//                                                 <p className="text-sm text-gray-500">Department</p>
//                                                 <p className="font-medium">{selectedBranchRequest.departmentName}</p>
//                                             </div>
//                                             <div>
//                                                 <p className="text-sm text-gray-500">Branch Program</p>
//                                                 <p className="font-medium">{selectedBranchRequest.branch.program}</p>
//                                             </div>
//                                             <div>
//                                                 <p className="text-sm text-gray-500">Short Form</p>
//                                                 <p className="font-medium">{selectedBranchRequest.branch.shortForm}</p>
//                                             </div>
//                                             <div>
//                                                 <p className="text-sm text-gray-500">Course</p>
//                                                 <p className="font-medium">{selectedBranchRequest.branch.course}</p>
//                                             </div>
//                                             <div>
//                                                 <p className="text-sm text-gray-500">Duration</p>
//                                                 <p className="font-medium">{selectedBranchRequest.branch.duration} years</p>
//                                             </div>
//                                             <div>
//                                                 <p className="text-sm text-gray-500">Status</p>
//                                                 <p className="font-medium">
//                                                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedBranchRequest.status)}`}>
//                                                         {selectedBranchRequest.status.charAt(0).toUpperCase() + selectedBranchRequest.status.slice(1)}
//                                                     </span>
//                                                 </p>
//                                             </div>
//                                             <div>
//                                                 <p className="text-sm text-gray-500">Requested By</p>
//                                                 <p className="font-medium">{selectedBranchRequest.requestedBy}</p>
//                                             </div>
//                                             <div>
//                                                 <p className="text-sm text-gray-500">Request Date</p>
//                                                 <p className="font-medium">{formatDate(selectedBranchRequest.createdAt)}</p>
//                                             </div>
//                                         </div>

//                                         {selectedBranchRequest.branch.session && selectedBranchRequest.branch.session.length > 0 && (
//                                             <div className="mt-4">
//                                                 <p className="text-sm text-gray-500">Sessions</p>
//                                                 <p className="font-medium">{selectedBranchRequest.branch.session.join(', ')}</p>
//                                             </div>
//                                         )}

//                                         {selectedBranchRequest.notes && (
//                                             <div className="mt-4">
//                                                 <p className="text-sm text-gray-500">Notes</p>
//                                                 <p className="font-medium">{selectedBranchRequest.notes}</p>
//                                             </div>
//                                         )}

//                                         {selectedBranchRequest.processedAt && (
//                                             <div className="mt-4 pt-4 border-t border-gray-200">
//                                                 <p className="text-sm text-gray-500">Processed Date</p>
//                                                 <p className="font-medium">{formatDate(selectedBranchRequest.processedAt)}</p>

//                                                 {selectedBranchRequest.processedBy && (
//                                                     <div className="mt-2">
//                                                         <p className="text-sm text-gray-500">Processed By</p>
//                                                         <p className="font-medium">{selectedBranchRequest.processedBy}</p>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* Action Buttons (only for pending requests) */}
//                                     {selectedBranchRequest.status === 'pending' && (
//                                         <div className="border-t border-gray-200 pt-4">
//                                             <h3 className="text-lg font-medium mb-2">Process Request</h3>

//                                             {/* Rejection Reason Input (only shown when rejecting) */}
//                                             <div className="mb-4">
//                                                 <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-1">
//                                                     Reason (optional, required for rejection)
//                                                 </label>
//                                                 <textarea
//                                                     id="rejectionReason"
//                                                     rows={3}
//                                                     className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                                                     placeholder="Provide a reason for approval or rejection..."
//                                                     value={rejectionReason}
//                                                     onChange={(e) => setRejectionReason(e.target.value)}
//                                                 ></textarea>
//                                             </div>

//                                             <div className="flex justify-end space-x-3">
//                                                 <button
//                                                     onClick={() => processBranchRequest(selectedBranchRequest._id, 'reject')}
//                                                     disabled={isProcessing}
//                                                     className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
//                                                 >
//                                                     <X className="h-5 w-5 mr-1" />
//                                                     Reject
//                                                 </button>
//                                                 <button
//                                                     onClick={() => processBranchRequest(selectedBranchRequest._id, 'approve')}
//                                                     disabled={isProcessing}
//                                                     className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
//                                                 >
//                                                     <Check className="h-5 w-5 mr-1" />
//                                                     Approve
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <ToastContainer position="top-right" autoClose={3000} />
//         </div>
//     );
// };

// export default ApprovalsPage;

import React, { useState, useEffect } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom';

const ApprovalsPage = () => {
    return (
        
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <div className="p-10 bg-white rounded-lg shadow-md text-center max-w-xl">
                <h1 className="text-3xl font-bold text-blue-600 mb-4">Approval Section</h1>
                <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-6">
                    <p className="text-xl font-semibold">Testing Phase</p>
                    <p className="mt-2">The Approval Section is currently under development and testing.</p>
                    <p className="mt-1">We appreciate your patience as we work to enhance this feature.</p>
                </div>
                <p className="text-gray-600">This section will soon allow you to manage approval requests for sessions and branches.</p>
            </div>
        </div>
    );
}

export default ApprovalsPage;
