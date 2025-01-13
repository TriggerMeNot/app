import { useForm } from "react-hook-form";
import { z, ZodRawShape } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface NodeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData: any;
  onSubmit: (values: any) => void;
}

const NodeSettingsModal = ({ isOpen, onClose, nodeData, onSubmit }: NodeSettingsModalProps) => {
  const settingsSchema = nodeData?.data?.settings as {
    properties?: { [key: string]: { type: string } };
    required?: string[];
  };

  const dynamicSchemaShape: ZodRawShape = {};

  if (settingsSchema && typeof settingsSchema === "object" && "properties" in settingsSchema) {
    for (const [key, property] of Object.entries(settingsSchema.properties || {})) {
      const isRequired = settingsSchema.required?.includes(key);
      switch (property.type) {
        case "string":
          dynamicSchemaShape[key] = isRequired ? z.string() : z.string().optional();
          break;
        case "number":
          dynamicSchemaShape[key] = isRequired ? z.number() : z.number().optional();
          break;
        case "boolean":
          dynamicSchemaShape[key] = isRequired ? z.boolean() : z.boolean().optional();
          break;
        case "object":
          dynamicSchemaShape[key] = isRequired
            ? z
                .string()
                .refine(
                  (val) => {
                    try {
                      if (!val) return false;
                      JSON.parse(val);
                      return true;
                    } catch (e) {
                      return false;
                    }
                  },
                  { message: "Invalid JSON format." }
                )
            : z
                .string()
                .optional()
                .refine(
                  (val) => {
                    try {
                      if (!val) return true;
                      JSON.parse(val);
                      return true;
                    } catch (e) {
                      return false;
                    }
                  },
                  { message: "Invalid JSON format." }
                );
          break;
        default:
          dynamicSchemaShape[key] = isRequired ? z.string() : z.string().optional();
          break;
      }
    }
  }

  const formSchema = z.object(dynamicSchemaShape);

  type FormSchema = z.infer<typeof formSchema>;
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Node Settings</DialogTitle>
          <DialogDescription>Configure the node settings before adding it to the canvas.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              const processedValues = Object.fromEntries(
                Object.entries(values).map(([key, value]) => [
                  key,
                  dynamicSchemaShape[key] instanceof z.ZodString &&
                  settingsSchema.properties?.[key]?.type === "object"
                    ? value
                      ? JSON.parse(value as string)
                      : undefined
                    : value,
                ])
              );
              onSubmit(processedValues);
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
            <div className="flex justify-end mt-4 space-x-2">
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button type="submit" variant="default">
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NodeSettingsModal;
