create sequence budget.categories_id as int start with 1;

create table budget.categories (
	id int not null
		constraint df_categories_id
		default (nextval('budget.categories_id')),
	name text not null,
	constraint pk_categories primary key (id)
);

create unique index u_categories_name
	on budget.categories (name);

create sequence budget.incomes_id as int start with 1;

create table budget.incomes (
	id int not null
		constraint df_incomes_id
		default (nextval('budget.incomes_id')),
	year int not null,
	name text not null,
	amount money not null,
	weeks_interval int not null,
	constraint pk_incomes primary key (id)
);

create unique index u_incomes_year_name
	on budget.incomes (year, name);

create sequence budget.expenses_id as int start with 1;

create table budget.expenses (
	id int not null
		constraint df_expenses_id
		default (nextval('budget.expenses_id')),
	year int not null,
	name text not null,
	amount money not null,
	category_id int not null,
	months_interval int not null,
	is_distributed boolean not null,
	constraint pk_expenses primary key (id),
	constraint fk_expenses_category_id
		foreign key (category_id)
		references budget.categories (id)
);

create unique index u_expenses_year_name
	on budget.expenses (year, name);

create index nu_expenses_category_id_year
	on budget.expenses (category_id, year);

create sequence budget.pending_items_id as int start with 1;

create table budget.pending_items (
	id int not null
		constraint df_pending_items_id
		default (nextval('budget.pending_items_id')),
	name text not null,
	amount money not null,
	category_id int null,
	expense_id int null,
	income_id int null,
	constraint pk_pending_items primary key (id),
	constraint fk_pending_items_category_id
		foreign key (category_id)
		references budget.categories (id),
	constraint fk_pending_items_expense_id
		foreign key (expense_id)
		references budget.expenses (id),
	constraint fk_pending_items_income_id
		foreign key (income_id)
		references budget.incomes (id)
);

create index nu_pending_items_category_id
	on budget.pending_items (category_id);

create index nu_pending_items_expense_id
	on budget.pending_items (expense_id);

create index nu_pending_items_income_id
	on budget.pending_items (income_id);

create table budget.sources (
	id int not null,
	name text not null,
	constraint pk_sources primary key (id)
);

create unique index u_sources_name
	on budget.sources (name);

insert into budget.sources (id, name) values
	(0, 'Bank'),
	(1, 'Capital One');

create sequence budget.transactions_id as int start with 1;

create table budget.transactions (
	id int not null
		constraint df_transactions_id
		default (nextval('budget.transactions_id')),
	"date" date not null,
	source_id int not null,
	raw_text text not null,
	amount money not null,
	original_category text not null,
	description text not null,
	category_id int not null,
	note text not null,
	expense_id int null,
	income_id int null,
	constraint pk_transactions primary key (id),
	constraint fk_transactions_source_id
		foreign key (source_id)
		references budget.sources (id),
	constraint fk_transactions_category_id
		foreign key (category_id)
		references budget.categories (id),
	constraint fk_transactions_expense_id
		foreign key (expense_id)
		references budget.expenses (id),
	constraint fk_transactions_income_id
		foreign key (income_id)
		references budget.incomes (id)
);

create index nu_transactions_date
	on budget.transactions ("date");

create index nu_transactions_source_id
	on budget.transactions (source_id);

create index nu_transactions_category_id
	on budget.transactions (category_id);

create index nu_transactions_expense_id
	on budget.transactions (expense_id);

create index nu_transactions_income_id
	on budget.transactions (income_id);
