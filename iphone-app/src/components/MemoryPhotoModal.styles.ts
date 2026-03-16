import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(63, 28, 35, 0.66)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 18,
    },
    modalCard: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: '#FFF8F4',
        borderRadius: 26,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F0D1C6',
    },
    modalCloseButton: {
        alignSelf: 'flex-end',
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginBottom: 8,
    },
    modalCloseText: {
        color: '#A53D52',
        fontSize: 14,
        fontWeight: '700',
    },
    modalPhoto: {
        width: '100%',
        height: 430,
        borderRadius: 20,
        backgroundColor: '#F4D8CE',
        marginBottom: 14,
    },
    modalTitle: {
        color: '#A3324A',
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 6,
    },
    modalDate: {
        color: '#7A5751',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
});