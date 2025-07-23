export const getOverallReportSubjectWise = async (
    ownerId,
    subjectId,
    section,
    scholarNumber = null // Optional parameter for filtering by specific scholar number
  ) => {
    const pipeline = [
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
  
    // Add filter for specific scholar number if provided
    if (scholarNumber) {
      pipeline.push({
        $match: {
          scholarNumber: scholarNumber
        }
      });
    }
  
    return pipeline;
  };