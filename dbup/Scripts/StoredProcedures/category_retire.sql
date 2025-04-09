create or replace function budget.category_retire (
	p_retire_id int,
	p_replacement_id int
)
returns void
language plpgsql security definer
as $$ begin

update budget.expenses as expenses_update
set
	category_id = p_replacement_id
where
	expenses_update.category_id = p_retire_id;

update budget.pending_items as pending_items_update
set
	category_id = p_replacement_id
where
	pending_items_update.category_id = p_retire_id;

update budget.transactions as transactions_update
set
	category_id = p_replacement_id
where
	transactions_update.category_id = p_retire_id;

delete from budget.categories as categories_delete
where
	categories_delete.id = p_id;

end $$;
