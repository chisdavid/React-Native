import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { scheduleDailyEncouragementNotifications } from './src/utils/notificationScheduler';
import { syncStoredNotificationPreferencesToServer } from './src/utils/remoteNotificationClient';

const App = () => {
  const [fontsLoaded] = useFonts({
    ionicons: require('./assets/fonts/Ionicons.ttf'),
  });

  useEffect(() => {
    void scheduleDailyEncouragementNotifications();
    void syncStoredNotificationPreferencesToServer({ requestPermission: false });
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return <RootNavigator />;
};

export default App;
