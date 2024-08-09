// AuthenticationStack.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import CreateNewAccount from "../screens/CreateNewAccount";
import Splash from "../screens/Splash";
import NewContact from "../screens/NewContact";
import PeopleToAlert from "../screens/PeopleToAlert";

const AuthStack = createNativeStackNavigator();

// This is for pages that need authentication
const AuthenticationStack = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Splash" component={Splash} />
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="CreateNewAccount" component={CreateNewAccount} />
      <AuthStack.Screen name="NewContact" component={NewContact} />
      <AuthStack.Screen name="PeopleToAlert" component={PeopleToAlert} />
    </AuthStack.Navigator>
  );
};

export default AuthenticationStack;
