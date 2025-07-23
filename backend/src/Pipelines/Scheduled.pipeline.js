import { ObjectId } from "mongodb";
import { start } from "repl";
// Gives the scheduled classes in between the two dates
export const getScheduledClasses = async (data) => {
	const { ownerId, startDate, endDate, subjectId } = data;

	let pipeline = [
		{
			$match: {
				ownerId: new ObjectId(ownerId),
			},
		},
		{
			$addFields: {
				totalDays: {
					$add: [
						{
							$dateDiff: {
								startDate: new Date(startDate),
								endDate: new Date(endDate),
								unit: "day",
							},
						},
						1,
					],
				},
			},
		},
		{
			$addFields: {
				numberOfWeeks: {
					$floor: {
						$divide: ["$totalDays", 7],
					},
				},
				remainderDays: {
					$mod: ["$totalDays", 7],
				},
			},
		},
		{
			$project: {
				TimeTable: 1,
				numberOfWeeks: 1,
				remainderDays: 1,
			},
		},
		{
			$project: {
				timetableArray: {
					$objectToArray: "$TimeTable",
				},
				numberOfWeeks: 1,
				remainderDays: 1,
			},
		},
		{
			$unwind: "$timetableArray",
		},
		{
			$unwind: "$timetableArray.v",
		},
		// Optional: match by subjectId if provided
		...(subjectId
			? [
					{
						$match: {
							"timetableArray.v.subject.subjectCode": subjectId,
						},
					},
			  ]
			: []),
		{
			$addFields: {
				dayNumber: {
					$toInt: "$timetableArray.k",
				},
			},
		},
		{
			$addFields: {
				extraOccurrence: {
					$cond: [
						{
							$lte: ["$dayNumber", "$remainderDays"],
						},
						1,
						0,
					],
				},
			},
		},
		{
			$group: {
				_id: "$timetableArray.v.subject.subjectCode",
				subjectName: {
					$first: "$timetableArray.v.subject.subjectName",
				},
				scheduledClasses: {
					$sum: {
						$add: ["$numberOfWeeks", "$extraOccurrence"],
					},
				},
			},
		},
	];
	return pipeline;
};
