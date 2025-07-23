export function getMonthlyPipeline(scholarNumber, branch, semester, section) {
	return [
		{
			$unwind: "$attendance",
		},
		{
			$unwind: "$attendance.attendance",
		},
		{
			$match: {
				$expr: {
					$eq: [
						{
							$getField: {
								field: "Scholar No.",
								input: "$attendance.attendance",
							},
						},
						scholarNumber,
					],
				},
			},
		},
		{
			$group: {
				_id: {
					subjectId: "$subjectId",
					branch: branch,
					semester: semester,
					section: "01",
					scholarNo: {
						$getField: {
							field: "Scholar No.",
							input: "$attendance.attendance",
						},
					},
					month: {
						$substr: ["$attendance.date", 0, 7],
					},
				},
				totalSessions: {
					$sum: 1,
				},
				presentCount: {
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
			$lookup: {
				from: "Subject",
				let: { subjectId: "$_id.subjectId" },
				pipeline: [
					{
						$match: {
							$expr: { $eq: ["$_id", { $toObjectId: "$$subjectId" }] },
						},
					},
					{ $project: { subjectName: 1, _id: 0 } },
				],
				as: "subjectDetail",
			},
		},
		{
			$addFields: {
				subjectName: { $arrayElemAt: ["$subjectDetail.subjectName", 0] },
			},
		},
		{
			$project: {
				_id: 0,
				subjectId: "$_id.subjectId",
				subjectName: 1,
				branch: "$_id.branch",
				semester: "$_id.semester",
				section: "$_id.section",
				scholarNo: "$_id.scholarNo",
				month: "$_id.month",
				totalSessions: 1,
				presentCount: 1,
				attendancePercentage: {
					$multiply: [
						{
							$divide: ["$presentCount", "$totalSessions"],
						},
						100,
					],
				},
			},
		},
	];
}
