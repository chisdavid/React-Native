import { importPKCS8, SignJWT } from 'jose';

type NotificationSchedule = {
    hour: number;
    minute: number;
    days: number[];
    timeZone: string;
};

type PushSubscriptionRecord = {
    endpoint: string;
    expirationTime?: number | null;
    keys: {
        p256dh: string;
        auth: string;
    };
};

type DeviceRecord = {
    installationId: string;
    platform: string;
    appOrigin?: string;
    schedule: NotificationSchedule;
    subscription: PushSubscriptionRecord | null;
    pushEnabled: boolean;
    lastSentLocalKey?: string;
    createdAt: string;
    updatedAt: string;
};

type Env = {
    NOTIFICATION_KV: KVNamespace;
    VAPID_PUBLIC_KEY: string;
    VAPID_PRIVATE_KEY: string;
    VAPID_SUBJECT: string;
    ALLOWED_ORIGINS?: string;
};


const DEVICE_PREFIX = 'device:';
const DEFAULT_HOUR = 21;
const DEFAULT_MINUTE = 34;
const DEFAULT_DAYS = [1, 2, 3, 4, 5];
const DEFAULT_TIME_ZONE = 'Europe/Bucharest';
const DEFAULT_MESSAGES = [
    'Te iubesc. Respira, zambeste si continua.',
    'Ai grija de tine astazi. Eu sunt cu tine.',
    'Un pas mic azi inseamna progres real.',
    'Meriti liniste, iubire si o zi buna.',
    'Nu uita: esti importanta pentru mine.',
];

const WEEKDAY_MAP: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
};

const jsonResponse = (request: Request, env: Env, data: unknown, status = 200): Response => {
    return new Response(JSON.stringify(data, null, 2), {
        status,
        headers: {
            'content-type': 'application/json; charset=utf-8',
            ...getCorsHeaders(request, env),
        },
    });
};

const getAllowedOrigins = (env: Env): string[] => {
    if (!env.ALLOWED_ORIGINS) {
        return ['*'];
    }

    return env.ALLOWED_ORIGINS
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
};

const getCorsHeaders = (request: Request, env: Env): HeadersInit => {
    const origin = request.headers.get('Origin');
    const allowedOrigins = getAllowedOrigins(env);

    if (!origin) {
        return {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        };
    }

    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return {
            'Access-Control-Allow-Origin': allowedOrigins.includes('*') ? '*' : origin,
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            Vary: 'Origin',
        };
    }

    return {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        Vary: 'Origin',
    };
};

const getRandomMessage = (): string => {
    const randomIndex = Math.floor(Math.random() * DEFAULT_MESSAGES.length);
    return DEFAULT_MESSAGES[randomIndex];
};

const isValidDay = (value: unknown): value is number => {
    return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 6;
};

const isValidTimeZone = (value: unknown): value is string => {
    if (typeof value !== 'string' || value.trim().length === 0) {
        return false;
    }

    try {
        new Intl.DateTimeFormat('en-US', { timeZone: value }).format(new Date());
        return true;
    } catch {
        return false;
    }
};

const sanitizeSchedule = (schedule: Partial<NotificationSchedule> | null | undefined): NotificationSchedule => {
    const hour = typeof schedule?.hour === 'number' ? Math.min(Math.max(Math.trunc(schedule.hour), 0), 23) : DEFAULT_HOUR;
    const minute = typeof schedule?.minute === 'number' ? Math.min(Math.max(Math.trunc(schedule.minute), 0), 59) : DEFAULT_MINUTE;
    const days = Array.isArray(schedule?.days)
        ? [...new Set(schedule.days.filter(isValidDay))].sort((left, right) => left - right)
        : DEFAULT_DAYS;
    const timeZone = isValidTimeZone(schedule?.timeZone) ? schedule?.timeZone ?? DEFAULT_TIME_ZONE : DEFAULT_TIME_ZONE;

    return {
        hour,
        minute,
        days: days.length > 0 ? days : DEFAULT_DAYS,
        timeZone,
    };
};

const sanitizeInstallationId = (value: unknown): string | null => {
    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();
    if (!trimmed || trimmed.length > 128) {
        return null;
    }

    return trimmed;
};

const sanitizeSubscription = (value: unknown): PushSubscriptionRecord | null => {
    if (!value || typeof value !== 'object') {
        return null;
    }

    const candidate = value as Partial<PushSubscriptionRecord>;

    if (
        typeof candidate.endpoint !== 'string' ||
        !candidate.endpoint ||
        typeof candidate.keys?.p256dh !== 'string' ||
        typeof candidate.keys?.auth !== 'string'
    ) {
        return null;
    }

    return {
        endpoint: candidate.endpoint,
        expirationTime: typeof candidate.expirationTime === 'number' ? candidate.expirationTime : null,
        keys: {
            p256dh: candidate.keys.p256dh,
            auth: candidate.keys.auth,
        },
    };
};

const getDeviceKey = (installationId: string): string => {
    return `${DEVICE_PREFIX}${installationId}`;
};

const getLocalDateParts = (date: Date, timeZone: string) => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    });
    const rawParts = formatter.formatToParts(date);
    const parts = Object.fromEntries(rawParts.map((part) => [part.type, part.value]));

    return {
        hour: Number(parts.hour),
        minute: Number(parts.minute),
        weekday: WEEKDAY_MAP[parts.weekday ?? ''],
        localKey: `${parts.year}-${parts.month}-${parts.day}-${parts.hour}-${parts.minute}`,
    };
};

const shouldSendNow = (record: DeviceRecord, now: Date): { shouldSend: boolean; localKey: string } => {
    const localParts = getLocalDateParts(now, record.schedule.timeZone);

    if (!record.pushEnabled || !record.subscription) {
        return { shouldSend: false, localKey: localParts.localKey };
    }

    if (!record.schedule.days.includes(localParts.weekday)) {
        return { shouldSend: false, localKey: localParts.localKey };
    }

    if (record.schedule.hour !== localParts.hour || record.schedule.minute !== localParts.minute) {
        return { shouldSend: false, localKey: localParts.localKey };
    }

    if (record.lastSentLocalKey === localParts.localKey) {
        return { shouldSend: false, localKey: localParts.localKey };
    }

    return { shouldSend: true, localKey: localParts.localKey };
};

const buildVapidToken = async (env: Env, audience: string): Promise<string> => {
    const privateKey = await importPKCS8(env.VAPID_PRIVATE_KEY, 'ES256');

    // VAPID_SUBJECT/audience pair is used by push services to verify the legitimacy of the token.  
    return new SignJWT({ sub: env.VAPID_SUBJECT })
        .setProtectedHeader({ alg: 'ES256', typ: 'JWT' })
        .setAudience(audience)
        .setIssuedAt()
        .setExpirationTime('12h')
        .sign(privateKey);
};

const sendPushNotification = async (record: DeviceRecord, env: Env): Promise<Response> => {
    if (!record.subscription) {
        throw new Error('Missing push subscription.');
    }

    const endpointUrl = new URL(record.subscription.endpoint);
    const audience = `${endpointUrl.protocol}//${endpointUrl.host}`;
    const vapidToken = await buildVapidToken(env, audience);

    return fetch(record.subscription.endpoint, {
        method: 'POST',
        headers: {
            Authorization: `vapid t=${vapidToken}, k=${env.VAPID_PUBLIC_KEY}`,
            'Crypto-Key': `p256ecdsa=${env.VAPID_PUBLIC_KEY}`,
            TTL: '300',
            Urgency: 'normal',
            'Content-Length': '0',
        },
    });
};

const processDevice = async (record: DeviceRecord, env: Env, now: Date): Promise<void> => {
    const decision = shouldSendNow(record, now);
    if (!decision.shouldSend) {
        return;
    }

    const response = await sendPushNotification(record, env);

    if (response.ok) {
        const updatedRecord: DeviceRecord = {
            ...record,
            lastSentLocalKey: decision.localKey,
            updatedAt: now.toISOString(),
        };

        await env.NOTIFICATION_KV.put(getDeviceKey(record.installationId), JSON.stringify(updatedRecord));
        return;
    }

    if (response.status === 404 || response.status === 410) {
        const updatedRecord: DeviceRecord = {
            ...record,
            subscription: null,
            pushEnabled: false,
            updatedAt: now.toISOString(),
        };

        await env.NOTIFICATION_KV.put(getDeviceKey(record.installationId), JSON.stringify(updatedRecord));
        return;
    }

    throw new Error(`Push delivery failed with status ${response.status}.`);
};

const processScheduledNotifications = async (env: Env): Promise<void> => {
    const now = new Date();
    let cursor: string | undefined;

    do {
        const listResult = await env.NOTIFICATION_KV.list({ prefix: DEVICE_PREFIX, cursor });
        cursor = listResult.list_complete ? undefined : listResult.cursor;

        for (const key of listResult.keys) {
            const rawRecord = await env.NOTIFICATION_KV.get(key.name, 'json');
            const record = rawRecord as DeviceRecord | null;

            if (!record) {
                continue;
            }

            try {
                await processDevice(record, env, now);
            } catch (error) {
                console.error(`Unable to process ${record.installationId}`, error);
            }
        }
    } while (cursor);
};

const handleSyncDevice = async (request: Request, env: Env): Promise<Response> => {
    const body = await request.json() as {
        installationId?: string;
        platform?: string;
        appOrigin?: string;
        schedule?: Partial<NotificationSchedule>;
        subscription?: unknown;
        pushEnabled?: boolean;
    };
    const installationId = sanitizeInstallationId(body.installationId);

    if (!installationId) {
        return jsonResponse(request, env, { error: 'installationId is required.' }, 400);
    }

    const existingRaw = await env.NOTIFICATION_KV.get(getDeviceKey(installationId), 'json');
    const existingRecord = existingRaw as DeviceRecord | null;
    const schedule = sanitizeSchedule(body.schedule ?? existingRecord?.schedule);
    const subscription = sanitizeSubscription(body.subscription) ?? existingRecord?.subscription ?? null;
    const pushEnabled = typeof body.pushEnabled === 'boolean' ? body.pushEnabled : Boolean(subscription);
    const now = new Date().toISOString();

    const nextRecord: DeviceRecord = {
        installationId,
        platform: typeof body.platform === 'string' && body.platform ? body.platform : existingRecord?.platform ?? 'web',
        appOrigin: typeof body.appOrigin === 'string' && body.appOrigin ? body.appOrigin : existingRecord?.appOrigin,
        schedule,
        subscription,
        pushEnabled,
        lastSentLocalKey: existingRecord?.lastSentLocalKey,
        createdAt: existingRecord?.createdAt ?? now,
        updatedAt: now,
    };

    await env.NOTIFICATION_KV.put(getDeviceKey(installationId), JSON.stringify(nextRecord));

    return jsonResponse(request, env, {
        ok: true,
        installationId,
        pushEnabled: nextRecord.pushEnabled,
        schedule: nextRecord.schedule,
    });
};

const handleRequest = async (request: Request, env: Env): Promise<Response> => {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: getCorsHeaders(request, env),
        });
    }

    if (request.method === 'GET' && url.pathname === '/health') {
        return jsonResponse(request, env, {
            ok: true,
            service: 'notification-server',
            time: new Date().toISOString(),
        });
    }

    if (request.method === 'GET' && url.pathname === '/api/public/message') {
        return jsonResponse(request, env, {
            title: 'Mesaj de incurajare',
            body: getRandomMessage(),
        });
    }

    if (request.method === 'POST' && url.pathname === '/api/device/sync') {
        return handleSyncDevice(request, env);
    }

    return jsonResponse(request, env, { error: 'Not found.' }, 404);
};

export default {
    fetch(request: Request, env: Env): Promise<Response> {
        return handleRequest(request, env);
    },
    scheduled(_controller: ScheduledController, env: Env, executionContext: ExecutionContext): void {
        executionContext.waitUntil(processScheduledNotifications(env));
    },
};