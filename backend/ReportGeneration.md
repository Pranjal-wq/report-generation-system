# Project: ReportGeneration
### Welcome to the API Documentation of the Attendance Report Generation System

- Note : The Report Generation System is basically Read Only based . So there will be no put,delete request's . But we will be using the post request so that the messages could be transported in safe manner as the protcol of https will be followed in the production evironmet

## End-point: StudentDetails
### Method: POST
>```
>http://localhost:3000/api/student/details
>```
### Body (**raw**)

```json
{
    "scholarNumber":"2211201179"
}
```

### Response: 200
```json
[
    {
        "_id": "678d3d92d5665f6a3eb3f957",
        "scholarNumber": "2211201152",
        "StudentName": "VELPUCHERLA YOGANANDA REDDY",
        "branch": "CSE",
        "section": "1",
        "batch": "2022-26"
    }
]
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: MonthlyReport
### Method: POST
>```
>http://localhost:3000/api/student/attendance/monthly
>```
### Body (**raw**)

```json
{
    "scholarNumber":"2211201137"
    
}
```

### Response: 200
```json
[
    {
        "totalSessions": 9,
        "presentCount": 9,
        "subjectName": "Advanced Data Structures",
        "subjectId": "678dfa8ad5665f6a3eb3fa67",
        "branch": "CSE",
        "semester": "VI",
        "section": "01",
        "scholarNo": "2211201109",
        "month": "2025-01",
        "attendancePercentage": 100,
        "subjectCode": "CSE357"
    },
    {
        "totalSessions": 9,
        "presentCount": 9,
        "subjectName": "Network & System Securities (T)",
        "subjectId": "678ce483cd76735183ab8349",
        "branch": "CSE",
        "semester": "VI",
        "section": "01",
        "scholarNo": "2211201109",
        "month": "2025-01",
        "attendancePercentage": 100,
        "subjectCode": "CSE323"
    },
    {
        "totalSessions": 5,
        "presentCount": 3,
        "subjectName": "Network & System Securities (T)",
        "subjectId": "678ce483cd76735183ab8349",
        "branch": "CSE",
        "semester": "VI",
        "section": "01",
        "scholarNo": "2211201109",
        "month": "2025-02",
        "attendancePercentage": 60,
        "subjectCode": "CSE323"
    },
    {
        "totalSessions": 2,
        "presentCount": 2,
        "subjectName": "Advanced Data Structures",
        "subjectId": "678dfa8ad5665f6a3eb3fa67",
        "branch": "CSE",
        "semester": "VI",
        "section": "01",
        "scholarNo": "2211201109",
        "month": "2025-02",
        "attendancePercentage": 100,
        "subjectCode": "CSE357"
    },
    {
        "totalSessions": 3,
        "presentCount": 3,
        "subjectName": "Machine Learning",
        "subjectId": "678ce483cd76735183ab8347",
        "branch": "CSE",
        "semester": "VI",
        "section": "01",
        "scholarNo": "2211201109",
        "month": "2025-01",
        "attendancePercentage": 100,
        "subjectCode": "CSE321"
    },
    {
        "totalSessions": 4,
        "presentCount": 4,
        "subjectName": "Machine Learning",
        "subjectId": "678ce483cd76735183ab8347",
        "branch": "CSE",
        "semester": "VI",
        "section": "01",
        "scholarNo": "2211201109",
        "month": "2025-02",
        "attendancePercentage": 100,
        "subjectCode": "CSE321"
    }
]
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: FacultyDetails
### Method: GET
>```
>http://localhost:3000/api/faculty/details?employeeCode=110262198424
>```
### Query Params

|Param|value|
|---|---|
|employeeCode|110262198424|


### Response: 200
```json
{
    "status": "ok",
    "message": "Success",
    "data": {
        "_id": "678ce4d0cd76735183ab8350",
        "name": "Meenu Chawla",
        "password": "$2b$12$/uO0dJ87WO5RtqhRI1otDej46.tm5R64mrb.HLGpSVlgmyufIRXZi",
        "about": "Available",
        "employeeCode": "0640",
        "role": "Prof",
        "department": "CSE",
        "email": "meenuchawlamanit@gmail.com",
        "phone": "7554051302",
        "abbreviation": "MC"
    }
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: FacultySubjectList
_**Gives the Subjects taught by a particular faculty**_
### Method: GET
>```
>http://localhost:3000/api/faculty/Subjects?employeeCode=110262198424
>```
### Body (**raw**)

```json

```

### Query Params

|Param|value|
|---|---|
|employeeCode|110262198424|


### Response: 200
```json
{
    "status": "ok",
    "message": "Success",
    "data": [
        {
            "subject": {
                "_id": "678dfa8ad5665f6a3eb3fa67",
                "subjectCode": "CSE357",
                "subjectName": "Advanced Data Structures",
                "department": "CSE",
                "isElective": false
            },
            "branch": "CSE",
            "semester": "VI",
            "section": "1",
            "location": "LRC A Block Ground Floor",
            "course": "B-Tech",
            "session": "2022-26"
        }
    ]
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: FacultyAttendanceClasswise
### _**This is the api responsible to handle the data of attendance of a particular class in a particular subject taught by the faculty .**_
### Method: POST
>```
>http://localhost:3000/api/faculty/attendance/classwise
>```
### Body (**raw**)

```json
{
    "ownerId":"678ce4d0cd76735183ab8350",
    "subjectId":"678dfa8ad5665f6a3eb3fa67",
    "course":"B-Tech",
    "branch":"CSE",
    "semester":"VI",
    "section":"1",
    "session":"2022-26"

}
```

### Response: 200
```json
{
    "status": "ok",
    "message": "Success",
    "data": {
        "totalClass": 11,
        "attendace": {
            "2211201101": 9,
            "2211201102": 7,
            "2211201103": 10,
            "2211201104": 10,
            "2211201105": 9,
            "2211201106": 10,
            "2211201107": 10,
            "2211201108": 8,
            "2211201109": 11,
            "2211201110": 10,
            "2211201111": 10,
            "2211201112": 11,
            "2211201113": 8,
            "2211201114": 11,
            "2211201115": 10,
            "2211201116": 10,
            "2211201117": 11,
            "2211201118": 11,
            "2211201119": 10,
            "2211201120": 10,
            "2211201121": 10,
            "2211201122": 11,
            "2211201123": 8,
            "2211201124": 11,
            "2211201125": 10,
            "2211201126": 11,
            "2211201127": 5,
            "2211201128": 4,
            "2211201129": 9,
            "2211201130": 11,
            "2211201131": 11,
            "2211201132": 11,
            "2211201133": 2,
            "2211201134": 11,
            "2211201135": 11,
            "2211201137": 7,
            "2211201138": 11,
            "2211201139": 10,
            "2211201140": 10,
            "2211201141": 10,
            "2211201142": 9,
            "2211201143": 11,
            "2211201144": 11,
            "2211201145": 8,
            "2211201146": 7,
            "2211201147": 10,
            "2211201148": 11,
            "2211201149": 11,
            "2211201150": 10,
            "2211201151": 11,
            "2211201152": 9,
            "2211201153": 7,
            "2211201154": 6,
            "2211201155": 9,
            "2211201156": 10,
            "2211201157": 9,
            "2211201158": 10,
            "2211201159": 10,
            "2211201160": 11,
            "2211201161": 9,
            "2211201162": 10,
            "2211201163": 11,
            "2211201164": 11,
            "2211201165": 11,
            "2211201166": 10,
            "2211201167": 11,
            "2211201168": 11,
            "2211201169": 11,
            "2211201170": 8,
            "2211201171": 11,
            "2211201172": 9,
            "2211201173": 11,
            "2211201174": 10,
            "2211201175": 8,
            "2211201176": 10,
            "2211201177": 6,
            "2211201178": 2,
            "2211201179": 9,
            "2211201180": 11
        }
    }
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: StudetOverallReport
### Method: POST
>```
>http://10.3.1.6:3000/api/attendance/attendanceByScholarId
>```
### Headers

|Content-Type|Value|
|---|---|
|authorization|{{vault:json-web-token}}|


### Body (**raw**)

```json
{
    "scholarNumber":"2211201152"
}
```

### Response: 200
```json
{
    "studentName": "VELPUCHERLA YOGANANDA REDDY",
    "scholarNumber": "2211201152",
    "summary": [
        {
            "subName": "Network & System Securities (T)",
            "subCode": "CSE323",
            "employee": "Deepak Singh Tomar",
            "total": 22,
            "present": 22
        },
        {
            "subName": "Advanced Data Structures",
            "subCode": "CSE357",
            "employee": "Meenu Chawla",
            "total": 11,
            "present": 11
        },
        {
            "subName": "Machine Learning",
            "subCode": "CSE321",
            "employee": "R. K. Pateriya",
            "total": 7,
            "present": 7
        },
        {
            "subName": "Machine Learning Lab",
            "subCode": "CSE324",
            "employee": "R. K. Pateriya",
            "total": 0,
            "present": 0
        },
        {
            "subName": "Network & System Securities (T)",
            "subCode": "CSE323",
            "employee": "Pankaj Kumar",
            "total": 1,
            "present": 1
        },
        {
            "subName": "Hadoop & CUDA Lab",
            "subCode": "CSE326",
            "employee": "Yadunath Pathak",
            "total": 0,
            "present": 0
        }
    ]
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: FaculityListDepartmentWise
### Gives the Faculty List Departmental Wise
### Method: GET
>```
>http://localhost:3000/api/faculty/list?department=CSE
>```
### Query Params

|Param|value|
|---|---|
|department|CSE|


### Response: 200
```json
[
    {
        "name": "Meenu Chawla",
        "employeeCode": "0640",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "MC"
    },
    {
        "name": "Nilay Khare",
        "employeeCode": "1145",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "NK"
    },
    {
        "name": "R. K. Pateriya",
        "employeeCode": "824",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "RKP"
    },
    {
        "name": "Deepak Singh Tomar",
        "employeeCode": "1067",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "DST"
    },
    {
        "name": "Vasudev Dehalwar",
        "employeeCode": "805",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "VD"
    },
    {
        "name": "Manish Pandey",
        "employeeCode": "110001412044",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "MP"
    },
    {
        "name": "Mansi Gyanchandani",
        "employeeCode": "110082107194",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "MG"
    },
    {
        "name": "Sanyam Shukla",
        "employeeCode": "110071438193",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "SS"
    },
    {
        "name": "Jaytrilok Choudhary",
        "employeeCode": "111001410822",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "JTC"
    },
    {
        "name": "Saritha Khetawat",
        "employeeCode": "110021412043",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "SK"
    },
    {
        "name": "Akhtar Rasool",
        "employeeCode": "110031438195",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "AR"
    },
    {
        "name": "Dhirendra Pratap Singh",
        "employeeCode": "110081410840",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "DPS"
    },
    {
        "name": "Shweta Jain",
        "employeeCode": "110011412004",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "SJ"
    },
    {
        "name": "Mitul Kumar Ahirwal",
        "employeeCode": "110056130526",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "MA"
    },
    {
        "name": "Jyoti Bharti",
        "employeeCode": "110001438191",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "JB"
    },
    {
        "name": "Namita Tiwari",
        "employeeCode": "110032107093",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "NT"
    },
    {
        "name": "Bholanath Roy",
        "employeeCode": "110072191476",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "BNR"
    },
    {
        "name": "Vijay Bhaskar",
        "employeeCode": "111102755151",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "VB"
    },
    {
        "name": "Pragati Agarwal",
        "employeeCode": "110173897486",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "PA"
    },
    {
        "name": "Vaibhav Soni",
        "employeeCode": "110114474888",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "VS"
    },
    {
        "name": "Akash Sinha",
        "employeeCode": "110178736963",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "AS"
    },
    {
        "name": "Yadunath Pathak",
        "employeeCode": "110138049596",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "YP"
    },
    {
        "name": "Shweta Bhandari",
        "employeeCode": "11017621676",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "SB"
    },
    {
        "name": "Aashish Kumar Sahu",
        "employeeCode": "110117156803",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "AKS"
    },
    {
        "name": "Pankaj Kumar",
        "employeeCode": "110202315844",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "PK"
    },
    {
        "name": "Rajesh Wadhvani",
        "employeeCode": "110031410848",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "RW"
    },
    {
        "name": "Vikram Garg",
        "employeeCode": "110178597949",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "VG"
    },
    {
        "name": "Ramesh Kumar Thakur",
        "employeeCode": "110262198424",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "RT"
    },
    {
        "name": "Nikhlesh Pathik",
        "employeeCode": "CF12030",
        "role": "Contract Faculty",
        "department": "CSE",
        "abbreviation": "NP"
    },
    {
        "name": "Lalit Kumar",
        "employeeCode": "CF12031",
        "role": "Contract Faculty",
        "department": "CSE",
        "abbreviation": "LK"
    },
    {
        "name": "Khushboo Singh",
        "employeeCode": "CF12032",
        "role": "Contract Faculty",
        "department": "CSE",
        "abbreviation": "KS"
    },
    {
        "name": "Babita Pathik",
        "employeeCode": "CF12033",
        "role": "Contract Faculty",
        "department": "CSE",
        "abbreviation": "BP"
    },
    {
        "name": "Sreemoyee Biswas",
        "employeeCode": "CF12034",
        "role": "Contract Faculty",
        "department": "CSE",
        "abbreviation": "SBS"
    },
    {
        "name": "Muktesh Gupta",
        "employeeCode": "CF12035",
        "role": "Contract Faculty",
        "department": "CSE",
        "abbreviation": "MUG"
    },
    {
        "name": "Mohit Kushwaha",
        "employeeCode": "CF12036",
        "role": "Contract Faculty",
        "department": "CSE",
        "abbreviation": "MK"
    },
    {
        "name": "Rakesh Kundan",
        "employeeCode": "211112011",
        "role": "STU",
        "department": "CSE"
    },
    {
        "name": "Manisha Singh",
        "employeeCode": "2302",
        "role": "Prof",
        "department": "CSE",
        "abbreviation": "MS"
    },
    {
        "name": "test1",
        "employeeCode": "test1",
        "role": "STU",
        "department": "CSE"
    }
]
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: GetDepartments
### This is route through which departments data is transported to the director

- Role Based : Director Role
### Method: GET
>```
>http://localhost:3000/api/director/getDepartments
>```
### Response: 200
```json
[
    {
        "_id": "CEPDSM",
        "count": 5
    },
    {
        "_id": "CHEMISTRY",
        "count": 10
    },
    {
        "_id": "MGMT",
        "count": 8
    },
    {
        "_id": "PHY",
        "count": 17
    },
    {
        "_id": "CSE",
        "count": 38
    },
    {
        "_id": "ENERGY",
        "count": 8
    },
    {
        "_id": "ECE",
        "count": 27
    },
    {
        "_id": "EE",
        "count": 28
    },
    {
        "_id": "MME",
        "count": 9
    },
    {
        "_id": "HSS",
        "count": 5
    },
    {
        "_id": "110202195592",
        "count": 1
    },
    {
        "_id": "CHEM",
        "count": 13
    }
]
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: FacultyAttendance
### _**It will return the report of the faculty's attendance . Tell's how many classes were scheduledadhow many did he take in them between two dates**_

> Role based : Director , HOD
### Method: POST
>```
>http://localhost:3000/api/faculty/facultyAttendance
>```
### Body (**raw**)

```json
{
   "employeeCode": "0640",
  
       "endDate":"2025-03-13T00:00:00.000Z"



    
    
}
```

### Response: 200
```json
{
    "scheduledClasses": [
        {
            "_id": "CSE357",
            "subjectName": "Advanced Data Structures",
            "scheduledClasses": 14
        }
    ],
    "subjectWiseAttendance": [
        [
            "CSE357",
            {
                "total": 9,
                "marked": 11
            }
        ]
    ]
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: nameToEmpCode
### Takes the input of the user name and gives the employee code
### Method: POST
>```
>http://localhost:3000/api/faculty/nameToEmpCode
>```
### Body (**raw**)

```json
{
    "name":"Ramesh Kumar Thakur"
}
```

### Response: 200
```json
"110262198424"
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: TimeTable
### This api is for TimeTable of a particular faculty by usig their employeeCode
### Method: GET
>```
>http://localhost:3000/api/faculty/timetable?empCode=0640
>```
### Body (**raw**)

```json
{
   "employeeCode":"110262198424"
}
```

### Query Params

|Param|value|
|---|---|
|empCode|0640|


### Response: 200
```json
{
    "1": [
        {
            "subject": {
                "_id": "678dfa8ad5665f6a3eb3fa67",
                "subjectCode": "CSE357",
                "subjectName": "Advanced Data Structures",
                "department": "CSE",
                "isElective": false
            },
            "branch": "CSE",
            "semester": "VI",
            "timing": "12:00-01:00PM",
            "section": "1",
            "location": "LRC A Block Ground Floor",
            "course": "B-Tech",
            "session": "2022-26"
        }
    ],
    "2": [],
    "3": [
        {
            "subject": {
                "_id": "678dfa8ad5665f6a3eb3fa67",
                "subjectCode": "CSE357",
                "subjectName": "Advanced Data Structures",
                "department": "CSE",
                "isElective": false
            },
            "branch": "CSE",
            "semester": "VI",
            "timing": "11:00-12:00PM",
            "section": "1",
            "location": "LRC A Block Ground Floor",
            "course": "B-Tech",
            "session": "2022-26"
        }
    ],
    "4": [],
    "5": [
        {
            "subject": {
                "_id": "678dfa8ad5665f6a3eb3fa67",
                "subjectCode": "CSE357",
                "subjectName": "Advanced Data Structures",
                "department": "CSE",
                "isElective": false
            },
            "branch": "CSE",
            "semester": "VI",
            "timing": "12:00-01:00PM",
            "section": "1",
            "location": "LRC A Block Ground Floor",
            "course": "B-Tech",
            "session": "2022-26"
        }
    ],
    "6": [],
    "7": []
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: GetClassReport
#### **This endpoint returns the data of the attendance of the students of a particular class in a particular subject**
### Method: POST
>```
>http://localhost:3000/api/faculty/classReport
>```
### Body (**raw**)

```json
{
    "employeeCode": "0640",
    "subjectId": "678dfa8ad5665f6a3eb3fa67",
    "branch": "CSE",
    "section": "1"
}
```

### Response: 200
```json
{
    "totalClasses": 11,
    "report": [
        {
            "totalPresent": 8,
            "name": "EDUPUGANTI YASWANTH"
        },
        {
            "totalPresent": 11,
            "name": "Aditya  Raj Singh   Bhadoria"
        },
        {
            "totalPresent": 9,
            "name": "Mayank  suryavanshi"
        },
        {
            "totalPresent": 7,
            "name": "Samala Pramod"
        },
        {
            "totalPresent": 11,
            "name": "VEMULA TEJA MANIDEEP"
        },
        {
            "totalPresent": 10,
            "name": "RITIK  CHAND"
        },
        {
            "totalPresent": 11,
            "name": "sakshi  rai"
        },
        {
            "totalPresent": 9,
            "name": "Ashlin  Jojy"
        },
        {
            "totalPresent": 8,
            "name": "ANIKET SANJAY BHUJBAL"
        },
        {
            "totalPresent": 10,
            "name": "Sameeksha  Prusty"
        },
        {
            "totalPresent": 8,
            "name": "Utkarsh  Solanki"
        },
        {
            "totalPresent": 10,
            "name": "Aaditya Pahariya"
        },
        {
            "totalPresent": 10,
            "name": "chaitanya shailesh kulkarni"
        },
        {
            "totalPresent": 11,
            "name": "RISHIKA  BUWADE"
        },
        {
            "totalPresent": 10,
            "name": "ARUN KUMAR"
        },
        {
            "totalPresent": 9,
            "name": "Mansi Upadhyay"
        },
        {
            "totalPresent": 11,
            "name": "Parag  Sewani"
        },
        {
            "totalPresent": 10,
            "name": "KRATIK  MEHTA"
        },
        {
            "totalPresent": 11,
            "name": "Rahul  Kumar"
        },
        {
            "totalPresent": 10,
            "name": "Rahul Kumar"
        },
        {
            "totalPresent": 10,
            "name": "Pawan Kumar Tiwari"
        },
        {
            "totalPresent": 7,
            "name": "PALAK AGRAWAL"
        },
        {
            "totalPresent": 8,
            "name": "Suraj  Dhakad"
        },
        {
            "totalPresent": 10,
            "name": "Karan Ajaykumar Kute"
        },
        {
            "totalPresent": 7,
            "name": "Shayan Fahimi"
        },
        {
            "totalPresent": 9,
            "name": "PRANJAL JAIN"
        },
        {
            "totalPresent": 11,
            "name": "KUMMARI  SIDDHARTH"
        },
        {
            "totalPresent": 5,
            "name": "sanskrati  khujvar"
        },
        {
            "totalPresent": 10,
            "name": "ROHIT  RATAN NAGAR"
        },
        {
            "totalPresent": 8,
            "name": "Ankit  Choudhary"
        },
        {
            "totalPresent": 11,
            "name": "Utkarsh Gupta"
        },
        {
            "totalPresent": 11,
            "name": "SHAIK  ABDUL HAFEEZ"
        },
        {
            "totalPresent": 9,
            "name": "SHREYANSH SINGH"
        },
        {
            "totalPresent": 11,
            "name": "Nallipogu Poojitha"
        },
        {
            "totalPresent": 9,
            "name": "VELPUCHERLA YOGANANDA REDDY"
        },
        {
            "totalPresent": 11,
            "name": "Keerthi   Bommareddy"
        },
        {
            "totalPresent": 9,
            "name": "Venkata Sai Sasikar     Bachali"
        },
        {
            "totalPresent": 10,
            "name": "Arpit Verma"
        },
        {
            "totalPresent": 10,
            "name": "Dhananjay Borban"
        },
        {
            "totalPresent": 11,
            "name": "Aditya  Dubey"
        },
        {
            "totalPresent": 11,
            "name": "princy  patwa"
        },
        {
            "totalPresent": 11,
            "name": "CHERUKURI LALITH SRI SAI"
        },
        {
            "totalPresent": 10,
            "name": "SWASTIK  DUBEY"
        },
        {
            "totalPresent": 7,
            "name": "Chirag singh  paliya"
        },
        {
            "totalPresent": 10,
            "name": "HUSAIN  MATKAWALA"
        },
        {
            "totalPresent": 6,
            "name": "MALLAVOLU S N S R S G V VISWANADH"
        },
        {
            "totalPresent": 9,
            "name": "Ajay Sharma"
        },
        {
            "totalPresent": 11,
            "name": "Govinda Rathore"
        },
        {
            "totalPresent": 10,
            "name": "Satyam Gupta"
        },
        {
            "totalPresent": 11,
            "name": "Prem  Kumar"
        },
        {
            "totalPresent": 11,
            "name": "SAMARTH AGRAWAL"
        },
        {
            "totalPresent": 9,
            "name": "Abhinav Chawda"
        },
        {
            "totalPresent": 6,
            "name": "K  Sujith  Kumar"
        },
        {
            "totalPresent": 11,
            "name": "Naman  Agrawal"
        },
        {
            "totalPresent": 11,
            "name": "KALPIT NAGAR"
        },
        {
            "totalPresent": 8,
            "name": "GUPTA DEVESH PRADEEP KUMAR"
        },
        {
            "totalPresent": 4,
            "name": "GADI CHARAN SHYAM"
        },
        {
            "totalPresent": 11,
            "name": "Khushi  Sayyed"
        },
        {
            "totalPresent": 10,
            "name": "SABA SAIYEDA"
        },
        {
            "totalPresent": 11,
            "name": "Yagyesh  Goyal"
        },
        {
            "totalPresent": 11,
            "name": "Tanmay  Jha"
        },
        {
            "totalPresent": 10,
            "name": "CHARLOTTE ANN SINGH"
        },
        {
            "totalPresent": 10,
            "name": "Pranshu  Agrawal"
        },
        {
            "totalPresent": 10,
            "name": "Adithya  Salel"
        },
        {
            "totalPresent": 2,
            "name": "SUBRATA HALDAR"
        },
        {
            "totalPresent": 11,
            "name": "Keshav Anand Bhagat"
        },
        {
            "totalPresent": 11,
            "name": "Tasila  Poorna  shree"
        },
        {
            "totalPresent": 11,
            "name": "cheenepalli sai pavan"
        },
        {
            "totalPresent": 10,
            "name": "ARSALAN  MOID"
        },
        {
            "totalPresent": 10,
            "name": "Mohammad  Faiz Chouhan"
        },
        {
            "totalPresent": 11,
            "name": "Prajjwal Chouhan"
        },
        {
            "totalPresent": 10,
            "name": "SUDHANSHU MAHLE"
        },
        {
            "totalPresent": 10,
            "name": "Pratik  Verma"
        },
        {
            "totalPresent": 11,
            "name": "SRAJAN BHAGAT"
        },
        {
            "totalPresent": 11,
            "name": "Abhinav Kumar Yadav"
        },
        {
            "totalPresent": 2,
            "name": "Saurav  Kumar"
        },
        {
            "totalPresent": 10,
            "name": "SANJAY KOTHAPALLI"
        },
        {
            "totalPresent": 9,
            "name": "MAMUNURI  VISHWENDRA CHARY"
        },
        {
            "totalPresent": 11,
            "name": "Ajay Yadav"
        }
    ]
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: getSubjectsAccToSection
### Method: GET
>```
>http://localhost:3000/api/director/getSubjectsAccToSection?branch=CSE&session=2022-26&section=1
>```
### Query Params

|Param|value|
|---|---|
|branch|CSE|
|session|2022-26|
|section|1|


### Response: 200
```json
{
    "subjects": [
        {
            "subCode": "CSE357",
            "subjectName": "Advanced Data Structures",
            "subjectId": "678dfa8ad5665f6a3eb3fa67",
            "ownerId": "678ce4d0cd76735183ab8350"
        },
        {
            "subCode": "CSE321",
            "subjectName": "Machine Learning",
            "subjectId": "678ce483cd76735183ab8347",
            "ownerId": "678ce4d1cd76735183ab8354"
        },
        {
            "subCode": "CSE324",
            "subjectName": "Machine Learning Lab",
            "subjectId": "678ce483cd76735183ab834e",
            "ownerId": "678ce4d1cd76735183ab8354"
        },
        {
            "subCode": "CSE323",
            "subjectName": "Network & System Securities (T)",
            "subjectId": "678ce483cd76735183ab8349",
            "ownerId": "678ce4d1cd76735183ab8356"
        },
        {
            "subCode": "CSE326",
            "subjectName": "Hadoop & CUDA Lab",
            "subjectId": "678ce483cd76735183ab834f",
            "ownerId": "678ce4d5cd76735183ab837a"
        }
    ]
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: ownerIdToEmp
### Method: GET
>```
>http://localhost:3000/api/director/ownerIdToEmp
>```
### Response: 200
```json
{
    "result": [
        {
            "_id": "678ce4d0cd76735183ab8350",
            "employeeCode": "0640"
        },
        {
            "_id": "678ce4d0cd76735183ab8352",
            "employeeCode": "1145"
        },
        {
            "_id": "678ce4d1cd76735183ab8354",
            "employeeCode": "824"
        },
        {
            "_id": "678ce4d1cd76735183ab8356",
            "employeeCode": "1067"
        },
        {
            "_id": "678ce4d1cd76735183ab8358",
            "employeeCode": "805"
        },
        {
            "_id": "678ce4d1cd76735183ab835a",
            "employeeCode": "110001412044"
        },
        {
            "_id": "678ce4d2cd76735183ab835c",
            "employeeCode": "110082107194"
        },
        {
            "_id": "678ce4d2cd76735183ab835e",
            "employeeCode": "110071438193"
        },
        {
            "_id": "678ce4d2cd76735183ab8360",
            "employeeCode": "111001410822"
        },
        {
            "_id": "678ce4d2cd76735183ab8362",
            "employeeCode": "110021412043"
        },
        {
            "_id": "678ce4d3cd76735183ab8364",
            "employeeCode": "110031438195"
        },
        {
            "_id": "678ce4d3cd76735183ab8366",
            "employeeCode": "110081410840"
        },
        {
            "_id": "678ce4d3cd76735183ab8368",
            "employeeCode": "110011412004"
        },
        {
            "_id": "678ce4d3cd76735183ab836a",
            "employeeCode": "110056130526"
        },
        {
            "_id": "678ce4d4cd76735183ab836c",
            "employeeCode": "110001438191"
        },
        {
            "_id": "678ce4d4cd76735183ab836e",
            "employeeCode": "110032107093"
        },
        {
            "_id": "678ce4d4cd76735183ab8370",
            "employeeCode": "110072191476"
        },
        {
            "_id": "678ce4d4cd76735183ab8372",
            "employeeCode": "111102755151"
        },
        {
            "_id": "678ce4d5cd76735183ab8374",
            "employeeCode": "110173897486"
        },
        {
            "_id": "678ce4d5cd76735183ab8376",
            "employeeCode": "110114474888"
        },
        {
            "_id": "678ce4d5cd76735183ab8378",
            "employeeCode": "110178736963"
        },
        {
            "_id": "678ce4d5cd76735183ab837a",
            "employeeCode": "110138049596"
        },
        {
            "_id": "678ce4d6cd76735183ab837c",
            "employeeCode": "11017621676"
        },
        {
            "_id": "678ce4d6cd76735183ab837e",
            "employeeCode": "110117156803"
        },
        {
            "_id": "678ce4d6cd76735183ab8380",
            "employeeCode": "110202315844"
        },
        {
            "_id": "678ce4d6cd76735183ab8382",
            "employeeCode": "110031410848"
        },
        {
            "_id": "678ce4d7cd76735183ab8384",
            "employeeCode": "110178597949"
        },
        {
            "_id": "678ce4d7cd76735183ab8386",
            "employeeCode": "110262198424"
        },
        {
            "_id": "678ce4d7cd76735183ab8388",
            "employeeCode": "CF12030"
        },
        {
            "_id": "678ce4d7cd76735183ab838a",
            "employeeCode": "CF12031"
        },
        {
            "_id": "678ce4d8cd76735183ab838c",
            "employeeCode": "CF12032"
        },
        {
            "_id": "678ce4d8cd76735183ab838e",
            "employeeCode": "CF12033"
        },
        {
            "_id": "678ce4d8cd76735183ab8390",
            "employeeCode": "CF12034"
        },
        {
            "_id": "678ce4d8cd76735183ab8392",
            "employeeCode": "CF12035"
        },
        {
            "_id": "678ce4d9cd76735183ab8394",
            "employeeCode": "CF12036"
        },
        {
            "_id": "678ceacaaa5a723fd417fbce",
            "employeeCode": "211112011"
        },
        {
            "_id": "678d0756cd76735183ab844d",
            "employeeCode": "CHEM"
        },
        {
            "_id": "678f34b3d5665f6a3eb3fa97",
            "employeeCode": "866"
        },
        {
            "_id": "678f34b4d5665f6a3eb3fa99",
            "employeeCode": "110042107196"
        },
        {
            "_id": "678f34b4d5665f6a3eb3fa9b",
            "employeeCode": "111102755800"
        },
        {
            "_id": "678f34b4d5665f6a3eb3fa9d",
            "employeeCode": "110193897132"
        },
        {
            "_id": "678f34b5d5665f6a3eb3fa9f",
            "employeeCode": "111103897137"
        },
        {
            "_id": "678f34b5d5665f6a3eb3faa1",
            "employeeCode": "110163897500"
        },
        {
            "_id": "678f34b5d5665f6a3eb3faa3",
            "employeeCode": "110177593020"
        },
        {
            "_id": "678f34b5d5665f6a3eb3faa5",
            "employeeCode": "110178621991"
        },
        {
            "_id": "678f34b6d5665f6a3eb3faa7",
            "employeeCode": "110178597983"
        },
        {
            "_id": "678f34b6d5665f6a3eb3faa9",
            "employeeCode": "CF02002"
        },
        {
            "_id": "678fd0add5665f6a3eb3fcef",
            "employeeCode": "110021410843"
        },
        {
            "_id": "678fd0add5665f6a3eb3fcf1",
            "employeeCode": "110113036099"
        },
        {
            "_id": "678fd0add5665f6a3eb3fcf3",
            "employeeCode": "111105465409"
        },
        {
            "_id": "678fd0add5665f6a3eb3fcf5",
            "employeeCode": "110221060519"
        },
        {
            "_id": "678fd0aed5665f6a3eb3fcf7",
            "employeeCode": "110202199724"
        },
        {
            "_id": "67908452d5665f6a3eb3fd04",
            "employeeCode": "808"
        },
        {
            "_id": "67908452d5665f6a3eb3fd06",
            "employeeCode": "806"
        },
        {
            "_id": "67908452d5665f6a3eb3fd08",
            "employeeCode": "577"
        },
        {
            "_id": "67908453d5665f6a3eb3fd0a",
            "employeeCode": "643"
        },
        {
            "_id": "67908453d5665f6a3eb3fd0c",
            "employeeCode": "655"
        },
        {
            "_id": "67908453d5665f6a3eb3fd0e",
            "employeeCode": "868"
        },
        {
            "_id": "67908453d5665f6a3eb3fd10",
            "employeeCode": "917"
        },
        {
            "_id": "67908454d5665f6a3eb3fd12",
            "employeeCode": "968"
        },
        {
            "_id": "67908454d5665f6a3eb3fd14",
            "employeeCode": "978"
        },
        {
            "_id": "67908454d5665f6a3eb3fd16",
            "employeeCode": "110061412038"
        },
        {
            "_id": "67908454d5665f6a3eb3fd18",
            "employeeCode": "110071412256"
        },
        {
            "_id": "67908455d5665f6a3eb3fd1a",
            "employeeCode": "1006"
        },
        {
            "_id": "67908455d5665f6a3eb3fd1c",
            "employeeCode": "110061412041"
        },
        {
            "_id": "67908455d5665f6a3eb3fd1e",
            "employeeCode": "110081412040"
        },
        {
            "_id": "67908455d5665f6a3eb3fd20",
            "employeeCode": "110041412039"
        },
        {
            "_id": "67908456d5665f6a3eb3fd22",
            "employeeCode": "867"
        },
        {
            "_id": "67908456d5665f6a3eb3fd24",
            "employeeCode": "110052191477"
        },
        {
            "_id": "67908456d5665f6a3eb3fd26",
            "employeeCode": "110033798507"
        },
        {
            "_id": "67908457d5665f6a3eb3fd28",
            "employeeCode": "110001412013"
        },
        {
            "_id": "67908457d5665f6a3eb3fd2a",
            "employeeCode": "110063295307"
        },
        {
            "_id": "67908457d5665f6a3eb3fd2c",
            "employeeCode": "110153897487"
        },
        {
            "_id": "67908457d5665f6a3eb3fd2e",
            "employeeCode": "110175420223"
        },
        {
            "_id": "67908458d5665f6a3eb3fd30",
            "employeeCode": "110151507063"
        },
        {
            "_id": "67908458d5665f6a3eb3fd32",
            "employeeCode": "110179707523"
        },
        {
            "_id": "67908458d5665f6a3eb3fd34",
            "employeeCode": "110178940291"
        },
        {
            "_id": "67908458d5665f6a3eb3fd36",
            "employeeCode": "401000384909"
        },
        {
            "_id": "67908459d5665f6a3eb3fd38",
            "employeeCode": "110212194448"
        },
        {
            "_id": "6791fa28d5665f6a3eb40234",
            "employeeCode": "2302"
        },
        {
            "_id": "6793802dd5665f6a3eb40265",
            "employeeCode": "796"
        },
        {
            "_id": "6793802ed5665f6a3eb40267",
            "employeeCode": "110061412010"
        },
        {
            "_id": "6793802ed5665f6a3eb40269",
            "employeeCode": "110081412037"
        },
        {
            "_id": "6793802ed5665f6a3eb4026b",
            "employeeCode": "110189945654"
        },
        {
            "_id": "6793802fd5665f6a3eb4026d",
            "employeeCode": "110091412045"
        },
        {
            "_id": "6793802fd5665f6a3eb4026f",
            "employeeCode": "110143897501"
        },
        {
            "_id": "6793802fd5665f6a3eb40271",
            "employeeCode": "110178900163"
        },
        {
            "_id": "67972c8bd5665f6a3eb40287",
            "employeeCode": "573"
        },
        {
            "_id": "67972c8bd5665f6a3eb40289",
            "employeeCode": "798"
        },
        {
            "_id": "67972c8cd5665f6a3eb4028b",
            "employeeCode": "797"
        },
        {
            "_id": "67972c8cd5665f6a3eb4028d",
            "employeeCode": "873"
        },
        {
            "_id": "67972c8cd5665f6a3eb4028f",
            "employeeCode": "869"
        },
        {
            "_id": "67972c8cd5665f6a3eb40291",
            "employeeCode": "991"
        },
        {
            "_id": "67972c8dd5665f6a3eb40293",
            "employeeCode": "110061410824"
        },
        {
            "_id": "67972c8dd5665f6a3eb40295",
            "employeeCode": "110103897131"
        },
        {
            "_id": "67972c8dd5665f6a3eb40297",
            "employeeCode": "981"
        },
        {
            "_id": "67972c8dd5665f6a3eb40299",
            "employeeCode": "1008"
        },
        {
            "_id": "67972c8ed5665f6a3eb4029b",
            "employeeCode": "1021"
        },
        {
            "_id": "67972c8ed5665f6a3eb4029d",
            "employeeCode": "111001412036"
        },
        {
            "_id": "67972c8ed5665f6a3eb4029f",
            "employeeCode": "110011412035"
        },
        {
            "_id": "67972c8fd5665f6a3eb402a1",
            "employeeCode": "110031412017"
        },
        {
            "_id": "67972c8fd5665f6a3eb402a3",
            "employeeCode": "110044184932"
        },
        {
            "_id": "67972c8fd5665f6a3eb402a5",
            "employeeCode": "111001412019"
        },
        {
            "_id": "67972c8fd5665f6a3eb402a7",
            "employeeCode": "110011410818"
        },
        {
            "_id": "67972c90d5665f6a3eb402a9",
            "employeeCode": "110145420216"
        },
        {
            "_id": "67972c90d5665f6a3eb402ab",
            "employeeCode": "110179765955"
        },
        {
            "_id": "67972c90d5665f6a3eb402ad",
            "employeeCode": "110178900583"
        },
        {
            "_id": "67972c90d5665f6a3eb402af",
            "employeeCode": "110149925794"
        },
        {
            "_id": "67972c91d5665f6a3eb402b1",
            "employeeCode": "400050423719"
        },
        {
            "_id": "67972c91d5665f6a3eb402b3",
            "employeeCode": "110221060441"
        },
        {
            "_id": "67972c91d5665f6a3eb402b5",
            "employeeCode": "110212316161"
        },
        {
            "_id": "67972c91d5665f6a3eb402b7",
            "employeeCode": "1102"
        },
        {
            "_id": "67972c92d5665f6a3eb402b9",
            "employeeCode": "1101"
        },
        {
            "_id": "67972c92d5665f6a3eb402bb",
            "employeeCode": "1103"
        },
        {
            "_id": "67972c92d5665f6a3eb402bd",
            "employeeCode": "1104"
        },
        {
            "_id": "67975590d5665f6a3eb40475",
            "employeeCode": "110052107092"
        },
        {
            "_id": "67975590d5665f6a3eb40477",
            "employeeCode": "111002107193"
        },
        {
            "_id": "67975590d5665f6a3eb40479",
            "employeeCode": "110181066735"
        },
        {
            "_id": "67975591d5665f6a3eb4047b",
            "employeeCode": "110123897502"
        },
        {
            "_id": "67975591d5665f6a3eb4047d",
            "employeeCode": "110185420214"
        },
        {
            "_id": "67975591d5665f6a3eb4047f",
            "employeeCode": "110104024148"
        },
        {
            "_id": "67975591d5665f6a3eb40481",
            "employeeCode": "110050653256"
        },
        {
            "_id": "67975592d5665f6a3eb40483",
            "employeeCode": "110198834681"
        },
        {
            "_id": "67975592d5665f6a3eb40485",
            "employeeCode": "110178609369"
        },
        {
            "_id": "679880c7d5665f6a3eb405be",
            "employeeCode": "856"
        },
        {
            "_id": "679880c7d5665f6a3eb405c0",
            "employeeCode": "110021412009"
        },
        {
            "_id": "679880c7d5665f6a3eb405c2",
            "employeeCode": "110061412024"
        },
        {
            "_id": "679880c8d5665f6a3eb405c4",
            "employeeCode": "110103897498"
        },
        {
            "_id": "679880c8d5665f6a3eb405c6",
            "employeeCode": "110027466004"
        },
        {
            "_id": "679880c8d5665f6a3eb405c8",
            "employeeCode": "110198684975"
        },
        {
            "_id": "679880c9d5665f6a3eb405ca",
            "employeeCode": "110178969306"
        },
        {
            "_id": "679880c9d5665f6a3eb405cc",
            "employeeCode": "110202195432"
        },
        {
            "_id": "679880c9d5665f6a3eb405ce",
            "employeeCode": "110202195365"
        },
        {
            "_id": "679880c9d5665f6a3eb405d0",
            "employeeCode": "110212194370"
        },
        {
            "_id": "679880cad5665f6a3eb405d2",
            "employeeCode": "110212194398"
        },
        {
            "_id": "679880cad5665f6a3eb405d4",
            "employeeCode": "9720913159"
        },
        {
            "_id": "679880cad5665f6a3eb405d6",
            "employeeCode": "9042765640"
        },
        {
            "_id": "679880cad5665f6a3eb405d8",
            "employeeCode": "9042765640"
        },
        {
            "_id": "679880cad5665f6a3eb405da",
            "employeeCode": "7895814793"
        },
        {
            "_id": "679880cbd5665f6a3eb405de",
            "employeeCode": "8109469890"
        },
        {
            "_id": "679880cbd5665f6a3eb405e0",
            "employeeCode": "8109469890"
        },
        {
            "_id": "679918925e41b7622d9f146a",
            "employeeCode": "test1"
        },
        {
            "_id": "6799bf5be3054bdf5c973df9",
            "employeeCode": "971"
        },
        {
            "_id": "679cb7d7e3054bdf5c97400f",
            "employeeCode": "110105420218"
        },
        {
            "_id": "67a48239e3054bdf5c97423b",
            "employeeCode": "110001438188"
        },
        {
            "_id": "67a48239e3054bdf5c97423d",
            "employeeCode": "111002112913"
        },
        {
            "_id": "67a4823ae3054bdf5c97423f",
            "employeeCode": "111001410819"
        },
        {
            "_id": "67a4823ae3054bdf5c974241",
            "employeeCode": "110091410831"
        },
        {
            "_id": "67a4823ae3054bdf5c974243",
            "employeeCode": "110031410817"
        },
        {
            "_id": "67a4823ae3054bdf5c974245",
            "employeeCode": "110002805598"
        },
        {
            "_id": "67a4823be3054bdf5c974247",
            "employeeCode": "110041410825"
        },
        {
            "_id": "67a4823be3054bdf5c974249",
            "employeeCode": "110041410842"
        },
        {
            "_id": "67a9dd4fe3054bdf5c974363",
            "employeeCode": "110165420215"
        },
        {
            "_id": "67a9e9f4e3054bdf5c9744ef",
            "employeeCode": "110077182926"
        },
        {
            "_id": "67ad8ff550ae44dffc9cf611",
            "employeeCode": "110134467955"
        },
        {
            "_id": "67ad96a394ea4de47ad3f6db",
            "employeeCode": "110001410830"
        },
        {
            "_id": "67b404d9778cc8bb62460f1f",
            "employeeCode": "110135420211"
        },
        {
            "_id": "67b404d9778cc8bb62460f21",
            "employeeCode": "110091438189"
        },
        {
            "_id": "67b404d9778cc8bb62460f23",
            "employeeCode": "110071412015"
        },
        {
            "_id": "67b404d9778cc8bb62460f25",
            "employeeCode": "110031410820"
        },
        {
            "_id": "67b404da778cc8bb62460f27",
            "employeeCode": "110195420219"
        },
        {
            "_id": "67b404da778cc8bb62460f29",
            "employeeCode": "110153897134"
        },
        {
            "_id": "67b404da778cc8bb62460f2b",
            "employeeCode": "110113897136"
        },
        {
            "_id": "67b404da778cc8bb62460f2d",
            "employeeCode": "110125420220"
        },
        {
            "_id": "67b404db778cc8bb62460f2f",
            "employeeCode": "110172679618"
        },
        {
            "_id": "67b404db778cc8bb62460f31",
            "employeeCode": "110133897135"
        },
        {
            "_id": "67b404db778cc8bb62460f33",
            "employeeCode": "110175631437"
        },
        {
            "_id": "67b404db778cc8bb62460f35",
            "employeeCode": "110178598180"
        },
        {
            "_id": "67b404dc778cc8bb62460f37",
            "employeeCode": "110202195592"
        },
        {
            "_id": "67bd84b24a54f24d2fc7d7f9",
            "employeeCode": "555"
        },
        {
            "_id": "67bd84b34a54f24d2fc7d7fb",
            "employeeCode": "803"
        },
        {
            "_id": "67bd84b34a54f24d2fc7d7fd",
            "employeeCode": "802"
        },
        {
            "_id": "67bd84b34a54f24d2fc7d7ff",
            "employeeCode": "871"
        },
        {
            "_id": "67bd84b34a54f24d2fc7d801",
            "employeeCode": "878"
        },
        {
            "_id": "67bd84b44a54f24d2fc7d803",
            "employeeCode": "110061412007"
        },
        {
            "_id": "67bd84b44a54f24d2fc7d805",
            "employeeCode": "110071410829"
        },
        {
            "_id": "67bd84b44a54f24d2fc7d807",
            "employeeCode": "926"
        },
        {
            "_id": "67bd84b44a54f24d2fc7d809",
            "employeeCode": "1010"
        },
        {
            "_id": "67bd84b54a54f24d2fc7d80b",
            "employeeCode": "1014"
        },
        {
            "_id": "67bd84b54a54f24d2fc7d80d",
            "employeeCode": "110030936841"
        },
        {
            "_id": "67bd84b54a54f24d2fc7d80f",
            "employeeCode": "1015"
        },
        {
            "_id": "67bd84b54a54f24d2fc7d811",
            "employeeCode": "110051412047"
        },
        {
            "_id": "67bd84b64a54f24d2fc7d813",
            "employeeCode": "110001412030"
        },
        {
            "_id": "67bd84b64a54f24d2fc7d815",
            "employeeCode": "110001412027"
        },
        {
            "_id": "67bd84b64a54f24d2fc7d817",
            "employeeCode": "110021412026"
        },
        {
            "_id": "67bd84b64a54f24d2fc7d819",
            "employeeCode": "110091412028"
        },
        {
            "_id": "67bd84b74a54f24d2fc7d81b",
            "employeeCode": "110057275107"
        },
        {
            "_id": "67bd84b74a54f24d2fc7d81d",
            "employeeCode": "110071412032"
        },
        {
            "_id": "67bd84b74a54f24d2fc7d81f",
            "employeeCode": "110091412031"
        },
        {
            "_id": "67bd84b74a54f24d2fc7d821",
            "employeeCode": "110071410801"
        },
        {
            "_id": "67bd84b84a54f24d2fc7d823",
            "employeeCode": "110011410835"
        },
        {
            "_id": "67bd84b84a54f24d2fc7d825",
            "employeeCode": "110011410821"
        },
        {
            "_id": "67bd84b84a54f24d2fc7d827",
            "employeeCode": "110031412034"
        },
        {
            "_id": "67bd84b84a54f24d2fc7d829",
            "employeeCode": "110011410849"
        },
        {
            "_id": "67bd84b94a54f24d2fc7d82b",
            "employeeCode": "111103897493"
        },
        {
            "_id": "67bd84b94a54f24d2fc7d82d",
            "employeeCode": "110133897491"
        },
        {
            "_id": "67bd84b94a54f24d2fc7d82f",
            "employeeCode": "110113897492"
        },
        {
            "_id": "67bd84b94a54f24d2fc7d831",
            "employeeCode": "111101309510"
        },
        {
            "_id": "67bd84ba4a54f24d2fc7d833",
            "employeeCode": "110037764396"
        },
        {
            "_id": "67bd84ba4a54f24d2fc7d835",
            "employeeCode": "110115420212"
        },
        {
            "_id": "67bd84ba4a54f24d2fc7d837",
            "employeeCode": "111105420213"
        },
        {
            "_id": "67bd84ba4a54f24d2fc7d839",
            "employeeCode": "110125420217"
        },
        {
            "_id": "67bd84bb4a54f24d2fc7d83b",
            "employeeCode": "110155877857"
        },
        {
            "_id": "67bd84bb4a54f24d2fc7d83d",
            "employeeCode": "110202199755"
        },
        {
            "_id": "67bd84bb4a54f24d2fc7d83f",
            "employeeCode": "110202199738"
        },
        {
            "_id": "67bd98cb778cc8bb6246103c",
            "employeeCode": "110155420224"
        },
        {
            "_id": "67bd98cb778cc8bb6246103e",
            "employeeCode": "791"
        },
        {
            "_id": "67bd98cc778cc8bb62461040",
            "employeeCode": "110071410846"
        },
        {
            "_id": "67bd98cc778cc8bb62461042",
            "employeeCode": "589"
        },
        {
            "_id": "67bd98cc778cc8bb62461044",
            "employeeCode": "110105420221"
        },
        {
            "_id": "67bd98cc778cc8bb62461046",
            "employeeCode": "553"
        },
        {
            "_id": "67bd98cd778cc8bb62461048",
            "employeeCode": "110123897497"
        },
        {
            "_id": "67bd98cd778cc8bb6246104a",
            "employeeCode": "821"
        },
        {
            "_id": "67bd98cd778cc8bb6246104c",
            "employeeCode": "cf-8555"
        },
        {
            "_id": "67bd98cd778cc8bb6246104e",
            "employeeCode": "1019"
        },
        {
            "_id": "67bd98ce778cc8bb62461050",
            "employeeCode": "110091412014"
        },
        {
            "_id": "67bd98ce778cc8bb62461052",
            "employeeCode": "973"
        },
        {
            "_id": "67bd98ce778cc8bb62461054",
            "employeeCode": "644"
        },
        {
            "_id": "67bd98ce778cc8bb62461056",
            "employeeCode": "657"
        },
        {
            "_id": "67bd98cf778cc8bb62461058",
            "employeeCode": "110051438194"
        },
        {
            "_id": "67bd98cf778cc8bb6246105a",
            "employeeCode": "110198608849"
        },
        {
            "_id": "67bd98cf778cc8bb6246105c",
            "employeeCode": "110143897496"
        },
        {
            "_id": "67bd98cf778cc8bb6246105e",
            "employeeCode": "111001412005"
        },
        {
            "_id": "67bd98d0778cc8bb62461060",
            "employeeCode": "cf-9097"
        },
        {
            "_id": "67bd98d0778cc8bb62461062",
            "employeeCode": "cf-5723"
        },
        {
            "_id": "67bd98d0778cc8bb62461064",
            "employeeCode": "110091438192"
        },
        {
            "_id": "67bd98d0778cc8bb62461066",
            "employeeCode": "970"
        },
        {
            "_id": "67bd98d1778cc8bb62461068",
            "employeeCode": "110102123273"
        },
        {
            "_id": "67bd98d1778cc8bb6246106a",
            "employeeCode": "110163897495"
        },
        {
            "_id": "67bd98d1778cc8bb6246106c",
            "employeeCode": "517"
        },
        {
            "_id": "67bd98d1778cc8bb6246106e",
            "employeeCode": "110071412046"
        },
        {
            "_id": "67bd98d2778cc8bb62461070",
            "employeeCode": "110195420222"
        },
        {
            "_id": "67bd98d2778cc8bb62461072",
            "employeeCode": "1026"
        },
        {
            "_id": "67bd98d2778cc8bb62461074",
            "employeeCode": "976"
        },
        {
            "_id": "67eb95ab51701b49bca1a8e1",
            "employeeCode": "IIITB24049"
        }
    ]
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: mailToEmp
### Method: POST
>```
>http://localhost:3000/api/hod/emailToEmp
>```
### Body (**raw**)

```json
{

"email":"deepaktomar@manit.ac.in"
}
```

### Response: 200
```json
{
    "employeeCode": "1067",
    "name": "Deepak Singh Tomar",
    "branch": "CSE"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: SOV2
Specialized Student Overall Report for the HOD
### Method: POST
>```
>http://localhost:3000/api/student/studentOverallReport
>```
### Body (**raw**)

```json
{
    "scholarNumber": "2211201152",
    "branch" : "CSE" 
}
```

### Response: 200
```json
{
    "subjects": [
        {
            "subCode": "CSE357",
            "subjectName": "Advanced Data Structures",
            "subjectId": "678dfa8ad5665f6a3eb3fa67",
            "ownerId": "678ce4d0cd76735183ab8350"
        },
        {
            "subCode": "CSE321",
            "subjectName": "Machine Learning",
            "subjectId": "678ce483cd76735183ab8347",
            "ownerId": "678ce4d1cd76735183ab8354"
        },
        {
            "subCode": "CSE324",
            "subjectName": "Machine Learning Lab",
            "subjectId": "678ce483cd76735183ab834e",
            "ownerId": "678ce4d1cd76735183ab8354"
        },
        {
            "subCode": "CSE323",
            "subjectName": "Network & System Securities (T)",
            "subjectId": "678ce483cd76735183ab8349",
            "ownerId": "678ce4d1cd76735183ab8356"
        },
        {
            "subCode": "CSE326",
            "subjectName": "Hadoop & CUDA Lab",
            "subjectId": "678ce483cd76735183ab834f",
            "ownerId": "678ce4d5cd76735183ab837a"
        }
    ]
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: GetDepartments2
### This is the API Endpoint made for the ADMIN for the input module . Through this we retrieve the departments related info
### Method: GET
>```
>http://localhost:3000/api/admin/departments
>```
### Response: 200
```json
{
    "status": "success",
    "departments": [
        {
            "_id": "67f53873c441dc85ba4ed2d0",
            "department": "Architecture & Planning",
            "cn": "AP",
            "branches": [
                {
                    "course": "Bachelor of Architecture",
                    "program": "B.Arch.",
                    "shortForm": "BArch",
                    "session": [
                        "2022-27"
                    ],
                    "duration": 5
                },
                {
                    "course": "Bachelor of Planning",
                    "program": "B.Plan.",
                    "shortForm": "BPlan",
                    "session": [
                        "2022-26"
                    ],
                    "duration": 4
                },
                {
                    "course": "Urban Planning",
                    "program": "M.Plan.",
                    "shortForm": "UPlan",
                    "session": [],
                    "duration": 2
                },
                {
                    "course": "Real Estate Development",
                    "program": "M.Plan.",
                    "shortForm": "RED",
                    "session": [],
                    "duration": 2
                }
            ],
            "courses": [
                {
                    "name": "B.Arch.",
                    "type": "UG",
                    "duration": 5
                },
                {
                    "name": "B.Plan.",
                    "type": "UG",
                    "duration": 4
                },
                {
                    "name": "M.Plan.",
                    "type": "PG",
                    "duration": 2
                }
            ]
        },
        {
            "_id": "67f53873c441dc85ba4ed2d1",
            "department": "Biological Science and Engineering",
            "cn": "BSE",
            "branches": [
                {
                    "course": "Bio-Technology",
                    "program": "M.Tech",
                    "shortForm": "BT",
                    "session": [],
                    "duration": 2
                }
            ],
            "courses": [
                {
                    "name": "M.Tech",
                    "type": "PG",
                    "duration": 2
                }
            ]
        },
        {
            "_id": "67f53873c441dc85ba4ed2d2",
            "department": "Centre for Artificial Intelligence",
            "cn": "AI",
            "branches": [
                {
                    "course": "Artificial Intelligence",
                    "program": "M.Tech",
                    "shortForm": "CSE_AI",
                    "session": [],
                    "duration": 2
                }
            ],
            "courses": [
                {
                    "name": "M.Tech",
                    "type": "PG",
                    "duration": 2
                }
            ]
        },
        {
            "_id": "67f53873c441dc85ba4ed2d3",
            "department": "Centre of Excellence in Product Design & Smart Manufacturing",
            "cn": "CEPDSM",
            "branches": [
                {
                    "course": "Smart Manufacturing",
                    "program": "M.Tech",
                    "shortForm": "CEPDSM",
                    "session": [],
                    "duration": 2
                }
            ],
            "courses": [
                {
                    "name": "M.Tech",
                    "type": "PG",
                    "duration": 2
                }
            ]
        },
        {
            "_id": "67f53873c441dc85ba4ed2d4",
            "department": "Chemical Engineering",
            "cn": "CHEM",
            "branches": [
                {
                    "course": "Bachelor of Technology",
                    "program": "B.Tech",
                    "shortForm": "CHEM",
                    "session": [
                        "2022-26",
                        "2023-27",
                        "2024-28"
                    ],
                    "duration": 4
                },
                {
                    "course": "Chemical Engineering",
                    "program": "M.Tech",
                    "shortForm": "CE",
                    "session": [],
                    "duration": 2
                },
                {
                    "course": "Environmental Engineering",
                    "program": "M.Tech",
                    "shortForm": "EE",
                    "session": [],
                    "duration": 2
                }
            ],
            "courses": [
                {
                    "name": "B.Tech",
                    "type": "UG",
                    "duration": 4
                },
                {
                    "name": "M.Tech",
                    "type": "PG",
                    "duration": 2
                }
            ]
        },
        {
            "_id": "67f53873c441dc85ba4ed2d5",
            "department": "Civil Engineering",
            "cn": "CVL",
            "branches": [
                {
                    "course": "Civil Engineering",
                    "program": "B.Tech",
                    "shortForm": "CVL",
                    "session": [
                        "2022-26",
                        "2023-27",
                        "2024-28"
                    ],
                    "duration": 4
                },
                {
                    "course": "Geoinformatics & its Applications",
                    "program": "M.Tech",
                    "shortForm": "GIA",
                    "session": [],
                    "duration": 2
                },
                {
                    "course": "Geotechnical Engineering",
                    "program": "M.Tech",
                    "shortForm": "GTE",
                    "session": [],
                    "duration": 2
                },
                {
                    "course": "Water Resource Engineering & Management",
                    "program": "M.Tech",
                    "shortForm": "WREM",
                    "session": [],
                    "duration": 2
                },
                {
                    "course": "Structural Engineering",
                    "program": "M.Tech",
                    "shortForm": "SE",
                    "session": [],
                    "duration": 2
                },
                {
                    "course": "Transportation Engineering",
                    "program": "M.Tech",
                    "shortForm": "TE",
                    "session": [],
                    "duration": 2
                },
                {
                    "course": "Infrastructure Engineering And Construction Management",
                    "program": "M.Tech",
                    "shortForm": "IECM",
                    "session": [],
                    "duration": 2
                }
            ],
            "courses": [
                {
                    "name": "B.Tech",
                    "type": "UG",
                    "duration": 4
                },
                {
                    "name": "M.Tech",
                    "type": "PG",
                    "duration": 2
                }
            ]
        },
        {
            "_id": "67f53873c441dc85ba4ed2d6",
            "department": "Computer Science & Engineering",
            "cn": "CSE",
            "branches": [
                {
                    "course": "Computer Science & Engineering",
                    "program": "B.Tech",
                    "shortForm": "CSE",
                    "session": [
                        "2022-26",
                        "2023-27",
                        "2024-28"
                    ],
                    "duration": 4
                },
                {
                    "course": "Advanced Computing",
                    "program": "M.Tech",
                    "shortForm": "CSE_AC",
                    "session": [],
                    "duration": 2
                },
                {
                    "course": "Computer Networks",
                    "program": "M.Tech",
                    "shortForm": "CSE_CN",
                    "session": [],
                    "duration": 2
                },
                {
                    "course": "Information Security",
                    "program": "M.Tech",
                    "shortForm": "CSE_IS",
                    "session": [],
                    "duration": 2
                }
            ],
            "courses": [
                {
                    "name": "B.Tech",
                    "type": "UG",
                    "duration": 4
                },
                {
                    "name": "M.Tech",
                    "type": "PG",
                    "duration": 2
                }
            ]
        },
        {
            "_id": "67f53873c441dc85ba4ed2d7",
            "department": "Electrical Engineering",
            "cn": "EE",
            "branches": [
                {
                    "course": "Electrical Engineering",
                    "program": "B.Tech",
                    "shortForm": "EE",
                    "session": [
                        "2022-26",
                        "2023-27",
                        "2024-28"
                    ],
                    "duration": 4
                }
            ],
            "courses": [
                {
                    "name": "B.Tech",
                    "type": "UG",
                    "duration": 4
                }
            ]
        },
        {
            "_id": "67f53873c441dc85ba4ed2d8",
            "department": "Electronics & Communication Engineering",
            "cn": "ECE",
            "branches": [
                {
                    "course": "Electronics & Communication Engineering",
                    "program": "B.Tech",
                    "shortForm": "ECE",
                    "session": [
                        "2022-26",
                        "2023-27",
                        "2024-28"
                    ],
                    "duration": 4
                },
                {
                    "course": "Communication Systems",
                    "program": "M.Tech",
                    "shortForm": "ECE_CS",
                    "session": [],
                    "duration": 2
                },
                {
                    "course": "VLSI design & Embedded System",
                    "program": "M.Tech",
                    "shortForm": "ECE_VED",
                    "session": [],
                    "duration": 2
                }
            ],
            "courses": [
                {
                    "name": "B.Tech",
                    "type": "UG",
                    "duration": 4
                },
                {
                    "name": "M.Tech",
                    "type": "PG",
                    "duration": 2
                }
            ]
        },
        {
            "_id": "67f53873c441dc85ba4ed2d9",
            "department": "Energy Centre",
            "cn": "EC",
            "branches": [
                {
                    "course": "Renewable Energy",
                    "program": "M.Tech",
                    "shortForm": "RE",
                    "session": [],
                    "duration": 2
                }
            ],
            "courses": [
                {
                    "name": "M.Tech",
                    "type": "PG",
                    "duration": 2
                }
            ]
        },
        {
            "_id": "67f53873c441dc85ba4ed2da",
            "department": "Energy and Electrical Vehicle Engineering",
            "cn": "EEVE",
            "branches": [
                {
                    "course": "Energy and Electrical Vehicle Engineering",
                    "program": "B.Tech",
                    "shortForm": "EEVE",
                    "session": [
                        "2022-26",
                        "2023-27",
                        "2024-28"
                    ],
                    "duration": 4
                }
            ],
            "courses": [
                {
                    "name": "B.Tech",
                    "type": "UG",
                    "duration": 4
                }
            ]
        },
        {
            "_id": "67f53873c441dc85ba4ed2db",
            "department": "Energy Economics and Management",
            "cn": "EEM",
            "branches": [
                {
                    "course": "M.Sc in Energy",
                    "program": "M.Sc.",
                    "shortForm": "MSC_ENG",
                    "session": [],
                    "duration": 2
                }
            ],
            "courses": [
                {
                    "name": "M.Sc.",
                    "type": "PG",
                    "duration": 2
                }
            ]
        },
        {
            "_id": "67f53873c441dc85ba4ed2dc",
            "department": "Management Studies",
            "cn": "MGMT",
            "branches": [
                {
                    "course": "Master of Business Administration",
                    "program": "MBA",
                    "shortForm": "MBA",
                    "session": [],
                    "duration": 2
                }
            ],
            "courses": [
                {
                    "name": "MBA",
                    "type": "PG",
                    "duration": 2
                }
            ]
        },
        {
            "_id": "67f53873c441dc85ba4ed2dd",
            "department": "Materials & Metallurgical Engineering",
            "cn": "MME",
            "branches": [
                {
                    "course": "Materials & Metallurgical Engineering",
                    "program": "B.Tech",
                    "shortForm": "MME",
                    "session": [
                        "2022-26",
                        "2023-27",
                        "2024-28"
                    ],
                    "duration": 4
                },
                {
                    "course": "Material Science & Technology",
                    "program": "M.Tech",
                    "shortForm": "MST",
                    "session": [],
                    "duration": 2
                }
            ],
            "courses": [
                {
                    "name": "B.Tech",
                    "type": "UG",
                    "duration": 4
                },
                {
                    "name": "M.Tech",
                    "type": "PG",
                    "duration": 2
                }
            ]
        },
        {
            "_id": "67f53873c441dc85ba4ed2de",
            "department": "Mathematics and Data Science",
            "cn": "MDS",
            "branches": [
                {
                    "course": "Mathematics and Data Science",
                    "program": "B.Tech-M.Tech",
                    "shortForm": "MDS",
                    "session": [],
                    "duration": 5
                }
            ],
            "courses": [
                {
                    "name": "B.Tech-M.Tech",
                    "type": "DD",
                    "duration": 5
                }
            ]
        },
        {
            "_id": "67f53873c441dc85ba4ed2df",
            "department": "Mathematics, Bioinformatics & Computer Applications",
            "cn": "MBC",
            "branches": [
                {
                    "course": "Bioinformatics",
                    "program": "M.Tech",
                    "shortForm": "BI",
                    "session": [],
                    "duration": 2
                },
                {
                    "course": "Agile Software Engineering",
                    "program": "M.Tech",
                    "shortForm": "ASE",
                    "session": [],
                    "duration": 2
                },
                {
                    "course": "Master of Computer Applications",
                    "program": "MCA",
                    "shortForm": "MCA",
                    "session": [],
                    "duration": 3
                }
            ],
            "courses": [
                {
                    "name": "M.Tech",
                    "type": "PG",
                    "duration": 2
                },
                {
                    "name": "MCA",
                    "type": "PG",
                    "duration": 3
                }
            ]
        },
        {
            "_id": "67f53873c441dc85ba4ed2e0",
            "department": "Mechanical Engineering",
            "cn": "ME",
            "branches": [
                {
                    "course": "Mechanical Engineering",
                    "program": "B.Tech",
                    "shortForm": "ME",
                    "session": [
                        "2022-26",
                        "2023-27",
                        "2024-28"
                    ],
                    "duration": 4
                },
                {
                    "course": "Automation and Robotics",
                    "program": "M.Tech",
                    "shortForm": "AR",
                    "session": [],
                    "duration": 2
                },
                {
                    "course": "Machine Design",
                    "program": "M.Tech",
                    "shortForm": "MD",
                    "session": [],
                    "duration": 2
                },
                {
                    "course": "Industrial Engineering and Management",
                    "program": "M.Tech",
                    "shortForm": "IEM",
                    "session": [],
                    "duration": 2
                },
                {
                    "course": "Thermal Engineering",
                    "program": "M.Tech",
                    "shortForm": "TH",
                    "session": [],
                    "duration": 2
                }
            ],
            "courses": [
                {
                    "name": "B.Tech",
                    "type": "UG",
                    "duration": 4
                },
                {
                    "name": "M.Tech",
                    "type": "PG",
                    "duration": 2
                }
            ]
        },
        {
            "_id": "67f53873c441dc85ba4ed2e1",
            "department": "Physics",
            "cn": "PHY",
            "branches": [
                {
                    "course": "Nano Technology",
                    "program": "M.Tech",
                    "shortForm": "NT",
                    "session": [],
                    "duration": 2
                },
                {
                    "course": "M.Sc in Physics",
                    "program": "M.Sc.",
                    "shortForm": "MSP",
                    "session": [],
                    "duration": 2
                }
            ],
            "courses": [
                {
                    "name": "M.Tech",
                    "type": "PG",
                    "duration": 2
                },
                {
                    "name": "M.Sc.",
                    "type": "PG",
                    "duration": 2
                }
            ]
        },
        {
            "_id": "67f53873c441dc85ba4ed2e2",
            "department": "Chemistry",
            "cn": "CHEM",
            "branches": [
                {
                    "course": "M.Sc in Chemistry",
                    "program": "M.Sc.",
                    "shortForm": "CHEM_MSC",
                    "session": [],
                    "duration": 2
                }
            ],
            "courses": [
                {
                    "name": "M.Sc.",
                    "type": "PG",
                    "duration": 2
                }
            ]
        },
        {
            "_id": "67f53873c441dc85ba4ed2e3",
            "department": "Engineering and Computational Mechanics",
            "cn": "ECM",
            "branches": [
                {
                    "course": "Engineering and Computational Mechanics",
                    "program": "B.Tech-M.Tech",
                    "shortForm": "DD-ECM",
                    "session": [],
                    "duration": 5
                }
            ],
            "courses": [
                {
                    "name": "B.Tech-M.Tech",
                    "type": "DD",
                    "duration": 5
                }
            ]
        },
        {
            "_id": "67f7708efbccc1111e0af35e",
            "department": "Electrical Engineering Electronics & Communication Engineering",
            "cn": "EEECE",
            "branches": [
                {
                    "course": "Power Electronics & Drives",
                    "program": "M.Tech",
                    "shortForm": "PED",
                    "session": [],
                    "duration": 2
                },
                {
                    "course": "Integrated Power System",
                    "program": "M.Tech",
                    "shortForm": "IPS",
                    "session": [],
                    "duration": 2
                }
            ],
            "courses": [
                {
                    "name": "M.Tech",
                    "type": "PG",
                    "duration": 2
                }
            ]
        }
    ]
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: GetSpecificDept
Returns the info of the particular Department
### Method: GET
>```
>http://localhost:3000/api/admin/departments/67f53873c441dc85ba4ed2d6
>```
### Response: 200
```json
{
    "status": "success",
    "department": {
        "_id": "67f53873c441dc85ba4ed2d6",
        "department": "Computer Science & Engineering",
        "cn": "CSE",
        "branches": [
            {
                "course": "Computer Science & Engineering",
                "program": "B.Tech",
                "shortForm": "CSE",
                "session": [
                    "2022-26",
                    "2023-27",
                    "2024-28"
                ],
                "duration": 4
            },
            {
                "course": "Advanced Computing",
                "program": "M.Tech",
                "shortForm": "CSE_AC",
                "session": [],
                "duration": 2
            },
            {
                "course": "Computer Networks",
                "program": "M.Tech",
                "shortForm": "CSE_CN",
                "session": [],
                "duration": 2
            },
            {
                "course": "Information Security",
                "program": "M.Tech",
                "shortForm": "CSE_IS",
                "session": [],
                "duration": 2
            }
        ],
        "courses": [
            {
                "name": "B.Tech",
                "type": "UG",
                "duration": 4
            },
            {
                "name": "M.Tech",
                "type": "PG",
                "duration": 2
            }
        ]
    }
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: AddDept
This is for adding a particular department into the departments collection
### Method: POST
>```
>http://localhost:3000/api/admin/departments
>```
### Body (**raw**)

```json
{
  "department": "Test",
  "cn": "tst"
}
```

### Response: 201
```json
{
    "status": "success",
    "message": "Department added successfully",
    "departmentId": "67f7bc2e88b872c6a567bdf8"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Add Course
This for adding a specific course in a particular department
### Method: POST
>```
>http://localhost:3000/api/admin/courses
>```
### Body (**raw**)

```json
{
  "departmentId": "67f7d5418f8b222e4e24d497",
  "branches": [
    {
      "course": "TestCourse",
      "program": "B.Tech",
      "shortForm": "TstC",
      "duration": 4
    }
  ]
}
```

### Response: 200
```json
{
    "status": "success",
    "message": "Branches and courses added successfully"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Add Session
#### This adds a session to a particular course
### Method: POST
>```
>http://localhost:3000/api/admin/sessions
>```
### Body (**raw**)

```json
{
  "departmentId": "67f7bc2e88b872c6a567bdf8",
  "branchShortForm": "C",
  "session": "2023-27"
}
```

### Response: 200
```json
{
    "status": "success",
    "message": "Session added successfully"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: SemConfig
This is reponsible for the configuring the type of semester . It can be either even or odd depending on the scenario .
### Method: POST
>```
>http://localhost:3000/api/admin/semester
>```
### Body (**raw**)

```json
{
  "semesterType": "odd"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: SemStatus
This returns whether the present semester in overall manit is even or odd .
### Method: GET
>```
>http://localhost:3000/api/admin/semester
>```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: CourseType
Adds a particular course in a particular department
### Method: POST
>```
>http://localhost:3000/api/admin/courseType
>```
### Body (**raw**)

```json
{
  "departmentId": "67f7d5418f8b222e4e24d497",
  "courseName": "B.Des.",
  "courseType": "UG",
  "duration": 4
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
_________________________________________________
Powered By: [postman-to-markdown](https://github.com/bautistaj/postman-to-markdown/)
