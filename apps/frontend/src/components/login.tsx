import { useState } from 'react';
import { User, Lock, LogIn } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function LoginForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    /*
        const handleSubmit = async (e: any) => {
            e.preventDefault();
            setError('');
            setIsLoading(true);
    
            try {
                const response = await fetch('/api/usuarios/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: formData.username,
                        password: formData.password
                    }),
                });
    
                const data = await response.json();
    
                if (!response.ok) {
                    throw new Error(data.message || 'Error al iniciar sesión');
                }
    
                // Login exitoso
                alert('Login exitoso');
                // Aquí podrías redirigir al usuario o establecer el token de autenticación
    
            } catch (err: any) {
                setError(err.message || 'Ocurrió un error durante el inicio de sesión');
            } finally {
                setIsLoading(false);
            }
        };
    */
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (formData.username === 'admin' && formData.password === '11001100') {
            navigate({to: '/dash'});
        } else {
            setError('Credenciales no validas.');
        }
    }
    return (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h1>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                        Usuario
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nombre de usuario"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                        Contraseña
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="********"
                        />
                    </div>
                </div>

                {/*
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <input
                            id="rememberMe"
                            name="rememberMe"
                            type="checkbox"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                            Recordarme
                        </label>
                    </div>

                    <div className="text-sm">
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>
                </div>
*/}

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <span className="inline-flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Procesando...
                            </span>
                        ) : (
                            <span className="inline-flex items-center">
                                <LogIn className="mr-2 h-4 w-4" />
                                Iniciar Sesión
                            </span>
                        )}
                    </button>
                </div>
            </form>

            {/*
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    ¿No tienes una cuenta?{' '}
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                        Regístrate
                    </a>
                </p>
            </div>
            */}
        </div>
    );
}