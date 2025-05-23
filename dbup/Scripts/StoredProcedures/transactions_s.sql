create or replace function budget.transactions_s (
	p_start_date_inclusive date,
	p_end_date_exclusive date,
	p_skip int,
	p_take int
)
returns table (
	id int,
	"date" date,
	source_id int,
	raw_text text,
	amount money,
	original_category text,
	category_id int,
	description text,
	note text,
	expense_id int,
	income_id int
)
language plpgsql security definer
as $$ begin return query

select
	transactions.id,
	transactions."date",
	transactions.source_id,
	transactions.raw_text,
	transactions.amount,
	transactions.original_category,
	transactions.category_id,
	transactions.description,
	transactions.note,
	transactions.expense_id,
	transactions.income_id
from budget.transactions as transactions
where
	transactions."date" >= p_start_date_inclusive
	and transactions."date" < p_end_date_exclusive
order by
	transactions."date" asc,
	transactions.amount asc,
	transactions.id asc
limit p_take
offset p_skip;

end $$;
