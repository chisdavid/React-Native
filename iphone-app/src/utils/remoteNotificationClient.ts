import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const INSTALLATION_ID_STORAGE_KEY = 'remote-notification-installation-id';
const NOTIFICATION_TIME_STORAGE_KEY = 'daily-notification-time';
const NOTIFICATION_DAYS_STORAGE_KEY = 'daily-notification-days';
const DEFAULT_NOTIFICATION_HOUR = 10;
const DEFAULT_NOTIFICATION_MINUTE = 10;
const DEFAULT_NOTIFICATION_DAYS: number[] = [1, 2, 3, 4, 5];

type NotificationTime = {
    hour: number;
    minute: number;
};

type SyncOptions = {
    requestPermission: boolean;
};

type SyncResultReason =
    | 'success'
    | 'unsupported-platform'
    | 'unsupported-browser'
    | 'missing-server-url'
    | 'missing-vapid-public-key'
    | 'permission-denied'
    | 'sync-failed';

export type SyncResult = {
    synced: boolean;
    reason: SyncResultReason;
    status?: number;
    details?: string;
};

const getServerUrl = (): string => {
    return process.env.EXPO_PUBLIC_NOTIFICATION_SERVER_URL?.trim().replace(/\/+$/, '') ?? '';
};

const getVapidPublicKey = (): string => {
    return process.env.EXPO_PUBLIC_NOTIFICATION_VAPID_PUBLIC_KEY?.trim() ?? '';
};

export const isRemoteNotificationServerConfigured = (): boolean => {
    return getServerUrl().length > 0 && getVapidPublicKey().length > 0;
};

export const supportsWebPushNotifications = (): boolean => {
    if (Platform.OS !== 'web') {
        return false;
    }

    return (
        typeof window !== 'undefined' &&
        typeof navigator !== 'undefined' &&
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window
    );
};

const sanitizeNotificationTime = (time: NotificationTime): NotificationTime => {
    return {
        hour: Math.min(Math.max(time.hour, 0), 23),
        minute: Math.min(Math.max(time.minute, 0), 59),
    };
};

const sanitizeNotificationDays = (days: number[]): number[] => {
    const safeDays = days
        .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
        .filter((day, index, values) => values.indexOf(day) === index)
        .sort((left, right) => left - right);

    return safeDays.length > 0 ? safeDays : DEFAULT_NOTIFICATION_DAYS;
};

const readStoredNotificationTime = async (): Promise<NotificationTime> => {
    const rawValue = await AsyncStorage.getItem(NOTIFICATION_TIME_STORAGE_KEY);

    if (!rawValue) {
        return {
            hour: DEFAULT_NOTIFICATION_HOUR,
            minute: DEFAULT_NOTIFICATION_MINUTE,
        };
    }

    try {
        const parsed = JSON.parse(rawValue) as Partial<NotificationTime>;
        return sanitizeNotificationTime({
            hour: typeof parsed.hour === 'number' ? parsed.hour : DEFAULT_NOTIFICATION_HOUR,
            minute: typeof parsed.minute === 'number' ? parsed.minute : DEFAULT_NOTIFICATION_MINUTE,
        });
    } catch {
        return {
            hour: DEFAULT_NOTIFICATION_HOUR,
            minute: DEFAULT_NOTIFICATION_MINUTE,
        };
    }
};

const readStoredNotificationDays = async (): Promise<number[]> => {
    const rawValue = await AsyncStorage.getItem(NOTIFICATION_DAYS_STORAGE_KEY);

    if (!rawValue) {
        return DEFAULT_NOTIFICATION_DAYS;
    }

    try {
        const parsed = JSON.parse(rawValue) as unknown;
        if (!Array.isArray(parsed)) {
            return DEFAULT_NOTIFICATION_DAYS;
        }

        return sanitizeNotificationDays(parsed.filter((value): value is number => typeof value === 'number'));
    } catch {
        return DEFAULT_NOTIFICATION_DAYS;
    }
};

const createInstallationId = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    return `install-${Date.now()}-${Math.round(Math.random() * 1_000_000)}`;
};

const getInstallationId = async (): Promise<string> => {
    const existingValue = await AsyncStorage.getItem(INSTALLATION_ID_STORAGE_KEY);
    if (existingValue) {
        return existingValue;
    }

    const nextValue = createInstallationId();
    await AsyncStorage.setItem(INSTALLATION_ID_STORAGE_KEY, nextValue);
    return nextValue;
};

const urlBase64ToUint8Array = (value: string): Uint8Array => {
    const padding = '='.repeat((4 - (value.length % 4)) % 4);
    const base64 = `${value}${padding}`.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);

    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const toApplicationServerKey = (value: string): ArrayBuffer => {
    const bytes = urlBase64ToUint8Array(value);
    const copy = new Uint8Array(bytes.byteLength);
    copy.set(bytes);
    return copy.buffer;
};

const ensurePushPermission = async (requestPermission: boolean): Promise<boolean> => {
    if (!supportsWebPushNotifications()) {
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (!requestPermission) {
        return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
};

const registerPushSubscription = async (requestPermission: boolean): Promise<PushSubscriptionJSON | null> => {
    const vapidPublicKey = getVapidPublicKey();
    if (!vapidPublicKey) {
        return null;
    }

    const hasPermission = await ensurePushPermission(requestPermission);
    if (!hasPermission) {
        return null;
    }

    const serviceWorkerRegistration = await navigator.serviceWorker.register('/notification-sw.js');
    const activeRegistration = await navigator.serviceWorker.ready;
    const currentSubscription = await activeRegistration.pushManager.getSubscription();

    if (currentSubscription) {
        return currentSubscription.toJSON();
    }

    const createdSubscription = await serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: toApplicationServerKey(vapidPublicKey),
    });

    return createdSubscription.toJSON();
};

const postSettingsToServer = async (payload: unknown): Promise<SyncResult> => {
    const serverUrl = getServerUrl();
    if (!serverUrl) {
        return { synced: false, reason: 'missing-server-url' };
    }

    try {
        const response = await fetch(`${serverUrl}/api/device/sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const responseText = await response.text();
            return {
                synced: false,
                reason: 'sync-failed',
                status: response.status,
                details: responseText || 'Serverul a raspuns cu eroare fara body.',
            };
        }

        return { synced: true, reason: 'success' };
    } catch (error) {
        return {
            synced: false,
            reason: 'sync-failed',
            details: error instanceof Error ? error.message : 'Network request failed.',
        };
    }
};

export const syncNotificationSettingsToServer = async (notificationTime: NotificationTime, notificationDays: number[], options: SyncOptions,): Promise<SyncResult> => {
    if (Platform.OS !== 'web') {
        return { synced: false, reason: 'unsupported-platform' };
    }

    if (!supportsWebPushNotifications()) {
        return { synced: false, reason: 'unsupported-browser' };
    }

    if (!getServerUrl()) {
        return { synced: false, reason: 'missing-server-url' };
    }

    if (!getVapidPublicKey()) {
        return { synced: false, reason: 'missing-vapid-public-key' };
    }

    const subscription = await registerPushSubscription(options.requestPermission);
    if (!subscription) {
        return { synced: false, reason: 'permission-denied' };
    }

    const installationId = await getInstallationId();

    return postSettingsToServer({
        installationId,
        platform: Platform.OS,
        appOrigin: typeof window !== 'undefined' ? window.location.origin : undefined,
        schedule: {
            hour: notificationTime.hour,
            minute: notificationTime.minute,
            days: sanitizeNotificationDays(notificationDays),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        },
        subscription,
        pushEnabled: true,
    });
};

export const syncStoredNotificationPreferencesToServer = async (options: SyncOptions): Promise<SyncResult> => {
    const notificationTime = await readStoredNotificationTime();
    const notificationDays = await readStoredNotificationDays();

    return syncNotificationSettingsToServer(notificationTime, notificationDays, options);
};