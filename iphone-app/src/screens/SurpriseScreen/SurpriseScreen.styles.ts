import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#FFF3F0',
    },
    scrollContent: {
        paddingBottom: 28,
    },
    container: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 24,
        paddingTop: 48,
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
        marginBottom: 8,
    },
});
