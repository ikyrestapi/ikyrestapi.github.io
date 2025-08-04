import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
const specialThanks = [{ name: 'Allah SWT', handle: '@God' }, { name: 'Iky', handle: '@ikyvortex' }, { name: 'Natzu', handle: '@yutorinatzu' }];
export default function Home() {
    const [settings, setSettings] = useState({ whatsappUrl: '' });
    useEffect(() => { fetch('/api/admin/settings').then(res => res.json()).then(data => { if (data) setSettings(data) }); }, []);
    return (
        <div className="page-container">
            <Head><title>VORTEX-API - Home</title><meta name="description" content="A collection of free, powerful, and easy-to-use APIs." /><link rel="icon" href="/logo.png" /></Head>
            <div className="content-wrap">
                <header className="site-header"><div className="site-logo-text"><span className="text-gradient">VORTEX-API</span></div><div className="header-logo-wrapper"><Image src="/logo.png" alt="PE" width={60} height={60} /></div></header>
                <main className="landing-main">
                    <div className="intro-text-section"><h2><span className="text-gradient">VORTEX</span> API</h2><p>VORTEX-API provides fast, secure, and flexible API solutions for developers. Designed for seamless integration with various platforms to accelerate your application development process.</p></div>
                    <div className="landing-image-wrapper"><Image src="/landing-bg.png" alt="Anime girl holding a sign" layout="fill" objectFit="contain" quality={100} priority /><Link href="/docs" passHref><div className="explore-link-wrapper"><span className="explore-text">Explore Documentation</span></div></Link></div>
                    <div className="thanks-section"><h2>Special <span className="text-gradient">Thanks.</span></h2><div className="thanks-grid">{specialThanks.map(person => (<div key={person.name} className="thanks-item"><h3>{person.name}</h3><p>{person.handle}</p></div>))}</div></div>
                </main>
            </div>
            <footer className="site-footer">©2025 - ikyVortex</footer>
            {settings.whatsappUrl && <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="floating-whatsapp-btn"><Image src="/whatsapp-logo.jpg" alt="WhatsApp" width={55} height={55} /></a>}
        </div>
    )
}
