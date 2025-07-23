// This is the aggregate pipeline to get the faculty department wise
export function getFacultyListDepartmentWise(department) {
	return [
		{
			$match: {
				department: department,
			},
		},
		{
			$project: {
				name: 1,
				employeeCode: 1,
				_id: 1,
				role: 1,
				department: 1,
				abbreviation: 1,
				
			},
		},
	];
}
