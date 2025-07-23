export const getBranches = async () => {
	return [
		{
			"$group": {
				"_id": { "branch": "$branch", "batch": "$batch" },
				"sections": { "$addToSet": "$section" }
			}
		},
		{
			"$group": {
				"_id": "$_id.branch",
				"sessions": {
					"$push": {
						"batch": "$_id.batch",
						"sections": "$sections"
					}
				}
			}
		},
		{
			"$project": {
				"_id": 0,
				"branch": "$_id",
				"sessions": 1
			}
		}
	];
};
