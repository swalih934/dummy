import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';function Agenda() {
    const [appointments, setAppointments] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('All');
  
    useEffect(() => {
      const saved = localStorage.getItem('appointments');
      const loaded = saved ? JSON.parse(saved) : [];
      setAppointments(
        loaded.map(event => ({
          ...event,
          start: new Date(event.start),
          end: event.end
            ? new Date(event.end)
            : new Date(new Date(event.start).getTime() + 30 * 60000),
        }))
      );
    }, []);
  
    // Extract unique doctors
    const doctorOptions = ['All', ...new Set(appointments.map(appt => appt.doctor))];
  
    const filteredAppointments =
      selectedDoctor === 'All'
        ? appointments
        : appointments.filter(appt => appt.doctor === selectedDoctor);
  
  return (
<>
<div className="container mt-4">
      <h2>📋 All Appointments</h2>
      <Link to="/home" className="btn btn-secondary mb-3">← Back to Calendar</Link>

      <div className="mb-3">
        <label htmlFor="doctorFilter" className="form-label">Filter by Doctor:</label>
        <select
          id="doctorFilter"
          className="form-select"
          value={selectedDoctor}
          onChange={e => setSelectedDoctor(e.target.value)}
        >
          {doctorOptions.map((doctor, index) => (
            <option key={index} value={doctor}>
              {doctor}
            </option>
          ))}
        </select>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">No appointments found</td>
            </tr>
          )}
          {filteredAppointments.map((appt, idx) => (
            <tr key={idx}>
              <td>{appt.patient}</td>
              <td>{appt.doctor}</td>
              <td>{format(appt.start, 'PPpp')}</td>
              <td>{format(appt.end, 'PPpp')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

</>  )
}

export default Agenda