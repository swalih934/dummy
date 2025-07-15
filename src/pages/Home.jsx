
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './home.css';


const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const PATIENTS = ['Sahla', 'Fathima', 'Johnson', 'Adarsh', 'Swalih', 'Nadia'];
const DOCTORS = ['Dr. John', 'Dr. Saleem', 'Dr. Samad', 'Dr. Hafsa'];

function Home() {
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [defaultDate, setDefaultDate] = useState(new Date());
    const [calendarView, setCalendarView] = useState('month');
    const [isMobile, setIsMobile] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ patient: '', doctor: '', start: '' });
    const [editIndex, setEditIndex] = useState(null);
  
    // Detect screen size
    useEffect(() => {
      const updateView = () => {
        const screenIsMobile = window.innerWidth < 768;
        setIsMobile(screenIsMobile);
        setCalendarView(screenIsMobile ? 'day' : 'month');
      };
  
      window.addEventListener('resize', updateView);
      updateView();
      return () => window.removeEventListener('resize', updateView);
    }, []);
  
    // Load events from localStorage
    useEffect(() => {
      const saved = localStorage.getItem('appointments');
      const loadedEvents = saved ? JSON.parse(saved) : [];
  
      const eventsWithDates = loadedEvents.map(event => {
        const startDate = event.start ? new Date(event.start) : new Date();
        return {
          ...event,
          start: startDate,
          end: event.end ? new Date(event.end) : new Date(startDate.getTime() + 30 * 60000),
        };
      });
  
      setEvents(eventsWithDates);
    }, []);
  
    const handleDateChange = (e) => setDefaultDate(new Date(e.target.value));
  
    const handleSelectSlot = (slotInfo) => {
      setFormData({
        patient: '',
        doctor: '',
        start: format(slotInfo.start, "yyyy-MM-dd'T'HH:mm"),
      });
      setEditIndex(null);
      setShowForm(true);
    };
  
    const handleSelectEvent = (event, e) => {
      e.stopPropagation();
      setFormData({
        patient: event.patient,
        doctor: event.doctor,
        start: format(event.start, "yyyy-MM-dd'T'HH:mm"),
      });
      const index = events.findIndex(ev =>
        ev.start.getTime() === event.start.getTime() &&
        ev.patient === event.patient &&
        ev.doctor === event.doctor
      );
      setEditIndex(index);
      setShowForm(true);
    };
  
    const handleFormSubmit = (e) => {
      e.preventDefault();
      const { patient, doctor, start } = formData;
      if (!patient || !doctor || !start) {
        alert('Please fill all fields');
        return;
      }
  
      const newEvent = {
        title: `${patient} with ${doctor}`,
        start: new Date(start),
        end: new Date(new Date(start).getTime() + 30 * 60000),
        patient,
        doctor,
      };
  
      let updatedEvents;
      if (editIndex !== null) {
        updatedEvents = [...events];
        updatedEvents[editIndex] = newEvent;
      } else {
        updatedEvents = [...events, newEvent];
      }
  
      setEvents(updatedEvents);
      localStorage.setItem('appointments', JSON.stringify(updatedEvents));
      setShowForm(false);
      setEditIndex(null);
    };
  
    const handleDelete = (indexToDelete) => {
      if (window.confirm('Are you sure you want to delete this appointment?')) {
        const updatedEvents = events.filter((_, index) => index !== indexToDelete);
        setEvents(updatedEvents);
        localStorage.setItem('appointments', JSON.stringify(updatedEvents));
        setShowForm(false);
        setEditIndex(null);
      }
    };
  
    const handleGoToAgenda = () => {
      navigate('/agenda');
    };
  
    const handleNextMonth = () => {
      const next = new Date(defaultDate);
      next.setMonth(next.getMonth() + 1);
      setDefaultDate(next);
    };
  return (
<>
<div className="container mt-4">
      <h2>📅 Clinic Appointments</h2>

      <div className="mb-3 d-flex justify-content-between flex-wrap align-items-center">
        <div className="d-flex gap-2 mb-2">
          <button className="btn btn-outline-info" onClick={handleGoToAgenda}>
            View All Appointments
          </button>

          {!isMobile && (
            <button className="btn btn-outline-secondary" onClick={handleNextMonth}>
              Next Month
            </button>
          )}
        </div>

        {isMobile && (
          <div>
            <label htmlFor="datePicker" className="form-label me-2">Jump to Date:</label>
            <input id="datePicker" type="date" className="form-control" value={format(defaultDate, 'yyyy-MM-dd')} onChange={handleDateChange}  />
          </div>
        )}
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        date={defaultDate}
        onNavigate={setDefaultDate}
        defaultView={isMobile ? 'day' : 'month'}
        view={calendarView}
        views={isMobile ? ['day'] : ['month']}
        toolbar={isMobile}
        style={{ height: 600 }}
      />

      {showForm && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleFormSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{editIndex !== null ? 'Edit Appointment' : 'Add Appointment'}</h5>
                <button type="button" className="btn-close" onClick={() => { setShowForm(false); setEditIndex(null); }}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Patient</label>
                  <select
                    className="form-select" value={formData.patient}  onChange={(e) => setFormData({ ...formData, patient: e.target.value })} required >
                    <option value="">Select Patient</option>
                    {PATIENTS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Doctor</label>
                  <select  className="form-select"  value={formData.doctor} onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}  required>
                    <option value="">Select Doctor</option>
                    {DOCTORS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Start Time</label>
                  <input  type="datetime-local"  className="form-control" value={formData.start}   onChange={(e) => setFormData({ ...formData, start: e.target.value })}  required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">{editIndex !== null ? 'Update' : 'Save'}</button>
                <button  type="button" className="btn btn-danger" onClick={() => { if (editIndex !== null) {    handleDelete(editIndex);   } }}  disabled={editIndex === null}>
                  Delete
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setEditIndex(null); }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>



</>  )
}

export default Home