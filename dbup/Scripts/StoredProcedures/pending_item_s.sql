create or replace function budget.pending_item_s (
	p_id int
)
returns table (
	id int,
	name text,
	amount money,
	category_id int,
	expense_id int,
	income_id int
)
language plpgsql security definer
as $$ begin return query

select
	pending_items.id,
	pending_items.name,
	pending_items.amount,
	pending_items.category_id,
	pending_items.expense_id,
	pending_items.income_id
from budget.pending_items as pending_items
where
	pending_items.id = p_id;

end $$;
