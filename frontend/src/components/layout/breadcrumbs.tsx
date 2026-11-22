import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const ROUTE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  leads: 'Leads',
  pipeline: 'Pipeline',
  campaigns: 'Campaigns',
  conversations: 'Conversations',
  tasks: 'Tasks',
  approvals: 'Approvals',
  products: 'Products',
  'ai-config': 'AI Engine Config',
  integrations: 'Integrations',
  research: 'Company Research',
  analytics: 'Analytics & Insights',
  settings: 'Settings',
  profile: 'My Profile',
  team: 'Team Management',
  billing: 'Billing & Plans',
  security: 'Security & Access',
  api: 'API & Webhooks',
  audit: 'Audit Logs',
};

export function Breadcrumbs({ className }: { className?: string }) {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const breadcrumbs = React.useMemo(() => {
    if (pathSegments.length === 0) {
      return [{ label: 'Dashboard', href: '/', isLast: true }];
    }

    const items = [];
    let currentPath = '';

    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      currentPath += `/${segment}`;
      const isLast = i === pathSegments.length - 1;

      let label = ROUTE_LABELS[segment.toLowerCase()];
      if (!label) {
        // If it looks like an ID (e.g., contains numbers, hyphens, or prefixes)
        if (segment.length > 8 || /\d/.test(segment)) {
          const parentSegment = pathSegments[i - 1];
          const singularParent = parentSegment ? parentSegment.replace(/s$/, '') : 'Item';
          const capitalizedParent =
            singularParent.charAt(0).toUpperCase() + singularParent.slice(1);
          label = `${capitalizedParent} Detail`;
        } else {
          label = segment
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }
      }

      items.push({
        label,
        href: currentPath,
        isLast,
      });
    }

    return items;
  }, [pathSegments]);

  return (
    <nav
      aria-label="Breadcrumbs"
      className={cn('flex items-center text-xs text-muted-foreground', className)}
    >
      <ol className="flex items-center space-x-1.5 flex-wrap">
        <li>
          <Link
            to="/"
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted/60"
            title="Dashboard"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {breadcrumbs.map((crumb) => (
          <React.Fragment key={crumb.href}>
            <li className="text-muted-foreground/40 select-none">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li>
              {crumb.isLast ? (
                <span
                  className="font-medium text-foreground px-1.5 py-0.5 rounded bg-muted/40 text-xs"
                  aria-current="page"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.href}
                  className="hover:text-foreground transition-colors px-1 py-0.5 rounded hover:bg-muted/60"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}
