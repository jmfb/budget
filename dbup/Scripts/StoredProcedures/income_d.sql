create or replace function budget.income_d (
	p_id int
)
returns void
language plpgsql security definer
as $$ begin

update budget.pending_items as pending_items_update
set
	income_id = null
where
	pending_items_update.income_id = p_id;

update budget.transactions as transactions_update
set
	income_id = null
where
	transactions_update.income_id = p_id;

delete from budget.incomes as incomes_delete
where
	incomes_delete.id = p_id;

end $$;
