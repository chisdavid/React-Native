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
        title: 'Primul nostru moment special',
        dateLabel: 'Martie 2025',
        source: require('../../assets/Memories/1.jpeg'),
    },
    {
        id: '2',
        title: 'Ziua in care am ras nonstop',
        dateLabel: 'Aprilie 2025',
        source: require('../../assets/Memories/2.jpeg'),
    },
    {
        id: '3',
        title: 'Seara noastra preferata',
        dateLabel: 'Iunie 2025',
        source: require('../../assets/Memories/3.jpeg'),
    },
    {
        id: '4',
        title: 'Shopping in doi',
        dateLabel: 'August 2025',
        source: require('../../assets/Memories/4.jpeg'),
    },
    {
        id: '5',
        title: 'Pe',
        dateLabel: 'August 2025',
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
];
