export type MemoryPhoto = {
    id: string;
    title: string;
    dateLabel: string;
    source: any;
    resizeMode?: 'cover' | 'contain';
};

export const memoriesPhotos: MemoryPhoto[] = [
    {
        id: '1',
        title: 'O zi in care am fost atat de fericiti',
        dateLabel: 'Iulie 2025',
        source: require('../../assets/Memories/1.jpeg'),
    },
    {
        id: '2',
        title: 'Ziua in care am facut ce ai zis tu ',
        dateLabel: 'Aprilie 2025',
        source: require('../../assets/Memories/2.jpeg'),
    },
    {
        id: '3',
        title: 'Relaxare totala, fara griji, doar noi doi',
        dateLabel: 'Decembrie 2025',
        source: require('../../assets/Memories/3.jpeg'),
    },
    {
        id: '4',
        title: 'Shopping in doi',
        dateLabel: 'Octombrie 2025',
        source: require('../../assets/Memories/4.jpeg'),
    },
    {
        id: '5',
        title: 'O zi in care am fost deasupra tuturor, pentru ca eram impreuna',
        dateLabel: 'Mai 2025',
        source: require('../../assets/Memories/5.jpeg'),
    },
    {
        id: '6',
        title: 'Pentru ca ne satisfacem toate poftele',
        dateLabel: 'August 2025',
        source: require('../../assets/Memories/6.jpeg'),
        resizeMode: 'contain',
    },
    {
        id: '7',
        title: 'Inainte de efort',
        dateLabel: 'August 2025',
        source: require('../../assets/Memories/7.jpeg')
    },
    {
        id: '8',
        title: 'Noptile pana dimineata impreuna',
        dateLabel: 'Iulie 2025',
        source: require('../../assets/Memories/8.jpeg')
    },
    {
        id: '9',
        title: 'Iubirea pluteste in aer cand suntem impreuna11.',
        dateLabel: 'Februarie 2026',
        source: require('../../assets/Memories/9.jpeg')
    },
    {
        id: '10',
        title: 'Pentru ca am facut o cabana impreuna, chiar daca a fost doar pentru cateva ore.',
        dateLabel: 'Februarie 2026',
        source: require('../../assets/Memories/10.jpeg')
    },
    {
        id: '11',
        title: 'Noi stim semnele pepntru Cruce',
        dateLabel: 'Ianuarie 2026',
        source: require('../../assets/Memories/11.jpeg')
    },
    {
        id: '12',
        title: 'Ne mai si facem de cap uneori',
        dateLabel: 'Martie 2026',
        source: require('../../assets/Memories/14.jpeg')
    },
    {
        id: '17',
        title: 'Pentru ca suntem cea mai faina echipa',
        dateLabel: 'Martie 2026',
        source: require('../../assets/Memories/17.jpeg')
    }
];
