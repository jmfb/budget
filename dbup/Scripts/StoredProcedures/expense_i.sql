create or replace function budget.expense_i (
	p_year int,
	p_name text,
	p_amount money,
	p_category_id int,
	p_months_interval int,
	p_is_distributed boolean
)
returns table (
	id int
)
language plpgsql security definer
as $$ begin return query

insert into budget.expenses (
	year,
	name,
	amount,
	category_id,
	months_interval,
	is_distributed
) values (
	p_year,
	p_name,
	p_amount,
	p_category_id,
	p_months_interval,
	p_is_distributed
)
returning
	id;

end $$;
