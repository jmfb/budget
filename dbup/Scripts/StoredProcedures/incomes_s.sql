create or replace function budget.incomes_s (
	p_year int
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
	incomes.year = p_year
order by
	incomes.name asc;

end $$;
