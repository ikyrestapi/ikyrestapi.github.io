// File: pages/logs.js

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function LogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/logs');
            const data = await res.json();
            setLogs(data);
        } catch (error) {
            console.error("Failed to fetch logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="page-container">
            <Head>
                <title>PE-API - Live Logs</title>
                <meta name="description" content="View the last 20 API requests." />
                <link rel="icon" href="/logo.png" />
            </Head>
            <div className="content-wrap">
                <header className="docs-header">
                    <div className="site-header">
                        <div className="site-logo-text">
                            <Link href="/" passHref><span className="text-gradient">PE-API</span></Link>
                        </div>
                    </div>
                </header>

                <main className="docs-main">
                    <div className="docs-intro">
                        <h1>Live API <span className="text-gradient">Logs.</span></h1>
                        <p>Showing the last 20 requests made by all users. Data is updated on page load.</p>
                    </div>

                    <div className="content-header" style={{ marginBottom: '1rem' }}>
                        <h2>Recent Requests</h2>
                        <button onClick={fetchLogs} className="neo-button secondary" disabled={loading}>
                            {loading ? 'Loading...' : 'Refresh'}
                        </button>
                    </div>

                    <div className="logs-container">
                        {loading ? (
                            <p style={{ textAlign: 'center' }}>Loading logs...</p>
                        ) : logs.length > 0 ? (
                            logs.map((log, i) => {
                                const l = JSON.parse(log);
                                return (
                                    <div key={i} className="log-item">
                                        <span>{new Date(l.timestamp).toLocaleString()}</span>
                                        <span>{l.endpoint}</span>
                                        <span className={l.status === 'SUCCESS' ? 'log-success' : 'log-failed'}>
                                            {l.status} ({l.statusCode})
                                        </span>
                                    </div>
                                )
                            })
                        ) : (
                            <p style={{ textAlign: 'center' }}>No logs found.</p>
                        )}
                    </div>
                </main>
            </div>
            <footer className="site-footer">©2025 - LippWangsaff</footer>
        </div>
    );
}
