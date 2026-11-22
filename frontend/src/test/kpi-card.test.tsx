import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { KPICard } from '../components/data-display/kpi-card';

describe('KPICard Component', () => {
  it('renders title and string value', () => {
    render(<KPICard title="Total Leads" value="1,247" />);
    expect(screen.getByText('Total Leads')).toBeInTheDocument();
    expect(screen.getByText('1,247')).toBeInTheDocument();
  });

  it('renders compact formatted number', () => {
    render(<KPICard title="Active Revenue" value={847500} />);
    expect(screen.getByText('Active Revenue')).toBeInTheDocument();
    expect(screen.getByText('847.5K')).toBeInTheDocument();
  });

  it('renders positive change percentage with indicator', () => {
    render(<KPICard title="Conversion Rate" value="34.2%" change={12.5} changeLabel="vs last quarter" />);
    expect(screen.getByText('12.5%')).toBeInTheDocument();
    expect(screen.getByText('vs last quarter')).toBeInTheDocument();
  });
});
