create or replace function budget.expense_u (
	p_id int,
	p_name text,
	p_amount money,
	p_category_id int,
	p_months_interval int,
	p_is_distributed boolean
)
returns void
language plpgsql security definer
as $$ begin

update budget.expenses as expenses_update
set
	name = p_name,
	amount = p_amount,
	category_id = p_category_id,
	months_interval = p_months_interval,
	is_distributed = p_is_distributed
where
	expenses_update.id = p_id;

end $$;
