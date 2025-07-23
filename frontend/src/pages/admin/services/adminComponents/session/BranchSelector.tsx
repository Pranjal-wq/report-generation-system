import React from 'react';

interface Branch {
    _id: string;
    shortForm: string;
    program: string;
}

interface BranchSelectorProps {
    branches: Branch[];
    selectedBranch: string;
    setSelectedBranch: (branchShortForm: string) => void;
    loading: boolean;
    disabled: boolean;
}

const BranchSelector: React.FC<BranchSelectorProps> = ({
    branches,
    selectedBranch,
    setSelectedBranch,
    loading,
    disabled
}) => {
    return (
        <div className="space-y-1">
            <label className="block text-gray-700 text-sm font-bold mb-1 sm:mb-2" htmlFor="branch">
                Branch
            </label>
            <select
                id="branch"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                disabled={loading || disabled || branches.length === 0}
            >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                    <option key={branch._id} value={branch.shortForm}>
                        {branch.shortForm} - {branch.program}
                    </option>
                ))}
            </select>
            {loading && (
                <div className="flex justify-center items-center h-4 sm:h-6 mt-1">
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-700"></div>
                </div>
            )}
        </div>
    );
};

export default BranchSelector;