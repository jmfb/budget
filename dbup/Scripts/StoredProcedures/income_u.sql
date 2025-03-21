create or replace function budget.income_u (
	p_id int,
	p_name text,
	p_amount money,
	p_weeks_interval int
)
returns void
language plpgsql security definer
as $$ begin

update budget.incomes as incomes_update
set
	name = p_name,
	amount = p_amount,
	weeks_interval = p_weeks_interval
where
	incomes_update.id = p_id;

end $$;
