import React, { useRef, useState } from 'react';
import { FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, Platform, Pressable, ScrollView, Text, View } from 'react-native';
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
    const currentOffsetRef = useRef(0);
    const dragStartXRef = useRef(0);
    const dragStartOffsetRef = useRef(0);
    const isDraggingRef = useRef(false);

    const onScrollPositionUpdate = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        currentOffsetRef.current = event.nativeEvent.contentOffset.x;
        const nextIndex = getActiveSlideIndex(event);
        setActiveIndex(nextIndex);
    };

    const scrollToIndex = (index: number) => {
        listRef.current?.scrollToIndex({ index, animated: true });
        currentOffsetRef.current = index * SLIDE_WIDTH;
    };

    const clampOffset = (offset: number): number => {
        const maxOffset = (memoriesPhotos.length - 1) * SLIDE_WIDTH;
        return Math.min(Math.max(offset, 0), maxOffset);
    };

    const snapToClosestSlide = (offset: number) => {
        const targetIndex = Math.min(
            Math.max(Math.round(offset / SLIDE_WIDTH), 0),
            memoriesPhotos.length - 1,
        );
        scrollToIndex(targetIndex);
        setActiveIndex(targetIndex);
    };

    const handleResponderGrant = (event: NativeSyntheticEvent<any>) => {
        if (Platform.OS !== 'web') {
            return;
        }

        isDraggingRef.current = true;
        dragStartXRef.current = event.nativeEvent.pageX ?? 0;
        dragStartOffsetRef.current = currentOffsetRef.current;
    };

    const handleResponderMove = (event: NativeSyntheticEvent<any>) => {
        if (Platform.OS !== 'web' || !isDraggingRef.current) {
            return;
        }

        const currentPageX = event.nativeEvent.pageX ?? 0;
        const deltaX = currentPageX - dragStartXRef.current;
        const nextOffset = clampOffset(dragStartOffsetRef.current - deltaX);

        currentOffsetRef.current = nextOffset;
        listRef.current?.scrollToOffset({ offset: nextOffset, animated: false });
        setActiveIndex(Math.round(nextOffset / SLIDE_WIDTH));
    };

    const handleResponderRelease = () => {
        if (Platform.OS !== 'web') {
            return;
        }

        isDraggingRef.current = false;
        snapToClosestSlide(currentOffsetRef.current);
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
        <ScrollView
            style={styles.scrollablecontainer}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Albumul inimii</Text>
                <Text style={styles.subtitle}>Poze cu noi, rasete pe repeat si seri lungi in doi.</Text>
                <PinkParticles />

                <View
                    style={styles.carouselWrapper}
                    onStartShouldSetResponder={() => Platform.OS === 'web'}
                    onMoveShouldSetResponder={() => Platform.OS === 'web'}
                    onResponderGrant={handleResponderGrant}
                    onResponderMove={handleResponderMove}
                    onResponderRelease={handleResponderRelease}
                    onResponderTerminate={handleResponderRelease}
                >
                    <FlatList
                        ref={listRef}
                        data={memoriesPhotos}
                        keyExtractor={(item) => item.id}
                        style={styles.carouselList}
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
        </ScrollView>
    );
};

export default MemoriesScreen;
