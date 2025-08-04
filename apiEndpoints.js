const vertexChatModels = ['gemini-1.5-flash', 'gemini-1.5-flash-002', 'gemini-1.5-pro', 'gemini-1.5-pro-002', 'gemini-2.0-flash', 'gemini-2.0-flash-001', 'gemini-2.0-flash-lite', 'gemini-2.0-flash-lite-001', 'gemini-2.5-flash', 'gemini-2.5-flash-lite-preview-06-17', 'gemini-2.5-pro'];

const vertexImageModels = ['imagen-3.0-generate-002', 'imagen-3.0-generate-001', 'imagen-3.0-fast-generate-001', 'imagen-3.0-capability-001', 'imagen-4.0-generate-preview-06-06', 'imagen-4.0-fast-generate-preview-06-06', 'imagen-4.0-ultra-generate-preview-06-06'];

const aspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];

const apiEndpoints = [

    ...Object.entries({
        'maid': 'Maid',
        'waifu': 'Waifu',
        'marin-kitagawa': 'Marin Kitagawa',
        'mori-calliope': 'Mori Calliope',
        'raiden-shogun': 'Raiden Shogun',
        'oppai': 'Oppai',
        'selfies': 'Selfies',
        'uniform': 'Uniform',
        'kamisato-ayaka': 'Kamisato Ayaka'
    }).map(([tag, name]) => ({
        id: `waifu-${tag}`,
        name: `Waifu (${name})`,
        category: 'Waifu',
        description: `Get a random SFW "${name}" image/GIF from Waifu.im. Returns an image file.`,
        path: `/api/waifu/${tag}`,
        params: []
    })),


    ...Object.entries({
        'ass': 'Ass',
        'hentai': 'Hentai',
        'milf': 'Milf',
        'oral': 'Oral',
        'paizuri': 'Paizuri',
        'ecchi': 'Ecchi',
        'ero': 'Ero'
    }).map(([tag, name]) => ({
        id: `waifu-${tag}`,
        name: `Waifuh (${name})`,
        category: 'NSFW',
        description: `Get a random NSFW "${name}" image/GIF from Waifu.im. Returns an image file.`,
        path: `/api/waifu/${tag}`,
        params: []
    })),

    {
        id: 'veo3-start',
        name: 'VEO3 Lite (Start)',
        category: 'AI Media',
        description: 'Start a text-to-video generation (from aivideogenerator.me) and get a ticket.',
        path: '/api/veo3-start',
        params: [{
                name: 'prompt',
                label: 'Prompt',
                placeholder: 'A cinematic shot of a futuristic city',
                required: true
            },
            {
                name: 'model',
                label: 'Model',
                type: 'select',
                defaultValue: 'veo-3-fast',
                options: ['veo-3-fast', 'veo-3']
            },
            {
                name: 'auto_sound',
                label: 'Auto Sound',
                type: 'select',
                defaultValue: 'false',
                options: ['true', 'false']
            },
            {
                name: 'auto_speech',
                label: 'Auto Speech',
                type: 'select',
                defaultValue: 'false',
                options: ['true', 'false']
            }
        ]
    },
    {
        id: 'veo3-result',
        name: 'VEO3 Lite (Get Result)',
        category: 'AI Media',
        description: 'Use the ticket from the "Start" endpoint to check status and get the final video.',
        path: '/api/veo3-result',
        params: [{
            name: 'ticket',
            label: 'Ticket',
            placeholder: 'Paste the ticket from the start endpoint here...',
            required: true
        }]
    },

    {
        id: 'veo3-v2-start',
        name: 'VEO3 Lite V2 (Start)',
        category: 'AI Media',
        description: 'Start a V2 text-to-video generation (from lunaai.video) and get a ticket.',
        path: '/api/veo3-v2-start',
        params: [{
                name: 'prompt',
                label: 'Prompt',
                placeholder: 'A hyper-realistic cat driving a car',
                required: true
            },
            {
                name: 'model',
                label: 'Model',
                type: 'select',
                defaultValue: 'veo-3-fast',
                options: ['veo-3-fast', 'veo-3']
            },
            {
                name: 'auto_sound',
                label: 'Auto Sound',
                type: 'select',
                defaultValue: 'false',
                options: ['true', 'false']
            },
            {
                name: 'auto_speech',
                label: 'Auto Speech',
                type: 'select',
                defaultValue: 'false',
                options: ['true', 'false']
            }
        ]
    },
    {
        id: 'veo3-v2-result',
        name: 'VEO3 Lite V2 (Get Result)',
        category: 'AI Media',
        description: 'Use the ticket from the V2 "Start" endpoint to check status and get the final video.',
        path: '/api/veo3-v2-result',
        params: [{
            name: 'ticket',
            label: 'Ticket',
            placeholder: 'Paste the ticket from the V2 start endpoint here...',
            required: true
        }]
    },

    {
        id: 'nik-parser',
        name: 'NIK Parser',
        category: 'Tools',
        description: 'Parse an Indonesian National Identity Number (NIK) to get detailed information.',
        path: '/api/nik-parse',
        params: [{
            name: 'nik',
            label: 'NIK (16 digits)',
            placeholder: 'XXXXXXXXXXXXXXXX',
            required: true
        }]
    },
    {
        id: 'vertex-chat',
        name: 'Vertex AI Chat (Gemini)',
        category: 'AI',
        description: 'Advanced chat with various Gemini models, with optional web search.',
        path: '/api/vertex/chat',
        params: [{
                name: 'question',
                label: 'Question',
                placeholder: 'What time is it in Indonesia?',
                required: true
            },
            {
                name: 'model',
                label: 'Model',
                type: 'select',
                defaultValue: 'gemini-1.5-flash',
                options: vertexChatModels
            },
            {
                name: 'system_instruction',
                label: 'System Prompt (Optional)',
                placeholder: 'You are a helpful assistant.'
            },
            {
                name: 'search',
                label: 'Use Search (true/false)',
                placeholder: 'false'
            }
        ]
    },

    {
        id: 'audio-transcribe',
        name: 'Audio Transcription',
        category: 'Tools',
        description: 'Transcribe an audio file to text. Use POST with a multipart/form-data "audio" field.',
        path: '/api/transcribe-audio',
        params: []
    },

    {
        id: 'tiktok-transcript',
        name: 'TikTok Transcript',
        category: 'Tools',
        description: 'Scrape the transcript from a TikTok video URL.',
        path: '/api/tiktok-transcript',
        params: [{
            name: 'url',
            label: 'TikTok Video URL',
            placeholder: 'https://vt.tiktok.com/ZSSd8quKg/',
            required: true
        }]
    },
    {
        id: 'youtube-transcript',
        name: 'YouTube Transcript',
        category: 'Tools',
        description: 'Scrape the transcript from a YouTube video URL.',
        path: '/api/youtube-transcript',
        params: [{
            name: 'url',
            label: 'YouTube Video URL',
            placeholder: 'https://youtu.be/oIHLgsPpSOE',
            required: true
        }]
    },

    {
        id: 'aio-downloader',
        name: 'All-In-One Downloader V2',
        category: 'Downloader',
        description: 'Download media from various platforms like Spotify, TikTok, Instagram, etc.',
        path: '/api/aio',
        params: [{
            name: 'url',
            label: 'Media URL',
            placeholder: 'https://open.spotify.com/track/3rPtS4nfpy7PsARctAWpzd',
            required: true
        }]
    },

    {
        id: 'animelovers-search',
        name: 'AnimeLovers Search',
        category: 'Search',
        description: 'Search for anime series on AnimeLovers.',
        path: '/api/animelovers/search',
        params: [{
            name: 'query',
            label: 'Query',
            placeholder: 'One Piece',
            required: true
        }]
    },
    {
        id: 'animelovers-detail',
        name: 'AnimeLovers Detail',
        category: 'Detail',
        description: 'Get details of an anime series using its URL slug.',
        path: '/api/animelovers/detail',
        params: [{
            name: 'url',
            label: 'Anime URL Slug',
            placeholder: 'one-piece-episode-1111-subtitle-indonesia',
            required: true
        }]
    },

    {
        id: 'animelovers-download',
        name: 'AnimeLovers Download',
        category: 'Downloader',
        description: 'Get download links for a specific anime episode. Use the episode URL from the "AnimeLovers Detail" endpoint.',
        path: '/api/animelovers/episode',
        params: [{
                name: 'url',
                label: 'Episode URL Slug (from Detail API)',
                placeholder: 'al-150479-3',
                required: true
            },
            {
                name: 'reso',
                label: 'Resolution',
                type: 'select',
                defaultValue: '720p',
                options: ['320p', '480p', '720p', '1080p', '4K']
            }
        ]
    },

    {
        id: 'copilot',
        name: 'Copilot ( Realtime )',
        category: 'AI',
        description: 'Chat with Microsoft Copilot. May timeout on free plans.',
        path: '/api/copilot',
        params: [{
            name: 'prompt',
            label: 'Prompt',
            placeholder: 'Hello, who are you?',
            required: true
        }]
    },

    {
        id: 'deobfuscator',
        name: 'JS Deobfuscator',
        category: 'Tools',
        description: 'Deobfuscate obfuscated JavaScript code using a GET request.',
        path: '/api/deobfuscate',
        params: [{
            name: 'code',
            label: 'JavaScript Code',
            placeholder: 'var _0x1234=...;',
            required: true
        }]
    },

    {
        id: 'obfuscator',
        name: 'JS Obfuscator',
        category: 'Tools',
        description: 'Obfuscate JavaScript code to make it difficult to read. For large scripts, it is recommended to use the POST method.',
        path: '/api/obfuscate',
        params: [{
            name: 'code',
            label: 'JavaScript Code',
            placeholder: 'const x = "Hello World"; console.log(x);',
            required: true
        }]
    },

    {
        id: 'txt2vid-result',
        name: 'Text to Video YC  Result',
        category: 'AI Media',
        description: 'Get the final video result using the ticket from the txt2vid endpoint.',
        path: '/api/txt2vid-result',
        params: [{
            name: 'ticket',
            label: 'Ticket',
            placeholder: 'ZmZmZTI1ZjFkNWQxYWJiMGMxMzg2MWU5NDdiZjEzN2F8fHwyMjZjODNhODFmNDcyNDQyY2YyNzgxMzdlZDc1MzAwZXx8fDAudFZrbleps...',
            required: true
        }]
    },
    {
        id: 'txt2vid',
        name: 'Text to Video YC',
        category: 'AI Media',
        description: 'Generate a short video from a text prompt. This may take some time.',
        path: '/api/txt2vid',
        params: [{
            name: 'prompt',
            label: 'Prompt',
            placeholder: 'A woman relaxing on the beach',
            required: true
        }, {
            name: 'ratio',
            label: 'Aspect Ratio',
            type: 'select',
            defaultValue: '16:9',
            options: ['16:9', '9:16', '1:1', '4:3', '3:4']
        }]
    },
    {
        id: 'chatai',
        name: 'ChatAI',
        category: 'AI',
        description: 'Access a variety of advanced AI models for complex chat interactions.',
        path: '/api/chatai',
        params: [{
            name: 'question',
            label: 'Question',
            placeholder: 'e.g., hi! what ai model are you using?',
            required: true
        }, {
            name: 'model',
            label: 'Model',
            type: 'select',
            defaultValue: 'grok-3-mini',
            options: ['gpt-4.1-nano', 'gpt-4.1-mini', 'gpt-4.1', 'o4-mini', 'deepseek-r1', 'deepseek-v3', 'claude-3.7', 'gemini-2.0', 'grok-3-mini', 'qwen-qwq-32b', 'gpt-4o', 'o3', 'gpt-4o-mini', 'llama-3.3']
        }, {
            name: 'system_prompt',
            label: 'System Prompt (Optional)',
            placeholder: 'e.g., You are a helpful assistant.'
        }]
    },
    {
        id: 'gpt',
        name: 'GPT',
        category: 'AI',
        de6scription: 'Classic GPT-3.5 and GPT-4 model access for general purposes.',
        path: '/api/gpt',
        params: [{
            name: 'prompt',
            label: 'Prompt',
            placeholder: 'e.g., hi, how are you?',
            required: true
        }, {
            name: 'model',
            label: 'Model',
            type: 'select',
            defaultValue: 'chatgpt4',
            options: ['chatgpt4', 'chatgpt3']
        }]
    },
    {
        id: 'kimiai',
        name: 'Kimi AI',
        category: 'AI',
        description: 'Advanced AI chat with web search capabilities.',
        path: '/api/kimiai',
        params: [{
            name: 'question',
            label: 'Question',
            placeholder: 'Berita terbaru di Indonesia?',
            required: true
        }, {
            name: 'model',
            label: 'Model',
            type: 'select',
            defaultValue: 'k2',
            options: ['k1.5', 'k2']
        }, {
            name: 'search',
            label: 'Use Search (true/false)',
            placeholder: 'true',
            defaultValue: 'true'
        }]
    },
    {
        id: 'askai',
        name: 'Ask AI',
        category: 'AI',
        description: 'Chat with various premium AI models.',
        path: '/api/askai',
        params: [{
            name: 'prompt',
            label: 'Prompt',
            placeholder: 'cara kembali dengan mantan',
            required: true
        }, {
            name: 'model',
            label: 'Model',
            type: 'select',
            defaultValue: 'Claude 3.5 Sonnet',
            options: ['ChatGPT-4o', 'ChatGPT-4o Mini', 'Claude 3 Opus', 'Claude 3.5 Sonnet', 'Llama 3', 'Llama 3.1 (Pro)', 'Perplexity AI', 'Mistral Large', 'Gemini 1.5 Pro']
        }]
    },
    {
        id: 'blackbox',
        name: 'Blackbox AI',
        category: 'AI',
        description: 'An AI model focused on coding assistance.',
        path: '/api/blackbox',
        params: [{
            name: 'prompt',
            label: 'Prompt',
            placeholder: 'create a snake game in python',
            required: true
        }]
    },
    {
        id: 'animagine',
        name: 'Animagine XL',
        category: 'AI Media',
        description: 'High-quality anime image generation using a proxied request. May be slow or unreliable.',
        path: '/api/animagine',
        params: [{
            name: 'prompt',
            label: 'Prompt',
            placeholder: '1girl, masterpiece, best quality, ...',
            required: true
        }, {
            name: 'style_preset',
            label: 'Style Preset',
            type: 'select',
            defaultValue: '(None)',
            options: ['(None)', 'Anim4gine', 'Painting', 'Pixel art', '1980s', '1990s', '2000s', 'Toon', 'Lineart', 'Art Nouveau', 'Western Comics', '3D', 'Realistic', 'Neonpunk']
        }, {
            name: 'aspect_ratio',
            label: 'Aspect Ratio',
            type: 'select',
            defaultValue: '1:1',
            options: ['1:1', '9:7', '7:9', '19:13', '13:19', '7:4', '4:7', '12:5', '5:12']
        }]
    },
    {
        id: 'txt2video',
        name: 'Text to Video Meta',
        category: 'AI Media',
        description: 'Generate a short video from a text prompt.',
        path: '/api/txt2video',
        params: [{
            name: 'prompt',
            label: 'Prompt',
            placeholder: 'A pixel-art queen, standing in her throne room',
            required: true
        }]
    },
    {
        id: 'deepimg',
        name: 'Deep Image',
        category: 'AI Media',
        description: 'Generate high-quality images with various styles.',
        path: '/api/deepimg',
        params: [{
            name: 'prompt',
            label: 'Prompt',
            placeholder: 'girl wearing glasses',
            required: true
        }, {
            name: 'style',
            label: 'Style',
            type: 'select',
            defaultValue: 'anime',
            options: ['default', 'ghibli', 'cyberpunk', 'anime', 'portrait', 'chibi', 'pixel art', 'oil painting', '3d']
        }, {
            name: 'size',
            label: 'Aspect Ratio',
            type: 'select',
            defaultValue: '1:1',
            options: ['1:1', '3:2', '2:3']
        }]
    },
    {
        id: 'txttoimage',
        name: 'Text to Image',
        category: 'AI Media',
        description: 'A simple text-to-image generator.',
        path: '/api/txttoimage',
        params: [{
            name: 'prompt',
            label: 'Prompt',
            placeholder: 'A majestic cat',
            required: true
        }]
    },
    {
        id: 'oai-edit',
        name: 'OpenAI Image Edit',
        category: 'AI Media',
        description: 'Edit an image using a text prompt. Returns image file.',
        path: '/api/oai-edit',
        params: [{
            name: 'url',
            label: 'Image URL',
            placeholder: 'https://tinyurl.com/yvfc8ovn',
            required: true
        }, {
            name: 'prompt',
            label: 'Edit Instruction',
            placeholder: 'Ubah menjadi gaya anime Studio Ghibli',
            required: true
        }]
    },
    {
        id: 'aifreebox',
        name: 'AIFreeBox Image',
        category: 'AI Media',
        description: 'Generate images using various specialized models.',
        path: '/api/aifreebox',
        params: [{
            name: 'prompt',
            label: 'Prompt',
            placeholder: 'cozy cafe',
            required: true
        }, {
            name: 'slug',
            label: 'Generator Type',
            type: 'select',
            defaultValue: 'ai-art-generator',
            options: ['ai-art-generator', 'ai-fantasy-map-creator', 'ai-youtube-thumbnail-generator', 'ai-old-cartoon-characters-generator']
        }, {
            name: 'ratio',
            label: 'Aspect Ratio',
            type: 'select',
            defaultValue: '16:9',
            options: ['1:1', '2:3', '9:16', '16:9']
        }]
    },
    {
        id: 'ytdl',
        name: 'YouTube DL',
        category: 'Downloader',
        description: 'Download videos and audio from YouTube.',
        path: '/api/ytdl',
        params: [{
            name: 'url',
            label: 'YouTube URL',
            placeholder: 'Enter YouTube video URL',
            required: true
        }]
    },
    {
        id: 'ytmp4',
        name: 'YTMP4 Info',
        category: 'Downloader',
        description: 'Get video info and available qualities from YouTube.',
        path: '/api/ytmp4',
        params: [{
            name: 'url',
            label: 'YouTube URL',
            placeholder: 'https://youtube.com/watch?v=60ItHLz5WEA',
            required: true
        }]
    },
    {
        id: 'ytmp3',
        name: 'YouTube MP3',
        category: 'Downloader',
        description: 'Download MP3 audio from a YouTube URL.',
        path: '/api/ytmp3',
        params: [{
            name: 'url',
            label: 'YouTube URL',
            placeholder: 'https://youtube.com/watch?v=CVvJp3d8xGQ',
            required: true
        }]
    },
    {
        id: 'snackvideo',
        name: 'SnackVideo DL',
        category: 'Downloader',
        description: 'Download videos from SnackVideo.',
        path: '/api/snackvideo',
        params: [{
            name: 'url',
            label: 'SnackVideo URL',
            placeholder: 'https://www.snackvideo.com/@kwai/video/xxxxx',
            required: true
        }]
    },
    {
        id: 'tiktokdl',
        name: 'TikTok DL',
        category: 'Downloader',
        description: 'Download videos or slideshow images from TikTok using a stable API.',
        path: '/api/tiktokdl',
        params: [{
            name: 'url',
            label: 'TikTok URL',
            placeholder: 'Enter TikTok video/slideshow URL',
            required: true
        }]
    },
    {
        id: 'spotifydl',
        name: 'Spotify DL',
        category: 'Downloader',
        description: 'Download songs from Spotify.',
        path: '/api/spotifydl',
        params: [{
            name: 'url',
            label: 'Spotify Track URL',
            placeholder: 'https://open.spotify.com/track/xxxxx',
            required: true
        }]
    },
    {
        id: 'fbdl',
        name: 'Facebook DL',
        category: 'Downloader',
        description: 'Download videos from Facebook.',
        path: '/api/fbdl',
        params: [{
            name: 'url',
            label: 'Facebook Video URL',
            placeholder: 'https://www.facebook.com/share/v/xxxxx/',
            required: true
        }]
    },
    {
        id: 'igdl',
        name: 'Instagram DL',
        category: 'Downloader',
        description: 'Download videos and images from Instagram.',
        path: '/api/igdl',
        params: [{
            name: 'url',
            label: 'Instagram URL',
            placeholder: 'https://www.instagram.com/p/xxxxx/',
            required: true
        }]
    },
    {
        id: 'ihancer',
        name: 'iHancer',
        category: 'Tools',
        description: 'Enhance image quality. Returns an image file.',
        path: '/api/ihancer',
        params: [{
            name: 'url',
            label: 'Image URL',
            placeholder: 'https://example.com/image.jpg',
            required: true
        }, {
            name: 'method',
            label: 'Method',
            type: 'select',
            defaultValue: '1',
            options: ['1', '2', '3', '4']
        }, {
            name: 'size',
            label: 'Max Size',
            type: 'select',
            defaultValue: 'low',
            options: ['low', 'medium', 'high']
        }]
    },
    {
        id: 'mosyne',
        name: 'Mosyne Tools',
        category: 'Tools',
        description: 'Remove background or upscale an image.',
        path: '/api/mosyne',
        params: [{
            name: 'url',
            label: 'Image URL',
            placeholder: 'https://example.com/image.jpg',
            required: true
        }, {
            name: 'type',
            label: 'Tool Type',
            type: 'select',
            defaultValue: 'upscale',
            options: ['removebg', 'upscale']
        }]
    },
    {
        id: 'ssweb',
        name: 'Screenshot Web',
        category: 'Tools',
        description: 'Take a screenshot of a website.',
        path: '/api/ssweb',
        params: [{
            name: 'url',
            label: 'Website URL',
            placeholder: 'https://example.com',
            required: true
        }]
    },
    {
        id: 'tempmail',
        name: 'Temp Mail',
        category: 'Tools',
        description: 'Generate temp mail, get inbox, and read messages.',
        path: '/api/tempmail',
        params: [{
            name: 'action',
            label: 'Action',
            type: 'select',
            defaultValue: 'inbox',
            options: ['create', 'inbox', 'read']
        }, {
            name: 'username',
            label: 'Username (for create)',
            placeholder: 'yourname'
        }, {
            name: 'domain',
            label: 'Domain (for create)',
            type: 'select',
            defaultValue: 'anjay.id',
            options: ['anjay.id', 'capcutisme.com', 'moviesme.com', 'freepalestine.id', 'motionisme.com']
        }, {
            name: 'email',
            label: 'Email (for inbox)',
            placeholder: 'yourname@anjay.id'
        }, {
            name: 'id',
            label: 'Message ID (for read)',
            placeholder: 'message_id'
        }]
    },
    {
        id: 'saveweb2zip',
        name: 'SaveWeb2Zip',
        category: 'Tools',
        description: 'Download an entire website as a ZIP file.',
        path: '/api/saveweb2zip',
        params: [{
            name: 'url',
            label: 'Website URL',
            placeholder: 'example.com',
            required: true
        }, {
            name: 'renameAssets',
            label: 'Rename Assets? (true/false)',
            defaultValue: 'false'
        }]
    },
    {
        id: 'musicscope',
        name: 'Music Scope',
        category: 'Tools',
        description: 'Create a music visualizer video from audio and image.',
        path: '/api/musicscope',
        params: [{
            name: 'audio_url',
            label: 'Audio URL',
            placeholder: 'https://example.com/audio.mp3',
            required: true
        }, {
            name: 'image_url',
            label: 'Image URL',
            placeholder: 'https://example.com/image.jpg',
            required: true
        }, {
            name: 'title',
            label: 'Title (Optional)'
        }, {
            name: 'artist',
            label: 'Artist (Optional)'
        }]
    },
    {
        id: 'amdata',
        name: 'Alight Motion Data',
        category: 'Tools',
        description: 'Scrape Alight Motion preset data.',
        path: '/api/amdata',
        params: [{
            name: 'url',
            label: 'Alight Motion Share URL',
            placeholder: 'https://alightcreative.com/am/share/...',
            required: true
        }]
    },
    {
        id: 'nakanime-search',
        name: 'Nakanime Search',
        category: 'Search',
        description: 'Search anime on Nakanime.',
        path: '/api/nakanime',
        params: [{
            name: 'action',
            label: 'Action',
            type: 'select',
            defaultValue: 'search',
            options: ['search']
        }, {
            name: 'query',
            label: 'Query',
            placeholder: 'Mushoku Tensei',
            required: true
        }]
    },
    {
        id: 'komikindo-search',
        name: 'KomikIndo Search',
        category: 'Search',
        description: 'Search manga on KomikIndo.',
        path: '/api/komikindo',
        params: [{
            name: 'action',
            label: 'Action',
            type: 'select',
            defaultValue: 'search',
            options: ['search']
        }, {
            name: 'query',
            label: 'Query',
            placeholder: 'Boruto',
            required: true
        }]
    },
    {
        id: 'komikindodetail',
        name: 'KomikIndo Detail',
        category: 'Detail',
        description: 'Get manga details by its ID from KomikIndo.',
        path: '/api/komikindodetail',
        params: [{
            name: 'id',
            label: 'Komik ID',
            placeholder: '135608',
            required: true
        }]
    },
    {
        id: 'kucing-search',
        name: 'Kucing Search',
        category: 'NSFW',
        description: 'Search NSFW content on Kucing.',
        path: '/api/kucing',
        params: [{
            name: 'action',
            label: 'Action',
            type: 'select',
            defaultValue: 'search',
            options: ['search']
        }, {
            name: 'query',
            label: 'Query',
            placeholder: 'loli',
            required: true
        }]
    },
    {
        id: 'kucing-latest',
        name: 'Kucing Latest',
        category: 'NSFW',
        description: 'Get latest NSFW content from Kucing.',
        path: '/api/kucing',
        params: [{
            name: 'action',
            label: 'Action',
            type: 'select',
            defaultValue: 'latest',
            options: ['latest']
        }]
    },
    {
        id: 'growagarden',
        name: 'Grow a Garden',
        category: 'Fun',
        description: 'Interact with the Grow a Garden Pro game.',
        path: '/api/growagarden',
        params: []
    },
    {
        id: 'ytplay',
        name: 'YouTube Play',
        category: 'Fun',
        description: 'Search and get download link for a YouTube video/audio.',
        path: '/api/ytplay',
        params: [{
            name: 'query',
            label: 'Query',
            placeholder: 'Never Gonna Give You Up',
            required: true
        }, {
            name: 'type',
            label: 'Type',
            type: 'select',
            defaultValue: 'audio',
            options: ['audio', 'video']
        }, {
            name: 'quality',
            label: 'Quality (Optional)',
            placeholder: '128kbps or 720p'
        }]
    }
];
export default apiEndpoints;