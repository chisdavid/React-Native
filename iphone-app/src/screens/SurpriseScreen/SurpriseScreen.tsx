import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import LoveCoupons from '../../components/LoveCouponsComponent';
import SpotifyMusic from '../../components/SpotifyMusic';
import TeMaiEnervezGame from '../../components/TeMaiEnervezGame';
import { styles } from './SurpriseScreen.styles';

const SurpriseScreen = () => {
    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
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
