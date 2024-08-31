DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('ACTIVE', 'EXPIRED', 'ALL LOGOUT', 'FORCE LOGOUT', 'SELF LOGOUT', 'PASSWORD CHANGE', 'PASSWORD FORGOT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "devices" (
	"_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tokens" varchar(5000),
	"metadata" json NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(30) NOT NULL,
	"device_id" uuid,
	"token" varchar(3000) NOT NULL,
	"status" "status" NOT NULL,
	"metadata" json NOT NULL,
	"last_used_at" timestamp (6) with time zone NOT NULL,
	"expires_at" timestamp (6) with time zone NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_device_id_devices__id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tokens_index" ON "devices" USING btree ("tokens") WHERE tokens IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "token_index" ON "sessions" USING btree ("token") WHERE status='ACTIVE';