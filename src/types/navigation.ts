import type { RouteProp } from "@react-navigation/native";

// these are defining types of parameters
export type MainStackParamList = {
  Home: undefined; // Assuming no parameters are passed to Home
  Drawer: undefined;
  Main: undefined;
  Account: undefined;
  MonitorSeats: undefined;
  AlertSetting: undefined;
  AlertMeWhen: undefined;
  NotifyMeThrough: undefined;
  ActiveSafetyAlert: undefined;
  PeopleToAlert: undefined;
  NewContact: undefined;
  SyncDevice: undefined;
  TemperatureMonitor: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  CreateNewAccount: undefined;
  Drawer: undefined;
  Main: undefined;
  NewContact: undefined;
  PeopleToAlert: undefined;
};
