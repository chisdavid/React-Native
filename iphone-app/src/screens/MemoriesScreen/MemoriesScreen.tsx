import React, { useRef, useState } from 'react';
import { FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, Pressable, Text, View } from 'react-native';
import { styles } from './MemoriesScreen.styles';
import { memoriesPhotos } from '../../utils/memoriesPhotos';
import PinkParticles from '../../components/PinkParticles';

const SLIDE_WIDTH = 339;

const getActiveSlideIndex = (event: NativeSyntheticEvent<NativeScrollEvent>): number => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const rawIndex = Math.round(xOffset / SLIDE_WIDTH);
    return Math.min(Math.max(rawIndex, 0), memoriesPhotos.length - 1);
};

const MemoriesScreen = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const listRef = useRef<FlatList>(null);

    const onScrollPositionUpdate = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const nextIndex = getActiveSlideIndex(event);
        setActiveIndex(nextIndex);
    };

    const scrollToIndex = (index: number) => {
        listRef.current?.scrollToIndex({ index, animated: true });
    };

    const goToPrevious = () => {
        const previousIndex = Math.max(0, activeIndex - 1);
        scrollToIndex(previousIndex);
    };

    const goToNext = () => {
        const nextIndex = Math.min(memoriesPhotos.length - 1, activeIndex + 1);
        scrollToIndex(nextIndex);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Albumul inimii</Text>
            <Text style={styles.subtitle}>Poze cu noi, rasete pe repeat si seri lungi in doi.</Text>
            <PinkParticles />

            <View style={styles.carouselWrapper}>
                <FlatList
                    ref={listRef}
                    data={memoriesPhotos}
                    keyExtractor={(item) => item.id}
                    horizontal
                    pagingEnabled
                    directionalLockEnabled
                    disableIntervalMomentum
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={SLIDE_WIDTH}
                    snapToAlignment="start"
                    decelerationRate="fast"
                    onScroll={onScrollPositionUpdate}
                    onMomentumScrollEnd={onScrollPositionUpdate}
                    onScrollEndDrag={onScrollPositionUpdate}
                    scrollEventThrottle={16}
                    getItemLayout={(_, index) => ({
                        length: SLIDE_WIDTH,
                        offset: SLIDE_WIDTH * index,
                        index,
                    })}
                    contentContainerStyle={styles.carouselContent}
                    renderItem={({ item }) => (
                        <View style={styles.slideCard}>
                            <Image source={item.source} style={styles.photo} resizeMode="cover" />
                            <View style={styles.photoOverlay}>
                                <Text style={styles.photoTitle}>{item.title}</Text>
                                <Text style={styles.photoDate}>{item.dateLabel}</Text>
                            </View>
                        </View>
                    )}
                />
            </View>

            <View style={styles.dotsContainer}>
                {memoriesPhotos.map((item, index) => (
                    <View
                        key={item.id}
                        style={[styles.dot, index === activeIndex ? styles.dotActive : undefined]}
                    />
                ))}
            </View>

            <View style={styles.carouselActions}>
                <Pressable
                    style={[styles.carouselActionButton, activeIndex === 0 ? styles.carouselActionButtonDisabled : undefined]}
                    onPress={goToPrevious}
                    disabled={activeIndex === 0}
                >
                    <Text style={styles.carouselActionButtonText}>Inapoi</Text>
                </Pressable>
                <Pressable
                    style={[
                        styles.carouselActionButton,
                        activeIndex === memoriesPhotos.length - 1 ? styles.carouselActionButtonDisabled : undefined,
                    ]}
                    onPress={goToNext}
                    disabled={activeIndex === memoriesPhotos.length - 1}
                >
                    <Text style={styles.carouselActionButtonText}>Inainte</Text>
                </Pressable>
            </View>

            <Text style={styles.footerHint}>
                Swipe stanga-dreapta ca sa vezi toate pozele noastre.
            </Text>
        </View>
    );
};

export default MemoriesScreen;
