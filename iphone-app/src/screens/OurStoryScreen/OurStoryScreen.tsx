import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './OurStoryScreen.styles';

const OurStoryScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Povestea noastra</Text>
            <Text style={styles.subtitle}>Prima intalnire, primul sarut, primul "te iubesc".</Text>
            <Text style={styles.subtitle}>Fiecare clipa a construit cea mai frumoasa relatie.</Text>
        </View>
    );
};

export default OurStoryScreen;
