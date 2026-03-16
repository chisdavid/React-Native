import { StyleSheet } from 'react-native';

const CAROUSEL_WIDTH = 339;

export const styles = StyleSheet.create({
    scrollablecontainer: {
        flex: 1,
        backgroundColor: '#FFF3F0',
    },
    contentContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 56,
        paddingBottom: 28,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FFF3F0',
        paddingHorizontal: 24,
        paddingTop: 44,
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        color: '#D1495B',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#5B3A29',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 16,
    },
    carouselWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    carouselList: {
        width: CAROUSEL_WIDTH,
        maxWidth: '100%',
    },
    carouselContent: {
        paddingHorizontal: 0,
    },
    slideCard: {
        width: 327,
        height: 420,
        borderRadius: 24,
        overflow: 'hidden',
        marginHorizontal: 6,
        backgroundColor: '#FEE5DE',
        borderWidth: 1,
        borderColor: '#F2BFB2',
        shadowColor: '#B15F6D',
        shadowOpacity: 0.18,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowRadius: 14,
        elevation: 5,
    },
    photoFrame: {
        width: '100%',
        height: '100%',
    },
    photoFrameContain: {
        backgroundColor: '#FBDCE3',
        paddingHorizontal: 8,
        paddingVertical: 12,
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    photoContain: {
        borderRadius: 16,
    },
    photoOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingVertical: 14,
        paddingHorizontal: 14,
        backgroundColor: 'rgba(73, 24, 35, 0.35)',
    },
    photoTitle: {
        color: '#FFF7F4',
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 4,
    },
    photoDate: {
        color: '#FFE8E0',
        fontSize: 13,
        fontWeight: '600',
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 14,
        gap: 8,
    },
    dot: {
        width: 9,
        height: 9,
        borderRadius: 4.5,
        backgroundColor: '#EFC1B5',
    },
    dotActive: {
        width: 24,
        borderRadius: 8,
        backgroundColor: '#D1495B',
    },
    carouselActions: {
        marginTop: 12,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    carouselActionButton: {
        minWidth: 110,
        paddingVertical: 9,
        paddingHorizontal: 14,
        borderRadius: 12,
        backgroundColor: '#D1495B',
        alignItems: 'center',
    },
    carouselActionButtonDisabled: {
        backgroundColor: '#E7B4BB',
    },
    carouselActionButtonText: {
        color: '#FFF7F4',
        fontWeight: '700',
        fontSize: 14,
    },
    footerHint: {
        marginTop: 14,
        fontSize: 14,
        color: '#7A5751',
        textAlign: 'center',
    },
});
