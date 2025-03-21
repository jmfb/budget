create or replace function budget.pending_item_d (
	p_id int
)
returns void
language plpgsql security definer
as $$ begin

delete from budget.pending_items as pending_items_delete
where
	pending_items_delete.id = p_id;

end $$;
