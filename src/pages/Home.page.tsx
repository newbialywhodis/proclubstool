import { useState, useEffect } from 'react';
import { LineupBuilder } from '../components/LineupBuilder/LineupBuilder';
import { translations } from '../translations';

export function HomePage() {
  return <LineupBuilder />;
}