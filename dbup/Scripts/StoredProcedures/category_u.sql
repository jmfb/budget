create or replace function budget.category_u (
	p_id int,
	p_name text
)
returns void
language plpgsql security definer
as $$ begin

update budget.categories as categories_update
set
	name = p_name
where
	categories_update.id = p_id;

end $$;
