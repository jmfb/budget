create or replace function budget.transaction_s (
	p_id int
)
returns table (
	id int,
	"date" date,
	source_id int,
	raw_text text,
	amount money,
	original_category text,
	category_id int,
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
	transactions.note,
	transactions.expense_id,
	transactions.income_id
from budget.transactions as transactions
where
	transactions.id = p_id;

end $$;
