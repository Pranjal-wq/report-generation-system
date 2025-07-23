const DeptWiseSubs = async () => {
    return [
        {
            "$group": {
                "_id": "$department",
                "subjects": {
                    "$push": {
                        "subjectCode": "$subjectCode",
                        "subjectName": "$subjectName",
                        "isElective": "$isElective"
                    }
                }
            }
        }
    ]
}