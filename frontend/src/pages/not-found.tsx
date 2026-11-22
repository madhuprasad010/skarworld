import * as React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl font-mono">
        404
      </div>
      <h1 className="text-xl font-bold text-foreground">
        Page Not Found
      </h1>
      <p className="text-xs text-muted-foreground max-w-sm">
        The requested revenue intelligence record or page does not exist or has been archived.
      </p>
      <div className="pt-2 flex items-center gap-3">
        <Link to="/">
          <Button size="sm" className="gap-1.5 text-xs">
            <Home className="h-3.5 w-3.5" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
