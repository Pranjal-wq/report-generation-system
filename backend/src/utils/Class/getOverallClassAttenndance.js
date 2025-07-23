export const getOverallClassAttendance = async (
	ownerId,
	subjectId,
	section
) => {
	return [
		{
			$match: {
				ownerId: ownerId,
				subjectId: subjectId,
				section: section,
			},
		},
		{
			$unwind: {
				path: "$attendance",
			},
		},
		{
			$unwind: {
				path: "$attendance.attendance",
			},
		},
		{
			$group: {
				_id: {
					scholarNumber: {
						$getField: {
							field: "Scholar No.",
							input: "$attendance.attendance",
						},
					},
					name: "$attendance.attendance.Name of Student",
				},
				totalPresent: {
					$sum: {
						$cond: [
							{
								$eq: ["$attendance.attendance.isPresent", "1"],
							},
							1,
							0,
						],
					},
				},
			},
		},
		{
			$project: {
				_id: 0,
				scholarNumber: "$_id.scholarNumber",
				name: "$_id.name",
				totalPresent: 1,
			},
		},
		{
			$sort: {
				scholarNumber: 1,
			},
		},
	];
};
