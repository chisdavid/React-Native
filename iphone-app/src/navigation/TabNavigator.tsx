import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pressable, View } from 'react-native';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import OurStoryScreen from '../screens/OurStoryScreen/OurStoryScreen';
import MemoriesScreen from '../screens/MemoriesScreen/MemoriesScreen';
import SurpriseScreen from '../screens/SurpriseScreen/SurpriseScreen';
import { styles } from './TabNavigator.styles';
export type RootTabParamList = {
    Home: undefined;
    Story: undefined;
    Memories: undefined;
    Surprise: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const TabNavigator = () => {

    const getSettingsButtonElement = (navigation: any): React.ReactNode => (
        <Pressable
            onPress={() => navigation.getParent()?.navigate('Settings' as never)}
            style={styles.settingsButton}
        >
            <Ionicons name="settings-outline" size={22} color="#A3324A" />
        </Pressable>
    );

    const getHeaderPlaceholder = (): React.ReactNode => <View style={styles.headerSideButton} />;

    const getTopBarIcon = (color: any, size: any, focused: boolean, route: any) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'heart-outline';

        if (route.name === 'Home') {
            iconName = focused ? 'heart' : 'heart-outline';
        } else if (route.name === 'Story') {
            iconName = focused ? 'book' : 'book-outline';
        } else if (route.name === 'Memories') {
            iconName = focused ? 'images' : 'images-outline';
        } else if (route.name === 'Surprise') {
            iconName = focused ? 'mail' : 'mail-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
    };

    return (
        <Tab.Navigator
            screenOptions={({ route, navigation }) => ({
                headerStyle: styles.headerStyle,
                headerTintColor: '#A3324A',
                headerTitleAlign: 'center',
                headerTitleStyle: styles.headerTitleStyle,
                headerLeft: () => getHeaderPlaceholder(),
                headerRight: () => getSettingsButtonElement(navigation),
                tabBarActiveTintColor: '#B22C4A',
                tabBarInactiveTintColor: '#9E7A73',
                tabBarStyle: styles.topBarStyle,
                tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
                tabBarIcon: ({ color, size, focused }) => { return getTopBarIcon(color, size, focused, route); },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Noi doi' }} />
            <Tab.Screen
                name="Story"
                component={OurStoryScreen}
                options={{
                    title: 'Povestea noastra',
                    headerTitleStyle: styles.storyHeaderTitleStyle,
                }}
            />
            <Tab.Screen name="Memories" component={MemoriesScreen} options={{ title: 'Amintiri' }} />
            <Tab.Screen name="Surprise" component={SurpriseScreen} options={{ title: 'Surpriza' }} />
        </Tab.Navigator>
    );
};

export default TabNavigator;
