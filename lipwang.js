import { useState, useEffect } from 'react';
import Head from 'next/head';
import initialEndpoints from '../utils/apiEndpoints';
export default function AdminPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('logs');
    const [logs, setLogs] = useState([]);
    const [settings, setSettings] = useState({ whatsappUrl: '' });
    const [endpoints, setEndpoints] = useState(initialEndpoints);
    const [generatedCode, setGeneratedCode] = useState('');
    useEffect(() => { if (isLoggedIn) { fetchLogs(); fetchSettings(); } }, [isLoggedIn]);
    const fetchLogs = async () => { const res = await fetch('/api/admin/logs'); if(res.ok) { const data = await res.json(); setLogs(data); } };
    const fetchSettings = async () => { const res = await fetch('/api/admin/settings'); if(res.ok) { const data = await res.json(); if(data) setSettings(data); } };
    const handleLogin = async (e) => { e.preventDefault(); setError(''); try { const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) }); if (res.ok) { setIsLoggedIn(true); } else { const data = await res.json(); setError(data.message || 'Login failed'); } } catch (err) { setError('An error occurred.'); } };
    const handleSaveSettings = async () => { const res = await fetch('/api/admin/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) }); if (res.ok) alert('Settings saved!'); else alert('Failed to save settings.'); };
    const handleDeleteEndpoint = (idToDelete) => { if (confirm(`Are you sure you want to delete the endpoint with id: "${idToDelete}"?`)) { const newEndpoints = endpoints.filter(ep => ep.id !== idToDelete); setEndpoints(newEndpoints); alert('Endpoint removed from list. Generate and update docs.js to apply changes.'); }};
    const generateDocsCode = () => { const code = `const apiEndpoints = ${JSON.stringify(endpoints, null, 4)};\n\nexport default apiEndpoints;`; setGeneratedCode(code); alert('Code generated! Copy it and replace the content of utils/apiEndpoints.js'); };
    if (!isLoggedIn) {
        return (<>
            <Head><title>Admin Login</title></Head>
            <div className="admin-login-container"><form onSubmit={handleLogin} className="admin-form"><h1 className="text-gradient">Admin Panel</h1><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required className="neo-input" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="neo-input" /><button type="submit" className="neo-button">Login</button>{error && <p className="error-message">{error}</p>}</form></div>
        </>);
    }
    return (<>
        <Head><title>Admin Dashboard</title></Head>
        <main className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <div className="admin-tabs">
                <button onClick={() => setActiveTab('logs')} className={activeTab === 'logs' ? 'active' : ''}>Logs</button>
                <button onClick={() => setActiveTab('endpoints')} className={activeTab === 'endpoints' ? 'active' : ''}>Manage Endpoints</button>
                <button onClick={() => setActiveTab('settings')} className={activeTab === 'settings' ? 'active' : ''}>Site Settings</button>
            </div>
            <div className="admin-content">
                {activeTab === 'logs' && (<div><div className="content-header"><h2>API Request Logs</h2><button onClick={fetchLogs} className="neo-button secondary">Refresh</button></div><div className="logs-container">{logs.map((log, i) => { const l = JSON.parse(log); return (<div key={i} className="log-item"><span>{new Date(l.timestamp).toLocaleString()}</span><span>{l.endpoint}</span><span className={l.status === 'SUCCESS' ? 'log-success' : 'log-failed'}>{l.status} ({l.statusCode})</span></div>)})}</div></div>)}
                {activeTab === 'endpoints' && (<div><h2>Manage Endpoints</h2><p>To add a new endpoint, manually add it to <code>utils/apiEndpoints.js</code> and redeploy. To delete, use the buttons below then generate and update the file.</p><div className="endpoint-list">{endpoints.map(ep => (<div key={ep.id} className="endpoint-item"><span><strong>{ep.name}</strong> ({ep.category}) - <code>{ep.id}</code></span><button onClick={() => handleDeleteEndpoint(ep.id)} className="delete-btn">Delete</button></div>))}</div><hr/><button onClick={generateDocsCode} className="neo-button">Generate Code for `apiEndpoints.js`</button>{generatedCode && <pre className="code-box">{generatedCode}</pre>}</div>)}
                {activeTab === 'settings' && (<div><h2>Site Settings</h2><div className="settings-form"><label>WhatsApp Group URL</label><input type="text" value={settings.whatsappUrl} onChange={(e) => setSettings({ ...settings, whatsappUrl: e.target.value })} className="neo-input" placeholder="https://chat.whatsapp.com/..." /><button onClick={handleSaveSettings} className="neo-button">Save Settings</button></div></div>)}
            </div>
        </main>
    </>);
}
