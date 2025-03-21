create or replace function budget.expense_s (
	p_id int
)
returns table (
	id int,
	year int,
	name text,
	amount money,
	category_id int,
	months_interval int,
	is_distributed boolean
)
language plpgsql security definer
as $$ begin return query

select
	expenses.id,
	expenses.year,
	expenses.name,
	expenses.amount,
	expenses.category_id,
	expenses.months_interval,
	expenses.is_distributed
from budget.expenses as expenses
where
	expenses.id = p_id;

end $$;
