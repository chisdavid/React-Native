import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import SettingsScreen from '../screens/SettingsScreen/SettingsScreen';

export type RootStackParamList = {
    MainTabs: undefined;
    Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="MainTabs"
                    component={TabNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={({ navigation }) => ({
                        title: 'Setari',
                        headerStyle: {
                            backgroundColor: '#FFDFD5',
                        },
                        headerTintColor: '#A3324A',
                        headerTitleStyle: {
                            fontWeight: '700',
                        },
                        headerLeft: () => (
                            <Pressable onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
                                <Ionicons name="arrow-back" size={25} color="#A3324A" />
                            </Pressable>
                        ),
                    })}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;
