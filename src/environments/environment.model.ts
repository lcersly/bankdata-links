export type EnvironmentModel = {
  production: boolean;
  firebase: {
    storageBucket: string;
    apiKey: string;
    messagingSenderId: string;
    appId: string;
    projectId: string;
    authDomain: string;
    locationId: string;
    measurementId?: string;
  };
  useEmulators: boolean,
  functions: any,
};
