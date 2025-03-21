create or replace function budget.income_s (
	p_id int
)
returns table (
	id int,
	year int,
	name text,
	amount money,
	weeks_interval int
)
language plpgsql security definer
as $$ begin return query

select
	id,
	year,
	name,
	amount,
	weeks_interval
from budget.incomes as incomes
where
	incomes.id = p_id;

end $$;
