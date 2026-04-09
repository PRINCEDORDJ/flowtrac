import { pgTable, serial, text, timestamp, varchar, integer, boolean, doublePrecision } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  action: text("action").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  company: text("company").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const settings = pgTable("settings", {
  id: integer("id").primaryKey(), // Single row with id 1
  workspaceName: text("workspace_name").notNull(),
  workspaceEmail: text("workspace_email").notNull(),
  workspacePhone: text("workspace_phone").notNull(),
  workspaceAddress: text("workspace_address").notNull(),
  defaultCurrency: text("default_currency").notNull(),
  defaultTaxRate: doublePrecision("default_tax_rate").notNull(),
  paymentTerms: text("payment_terms").notNull(),
  defaultNotes: text("default_notes").notNull(),
  density: text("density").$type<"compact" | "comfortable">().notNull(),
  showDashboardGreeting: boolean("show_dashboard_greeting").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull(),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  status: text("status").$type<"draft" | "sent" | "paid" | "overdue">().notNull(),
  issueDate: text("issue_date").notNull(),
  dueDate: text("due_date").notNull(),
  notes: text("notes"),
  currency: text("currency").notNull(),
  subtotal: doublePrecision("subtotal").notNull(),
  tax: doublePrecision("tax").notNull(),
  total: doublePrecision("total").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const invoiceItems = pgTable("invoice_items", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").references(() => invoices.id, { onDelete: "cascade" }).notNull(),
  description: text("description").notNull(),
  quantity: doublePrecision("quantity").notNull(),
  unitPrice: doublePrecision("unit_price").notNull(),
  lineTotal: doublePrecision("line_total").notNull(),
});
