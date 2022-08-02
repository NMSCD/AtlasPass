/* @refresh reload */
import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';
import { AppShell } from './appShell';
import { CustomThemeProvider } from './themeProvider';

import './scss/custom.scss';

render(() => (
    <CustomThemeProvider>
        <Router>
            <AppShell />
        </Router>
    </CustomThemeProvider>
),
    document.getElementById('atlas-pass') as HTMLElement
);
