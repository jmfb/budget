create or replace function budget.transaction_d (
	p_id int
)
returns void
language plpgsql security definer
as $$ begin

delete from budget.transactions as transactions_delete
where
	transactions_delete.id = p_id;

end $$;
