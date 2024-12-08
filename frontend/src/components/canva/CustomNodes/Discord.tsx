import React, { memo, useState } from 'react';
import { useTheme } from '../../../contexts/theme-provider'
import { Handle, Position } from '@xyflow/react';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DiscordNodeProps {
  data: {
    onDelete: () => void;
  };
  isConnectable: boolean;
}

const Discord: React.FC<DiscordNodeProps> = memo(({ data, isConnectable }) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const handleDeleteClick = () => {
    setIsConfirmingDelete(true);
  };

  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete();
    }
    setIsConfirmingDelete(false);
    setIsOpen(false);
  };

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <div className="w-20 h-20 z-10 relative flex items-center justify-center px-4 py-2 border-dashed border-2 border-gray-900 dark:border-white rounded-xl cursor-grab bg-neutral-50 dark:bg-gray-900 text-xs">
            <Handle
              type="target"
              position={Position.Left}
              onConnect={(params) => console.log('Handle onConnect:', params)}
              isConnectable={isConnectable}
              style={{
                width: '10px',
                height: '20px',
                backgroundColor: theme === 'dark' ? 'white' : '#111827',
                border: 'none',
                borderRadius: '0',
              }}
            />
            <div className="text-2xl font-medium">
              <img
                src="/discord_logo.png"
                alt="Discord Logo"
                className="h-6 w-8"
              />
            </div>
            <Handle
              type="source"
              position={Position.Right}
              id="a"
              isConnectable={isConnectable}
              style={{
                width: '15px',
                height: '15px',
                backgroundColor: theme === 'dark' ? 'white' : '#111827',
                border: 'none',
              }}
            />
          </div>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isConfirmingDelete ? 'Confirm Deletion' : 'This is a Discord modal!'}</DialogTitle>
            <DialogDescription>
              {isConfirmingDelete
                ? 'Are you sure you want to delete this node? This action cannot be undone.'
                : 'Manage your Discord Node settings here.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {isConfirmingDelete ? (
              <>
                <Button onClick={handleCancelDelete} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleDelete} type="button" variant="destructive">
                  Confirm Delete
                </Button>
              </>
            ) : (
              <Button onClick={handleDeleteClick} type="button" variant="destructive">
                Delete Node
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

export default Discord;
