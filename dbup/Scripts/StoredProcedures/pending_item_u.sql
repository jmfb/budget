create or replace function budget.pending_item_u (
	p_id int,
	p_name text,
	p_amount money,
	p_category_id int,
	p_expense_id int,
	p_income_id int
)
returns void
language plpgsql security definer
as $$ begin

update budget.pending_items as pending_items_update
set
	name = p_name,
	amount = p_amount,
	category_id = p_category_id,
	expense_id = p_expense_id,
	income_id = p_income_id
where
	pending_items_update.id = p_id;

end $$;
