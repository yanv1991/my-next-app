import React from 'react';
import { connection } from 'next/server'

export default async function RightsReserved() {
    // Explicitly defer to request time
    await connection();
    const fullYear = new Date().getFullYear();
    return (
        <p>© {fullYear} LocationApp. All rights reserved.</p>
    );
}