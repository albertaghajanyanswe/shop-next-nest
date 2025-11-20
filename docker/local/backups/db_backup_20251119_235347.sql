--
-- PostgreSQL database dump
--

\restrict 4d2mGbu3f7ydZagNZShaXCozuamSGgOMAzfPNJZbuhC5tLcVcfgGfjJtgguQ1IC

-- Dumped from database version 18.1 (Debian 18.1-1.pgdg13+2)
-- Dumped by pg_dump version 18.1 (Debian 18.1-1.pgdg13+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: EnumProductState; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EnumProductState" AS ENUM (
    'NEW',
    'USED'
);


ALTER TYPE public."EnumProductState" OWNER TO postgres;

--
-- Name: EnumSubscriptionType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EnumSubscriptionType" AS ENUM (
    'FREE',
    'ADVANCED',
    'ADVANCED_ANNUAL',
    'PREMIUM',
    'PREMIUM_ANNUAL'
);


ALTER TYPE public."EnumSubscriptionType" OWNER TO postgres;

--
-- Name: billing_period; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.billing_period AS ENUM (
    'MONTHLY',
    'YEARLY'
);


ALTER TYPE public.billing_period OWNER TO postgres;

--
-- Name: currency_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.currency_enum AS ENUM (
    'USD',
    'EUR',
    'RUB'
);


ALTER TYPE public.currency_enum OWNER TO postgres;

--
-- Name: order_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status AS ENUM (
    'PENDING',
    'SUCCEEDED',
    'FAILED',
    'CANCELLED',
    'REFUNDED',
    'EXPIRED',
    'PAUSED'
);


ALTER TYPE public.order_status OWNER TO postgres;

--
-- Name: payment_provider; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_provider AS ENUM (
    'STRIPE',
    'YOOKASSA'
);


ALTER TYPE public.payment_provider OWNER TO postgres;

--
-- Name: subscription_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.subscription_status AS ENUM (
    'ACTIVE',
    'CANCELLED',
    'EXPIRED',
    'PENDING',
    'PENDING_DOWNGRADE',
    'UPGRADING',
    'OVERDUE',
    'PAUSED',
    'TRIALING'
);


ALTER TYPE public.subscription_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _UserFavorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_UserFavorites" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_UserFavorites" OWNER TO postgres;

--
-- Name: billing_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.billing_info (
    id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    user_id text NOT NULL,
    service_id text NOT NULL,
    stripe_customer_id text,
    stripe_default_payment_method text,
    stripe_test_clock_id text
);


ALTER TABLE public.billing_info OWNER TO postgres;

--
-- Name: brand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brand (
    id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    name text NOT NULL,
    store_id text,
    category_id text
);


ALTER TABLE public.brand OWNER TO postgres;

--
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    title text NOT NULL,
    description text,
    store_id text
);


ALTER TABLE public.category OWNER TO postgres;

--
-- Name: color; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.color (
    id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    name text NOT NULL,
    value text NOT NULL,
    store_id text
);


ALTER TABLE public.color OWNER TO postgres;

--
-- Name: order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."order" (
    id text NOT NULL,
    stripe_payment_intent_id text,
    "totalPrice" double precision NOT NULL,
    provider public.payment_provider NOT NULL,
    status public.order_status DEFAULT 'PENDING'::public.order_status NOT NULL,
    external_id text,
    provider_meta jsonb,
    user_id text NOT NULL,
    subscription_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."order" OWNER TO postgres;

--
-- Name: order_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_item (
    id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    quantity integer NOT NULL,
    price double precision NOT NULL,
    order_id text,
    product_id text,
    store_id text
);


ALTER TABLE public.order_item OWNER TO postgres;

--
-- Name: plan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan (
    id text NOT NULL,
    plan_id public."EnumSubscriptionType" NOT NULL,
    description text NOT NULL,
    price double precision NOT NULL,
    period public.billing_period NOT NULL,
    store_limit integer,
    product_limit integer,
    is_popular boolean DEFAULT false NOT NULL,
    stripe_product_id text NOT NULL,
    stripe_price_id text,
    features text[],
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.plan OWNER TO postgres;

--
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    title text NOT NULL,
    description text,
    price double precision NOT NULL,
    "oldPrice" double precision,
    images text[],
    state public."EnumProductState" DEFAULT 'NEW'::public."EnumProductState" NOT NULL,
    "totalViews" integer DEFAULT 0 NOT NULL,
    "totalLikes" integer DEFAULT 0 NOT NULL,
    store_id text,
    category_id text,
    color_id text NOT NULL,
    user_id text,
    brand_id text NOT NULL,
    "isPublished" boolean DEFAULT true NOT NULL,
    "isBlocked" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.product OWNER TO postgres;

--
-- Name: review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review (
    id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    text text NOT NULL,
    rating integer NOT NULL,
    user_id text,
    product_id text,
    store_id text
);


ALTER TABLE public.review OWNER TO postgres;

--
-- Name: store; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store (
    id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    title text NOT NULL,
    description text,
    user_id text,
    image text,
    "isDefaultStore" boolean DEFAULT false NOT NULL,
    "isPublished" boolean DEFAULT true NOT NULL,
    "isBlocked" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.store OWNER TO postgres;

--
-- Name: subscription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscription (
    id text NOT NULL,
    stripe_subscription_id text,
    status public.subscription_status DEFAULT 'PENDING'::public.subscription_status NOT NULL,
    start_date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    end_date timestamp(3) without time zone,
    next_billing_date timestamp(3) without time zone,
    trial_end_at timestamp(3) without time zone,
    period public.billing_period NOT NULL,
    store_limit integer,
    product_limit integer,
    customer_id text,
    user_id text NOT NULL,
    plan_id public."EnumSubscriptionType" NOT NULL,
    next_plan_id public."EnumSubscriptionType",
    cancelled_at timestamp(3) without time zone,
    cancelled_reason jsonb,
    paused_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.subscription OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    email text NOT NULL,
    password text,
    name text DEFAULT 'Not Provided'::text NOT NULL,
    picture text,
    username text,
    stripe_account_id text
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Data for Name: _UserFavorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_UserFavorites" ("A", "B") FROM stdin;
cmi695cng0005qo3sotxtb0ls	cmi68ptnq0005mv3s0vw4omp9
\.


--
-- Data for Name: billing_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.billing_info (id, created_at, updated_at, user_id, service_id, stripe_customer_id, stripe_default_payment_method, stripe_test_clock_id) FROM stdin;
cmi68puka0009mv3sh0f6twq3	2025-11-19 16:52:12.154	2025-11-19 16:52:12.154	cmi68ptnq0005mv3s0vw4omp9	stripe	cus_TS8tgHMVnUg5vR	\N	clock_1SVEc3Aare3mmWwjxflFPsT3
\.


--
-- Data for Name: brand; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brand (id, created_at, updated_at, name, store_id, category_id) FROM stdin;
cmi694y5a0003qo3suddy8jse	2025-11-19 17:03:56.638	2025-11-19 17:03:56.638	test1	cmi68ptnv0007mv3s93hu2jbu	cmi694r6j0001qo3smtr73i73
\.


--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category (id, created_at, updated_at, title, description, store_id) FROM stdin;
cmi694r6j0001qo3smtr73i73	2025-11-19 17:03:47.611	2025-11-19 17:03:47.611	Note	n	cmi68ptnv0007mv3s93hu2jbu
\.


--
-- Data for Name: color; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.color (id, created_at, updated_at, name, value, store_id) FROM stdin;
cmi6931ez0001nb3sa8z9ket4	2025-11-19 17:02:27.563	2025-11-19 17:02:27.563	test1	#896161	cmi68ptnv0007mv3s93hu2jbu
\.


--
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."order" (id, stripe_payment_intent_id, "totalPrice", provider, status, external_id, provider_meta, user_id, subscription_id, created_at, updated_at) FROM stdin;
cmi68puta000amv3ss03ubvqk	\N	0	STRIPE	SUCCEEDED	\N	\N	cmi68ptnq0005mv3s0vw4omp9	cmi68puta000cmv3sy2qrf4dw	2025-11-19 16:52:12.479	2025-11-19 16:52:12.479
cmi6dpaxq0000oc3syp1cshnf	\N	1	STRIPE	PENDING	\N	\N	cmi68ptnq0005mv3s0vw4omp9	\N	2025-11-19 19:11:44.798	2025-11-19 19:11:44.798
cmi6dq2i20002oc3s1x6ddicb	\N	1	STRIPE	PENDING	\N	\N	cmi68ptnq0005mv3s0vw4omp9	\N	2025-11-19 19:12:20.522	2025-11-19 19:12:20.522
\.


--
-- Data for Name: order_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_item (id, created_at, updated_at, quantity, price, order_id, product_id, store_id) FROM stdin;
cmi6dpaxq0001oc3sad5inufz	2025-11-19 19:11:44.798	2025-11-19 19:11:44.798	1	1	cmi6dpaxq0000oc3syp1cshnf	cmi695cng0005qo3sotxtb0ls	cmi68ptnv0007mv3s93hu2jbu
cmi6dq2i20003oc3sqranoa67	2025-11-19 19:12:20.522	2025-11-19 19:12:20.522	1	1	cmi6dq2i20002oc3s1x6ddicb	cmi695cng0005qo3sotxtb0ls	cmi68ptnv0007mv3s93hu2jbu
\.


--
-- Data for Name: plan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan (id, plan_id, description, price, period, store_limit, product_limit, is_popular, stripe_product_id, stripe_price_id, features, created_at, updated_at) FROM stdin;
cmi68oahb0000mv3sdkcfu10s	FREE	Free plan with limited features	0	MONTHLY	1	10	f			{"1 Store","10 Products","Basic Support"}	2025-11-19 16:50:59.471	2025-11-19 16:50:59.471
cmi68oaz40001mv3sgqet594f	ADVANCED	Advanced monthly plan with more features	1	MONTHLY	5	150	t	prod_TS8snhzzaeGr2G		{"5 Stores","150 Products","Priority Support","Advanced Analytics"}	2025-11-19 16:51:00.112	2025-11-19 16:51:00.112
cmi68obb30002mv3szyj62yvd	ADVANCED_ANNUAL	Advanced annual plan with more features	10	YEARLY	5	150	t	prod_TS8svyYY9XOsP9		{"5 Stores","150 Products","Priority Support","Advanced Analytics"}	2025-11-19 16:51:00.543	2025-11-19 16:51:00.543
cmi68obn80003mv3sm7iqwfmm	PREMIUM	Premium monthly plan with all features	2	MONTHLY	-1	-1	f	prod_TS8svELrKDjhUk		{"Unlimited Stores","Unlimited Products","24/7 Support","All Analytics Features"}	2025-11-19 16:51:00.98	2025-11-19 16:51:00.98
cmi68obyd0004mv3sjvte4alw	PREMIUM_ANNUAL	Premium annual plan with all features	20	YEARLY	-1	-1	f	prod_TS8sxHkSYZ6uBZ		{"Unlimited Stores","Unlimited Products","24/7 Support","All Analytics Features"}	2025-11-19 16:51:01.381	2025-11-19 16:51:01.381
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (id, created_at, updated_at, title, description, price, "oldPrice", images, state, "totalViews", "totalLikes", store_id, category_id, color_id, user_id, brand_id, "isPublished", "isBlocked") FROM stdin;
cmi695cng0005qo3sotxtb0ls	2025-11-19 17:04:15.436	2025-11-19 19:43:07.915	ww	1	1	\N	{/server-uploads/products/1763571846357-carousel-aika.jpg}	NEW	35	1	cmi68ptnv0007mv3s93hu2jbu	cmi694r6j0001qo3smtr73i73	cmi6931ez0001nb3sa8z9ket4	cmi68ptnq0005mv3s0vw4omp9	cmi694y5a0003qo3suddy8jse	t	f
\.


--
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review (id, created_at, updated_at, text, rating, user_id, product_id, store_id) FROM stdin;
\.


--
-- Data for Name: store; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store (id, created_at, updated_at, title, description, user_id, image, "isDefaultStore", "isPublished", "isBlocked") FROM stdin;
cmi68ptnv0007mv3s93hu2jbu	2025-11-19 16:52:10.987	2025-11-19 16:52:10.987	Free Store	IMPORTANT: Only this store and his products should be shown in free plan	cmi68ptnq0005mv3s0vw4omp9	\N	t	t	f
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscription (id, stripe_subscription_id, status, start_date, end_date, next_billing_date, trial_end_at, period, store_limit, product_limit, customer_id, user_id, plan_id, next_plan_id, cancelled_at, cancelled_reason, paused_at, created_at, updated_at) FROM stdin;
cmi68puta000cmv3sy2qrf4dw	\N	ACTIVE	2025-11-19 16:52:12.479	\N	\N	\N	MONTHLY	1	10	cus_TS8tgHMVnUg5vR	cmi68ptnq0005mv3s0vw4omp9	FREE	\N	\N	\N	\N	2025-11-19 16:52:12.478	2025-11-19 16:52:12.479
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, created_at, updated_at, email, password, name, picture, username, stripe_account_id) FROM stdin;
cmi68ptnq0005mv3s0vw4omp9	2025-11-19 16:52:10.983	2025-11-19 16:52:10.983	test1@yopmail.com	$argon2id$v=19$m=65536,t=3,p=4$nvXe1ON1BhSaAFRvaSE84A$sq/KzGnVJCLoSic8bCMZ15WhVx6xJYcnnfZqrd7Spss	test1	\N	\N	\N
\.


--
-- Name: _UserFavorites _UserFavorites_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_UserFavorites"
    ADD CONSTRAINT "_UserFavorites_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: billing_info billing_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing_info
    ADD CONSTRAINT billing_info_pkey PRIMARY KEY (id);


--
-- Name: brand brand_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brand
    ADD CONSTRAINT brand_pkey PRIMARY KEY (id);


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- Name: color color_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.color
    ADD CONSTRAINT color_pkey PRIMARY KEY (id);


--
-- Name: order_item order_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_pkey PRIMARY KEY (id);


--
-- Name: order order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (id);


--
-- Name: plan plan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan
    ADD CONSTRAINT plan_pkey PRIMARY KEY (id);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- Name: review review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (id);


--
-- Name: store store_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store
    ADD CONSTRAINT store_pkey PRIMARY KEY (id);


--
-- Name: subscription subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription
    ADD CONSTRAINT subscription_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: _UserFavorites_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_UserFavorites_B_index" ON public."_UserFavorites" USING btree ("B");


--
-- Name: billing_info_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX billing_info_user_id_key ON public.billing_info USING btree (user_id);


--
-- Name: order_subscription_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX order_subscription_id_key ON public."order" USING btree (subscription_id);


--
-- Name: plan_plan_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX plan_plan_id_key ON public.plan USING btree (plan_id);


--
-- Name: user_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_email_key ON public."user" USING btree (email);


--
-- Name: user_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_username_key ON public."user" USING btree (username);


--
-- Name: _UserFavorites _UserFavorites_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_UserFavorites"
    ADD CONSTRAINT "_UserFavorites_A_fkey" FOREIGN KEY ("A") REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _UserFavorites _UserFavorites_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_UserFavorites"
    ADD CONSTRAINT "_UserFavorites_B_fkey" FOREIGN KEY ("B") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: billing_info billing_info_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing_info
    ADD CONSTRAINT billing_info_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: brand brand_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brand
    ADD CONSTRAINT brand_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: brand brand_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brand
    ADD CONSTRAINT brand_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.store(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: category category_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.store(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: color color_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.color
    ADD CONSTRAINT color_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.store(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_item order_item_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_order_id_fkey FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_item order_item_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_item order_item_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.store(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order order_subscription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.subscription(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order order_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product product_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brand(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: product product_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product product_color_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_color_id_fkey FOREIGN KEY (color_id) REFERENCES public.color(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: product product_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.store(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product product_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: review review_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: review review_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.store(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: review review_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store store_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store
    ADD CONSTRAINT store_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: subscription subscription_next_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription
    ADD CONSTRAINT subscription_next_plan_id_fkey FOREIGN KEY (next_plan_id) REFERENCES public.plan(plan_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: subscription subscription_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription
    ADD CONSTRAINT subscription_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.plan(plan_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: subscription subscription_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription
    ADD CONSTRAINT subscription_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 4d2mGbu3f7ydZagNZShaXCozuamSGgOMAzfPNJZbuhC5tLcVcfgGfjJtgguQ1IC

