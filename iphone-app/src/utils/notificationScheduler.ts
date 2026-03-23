import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { encouragementMessages } from './encouragementMessages';

const DAILY_NOTIFICATION_TAG = 'daily-encouragement';
const NOTIFICATION_TIME_STORAGE_KEY = 'daily-notification-time';
const NOTIFICATION_DAYS_STORAGE_KEY = 'daily-notification-days';
const WEB_LAST_NOTIFICATION_KEY = 'web-last-daily-encouragement';
const DEFAULT_NOTIFICATION_HOUR = 21;
const DEFAULT_NOTIFICATION_MINUTE = 34;
const DEFAULT_NOTIFICATION_DAYS: number[] = [1, 2, 3, 4, 5];
const WEB_NOTIFICATION_CHECK_INTERVAL_MS = 30_000;

let webNotificationInterval: ReturnType<typeof setInterval> | null = null;

export type NotificationTime = {
    hour: number;
    minute: number;
};

export type NotificationDays = number[];

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true
    })
});

const getRandomMessage = (): string => {
    const randomIndex = Math.floor(Math.random() * encouragementMessages.length);
    return encouragementMessages[randomIndex];
};

const sanitizeNotificationTime = (time: NotificationTime): NotificationTime => {
    const safeHour = Math.min(Math.max(time.hour, 0), 23);
    const safeMinute = Math.min(Math.max(time.minute, 0), 59);

    return {
        hour: safeHour,
        minute: safeMinute,
    };
};

const sanitizeNotificationDays = (days: NotificationDays): NotificationDays => {
    const validDays = days
        .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
        .filter((day, index, array) => array.indexOf(day) === index)
        .sort((a, b) => a - b);

    return validDays.length > 0 ? validDays : DEFAULT_NOTIFICATION_DAYS;
};

export const getNotificationTime = async (): Promise<NotificationTime> => {
    const rawValue = await AsyncStorage.getItem(NOTIFICATION_TIME_STORAGE_KEY);

    if (!rawValue) {
        return {
            hour: DEFAULT_NOTIFICATION_HOUR,
            minute: DEFAULT_NOTIFICATION_MINUTE,
        };
    }

    try {
        const parsed = JSON.parse(rawValue) as Partial<NotificationTime>;
        const hour = typeof parsed.hour === 'number' ? parsed.hour : DEFAULT_NOTIFICATION_HOUR;
        const minute = typeof parsed.minute === 'number' ? parsed.minute : DEFAULT_NOTIFICATION_MINUTE;
        return sanitizeNotificationTime({ hour, minute });
    } catch {
        return {
            hour: DEFAULT_NOTIFICATION_HOUR,
            minute: DEFAULT_NOTIFICATION_MINUTE,
        };
    }
};

export const saveNotificationTime = async (time: NotificationTime): Promise<void> => {
    const safeTime = sanitizeNotificationTime(time);
    await AsyncStorage.setItem(NOTIFICATION_TIME_STORAGE_KEY, JSON.stringify(safeTime));
};

export const getNotificationDays = async (): Promise<NotificationDays> => {
    const rawValue = await AsyncStorage.getItem(NOTIFICATION_DAYS_STORAGE_KEY);

    if (!rawValue) {
        return DEFAULT_NOTIFICATION_DAYS;
    }

    try {
        const parsed = JSON.parse(rawValue) as unknown;

        if (!Array.isArray(parsed)) {
            return DEFAULT_NOTIFICATION_DAYS;
        }

        const numericDays = parsed.filter((value): value is number => typeof value === 'number');
        return sanitizeNotificationDays(numericDays);
    } catch {
        return DEFAULT_NOTIFICATION_DAYS;
    }
};

export const saveNotificationDays = async (days: NotificationDays): Promise<void> => {
    const safeDays = sanitizeNotificationDays(days);
    await AsyncStorage.setItem(NOTIFICATION_DAYS_STORAGE_KEY, JSON.stringify(safeDays));
};

export const supportsReliableBackgroundNotifications = (): boolean => {
    return Platform.OS !== 'web';
};

const toExpoWeekday = (day: number): number => {
    return day === 0 ? 1 : day + 1;
};

const createWeeklyTrigger = (day: number, notificationTime: NotificationTime) => {
    return {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: toExpoWeekday(day),
        hour: notificationTime.hour,
        minute: notificationTime.minute
    } as const;
};

const getBrowserApis = () => {
    if (typeof globalThis === 'undefined') {
        return null;
    }

    return globalThis as typeof globalThis & {
        Notification?: {
            permission?: string;
            requestPermission?: () => Promise<string>;
            new(title: string, options?: { body?: string }): unknown;
        };
    };
};

const getWebNotificationInstanceKey = (date: Date): string => {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
        String(date.getHours()).padStart(2, '0'),
        String(date.getMinutes()).padStart(2, '0'),
    ].join('-');
};

const requestWebNotificationPermission = async (): Promise<boolean> => {
    const browserApis = getBrowserApis();

    if (!browserApis?.Notification) {
        return false;
    }

    if (browserApis.Notification.permission === 'granted') {
        return true;
    }

    if (browserApis.Notification.permission === 'denied') {
        return false;
    }

    const permission = await browserApis.Notification.requestPermission?.();
    return permission === 'granted';
};

const clearWebNotificationScheduler = (): void => {
    if (!webNotificationInterval) {
        return;
    }

    clearInterval(webNotificationInterval);
    webNotificationInterval = null;
};

const scheduleWebEncouragementNotifications = async (): Promise<void> => {
    clearWebNotificationScheduler();

    const hasPermission = await requestWebNotificationPermission();
    if (!hasPermission) {
        return;
    }

    const browserApis = getBrowserApis();
    if (!browserApis?.Notification) {
        return;
    }

    const checkAndNotify = async () => {
        const now = new Date();
        const notificationTime = await getNotificationTime();
        const notificationDays = await getNotificationDays();

        if (!notificationDays.includes(now.getDay())) {
            return;
        }

        if (now.getHours() !== notificationTime.hour || now.getMinutes() !== notificationTime.minute) {
            return;
        }

        const currentNotificationKey = getWebNotificationInstanceKey(now);
        const lastNotificationKey = await AsyncStorage.getItem(WEB_LAST_NOTIFICATION_KEY);

        if (lastNotificationKey === currentNotificationKey) {
            return;
        }

        await AsyncStorage.setItem(WEB_LAST_NOTIFICATION_KEY, currentNotificationKey);
        new browserApis.Notification('Mesaj de incurajare', {
            body: getRandomMessage(),
        });
    };

    await checkAndNotify();
    webNotificationInterval = setInterval(() => {
        void checkAndNotify();
    }, WEB_NOTIFICATION_CHECK_INTERVAL_MS);
};

const configureNotificationChannel = async (): Promise<void> => {
    if (Platform.OS !== 'android') {
        return;
    }

    await Notifications.setNotificationChannelAsync('daily-encouragement', {
        name: 'Daily Encouragement',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default'
    });
};

const clearPreviouslyScheduledEncouragementNotifications = async (): Promise<void> => {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

    const encouragementNotifications = scheduledNotifications.filter((notification) => {
        const data = notification.content.data as { tag?: string } | undefined;
        return data?.tag === DAILY_NOTIFICATION_TAG;
    });

    await Promise.all(
        encouragementNotifications.map((notification) =>
            Notifications.cancelScheduledNotificationAsync(notification.identifier)
        )
    );
};

const hasGrantedNativeNotificationPermissions = (permissions: Notifications.NotificationPermissionsStatus): boolean => {
    if (Platform.OS === 'ios') {
        const iosStatus = permissions.ios?.status;
        return (
            iosStatus === Notifications.IosAuthorizationStatus.AUTHORIZED ||
            iosStatus === Notifications.IosAuthorizationStatus.PROVISIONAL ||
            iosStatus === Notifications.IosAuthorizationStatus.EPHEMERAL
        );
    }

    return permissions.status === 'granted';
};

const requestNativeNotificationPermissions = async (): Promise<boolean> => {
    const permissions = await Notifications.requestPermissionsAsync({
        ios: {
            allowAlert: true,
            allowBadge: false,
            allowSound: true,
        },
    });

    return hasGrantedNativeNotificationPermissions(permissions);
};

export const scheduleDailyEncouragementNotifications = async (): Promise<void> => {
    if (Platform.OS === 'web') {
        await scheduleWebEncouragementNotifications();
        return;
    }

    const hasPermission = await requestNativeNotificationPermissions();

    if (!hasPermission) {
        return;
    }

    await configureNotificationChannel();
    await clearPreviouslyScheduledEncouragementNotifications();

    const notificationTime = await getNotificationTime();
    const notificationDays = await getNotificationDays();
    for (const day of notificationDays) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Daily Message',
                body: getRandomMessage(),
                sound: true,
                data: {
                    tag: DAILY_NOTIFICATION_TAG
                }
            },
            trigger: createWeeklyTrigger(day, notificationTime)
        });
    }
};

export const getNextEncouragementNotificationDate = async (): Promise<Date | null> => {
    if (Platform.OS === 'web') {
        return null;
    }

    const notificationTime = await getNotificationTime();
    const notificationDays = await getNotificationDays();
    const nextTriggerDates = await Promise.all(
        notificationDays.map((day) => Notifications.getNextTriggerDateAsync(createWeeklyTrigger(day, notificationTime)))
    );

    const validTriggerDates = nextTriggerDates.filter((value): value is number => typeof value === 'number');

    if (validTriggerDates.length === 0) {
        return null;
    }

    return new Date(Math.min(...validTriggerDates));
};
