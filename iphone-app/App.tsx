import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { scheduleDailyEncouragementNotifications } from './src/utils/notificationScheduler';

const App = () => {
  const [fontsLoaded] = useFonts({
    ionicons: require('./assets/fonts/Ionicons.ttf'),
  });

  useEffect(() => {
    void scheduleDailyEncouragementNotifications();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return <RootNavigator />;
};

export default App;
