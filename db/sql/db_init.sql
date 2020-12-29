 CREATE DATABASE list_palette;

CREATE USER list_palette_user; 

\password list_palette_user
\c list_palette
-- UNIQUE constraint should auto-generate an index on email, so I don't need to create one explicitely
CREATE TABLE users (
    user_id serial PRIMARY KEY, -- UNIQUE NOT NULL are implied
    email varchar(100) UNIQUE, 
    name varchar(100) CONSTRAINT username_not_null NOT NULL,
    password varchar(300) NOT NULL
);

-- item_id will be provided by front-end, but will be checked by db for uniqueness in combination with user_id. 
CREATE TABLE items (
    user_id integer NOT NULL REFERENCES users ON DELETE CASCADE,
    item_id integer NOT NULL,   -- 
    item_text varchar(4000) NOT NULL,
    item_status varchar(30),
    item_next integer, 
    item_child integer,
    PRIMARY KEY (user_id, item_id)  -- Implies UNIQUE for this pair (but not each one individually)
);

/**
I will be frequently querying for all the items associated with a specific user_id.  
Accordingly I will benefit from having an index.
REFERENCES (making user_id a foreign key) does not create this index automatically. 
I chose the HASH index because there is no useful significance to one user_id being > another. 
I only care whether I have the correct (==) user or not. 
**/
CREATE INDEX items_user_index ON items USING HASH (user_id);

GRANT ALL PRIVILEGES ON DATABASE list_palette TO list_palette_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO list_palette_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO list_palette_user;


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, email, name, password) FROM stdin;
1	default@listpalette.com	Default	$2b$10$ylAaPxOIN3az9hC6UPWc5OupHh4EIy.X0n5erl8F5RIAOO7nyNBty
2	kimlharrison@gmail.com	Kimberly Harrison	$2b$10$VQJRwlqVIblYESkqUuWUduvS2xMxEpU/bgrQ6Vay8E4Zh4n1jAOKW
3	mthielvoldt@gmail.com	Mike	$2b$10$4ZYHI0/Siy2oNxqS5pWW4e22fEdgdmh1edjWkpOgONvAgnAfSx/6m
\.


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items (user_id, item_id, item_text, item_status, item_next, item_child) FROM stdin;
2	0	Home	false	\N	2
2	57	Green Curry	false	\N	90
2	56	Meals	false	4	100
3	367	Waffles	false	\N	\N
2	58	Gumbo	false	57	\N
1	39	mozzarella	false	37	\N
2	1	Groceries	unchecked	\N	52
3	348	exdb category names	false	345	\N
1	5	tomato sauce	false	\N	\N
1	8	chuck roast	false	\N	\N
2	2	To-do	unchecked	1	49
1	10	red wine	false	\N	\N
1	37	parmesan	false	\N	\N
1	12	onions	false	\N	\N
1	43	chicken breast	false	\N	\N
1	13	carrots	false	12	\N
3	357	butter	false	332	\N
1	14	fresh rosemary	false	13	\N
1	15	fresh thyme	false	14	\N
1	41	Dairy	unchecked	34	38
1	16	mushrooms	false	15	\N
3	350	exdb answers	false	349	\N
1	11	Produce	false	9	17
1	17	celery	false	16	\N
3	344	Dec. Explanations	false	350	\N
1	18	olive oil	false	5	\N
1	3	Pot Roast	false	\N	11
1	9	Bev	false	6	10
1	7	beef broth	false	18	\N
1	6	Meats	false	7	8
3	339	Soap	unchecked	331	\N
1	0	Home	false	\N	2
1	1	Groceries	false	\N	52
1	23	bananas	false	\N	\N
1	38	butter	false	45	\N
1	24	salad	false	23	\N
1	45	eggs	false	39	\N
1	25	onions	false	24	\N
1	2	To-do	unchecked	1	49
1	26	broccoli	false	25	\N
1	21	Produce	false	20	26
1	27	juice	false	\N	\N
1	28	seltzer	false	27	\N
1	52	Today's shopping	unchecked	4	\N
1	29	beer	false	28	\N
1	20	Bev	unchecked	19	29
1	30	milk	false	\N	\N
3	342	Docker	false	341	\N
1	31	eggs	false	30	\N
1	32	cheese	false	31	\N
1	53	oilchange	false	\N	\N
1	22	cereal	false	\N	\N
3	340	To Learn	false	143	343
1	19	Dairy	false	22	32
1	50	this week	unchecked	\N	53
1	54	write	false	\N	\N
1	55	exercise. (lazer can wait)	false	54	\N
1	49	today	false	50	55
2	3	Pot Roast	false	\N	11
2	4	Staples	false	73	21
2	5	tomato sauce	false	\N	\N
2	6	Meats	false	7	8
2	7	beef broth	false	18	\N
2	8	chuck roast	false	\N	\N
2	9	Bev	false	6	10
2	10	red wine	false	\N	\N
2	11	Produce	false	9	17
2	12	onions	false	\N	\N
2	13	carrots	false	12	\N
1	46	vegetable oil	false	44	\N
2	14	fresh rosemary	false	13	\N
1	34	Meats	false	47	43
1	40	pasta sauce	false	\N	\N
2	15	fresh thyme	false	14	\N
2	16	mushrooms	false	15	\N
1	44	flour	false	36	\N
1	36	breadcrumbs	false	\N	\N
1	47	Cooking aisle	unchecked	40	46
1	4	Staples	false	33	21
3	356	black beans	false	\N	\N
1	33	Chicken Parm	false	3	41
2	17	celery	false	16	\N
2	18	olive oil	false	5	\N
2	19	Dairy	false	22	32
2	20	Beverages	unchecked	19	29
2	21	Produce	false	20	26
2	22	cereal	false	\N	\N
2	23	bananas	false	\N	\N
2	24	salad	false	23	\N
2	25	onions	false	24	\N
2	26	broccoli	false	25	\N
2	27	juice	false	\N	\N
2	28	seltzer	false	27	\N
2	29	beer	false	28	\N
2	30	milk	false	\N	\N
2	31	eggs	false	30	\N
2	32	cheese	false	31	\N
2	33	Chicken Parm	false	73	41
2	34	Meats	false	47	43
2	36	breadcrumbs	false	\N	\N
2	37	parmesan	false	\N	\N
2	38	butter	false	45	\N
2	39	mozzarella	false	37	\N
2	40	pasta sauce	false	\N	\N
2	41	Dairy	unchecked	34	38
2	43	chicken breast	false	\N	\N
2	44	flour	false	36	\N
2	45	eggs	false	39	\N
2	46	vegetable oil	false	44	\N
2	47	Cooking aisle	unchecked	40	46
2	49	today	false	50	55
2	50	this week	unchecked	\N	53
2	52	Today's shopping	unchecked	56	\N
2	53	oilchange	false	\N	\N
2	54	write	false	\N	\N
2	55	exercise. (lazer can wait)	false	54	\N
2	60	broccoli	false	61	\N
3	358	Sour cream	false	357	\N
3	361	ground beef	false	351	\N
3	362	lettuce	false	323	\N
3	363	cilantro	false	362	\N
3	364	little tomatoes	unchecked	363	\N
3	365	Onions	false	364	\N
3	360	taco seasoning	checked	359	\N
3	359	salsa	checked	353	\N
3	354	tomato paste	checked	355	\N
3	353	Cans	unchecked	339	354
3	355	corn	checked	356	\N
3	368	Ice cream	false	367	\N
3	369	Kimchi Noodle	false	368	\N
3	370	bread	false	369	\N
3	371	cereal	unchecked	370	\N
3	373	shredded cooked chickn	false	\N	\N
2	61	onions	false	62	\N
2	62	salad	false	63	\N
2	63	bananas	false	\N	\N
2	65	beer	false	66	\N
2	66	seltzer	false	67	\N
2	67	juice	false	\N	\N
3	33	Chicken Parm	false	415	41
2	69	cheese	false	70	\N
2	70	eggs	false	71	\N
2	71	milk	false	\N	\N
2	72	cereal	false	68	\N
2	73	Template	false	\N	83
2	74	Produce	false	\N	\N
2	75	broccoli	false	76	\N
2	76	onions	false	77	\N
2	77	salad	false	78	\N
2	78	bananas	false	\N	\N
2	79	Beverages	unchecked	74	\N
2	80	beer	false	81	\N
2	81	seltzer	false	82	\N
2	82	juice	false	\N	\N
2	83	Dairy	false	79	\N
2	84	cheese	false	85	\N
2	85	eggs	false	86	\N
2	86	milk	false	\N	\N
2	87	cereal	false	83	\N
2	88	Dairy	false	\N	\N
2	89	Beverages	unchecked	88	\N
2	90	Produce	false	89	\N
2	91	Green Chili	false	58	\N
2	93	Tuscan Sausage Stew	false	92	\N
2	92	Sausage Potato Stuff w/ Dill	false	91	\N
2	94	Spaghetti	false	93	\N
2	95	Asian Stir Fry	false	94	\N
2	96	Mediterranean Stew	false	95	\N
2	97	Bagged Salad	false	96	\N
2	98	Tuna Fish Cakes	false	97	\N
2	99	Frozen fish and Potatoes	false	98	\N
2	100	Roasted Chicken and Veg	false	99	\N
3	5	tomato sauce	false	\N	\N
3	6	Meats	false	7	8
3	7	beef broth	false	18	\N
3	8	chuck roast	false	\N	\N
3	9	Bev	false	6	10
3	10	red wine	false	\N	\N
3	11	Produce	false	9	17
3	12	onions	false	\N	\N
3	13	carrots	false	12	\N
3	14	fresh rosemary	false	13	\N
3	15	fresh thyme	false	14	\N
3	16	mushrooms	false	15	\N
3	17	celery	false	16	\N
3	18	olive oil	false	5	\N
3	4	Staples	unchecked	514	307
3	315	Waffles	false	\N	\N
3	316	Ice cream	false	315	\N
3	30	milk	false	\N	\N
3	34	Meats	false	47	43
3	36	breadcrumbs	false	\N	\N
3	37	parmesan	false	\N	\N
3	38	butter	false	45	\N
3	39	mozzarella	false	37	\N
3	40	pasta sauce	false	\N	\N
3	41	Dairy	unchecked	34	38
3	43	chicken breast	false	\N	\N
3	44	flour	false	36	\N
3	45	eggs	false	39	\N
3	46	vegetable oil	false	44	\N
3	47	Cooking aisle	unchecked	40	46
3	317	Kimchi Noodle	false	316	\N
3	318	bread	false	317	\N
3	22	cereal	unchecked	80	\N
3	2	To-do	unchecked	1	340
3	80	Meats	false	21	81
3	320	Meats	false	318	361
3	21	Produce	false	20	25
3	72	Sour cream	false	\N	\N
3	85	apples (gala organic)	false	24	\N
3	73	butter	false	72	\N
3	28	seltzer	unchecked	27	\N
3	71	Dairy	false	70	73
3	31	eggs	false	83	\N
3	55	exercise	unchecked	\N	\N
3	54	Shop	unchecked	55	\N
3	59	Wine	false	58	\N
3	0	Home	false	\N	168
3	3	Pot Roast	false	181	11
3	20	Bev	unchecked	19	59
3	94	butter	checked	121	\N
3	27	wee-wee juice	unchecked	\N	\N
3	78	Kimchi Noodle	false	79	\N
3	58	Rockstar	unchecked	28	\N
3	60	Tacos	false	490	75
3	1	Groceries	unchecked	402	438
3	24	salad	unchecked	\N	\N
3	68	ground beef	false	\N	\N
3	69	taco seasoning	false	67	\N
3	75	Cans	false	71	77
3	81	shredded cooked chickn	false	\N	\N
3	66	lettuce	false	63	\N
3	63	cilantro	false	62	\N
3	67	Meats	false	65	68
3	61	Onions	false	\N	\N
3	62	little tomatoes	unchecked	61	\N
3	25	onions	false	85	\N
3	70	salsa	false	69	\N
3	74	black beans	false	\N	\N
3	65	Produce	false	\N	66
3	77	tomato paste	false	64	\N
3	64	corn	false	74	\N
3	32	cheese	false	84	\N
3	83	yogurt -lemon honey blackberry	unchecked	30	\N
3	84	half n half	false	31	\N
3	19	Dairy	false	\N	32
3	79	bread	false	22	\N
3	95	Sour cream	checked	\N	\N
3	99	ground beef	checked	\N	\N
3	104	Onions	checked	\N	\N
3	96	salsa	checked	88	\N
3	89	Cans	checked	\N	90
3	103	little tomatoes	checked	104	\N
3	102	cilantro	checked	103	\N
3	101	lettuce	checked	102	\N
3	97	taco seasoning	checked	96	\N
3	92	black beans	checked	\N	\N
3	91	corn	checked	92	\N
3	90	tomato paste	unchecked	91	\N
3	88	hand soap	checked	\N	\N
3	93	Dairy	checked	89	125
3	115	salad	unchecked	114	\N
3	323	onions	false	324	\N
3	178	gear	false	177	\N
3	185	sweet onion	false	189	\N
3	179	Figure handwash	false	178	\N
3	143	Week	false	133	\N
3	186	5x zucchini	false	185	\N
3	173	Todo	unchecked	171	180
3	180	pack cooler	false	179	\N
3	202	Kimchi Noodle	false	236	\N
3	133	Today	unchecked	\N	344
3	182	rotini pasta	false	\N	\N
3	189	parsley tube	false	\N	\N
3	322	Produce	false	320	365
3	246	Breakfast pizza	false	33	261
3	181	Sausage marsala	unchecked	4	198
3	108	bread	false	107	\N
3	121	cheese	checked	95	\N
3	122	half n half	checked	94	\N
3	105	snack pretzles	false	106	\N
3	110	turkey lunch meat	unchecked	99	\N
3	106	Kimchi Noodle	false	97	\N
3	114	apples (gala organic)	checked	113	\N
3	113	bananas	checked	112	\N
3	112	onions red	false	101	\N
3	100	Produce	checked	98	115
3	109	cereal	checked	108	\N
3	120	wee-wee juice	checked	\N	\N
3	119	seltzer	checked	120	\N
3	118	Rockstar	unchecked	119	\N
3	125	milk	checked	124	\N
3	124	yogurt -lemon honey blackberry	checked	123	\N
3	123	eggs	checked	122	\N
3	111	shredded cooked chickn	checked	110	\N
3	107	hawiian bread	checked	105	\N
3	98	Meats	checked	93	111
3	161	Bev	false	154	162
3	128	"nix" in proficiencies	false	\N	\N
3	162	red wine	false	\N	\N
3	129	RESTFUL liteinvite	false	128	\N
3	139	RESTFUL liteinvite	false	140	\N
3	140	"nix" in proficiencies	false	\N	\N
3	165	beef broth	false	163	\N
3	166	olive oil	false	165	\N
3	167	tomato sauce	false	166	\N
3	159	carrots	checked	160	\N
3	156	mushrooms	checked	157	\N
3	155	celery	checked	156	\N
3	157	fresh thyme	checked	158	\N
3	160	onions	checked	\N	\N
3	158	fresh rosemary	checked	159	\N
3	154	Produce	checked	\N	155
3	164	chuck roast	unchecked	\N	\N
3	163	Meats	checked	161	164
3	126	Other	false	100	109
3	168	Trips	false	2	169
3	170	Gear	false	\N	\N
3	198	Meats	false	197	183
3	172	Water jug	false	\N	\N
3	169	LOTL	false	\N	173
3	183	spicy italian sausage -2lbs	false	\N	\N
3	200	heavy cream	false	\N	\N
3	171	Camp	false	170	174
3	174	Sunshower	false	172	\N
3	190	marsala wine	false	182	\N
3	175	download MP	false	\N	\N
3	191	white beans -2 cans	false	193	\N
3	193	diced italian tomatoes 2 cans	false	190	\N
3	197	Dairy	false	195	192
3	195	Produce	unchecked	191	187
3	177	clothes	false	175	\N
3	192	parm. cheese	unchecked	200	\N
3	187	4 red bell peppers	false	188	\N
3	220	mozarella	checked	221	\N
3	188	4 cups mushrooms (mixed)	false	186	\N
3	208	shredded cooked chickn	false	\N	\N
3	222	eggs	false	223	\N
3	228	4 red bell peppers	checked	211	\N
3	237	pizza dough 1lb	false	202	\N
3	219	Dairy	false	214	227
3	225	spicy italian sausage -2lbs	checked	208	\N
3	206	Meats	checked	\N	225
3	215	Wine	checked	216	\N
3	216	Rockstar	checked	217	\N
3	223	yogurt -lemon honey	checked	\N	\N
3	238	potato	checked	232	\N
3	232	parsley tube	checked	231	\N
3	221	half n half	checked	224	\N
3	218	wee-wee juice	checked	\N	\N
3	235	marsala wine	checked	234	\N
3	240	Trail mix	false	237	\N
3	227	heavy cream	checked	226	\N
3	224	milk	checked	222	\N
3	217	seltzer	checked	218	\N
3	226	parm. cheese	checked	220	\N
3	214	Bev	checked	209	215
3	236	rotini pasta	checked	235	\N
3	233	white beans -2 cans	checked	219	\N
3	234	diced italian tomatoes 2 cans	checked	233	\N
3	231	sweet onion	checked	230	\N
3	211	bananas	checked	213	\N
3	230	5x zucchini	checked	229	\N
3	229	4 cups mushrooms (mixed)	checked	228	\N
3	239	scallions	checked	238	\N
3	213	salad	checked	\N	\N
3	209	Produce	checked	206	239
3	247	Dairy	false	\N	254
3	250	Butter	false	\N	\N
3	251	Eggs	false	250	\N
3	252	Milk	false	251	\N
3	253	Parmesan	false	252	\N
3	254	Mozzarella	false	253	\N
3	255	Sausage	false	\N	\N
3	256	Bacon	false	255	\N
3	248	Meats	false	247	256
3	257	Dough kit	false	\N	\N
3	260	Green onions	false	\N	\N
3	275	salad	checked	\N	\N
3	271	Produce	checked	268	312
3	259	Produce	false	248	260
3	261	Dough kit	false	259	\N
3	439	Waffles	checked	455	\N
3	300	Bacon	checked	\N	\N
3	268	Meats	checked	267	300
3	280	wee-wee juice	checked	\N	\N
3	279	seltzer	checked	280	\N
3	278	Rockstar	checked	279	\N
3	374	Produce	false	372	401
3	264	Kimchi Noodle	checked	\N	\N
3	287	Tea (Irish/Earl)	checked	278	\N
3	276	Bev	checked	271	287
3	383	Dairy	false	378	394
3	283	half n half	checked	284	\N
3	286	milk	checked	\N	\N
3	302	Sour cream	checked	301	\N
3	281	Dairy	checked	276	313
3	267	cereal	checked	308	\N
3	308	Waffles	checked	309	\N
3	324	apples (gala organic)	false	325	\N
3	325	salad	unchecked	\N	\N
3	291	Potatoes	false	\N	\N
3	328	Rockstar	unchecked	329	\N
3	294	Bacon	false	\N	\N
3	293	Meats	false	292	294
3	295	Sour cream	false	\N	\N
3	329	seltzer	unchecked	330	\N
3	296	Cheddar	false	295	\N
3	330	wee-wee juice	unchecked	\N	\N
3	297	Butter	false	296	\N
3	292	Dairy	false	290	297
3	332	cheese	false	333	\N
3	298	Chives	false	291	\N
3	333	half n half	false	334	\N
3	299	Broccoli	false	298	\N
3	290	Produce	unchecked	\N	299
3	334	eggs	false	335	\N
3	335	yogurt -lemon honey blackberry	unchecked	336	\N
3	336	milk	false	\N	\N
3	403	grow mushies	false	404	\N
3	438	Today	unchecked	410	558
3	338	Sausage	false	\N	\N
3	405	firmware	false	\N	408
3	306	Ice cream	false	78	\N
3	307	Waffles	false	306	\N
3	436	Cheddar	unchecked	\N	\N
3	404	backpackers food	false	\N	\N
3	420	Bell peppers	false	\N	\N
3	341	GraphQL	false	\N	\N
3	409	dried foods	unchecked	405	403
3	343	Continuous Int.	false	342	\N
3	406	active pen	false	\N	\N
3	309	Ice cream	false	264	\N
3	301	Butter	checked	288	\N
3	288	Cheddar	checked	282	\N
3	282	cheese parm	checked	283	\N
3	284	eggs	checked	286	\N
3	416	Meats	false	\N	424
3	313	cheese	checked	302	\N
3	312	onions	checked	305	\N
3	305	Potatoes	checked	304	\N
3	304	Chives	checked	303	\N
3	303	Broccoli	checked	272	\N
3	272	onions red	checked	274	\N
3	274	apples (gala organic)	checked	275	\N
3	407	bluetooth headphones	false	406	\N
3	349	exdb multi-upload	false	348	\N
3	345	exdb aspect ratios	false	\N	\N
3	351	shredded cooked chickn	false	338	\N
3	331	Dairy	false	326	358
3	326	Bev	unchecked	322	328
3	421	Onion	false	420	\N
3	375	onions	false	376	\N
3	376	apples (gala organic)	false	377	\N
3	377	salad	unchecked	\N	\N
3	378	Bev	unchecked	374	379
3	379	Wine	false	380	\N
3	380	Rockstar	unchecked	381	\N
3	381	seltzer	unchecked	382	\N
3	382	wee-wee juice	unchecked	\N	\N
3	384	cheese	false	385	\N
3	385	half n half	false	386	\N
3	386	eggs	false	387	\N
3	387	yogurt -lemon honey blackberry	unchecked	388	\N
3	388	milk	false	\N	\N
3	389	Cans	false	383	390
3	390	tomato paste	false	391	\N
3	391	corn	false	392	\N
3	392	black beans	false	\N	\N
3	393	butter	false	384	\N
3	394	Sour cream	false	393	\N
3	395	salsa	false	389	\N
3	396	taco seasoning	false	395	\N
3	397	ground beef	false	373	\N
3	398	lettuce	false	375	\N
3	399	cilantro	false	398	\N
3	400	little tomatoes	unchecked	399	\N
3	401	Onions	false	400	\N
3	372	Meats	false	371	397
3	411	Produce	false	\N	\N
3	408	linux battery manager	false	407	\N
3	402	Ideas	unchecked	\N	409
3	418	Cans	false	417	425
3	412	Cans	false	411	\N
3	419	Produce	false	418	422
3	422	Garlic	false	421	\N
3	423	Pinto beans	false	\N	\N
3	413	Dairy	false	412	\N
3	424	ground beef	false	\N	\N
3	414	Meats	false	413	\N
3	262	Twice baker	false	\N	293
3	429	chilli powder	false	\N	\N
3	431	coriander	false	430	\N
3	432	cayenne	false	431	\N
3	433	cumin	false	432	\N
3	430	oregano	false	429	\N
3	427	Tomato sauce	false	423	\N
3	437	Sour Cream	false	436	\N
3	425	Kidney beans	false	426	\N
3	426	Diced tomatos	false	427	\N
3	417	Dairy	false	416	437
3	434	Spices	unchecked	419	433
3	428	beef broth	false	434	\N
3	415	Chilli	false	3	428
3	410	New	unchecked	246	414
3	453	seltzer	unchecked	454	\N
3	542	celery	checked	541	\N
3	540	collards 1lb	checked	539	\N
3	501	Produce	false	500	513
3	513	potatoes	false	509	\N
3	509	collards 1lb	false	508	\N
3	541	onion-ylo 2x	checked	540	\N
3	553	mushrooms	checked	543	\N
3	516	brussels	false	\N	\N
3	543	cranberries	checked	542	\N
3	517	mushrooms	false	516	\N
3	557	loose-leaf tea	checked	556	\N
3	515	Produce	false	\N	518
3	442	bread	checked	441	\N
3	441	Kimchi Noodle	checked	439	\N
3	548	heavy cream	checked	489	\N
3	458	eggs	checked	460	\N
3	554	brussels	checked	553	\N
3	446	Produce	checked	\N	554
3	449	salad	unchecked	\N	\N
3	521	beef	false	\N	\N
3	450	Bev	unchecked	536	488
3	523	sour cream	false	\N	\N
3	504	celery	false	505	\N
3	460	milk	checked	\N	\N
3	522	Dairy	false	520	524
3	538	bacon	checked	\N	\N
3	536	Meats	checked	446	538
3	489	butter	checked	458	\N
3	549	sour cream	checked	548	\N
3	455	Dairy	checked	450	549
3	454	wee-wee juice	checked	\N	\N
3	488	Yerba	checked	453	\N
3	480	Tums	checked	442	\N
3	526	worchestershire	false	522	\N
3	544	egg noodles	checked	535	\N
3	528	egg noodles	false	527	\N
3	547	worchestershire	checked	546	\N
3	518	onion	false	529	\N
3	529	garlic	false	517	\N
3	506	butter	false	498	\N
3	498	eggs	false	\N	\N
3	519	sherry	false	526	\N
3	520	Meats	false	515	521
3	535	Stuffing cubes	false	534	\N
3	527	flour	false	519	\N
3	505	cranberries	false	\N	\N
3	524	heavy cream	false	530	\N
3	530	butter	false	523	\N
3	533	apple cider vinegar	checked	525	\N
3	539	potatoes	false	449	\N
3	508	onion-ylo 2x	unchecked	504	\N
3	534	roasting bag	checked	533	\N
3	532	turkey	false	510	\N
3	510	bacon	false	\N	\N
3	531	Meats	false	501	532
3	511	apple cider vinegar	false	512	\N
3	500	Dairy	unchecked	\N	506
3	507	Stuffing cubes	false	531	\N
3	512	roasting bag	false	507	\N
3	558	hand soap	checked	557	\N
3	546	sherry	checked	544	\N
3	555	beef broth	false	528	\N
3	514	Stroganoff	false	60	555
3	556	beef broth	false	547	\N
3	559	twine	false	511	\N
3	490	Turkey dinner	unchecked	262	559
3	525	sandwiches	checked	480	\N
\.
