import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

type ParticleConfig = {
    leftPercent: number;
    size: number;
    duration: number;
    delay: number;
};

const PARTICLES: ParticleConfig[] = [
    { leftPercent: 4, size: 22, duration: 3600, delay: 0 },
    { leftPercent: 12, size: 16, duration: 4200, delay: 280 },
    { leftPercent: 20, size: 24, duration: 3900, delay: 480 },
    { leftPercent: 31, size: 18, duration: 4400, delay: 730 },
    { leftPercent: 40, size: 26, duration: 4100, delay: 930 },
    { leftPercent: 50, size: 20, duration: 4600, delay: 1150 },
    { leftPercent: 60, size: 23, duration: 4300, delay: 1360 },
    { leftPercent: 70, size: 17, duration: 4500, delay: 1560 },
    { leftPercent: 80, size: 25, duration: 4050, delay: 1760 },
    { leftPercent: 90, size: 19, duration: 4700, delay: 1960 },
];

const PinkParticles = () => {
    const particleProgressRefs = useRef(PARTICLES.map(() => new Animated.Value(0)));

    useEffect(() => {
        const animations = particleProgressRefs.current.map((progress, index) => {
            const particle = PARTICLES[index];

            return Animated.loop(
                Animated.sequence([
                    Animated.delay(particle.delay),
                    Animated.timing(progress, {
                        toValue: 1,
                        duration: particle.duration,
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.timing(progress, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ])
            );
        });

        animations.forEach((animation) => animation.start());

        return () => {
            animations.forEach((animation) => animation.stop());
        };
    }, []);

    return (
        <View pointerEvents="none" style={styles.particleLayer}>
            {PARTICLES.map((particle, index) => {
                const progress = particleProgressRefs.current[index];

                const translateY = progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [28, -190],
                });

                const opacity = progress.interpolate({
                    inputRange: [0, 0.15, 0.8, 1],
                    outputRange: [0, 0.45, 0.3, 0],
                });

                const scale = progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.25],
                });

                return (
                    <Animated.View
                        key={`${particle.leftPercent}-${index}`}
                        style={[
                            styles.particle,
                            {
                                left: `${particle.leftPercent}%`,
                                width: particle.size,
                                height: particle.size,
                                borderRadius: particle.size / 2,
                                opacity,
                                transform: [{ translateY }, { scale }],
                            },
                        ]}
                    />
                );
            })}
        </View>
    );
};

export default PinkParticles;

const styles = StyleSheet.create({
    particleLayer: {
        ...StyleSheet.absoluteFillObject,
        top: 8,
    },
    particle: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#F48BA3',
    },
});
