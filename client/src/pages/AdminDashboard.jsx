import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const resReservations = await axios.get('/api/reservations', config);
            setReservations(Array.isArray(resReservations.data) ? resReservations.data : []);

            const resStats = await axios.get('/api/admin/stats', config);
            setStats(Array.isArray(resStats.data?.equipmentStats) ? resStats.data.equipmentStats : []);
        } catch (error) {
            console.error('Error fetching admin data', error);
            setError('Error cargando datos. Verifique que tenga permisos de administrador.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatDateSafe = (dateStr, formatStr) => {
        try {
            if (!dateStr) return 'N/A';
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return 'Fecha inválida';
            return format(date, formatStr);
        } catch (e) {
            console.error('Date error:', e);
            return 'Error fecha';
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('¿Seguro que deseas cancelar esta reservación?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/reservations/${id}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (error) {
            alert('Error al cancelar');
        }
    };

    if (loading) return <div className="container">Cargando panel de administración...</div>;

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Panel de Administrador</h1>
                <button onClick={logout} className="btn">Cerrar Sesión</button>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '1rem', background: '#fee2e2', borderRadius: '0.5rem' }}>{error}</div>}

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>Estadísticas de Uso</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '0.5rem' }}>Equipo</th>
                                <th style={{ padding: '0.5rem' }}>Veces Usado</th>
                                <th style={{ padding: '0.5rem' }}>Material Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(!stats || stats.length === 0) ? (
                                <tr><td colSpan="3" style={{ padding: '1rem', textAlign: 'center' }}>No hay equipos registrados</td></tr>
                            ) : (
                                stats.map((stat, idx) => (
                                    <tr key={stat.equipmentId || idx} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '0.5rem' }}>{stat.Equipment?.name || 'Equipo desconocido'}</td>
                                        <td style={{ padding: '0.5rem' }}>{stat.usageCount}</td>
                                        <td style={{ padding: '0.5rem' }}>{stat.totalMaterial || 0} g</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Todas las Reservaciones</h3>
                    <button onClick={fetchData} className="btn" style={{ fontSize: '0.875rem' }}>Actualizar</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '0.5rem' }}>Usuario</th>
                                <th style={{ padding: '0.5rem' }}>Equipo</th>
                                <th style={{ padding: '0.5rem' }}>Inicio</th>
                                <th style={{ padding: '0.5rem' }}>Fin</th>
                                <th style={{ padding: '0.5rem' }}>Estado</th>
                                <th style={{ padding: '0.5rem' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(!reservations || reservations.length === 0) ? (
                                <tr><td colSpan="6" style={{ padding: '1rem', textAlign: 'center' }}>No hay reservaciones registradas.</td></tr>
                            ) : (
                                reservations.map(res => (
                                    <tr key={res.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '0.5rem' }}>{res.User?.name || 'Usuario desconocido'} ({res.User?.matricula || 'N/A'})</td>
                                        <td style={{ padding: '0.5rem' }}>{res.Equipment?.name || 'Equipo desconocido'}</td>
                                        <td style={{ padding: '0.5rem' }}>{formatDateSafe(res.startTime, 'dd/MM HH:mm')}</td>
                                        <td style={{ padding: '0.5rem' }}>{formatDateSafe(res.endTime, 'HH:mm')}</td>
                                        <td style={{ padding: '0.5rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                background: res.status === 'confirmed' ? '#dcfce7' : '#fee2e2',
                                                color: res.status === 'confirmed' ? '#166534' : '#991b1b'
                                            }}>
                                                {res.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.5rem' }}>
                                            {res.status === 'confirmed' && (
                                                <button onClick={() => handleCancel(res.id)} className="btn" style={{ fontSize: '0.75rem', color: 'red', border: '1px solid red', padding: '0.25rem 0.5rem' }}>
                                                    Cancelar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
