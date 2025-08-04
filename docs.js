import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import ApiDoc from '../components/ApiDoc';
import { useState, useMemo, useEffect } from 'react';
import apiEndpoints from '../utils/apiEndpoints';

const categories = ['All', ...new Set(apiEndpoints.map(e => e.category))].sort((a, b) => {
    if (a === 'All') return -1;
    if (b === 'All') return 1;
    return a.localeCompare(b);
});

export default function DocsPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [settings, setSettings] = useState({ whatsappUrl: '' });

    useEffect(() => {
        fetch('/api/admin/settings').then(res => res.json()).then(data => { if (data) setSettings(data) });
    }, []);

    const endpointCounts = useMemo(() => {
        const counts = { All: apiEndpoints.length };
        apiEndpoints.forEach(endpoint => { counts[endpoint.category] = (counts[endpoint.category] || 0) + 1; });
        return counts;
    }, []);

    const filteredEndpoints = useMemo(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        
        return apiEndpoints
            .filter(endpoint => {
                const categoryMatch = activeCategory === 'All' || endpoint.category === activeCategory;
                if (!categoryMatch) {
                    return false;
                }

                if (!lowercasedQuery) {
                    return true;
                }

                const nameMatch = endpoint.name && endpoint.name.toLowerCase().includes(lowercasedQuery);
                const descriptionMatch = endpoint.description && endpoint.description.toLowerCase().includes(lowercasedQuery);
                const pathMatch = endpoint.path && endpoint.path.toLowerCase().includes(lowercasedQuery);

                return nameMatch || descriptionMatch || pathMatch;
            })
            .sort((a, b) => a.name.localeCompare(b.name));

    }, [activeCategory, searchQuery]);

    return (
        <div className="page-container">
            <Head><title>VORTEX-API - Docs</title><meta name="description" content="Explore the documentation for VORTEX-API." /><link rel="icon" href="/logo.png" /></Head>
<Link href="/logs" passHref>
                <div className="peeking-image peeking-image-link">
                    <Image src="/docs-peeking.png" alt="Peeking" width={250} height={250} style={{ objectFit: "contain" }}/>
                </div>
            </Link>
            <div className="content-wrap">
                <header className="docs-header"><div className="site-header"><div className="site-logo-text"><Link href="/" passHref><span className="text-gradient">VORTEX-API</span></Link></div></div></header>
                <main className="docs-main">

                 <div className="docs-intro">
    <Link href="/logs" passHref style={{ textDecoration: 'none' }}>
        <h1 className="clickable-title">API <span className="text-gradient">Docs.</span></h1>
    </Link>
    <p>Discover and thoroughly explore our API endpoints. Test their capabilities, and unlock their potential to enhance your projects.</p>
</div>   
                    <div className="search-bar-container">
                        <input
                            type="text"
                            placeholder="Search endpoints by name, description, path..."
                            className="neo-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <div className="category-filters">{categories.map(category => (<button key={category} className={`category-button ${activeCategory === category ? 'active' : ''}`} onClick={() => setActiveCategory(category)}>{category} [ {endpointCounts[category]} ]</button>))}</div>
                    <div className="api-list">{filteredEndpoints.map(endpoint => (<ApiDoc key={endpoint.id} endpoint={endpoint} />))}</div>
                </main>
            </div>
            <footer className="site-footer">©2025 - ikyVortex</footer>
            {settings.whatsappUrl && <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="floating-whatsapp-btn"><Image src="/whatsapp-logo.jpg" alt="WhatsApp" width={55} height={55} /></a>}
        </div>
    )
}
