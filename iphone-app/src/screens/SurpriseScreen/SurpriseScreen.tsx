import React from 'react';
import { ScrollView, View } from 'react-native';
import LoveCoupons from '../../components/LoveCouponsComponent';
import { styles } from './SurpriseScreen.styles';

const SurpriseScreen = () => {
    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                {/* <Text style={styles.title}>Spotify Music</Text>
                <Text style={styles.subtitle}>Playlistul vostru special, direct in Surprise.</Text> */}

                {/* <SpotifyMusic /> */}
                <LoveCoupons />
                {/* <TeMaiEnervezGame /> */}
            </View>
        </ScrollView>
    );
};

export default SurpriseScreen;
