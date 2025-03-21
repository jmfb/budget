create or replace function budget.income_i (
	p_year int,
	p_name text,
	p_amount money,
	p_weeks_interval int
)
returns table (
	id int
)
language plpgsql security definer
as $$ begin return query

insert into budget.incomes (
	year,
	name,
	amount,
	weeks_interval
) values (
	p_year,
	p_name,
	p_amount,
	p_weeks_interval
)
returning
	id;

end $$;
