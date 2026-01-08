import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [matricula, setMatricula] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(matricula, password);
        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Iniciar Sesión</h2>
                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="matricula">Matrícula / ID</label>
                        <input id="matricula" name="matricula" type="text" value={matricula} onChange={(e) => setMatricula(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="password">Contraseña</label>
                        <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>Entrar</button>
                </form>
                <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    ¿No tienes cuenta? <Link to="/register" style={{ color: 'var(--primary)' }}>Regístrate</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
