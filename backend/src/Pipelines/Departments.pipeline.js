export const getDepartments = async () => {
	return [
		{
			$group: {
				_id: "$department",
				count: {
					$sum: 1,
				},
			},
		},
	];
};
