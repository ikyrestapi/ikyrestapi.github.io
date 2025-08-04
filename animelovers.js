// File: utils/animelovers.js
import axios from 'axios';

class AnimeLovers {
    constructor() {
        this.client = axios.create({
            baseURL: 'https://apps.animekita.org/api/v1.1.9',
            headers: {
                'user-agent': 'Dart/3.1 (dart:io)',
                'accept-encoding': 'gzip',
                'host': 'apps.animekita.org'
            }
        });
    }

    search = async function(query) {
        if (!query) throw new Error('Query is required');
        const { data } = await this.client(`/search.php?keyword=${query}`);
        return data;
    }

    detail = async function(url) {
        if (!url) throw new Error('Url is required');
        const { data } = await this.client(`/series.php?url=${url}`);
        return data;
    }

    episode = async function(url, reso = '720p') {
        const _reso = ['320p', '480p', '720p', '1080p', '4K'];
        if (!url) throw new Error('Url is required');
        if (!_reso.includes(reso)) throw new Error(`List available resolutions: ${_reso.join(', ')}`);
        const { data } = await this.client(`/chapter.php?url=${url}&reso=${reso}`);
        return data;
    }
}

export default AnimeLovers;
