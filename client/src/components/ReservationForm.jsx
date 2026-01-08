import { useState, useEffect } from 'react';
import axios from 'axios';

const ReservationForm = ({ selectedDate, onClose, onSuccess }) => {
    const [equipmentList, setEquipmentList] = useState([]);
    const [equipmentId, setEquipmentId] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [duration, setDuration] = useState(1);
    const [materialUsed, setMaterialUsed] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/equipment', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEquipmentList(res.data);
                if (res.data.length > 0) setEquipmentId(res.data[0].id);
            } catch (err) {
                console.error('Failed to fetch equipment');
            }
        };
        fetchEquipment();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');

            const startDateTime = new Date(selectedDate);
            const [hours, minutes] = startTime.split(':');
            startDateTime.setHours(parseInt(hours), parseInt(minutes));

            const endDateTime = new Date(startDateTime);
            endDateTime.setTime(endDateTime.getTime() + (parseFloat(duration) * 60 * 60 * 1000));

            const selectedEq = equipmentList.find(e => e.id == equipmentId);

            await axios.post('/api/reservations', {
                equipmentId,
                startTime: startDateTime,
                endTime: endDateTime,
                materialUsed: selectedEq?.type === 'printer' ? materialUsed : null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create reservation');
        }
    };

    const selectedEquipmentType = equipmentList.find(e => e.id == equipmentId)?.type;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div className="card" style={{ width: '400px', maxWidth: '100%' }}>
                <h3>Nueva Reservación</h3>
                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="equipmentId">Equipo</label>
                        <select id="equipmentId" name="equipmentId" value={equipmentId} onChange={e => setEquipmentId(e.target.value)}>
                            {equipmentList.map(eq => (
                                <option key={eq.id} value={eq.id}>{eq.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="startTime">Hora de Inicio</label>
                        <input id="startTime" name="startTime" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="duration">Duración (Horas)</label>
                        <input id="duration" name="duration" type="number" min="0.5" step="0.5" value={duration} onChange={e => setDuration(e.target.value)} required />
                    </div>
                    {/* Show Material Used only for printers, simplified logic for now */}
                    {selectedEquipmentType === 'printer' && (
                        <div>
                            <label htmlFor="materialUsed">Material Estimado (g)</label>
                            <input id="materialUsed" name="materialUsed" type="number" value={materialUsed} onChange={e => setMaterialUsed(e.target.value)} />
                        </div>
                    )}

                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn" style={{ background: '#ccc' }}>Cancelar</button>
                        <button type="submit" className="btn btn-primary">Confirmar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReservationForm;
