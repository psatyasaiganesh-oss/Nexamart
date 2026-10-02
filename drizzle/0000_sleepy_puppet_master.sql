CREATE TABLE `cart` (
	`user_id` text NOT NULL,
	`product_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	PRIMARY KEY(`user_id`, `product_id`)
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`order_id` text NOT NULL,
	`product_id` integer NOT NULL,
	`name` text NOT NULL,
	`image` text NOT NULL,
	`price` integer NOT NULL,
	`quantity` integer NOT NULL,
	PRIMARY KEY(`order_id`, `product_id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`address` text NOT NULL,
	`total` integer NOT NULL,
	`status` text DEFAULT 'Placed' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_orders_user` ON `orders` (`user_id`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`price` integer NOT NULL,
	`original_price` integer NOT NULL,
	`stock` integer NOT NULL,
	`rating` real NOT NULL,
	`reviews` integer NOT NULL,
	`image` text NOT NULL,
	`tag` text NOT NULL,
	CONSTRAINT "stock_nonnegative" CHECK("products"."stock" >= 0),
	CONSTRAINT "price_positive" CHECK("products"."price" > 0)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'customer' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `wishlist` (
	`user_id` text NOT NULL,
	`product_id` integer NOT NULL,
	PRIMARY KEY(`user_id`, `product_id`)
);
