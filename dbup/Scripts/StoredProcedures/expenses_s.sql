create or replace function budget.expenses_s (
	p_year int
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
inner join budget.categories as categories
	on categories.id = expenses.category_id
where
	expenses.year = p_year
order by
	categories.name asc,
	expenses.name asc;

end $$;
