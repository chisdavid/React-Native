import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    topBarStyle: {
        backgroundColor: '#FFF7F4',
        borderTopColor: '#F4CDC1',
        height: 84,
        paddingBottom: 8,
        paddingTop: 6,
    },
    headerStyle: {
        backgroundColor: '#FFDFD5',
    },
    headerTitleStyle: {
        fontWeight: '700',
        fontSize: 20,
        textAlign: 'center',
    },
    storyHeaderTitleStyle: {
        fontWeight: '700',
        fontSize: 18,
        textAlign: 'center',
    },
    headerSideButton: {
        width: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingsButton: {
        paddingLeft: 10,
        position: 'relative',
        right: 15,
    },
});