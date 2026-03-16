import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { encouragementMessages } from './encouragementMessages';

const DAILY_NOTIFICATION_TAG = 'daily-encouragement';
const NOTIFICATIONS_TO_SCHEDULE = 30;
const NOTIFICATION_TIME_STORAGE_KEY = 'daily-notification-time';
const NOTIFICATION_DAYS_STORAGE_KEY = 'daily-notification-days';
const DEFAULT_NOTIFICATION_HOUR = 21;
const DEFAULT_NOTIFICATION_MINUTE = 34;
const DEFAULT_NOTIFICATION_DAYS: number[] = [1, 2, 3, 4, 5];

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

const getFirstNotificationDate = (notificationTime: NotificationTime): Date => {
    const now = new Date();
    const firstDate = new Date();
    firstDate.setHours(notificationTime.hour, notificationTime.minute, 0, 0);

    if (firstDate <= now) {
        firstDate.setDate(firstDate.getDate() + 1);
    }

    return firstDate;
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

const addDays = (baseDate: Date, days: number): Date => {
    const nextDate = new Date(baseDate);
    nextDate.setDate(baseDate.getDate() + days);
    return nextDate;
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

export const scheduleDailyEncouragementNotifications = async (): Promise<void> => {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== 'granted') {
        return;
    }

    await configureNotificationChannel();
    await clearPreviouslyScheduledEncouragementNotifications();

    const notificationTime = await getNotificationTime();
    const notificationDays = await getNotificationDays();
    const firstDate = getFirstNotificationDate(notificationTime);
    let scheduledNotifications = 0;

    for (let dayOffset = 0; scheduledNotifications < NOTIFICATIONS_TO_SCHEDULE; dayOffset += 1) {
        const triggerDate = addDays(firstDate, dayOffset);

        if (!notificationDays.includes(triggerDate.getDay())) {
            continue;
        }

        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Mesaj de incurajare',
                body: getRandomMessage(),
                sound: 'default',
                data: {
                    tag: DAILY_NOTIFICATION_TAG
                }
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: triggerDate
            }
        });

        scheduledNotifications += 1;
    }
};
