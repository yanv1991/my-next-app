import { Suspense } from 'react';

import Container from './Container';


export default async function MyLocation() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Container />
        </Suspense>
    )
}