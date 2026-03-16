import { Ionicons } from '@expo/vector-icons';

export type ReasonCard = {
    monthLabel: string;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
};

export type GrowthMoment = {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    text: string;
};

export type BeforeAfterCard = {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    beforeText: string;
    afterText: string;
};

export const loveReasons: ReasonCard[] = [
    {
        monthLabel: 'Luna 1',
        title: 'Pentru linistea pe care mi-o dai',
        description: 'Cu tine, totul se aseaza. Chiar si zilele agitate par mai usoare cand stiu ca te am langa mine.',
        icon: 'heart',
    },
    {
        monthLabel: 'Luna 2',
        title: 'Pentru felul in care razi',
        description: 'Ai un ras care imi schimba instant starea si face orice moment sa para mai viu.',
        icon: 'happy',
    },
    {
        monthLabel: 'Luna 3',
        title: 'Pentru ca faci banalul special',
        description: 'O plimbare, o cafea, o seara obisnuita, toate devin amintiri cand le traiesc cu tine.',
        icon: 'cafe',
    },
    {
        monthLabel: 'Luna 4',
        title: 'Pentru blandetea ta',
        description: 'Ai un fel de a vorbi, de a atinge si de a intelege care ma face sa ma simt in siguranta.',
        icon: 'flower',
    },
    {
        monthLabel: 'Luna 5',
        title: 'Pentru ca ma faci sa vreau mai mult de la mine',
        description: 'Nu prin presiune, ci prin simplul fapt ca imi arati cum arata iubirea frumoasa si curata.',
        icon: 'trending-up',
    },
    {
        monthLabel: 'Luna 6',
        title: 'Pentru privirea ta',
        description: 'Uneori imi spui mai mult dintr-o privire decat ar putea sa-mi spuna orice text lung.',
        icon: 'eye',
    },
    {
        monthLabel: 'Luna 7',
        title: 'Pentru rabdarea ta cu mine',
        description: 'M-ai invatat ca iubirea adevarata are si rabdare, si calm, si intelegere.',
        icon: 'hourglass',
    },
    {
        monthLabel: 'Luna 8',
        title: 'Pentru ca esti acasa pentru mine',
        description: 'Nu locul conteaza cel mai mult, ci sentimentul ca langa tine ma simt exact unde trebuie.',
        icon: 'home',
    },
    {
        monthLabel: 'Luna 9',
        title: 'Pentru micile tale gesturi',
        description: 'Felul in care ma intrebi daca am mancat, daca am ajuns bine sau daca sunt ok spune enorm despre tine.',
        icon: 'hand-left',
    },
    {
        monthLabel: 'Luna 10',
        title: 'Pentru ca imi esti si iubita, si prietena',
        description: 'Cu tine pot sa fiu romantic, copil, vulnerabil si sincer, fara sa ma ascund.',
        icon: 'chatbubble-ellipses',
    },
    {
        monthLabel: 'Luna 11',
        title: 'Pentru felul in care ma inspiri',
        description: 'Ma faci sa vreau sa construiesc, sa iubesc mai bine si sa fac lucrurile cu mai mult suflet.',
        icon: 'sparkles',
    },
    {
        monthLabel: 'Luna 12',
        title: 'Pentru ca esti tu',
        description: 'La final, cel mai mare motiv ramane simplu: te iubesc pentru cine esti in esenta ta.',
        icon: 'infinite',
    },
];

export const growthMoments: GrowthMoment[] = [
    {
        icon: 'leaf',
        title: 'M-ai facut mai calm',
        text: 'Nu mai reactionez la fel de haotic. Cu tine am invatat sa respir, sa ascult si sa aleg pacea.',
    },
    {
        icon: 'home',
        title: 'M-ai facut sa ma simt acasa',
        text: 'Ai construit in mine sentimentul acela rar de confort profund, sincer si linistitor.',
    },
    {
        icon: 'heart-half',
        title: 'M-ai invatat sa iubesc mai curat',
        text: 'Mai atent, mai prezent, mai asumat. Cu tine, iubirea nu mai e doar sentiment, ci alegere zilnica.',
    },
];

export const beforeAfterCards: BeforeAfterCard[] = [
    {
        title: 'Cum vedeam iubirea',
        icon: 'contrast',
        beforeText: 'Inainte de tine, iubirea parea ceva frumos, dar greu de tinut cu adevarat in palme.',
        afterText: 'Dupa ce ai aparut tu, iubirea a devenit reala, calda si suficient de puternica incat sa-mi schimbe lumea.',
    },
    {
        title: 'Cum ma vedeam pe mine',
        icon: 'person',
        beforeText: 'Inainte de tine, aveam parti din mine pe care nu stiam cum sa le arat si nici daca merita vazute.',
        afterText: 'Dupa ce ai aparut tu, am invatat sa ma arat mai sincer, pentru ca langa tine nu simt nevoia sa ma ascund.',
    },
];
