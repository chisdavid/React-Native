import React from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PLAYLIST_ID = '37i9dQZF1DXcBWIGoYBM5M';
const PLAYLIST_APP_URL = `spotify:playlist:${PLAYLIST_ID}`;
const PLAYLIST_WEB_URL = `https://open.spotify.com/playlist/${PLAYLIST_ID}`;

const IMPORTANT_SONGS = [
    {
        id: '1',
        title: 'Our Song #1',
        appUrl: 'spotify:track:4uLU6hMCjMI75M1A2tKUQC',
        webUrl: 'https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC',
    },
    {
        id: '2',
        title: 'Our Song #2',
        appUrl: 'spotify:track:7qiZfU4dY1lWllzX7mPBI3',
        webUrl: 'https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3',
    },
    {
        id: '3',
        title: 'Our Song #3',
        appUrl: 'spotify:track:0VjIjW4GlUZAMYd2vXMi3b',
        webUrl: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b',
    },
];

const openSpotifyUrl = async (appUrl: string, webUrl: string): Promise<void> => {
    const canOpenSpotifyApp = await Linking.canOpenURL(appUrl);

    if (canOpenSpotifyApp) {
        await Linking.openURL(appUrl);
        return;
    }

    await Linking.openURL(webUrl);
};

const SpotifyMusic = () => {
    const handleOpenPlaylist = async () => {
        try {
            await openSpotifyUrl(PLAYLIST_APP_URL, PLAYLIST_WEB_URL);
        } catch {
            Alert.alert('Spotify indisponibil', 'Nu am putut deschide playlistul acum.');
        }
    };

    const handleOpenSong = async (appUrl: string, webUrl: string) => {
        try {
            await openSpotifyUrl(appUrl, webUrl);
        } catch {
            Alert.alert('Spotify indisponibil', 'Nu am putut deschide melodia acum.');
        }
    };

    return (
        <View style={styles.spotifyCard}>
            <Text style={styles.spotifyTitle}>Spotify Music</Text>
            <Text style={styles.spotifySubtitle}>Se deschide direct in contul Spotify conectat pe telefon.</Text>

            <TouchableOpacity onPress={handleOpenPlaylist} style={styles.playlistButton} activeOpacity={0.85}>
                <Text style={styles.playlistButtonText}>Deschide playlistul pe Spotify</Text>
            </TouchableOpacity>

            {IMPORTANT_SONGS.map((song) => (
                <TouchableOpacity
                    key={song.id}
                    style={styles.songRow}
                    onPress={() => handleOpenSong(song.appUrl, song.webUrl)}
                    activeOpacity={0.85}
                >
                    <Text style={styles.songText}>{song.title}</Text>
                    <Text style={styles.songAction}>Play</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default SpotifyMusic;

const styles = StyleSheet.create({
    spotifyCard: {
        width: '100%',
        marginTop: 18,
        backgroundColor: '#FFE1DA',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#F2BFB2',
        paddingVertical: 16,
        paddingHorizontal: 14,
        shadowColor: '#B15F6D',
        shadowOpacity: 0.16,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowRadius: 12,
        elevation: 4,
    },
    spotifyTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#D1495B',
        textAlign: 'center',
        marginBottom: 6,
    },
    spotifySubtitle: {
        fontSize: 14,
        color: '#6F4A44',
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 20,
    },
    playlistButton: {
        height: 46,
        borderRadius: 14,
        backgroundColor: '#D1495B',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    playlistButtonText: {
        color: '#FFF7F4',
        fontSize: 15,
        fontWeight: '700',
    },
    songRow: {
        backgroundColor: '#FFF7F4',
        borderWidth: 1,
        borderColor: '#F1CBC0',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    songText: {
        color: '#5B3A29',
        fontSize: 15,
        fontWeight: '600',
    },
    songAction: {
        color: '#A53A6D',
        fontWeight: '700',
        fontSize: 13,
    },
});
