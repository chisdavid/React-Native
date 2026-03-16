import React, { useMemo, useState } from 'react';
import { Alert, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';

const BUTTON_GROUP_WIDTH = 230;
const BUTTON_GROUP_HEIGHT = 46;

type Position = {
    left: number;
    top: number;
};

const TeMaiEnervezGame = () => {
    const [areaWidth, setAreaWidth] = useState(0);
    const [areaHeight, setAreaHeight] = useState(0);
    const [buttonPosition, setButtonPosition] = useState<Position>({ left: 12, top: 70 });
    const [daPressCount, setDaPressCount] = useState(0);

    const maxLeft = useMemo(() => {
        return Math.max(12, areaWidth - BUTTON_GROUP_WIDTH - 12);
    }, [areaWidth]);

    const maxTop = useMemo(() => {
        return Math.max(70, areaHeight - BUTTON_GROUP_HEIGHT - 12);
    }, [areaHeight]);

    const handleAreaLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setAreaWidth(width);
        setAreaHeight(height);

        setButtonPosition((current) => ({
            left: Math.min(current.left, Math.max(12, width - BUTTON_GROUP_WIDTH - 12)),
            top: Math.min(current.top, Math.max(70, height - BUTTON_GROUP_HEIGHT - 12)),
        }));
    };

    const moveButtons = () => {
        const nextLeft = 12 + Math.floor(Math.random() * (maxLeft - 12 + 1));
        const nextTop = 70 + Math.floor(Math.random() * (maxTop - 70 + 1));

        setButtonPosition({ left: nextLeft, top: nextTop });
        setDaPressCount((current) => current + 1);
    };

    const showFunnyPopup = () => {
        setDaPressCount(0);
        Alert.alert(
            'Confirmare oficiala',
            'Stiam eu! Deci nu te enervez... doar iti antrenez rabdarea la nivel de campion.'
        );
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Te mai enervez?</Text>
            <Text style={styles.subtitle}>Atentie: butonul Da are chef de joaca.</Text>

            <View style={styles.playArea} onLayout={handleAreaLayout}>
                <View style={[styles.buttonRow, { left: buttonPosition.left, top: buttonPosition.top }]}>
                    <Pressable
                        style={[
                            styles.button,
                            styles.buttonDanger,
                            {
                                transform: [{ scale: Math.max(0.1, 1 - daPressCount * 0.2) }],
                            },
                        ]}
                        onPress={moveButtons}
                    >
                        <Text style={styles.buttonText}>Da</Text>
                    </Pressable>

                    <Pressable
                        style={[
                            styles.button,
                            styles.buttonSafe,
                            {
                                transform: [{ scale: Math.min(1.45, 1 + daPressCount * 0.06) }],
                            },
                        ]}
                        onPress={showFunnyPopup}
                    >
                        <Text style={styles.buttonText}>Nu</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default TeMaiEnervezGame;

const styles = StyleSheet.create({
    card: {
        width: '100%',
        marginTop: 18,
        backgroundColor: '#FFE1DA',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#F2BFB2',
        paddingVertical: 14,
        paddingHorizontal: 14,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
        color: '#B23A48',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        color: '#6F4A44',
    },
    playArea: {
        marginTop: 12,
        width: '100%',
        height: 260,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F5C8BD',
        backgroundColor: '#FFF7F4',
        position: 'relative',
        overflow: 'hidden',
    },
    buttonRow: {
        position: 'absolute',
        flexDirection: 'row',
        gap: 10,
    },
    button: {
        minWidth: 110,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonDanger: {
        backgroundColor: '#D1495B',
    },
    buttonSafe: {
        backgroundColor: '#8E4A57',
    },
    buttonText: {
        color: '#FFF7F4',
        fontWeight: '800',
        fontSize: 14,
    },
});
