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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { NodeProps } from '@xyflow/react';

import { editAction } from '@/utils/api';

import { z, ZodRawShape } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";

import { useAuth } from '@/contexts/AuthProvider';
import { Label } from '../ui/label';

const ActionNode: React.FC<NodeProps> = memo(({ data, isConnectable }) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const { token, backendAddress } = useAuth();

  const handleDeleteClick = () => {
    setIsConfirmingDelete(true);
  };

  const handleDelete = useCallback(() => {
    if (data.onDelete && typeof data.onDelete === 'function') {
      data.onDelete();
    }
    setIsConfirmingDelete(false);
    setIsOpen(false);
  }, [data]);

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  const settingsSchema = data?.settings as {
    properties?: { [key: string]: { type: string } };
    required?: string[];
  };

  const dynamicSchemaShape: ZodRawShape = {};

  if (settingsSchema && typeof settingsSchema === 'object' && "properties" in settingsSchema) {
    for (const [key, property] of Object.entries(settingsSchema.properties || {})) {
      switch (property.type) {
        case 'string':
          dynamicSchemaShape[key] = z.string();
          break;
        case 'number':
          dynamicSchemaShape[key] = z.number();
          break;
        case 'boolean':
          dynamicSchemaShape[key] = z.boolean();
          break;
        case 'object':
          dynamicSchemaShape[key] = z
            .string()
            .refine((val) => {
              try {
                if (!val) return true;
                JSON.parse(val);
                return true;
              } catch (e) {
                return false;
              }
            }, { message: 'Invalid JSON format.' });
          break;
        default:
          dynamicSchemaShape[key] = z.string();
          break;
      }
    }
  }

  const formSchema = z.object(dynamicSchemaShape).refine(
    (values) =>
      settingsSchema.required
        ? settingsSchema.required.every((field: string) => field in values)
        : true,
    { message: 'Some required fields are missing.' }
  );

  const defaultValues = Object.keys(dynamicSchemaShape).reduce((acc, key) => {
    acc[key] =
      typeof (data.settingsData as any)?.[key] === 'object'
        ? JSON.stringify((data.settingsData as any)?.[key])
        : (data.settingsData as any)?.[key] || '';
    return acc;
  }, {} as Record<string, any>);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <>
      <div className="w-20 h-20 z-10 relative flex items-center justify-center px-4 py-2 border-dashed border-2 border-gray-900 dark:border-white rounded-xl cursor-grab bg-neutral-50 dark:bg-gray-900 text-xs" onClick={() => setIsOpen(true)}>
        <a className="text-2xl font-medium">
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
            <DialogTitle>
              {isConfirmingDelete ? 'Confirm Deletion' : 'Node Settings'}
            </DialogTitle>
            <DialogDescription>
              {isConfirmingDelete
                ? 'Are you sure you want to delete this node?'
                : 'Manage your webhook settings here.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            {"paramsData" in data && (data as any)?.paramsData && Object.keys((data as any)?.paramsData).length > 0 &&
                (
                  Object.keys(data?.paramsData as { [key: string]: any }).map((fieldKey) => (
                    <>
                      <Label key={fieldKey} className='capitalize'>{fieldKey}</Label>
                      <Input
                        key={fieldKey}
                        value={(data as any)?.paramsData[fieldKey]}
                        readOnly
                      />
                    </>
                ))
            )}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((values) => {
                  const processedValues = Object.fromEntries(
                    Object.entries(values).map(([key, value]) => [
                      key,
                      dynamicSchemaShape[key] instanceof z.ZodString &&
                      settingsSchema.properties?.[key]?.type === 'object'
                        ? JSON.parse(value as string)
                        : value,
                    ])
                  );
                  editAction(
                    backendAddress,
                    token as string,
                    data.playgroundId as string,
                    data.playgroundActionId as string,
                    processedValues
                  );
                })}
              >
                {Object.keys(dynamicSchemaShape).map((fieldKey) => (
                  <FormField
                    key={fieldKey}
                    control={form.control}
                    name={fieldKey}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor={fieldKey} className="capitalize">
                          {fieldKey}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} id={fieldKey} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <div className="flex justify-between mt-4">
                  {isConfirmingDelete ? (
                    <>
                      <Button onClick={handleDelete} type="button" variant="destructive">
                        Confirm Delete
                      </Button>
                      <Button onClick={handleCancelDelete} variant="outline">
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleDeleteClick} type="button" variant="destructive">
                      Delete Node
                    </Button>
                  )}
                  <Button type="submit" variant="default">
                    Save
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

export default ActionNode;
