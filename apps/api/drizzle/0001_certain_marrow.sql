ALTER TABLE "gardeners" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "gardeners" ADD COLUMN "last_login" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "gardeners" ADD CONSTRAINT "gardeners_email_unique" UNIQUE("email");