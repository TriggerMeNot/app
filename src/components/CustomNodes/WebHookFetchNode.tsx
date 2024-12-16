import React, { memo, useCallback, useState } from 'react';
import { useTheme } from '@/contexts/theme-provider';
import { Handle, Position } from '@xyflow/react';

import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { NodeProps } from '@xyflow/react';

import {
  editReactionSettings
} from '@/utils/api';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useAuth } from '@/contexts/AuthProvider';

const formSchema = z.object({
  url: z.string(),
  method: z.string(),
  headers: z.string(),
  body: z.string(),
})

const WebHookFetchNode: React.FC<NodeProps> = memo(({ data, isConnectable }) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const { token, backendAddress } = useAuth();

  const handleDeleteClick = () => {
    setIsConfirmingDelete(true);
  };

  const handleDelete = useCallback(() => {
    console.log('Deleting node', data);
    if (data.onDelete && typeof data.onDelete === 'function') {
      data.onDelete();
    }
    setIsConfirmingDelete(false);
    setIsOpen(false);
  }, [data]);

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: (data.settings as any)?.url || '',
      method: (data.settings as any)?.method || '',
      headers: (data.settings as any)?.headers || '',
      body: (data.settings as any)?.body || '',
    },
  })

  return (
    <>
      <div className="w-20 h-20 z-10 relative flex items-center justify-center px-4 py-2 border-dashed border-2 border-gray-900 dark:border-white rounded-xl cursor-grab bg-neutral-50 dark:bg-gray-900 text-xs" onClick={() => setIsOpen(true)}>
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
        <a className="text-2xl font-medium" onClick={() => setIsOpen(true)}>
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
        </a>
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
      <p className="text-center text-xs mt-2 font-thin max-w-20">
        {data?.name as string}
      </p>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
            <DialogHeader>
              <DialogTitle>{isConfirmingDelete ? 'Confirm Deletion' : 'Node Settings'}</DialogTitle>
              <DialogDescription>
                {isConfirmingDelete
                  ? 'Are you sure you want to delete this node?'
                  : 'Manage your webhook settings here.'}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit((values: z.infer<typeof formSchema>) => {
                  editReactionSettings(backendAddress, token as string, data.playgroundId as string, data.playgroundReactionId as string, { settings: values });
                })}>
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="url">URL</FormLabel>
                        <FormControl>
                          <Input {...field} id="url" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="method">Method</FormLabel>
                        <FormControl>
                          <Input {...field} id="method" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="headers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="headers">Headers</FormLabel>
                        <FormControl>
                          <Input {...field} id="headers" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="body"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="body">Body</FormLabel>
                        <FormControl>
                          <Input {...field} id="body" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" variant="default">
                    Save
                  </Button>
                </form>
              </Form>
            </div>
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

export default WebHookFetchNode;
