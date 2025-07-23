import { getDB } from "../../config/mongodb.js";

export async function getUnmarkedAttendanceDates(
	ownerId,
	subjectId,
	startISO,
	endISO
) {
	try {
		const db = await getDB();
		const col = db.collection("Attendance");
		const pipeline = [
			// 1) Match the specific document(s) by ownerId & subjectId
			{
				$match: {
					ownerId: ownerId.toString(),
					subjectId: subjectId,
				},
			},
			// 2) Project and transform attendance & isMarked fields
			{
				$project: {
					attendanceDates: {
						$set: {
							$map: {
								input: "$attendance",
								as: "att",
								in: {
									$dateToString: {
										format: "%Y-%m-%d",
										date: { $toDate: "$$att.date" },
									},
								},
							},
						},
					},
					isMarkedDates: {
						$set: {
							$map: {
								input: "$isMarked",
								as: "markStr",
								in: {
									$let: {
										vars: { parts: { $split: ["$$markStr", " "] } },
										in: { $arrayElemAt: ["$$parts", -1] },
									},
								},
							},
						},
					},
				},
			},
			// 3) Add an array of all dates in the given range using $function
			{
				$addFields: {
					allDatesInRange: {
						$function: {
							body: function (startISO, endISO) {
								const start = new Date(startISO);
								const end = new Date(endISO);
								const result = [];
								let cursor = new Date(start);
								while (cursor <= end) {
									const yyyy = cursor.getFullYear();
									const mm = String(cursor.getMonth() + 1).padStart(2, "0");
									const dd = String(cursor.getDate()).padStart(2, "0");
									result.push(`${yyyy}-${mm}-${dd}`);
									cursor.setDate(cursor.getDate() + 1);
								}
								return result;
							},
							args: [startISO, endISO],
							lang: "js",
						},
					},
				},
			},
			// 4) Project unmarked dates
			{
				$project: {
					unmarkedInAttendance: {
						$setDifference: ["$allDatesInRange", "$attendanceDates"],
					},
					unmarkedInIsMarked: {
						$setDifference: ["$allDatesInRange", "$isMarkedDates"],
					},
				},
			},
		];
		const result = await col.aggregate(pipeline).toArray();
		return {
			status: "ok",
			message: "Success",
			data: result,
		};
	} catch (err) {
		return {
			status: "err",
			message: err.message,
			data: [],
		};
	}
}
