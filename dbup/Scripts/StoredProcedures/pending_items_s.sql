create or replace function budget.pending_items_s ()
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
order by
	pending_items.amount asc,
	pending_items.id asc;

end $$;
