import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import {
    getNextEncouragementNotificationDate,
    getNotificationDays,
    getNotificationTime,
    NotificationDays,
    scheduleDailyEncouragementNotifications,
    saveNotificationDays,
    saveNotificationTime,
    supportsReliableBackgroundNotifications,
} from '../../utils/notificationScheduler';
import {
    SyncResult,
    isRemoteNotificationServerConfigured,
    syncNotificationSettingsToServer,
    supportsWebPushNotifications,
} from '../../utils/remoteNotificationClient';
import { styles } from './SettingsScreen.styles';

const WEEKDAY_OPTIONS: Array<{ value: number; label: string }> = [
    { value: 1, label: 'Luni' },
    { value: 2, label: 'Marti' },
    { value: 3, label: 'Miercuri' },
    { value: 4, label: 'Joi' },
    { value: 5, label: 'Vineri' },
    { value: 6, label: 'Sambata' },
    { value: 0, label: 'Duminica' },
];

const clamp = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
};

const parseSafeNumber = (input: string, fallback: number): number => {
    const parsed = Number(input);
    if (Number.isNaN(parsed)) {
        return fallback;
    }

    return parsed;
};

const showPlatformAlert = (title: string, message: string): void => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.alert === 'function') {
        window.alert(`${title}\n\n${message}`);
        return;
    }

    Alert.alert(title, message);
};

const formatNextScheduledDate = (date: Date): string => {
    return new Intl.DateTimeFormat('ro-RO', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

const getRemoteSyncMessage = (result: SyncResult): string => {
    switch (result.reason) {
        case 'missing-server-url':
            return 'Setarea a fost salvata local, dar lipseste EXPO_PUBLIC_NOTIFICATION_SERVER_URL.';
        case 'missing-vapid-public-key':
            return 'Setarea a fost salvata local, dar lipseste EXPO_PUBLIC_NOTIFICATION_VAPID_PUBLIC_KEY.';
        case 'unsupported-browser':
            return 'Browserul curent nu suporta Web Push. Pe iPhone foloseste Safari si instaleaza site-ul pe Home Screen.';
        case 'permission-denied':
            return 'Setarea a fost salvata, dar browserul nu are permisiune pentru notificari.';
        default:
            if (result.status) {
                return `Setarea a fost salvata local, dar sincronizarea cu serverul a esuat (${result.status}). ${result.details ?? ''}`.trim();
            }

            if (result.details) {
                return `Setarea a fost salvata local, dar sincronizarea cu serverul a esuat. ${result.details}`;
            }

            return 'Setarea a fost salvata local, dar sincronizarea cu serverul a esuat.';
    }
};

const SettingsScreen = () => {
    const [hourInput, setHourInput] = useState('07');
    const [minuteInput, setMinuteInput] = useState('00');
    const [selectedDays, setSelectedDays] = useState<NotificationDays>([1, 2, 3, 4, 5]);
    const [feedbackText, setFeedbackText] = useState('');

    useEffect(() => {
        const loadCurrentTime = async () => {
            const currentTime = await getNotificationTime();
            const currentDays = await getNotificationDays();
            setHourInput(String(currentTime.hour).padStart(2, '0'));
            setMinuteInput(String(currentTime.minute).padStart(2, '0'));
            setSelectedDays(currentDays);
        };

        void loadCurrentTime();
    }, []);

    const toggleDay = (dayValue: number) => {
        setSelectedDays((previousDays) => {
            if (previousDays.includes(dayValue)) {
                if (previousDays.length === 1) {
                    return previousDays;
                }

                return previousDays.filter((day) => day !== dayValue);
            }

            return [...previousDays, dayValue].sort((a, b) => a - b);
        });
    };

    const handleSave = async () => {
        const parsedHour = clamp(parseSafeNumber(hourInput, 7), 0, 23);
        const parsedMinute = clamp(parseSafeNumber(minuteInput, 0), 0, 59);

        if (selectedDays.length === 0) {
            showPlatformAlert('Selectie necesara', 'Alege cel putin o zi pentru notificari.');
            return;
        }

        try {
            await saveNotificationTime({ hour: parsedHour, minute: parsedMinute, });

            await saveNotificationDays(selectedDays);

            setHourInput(String(parsedHour).padStart(2, '0'));
            setMinuteInput(String(parsedMinute).padStart(2, '0'));

            if (Platform.OS !== 'web') {
                try {
                    await scheduleDailyEncouragementNotifications();
                    const nextNotificationDate = await getNextEncouragementNotificationDate();
                    const nextNotificationText = nextNotificationDate
                        ? `Urmatoarea notificare este programata pentru ${formatNextScheduledDate(nextNotificationDate)}.`
                        : `Notificarile vor veni la ora ${String(parsedHour).padStart(2, '0')}:${String(parsedMinute).padStart(2, '0')}.`;
                    setFeedbackText(`Ora a fost salvata si notificarile au fost reprogramate. ${nextNotificationText}`);
                    showPlatformAlert('Setare salvata', nextNotificationText);
                } catch {
                    setFeedbackText('Ora a fost salvata. Reprogramarea notificarilor nu a reusit acum.');
                    showPlatformAlert('Setare salvata', 'Ora a fost salvata, dar notificarile nu au putut fi reprogramate acum.');
                }
            } else {
                const syncResult = await syncNotificationSettingsToServer(
                    { hour: parsedHour, minute: parsedMinute },
                    selectedDays,
                    { requestPermission: true }
                );

                if (!syncResult.synced) {
                    const failureMessage = getRemoteSyncMessage(syncResult);
                    setFeedbackText(failureMessage);
                    showPlatformAlert('Setare salvata', failureMessage);
                }
            }
        } catch {
            setFeedbackText('Nu am putut salva setarile. Incearca din nou.');
            showPlatformAlert('Eroare', 'Nu am putut salva setarile. Incearca din nou.');
        }
    };

    const content = (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.card}>
                <Text style={styles.title}>Setari notificari</Text>
                <Text style={styles.subtitle}>Alege ora la care sa primesti mesajul zilnic de incurajare.</Text>
                {Platform.OS === 'web' ? (
                    <Text style={styles.helperText}>Notificarile web sunt trimise acum de serverul Cloudflare. Pe iPhone functioneaza doar daca site-ul este instalat pe Home Screen ca PWA si permiti notificarile.</Text>
                ) : !supportsReliableBackgroundNotifications() ? (
                    <Text style={styles.helperText}>Notificarile locale in fundal nu sunt garantate pe aceasta platforma.</Text>
                ) : null}
                {Platform.OS === 'web' && !supportsWebPushNotifications() ? (
                    <Text style={styles.helperText}>Browserul actual nu expune API-urile necesare pentru Web Push.</Text>
                ) : null}
                {Platform.OS === 'web' && !isRemoteNotificationServerConfigured() ? (
                    <Text style={styles.helperText}>Lipsesc variabilele EXPO_PUBLIC_NOTIFICATION_SERVER_URL si/sau EXPO_PUBLIC_NOTIFICATION_VAPID_PUBLIC_KEY.</Text>
                ) : null}

                <View style={styles.row}>
                    <TextInput
                        value={hourInput}
                        onChangeText={setHourInput}
                        keyboardType="number-pad"
                        maxLength={2}
                        style={styles.input}
                        placeholder="07"
                        placeholderTextColor="#C3979F"
                    />
                    <Text style={styles.separator}>:</Text>
                    <TextInput
                        value={minuteInput}
                        onChangeText={setMinuteInput}
                        keyboardType="number-pad"
                        maxLength={2}
                        style={styles.input}
                        placeholder="00"
                        placeholderTextColor="#C3979F"
                    />
                </View>

                <Text style={styles.helperText}>Format 24h: ora 0-23 si minute 0-59.</Text>

                <Text style={styles.daysTitle}>Zile pentru notificari</Text>
                <Text style={styles.daysSubtitle}>Selecteaza una sau mai multe zile.</Text>

                <View style={styles.daysGrid}>
                    {WEEKDAY_OPTIONS.map((dayOption) => {
                        const isSelected = selectedDays.includes(dayOption.value);

                        return (
                            <TouchableOpacity
                                key={dayOption.value}
                                style={[styles.dayItem, isSelected ? styles.dayItemSelected : undefined]}
                                onPress={() => toggleDay(dayOption.value)}
                                activeOpacity={0.85}
                            >
                                <View style={[styles.checkbox, isSelected ? styles.checkboxSelected : undefined]}>
                                    {isSelected ? <Text style={styles.checkboxCheck}>✓</Text> : null}
                                </View>
                                <Text style={[styles.dayLabel, isSelected ? styles.dayLabelSelected : undefined]}>
                                    {dayOption.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <TouchableOpacity onPress={handleSave} style={styles.saveButton} activeOpacity={0.85}>
                    <Text style={styles.saveButtonText}>Salveaza ora</Text>
                </TouchableOpacity>

                {feedbackText ? <Text style={styles.feedback}>{feedbackText}</Text> : null}
            </View>
        </ScrollView>
    );

    if (Platform.OS === 'web') {
        return content;
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            {content}
        </TouchableWithoutFeedback>
    );
};

export default SettingsScreen;
