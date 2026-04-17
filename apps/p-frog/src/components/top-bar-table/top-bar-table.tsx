import * as React from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '@components/ui/button';

interface TopBarTableProps {
  onCreateClick?: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
  searchPlaceholder?: string;
  hasSelection?: boolean;
  selectedItemTitle?: string;
  showEdit?: boolean;
  showDelete?: boolean;
}

export const TopBarTable: React.FC<TopBarTableProps> = ({
  onCreateClick,
  onEditClick,
  onDeleteClick,
  onSearchChange,
  searchValue = '',
  searchPlaceholder = 'Search...',
  hasSelection = false,
  selectedItemTitle,
  showEdit = true,
  showDelete = true,
}) => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border bg-card shadow-sm">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={onCreateClick}
          className="gap-2"
          style={{
            backgroundColor: 'hsl(var(--button-create))',
            color: 'white',
          }}
        >
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
        {showEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEditClick}
            disabled={!hasSelection}
            className="gap-2"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        )}
        {showDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDeleteClick}
            disabled={!hasSelection}
            className="gap-2"
            style={{
              color: hasSelection ? 'hsl(var(--color-destructive))' : undefined,
              borderColor: hasSelection ? 'hsl(var(--color-destructive))' : undefined,
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-10"
          />
        </div>
        {hasSelection && selectedItemTitle && (
          <div className="text-sm text-muted-foreground">
            Selected: <span className="font-medium text-foreground">{selectedItemTitle}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBarTable;
