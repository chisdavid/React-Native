import React, { useMemo } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { MemoryPhoto } from '../utils/memoriesPhotos';
import { styles } from './MemoriesTreasureMap.styles';

type RoadmapNode = {
    id: string;
    left: number;
    top: number;
};

type MemoriesTreasureMapProps = {
    photos: MemoryPhoto[];
    onSelectPhoto: (photoId: string) => void;
};

const MAP_NODE_SIZE = 40;
const MAP_LABEL_HEIGHT = 34;
const MAP_BOTTOM_PADDING = 36;

const createSeededRandom = (seedValue: string) => {
    let seed = 0;

    for (let index = 0; index < seedValue.length; index += 1) {
        seed = (seed * 31 + seedValue.charCodeAt(index)) >>> 0;
    }

    return () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
    };
};

const getRoadmapNodes = (photos: MemoryPhoto[], mapWidth: number): RoadmapNode[] => {
    const random = createSeededRandom(photos.map((photo) => photo.id).join('-'));
    const minLeft = 20;
    const maxLeft = Math.max(mapWidth - 84, 220);
    const nodes: RoadmapNode[] = [];
    let currentTop = 24;
    let photoIndex = 0;

    if (photos.length > 0) {
        // First node always at top-left
        nodes.push({
            id: photos[0].id,
            left: minLeft,
            top: currentTop,
        });
        photoIndex = 1;
        currentTop += 74 + random() * 26; // Move to next row after first node
    }

    while (photoIndex < photos.length) {
        const remainingPhotos = photos.length - photoIndex;
        const canCreatePair = remainingPhotos > 1;
        const rowSize = canCreatePair && random() > 0.45 ? 2 : 1;
        const rowTop = currentTop + random() * 10;
        const rowLefts: number[] = [];

        for (let slotIndex = 0; slotIndex < rowSize; slotIndex += 1) {
            let left = minLeft + random() * (maxLeft - minLeft);
            let attempts = 0;

            while (
                rowLefts.some((existingLeft) => Math.abs(existingLeft - left) < 120)
                && attempts < 10
            ) {
                left = minLeft + random() * (maxLeft - minLeft);
                attempts += 1;
            }

            rowLefts.push(left);
        }

        rowLefts
            .sort((leftA, leftB) => leftA - leftB)
            .forEach((left, slotIndex) => {
                if (photoIndex >= photos.length) {
                    return;
                }

                const topOffset = rowSize === 2 ? (slotIndex === 0 ? -5 : 5) : 0;

                nodes.push({
                    id: photos[photoIndex].id,
                    left,
                    top: rowTop + topOffset + random() * 5,
                });

                photoIndex += 1;
            });

        currentTop += rowSize === 2
            ? 82 + random() * 20
            : 74 + random() * 26;
    }

    return nodes;
};

const getCurvedPath = (nodes: RoadmapNode[]) => {
    if (nodes.length === 0) {
        return '';
    }

    const points = nodes.map((node) => ({
        x: node.left + 20,
        y: node.top + 20,
    }));

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let index = 1; index < points.length; index += 1) {
        const previousPoint = points[index - 1];
        const currentPoint = points[index];
        const deltaX = currentPoint.x - previousPoint.x;
        const deltaY = currentPoint.y - previousPoint.y;
        const sweepDirection = deltaX >= 0 ? 1 : -1;
        const controlOffsetX = Math.min(Math.max(Math.abs(deltaX) * 0.45, 55), 120) * sweepDirection;
        const controlOneX = previousPoint.x + controlOffsetX;
        const controlTwoX = currentPoint.x - controlOffsetX;
        const verticalLift = Math.min(Math.max(deltaY * 0.22, 22), 54);
        const controlOneY = previousPoint.y + verticalLift;
        const controlTwoY = currentPoint.y - verticalLift;

        path += ` C ${controlOneX} ${controlOneY}, ${controlTwoX} ${controlTwoY}, ${currentPoint.x} ${currentPoint.y}`;
    }

    return path;
};

const MemoriesTreasureMap = ({ photos, onSelectPhoto }: MemoriesTreasureMapProps) => {
    const { width: windowWidth } = useWindowDimensions();
    const mapWidth = Math.min(windowWidth - 48, 420);
    const roadmapNodes = useMemo(() => getRoadmapNodes(photos, mapWidth), [photos, mapWidth]);
    const mapHeight = useMemo(() => {
        if (roadmapNodes.length === 0) {
            return 520;
        }

        const lowestContentPoint = Math.max(
            ...roadmapNodes.map((node) => node.top + MAP_NODE_SIZE + MAP_LABEL_HEIGHT),
        );

        return lowestContentPoint + MAP_BOTTOM_PADDING;
    }, [roadmapNodes]);
    const curvedPath = useMemo(() => getCurvedPath(roadmapNodes), [roadmapNodes]);

    return (
        <>
            <View style={styles.legendCard}>
                <Text style={styles.legendTitle}>Urmeaza traseul</Text>
                <Text style={styles.legendText}>
                    Fiecare punct ascunde o poza cu noi. Traseul e jucaus, ca o vanatoare de comori numai a noastra.
                </Text>
            </View>

            <View style={[styles.mapCard, { width: mapWidth, height: mapHeight }]}>
                <View style={styles.mapTexture} />
                <Svg width={mapWidth} height={mapHeight} style={styles.pathCanvas}>
                    <Path
                        d={curvedPath}
                        stroke="#C98A67"
                        strokeWidth={4}
                        strokeDasharray="3 12"
                        strokeLinecap="round"
                        fill="none"
                    />
                </Svg>

                {roadmapNodes.map((node, index) => {
                    const memory = photos[index];

                    return (
                        <View
                            key={memory.id}
                            style={[styles.mapNodeWrap, { left: node.left, top: node.top }]}
                        >
                            <Pressable
                                onPress={() => onSelectPhoto(memory.id)}
                                style={({ pressed }) => [styles.mapNodeButton, pressed && styles.mapNodeButtonPressed]}
                            >
                                <View style={styles.mapNodeInner}>
                                    <Text style={styles.mapNodeIndex}>{index + 1}</Text>
                                </View>
                            </Pressable>
                            <View style={styles.mapLabelPill}>
                                <Text style={styles.mapLabelText}>{memory.dateLabel}</Text>
                            </View>
                        </View>
                    );
                })}

                <View style={styles.finishBadge}>
                    <Text style={styles.finishBadgeText}>X</Text>
                </View>
            </View>

            <Text style={styles.footerHint}>
                Apasa pe puncte ca sa deschizi pozele. Pozitiile sunt puse ca pe o mica aventura.
            </Text>
        </>
    );
};

export default MemoriesTreasureMap;