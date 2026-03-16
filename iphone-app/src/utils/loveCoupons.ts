import AsyncStorage from '@react-native-async-storage/async-storage';

export type Coupon = {
    id: string;
    title: string;
    description: string;
    countdown: number;
};

export type CouponUsageMap = Record<string, number | undefined>;

const USED_COUPONS_STORAGE_KEY = 'love-coupons-used-map';

export const COUPONS: Coupon[] = [
    {
        id: 'gug',
        title: 'Hug voucher',
        description: 'Voucher pentru o imbratisare lunga si calda, oricand ai nevoie de confort.',
        countdown: 24 * 60 * 60 * 1000
    },
    {
        id: 'feleac-nature',
        title: 'Iesire in natura pe Feleac',
        description: 'Voucher pentru o plimbare pe Feleac, in aer curat, povesti si poze impreuna.',
        countdown: 7 * 24 * 60 * 60 * 1000
    },
    {
        id: 'coffee-date',
        title: 'Coffee date surpriza',
        description: 'Voucher pentru o iesire la cafea in oras, doar noi doi si conversatii lungi.',
        countdown: 7 * 24 * 60 * 60 * 1000
    },
    {
        id: 'cluj-brunch',
        title: 'Brunch in oras',
        description: 'Voucher pentru un brunch in Cluj, intr-un local fain, cu mancare buna si timp doar pentru noi.',
        countdown: 7 * 24 * 60 * 60 * 1000
    },
    {
        id: 'board-game-night',
        title: 'Seara de jocuri in doi',
        description: 'Voucher pentru o seara relaxata cu jocuri, gustari bune si multa distractie.',
        countdown: 7 * 24 * 60 * 60 * 1000
    },
    {
        id: 'sunset-walk',
        title: 'Plimbare la apus',
        description: 'Voucher pentru o plimbare lunga, mana in mana prin Grigorescu.',
        countdown: 7 * 24 * 60 * 60 * 1000
    },
    {
        id: 'time-together',
        title: 'Timp doar pentru noi',
        description: 'Voucher care spune: vreau sa petrecem timp impreuna, fara telefoane si fara graba.',
        countdown: 7 * 24 * 60 * 60 * 1000
    },
    {
        id: 'breakfast',
        title: 'Mic dejun in pat',
        description: 'Voucher pentru o dimineata linistita, cu rasfat si cafea buna.',
        countdown: 7 * 24 * 60 * 60 * 1000
    },
    {
        id: 'movie-night',
        title: 'Movie night',
        description: 'Voucher pentru o seara de film in doi, cu popcorn si patura.',
        countdown: 7 * 24 * 60 * 60 * 1000
    },
    {
        id: 'shaorma-cheat-meal',
        title: 'Sharmola nesanatoasa ',
        description: 'Voucher pentru o shaorma buna: mergem la o shaorma buna, fara regrete.',
        countdown: 7 * 24 * 60 * 60 * 1000
    },
];

export const loadUsedCoupons = async (): Promise<CouponUsageMap> => {
    const rawValue = await AsyncStorage.getItem(USED_COUPONS_STORAGE_KEY);

    if (!rawValue) {
        return {};
    }

    try {
        const parsed = JSON.parse(rawValue) as Record<string, unknown>;
        const normalizedEntries = Object.entries(parsed).map(([couponId, value]) => {
            const validValue = typeof value === 'number' ? value : undefined;
            return [couponId, validValue] as const;
        });

        return Object.fromEntries(normalizedEntries);
    } catch {
        return {};
    }
};

export const saveUsedCoupons = async (usedCoupons: CouponUsageMap): Promise<void> => {
    await AsyncStorage.setItem(USED_COUPONS_STORAGE_KEY, JSON.stringify(usedCoupons));
};

export const getCouponRemainingMs = (coupon: Coupon, usedCoupons: CouponUsageMap, nowMs: number): number => {
    const usedAt = usedCoupons[coupon.id];

    if (!usedAt) {
        return 0;
    }

    const remainingMs = usedAt + coupon.countdown - nowMs;
    return remainingMs > 0 ? remainingMs : 0;
};

export const formatRemainingTime = (remainingMs: number): string => {
    const totalMinutes = Math.floor(remainingMs / 60000);
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;

    return `${days} zile ${hours} ore ${minutes} minute`;
};
