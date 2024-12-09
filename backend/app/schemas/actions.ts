import { integer, pgTable, serial, text, unique } from "drizzle-orm/pg-core";
import { services } from "./services.ts";

export const actions = pgTable(
  "actions",
  {
    id: serial("id").primaryKey().notNull(),
    serviceId: integer("service_id").notNull().references(
      () => services.id,
      { onDelete: "cascade" },
    ),
    name: text("name").notNull(),
    description: text("description").notNull(),
  },
  (table) => {
    return {
      unq: unique().on(table.serviceId, table.name),
    };
  },
);
