create or replace function budget.category_d (
	p_id int
)
returns void
language plpgsql security definer
as $$ begin

delete from budget.categories as categories_delete
where
	categories_delete.id = p_id;

end $$;
