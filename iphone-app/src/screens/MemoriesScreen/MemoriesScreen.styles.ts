import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    scrollablecontainer: {
        flex: 1,
        backgroundColor: '#FFF3F0',
    },
    contentContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 44,
        paddingBottom: 40,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FFF3F0',
        width: '100%',
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
        marginBottom: 18,
    },
});
