import { Box } from '@hope-ui/solid';
import type { Component } from 'solid-js';
import { Route, Router, Routes } from "@solidjs/router";
import { Header } from './components/common/header';
import { routes } from './constants/route';
import { BuilderPage } from './pages/builder';
import { AboutPage } from './pages/about';

export const AppShell: Component = () => {
  return (
    <Box id="wrapper">
      <Header />
      <Routes>
        <Route path={routes.home} component={BuilderPage} />
        <Route path={routes.about} component={AboutPage} />
      </Routes>

      {/* <Footer /> */}
    </Box>
  );
};
