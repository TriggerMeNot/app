import React, { memo, useState } from 'react';
import { useTheme } from '@/contexts/theme-provider';
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

import { NodeProps } from '@xyflow/react';

const WebHookNode: React.FC<NodeProps> = memo(({ data, isConnectable }) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const handleDeleteClick = () => {
    setIsConfirmingDelete(true);
  };

  const handleDelete = () => {
    if (typeof data.onDelete === 'function') {
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
          {data.actionType as string !== 'action' && (
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
          )}
          <div className="text-2xl font-medium">
            {data.icon ? (
              typeof data.icon === "string" ? (
                <img
                  src={data.icon}
                  alt={`${data.label} icon`}
                  width={20}
                  height={20}
                />
              ) : (
                React.createElement(data.icon as React.ComponentType<{ size: number }>, { size: 20 })
              )
            ) : (
              <div className="w-5 h-5" />
            )}
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
      <p className="text-center text-xs mt-2 font-thin max-w-20">
        {data?.label as string}
      </p>

      <DialogContent>
          <DialogHeader>
            <DialogTitle>{isConfirmingDelete ? 'Confirm Deletion' : 'This is a Git modal!'}</DialogTitle>
            <DialogDescription>
              {isConfirmingDelete
                ? 'Are you sure you want to delete this node? This action cannot be undone.'
                : 'Manage your Git Node settings here.'}
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

export default WebHookNode;
