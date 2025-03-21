CREATE TABLE IF NOT EXISTS "tiny_sumi_account" (
	"user_id" uuid NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "tiny_sumi_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tiny_sumi_favorite" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"memory_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tiny_sumi_memory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"date" timestamp with time zone,
	"location" varchar(255),
	"description" text,
	"tags" jsonb,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"created_by_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tiny_sumi_memory_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"memory_id" uuid NOT NULL,
	"url" varchar(1024) NOT NULL,
	"caption" varchar(255),
	"order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tiny_sumi_phone_location" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"accuracy" real,
	"device_name" varchar(255),
	"battery_level" real,
	"is_charging" boolean,
	"timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tiny_sumi_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tiny_sumi_task" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" varchar(50) DEFAULT 'todo' NOT NULL,
	"priority" varchar(50) DEFAULT 'medium' NOT NULL,
	"due_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"created_by_id" uuid,
	"assigned_to_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tiny_sumi_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255),
	"role" varchar(50) DEFAULT 'user' NOT NULL,
	"username" varchar(100),
	"password" varchar(255),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"last_seen" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "tiny_sumi_user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tiny_sumi_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "tiny_sumi_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tiny_sumi_account" ADD CONSTRAINT "tiny_sumi_account_user_id_tiny_sumi_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tiny_sumi_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tiny_sumi_favorite" ADD CONSTRAINT "tiny_sumi_favorite_user_id_tiny_sumi_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tiny_sumi_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tiny_sumi_favorite" ADD CONSTRAINT "tiny_sumi_favorite_memory_id_tiny_sumi_memory_id_fk" FOREIGN KEY ("memory_id") REFERENCES "public"."tiny_sumi_memory"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tiny_sumi_memory" ADD CONSTRAINT "tiny_sumi_memory_created_by_id_tiny_sumi_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."tiny_sumi_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tiny_sumi_memory_image" ADD CONSTRAINT "tiny_sumi_memory_image_memory_id_tiny_sumi_memory_id_fk" FOREIGN KEY ("memory_id") REFERENCES "public"."tiny_sumi_memory"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tiny_sumi_phone_location" ADD CONSTRAINT "tiny_sumi_phone_location_user_id_tiny_sumi_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tiny_sumi_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tiny_sumi_session" ADD CONSTRAINT "tiny_sumi_session_user_id_tiny_sumi_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tiny_sumi_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tiny_sumi_task" ADD CONSTRAINT "tiny_sumi_task_created_by_id_tiny_sumi_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."tiny_sumi_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tiny_sumi_task" ADD CONSTRAINT "tiny_sumi_task_assigned_to_id_tiny_sumi_user_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."tiny_sumi_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "tiny_sumi_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "tiny_sumi_session" USING btree ("user_id");
