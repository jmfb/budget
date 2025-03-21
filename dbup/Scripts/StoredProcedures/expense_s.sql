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
	id,
	year,
	name,
	amount,
	category_id,
	months_interval,
	is_distributed
from budget.expenses as expenses
where
	expenses.id = p_id;

end $$;
