import React, { useState, useEffect } from 'react';
import InputSection from '../../../components/HOD/inputSection';
import { ToastProvider } from '../../../context/ToastContext';
import { nameToEmp } from '../../../api/services/hod/hod';




export function Dashboard() {
    const [details, setDetails] = useState<any>(null);
    const [scholarNumber, setScholarNumber] = useState('');
    const [semester, setSemester] = useState('');
    const [studentDetails, setStudentDetails] = useState(null);
    useEffect(() => {
        const user = localStorage.getItem('user');
        const parsedUser = user ? JSON.parse(user) : null;
        console.log("This is the user in HOD Dashboard : ", parsedUser);
        nameToEmp(parsedUser?.email as string).then((data: any) => {
            setDetails(data);
            console.log("This is the HOD DATA after setting : ", data);
        }).catch((err: any) => {
            console.log(err);
        });
    }, []);
    return (
        <ToastProvider>
            <InputSection setStudenDetails = {setStudentDetails}/>
        </ToastProvider>
    )
}
