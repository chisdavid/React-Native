import React from 'react';
import { Image, Modal, Pressable, Text, View } from 'react-native';
import type { MemoryPhoto } from '../utils/memoriesPhotos';
import { styles } from './MemoryPhotoModal.styles';

type MemoryPhotoModalProps = {
    photo: MemoryPhoto | null;
    onClose: () => void;
};

const MemoryPhotoModal = ({ photo, onClose }: MemoryPhotoModalProps) => {
    return (
        <Modal
            visible={photo !== null}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalBackdrop}>
                <View style={styles.modalCard}>
                    <Pressable onPress={onClose} style={styles.modalCloseButton}>
                        <Text style={styles.modalCloseText}>Inchide</Text>
                    </Pressable>

                    {photo ? (
                        <>
                            <Image
                                source={photo.source}
                                style={styles.modalPhoto}
                                resizeMode={photo.resizeMode ?? 'cover'}
                            />
                            <Text style={styles.modalTitle}>{photo.title}</Text>
                            <Text style={styles.modalDate}>{photo.dateLabel}</Text>
                        </>
                    ) : null}
                </View>
            </View>
        </Modal>
    );
};

export default MemoryPhotoModal;