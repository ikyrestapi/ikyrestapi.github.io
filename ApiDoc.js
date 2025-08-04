import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image'; // Tambahkan import ini

const PossibleResponses = () => (
    <div className="possible-responses-table">
        <table>
            <thead><tr><th>Code</th><th>Description</th></tr></thead>
            <tbody>
                <tr><td><span className="status-code-box code-2xx">200</span></td><td>Success</td></tr>
                <tr><td><span className="status-code-box code-4xx">400</span></td><td>Bad Request (e.g., missing a required parameter)</td></tr>
                <tr><td><span className="status-code-box code-4xx">405</span></td><td>Method Not Allowed (use GET)</td></tr>
                <tr><td><span className="status-code-box code-5xx">500</span></td><td>Internal Server Error (upstream API might be down)</td></tr>
            </tbody>
        </table>
    </div>
);
const ApiDoc = ({ endpoint }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [jsonResult, setJsonResult] = useState(null);
    const [imageResult, setImageResult] = useState(null);
    const [responseMeta, setResponseMeta] = useState(null);
    const [error, setError] = useState(null);
    const [baseUrl, setBaseUrl] = useState('');
    const [curlCopied, setCurlCopied] = useState(false);
    const [responseCopied, setResponseCopied] = useState(false);
    const initialInputValues = endpoint.params.reduce((acc, param) => { acc[param.name] = param.defaultValue || ''; return acc; }, {});
    const [inputValues, setInputValues] = useState(initialInputValues);
    useEffect(() => { if (typeof window !== 'undefined') setBaseUrl(window.location.origin) }, []);
    useEffect(() => { if (curlCopied) { const timer = setTimeout(() => setCurlCopied(false), 2000); return () => clearTimeout(timer); } }, [curlCopied]);
    useEffect(() => { if (responseCopied) { const timer = setTimeout(() => setResponseCopied(false), 2000); return () => clearTimeout(timer); } }, [responseCopied]);
    const handleInputChange = (e) => { const { name, value } = e.target; setInputValues(prev => ({ ...prev, [name]: value })); };
    const handleSendRequest = async () => {
        setLoading(true); setJsonResult(null); setImageResult(null); setError(null); setResponseMeta(null);
        const startTime = performance.now();
        const queryParams = new URLSearchParams(Object.fromEntries(Object.entries(inputValues).filter(([_, v]) => v)));
        const url = `${baseUrl}${endpoint.path}?${queryParams.toString()}`;
        try {
            const response = await fetch(url);
            const endTime = performance.now();
            setResponseMeta({ status: response.status, time: Math.round(endTime - startTime) });
            const contentType = response.headers.get('content-type');
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({error: 'Failed to parse error JSON'}));
                throw new Error(errorData.details || errorData.error || 'Request failed');
            }
            if (contentType && contentType.includes('image')) {
                const blob = await response.blob();
                setImageResult(URL.createObjectURL(blob));
            } else {
                const data = await response.json();
                setJsonResult(data);
            }
        } catch (err) { setError(err.message); } finally { setLoading(false); }
    };
    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        if (type === 'curl') setCurlCopied(true);
        if (type === 'response') setResponseCopied(true);
    };
    const requestUrl = `${baseUrl}${endpoint.path}?${new URLSearchParams(Object.fromEntries(Object.entries(inputValues).filter(([_, v]) => v !== ''))).toString()}`;
    const curlCommand = `curl -X 'GET' \\\n  '${requestUrl}' \\\n  -H 'accept: */*'`;
    return (
        <div className="api-doc-card">
            <button className="api-doc-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="api-header-left">
                    <div className="api-title-bg"><span className="text-gradient">{endpoint.name}</span></div>
                </div>
                <div className="api-header-right">
                    <span className="api-category-tag">{endpoint.category}</span>
                    <span className={`api-toggle ${isOpen ? 'open' : ''}`}>▼</span>
                </div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div initial="collapsed" animate="open" exit="collapsed"
                        variants={{ open: { opacity: 1, height: 'auto' }, collapsed: { opacity: 0, height: 0 } }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}>
                        <div className="api-doc-content">
                            <p className="api-description">{endpoint.description}</p>
                            {endpoint.params.map(param => (
                                <div key={param.name} className="param-group">
                                    <label htmlFor={`${endpoint.id}-${param.name}`}>{param.label}</label>
                                    {param.type === 'select' ? (
                                        <div className="select-wrapper">
                                            <select id={`${endpoint.id}-${param.name}`} name={param.name} value={inputValues[param.name]} onChange={handleInputChange} className="neo-input">
                                                {param.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        </div>
                                    ) : (<input type="text" id={`${endpoint.id}-${param.name}`} name={param.name} value={inputValues[param.name]} onChange={handleInputChange} placeholder={param.placeholder} className="neo-input" />)}
                                </div>
                            ))}
                            <div className="button-group"><button className="neo-button" onClick={handleSendRequest} disabled={loading}>{loading ? 'Executing...' : 'Execute'}</button></div>
                            <div className="result-section">
                                <h4>Request</h4>
                                <div className="result-box code-box">
                                    <button className="copy-button" onClick={() => copyToClipboard(curlCommand, 'curl')}>{curlCopied ? 'Copied!' : 'Copy'}</button>
                                    <pre>{curlCommand}</pre>
                                </div>
                                <h4>Possible Responses</h4>
                                <PossibleResponses />
                            </div>
                            {(jsonResult || imageResult || error || loading) && (
                                <div className="result-section">
                                    <div className="result-header">
                                        <h4>Server Response</h4>
                                        {responseMeta && <span className={`response-status status-${String(responseMeta.status)[0]}`}>{responseMeta.status} ({responseMeta.time}ms)</span>}
                                    </div>
                                    <div className="result-box">
                                        {jsonResult && <button className="copy-button" onClick={() => copyToClipboard(JSON.stringify(jsonResult, null, 2), 'response')}>{responseCopied ? 'Copied!' : 'Copy'}</button>}
                                        {loading && <div className="loading-indicator"><span>.</span><span>.</span><span>.</span></div>}
                                        {error && <div className="code-box"><pre style={{color: 'var(--red)'}}>{JSON.stringify({ error: error }, null, 2)}</pre></div>}
                                        {jsonResult && <div className="code-box"><pre>{JSON.stringify(jsonResult, null, 2)}</pre></div>}
                                        {imageResult && <Image src={imageResult} alt="API Result" className="image-response" width={512} height={512} />}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default ApiDoc;
