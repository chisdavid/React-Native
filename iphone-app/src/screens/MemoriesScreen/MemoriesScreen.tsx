import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import MemoriesTreasureMap from '../../components/MemoriesTreasureMap';
import MemoryPhotoModal from '../../components/MemoryPhotoModal';
import { styles } from './MemoriesScreen.styles';
import { memoriesPhotos } from '../../utils/memoriesPhotos';
import PinkParticles from '../../components/PinkParticles';

const MemoriesScreen = () => {
    const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
    const selectedPhoto = memoriesPhotos.find((photo) => photo.id === selectedPhotoId) ?? null;

    return (
        <>
            <ScrollView
                style={styles.scrollablecontainer}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    <PinkParticles />
                    <Text style={styles.title}>Harta comorilor noastre</Text>
                    <Text style={styles.subtitle}>
                        Un drum mic printre amintiri. Apasa pe fiecare punct si se deschide comoara ascunsa acolo.
                    </Text>

                    <MemoriesTreasureMap photos={memoriesPhotos} onSelectPhoto={setSelectedPhotoId} />
                </View>
            </ScrollView>

            <MemoryPhotoModal photo={selectedPhoto} onClose={() => setSelectedPhotoId(null)} />
        </>
    );
};

export default MemoriesScreen;
