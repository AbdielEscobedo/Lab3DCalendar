import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

const Calendar = ({ reservations, onDateClick }) => {
    const currentDate = new Date();
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate
    });

    const getDayReservations = (day) => {
        return reservations.filter(res =>
            isSameDay(new Date(res.startTime), day)
        );
    };

    return (
        <div className="calendar" style={{ marginTop: '2rem' }}>
            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2>{format(currentDate, 'MMMM yyyy', { locale: es })}</h2>
            </div>
            <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'var(--border)' }}>
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                    <div key={day} style={{ padding: '0.5rem', background: 'var(--bg)', textAlign: 'center', fontWeight: 'bold' }}>
                        {day}
                    </div>
                ))}
                {days.map(day => {
                    const dayReservations = getDayReservations(day);
                    return (
                        <div
                            key={day.toString()}
                            style={{
                                minHeight: '100px',
                                background: 'var(--surface)',
                                padding: '0.5rem',
                                opacity: isSameMonth(day, monthStart) ? 1 : 0.5,
                                cursor: 'pointer'
                            }}
                            onClick={() => onDateClick(day)}
                        >
                            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{format(day, 'd')}</div>
                            {dayReservations.map(res => (
                                <div key={res.id} style={{
                                    fontSize: '0.75rem',
                                    background: res.Equipment.type === 'printer' ? '#e0f2fe' : '#fef3c7',
                                    color: res.Equipment.type === 'printer' ? '#0369a1' : '#b45309',
                                    padding: '2px 4px',
                                    borderRadius: '4px',
                                    marginBottom: '2px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {format(new Date(res.startTime), 'HH:mm')} - {format(new Date(res.endTime), 'HH:mm')} | {res.Equipment.name}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
