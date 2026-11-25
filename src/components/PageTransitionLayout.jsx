import { ViewTransition } from 'react';
import { Outlet } from 'react-router';
import { initFictitiousCompanies } from '../database/db';

function PageTransitionLayout() {
    initFictitiousCompanies();

    return (
        <ViewTransition>
            <Outlet />
        </ViewTransition>
    );
}

export default PageTransitionLayout;
