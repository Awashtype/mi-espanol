CREATE TABLE `progress` (
	`user_id` text PRIMARY KEY NOT NULL,
	`progress_json` text NOT NULL,
	`version` integer NOT NULL,
	`updated_at` text NOT NULL
);
