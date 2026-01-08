import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [matricula, setMatricula] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await register(name, matricula, password);
        if (res.success) {
            navigate('/login');
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Registro</h2>
                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Nombre Completo</label>
                        <input id="name" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="matricula">Matrícula / ID</label>
                        <input id="matricula" name="matricula" type="text" value={matricula} onChange={(e) => setMatricula(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="password">Contraseña</label>
                        <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>Registrarse</button>
                </form>
                <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--primary)' }}>Inicia Sesión</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
