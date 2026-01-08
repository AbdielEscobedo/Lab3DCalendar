import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Calendar from '../components/Calendar';
import ReservationForm from '../components/ReservationForm';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const fetchReservations = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/reservations', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReservations(res.data);
        } catch (error) {
            console.error('Error fetching reservations', error);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setShowModal(true);
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Panel de Control</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span>Hola, {user.name}</span>
                    <button onClick={logout} className="btn" style={{ border: '1px solid var(--border)' }}>Cerrar Sesión</button>
                </div>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Calendario de Reservas</h3>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary">Nueva Reserva</button>
                </div>
                <Calendar reservations={reservations} onDateClick={handleDateClick} />
            </div>

            {showModal && (
                <ReservationForm
                    selectedDate={selectedDate}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        fetchReservations(); // Refresh calendar
                        setShowModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;
