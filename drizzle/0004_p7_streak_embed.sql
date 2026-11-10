ALTER TABLE "user_settings" ADD COLUMN "streak_public_id" text;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_streak_public_id_unique" UNIQUE("streak_public_id");