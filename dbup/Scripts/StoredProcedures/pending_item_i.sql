create or replace function budget.pending_item_i (
	p_name text,
	p_amount money,
	p_category_id int,
	p_expense_id int,
	p_income_id int
)
returns table (
	id int
)
language plpgsql security definer
as $$ begin return query

insert into budget.pending_items (
	name,
	amount,
	category_id,
	expense_id,
	income_id
) values (
	p_name,
	p_amount,
	p_category_id,
	p_expense_id,
	p_income_id
)
returning
	id;

end $$;
