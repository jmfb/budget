create or replace function budget.expense_d (
	p_id int
)
returns void
language plpgsql security definer
as $$ begin

update budget.pending_items as pending_items_update
set
	expense_id = null
where
	pending_items_update.expense_id = p_id;

update budget.transactions as transactions_update
set
	expense_id = null
where
	transactions_update.expense_id = p_id;

delete from budget.expenses as expenses_delete
where
	expenses_delete.id = p_id;

end $$;
