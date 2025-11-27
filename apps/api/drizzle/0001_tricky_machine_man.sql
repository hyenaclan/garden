ALTER TABLE "gardeners" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "gardeners" ADD COLUMN "last_login" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "gardeners" ADD COLUMN "external_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "gardeners" ADD COLUMN "external_provider" text NOT NULL;--> statement-breakpoint
ALTER TABLE "gardeners" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "gardeners" ADD CONSTRAINT "gardeners_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "gardeners" ADD CONSTRAINT "gardeners_external_id_unique" UNIQUE("external_id");