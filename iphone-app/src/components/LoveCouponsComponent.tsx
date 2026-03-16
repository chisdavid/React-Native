import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COUPONS, Coupon, CouponUsageMap, formatRemainingTime, getCouponRemainingMs, loadUsedCoupons, saveUsedCoupons } from '../utils/loveCoupons';

const COUPON_RECEIVER_PHONE = '0744807415';

const toUnicodeBold = (text: string): string => {
    return Array.from(text)
        .map((char) => {
            const code = char.codePointAt(0);

            if (!code) {
                return char;
            }

            if (code >= 65 && code <= 90) {
                return String.fromCodePoint(0x1d400 + (code - 65));
            }

            if (code >= 97 && code <= 122) {
                return String.fromCodePoint(0x1d41a + (code - 97));
            }

            if (code >= 48 && code <= 57) {
                return String.fromCodePoint(0x1d7ce + (code - 48));
            }

            return char;
        })
        .join('');
};

const getCouponMessage = (coupon: Coupon): string => {
    const boldTitle = toUnicodeBold(coupon.title);
    return `Salut, iubire! \nFolosesc voucherul: \n\n${boldTitle}. \n\n${coupon.description}`;
};

const buildSmsUrl = (phone: string, body: string): string => {
    const encodedMessage = encodeURIComponent(body);
    const separator = Platform.OS === 'ios' ? '&' : '?';
    return `sms:${phone}${separator}body=${encodedMessage}`;
};

const LoveCoupons = () => {
    const [usedCoupons, setUsedCoupons] = useState<CouponUsageMap>({});
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        let isMounted = true;

        const initializeUsedCoupons = async () => {
            const savedUsedCoupons = await loadUsedCoupons();

            if (isMounted) {
                setUsedCoupons(savedUsedCoupons);
            }
        };

        void initializeUsedCoupons();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const couponCountdowns = useMemo(() => {
        const countdowns: Record<string, string> = {};

        COUPONS.forEach((coupon) => {
            const remainingMs = getCouponRemainingMs(coupon, usedCoupons, now);

            if (remainingMs <= 0) {
                return;
            }

            countdowns[coupon.id] = formatRemainingTime(remainingMs);
        });

        return countdowns;
    }, [now, usedCoupons]);

    const isCouponOnCooldown = (couponId: string): boolean => {
        return Boolean(couponCountdowns[couponId]);
    };

    const sendCouponSms = async (coupon: Coupon) => {
        const smsUrl = buildSmsUrl(COUPON_RECEIVER_PHONE, getCouponMessage(coupon));

        try {
            const canOpenSms = await Linking.canOpenURL(smsUrl);

            if (!canOpenSms) {
                Alert.alert('SMS indisponibil', 'Nu am putut deschide aplicatia de mesaje.');
                return;
            }

            await Linking.openURL(smsUrl);

            setUsedCoupons((previous) => {
                const nextUsedCoupons = {
                    ...previous,
                    [coupon.id]: Date.now(),
                };

                void saveUsedCoupons(nextUsedCoupons);
                return nextUsedCoupons;
            });
        } catch {
            Alert.alert('Eroare', 'Nu am putut pregati mesajul pentru acest voucher.');
        }
    };

    const handleCouponPress = async (coupon: Coupon) => {
        await sendCouponSms(coupon);
    };

    return (
        <View style={styles.wrapper}>
            <Text style={styles.title}>Love Coupons</Text>
            <Text style={styles.subtitle}>Alege un voucher special si foloseste-l cand vrei.</Text>

            {COUPONS.map((coupon) => {
                const isUsed = isCouponOnCooldown(coupon.id);
                const countdown = couponCountdowns[coupon.id];

                return (
                    <View key={coupon.id} style={[styles.couponCard, isUsed ? styles.couponCardUsed : undefined]}>
                        <View style={styles.couponHeaderRow}>
                            <Text style={styles.couponTitle}>{coupon.title}</Text>
                            <Text style={[styles.badge, isUsed ? styles.badgeUsed : styles.badgeUnused]}>
                                {isUsed ? 'Folosit' : 'Nefolosit'}
                            </Text>
                        </View>

                        <Text style={styles.couponDescription}>{coupon.description}</Text>

                        {isUsed ? (
                            <View>
                                <Text style={styles.usedText}>Voucher folosit</Text>
                                <Text style={styles.cooldownText}>Disponibil din nou in: {countdown}</Text>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => {
                                    void handleCouponPress(coupon);
                                }}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.actionButtonText}>Foloseste voucher</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                );
            })}
        </View>
    );
};

export default LoveCoupons;

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        marginTop: 18,
        backgroundColor: '#FFE1DA',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#F2BFB2',
        paddingVertical: 16,
        paddingHorizontal: 14,
        shadowColor: '#B15F6D',
        shadowOpacity: 0.16,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowRadius: 12,
        elevation: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#D1495B',
        textAlign: 'center',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: '#6F4A44',
        textAlign: 'center',
        marginBottom: 10,
        lineHeight: 20,
    },
    couponCard: {
        backgroundColor: '#FFF7F4',
        borderWidth: 1,
        borderColor: '#F1CBC0',
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginTop: 10,
    },
    couponCardUsed: {
        opacity: 0.9,
        borderColor: '#D7A9B7',
    },
    couponHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    couponTitle: {
        color: '#5B3A29',
        fontSize: 16,
        fontWeight: '700',
    },
    badge: {
        fontSize: 12,
        fontWeight: '700',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 10,
        overflow: 'hidden',
    },
    badgeUnused: {
        color: '#8E4A57',
        backgroundColor: '#FDE9E4',
    },
    badgeUsed: {
        color: '#A53A6D',
        backgroundColor: '#F8D5E0',
    },
    couponDescription: {
        color: '#7A5751',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 10,
    },
    actionButton: {
        alignSelf: 'flex-start',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: '#D1495B',
    },
    actionButtonText: {
        color: '#FFF7F4',
        fontSize: 13,
        fontWeight: '700',
    },
    usedText: {
        color: '#A53A6D',
        fontWeight: '700',
        fontSize: 14,
        marginBottom: 4,
    },
    cooldownText: {
        color: '#7A5751',
        fontSize: 13,
        lineHeight: 18,
    },
});
