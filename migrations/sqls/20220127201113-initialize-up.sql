/* Replace with your SQL commands */

-- Table: public.Orders

CREATE TABLE IF NOT EXISTS public."Orders"
(
    order_id bigint NOT NULL,
	order_date character varying(100) COLLATE pg_catalog."default" NOT NULL,
	modification_date character varying(100) COLLATE pg_catalog."default" NOT NULL,
    paid character varying(100) COLLATE pg_catalog."default",
    source character varying(200) COLLATE pg_catalog."default",
    status character varying(100) COLLATE pg_catalog."default" NOT NULL,
    shipping_cost character varying(100) COLLATE pg_catalog."default",
    shipping_name character varying(100) COLLATE pg_catalog."default",
    products json NOT NULL,
    CONSTRAINT "Orders_pkey" PRIMARY KEY (order_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Orders"
    OWNER to postgres;

-- Table: public.Products

CREATE TABLE IF NOT EXISTS public."Products"
(
    product_id character varying(100) NOT NULL,
    stock_id character varying(100) NOT NULL,
    stock_amount character varying(100) NOT NULL,
    price character varying(100),
    code character varying(100),
    name character varying(1000),
    children json,
    CONSTRAINT "Products_pkey" PRIMARY KEY (product_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Products"
    OWNER to postgres;

-- Table: public.Auctions

CREATE TABLE IF NOT EXISTS public."Auctions"
(
    product_id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    real_auction_id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    title character varying(1000) COLLATE pg_catalog."default",
    quantity character varying(100) COLLATE pg_catalog."default",
    sold character varying(100) COLLATE pg_catalog."default",
    start_time character varying(100) COLLATE pg_catalog."default" NOT NULL,
    end_time character varying(100) COLLATE pg_catalog."default",
    finished boolean,
    is_draft boolean,
    CONSTRAINT "Auctions_pkey" PRIMARY KEY (real_auction_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Auctions"
    OWNER to postgres;