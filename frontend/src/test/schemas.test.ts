import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  createLeadSchema,
  createOpportunitySchema,
  createTaskSchema,
} from '../schemas';

describe('Validation Schemas', () => {
  it('validates correct login credentials', () => {
    const valid = loginSchema.safeParse({
      email: 'alex@skarworld.com',
      password: 'password123',
    });
    expect(valid.success).toBe(true);

    const invalid = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'short',
    });
    expect(invalid.success).toBe(false);
  });

  it('validates lead creation input', () => {
    const validLead = createLeadSchema.safeParse({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@acme.corp',
      source: 'website',
    });
    expect(validLead.success).toBe(true);

    const missingName = createLeadSchema.safeParse({
      firstName: '',
      lastName: 'Smith',
      source: 'website',
    });
    expect(missingName.success).toBe(false);
  });

  it('validates opportunity creation input', () => {
    const validDeal = createOpportunitySchema.safeParse({
      title: 'Enterprise Pilot',
      leadId: 'lead-1',
      value: 50000,
      currency: 'USD',
      stage: 'discovery',
      expectedCloseDate: '2026-12-31',
    });
    expect(validDeal.success).toBe(true);
  });

  it('validates task creation input', () => {
    const validTask = createTaskSchema.safeParse({
      title: 'Follow-up call with VP',
      type: 'call',
      priority: 'high',
      dueDate: '2026-11-25',
    });
    expect(validTask.success).toBe(true);
  });
});
