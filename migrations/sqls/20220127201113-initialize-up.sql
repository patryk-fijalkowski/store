/* Replace with your SQL commands */

-- Table: public.Order-products


CREATE TABLE IF NOT EXISTS public."Order-products"
(
    id character varying COLLATE pg_catalog."default" NOT NULL,
    product_id character varying COLLATE pg_catalog."default" NOT NULL,
    order_id character varying COLLATE pg_catalog."default" NOT NULL,
    price character varying COLLATE pg_catalog."default" NOT NULL,
    stock_id character varying COLLATE pg_catalog."default" NOT NULL,
    children json,
    CONSTRAINT "Order-products_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Order-products"
    OWNER to postgres;

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
    shipping_id character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT "Orders_pkey" PRIMARY KEY (order_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Orders"
    OWNER to postgres;

-- Table: public.Products


CREATE TABLE IF NOT EXISTS public."Products"
(
    product_id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    stock_id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    stock_amount character varying(100) COLLATE pg_catalog."default" NOT NULL,
    price character varying(100) COLLATE pg_catalog."default",
    code character varying(100) COLLATE pg_catalog."default",
    name character varying(1000) COLLATE pg_catalog."default",
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


-- Table: public.Shippings


CREATE TABLE IF NOT EXISTS public."Shippings"
(
    shipping_id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    name character varying(100) COLLATE pg_catalog."default",
    cost character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT "Shippings_pkey" PRIMARY KEY (shipping_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Shippings"
    OWNER to postgres;

-- Table: public.History


CREATE TABLE IF NOT EXISTS public."History"
(
    date character varying(100) COLLATE pg_catalog."default" NOT NULL,
    order_id character varying(100) COLLATE pg_catalog."default" NOT NULL,
    event character varying(100) COLLATE pg_catalog."default" NOT NULL,
    data json
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."History"
    OWNER to postgres;