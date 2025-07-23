import React from 'react';
import { FaTrash } from 'react-icons/fa';
import {
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button
} from '@mui/material';

interface Session {
    _id: string;
    session: string;
}

interface SessionListProps {
    sessions: Session[];
    sessionLoading: boolean;
    selectedBranch: string;
    onDeleteSession: (session: Session) => void;
}

const SessionList: React.FC<SessionListProps> = ({
    sessions,
    sessionLoading,
    selectedBranch,
    onDeleteSession
}) => {
    return (
        <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                Available Sessions for {selectedBranch}
            </h3>

            {sessionLoading ? (
                <div className="flex justify-center items-center h-12 sm:h-16">
                    <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-700"></div>
                </div>
            ) : sessions.length === 0 ? (
                <p className="text-gray-500 italic text-sm sm:text-base">
                    No sessions available for this branch. Add a new session below.
                </p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {sessions.map((session) => (
                        <div
                            key={session._id}
                            className="bg-gray-100 rounded p-2 text-center flex justify-between items-center text-sm sm:text-base"
                        >
                            <span>{session.session}</span>
                            <button
                                onClick={() => onDeleteSession(session)}
                                className="text-red-600 hover:text-red-800 transition ml-2"
                                aria-label={`Delete ${session.session} session`}
                            >
                                <FaTrash className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export interface DeleteSessionModalProps {
    open: boolean;
    session: Session | null;
    isDeleting: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteSessionModal: React.FC<DeleteSessionModalProps> = ({
    open,
    session,
    isDeleting,
    onClose,
    onConfirm
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Delete Session</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete session "{session?.session}"?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={onConfirm}
                    disabled={isDeleting}
                    color="error"
                >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SessionList;