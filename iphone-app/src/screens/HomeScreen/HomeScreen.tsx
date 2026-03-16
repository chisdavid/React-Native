import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import PinkParticles from '../../components/PinkParticles';
import { COUPONS, Coupon, CouponUsageMap, formatRemainingTime, getCouponRemainingMs, loadUsedCoupons } from '../../utils/loveCoupons';
import { styles } from './HomeScreen.styles';

type ElapsedCounter = {
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalMinutes: number;
    totalSeconds: number;
};

const RELATIONSHIP_START_DATE = new Date(2025, 2, 18, 0, 0, 0, 0);

type NextCouponData = {
    coupon: Coupon;
    remainingMs: number;
};

const getElapsedCounter = (fromDate: Date, toDate: Date): ElapsedCounter => {
    const safeToDate = toDate < fromDate ? fromDate : toDate;

    let years = safeToDate.getFullYear() - fromDate.getFullYear();
    let months = safeToDate.getMonth() - fromDate.getMonth();
    let days = safeToDate.getDate() - fromDate.getDate();

    if (days < 0) {
        const previousMonthDate = new Date(safeToDate.getFullYear(), safeToDate.getMonth(), 0);
        days += previousMonthDate.getDate();
        months -= 1;
    }

    if (months < 0) {
        months += 12;
        years -= 1;
    }

    const diffMs = safeToDate.getTime() - fromDate.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalDays = Math.floor(totalMinutes / 1440);

    return {
        years,
        months,
        days,
        totalDays,
        totalMinutes,
        totalSeconds
    };
};

const HomeScreen = () => {
    const [now, setNow] = useState(new Date());
    const [usedCoupons, setUsedCoupons] = useState<CouponUsageMap>({});

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const elapsedCounter = useMemo(
        () => getElapsedCounter(RELATIONSHIP_START_DATE, now),
        [now]
    );

    useFocusEffect(
        React.useCallback(() => {
            let isMounted = true;

            const syncUsedCoupons = async () => {
                const savedUsedCoupons = await loadUsedCoupons();

                if (isMounted) {
                    setUsedCoupons(savedUsedCoupons);
                }
            };

            void syncUsedCoupons();

            return () => {
                isMounted = false;
            };
        }, [])
    );

    const nextCouponData = useMemo<NextCouponData | undefined>(() => {
        const nowMs = now.getTime();

        return COUPONS.reduce<NextCouponData | undefined>((nearestCoupon, coupon) => {
            const remainingMs = getCouponRemainingMs(coupon, usedCoupons, nowMs);

            if (remainingMs <= 0) {
                return nearestCoupon;
            }

            if (!nearestCoupon || remainingMs < nearestCoupon.remainingMs) {
                return { coupon, remainingMs };
            }

            return nearestCoupon;
        }, undefined);
    }, [now, usedCoupons]);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <PinkParticles />

            <View style={styles.counterCard}>
                <Text style={styles.counterTitle}>Timpul nostru impreuna</Text>
                <Text style={styles.counterPrimaryValue}>
                    {elapsedCounter.years} ani {elapsedCounter.months} luni {elapsedCounter.days} zile
                </Text>
                <Text style={styles.counterSecondaryValue}>
                    {elapsedCounter.totalDays} zile | {elapsedCounter.totalMinutes} minute | {elapsedCounter.totalSeconds} secunde
                </Text>
                <Text style={styles.counterStartDate}>Din 18/03/2025</Text>
            </View>

            <Text style={styles.title}>La multi ani noua, iubirea mea!</Text>
            <Text style={styles.subtitle}>Un an in care mi-ai facut fiecare zi mai calda, mai frumoasa si mai plina de sens. Te iubesc mai mult cu fiecare clipa.</Text>

            <View style={styles.appPurposeCard}>
                <Text style={styles.appPurposeTitle}>Despre aplicatie</Text>
                <Text style={styles.appPurposeText}>
                    Am creat aplicatia asta pentru aniversarea noastra de 1 an, ca sa adun intr-un singur loc amintirile,
                    surprizele si micile gesturi care ne fac relatia speciala. Scopul ei este sa ne aminteasca in fiecare zi
                    cat de frumos e drumul nostru impreuna si sa ne dea idei pentru momente noi, doar pentru noi doi.
                </Text>
            </View>

            <View style={styles.nextCouponCard}>
                <Text style={styles.nextCouponLabel}>Next coupon available</Text>
                {nextCouponData ? (
                    <>
                        <Text style={styles.nextCouponTitle}>{nextCouponData.coupon.title}</Text>
                        <Text style={styles.nextCouponCountdown}>
                            Disponibil in: {formatRemainingTime(nextCouponData.remainingMs)}
                        </Text>
                    </>
                ) : (
                    <Text style={styles.nextCouponReady}>Toate cupoanele sunt disponibile acum.</Text>
                )}
            </View>
        </ScrollView>
    );
};

export default HomeScreen;
