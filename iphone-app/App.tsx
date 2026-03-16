import { useEffect } from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { scheduleDailyEncouragementNotifications } from './src/utils/notificationScheduler';

const App = () => {
  useEffect(() => {
    void scheduleDailyEncouragementNotifications();
  }, []);

  return <RootNavigator />;
};

export default App;
