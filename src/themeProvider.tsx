import { HopeProvider, HopeThemeConfig, NotificationsProvider } from '@hope-ui/solid';
import { Component, JSX } from 'solid-js';
import { themeColours } from './constants/colour';

interface IProps {
  children: JSX.Element;
}

export const CustomThemeProvider: Component<IProps> = (props: IProps) => {

  // onMount(() => {
  //   setChakraToDarkMode();
  // });

  const config: HopeThemeConfig = {
    initialColorMode: 'dark',
    darkTheme: {
      colors: {
        primary5: themeColours.primary,
        neutral7: themeColours.primary,
        neutral9: themeColours.lightGrey,
      }
    }
  }

  return (
    <HopeProvider config={config}>
      <NotificationsProvider placement="top-end">
        {props.children}
      </NotificationsProvider>
    </HopeProvider>
  );
}

